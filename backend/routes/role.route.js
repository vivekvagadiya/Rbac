const express = require("express");
const router = express.Router();
const roleController = require("../controller/role.controller.js");
const { authenticate } = require("../middleware/auth.middleware.js");
const { validateObjectId } = require("../middleware/validateId.middleware.js");

router.post("/create",authenticate, roleController.createRole);
router.get("/", authenticate,roleController.getRoles);
router.delete("/:id",validateObjectId,authenticate, roleController.deleteRole);
router.put("/:id",validateObjectId,authenticate, roleController.updateRole);

module.exports = router;
