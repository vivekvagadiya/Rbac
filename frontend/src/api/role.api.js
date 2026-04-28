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

export const createRole = async (data) => {
  try {
    const response = await api.post(endpoints.roles.createRole, data);
    return response?.data;
  } catch (error) {
    return error?.message;
  }
};

export const updateRole = async (id, data) => {
  try {
    const response = await api.put(
      endpoints.roles.updateRole.replace(":id", id),
      data,
    );
    return response?.data;
  } catch (error) {
    return error?.message;
  }
};
