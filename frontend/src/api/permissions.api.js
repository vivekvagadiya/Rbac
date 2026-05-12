import api from "./axios";
import { endpoints } from "./endpoints";

export const getPermissions = async () => {
  try {
    const response = await api.get(endpoints.permissions.getPermissions);
    return response?.data;
  } catch (error) {
    throw error?.errors?.[0] || error;
  }
};
