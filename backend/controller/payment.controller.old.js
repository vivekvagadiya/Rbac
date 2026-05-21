import PaymentService from '../services/payment.service.js';
import WebhookService from '../services/webhook.service.js';

/**
 * Create Stripe checkout session with proper order creation and stock management
 */
export const createCheckoutSession = async (req, res) => {
  try {
    const { items } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Items array is required'
      });
    }

    // Validate each item
    for (const item of items) {
      if (!item.product || !item.name || !item.price || !item.quantity) {
        return res.status(400).json({
          success: false,
          message: 'Each item must contain product, name, price, and quantity'
        });
      }
    }

    const result = await PaymentService.createCheckoutSession(items, req.user._id);

    if (result.success) {
      res.status(200).json({
        success: true,
        data: result.data
      });
    } else {
      res.status(400).json({
        success: false,
        message: result.error
      });
    }

  } catch (error) {
    console.error('Error in createCheckoutSession:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create checkout session'
    });
  }
};

/**
 * Handle Stripe webhooks with proper idempotency and event processing
 */
export const handleWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig) {
    return res.status(400).json({
      success: false,
      message: 'Stripe signature is required'
    });
  }

  if (!endpointSecret) {
    console.error('STRIPE_WEBHOOK_SECRET is not configured');
    return res.status(500).json({
      success: false,
      message: 'Webhook endpoint not configured'
    });
  }

  try {
    const result = await WebhookService.processWebhook(req.body, sig, endpointSecret);

    if (result.success) {
      res.status(200).json({
        success: true,
        processed: result.processed,
        message: result.message || 'Webhook processed successfully',
        eventType: result.eventType
      });
    } else {
      res.status(400).json({
        success: false,
        message: result.error || 'Webhook processing failed'
      });
    }

  } catch (error) {
    console.error('Webhook processing error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during webhook processing'
    });
  }
};

async function handleSuccessfulPayment(session) {
  try {
    const orderId = session.metadata.orderId;
    
    // Update order status
    await Order.findByIdAndUpdate(orderId, {
      status: 'confirmed',
      paymentStatus: 'PAID',
      updatedBy: null // System update
    });

    console.log(`Payment successful for order ${orderId}`);
  } catch (error) {
    console.error('Error handling successful payment:', error);
  }
}

async function handleCancelledPayment(session) {
  try {
    const orderId = session.metadata.orderId;
    
    // Get order details to restore stock
    const order = await Order.findById(orderId);
    
    if (order) {
      // Restore stock for cancelled payment
      await Promise.all(
        order.products.map((item) =>
          Product.updateOne(
            { _id: item.product },
            { $inc: { stock: item.quantity } },
          ),
        ),
      );
      console.log(`Stock restored for cancelled payment order ${orderId}`);
    }
    
    // Update order status
    await Order.findByIdAndUpdate(orderId, {
      status: 'cancelled',
      paymentStatus: 'FAILED',
      updatedBy: null // System update
    });

    console.log(`Payment cancelled for order ${orderId}`);
  } catch (error) {
    console.error('Error handling cancelled payment:', error);
  }
}

async function handleExpiredSession(session) {
  try {
    const orderId = session.metadata.orderId;
    
    // Get order details to restore stock
    const order = await Order.findById(orderId);
    
    if (order) {
      // Restore stock for expired payment
      await Promise.all(
        order.products.map((item) =>
          Product.updateOne(
            { _id: item.product },
            { $inc: { stock: item.quantity } },
          ),
        ),
      );
      console.log(`Stock restored for expired payment order ${orderId}`);
    }
    
    // Update order status
    await Order.findByIdAndUpdate(orderId, {
      status: 'cancelled',
      paymentStatus: 'FAILED',
      updatedBy: null // System update
    });

    console.log(`Payment expired for order ${orderId}`);
  } catch (error) {
    console.error('Error handling expired session:', error);
  }
}

async function handleFailedPayment(paymentIntent) {
  try {
    // Find order by stripe session ID
    const order = await Order.findOne({ stripeSessionId: paymentIntent.id });
    
    if (order) {
      // Restore stock for failed payment
      await Promise.all(
        order.products.map((item) =>
          Product.updateOne(
            { _id: item.product },
            { $inc: { stock: item.quantity } },
          ),
        ),
      );
      console.log(`Stock restored for failed payment order ${order._id}`);
      
      await Order.findByIdAndUpdate(order._id, {
        status: 'cancelled',
        paymentStatus: 'FAILED',
        updatedBy: null // System update
      });

      console.log(`Payment failed for order ${order._id}`);
    }
  } catch (error) {
    console.error('Error handling failed payment:', error);
  }
}

/**
 * Cancel payment session (frontend-facing, no inventory changes)
 * Stock restoration is handled by webhooks to prevent race conditions
 */
export const cancelPaymentSession = async (req, res) => {
  try {
    const { sessionId } = req.params;

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        message: 'Session ID is required'
      });
    }

    const result = await PaymentService.handlePaymentCancellation(sessionId);

    if (result.success) {
      res.status(200).json({
        success: true,
        data: result.data
      });
    } else {
      res.status(400).json({
        success: false,
        message: result.error
      });
    }

  } catch (error) {
    console.error('Error in cancelPaymentSession:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to cancel payment session'
    });
  }
};

/**
 * Verify payment session status (for frontend queries)
 */
export const verifyPaymentSession = async (req, res) => {
  try {
    const { sessionId } = req.params;

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        message: 'Session ID is required'
      });
    }

    const result = await PaymentService.verifyPaymentSession(sessionId);

    if (result.success) {
      res.status(200).json({
        success: true,
        data: result.data
      });
    } else {
      res.status(400).json({
        success: false,
        message: result.error
      });
    }

  } catch (error) {
    console.error('Error in verifyPaymentSession:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to verify payment session'
    });
  }
};
