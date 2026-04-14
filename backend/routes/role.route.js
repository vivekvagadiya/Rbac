const express = require("express");
const router = express.Router();
const roleController = require("../controller/role.controller.js");

router.post("/create", roleController.createRole);
router.get("/", roleController.getRoles);
router.delete("/:id", roleController.deleteRole);
router.put("/:id", roleController.updateRole);

module.exports = router;
