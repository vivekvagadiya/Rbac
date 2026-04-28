import * as permissionService from "../services/permission.service.js";

export const getPermissions = async (req, res, next) => {
  try {
    const permissions = await permissionService.getPermissions();
    return res.status(200).json({
      success: true,
      data: permissions,
    });
  } catch (error) {
    next(error);
  }
};
