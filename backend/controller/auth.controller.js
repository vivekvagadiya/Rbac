import * as authService from "../services/auth.service.js";

export const register = async (req, res, next) => {
  try {
    const user = await authService.registerUser(req.body);

    res.status(201).json({
      success: true,
      data: user,
    });

    return user
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { user, accessToken, refreshToken } = await authService.loginUser(
      req.body.email,
      req.body.password,
    );
    const safeUser = {
      _id: user._id,
      email: user.email,
      role: user.role,
    };
    res.status(200).json({
      success: true,
      data: {
        user: safeUser,
        accessToken,
        refreshToken,
      },
    });

    return safeUser
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    const tokens = await authService.refreshUserToken(refreshToken);
    res.status(200).json({
      success: true,
      data: {
        ...tokens,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    const userId = req.user._id;
    await authService.logoutUser(userId);
    res.status(200).json({
      success: true,
      data: {
        message: "Logged out successfully",
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getCurrentUser = async (req, res, next) => {
  try {
    const user = await authService.getUserData(req.user._id);
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};