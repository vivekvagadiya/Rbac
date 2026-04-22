import mongoose from "mongoose";
import * as roleService from "../services/role.service.js";

export const createRole = async (req, res, next) => {
  try {
    const { name, permissions } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Role name is required" });
    }

    if (permissions && !Array.isArray(permissions)) {
      return res.status(400).json({
        message: "Permissions must be an array",
      });
    }

    if (permissions && !permissions.every(id => mongoose.Types.ObjectId.isValid(id))) {
      return res.status(400).json({
        message: "Invalid permission IDs",
      });
    }

    const role = await roleService.createRole({ name, permissions });

    return res.status(201).json({
      success: true,
      data: role,
    });
  } catch (error) {
    next(error);
  }
};

export const getRoles = async (req, res, next) => {
  try {
    const roles = await roleService.getRoles();

    return res.status(200).json({
      success: true,
      data: roles,
    });
  } catch (error) {
    next(error);
  }
};

export const updateRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, permissions } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid role ID" });
    }

    if (!name && !permissions) {
      return res.status(400).json({
        message: "Provide at least one field to update",
      });
    }

    const role = await roleService.updateRole(id, { name, permissions });

    return res.status(200).json({
      success: true,
      data: role,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteRole = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid role ID" });
    }

    const result = await roleService.deleteRole(id);

    return res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    next(error);
  }
};