import * as authService from "../services/auth.service.js";
import emailService from "../services/email.service.js";

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
      message:"Logged in successful",
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

export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    
    // Generate reset token and send email
    const resetResult = await authService.generatePasswordResetToken(email);
    
    if (resetResult.user) {
      // Send password reset email (async - don't block response)
      emailService.sendPasswordResetEmail(resetResult.user, resetResult.resetToken).catch(error => {
        console.error('Failed to send password reset email:', error.message);
      });
    }
    
    // Always return success to prevent email enumeration attacks
    res.status(200).json({
      success: true,
      message: "If an account with that email exists, a password reset link has been sent.",
    });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { token, newPassword } = req.body;
    
    const user = await authService.resetPassword(token, newPassword);
    
    // Send confirmation email (async)
    emailService.sendAccountStatusEmail(user, 'reactivated').catch(error => {
      console.error('Failed to send password reset confirmation email:', error.message);
    });
    
    res.status(200).json({
      success: true,
      message: "Password reset successfully",
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