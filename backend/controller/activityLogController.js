import * as logService from "../services/activityLog.service.js";

export const getLogs = async (req, res, next) => {
  try {
    const {
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
