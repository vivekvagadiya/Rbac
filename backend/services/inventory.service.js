import Product from '../models/product.model.js';
import Order from '../models/order.model.js';
import mongoose from 'mongoose';

/**
 * Inventory Service - Centralized stock management with idempotency protection
 * 
 * Handles all stock operations with proper safety checks and race condition prevention
 */

class InventoryService {
  /**
   * Restore stock for a cancelled/failed order with idempotency protection
   * @param {string} orderId - Order ID
   * @param {mongoose.ClientSession} [session] - MongoDB transaction session
   * @returns {Promise<{success: boolean, message: string, restored: boolean}>}
   */
  static async restoreOrderStock(orderId, session = null) {
    try {
      // Validate input
      if (!orderId || !mongoose.Types.ObjectId.isValid(orderId)) {
        return { success: false, message: 'Invalid order ID', restored: false };
      }

      // Find order with minimal fields for performance
      const order = await Order.findById(orderId)
        .select('products status paymentStatus stockRestored stripePaymentIntentId')
        .session(session);

      if (!order) {
        return { success: false, message: 'Order not found', restored: false };
      }

      // Check if stock already restored (idempotency)
      if (order.stockRestored) {
        return { 
          success: true, 
          message: 'Stock already restored', 
          restored: false 
        };
      }

      // Don't restore stock for paid orders
      if (order.paymentStatus === 'PAID') {
        return { 
          success: false, 
          message: 'Cannot restore stock for paid orders', 
          restored: false 
        };
      }

      // Don't restore stock for orders that aren't cancelled/failed
      if (!['cancelled', 'failed'].includes(order.status.toLowerCase()) && 
          order.paymentStatus !== 'FAILED') {
        return { 
          success: false, 
          message: 'Order not eligible for stock restoration', 
          restored: false 
        };
      }

      // Restore stock for all products in the order
      const stockRestorePromises = order.products.map(async (orderItem) => {
        try {
          // Update product stock with atomic operation
          const result = await Product.updateOne(
            { 
              _id: orderItem.product,
              // Additional safety: ensure stock doesn't go negative
              stock: { $gte: 0 }
            },
            { 
              $inc: { stock: orderItem.quantity },
              $push: {
                stockHistory: {
                  orderId: orderId,
                  quantity: orderItem.quantity,
                  type: 'restored',
                  timestamp: new Date(),
                  reason: `Order ${orderId} cancelled/failed`
                }
              }
            },
            { session }
          );

          if (result.modifiedCount === 0) {
            console.warn(`Failed to restore stock for product ${orderItem.product}`);
            return { success: false, productId: orderItem.product };
          }

          return { success: true, productId: orderItem.product, quantity: orderItem.quantity };
        } catch (error) {
          console.error(`Error restoring stock for product ${orderItem.product}:`, error);
          return { success: false, productId: orderItem.product, error: error.message };
        }
      });

      const restoreResults = await Promise.all(stockRestorePromises);

      // Check if all stock restores succeeded
      const allSuccess = restoreResults.every(result => result.success);
      
      if (!allSuccess) {
        const failedItems = restoreResults.filter(r => !r.success);
        console.error(`Partial stock restoration for order ${orderId}:`, failedItems);
        return { 
          success: false, 
          message: 'Partial stock restoration failed', 
          restored: false,
          details: failedItems
        };
      }

      // Mark order as stock restored (idempotency flag)
      await Order.findByIdAndUpdate(
        orderId,
        { 
          stockRestored: true,
          stockRestoredAt: new Date(),
          stockRestoredReason: 'Payment cancelled/failed'
        },
        { session }
      );

      console.log(`Successfully restored stock for order ${orderId}`);
      return { 
        success: true, 
        message: 'Stock restored successfully', 
        restored: true,
        details: restoreResults
      };

    } catch (error) {
      console.error(`Error in restoreOrderStock for order ${orderId}:`, error);
      return { 
        success: false, 
        message: error.message || 'Stock restoration failed', 
        restored: false 
      };
    }
  }

  /**
   * Deduct stock during order creation with validation
   * @param {Array} products - Array of {product, quantity}
   * @param {mongoose.ClientSession} [session] - MongoDB transaction session
   * @returns {Promise<{success: boolean, message: string, deducted: boolean}>}
   */
  static async deductOrderStock(products, session = null) {
    try {
      if (!Array.isArray(products) || products.length === 0) {
        return { success: false, message: 'Invalid products array', deducted: false };
      }

      // Validate stock availability before deducting
      const stockCheckPromises = products.map(async (item) => {
        const product = await Product.findById(item.product)
          .select('name stock')
          .session(session);

        if (!product) {
          return { 
            success: false, 
            productId: item.product, 
            message: 'Product not found' 
          };
        }

        if (product.stock < item.quantity) {
          return { 
            success: false, 
            productId: item.product, 
            productName: product.name,
            requested: item.quantity,
            available: product.stock,
            message: 'Insufficient stock' 
          };
        }

        return { success: true, productId: item.product, available: product.stock };
      });

      const stockChecks = await Promise.all(stockCheckPromises);
      const insufficientStock = stockChecks.find(check => !check.success);

      if (insufficientStock) {
        return { 
          success: false, 
          message: `Insufficient stock for ${insufficientStock.productName || 'product'}. Available: ${insufficientStock.available}, Requested: ${insufficientStock.requested}`,
          deducted: false,
          details: insufficientStock
        };
      }

      // Deduct stock atomically
      const stockDeductPromises = products.map(async (orderItem) => {
        try {
          const result = await Product.updateOne(
            { 
              _id: orderItem.product,
              stock: { $gte: orderItem.quantity } // Double-check stock availability
            },
            { 
              $inc: { stock: -orderItem.quantity },
              $push: {
                stockHistory: {
                  quantity: orderItem.quantity,
                  type: 'deducted',
                  timestamp: new Date(),
                  reason: 'Order created'
                }
              }
            },
            { session }
          );

          if (result.modifiedCount === 0) {
            return { success: false, productId: orderItem.product, message: 'Stock deduction failed' };
          }

          return { success: true, productId: orderItem.product, quantity: orderItem.quantity };
        } catch (error) {
          return { success: false, productId: orderItem.product, error: error.message };
        }
      });

      const deductResults = await Promise.all(stockDeductPromises);
      const allSuccess = deductResults.every(result => result.success);

      if (!allSuccess) {
        const failedItems = deductResults.filter(r => !r.success);
        console.error('Partial stock deduction:', failedItems);
        return { 
          success: false, 
          message: 'Partial stock deduction failed', 
          deducted: false,
          details: failedItems
        };
      }

      return { 
        success: true, 
        message: 'Stock deducted successfully', 
        deducted: true,
        details: deductResults
      };

    } catch (error) {
      console.error('Error in deductOrderStock:', error);
      return { 
        success: false, 
        message: error.message || 'Stock deduction failed', 
        deducted: false 
      };
    }
  }

  /**
   * Get stock history for a product
   * @param {string} productId - Product ID
   * @param {Object} options - Query options
   * @returns {Promise<Array>}
   */
  static async getStockHistory(productId, options = {}) {
    try {
      const product = await Product.findById(productId)
        .select('stockHistory stock')
        .populate('stockHistory.orderId', 'status paymentStatus createdAt');

      if (!product) {
        throw new Error('Product not found');
      }

      // Sort history by timestamp descending
      let history = product.stockHistory.sort((a, b) => b.timestamp - a.timestamp);

      // Apply filters
      if (options.type) {
        history = history.filter(item => item.type === options.type);
      }

      if (options.limit) {
        history = history.slice(0, options.limit);
      }

      return {
        success: true,
        currentStock: product.stock,
        history: history,
        totalChanges: product.stockHistory.length
      };

    } catch (error) {
      console.error('Error in getStockHistory:', error);
      return { 
        success: false, 
        message: error.message,
        history: [],
        currentStock: 0
      };
    }
  }

  /**
   * Validate stock for multiple products
   * @param {Array} products - Array of {product, quantity}
   * @returns {Promise<{valid: boolean, message: string, details: Array}>}
   */
  static async validateStockAvailability(products) {
    try {
      const validationPromises = products.map(async (item) => {
        const product = await Product.findById(item.product)
          .select('name stock');

        if (!product) {
          return {
            valid: false,
            productId: item.product,
            message: 'Product not found'
          };
        }

        return {
          valid: product.stock >= item.quantity,
          productId: item.product,
          productName: product.name,
          requested: item.quantity,
          available: product.stock,
          message: product.stock >= item.quantity ? 'Available' : 'Insufficient stock'
        };
      });

      const results = await Promise.all(validationPromises);
      const invalidItems = results.filter(result => !result.valid);

      return {
        valid: invalidItems.length === 0,
        message: invalidItems.length === 0 ? 'All products available' : 'Some products have insufficient stock',
        details: results,
        invalidItems: invalidItems
      };

    } catch (error) {
      console.error('Error in validateStockAvailability:', error);
      return { 
        valid: false, 
        message: error.message,
        details: [],
        invalidItems: []
      };
    }
  }
}

export default InventoryService;
