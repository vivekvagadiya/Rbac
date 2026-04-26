const mongoose = require("mongoose");
const Product = require("../models/product.model.js"); // adjust path

const MONGO_URI = "mongodb://127.0.0.1:27017/vivek-node"; // change

// Optional: put a valid User _id if you want createdBy
const USER_ID = "69e87a7b9063082921517b58"; // e.g. "662f1c9e8c1234567890abcd"

const categories = ["electronics", "clothing", "food", "books", "accessories"];

const productNames = [
  "Wireless Mouse",
  "Bluetooth Headphones",
  "Gaming Keyboard",
  "Smartphone Stand",
  "USB-C Cable",
  "Laptop Bag",
  "Running Shoes",
  "T-Shirt",
  "Jeans",
  "Jacket",
  "Cooking Oil",
  "Chocolate Pack",
  "Green Tea",
  "Notebook",
  "Pen Set",
  "Backpack",
  "Smart Watch",
  "Power Bank",
  "Desk Lamp",
  "Water Bottle",
  "Sunglasses",
  "Wallet",
  "Perfume",
  "Face Wash",
  "Hair Dryer",
  "Portable Speaker",
  "Tablet Cover",
  "Fitness Band",
  "Coffee Mug",
  "Office Chair",
];

const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];
const getRandomPrice = () => Math.floor(Math.random() * 5000) + 100;
const getRandomStock = () => Math.floor(Math.random() * 100);

const seedProducts = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB Connected");

    const products = productNames.map((name) => ({
      name,
      price: getRandomPrice(),
      description: `${name} - High quality product for daily use`,
      category: getRandom(categories),
      stock: getRandomStock(),
      isActive: true,
      createdBy: USER_ID || undefined,
    }));

    // Upsert (avoid duplicates by name)
    await Product.bulkWrite(
      products.map((product) => ({
        updateOne: {
          filter: { name: product.name },
          update: { $set: product },
          upsert: true,
        },
      })),
    );

    console.log(`✅ Seeded ${products.length} products`);
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding products:", error);
    process.exit(1);
  }
};

seedProducts();
