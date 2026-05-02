import api from "./axios";
import { endpoints } from "./endpoints";

export const getDashboardStats = async () => {
  try {
    const response = await api.get("/dashboard/stats");
    return response.data;
  } catch (error) {
    return error?.response;
  }
};

export const getActivityLog = async (params) => {
  try {
    const response = await api.get(endpoints.dashboard.activityStats, {
      params,
    });
    return response?.data;
  } catch (error) {
    return error?.message;
  }
};
