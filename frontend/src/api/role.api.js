import api from "./axios";
import { endpoints } from "./endpoints";

export const getRoles = async () => {
  try {
    const response = await api.get(endpoints.roles.getRoles);
    return response?.data;
  } catch (error) {
    return error?.message;
  }
};
