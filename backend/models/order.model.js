const mongoose = require("mongoose");
const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        price: {
          type: Number,
          required: true,
          min: 0,
        },
      },
    ],

    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    // Order lifecycle states
    status: {
      type: String,
      enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
      default: "pending",
      index: true,
    },

    // Payment lifecycle states
    paymentStatus: {
      type: String,
      enum: ["PENDING", "PAID", "FAILED", "REFUNDED"],
      default: "PENDING",
      index: true,
    },

    // Stripe integration fields
    stripeSessionId: {
      type: String,
      index: true,
      sparse: true, // Allows null values for non-stripe orders
    },
    
    stripePaymentIntentId: {
      type: String,
      index: true,
      sparse: true,
    },

    // Stock management fields
    stockRestored: {
      type: Boolean,
      default: false,
      index: true,
    },
    
    stockRestoredAt: {
      type: Date,
    },
    
    stockRestoredReason: {
      type: String,
    },

    // Refund tracking
    isRefunded: {
      type: Boolean,
      default: false,
    },
    
    refundAmount: {
      type: Number,
      min: 0,
    },
    
    refundReason: {
      type: String,
    },
    
    refundId: {
      type: String, // Stripe refund ID
    },

    // Audit fields
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    // Webhook processing
    webhookProcessed: {
      type: Boolean,
      default: false,
    },
    
    webhookProcessedAt: {
      type: Date,
    },
    
    lastWebhookEvent: {
      type: String,
    },

    // Metadata for tracking
    metadata: {
      type: Map,
      of: String,
      default: new Map(),
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Order", orderSchema);
