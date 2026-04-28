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

    const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

    const statuses = [
      "pending",
      "confirmed",
      "shipped",
      "delivered",
      "cancelled",
    ];

    const generateOrders = (count = 30) => {
      return Array.from({ length: count }).map(() => {
        const user = getRandom(users);

        // random number of products per order
        const itemsCount = Math.floor(Math.random() * 3) + 1;

        const selectedProducts = Array.from({ length: itemsCount }).map(() => {
          const product = getRandom(products);

          return {
            product: product._id,
            quantity: Math.floor(Math.random() * 3) + 1,
            price: product.price || 500,
          };
        });

        const totalAmount = selectedProducts.reduce(
          (acc, item) => acc + item.price * item.quantity,
          0,
        );

        const status = getRandom(statuses);

        return {
          user: user._id,
          products: selectedProducts,
          totalAmount,
          status,
          isRefunded: status === "delivered" ? false : false,
          createdBy: user._id,
          updatedBy: user._id,
        };
      });
    };

    const finalOrders = generateOrders(50);

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
