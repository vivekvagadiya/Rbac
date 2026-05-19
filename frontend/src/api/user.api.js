import api from "./axios";
import { endpoints } from "./endpoints";

export const getUserProfile = async () => {
  try {
    const response = await api.get(endpoints.user.profile);
    return response.data.data;
  } catch (error) {
    throw error?.errors?.[0] || error;
  }
};

export const getAllUsers = async (params) => {
  try {
    const response = await api.get(endpoints.user.users, { params });
    return response.data;
  } catch (error) {
    throw error?.errors?.[0] || error;
  }
};

export const createUser = async (payload) => {
  try {
    const response = await api.post(endpoints.user.createUser, payload);
    return response?.data;
  } catch (error) {
    throw error?.errors?.[0] || error;
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
    throw error?.errors?.[0] || error;
  }
};
export const deleteUserApi = async (id) => {
  try {
    const response = await api.delete(
      endpoints.user.deleteUser.replace(":id", id),
    );
    return response?.data;
  } catch (error) {
    throw error?.errors?.[0] || error;
  }
};

export const uploadPicture = async (data) => {
  try {
    const response = await api.post(endpoints.user.uploadPicture, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response?.data;
  } catch (error) {
    throw error?.errors?.[0] || error;
  }
};
