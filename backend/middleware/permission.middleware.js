import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";

export const checkPermission = (requiredPermission) => {
  return async (req, res, next) => {
    try {
      const userId = req.user?._id;

      if (!userId) {
        throw new ApiError(401, "Unauthorized");
      }

      const user = await User.findById(userId)
        .select("role isBlocked isDeleted")
        .populate({
          path: "role",
          select: "permissions",
          populate: {
            path: "permissions",
            select: "name -_id",
          },
        })
        .lean();

      if (!user || user.isDeleted) {
        throw new ApiError(404, "User not found");
      }

      if (user.isBlocked) {
        throw new ApiError(403, "User is blocked");
      }

      if (!user.role || !user.role.permissions) {
        throw new ApiError(403, "No permissions assigned");
      }

      const permissionSet = new Set(
        user.role.permissions.map((p) => p.name)
      );

      if (!permissionSet.has(requiredPermission)) {
        throw new ApiError(403, "Forbidden");
      }

      req.permissions = permissionSet;

      next();
    } catch (err) {
      next(err);
    }
  };
};