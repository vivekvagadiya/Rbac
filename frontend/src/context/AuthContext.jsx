import React, {
  createContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";

import { tokenService } from "../api/tokenService";
import { loginApi, logoutApi } from "../api/authApi";
import { getUserProfile } from "../api/user.api";

// Context
// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext();

// Provider
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /**
   * 🔹 Fetch Logged-in User Profile
   */
  const fetchUserProfile = useCallback(async () => {
    try {
      const res = await getUserProfile();

      // ✅ Normalize response (important)
      const userData = res?.data || res;

      setUser(userData);
      return userData;
    } catch (error) {
      console.error("Fetch profile error:", error);

      // ❌ Invalid token → clear session
      tokenService.clearTokens();
      setUser(null);

      throw error;
    }
  }, []);

  /**
   * 🔹 Initialize Auth (Auto-login on reload)
   */
  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = tokenService.getAccessToken();

        if (token) {
          await fetchUserProfile();
        }
      } catch (error) {
        console.log(error);

        // already handled in fetchUserProfile
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, [fetchUserProfile]);

  /**
   * 🔹 Login
   */
  const login = useCallback(async (credentials) => {
    try {
      const res = await loginApi(credentials);

      // ✅ If backend returns token manually store it
      if (res?.accessToken) {
        tokenService.setAccessToken(res.accessToken);
      }

      const userData = await fetchUserProfile();
      return userData;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  }, [fetchUserProfile]);

  /**
   * 🔹 Logout
   */
  const logout = useCallback(async () => {
    try {
      await logoutApi();
    } catch (error) {
      console.warn("Logout API failed:", error);
    } finally {
      tokenService.clearTokens();
      setUser(null);
    }
  }, []);

  /**
   * 🔹 Derived State
   */
  const isAuthenticated = !!user;

  /**
   * 🔹 Memoized Context Value (VERY IMPORTANT)
   */
  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated,
      login,
      logout,
      refetchUser: fetchUserProfile, // useful for RBAC refresh
    }),
    [user, loading, isAuthenticated, login, logout, fetchUserProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};