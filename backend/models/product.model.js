const mongoose = require("mongoose");

const stockHistorySchema = new mongoose.Schema({
  quantity: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    enum: ['deducted', 'restored', 'adjusted', 'initial'],
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  reason: {
    type: String,
  },
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
  },
  previousStock: {
    type: Number,
  },
  newStock: {
    type: Number,
  }
}, { _id: false });

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    description: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    stock: {
      type: Number,
      default: 0,
      min: 0,
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    
    // Stock tracking
    stockHistory: [stockHistorySchema],
    
    // Low stock threshold
    lowStockThreshold: {
      type: Number,
      default: 5,
      min: 0,
    },
    
    // Track when stock was last updated
    stockUpdatedAt: {
      type: Date,
      default: Date.now,
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
  },
  { timestamps: true },
);

module.exports = mongoose.model("Product", productSchema);
