const express = require("express");
const router = express.Router();
const orderController = require("../controller/order.controller.js");
const { authenticate } = require("../middleware/auth.middleware.js");
const { checkPermission } = require("../middleware/permission.middleware.js");
const { validateObjectId } = require("../middleware/validateId.middleware.js");

router.post(
  "/",
  authenticate,
  checkPermission("order.create"),
  orderController.createOrder,
);

router.get(
  "/",
  authenticate,
  checkPermission("order.read"),
  orderController.getOrders,
);

router.put(
  "/:id/status",
  authenticate,
  validateObjectId,
  checkPermission("order.update"),
  orderController.updateOrderStatus,
);

router.get(
  "/:id",
  authenticate,
  validateObjectId,
  checkPermission("order.read"),
  orderController.getOrderById
)

router.post(
  "/:id/refund",
  authenticate,
  validateObjectId,
  checkPermission("order.update"),
  orderController.refundOrder,
);
module.exports = router;
