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

export const getAllUsers = async (params) => {
  try {
    const response = await api.get(endpoints.user.users, { params });
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data || "failed");
  }
};

export const createUser = async (payload) => {
  try {
    const response = await api.post(endpoints.user.createUser, payload);
    return response?.data;
  } catch (error) {
    return error?.message;
  }
};

export const updateUser = async (id, payload) => {
  try {
    const response = await api.put(
      endpoints.user.updateUser.replace(":id", id),
      payload,
    );
    return response?.data;
  } catch (error) {
    return error?.message;
  }
};
export const deleteUserApi = async (id) => {
  try {
    const response = await api.delete(
      endpoints.user.deleteUser.replace(":id", id),
    );
    return response?.data;
  } catch (error) {
    return error?.message;
  }
};
