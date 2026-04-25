import Permission from "../models/permission.model.js";

const permissions = [
  { name: "user:create", module: "user", action: "create" },
  { name: "user:read", module: "user", action: "read" },
  { name: "user:update", module: "user", action: "update" },
  { name: "user:delete", module: "user", action: "delete" },
  { name: "permission:create", module: "permission", action: "create" },
  { name: "permission:read", module: "permission", action: "read" },
  { name: "permission:update", module: "permission", action: "update" },
  { name: "permission:delete", module: "permission", action: "delete" },

  { name: "product:create", module: "product", action: "create" },
  { name: "product:read", module: "product", action: "read" },
  { name: "product:update", module: "product", action: "update" },
  { name: "product:delete", module: "product", action: "delete" },

  { name: "order:create", module: "order", action: "create" },
  { name: "order:read", module: "order", action: "read" },
  { name: "order:update", module: "order", action: "update" },
  { name: "order:delete", module: "order", action: "delete" },
  { name: "order:refund", module: "order", action: "refund" },
];

export const seedPermissions = async () => {
  for (const perm of permissions) {
    await Permission.updateOne(
      { name: perm.name },       // check existing
      { $setOnInsert: perm },    // insert only if not exists
      { upsert: true }
    );
  }

  console.log("Permissions seeded (no duplicates)");
};