import * as logService from "../services/activityLog.service.js";
import Role from "../models/role.model.js";

export const getLogs = async (req, res, next) => {
  try {
    let {
      page,
      limit,
      action,
      resource,
      status,
      userId,
      fromDate,
      toDate,
      search,
    } = req.query;

    // Get the current user's role
    const userRole = await Role.findById(req.user.role);

    // If the user is not an admin, restrict the query to only their logs
    if (!userRole || userRole.name !== "admin") {
      userId = req.user._id;
    }

    const result = await logService.getLogs({
      page,
      limit,
      action,
      resource,
      status,
      userId,
      fromDate,
      toDate,
      search,
    });

    return res.status(200).json({
      success: true,
        ...result,
    });
  } catch (error) {
    next(error);
  }
};
