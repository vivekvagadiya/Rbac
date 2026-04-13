// services/user.service.js
import User from "../models/user.model.js";

export const assignRoleToUser = async (userId, roleId) => {
  return await User.findByIdAndUpdate(
    userId,
    { role: roleId },
    { new: true }
  );
};