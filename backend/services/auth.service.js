import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import { generateTokens } from "../utils/generateTokens.js";
import bcrypt from "bcrypt"

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

  const safeUser = {
    _id: user._id,
    email: user.email,
    role: user.role,
  };

  return { user: safeUser, ...tokens };
};