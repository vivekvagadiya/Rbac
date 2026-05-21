import stripe from '../config/stripe.js';
import Order from '../models/order.model.js';
import PaymentService from './payment.service.js';
import InventoryService from './inventory.service.js';
import mongoose from 'mongoose';

/**
 * Webhook Service - Handles Stripe webhooks with proper idempotency and event mapping
 * 
 * Processes Stripe webhook events with proper validation, error handling,
 * and integration with payment and inventory services
 */

class WebhookService {
  /**
   * Process incoming Stripe webhook
   * @param {string} body - Raw request body
   * @param {string} signature - Stripe signature header
   * @param {string} endpointSecret - Webhook endpoint secret
   * @returns {Promise<{success: boolean, processed: boolean, error: string}>}
   */
  static async processWebhook(body, signature, endpointSecret) {
    const webhookSession = await mongoose.startSession();
    
    try {
      await webhookSession.startTransaction();

      // Verify webhook signature
      const event = stripe.webhooks.constructEvent(body, signature, endpointSecret);
      
      console.log(`Processing webhook event: ${event.type} - ID: ${event.id}`);

      // Check for duplicate webhook processing
      const duplicateCheck = await this.checkDuplicateWebhook(event.id, webhookSession);
      if (duplicateCheck.isDuplicate) {
        console.log(`Duplicate webhook detected: ${event.id}, skipping...`);
        await webhookSession.abortTransaction();
        return {
          success: true,
          processed: false,
          message: 'Duplicate webhook - already processed'
        };
      }

      // Process the event based on type
      const result = await this.handleWebhookEvent(event, webhookSession);
      
      if (result.success) {
        // Mark webhook as processed
        await this.markWebhookProcessed(event.id, event.type, webhookSession);
        await webhookSession.commitTransaction();
        
        console.log(`Successfully processed webhook: ${event.type}`);
        return {
          success: true,
          processed: true,
          message: 'Webhook processed successfully',
          eventType: event.type
        };
      } else {
        await webhookSession.abortTransaction();
        return {
          success: false,
          processed: false,
          error: result.error || 'Webhook processing failed'
        };
      }

    } catch (error) {
      await webhookSession.abortTransaction();
      
      if (error.type === 'StripeSignatureVerificationError') {
        console.error('Webhook signature verification failed:', error.message);
        return {
          success: false,
          processed: false,
          error: 'Webhook signature verification failed'
        };
      }
      
      console.error('Error processing webhook:', error);
      return {
        success: false,
        processed: false,
        error: error.message || 'Webhook processing failed'
      };
    } finally {
      await webhookSession.endSession();
    }
  }

  /**
   * Check if webhook has already been processed
   * @param {string} eventId - Stripe event ID
   * @param {mongoose.ClientSession} session - MongoDB session
   * @returns {Promise<{isDuplicate: boolean, order?: Object}>}
   */
  static async checkDuplicateWebhook(eventId, session) {
    try {
      const order = await Order.findOne({
        'metadata.webhookEventId': eventId
      }).session(session);

      return {
        isDuplicate: !!order,
        order: order
      };
    } catch (error) {
      console.error('Error checking duplicate webhook:', error);
      return { isDuplicate: false };
    }
  }

  /**
   * Mark webhook as processed in order metadata
   * @param {string} eventId - Stripe event ID
   * @param {string} eventType - Event type
   * @param {mongoose.ClientSession} session - MongoDB session
   */
  static async markWebhookProcessed(eventId, eventType, session) {
    try {
      await Order.updateOne(
        { 'metadata.webhookEventId': eventId },
        {
          $set: {
            'metadata.webhookProcessedAt': new Date().toISOString(),
            'metadata.webhookEventType': eventType
          },
          $setOnInsert: {
            'metadata.webhookEventId': eventId
          }
        },
        { upsert: false, session }
      );
    } catch (error) {
      console.error('Error marking webhook processed:', error);
    }
  }

  /**
   * Handle specific webhook event types
   * @param {Object} event - Stripe event object
   * @param {mongoose.ClientSession} session - MongoDB session
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  static async handleWebhookEvent(event, session) {
    const eventType = event.type;
    const eventObject = event.data.object;

    try {
      switch (eventType) {
        case 'checkout.session.completed':
          return await this.handleCheckoutSessionCompleted(eventObject, session);
          
        case 'checkout.session.expired':
          return await this.handleCheckoutSessionExpired(eventObject, session);
          
        case 'payment_intent.payment_failed':
          return await this.handlePaymentIntentFailed(eventObject, session);
          
        case 'payment_intent.succeeded':
          return await this.handlePaymentIntentSucceeded(eventObject, session);
          
        case 'charge.dispute.created':
          return await this.handleChargeDisputeCreated(eventObject, session);
          
        default:
          console.log(`Unhandled webhook event type: ${eventType}`);
          return { success: true }; // Acknowledge unhandled events
      }
    } catch (error) {
      console.error(`Error handling webhook event ${eventType}:`, error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Handle checkout session completed (successful payment)
   * @param {Object} session - Stripe session object
   * @param {mongoose.ClientSession} dbSession - MongoDB session
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  static async handleCheckoutSessionCompleted(session, dbSession) {
    try {
      const orderId = session.metadata?.orderId;
      
      if (!orderId) {
        throw new Error('No orderId found in session metadata');
      }

      const order = await Order.findById(orderId).session(dbSession);
      
      if (!order) {
        throw new Error(`Order not found: ${orderId}`);
      }

      // Validate state transition
      if (!PaymentService.validateOrderStateTransition(order.status, 'confirmed')) {
        console.log(`Invalid order state transition: ${order.status} -> confirmed`);
        return { success: true }; // Don't fail webhook for invalid transitions
      }

      if (!PaymentService.validatePaymentStateTransition(order.paymentStatus, 'PAID')) {
        console.log(`Invalid payment state transition: ${order.paymentStatus} -> PAID`);
        return { success: true };
      }

      // Update order status
      order.status = 'confirmed';
      order.paymentStatus = 'PAID';
      order.stripePaymentIntentId = session.payment_intent;
      order.webhookProcessed = true;
      order.webhookProcessedAt = new Date();
      order.lastWebhookEvent = 'checkout.session.completed';
      order.metadata.set('webhookEventId', session.id);
      order.metadata.set('confirmedAt', new Date().toISOString());
      
      await order.save({ session: dbSession });

      console.log(`Payment completed for order ${orderId}`);
      return { success: true };

    } catch (error) {
      console.error('Error in handleCheckoutSessionCompleted:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Handle checkout session expired
   * @param {Object} session - Stripe session object
   * @param {mongoose.ClientSession} dbSession - MongoDB session
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  static async handleCheckoutSessionExpired(session, dbSession) {
    try {
      const orderId = session.metadata?.orderId;
      
      if (!orderId) {
        throw new Error('No orderId found in session metadata');
      }

      const order = await Order.findById(orderId).session(dbSession);
      
      if (!order) {
        throw new Error(`Order not found: ${orderId}`);
      }

      // Only process if order is still pending
      if (order.status !== 'pending' || order.paymentStatus !== 'PENDING') {
        console.log(`Order ${orderId} already processed, skipping expired session`);
        return { success: true };
      }

      // Restore stock using centralized service
      const stockRestore = await InventoryService.restoreOrderStock(orderId, dbSession);
      
      if (!stockRestore.success) {
        console.error(`Stock restoration failed for order ${orderId}:`, stockRestore.message);
        // Don't fail webhook for stock restoration issues
      }

      // Update order status
      order.status = 'cancelled';
      order.paymentStatus = 'FAILED';
      order.webhookProcessed = true;
      order.webhookProcessedAt = new Date();
      order.lastWebhookEvent = 'checkout.session.expired';
      order.metadata.set('webhookEventId', session.id);
      order.metadata.set('expiredAt', new Date().toISOString());
      
      await order.save({ session: dbSession });

      console.log(`Payment expired for order ${orderId}`);
      return { success: true };

    } catch (error) {
      console.error('Error in handleCheckoutSessionExpired:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Handle payment intent failed
   * @param {Object} paymentIntent - Stripe payment intent object
   * @param {mongoose.ClientSession} dbSession - MongoDB session
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  static async handlePaymentIntentFailed(paymentIntent, dbSession) {
    try {
      // Find order by payment intent ID
      const order = await Order.findOne({ 
        stripePaymentIntentId: paymentIntent.id 
      }).session(dbSession);
      
      if (!order) {
        console.warn(`No order found for payment intent ${paymentIntent.id}`);
        return { success: true }; // Don't fail webhook
      }

      // Only process if order is still pending
      if (order.status !== 'pending' || order.paymentStatus !== 'PENDING') {
        console.log(`Order ${order._id} already processed, skipping failed payment intent`);
        return { success: true };
      }

      // Restore stock using centralized service
      const stockRestore = await InventoryService.restoreOrderStock(order._id, dbSession);
      
      if (!stockRestore.success) {
        console.error(`Stock restoration failed for order ${order._id}:`, stockRestore.message);
        // Don't fail webhook for stock restoration issues
      }

      // Update order status
      order.status = 'cancelled';
      order.paymentStatus = 'FAILED';
      order.webhookProcessed = true;
      order.webhookProcessedAt = new Date();
      order.lastWebhookEvent = 'payment_intent.payment_failed';
      order.metadata.set('webhookEventId', paymentIntent.id);
      order.metadata.set('failedAt', new Date().toISOString());
      order.metadata.set('failureReason', paymentIntent.last_payment_error?.message || 'Payment failed');
      
      await order.save({ session: dbSession });

      console.log(`Payment failed for order ${order._id}`);
      return { success: true };

    } catch (error) {
      console.error('Error in handlePaymentIntentFailed:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Handle payment intent succeeded (backup confirmation)
   * @param {Object} paymentIntent - Stripe payment intent object
   * @param {mongoose.ClientSession} dbSession - MongoDB session
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  static async handlePaymentIntentSucceeded(paymentIntent, dbSession) {
    try {
      // Find order by payment intent ID
      const order = await Order.findOne({ 
        stripePaymentIntentId: paymentIntent.id 
      }).session(dbSession);
      
      if (!order) {
        console.warn(`No order found for payment intent ${paymentIntent.id}`);
        return { success: true }; // Don't fail webhook
      }

      // Only process if order is not already confirmed
      if (order.status === 'confirmed' && order.paymentStatus === 'PAID') {
        console.log(`Order ${order._id} already confirmed, skipping payment intent succeeded`);
        return { success: true };
      }

      // Validate state transitions
      const orderValid = PaymentService.validateOrderStateTransition(order.status, 'confirmed');
      const paymentValid = PaymentService.validatePaymentStateTransition(order.paymentStatus, 'PAID');

      if (!orderValid || !paymentValid) {
        console.log(`Invalid state transitions for order ${order._id}: ${order.status} -> confirmed, ${order.paymentStatus} -> PAID`);
        return { success: true };
      }

      // Update order status
      order.status = 'confirmed';
      order.paymentStatus = 'PAID';
      order.webhookProcessed = true;
      order.webhookProcessedAt = new Date();
      order.lastWebhookEvent = 'payment_intent.succeeded';
      order.metadata.set('webhookEventId', paymentIntent.id);
      order.metadata.set('confirmedAt', new Date().toISOString());
      
      await order.save({ session: dbSession });

      console.log(`Payment intent succeeded for order ${order._id}`);
      return { success: true };

    } catch (error) {
      console.error('Error in handlePaymentIntentSucceeded:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Handle charge dispute created
   * @param {Object} dispute - Stripe dispute object
   * @param {mongoose.ClientSession} dbSession - MongoDB session
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  static async handleChargeDisputeCreated(dispute, dbSession) {
    try {
      // Find order by charge ID
      const order = await Order.findOne({ 
        stripePaymentIntentId: dispute.payment_intent 
      }).session(dbSession);
      
      if (!order) {
        console.warn(`No order found for dispute charge ${dispute.charge}`);
        return { success: true };
      }

      // Update order with dispute information
      order.metadata.set('disputeId', dispute.id);
      order.metadata.set('disputeReason', dispute.reason);
      order.metadata.set('disputeAmount', dispute.amount / 100);
      order.metadata.set('disputeStatus', dispute.status);
      order.metadata.set('disputeCreatedAt', new Date().toISOString());
      
      await order.save({ session: dbSession });

      console.log(`Dispute created for order ${order._id}: ${dispute.id}`);
      return { success: true };

    } catch (error) {
      console.error('Error in handleChargeDisputeCreated:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get webhook processing statistics
   * @returns {Promise<Object>}
   */
  static async getWebhookStats() {
    try {
      const stats = await Order.aggregate([
        {
          $match: {
            webhookProcessed: true,
            webhookProcessedAt: { $exists: true }
          }
        },
        {
          $group: {
            _id: '$lastWebhookEvent',
            count: { $sum: 1 },
            lastProcessed: { $max: '$webhookProcessedAt' }
          }
        },
        {
          $sort: { count: -1 }
        }
      ]);

      const totalProcessed = await Order.countDocuments({ webhookProcessed: true });
      const totalOrders = await Order.countDocuments();

      return {
        totalOrders,
        totalProcessed,
        processingRate: totalOrders > 0 ? (totalProcessed / totalOrders * 100).toFixed(2) + '%' : '0%',
        eventTypeStats: stats
      };

    } catch (error) {
      console.error('Error getting webhook stats:', error);
      return {
        totalOrders: 0,
        totalProcessed: 0,
        processingRate: '0%',
        eventTypeStats: []
      };
    }
  }
}

export default WebhookService;
