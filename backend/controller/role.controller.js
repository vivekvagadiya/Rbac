import mongoose from "mongoose";
import * as roleService from "../services/role.service.js";

export const createRole = async (req, res, next) => {
  try {
    const { name, permissions } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Role name is required" });
    }

    if (!Array.isArray(permissions)) {
      return res.status(400).json({
        message: "Permissions must be an array",
      });
    }

    //  Validate ObjectIds
    if (!permissions.every(id => mongoose.Types.ObjectId.isValid(id))) {
      return res.status(400).json({
        message: "Invalid permission IDs",
      });
    }

    const role = await roleService.createRole({ name, permissions });

    res.status(201).json(role);
  } catch (error) {
    next(error);
  }
};

export const getRoles = async (req, res, next) => {
  try {
    const roles = await roleService.getRoles();
    res.status(200).json(roles);
  } catch (error) {
    next(error);
  }
};

export const deleteRole = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Valid Role ID is required" });
    }

    const role = await roleService.deleteRole(id);

    if (!role) {
      return res.status(404).json({ message: "Role not found" });
    }

    res.status(200).json({ message: "Role deleted", role });
  } catch (error) {
    next(error);
  }
};

export const updateRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, permissions } = req.body;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Valid Role ID is required" });
    }

    //  At least one field must be provided
    if (!name && !permissions) {
      return res.status(400).json({
        message: "Provide at least one field to update",
      });
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

    const role = await roleService.updateRole(id, { name, permissions });

    if (!role) {
      return res.status(404).json({ message: "Role not found" });
    }

    res.status(200).json(role);
  } catch (error) {
    next(error);
  }
};