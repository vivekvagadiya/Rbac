const express = require("express");
const router = express.Router();
const permissionController = require("../controller/permission.controller");
const { authenticate } = require("../middleware/auth.middleware");

router.get("/", authenticate, permissionController.getPermissions);
module.exports=router