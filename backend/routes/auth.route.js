const express = require("express");
const router = express.Router();
const authController = require("../controller/auth.controller");
const { authenticate } = require("../middleware/auth.middleware");
const { withActivityLog } = require("../utils/withActivityLog.js");

// REGISTER (optional logging)
router.post(
  "/register",
  withActivityLog(authController.register, (req, result, err) => ({
    action: "REGISTER_USER",
    resource: "AUTH",
    resourceId: result?._id || null,
    userId: result?._id || null,
    description: err
      ? `Failed to register: ${err.message}`
      : `User registered`,
    metadata: {
      email: req.body?.email,
    },
  }))
);

// LOGIN (important)
router.post(
  "/login",
  withActivityLog(authController.login, (req, result, err) => ({
    action: "LOGIN",
    resource: "AUTH",
    resourceId: result?._id || null,
    userId: result?._id || null,
    description: err
      ? `Failed login attempt`
      : `User logged in`,
    metadata: {
      email: req.body?.email,
      ip: req.ip,
    },
  }))
);

// REFRESH TOKEN (skip logging – too frequent)
// router.post("/refresh", authController.refreshToken);
router.post("/refresh", authController.refreshToken);

// LOGOUT (important)
router.post(
  "/logout",
  authenticate,
  withActivityLog(authController.logout, (req, result, err) => ({
    action: "LOGOUT",
    resource: "AUTH",
    resourceId: req.user?._id,
    description: err
      ? `Failed logout`
      : `User logged out`,
  }))
);

// PROFILE (no logging)
router.get(
  "/profile",
  authenticate,
  authController.getCurrentUser
);

// FORGOT PASSWORD (public endpoint)
router.post(
  "/forgot-password",
  withActivityLog(authController.forgotPassword, (req, result, err) => ({
    action: "FORGOT_PASSWORD",
    resource: "AUTH",
    description: err
      ? `Failed password reset request`
      : `Password reset requested`,
    metadata: {
      email: req.body?.email,
      ip: req.ip,
    },
  }))
);

// RESET PASSWORD (public endpoint)
router.post(
  "/reset-password",
  withActivityLog(authController.resetPassword, (req, result, err) => ({
    action: "RESET_PASSWORD",
    resource: "AUTH",
    description: err
      ? `Failed password reset`
      : `Password reset completed`,
    metadata: {
      ip: req.ip,
    },
  }))
);

module.exports = router;