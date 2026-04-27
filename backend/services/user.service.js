import User from "../models/user.model.js";
import Role from "../models/role.model.js";
import ApiError from "../utils/ApiError.js";

//  Create User (Admin side)
export const createUser = async (data) => {
  const { email } = data;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(400, "User already exists");
  }

  const user = await User.create(data);
  return user;
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
  const user = await User.findOneAndUpdate(
    { _id: userId, isDeleted: false },
    data,
    { new: true },
  );

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return user;
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
