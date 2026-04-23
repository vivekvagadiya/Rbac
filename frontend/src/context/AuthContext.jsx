import React, { createContext, useEffect, useState } from "react";
import { tokenService } from "../api/tokenService";
import api from "../api/axios";
import { loginApi, logoutApi } from "../api/authApi";

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  console.log('user', user);

  const [loading, setLoading] = useState(true);

  const fetchUserProfile = async () => {
    try {
      const res = await api.get("/auth/me");
      setUser(res.data.data);
      return res.data.data;
    } catch (err) {
      tokenService.clearTokens();
      setUser(null);
      throw err;
    }
  };

  //  INIT (auto login on reload)
  useEffect(() => {
    const initAuth = async () => {
      const token = tokenService.getAccessToken();
      if (token) {
        try {
          await fetchUserProfile();
        } catch (e) { /* Error handled in fetchUserProfile */
          console.log(e);

        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  //  LOGIN
  const login = async (credentials) => {
    // eslint-disable-next-line no-unused-vars
    const res = await loginApi(credentials);
    const userData = await fetchUserProfile(); 
    
    return userData; // 🔥 Return this so the component can wait for it
  };

  //  LOGOUT
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