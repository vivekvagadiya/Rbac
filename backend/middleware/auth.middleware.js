import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";

// middleware/auth.middleware.js

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null;

    if (!token) throw new ApiError(401, "Unauthorized");

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Optimized fetch: only get what we need
    const user = await User.findById(decoded.id)
      .select("_id role isBlocked isDeleted tokenVersion")
      .populate("role", "name")
      .lean();

    if (!user || user.isDeleted) throw new ApiError(401, "User not found");
    if (user.isBlocked) throw new ApiError(403, "User is blocked");

    // ✅ SINGLE SESSION CHECK
    if (decoded.version !== user.tokenVersion) {
      throw new ApiError(
        401,
        "Your session has expired because of a login on another device.",
      );
    }

    req.user = user;
    next();
  } catch (err) {
    next(new ApiError(401, err.message || "Invalid Token"));
  }
};
