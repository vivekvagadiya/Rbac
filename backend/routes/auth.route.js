const express = require("express");
const router = express.Router();
const authController = require("../controller/auth.controller");
const { authenticate } = require("../middleware/auth.middleware");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/refresh", authController.refreshToken);
router.post("/logout", authController.logout);
router.get("/profile", authenticate, authController.getCurrentUser);

module.exports = router;
