import User from "../models/user.model.js";
import ApiError, { ValidationError } from "../utils/ApiError.js";
import { generateTokens } from "../utils/generateTokens.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
export const registerUser = async (data) => {
  const { email, password } = data;

  if (!email || !password) {
    throw new ValidationError("Email and password are required");
  }

  const userExist = await User.findOne({ email });

  if (userExist) {
    throw new ApiError(409, "User already exists");
  }

  const user = await User.create({
    ...data,
  });

  const safeUser = {
    _id: user._id,
    email: user.email,
    role: user.role,
  };

  return safeUser;
};

export const loginUser = async (email, password) => {
  if (!email || !password) {
    throw new ValidationError("Email and password are required");
  }

  const user = await User.findOne({ email }).populate("role");

  if (!user) {
    throw new ApiError(401, "Invalid credentials");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  console.log("user", user, email, password, user.password);

  if (!isMatch) {
    throw new ApiError(401, "Invalid credentials");
  }
  user.tokenVersion = (user.tokenVersion || 0) + 1;
  const tokens = generateTokens(user);

  // ✅ FIX HERE
  user.refreshToken = tokens.refreshToken;
  await user.save();

  const safeUser = {
    _id: user._id,
    email: user.email,
    role: user.role,
  };

  return { user: safeUser, ...tokens };
};

export const refreshUserToken = async (refreshToken) => {
  if (!refreshToken) {
    throw new ApiError(401, "Refresh token required");
  }

  let decoded;

  try {
    decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
  } catch (err) {
    throw new ApiError(403, "Invalid refresh token");
  }

  const user = await User.findById(decoded.id);

  if (!user || user.isDeleted) {
    throw new ApiError(403, "User not found");
  }

  if (user.isBlocked) {
    throw new ApiError(403, "User is blocked");
  }

  // ✅ MATCH with DB (VERY IMPORTANT)
  if (user.refreshToken !== refreshToken) {
    throw new ApiError(403, "Refresh token mismatch");
  }

  // 🔁 ROTATE tokens
  const tokens = generateTokens(user);

  user.refreshToken = tokens.refreshToken;
  await user.save();

  return tokens;
};

export const logoutUser = async (userId) => {
  const user = await User.findById(userId);

  if (user) {
    user.refreshToken = null;
    await user.save();
  }

  return { message: "Logged out successfully" };
};

export const getUserData = async (userId) => {
  const user = await User.findOne({ _id: userId })
    .select("-password -refreshToken")
    .populate({
      path: "role",
      populate: { path: "permissions", select: "name module" },
    });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return user;
};

export const generatePasswordResetToken = async (email) => {
  if (!email) {
    throw new ValidationError("Email is required");
  }

  const user = await User.findOne({ email });

  // Always return success to prevent email enumeration attacks
  if (!user) {
    return { user: null, resetToken: null };
  }

  if (user.isDeleted) {
    return { user: null, resetToken: null };
  }

  if (user.isBlocked) {
    throw new ApiError(403, "Account is blocked");
  }

  // Generate a secure random token
  const resetToken = crypto.randomBytes(32).toString('hex');
  
  // Hash the token before storing (for security)
  const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  
  // Set token and expiry (15 minutes from now)
  user.passwordResetToken = hashedToken;
  user.passwordResetExpires = Date.now() + 15 * 60 * 1000; // 15 minutes
  
  await user.save();

  // Return the unhashed token for email (only this time)
  return { user, resetToken };
};

export const resetPassword = async (token, newPassword) => {
  if (!token || !newPassword) {
    throw new ValidationError("Token and new password are required");
  }

  if (newPassword.length < 6) {
    throw new ValidationError("Password must be at least 6 characters long");
  }

  // Hash the token to compare with stored hash
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() }, // Token must not be expired
  });

  if (!user) {
    throw new ApiError(400, "Invalid or expired reset token");
  }

  if (user.isDeleted) {
    throw new ApiError(404, "User not found");
  }

  if (user.isBlocked) {
    throw new ApiError(403, "Account is blocked");
  }

  // Update password and clear reset fields
  user.password = newPassword;
  user.passwordResetToken = null;
  user.passwordResetExpires = null;
  
  // Invalidate all existing refresh tokens for security
  user.refreshToken = null;
  user.tokenVersion = (user.tokenVersion || 0) + 1;
  
  await user.save();

  // Return user without sensitive fields
  const safeUser = {
    _id: user._id,
    email: user.email,
    name: user.name,
    role: user.role,
  };

  return safeUser;
};
