const express = require("express");
const router = express.Router();
const activityLogController = require("../controller/activityLogController.js");
const { authenticate } = require("../middleware/auth.middleware.js");
const { checkPermission } = require("../middleware/permission.middleware.js");

router.get(
  "/",
  authenticate,
  checkPermission("activity.read"), // define this permission
  activityLogController.getLogs
);

module.exports = router;