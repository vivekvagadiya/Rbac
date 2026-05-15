import api from "./axios";
import { tokenService } from "./tokenService";

export const loginApi = async (data) => {
  try {
    const response = await api.post("/auth/login", data);
    if (response.data) {
      const { accessToken, refreshToken } = response.data.data;
      tokenService.setTokens({ accessToken, refreshToken });
    }
    return response.data;
  } catch (error) {
    throw error?.errors?.[0] || error;
  }
};

export const logoutApi = async () => {
  try {
    const response = await api.post("/auth/logout");
    return response?.data?.data;
  } catch (error) {
    throw error?.errors?.[0] || error;
  } finally {
    tokenService.clearTokens();
  }
};
