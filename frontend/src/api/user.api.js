import api from "./axios";
import { endpoints } from "./endpoints";

export const getUserProfile = async () => {
  try {
    const response = await api.get(endpoints.user.profile);
    return response.data.data;
  } catch (error) {
    throw new Error(error?.response?.data || "failed");
  }
};
