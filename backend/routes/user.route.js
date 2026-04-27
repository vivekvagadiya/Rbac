const express = require("express");
const router = express.Router();
const userController = require("../controller/user.controller");
const { authenticate } = require("../middleware/auth.middleware");
const { checkPermission } = require("../middleware/permission.middleware.js");
const { validateObjectId } = require("../middleware/validateId.middleware.js");

router.get(
  "/",
  authenticate,
  checkPermission("user.read"),
  userController.getUsers,
);

router.get(
  "/:id",
  authenticate,
  validateObjectId,
  checkPermission("user.read"),
  userController.getUserById,
);
router.put(
  "/:id",
  authenticate,
  validateObjectId,
  checkPermission("user.update"),
  userController.updateUser,
);

router.delete(
  "/:id",
  authenticate,
  validateObjectId,
  checkPermission("user.delete"),
  userController.deleteUser,
);

router.patch(
  "/:id/role",
  authenticate,
  validateObjectId,
  checkPermission("user.update"),
  userController.assignRoleToUser,
);

router.patch(
  "/:id/block",
  authenticate,
  validateObjectId,
  checkPermission("user.update"),
  userController.toggleBlockUser,
);

module.exports = router;
