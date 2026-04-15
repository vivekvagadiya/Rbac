import User from "../models/user.model.js";

export const checkPermission = (requiredPermission) => {
  return async (req, res, next) => {
    try {
      const user = await User.findById(req.user._id).populate({
        path: "role",
        populate: { path: "permissions" },
      });
      if (!user || !user.role) {
        return res.status(403).json({ message: "Access denied" });
      }
      const userPermissions = user.role.permissions.map((p) => p.name);

      if (!userPermissions.includes(requiredPermission)) {
        return res.status(403).json({ message: "Forbidden" });
      }

      next();
    } catch (err) {
      next(err);
    }
  };
};
