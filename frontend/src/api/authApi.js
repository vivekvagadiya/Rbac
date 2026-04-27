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
    throw error.response?.data || error.message || "";
  }
};

export const logoutApi = () => {
  tokenService.clearTokens();
};
