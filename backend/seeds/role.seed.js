const mongoose = require("mongoose");
const Role = require("../models/role.model.js");
const Permission = require("../models/permission.model.js");

const MONGO_URI = "mongodb://localhost:27017/vivek-node";

const seedRoles = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB Connected");

    await Role.deleteMany();

    const allPermissions = await Permission.find();

    // Helper
    const getPermissions = (filters) => {
      return allPermissions
        .filter((p) =>
          filters.some(
            (f) => p.module === f.module && f.actions.includes(p.action)
          )
        )
        .map((p) => p._id);
    };

    // 🔴 ADMIN → ALL permissions
    const adminPermissions = allPermissions.map((p) => p._id);

    // 🟡 MANAGER → limited control
    const managerPermissions = getPermissions([
      { module: "product", actions: ["create", "read", "update"] },
      { module: "order", actions: ["read", "update"] },
      { module: "user", actions: ["read"] },
    ]);

    // 🟢 USER → minimal access
    const userPermissions = getPermissions([
      { module: "order", actions: ["read"] },
      { module: "product", actions: ["read"] },
    ]);

    const roles = [
      {
        name: "admin",
        permissions: adminPermissions,
      },
      {
        name: "manager",
        permissions: managerPermissions,
      },
      {
        name: "user",
        permissions: userPermissions,
      },
    ];

    await Role.insertMany(roles);

    console.log("Roles seeded ✅");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedRoles();