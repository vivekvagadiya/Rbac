import Role from "../models/role.model.js";

export const createRole = async (data) => {
  return await Role.create(data);
};

export const getRoles = async () => {
  return await Role.find().populate("permissions");
};

export const updateRole = async (id, data) => {
  return await Role.findByIdAndUpdate(id, data, { new: true });
};

export const deleteRole = async (id) => {
  return await Role.findByIdAndDelete(id);
};
