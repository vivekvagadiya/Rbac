const express = require("express");
const router = express.Router();
const userController = require("../controller/user.controller");
const { authenticate } = require("../middleware/auth.middleware");
const { checkPermission } = require("../middleware/permission.middleware.js");
const { validateObjectId } = require("../middleware/validateId.middleware.js");
const { withActivityLog } = require("../utils/withActivityLog.js");

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
  checkPermission("user.update"),
  validateObjectId,
  withActivityLog(userController.updateUser, (req, result, err) => ({
    action: "UPDATE_USER",
    resource: "USER",
    resourceId: req.params.id,
    description: err
      ? `Failed to update user: ${err.message}`
      : `User updated`,
    metadata: {
      updatedFields: req.body,
    },
  })),
);

router.post(
  "/",
  authenticate,
  checkPermission("user.create"),
  withActivityLog(userController.createUser, (req, result, err) => ({
    action: "CREATE_USER",
    resource: "USER",
    resourceId: result?._id || null,
    description: err
      ? `Failed to create user: ${err.message}`
      : `User created`,
    metadata: {
      body: req.body,
    },
  })),
);

router.delete(
  "/:id",
  authenticate,
  checkPermission("user.delete"),
  validateObjectId,
  withActivityLog(userController.deleteUser, (req, result, err) => ({
    action: "DELETE_USER",
    resource: "USER",
    resourceId: req.params.id,
    description: err
      ? `Failed to delete user: ${err.message}`
      : `User ${req.params.id} deleted`,
  })),
);

router.patch(
  "/:id/role",
  authenticate,
  checkPermission("user.update"),
  validateObjectId,
  withActivityLog(userController.assignRoleToUser, (req, result, err) => ({
    action: "ASSIGN_ROLE_TO_USER",
    resource: "USER",
    resourceId: req.params.id,
    description: err
      ? `Failed to assign role: ${err.message}`
      : `Role assigned to user`,
    metadata: {
      updatedFields: req.body,
    },
  })),
);

router.patch(
  "/:id/block",
  authenticate,
  checkPermission("user.update"),
  validateObjectId,
  withActivityLog(userController.toggleBlockUser, (req, result, err) => ({
    action: "TOGGLE_BLOCK_USER",
    resource: "USER",
    resourceId: req.params.id,
    description: err
      ? `Failed to change block status: ${err.message}`
      : `User block status changed`,
    metadata: {
      updatedFields: req.body,
    },
  })),
);

module.exports = router;
