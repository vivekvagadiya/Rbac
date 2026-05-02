const express = require("express");
const router = express.Router();
const roleController = require("../controller/role.controller.js");
const { authenticate } = require("../middleware/auth.middleware.js");
const { validateObjectId } = require("../middleware/validateId.middleware.js");
const { withActivityLog } = require("../utils/withActivityLog.js");

router.post(
  "/create",
  authenticate,
  withActivityLog(roleController.createRole, (req, result) => ({
    action: "CREATE_ROLE",
    resource: "ROLE",
    resourceId: result?._id,
    description: `Role '${result?.name}' created`,
    metadata: {
      body: req.body,
    },
  }))
);
router.get("/", authenticate, roleController.getRoles);
router.delete(
  "/:id",
  validateObjectId,
  authenticate,
  withActivityLog(roleController.deleteRole, (req) => ({
    action: "DELETE_ROLE",
    resource: "ROLE",
    resourceId: req.params.id,
    description: `Role deleted`,
  }))
);
router.put(
  "/:id",
  validateObjectId,
  authenticate,
  withActivityLog(roleController.updateRole, (req, result) => ({
    action: "UPDATE_ROLE",
    resource: "ROLE",
    resourceId: req.params.id,
    description: `Role updated`,
    metadata: {
      updatedFields: req.body,
    },
  }))
);

module.exports = router;
