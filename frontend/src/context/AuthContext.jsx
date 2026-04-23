import React, { createContext, useEffect, useState } from "react";
import { tokenService } from "../api/tokenService";
import api from "../api/axios";
import { loginApi, logoutApi } from "../api/authApi";

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  console.log('user',user);
  
  const [loading, setLoading] = useState(true);

  // 🔄 INIT (auto login on reload)
  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = tokenService.getAccessToken();

        if (!token) {
          setLoading(false);
          return;
        }

        // fetch user profile (recommended endpoint)
        const res = await api.get("/auth/me");

        setUser(res.data.data);
      } catch (err) {
        tokenService.clearTokens();
        console.log(err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // 🔐 LOGIN
  const login = async (credentials) => {
    const res = await loginApi(credentials);

    setUser(res.user); // already safeUser from backend
  };

  // 🔓 LOGOUT
  const logout = async () => {
    try {
      await logoutApi();
    } catch (err) {
        console.log(err);
      // ignore backend error
    }

    tokenService.clearTokens();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};