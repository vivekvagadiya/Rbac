// services/user.service.js
import User from "../models/user.model.js";

export const assignRoleToUser = async (userId, roleId) => {
  return await User.findByIdAndUpdate(userId, { role: roleId }, { new: true });
};

export const getUsers = async () => {
  return await User.find().populate({
    path: "role",
    populate: { path: "permissions" },
  });
};
