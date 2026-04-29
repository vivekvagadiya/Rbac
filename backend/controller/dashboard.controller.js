import * as dashboardService from "../services/dashboard.service.js"

export const getDashboardStats = async (req, res, next) => {
  try {
    const stats = await dashboardService.dashboardStats();

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (err) {
    next(err);
  }
};