const express=require("express");
const router=express.Router();
const dashboardController=require("../controller/dashboard.controller")
const { authenticate } = require("../middleware/auth.middleware");

router.get("/stats", authenticate, dashboardController.getDashboardStats)

module.exports=router;