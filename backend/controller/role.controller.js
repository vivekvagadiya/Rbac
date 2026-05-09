import mongoose from "mongoose";
import * as roleService from "../services/role.service.js";

export const createRole = async (req, res, next) => {
  try {
    const { name, permissions } = req.body;

    const role = await roleService.createRole({ name, permissions });

    res.status(201).json({
      success: true,
      data: role,
      message: "Role created successfully",
    });
    return role;
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

    const role = await roleService.updateRole(id, { name, permissions });

    res.status(200).json({
      success: true,
      data: role,
      message: "Role updated successfully",
    });
    return role;
  } catch (error) {
    next(error);
  }
};

export const deleteRole = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await roleService.deleteRole(id);

    return {
      status: 200,
      success: true,
      message: result.message,
    };
  } catch (error) {
    throw error;
  }
};
