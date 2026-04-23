import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new ApiError(401, "Unauthorized");
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("_id role isBlocked isDeleted");

    if (!user || user.isDeleted) {
      throw new ApiError(401, "User not found");
    }

    if (user.isBlocked) {
      throw new ApiError(403, "User is blocked");
    }

    req.user = {
      _id: user._id,
      role: user.role,
    };

    next();
  } catch (err) {
    next(new ApiError(401, "Invalid or expired token"));
  }
};