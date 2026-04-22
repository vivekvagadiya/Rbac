import User from "../models/user.model.js";

export const checkPermission = (requiredPermission) => {
  return async (req, res, next) => {
    try {
      //  GET FROM HEADER
      const userId = req.headers["x-user-id"];

      if (!userId) {
        return res.status(401).json({ message: "No user id provided" });
      }

      //  attach to req.user
      req.user = { _id: userId };

      //  FIXED HERE
      const user = await User.findById(req.user._id).populate({
        path: "role",
        populate: { path: "permissions" },
      });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (!user.role) {
        return res.status(403).json({ message: "Role not assigned" });
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