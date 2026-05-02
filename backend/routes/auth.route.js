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
    resourceId: result?.user?._id || null,
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

module.exports = router;