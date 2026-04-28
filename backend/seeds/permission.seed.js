require("dotenv").config({path:"../.env"});
const mongoose = require("mongoose");
const Permission = require("../models/permission.model.js");

const MONGO_URI = process.env.MONGO_URI; // move to .env later

const modules = ["user", "role", "product", "order", "category", "permission"];
const actions = ["create", "read", "update", "delete"];

const seedPermissions = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB Connected");

    await Permission.deleteMany();

    const permissions = [];

    modules.forEach((module) => {
      actions.forEach((action) => {
        permissions.push({
          name: `${module}.${action}`, // IMPORTANT
          module,
          action,
        });
      });
    });

    await Permission.insertMany(permissions);

    console.log(`Permissions seeded ✅ (${permissions.length} total)`);
    process.exit();
  } catch (error) {
    console.error("Seeding failed ❌", error);
    process.exit(1);
  }
};

seedPermissions();