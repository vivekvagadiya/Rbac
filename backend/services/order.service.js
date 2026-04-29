import mongoose from "mongoose";
import Product from "../models/product.model.js";
import Order from "../models/order.model.js";
import ApiError from "../utils/ApiError.js";

export const createOrder = async (data, userId) => {
  const { products } = data;

  if (!products || !Array.isArray(products) || products.length === 0) {
    throw new ApiError(400, "Products are required");
  }
  for (const item of products) {
    if (!item.product || !mongoose.Types.ObjectId.isValid(item.product)) {
      throw new ApiError(400, "Invalid product ID");
    }
    if (!item.quantity || item.quantity <= 0) {
      throw new ApiError(400, "Invalid Quantity");
    }
  }

  const productIds = products.map((item) => item.product);
  const dbProducts = await Product.find({
    _id: { $in: productIds },
    isActive: true,
  }).lean();

  if (dbProducts.length !== products.length) {
    throw new ApiError(400, "Some products are not found");
  }

  const productMap = new Map();
  dbProducts.forEach((p) => productMap.set(p._id.toString(), p));

  let totalAmount = 0;
  const orderItems = products.map((item) => {
    const prod = productMap.get(item.product.toString());

    if (item.quantity > prod.stock) {
      throw new ApiError(400, `Insufficient stock for product ${prod.name}`);
    }
    totalAmount += prod.price * item.quantity;

    return {
      product: prod._id,
      quantity: item.quantity,
      price: prod.price,
    };
  });

  const order = await Order.create({
    user: userId,
    products: orderItems,
    totalAmount,
    createdBy: userId,
    updatedBy: userId,
  });
  await Promise.all(
    orderItems.map((item) =>
      Product.updateOne(
        { _id: item.product },
        { $inc: { stock: -item.quantity } },
      ),
    ),
  );

  return order;
};

export const getOrders = async (query) => {
  let { page = 1, limit = 10, status, user, search } = query;

  page = Math.max(1, parseInt(page) || 1);
  limit = Math.min(50, Math.max(1, parseInt(limit) || 10));

  const skip = (page - 1) * limit;

  const match = {};

  if (status) match.status = status;

  if (user && mongoose.Types.ObjectId.isValid(user)) {
    match.user = new mongoose.Types.ObjectId(user);
  }

  // 🔍 SEARCH LOGIC
  if (search) {
    const searchRegex = new RegExp(search, "i");

    match.$or = [
      { "user.name": searchRegex },
      { "user.email": searchRegex },
    ];

    // Optional: search by Order ID
    if (mongoose.Types.ObjectId.isValid(search)) {
      match.$or.push({ _id: new mongoose.Types.ObjectId(search) });
    }
  }

  const [orders, total] = await Promise.all([
    Order.aggregate([
      // 🔥 JOIN FIRST (so we can search user fields)
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },

      // 🔥 NOW apply filters + search
      { $match: match },

      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },

      {
        $addFields: {
          productsCount: { $size: "$products" },
        },
      },

      {
        $project: {
          products: 0,
          "user.password": 0,
        },
      },
    ]),

    // ⚠️ total count must also include search
    Order.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      { $match: match },
      { $count: "total" },
    ]),
  ]);

  return {
    orders,
    total: total[0]?.total || 0,
    page,
    limit,
  };
};

export const updateOrderStatus = async (id, newStatus, userId) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid order ID");
  }
  if (!newStatus) {
    throw new ApiError(400, "Status is required");
  }

  const allowedTransitions = {
    pending: ["confirmed", "cancelled"],
    confirmed: ["shipped", "cancelled"],
    shipped: ["delivered"],
    delivered: [],
    cancelled: [],
  };

  const order = await Order.findById(id);

  if (!order) {
    throw new ApiError(404, "Order not found");
  }
  const allowed = allowedTransitions[order.status] || [];

  if (!allowed.includes(newStatus)) {
    throw new ApiError(
      400,
      `Cannot change status from ${order.status} to ${newStatus}`,
    );
  }
  if (order.isRefunded) {
    throw new ApiError(400, "Cannot update refunded order");
  }

  order.status = newStatus;
  order.updatedBy = userId;
  await order.save();
  return order;
};

export const refundOrder = async (id, userId) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid order ID");
  }

  const order = await Order.findById(id);

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  if (order.status !== "delivered") {
    throw new ApiError(400, "Only delivered orders can be refunded");
  }

  if (order.isRefunded) {
    throw new ApiError(400, "Order is already refunded");
  }

  order.isRefunded = true;
  order.updatedBy = userId;
  await order.save();
  return order;
};

export const getOrderById = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid order ID");
  }

  const order = await Order.findById(id)
    .populate("user", "name email")
    .populate("products.product", "name price")
    .lean();

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  return order;
};

export const getOrderStatusSummary = async () => {
  const summary = await Order.aggregate([
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);

  const result = {
    pending: 0,
    confirmed: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
  };

  // Map aggregation result → object
  summary.forEach((item) => {
    if (result.hasOwnProperty(item._id)) {
      result[item._id] = item.count;
    }
  });

  return result;
};