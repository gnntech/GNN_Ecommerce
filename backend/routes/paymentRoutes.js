const express = require("express");
const router = express.Router();
const {
    createOrder,
    verifyPayment,
} = require("../controllers/paymentController");
const { paymentLimiter } = require("../middleware/rateLimitMiddleware");

// Apply strict rate limiting to payment endpoints
router.post("/create-order", paymentLimiter, createOrder);
router.post("/verify-payment", paymentLimiter, verifyPayment);

module.exports = router;
