const express = require("express");
const router = express.Router();
const paymentController = require("../controller/payment.controller.js");
const { authenticate } = require("../middleware/auth.middleware.js");
const { validate } = require("../middleware/validation.middleware.js");
const { createPaymentSchema, verifyPaymentSessionSchema } = require("../validators/payment.validation.js");

// CREATE CHECKOUT SESSION
router.post(
  "/create-checkout-session",
  authenticate,
  validate(createPaymentSchema),
  paymentController.createCheckoutSession
);

// STRIPE WEBHOOK
router.post(
  "/webhook",
  express.raw({ type: 'application/json' }),
  paymentController.handleWebhook
);

// VERIFY PAYMENT SESSION
router.get(
  "/verify-session/:sessionId",
  authenticate,
  validate(verifyPaymentSessionSchema),
  paymentController.verifyPaymentSession
);

module.exports = router;
