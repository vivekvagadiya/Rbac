const express = require("express");
const router = express.Router();
const orderController = require("../controller/order.controller.js");
const { authenticate } = require("../middleware/auth.middleware.js");
const { checkPermission } = require("../middleware/permission.middleware.js");
const { validateObjectId } = require("../middleware/validateId.middleware.js");
const { withActivityLog } = require("../utils/withActivityLog.js");

// CREATE ORDER
router.post(
  "/",
  authenticate,
  checkPermission("order.create"),
  withActivityLog(orderController.createOrder, (req, result, err) => ({
    action: "CREATE_ORDER",
    resource: "ORDER",
    resourceId: result?._id || null,
    description: err
      ? `Failed to create order: ${err.message}`
      : `Order created`,
    metadata: {
      body: req.body,
    },
  }))
);

// GET ALL (no logging)
router.get(
  "/",
  authenticate,
  checkPermission("order.read"),
  orderController.getOrders
);

// STATUS SUMMARY (no logging)
router.get(
  "/status-summary",
  authenticate,
  checkPermission("order.read"),
  orderController.getOrderStatusSummaryController
);

// UPDATE ORDER STATUS
router.put(
  "/:id/status",
  authenticate,
  checkPermission("order.update"),
  validateObjectId,
  withActivityLog(orderController.updateOrderStatus, (req, result, err) => ({
    action: "UPDATE_ORDER_STATUS",
    resource: "ORDER",
    resourceId: req.params.id,
    description: err
      ? `Failed to update order status: ${err.message}`
      : `Order status updated`,
    metadata: {
      updatedFields: req.body,
    },
  }))
);

// GET BY ID (no logging)
router.get(
  "/:id",
  authenticate,
  checkPermission("order.read"),
  validateObjectId,
  orderController.getOrderById
);

// REFUND ORDER
router.post(
  "/:id/refund",
  authenticate,
  checkPermission("order.update"),
  validateObjectId,
  withActivityLog(orderController.refundOrder, (req, result, err) => ({
    action: "REFUND_ORDER",
    resource: "ORDER",
    resourceId: req.params.id,
    description: err
      ? `Failed to refund order: ${err.message}`
      : `Order refunded`,
    metadata: {
      reason: req.body?.reason || null,
    },
  }))
);

module.exports = router;