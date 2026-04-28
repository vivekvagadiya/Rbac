require("dotenv").config({ path: "../.env" });
const mongoose = require("mongoose");
const Order = require("../models/order.model");
const User = require("../models/user.model");
const Product = require("../models/product.model");

const seedOrders = async () => {
  try {
    console.log("🌱 Seeding orders...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected");
    // Get existing users & products
    const users = await User.find().limit(3);
    const products = await Product.find().limit(5);

    if (!users.length || !products.length) {
      throw new Error("Users or Products not found. Seed them first.");
    }

    // Optional: clear old orders
    await Order.deleteMany();

    const ordersData = [
      {
        user: users[0]._id,
        products: [
          {
            product: products[0]._id,
            quantity: 2,
            price: products[0].price || 500,
          },
          {
            product: products[1]._id,
            quantity: 1,
            price: products[1].price || 300,
          },
        ],
        status: "pending",
      },
      {
        user: users[1]._id,
        products: [
          {
            product: products[2]._id,
            quantity: 3,
            price: products[2].price || 200,
          },
        ],
        status: "shipped",
      },
      {
        user: users[2]._id,
        products: [
          {
            product: products[3]._id,
            quantity: 1,
            price: products[3].price || 1000,
          },
          {
            product: products[4]._id,
            quantity: 2,
            price: products[4].price || 400,
          },
        ],
        status: "delivered",
        isRefunded: false,
      },
    ];

    // Calculate totalAmount
    const finalOrders = ordersData.map((order) => {
      const totalAmount = order.products.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0,
      );

      return {
        ...order,
        totalAmount,
        createdBy: order.user,
        updatedBy: order.user,
      };
    });

    await Order.insertMany(finalOrders);

    console.log("✅ Orders seeded successfully");
    process.exit();
  } catch (error) {
    console.error("❌ Error seeding orders:", error.message);
    process.exit(1);
  }
};

// module.exports = seedOrders;
seedOrders();
