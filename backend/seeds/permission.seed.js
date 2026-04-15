import Permission from "../models/permission.model.js";

const permissions = [
  { name: "user:create", module: "user", action: "create" },
  { name: "user:read", module: "user", action: "read" },
  { name: "user:update", module: "user", action: "update" },
  { name: "user:delete", module: "user", action: "delete" },

  { name: "product:create", module: "product", action: "create" },
  { name: "product:read", module: "product", action: "read" },
  { name: "product:update", module: "product", action: "update" },
  { name: "product:delete", module: "product", action: "delete" },  
];

export const seedPermissions = async () => {
  await Permission.deleteMany();
  await Permission.insertMany(permissions);
};
