import * as authService from "../services/auth.service.js";

export const register = async (req, res, next) => {
  try {
    const user = await authService.registerUser(req.body);

    res.status(201).json({
      success: true,
      data: user,
    });
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
      user:safeUser,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    next(error);
  }
};
