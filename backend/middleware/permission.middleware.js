import mongoose from "mongoose";
import User from "../models/user.model.js";

export const checkPermission = (requiredPermission) => {
  return async (req, res, next) => {
    try {
      const userId = req.headers["x-user-id"];

      if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(401).json({ message: "Invalid or missing user id" });
      }

      // Attach user early
      req.user = { _id: userId };

      // Fetch only required fields (OPTIMIZED)
      const user = await User.findById(userId)
        .select("role")
        .populate({
          path: "role",
          select: "permissions",
          populate: {
            path: "permissions",
            select: "name -_id",
          },
        })
        .lean();

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (!user.role || !user.role.permissions) {
        return res.status(403).json({ message: "No permissions assigned" });
      }

      // Convert to Set (O(1) lookup)
      const permissionSet = new Set(
        user.role.permissions.map((p) => p.name)
      );

      if (!permissionSet.has(requiredPermission)) {
        return res.status(403).json({ message: "Forbidden" });
      }

      // Attach permissions for downstream use (optional)
      req.permissions = permissionSet;

      next();
    } catch (err) {
      next(err);
    }
  };
};