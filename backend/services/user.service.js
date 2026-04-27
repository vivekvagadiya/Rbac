import User from "../models/user.model.js";
import Role from "../models/role.model.js";
import ApiError from "../utils/ApiError.js";
import bcrypt from "bcryptjs";

//  Create User (Admin side)

export const createUser = async (data) => {
  let { name, email, password, roleId ,isBlocked} = data;

  // =========================
  // 1. Normalize Input
  // =========================
  name = name.trim();
  email = email.toLowerCase().trim();

  // =========================
  // 2. Check Duplicate Email
  // =========================
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(409, "User already exists");
  }

  // =========================
  // 3. Validate Role (RBAC)
  // =========================
  const role = await Role.findById(roleId);
  if (!role) {
    throw new ApiError(400, "Invalid role selected");
  }

  // =========================
  // 4. Hash Password
  // =========================
  const hashedPassword = await bcrypt.hash(password, 10);

  // =========================
  // 5. Create User
  // =========================
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role: roleId,
    isBlocked: isBlocked
  });

  // =========================
  // 6. Sanitize Response
  // =========================
  const userObj = user.toObject();
  delete userObj.password;

  return userObj;
};

//  Get All Users (with pagination + filtering)
export const getUsers = async (query) => {
  let { page = 1, limit = 10, search, role, status } = query;

  // ✅ sanitize inputs
  page = Math.max(1, parseInt(page) || 1);
  limit = Math.min(50, Math.max(1, parseInt(limit) || 10));

  const skip = (page - 1) * limit;

  // =====================
  // 🔍 Build Query
  // =====================
  const filter = {
    isDeleted: false,
  };

  // 🔍 Search (name + email)
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }

  // 🎭 Role filter
  if (role) {
    const roleDoc = await Role.findOne({ name: role });

    if (!roleDoc) {
      return {
        users: [],
        total: 0,
        page,
        limit,
        pages: 0,
      };
    }

    filter.role = roleDoc._id;
  }

  // 📌 Status filter
  if (status === "active") {
    filter.isBlocked = false;
  } else if (status === "blocked") {
    filter.isBlocked = true;
  }

  // =====================
  // 📦 Fetch Data
  // =====================
  const users = await User.find(filter)
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 }) // latest first
    .populate({
      path: "role",
      select: "name", // optimize
    })
    .lean(); // performance boost

  const total = await User.countDocuments(filter);

  return {
    users,
    total,
    page,
    limit,
    pages: Math.ceil(total / limit),
  };
};

//  Get Single User
export const getUserById = async (userId) => {
  const user = await User.findOne({ _id: userId, isDeleted: false }).populate({
    path: "role",
    populate: { path: "permissions" },
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return user;
};

//  Update User
export const updateUser = async (userId, data) => {
  const updateData = {};

  // =========================
  // 1. Name
  // =========================
  if (data.name) {
    updateData.name = data.name.trim();
  }

  // =========================
  // 2. Email
  // =========================
  if (data.email) {
    const email = data.email.toLowerCase().trim();

    const existingUser = await User.findOne({
      email,
      _id: { $ne: userId }, // exclude current user
    });

    if (existingUser) {
      throw new ApiError(409, "Email already in use");
    }

    updateData.email = email;
  }

  if(data.isBlocked!==undefined){
    updateData.isBlocked=data.isBlocked;
  }

  // =========================
  // 3. Role (RBAC)
  // =========================
  if (data.roleId) {
    const role = await Role.findById(data.roleId);
    if (!role) {
      throw new ApiError(400, "Invalid role selected");
    }

    updateData.role = data.roleId; // 🔥 map roleId → role
  }

  // =========================
  // 4. Password (optional)
  // =========================
  if (data.password) {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    updateData.password = hashedPassword;
  }

  // =========================
  // 5. Update User
  // =========================
  const user = await User.findOneAndUpdate(
    { _id: userId, isDeleted: false },
    updateData,
    { new: true },
  );

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // =========================
  // 6. Remove Sensitive Data
  // =========================
  const userObj = user.toObject();
  delete userObj.password;

  return userObj;
};

//  Soft Delete User
export const deleteUser = async (userId) => {
  const user = await User.findByIdAndUpdate(
    userId,
    { isDeleted: true },
    { new: true },
  );

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return user;
};

//  Assign Role to User
export const assignRoleToUser = async (userId, roleId) => {
  const role = await Role.findById(roleId);
  if (!role) {
    throw new ApiError(404, "Role not found");
  }

  const user = await User.findOneAndUpdate(
    { _id: userId, isDeleted: false },
    { role: roleId },
    { new: true },
  ).populate("role");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return user;
};

//  Block / Unblock User
export const toggleBlockUser = async (userId, isBlocked) => {
  const user = await User.findOneAndUpdate(
    { _id: userId, isDeleted: false },
    { isBlocked },
    { new: true },
  );

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return user;
};
