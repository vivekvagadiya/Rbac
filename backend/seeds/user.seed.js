const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Role = require("../models/role.model.js");
const User=require('../models/user.model.js')
const MONGO_URI = "mongodb://localhost:27017/vivek-node"; // use .env in real setup

const seedUsers = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB Connected");

    // Clear old users (optional)
    await User.deleteMany();

    // Get roles
    const adminRole = await Role.findOne({ name: "admin" });
    const managerRole = await Role.findOne({ name: "manager" });
    const userRole = await Role.findOne({ name: "user" });

    if (!adminRole || !managerRole || !userRole) {
      throw new Error("Roles not found. Seed roles first.");
    }

    const password = await bcrypt.hash("123456", 10);

    const users = [];

    // 1 Admin
    users.push({
      name: "Admin User",
      email: "admin@example.com",
      password,
      role: adminRole._id,
    });

    // 5 Managers
    for (let i = 1; i <= 5; i++) {
      users.push({
        name: `Manager ${i}`,
        email: `manager${i}@example.com`,
        password,
        role: managerRole._id,
      });
    }

    // 20 Normal Users
    for (let i = 1; i <= 20; i++) {
      users.push({
        name: `User ${i}`,
        email: `user${i}@example.com`,
        password,
        role: userRole._id,
      });
    }

    await User.insertMany(users);

    console.log("Users seeded successfully ✅");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedUsers();