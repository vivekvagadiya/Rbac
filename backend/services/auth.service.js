import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import { generateTokens } from "../utils/generateTokens.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
export const registerUser = async (data) => {
  const { email, password } = data;

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  const userExist = await User.findOne({ email });

  if (userExist) {
    throw new ApiError(409, "User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    ...data,
    password: hashedPassword,
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
    throw new ApiError(400, "Email and password are required");
  }

  const user = await User.findOne({ email }).populate("role");

  if (!user) {
    throw new ApiError(401, "Invalid credentials");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new ApiError(401, "Invalid credentials");
  }

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
  const user = await User.findOne({ _id: userId }).populate({
    path: "role",
    populate: { path: "permissions" },
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return user;
};
