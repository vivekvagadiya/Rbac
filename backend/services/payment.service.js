import stripe from "../config/stripe.js";
import Order from "../models/order.model.js";
import InventoryService from "./inventory.service.js";
import mongoose from "mongoose";

/**
 * Payment Service - Centralized payment logic with proper state management
 *
 * Handles all payment operations with proper validation, error handling,
 * and integration with inventory management
 */

class PaymentService {
  /**
   * Create a Stripe checkout session with proper order creation
   * @param {Array} items - Array of product items
   * @param {string} userId - User ID
   * @param {mongoose.ClientSession} [session] - MongoDB transaction session
   * @returns {Promise<{success: boolean, data: Object, error: string}>}
   */
  static async createCheckoutSession(items, userId, session = null) {
    const checkoutSession = await mongoose.startSession();

    try {
      await checkoutSession.startTransaction();

      if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error("Invalid user ID");
      }

      // Validate stock availability
      const stockValidation =
        await InventoryService.validateStockAvailability(items);
      if (!stockValidation.valid) {
        throw new Error(stockValidation.message);
      }

      // Calculate total amount
      const totalAmount = items.reduce(
        (total, item) => total + item.price * item.quantity,
        0,
      );

      // Prepare order products
      const orderProducts = items.map((item) => ({
        product: item.product,
        quantity: item.quantity,
        price: item.price,
      }));

      // Create order first
      const order = new Order({
        user: userId,
        products: orderProducts,
        totalAmount: totalAmount,
        status: "pending",
        paymentStatus: "PENDING",
        createdBy: userId,
        metadata: {
          source: "stripe_checkout",
          itemCount: items.length,
        },
      });

      await order.save({ session: checkoutSession });

      // Create Stripe checkout session
      const stripeSession = await stripe.checkout.sessions.create(
        {
          payment_method_types: ["card"],
          line_items: items.map((item) => ({
            price_data: {
              currency: "inr",
              product_data: {
                name: item.name,
                description: item.description || "",
                metadata: {
                  category: item.category || "",
                  productId: item.product,
                },
              },
              unit_amount: Math.round(item.price * 100),
            },
            quantity: item.quantity,
          })),
          mode: "payment",
          success_url: `${process.env.CLIENT_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${process.env.CLIENT_URL}/payment/cancel?session_id={CHECKOUT_SESSION_ID}`,
          metadata: {
            orderId: order._id.toString(),
            userId: userId.toString(),
          },
          customer_email: undefined, // Can be populated if user email is available
          billing_address_collection: "auto",
          shipping_address_collection: {
            allowed_countries: ["US", "CA", "GB", "IN"], // Configure as needed
          },
        },
        {
          idempotencyKey: `checkout_${order._id}_${Date.now()}`, // Prevent duplicate sessions
        },
      );

      // Update order with Stripe session IDs
      order.stripeSessionId = stripeSession.id;
      order.stripePaymentIntentId = stripeSession.payment_intent;
      await order.save({ session: checkoutSession });

      // Deduct stock (only after successful Stripe session creation)
      const stockDeduction = await InventoryService.deductOrderStock(
        orderProducts,
        checkoutSession,
      );

      if (!stockDeduction.success) {
        throw new Error(`Stock deduction failed: ${stockDeduction.message}`);
      }

      await checkoutSession.commitTransaction();

      return {
        success: true,
        data: {
          url: stripeSession.url,
          sessionId: stripeSession.id,
          orderId: order._id,
          paymentIntentId: stripeSession.payment_intent,
        },
      };
    } catch (error) {
      await checkoutSession.abortTransaction();
      console.error("Error in createCheckoutSession:", error);

      return {
        success: false,
        error: error.message || "Failed to create checkout session",
      };
    } finally {
      await checkoutSession.endSession();
    }
  }

  /**
   * Verify payment session status (for frontend queries)
   * @param {string} sessionId - Stripe session ID
   * @returns {Promise<{success: boolean, data: Object, error: string}>}
   */
  static async verifyPaymentSession(sessionId) {
    try {
      if (!sessionId) {
        throw new Error("Session ID is required");
      }

      // Retrieve session from Stripe
      const stripeSession = await stripe.checkout.sessions.retrieve(sessionId);

      if (!stripeSession) {
        throw new Error("Payment session not found");
      }

      // Find associated order
      const order = await Order.findOne({ stripeSessionId: sessionId })
        .populate("user", "name email")
        .populate("products.product", "name price");

      if (!order) {
        throw new Error("Order not found");
      }

      return {
        success: true,
        data: {
          session: stripeSession,
          order: order,
          paymentStatus: stripeSession.payment_status,
          isCompleted: stripeSession.payment_status === "paid",
          orderStatus: order.status,
          paymentStatusDb: order.paymentStatus,
        },
      };
    } catch (error) {
      console.error("Error in verifyPaymentSession:", error);

      return {
        success: false,
        error: error.message || "Failed to verify payment session",
      };
    }
  }

  /**
   * Handle payment cancellation (frontend-facing, no inventory changes)
   * @param {string} sessionId - Stripe session ID
   * @returns {Promise<{success: boolean, data: Object, error: string}>}
   */
  static async handlePaymentCancellation(sessionId) {
    try {
      // Retrieve Stripe session
      const stripeSession = await stripe.checkout.sessions.retrieve(sessionId);

      if (!stripeSession) {
        throw new Error("Payment session not found");
      }

      // Find order
      const order = await Order.findOne({
        stripeSessionId: sessionId,
      })
        .populate("user", "name email")
        .populate("products.product", "name price");

      if (!order) {
        throw new Error("Order not found");
      }

      let orderUpdated = false;

      // Only cancel unpaid pending orders
      if (
        order.status === "pending" &&
        stripeSession.payment_status !== "paid"
      ) {
        // FIRST update order state
        order.status = "cancelled";
        order.paymentStatus = "FAILED";

        order.metadata.set("cancelledBy", "user");
        order.metadata.set("cancelledAt", new Date().toISOString());

        await order.save();

        // THEN restore stock safely
        if (!order.stockRestored) {
          const stockRestore = await InventoryService.restoreOrderStock(
            order._id,
          );

          if (!stockRestore.success) {
            throw new Error(stockRestore.message || "Failed to restore stock");
          }
        }

        orderUpdated = true;
      }

      return {
        success: true,
        data: {
          session: stripeSession,
          order,
          paymentStatus: stripeSession.payment_status,
          isCancelled: order.status === "cancelled",
          orderUpdated,
          note: order.stockRestored
            ? "Stock restored successfully"
            : "Order already processed",
        },
      };
    } catch (error) {
      console.error("Error in handlePaymentCancellation:", error);

      return {
        success: false,
        error: error.message || "Failed to handle payment cancellation",
      };
    }
  }

  /**
   * Get payment status for an order
   * @param {string} orderId - Order ID
   * @returns {Promise<{success: boolean, data: Object, error: string}>}
   */
  static async getOrderPaymentStatus(orderId) {
    try {
      if (!orderId || !mongoose.Types.ObjectId.isValid(orderId)) {
        throw new Error("Invalid order ID");
      }

      const order = await Order.findById(orderId)
        .select(
          "status paymentStatus stripeSessionId stripePaymentIntentId webhookProcessed stockRestored",
        )
        .populate("user", "name email");

      if (!order) {
        throw new Error("Order not found");
      }

      let stripeSession = null;
      if (order.stripeSessionId) {
        try {
          stripeSession = await stripe.checkout.sessions.retrieve(
            order.stripeSessionId,
          );
        } catch (error) {
          console.warn("Failed to retrieve Stripe session:", error.message);
        }
      }

      return {
        success: true,
        data: {
          order: order,
          stripeSession: stripeSession,
          paymentStatus: {
            database: order.paymentStatus,
            stripe: stripeSession?.payment_status || "unknown",
            isConsistent: stripeSession
              ? (order.paymentStatus === "PAID" &&
                  stripeSession.payment_status === "paid") ||
                (order.paymentStatus === "PENDING" &&
                  stripeSession.payment_status !== "paid") ||
                (order.paymentStatus === "FAILED" &&
                  stripeSession.payment_status === "unpaid")
              : null,
          },
          stockManagement: {
            stockRestored: order.stockRestored,
            webhookProcessed: order.webhookProcessed,
          },
        },
      };
    } catch (error) {
      console.error("Error in getOrderPaymentStatus:", error);

      return {
        success: false,
        error: error.message || "Failed to get order payment status",
      };
    }
  }

  /**
   * Create refund for a payment
   * @param {string} orderId - Order ID
   * @param {number} amount - Refund amount (optional, defaults to full refund)
   * @param {string} reason - Refund reason
   * @returns {Promise<{success: boolean, data: Object, error: string}>}
   */
  static async createRefund(
    orderId,
    amount = null,
    reason = "Customer requested refund",
  ) {
    const refundSession = await mongoose.startSession();

    try {
      await refundSession.startTransaction();

      const order = await Order.findById(orderId)
        .select(
          "paymentStatus stripePaymentIntentId totalAmount refundAmount isRefunded",
        )
        .session(refundSession);

      if (!order) {
        throw new Error("Order not found");
      }

      if (order.paymentStatus !== "PAID") {
        throw new Error("Cannot refund unpaid order");
      }

      if (order.isRefunded) {
        throw new Error("Order already refunded");
      }

      if (!order.stripePaymentIntentId) {
        throw new Error("No payment intent found for this order");
      }

      // Determine refund amount
      const refundAmountCents = amount
        ? Math.round(amount * 100)
        : Math.round(order.totalAmount * 100);

      // Create refund in Stripe
      const refund = await stripe.refunds.create({
        payment_intent: order.stripePaymentIntentId,
        amount: refundAmountCents,
        reason: "requested_by_customer",
        metadata: {
          orderId: orderId.toString(),
          reason: reason,
        },
      });

      // Update order with refund information
      order.isRefunded = true;
      order.refundAmount = refundAmountCents / 100;
      order.refundReason = reason;
      order.refundId = refund.id;
      order.paymentStatus = "REFUNDED";

      await order.save({ session: refundSession });

      await refundSession.commitTransaction();

      return {
        success: true,
        data: {
          refund: refund,
          order: order,
          refundAmount: refundAmountCents / 100,
        },
      };
    } catch (error) {
      await refundSession.abortTransaction();
      console.error("Error in createRefund:", error);

      return {
        success: false,
        error: error.message || "Failed to create refund",
      };
    } finally {
      await refundSession.endSession();
    }
  }

  /**
   * Validate payment state transition
   * @param {string} currentStatus - Current payment status
   * @param {string} newStatus - New payment status
   * @returns {boolean}
   */
  static validatePaymentStateTransition(currentStatus, newStatus) {
    const validTransitions = {
      PENDING: ["PAID", "FAILED"],
      PAID: ["REFUNDED"],
      FAILED: ["PENDING"], // Allow retry
      REFUNDED: [], // Final state
    };

    return validTransitions[currentStatus]?.includes(newStatus) || false;
  }

  /**
   * Validate order state transition
   * @param {string} currentStatus - Current order status
   * @param {string} newStatus - New order status
   * @returns {boolean}
   */
  static validateOrderStateTransition(currentStatus, newStatus) {
    const validTransitions = {
      pending: ["confirmed", "cancelled"],
      confirmed: ["shipped", "cancelled"],
      shipped: ["delivered"],
      delivered: [], // Final state
      cancelled: [], // Final state
    };

    return validTransitions[currentStatus]?.includes(newStatus) || false;
  }
}

export default PaymentService;
