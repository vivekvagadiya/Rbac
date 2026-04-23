// src/api/axiosInstance.js

import axios from "axios";
import { tokenService } from "./tokenService";

//  Main API client
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

//  Separate client for refresh (NO interceptors)
const refreshClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

let isRefreshing = false;
let refreshSubscribers = [];

//  Notify queued requests
const onRefreshed = (newToken) => {
  refreshSubscribers.forEach((callback) => callback(newToken));
  refreshSubscribers = [];
};

//  Add subscriber
const addSubscriber = (callback) => {
  refreshSubscribers.push(callback);
};

// ============================
//  REQUEST INTERCEPTOR
// ============================
api.interceptors.request.use(
  (config) => {
    const token = tokenService.getAccessToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ============================
//  RESPONSE INTERCEPTOR
// ============================
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    //  If no response → network error
    if (!error.response) {
      return Promise.reject(error);
    }

    //  Only handle 401
    if (error.response.status !== 401) {
      return Promise.reject(error.response?.data || error);
    }

    //  Prevent refresh loop
    if (originalRequest._retry) {
      return Promise.reject(error.response?.data || error);
    }
    //  Do NOT retry refresh endpoint
    if (originalRequest.url.includes("/auth/refresh")) {
      return Promise.reject(error.response?.data || error);
    }

    originalRequest._retry = true;

    //  If already refreshing → queue request
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
        throw new Error("No refresh token available");
      }

      //  Call refresh API (using separate client)
      const response = await refreshClient.post("/auth/refresh", {
        refreshToken,
      });

      const { accessToken, refreshToken: newRefreshToken } =
        response.data.data;

      //  Save new tokens
      tokenService.setTokens({
        accessToken,
        refreshToken: newRefreshToken,
      });

      //  Retry all queued requests
      onRefreshed(accessToken);

      //  Retry original request
      originalRequest.headers.Authorization = `Bearer ${accessToken}`;

      return api(originalRequest);
    } catch (err) {
      //  Clear subscribers to avoid memory leak
      refreshSubscribers = [];

      //  Logout user
      tokenService.clearTokens();

      //  Temporary (will replace with AuthContext later)
      window.location.href = "/login";

      return Promise.reject(err.response?.data || err);
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;