import mongoose from "mongoose";
import Role from "../models/role.model.js";
import Permission from "../models/permission.model.js";

//  CREATE ROLE
export const createRole = async (data) => {
  const { name, permissions } = data;

  // Check duplicate role
  const existingRole = await Role.findOne({ name });
  if (existingRole) {
    throw new Error("Role already exists");
  }

  // Validate permissions exist
  if (permissions && permissions.length > 0) {
    const validPermissions = await Permission.find({
      _id: { $in: permissions },
    });

    if (validPermissions.length !== permissions.length) {
      throw new Error("Some permissions are invalid");
    }
  }

  return await Role.create(data);
};

//  GET ROLES
export const getRoles = async () => {
  return await Role.find().populate("permissions");
};

//  UPDATE ROLE
export const updateRole = async (id, data) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid role ID");
  }

  const role = await Role.findById(id);
  if (!role) {
    throw new Error("Role not found");
  }

  //  Prevent duplicate name
  if (data.name) {
    const existingRole = await Role.findOne({ name: data.name });
    if (existingRole && existingRole._id.toString() !== id) {
      throw new Error("Role name already exists");
    }
  }

  //  Validate permissions
  if (data.permissions) {
    const validPermissions = await Permission.find({
      _id: { $in: data.permissions },
    });

    if (validPermissions.length !== data.permissions.length) {
      throw new Error("Some permissions are invalid");
    }
  }

  return await Role.findByIdAndUpdate(id, data, { new: true });
};

//  DELETE ROLE
export const deleteRole = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid role ID");
  }

  const role = await Role.findById(id);
  if (!role) {
    throw new Error("Role not found");
  }

  // Protect critical roles
  if (role.name === "admin") {
    throw new Error("Cannot delete admin role");
  }

  return await Role.findByIdAndDelete(id);
};