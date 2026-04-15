import User from "../models/user.model.js";
import { generateTokens } from "../utils/generateTokens.js";

export const registerUser = async (data) => {
  const userExist = await User.findOne({ email: data.email });

  if (userExist) {
    throw new Error("User already exists");
  }
  const salt = 10;
  const hashedPassword = await bcrypt.hash(data.password, salt);

  const user = await User.create({ ...data, password: hashedPassword });
  return user;
};

export const loginUser = async (email, password) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("Invalid Credentials");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Invalid Credentials");
  }

  const tokens = generateTokens(user);

  return { user, ...tokens };
};
