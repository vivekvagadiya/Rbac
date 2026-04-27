import * as userService from "../services/user.service.js";
import ApiError from "../utils/ApiError.js";

export const createUser = async (req, res, next) => {
  try {
    const { name, email, password, roleId ,isBlocked} = req.body;

    // =========================
    // 1. Basic Validation (fallback)
    // =========================
    if (!name || !email || !password || !roleId ||!isBlocked) {
      return next(new ApiError(400, "All fields are required"));
    }

    // =========================
    // 2. Call Service
    // =========================
    const user = await userService.createUser(req.body);

    // =========================
    // 3. Send Response
    // =========================
    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};
// ✅ Get All Users (with pagination)
export const getUsers = async (req, res, next) => {
  try {
    const { page, limit } = req.query;

    const result = await userService.getUsers(req.query);

    res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      data: result.users,
      meta: {
        total: result.total,
        page: result.page,
        pages: result.pages,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ✅ Get Single User
export const getUserById = async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.params.id);

    res.status(200).json({
      success: true,
      message: "User fetched successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// ✅ Update User
export const updateUser = async (req, res, next) => {
  try {
    const allowedFields = ["name", "email", "roleId", "password",'isBlocked'];

    const filteredData = {};

    for (let key of allowedFields) {
      if (req.body[key] !== undefined) {
        filteredData[key] = req.body[key];
      }
    }

    const user = await userService.updateUser(req.params.id, filteredData);

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// ✅ Delete User (Soft Delete)
export const deleteUser = async (req, res, next) => {
  try {
    if (req.user._id === req.params.id) {
      throw new ApiError(400, "You cannot perform this action on yourself");
    }
    await userService.deleteUser(req.params.id);

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// ✅ Assign Role
export const assignRoleToUser = async (req, res, next) => {
  try {
    const { roleId } = req.body;

    if (req.user._id === req.params.id) {
      throw new ApiError(400, "You cannot perform this action on yourself");
    }

    const user = await userService.assignRoleToUser(req.params.id, roleId);

    res.status(200).json({
      success: true,
      message: "Role assigned successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// ✅ Block / Unblock User
export const toggleBlockUser = async (req, res, next) => {
  try {
    const { isBlocked } = req.body;

    if (req.user._id === req.params.id) {
      throw new ApiError(400, "You cannot perform this action on yourself");
    }

    const user = await userService.toggleBlockUser(req.params.id, isBlocked);

    res.status(200).json({
      success: true,
      message: isBlocked
        ? "User blocked successfully"
        : "User unblocked successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};
