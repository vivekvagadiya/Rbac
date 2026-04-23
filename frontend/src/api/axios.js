// src/api/axiosInstance.js

import axios from "axios";
import { tokenService } from "./tokenService";

const api = axios.create({
  baseURL: import.meta.env.API_BASE_URL,
  withCredentials: true, // for refresh token if cookie-based
});

let isRefreshing = false;
let refreshSubscribers = [];

// 🔁 Notify all queued requests
const onRefreshed = (newToken) => {
  refreshSubscribers.forEach((callback) => callback(newToken));
  refreshSubscribers = [];
};

// ➕ Add subscriber
const addSubscriber = (callback) => {
  refreshSubscribers.push(callback);
};

// 📤 REQUEST INTERCEPTOR
api.interceptors.request.use(
  (config) => {
    const token = tokenService.getAccessToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// 📥 RESPONSE INTERCEPTOR
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If not 401 → reject
    if (error.response?.status !== 401) {
      return Promise.reject(error);
    }

    // Prevent infinite loop
    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    // 🔁 If already refreshing → queue request
    if (isRefreshing) {
      return new Promise((resolve) => {
        addSubscriber((newToken) => {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          resolve(api(originalRequest));
        });
      });
    }

    isRefreshing = true;

    try {
      const refreshToken = tokenService.getRefreshToken();

      if (!refreshToken) {
        throw new Error("No refresh token");
      }

      // 🔄 Call refresh API
      const response = await api.post("/auth/refresh", {
        refreshToken,
      });

      const { accessToken, refreshToken: newRefreshToken } = response.data;

      // Save new tokens
      tokenService.setTokens({
        accessToken,
        refreshToken: newRefreshToken,
      });

      // Notify queued requests
      onRefreshed(accessToken);

      // Retry original request
      originalRequest.headers.Authorization = `Bearer ${accessToken}`;

      return api(originalRequest);
    } catch (err) {
      // Logout user
      tokenService.clearTokens();
      window.location.href = "/login";

      return Promise.reject(err);
    } finally {
      isRefreshing = false;
    }
  },
);

export default api;
