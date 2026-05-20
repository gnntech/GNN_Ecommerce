const express = require("express");
const router = express.Router();
const { protect, admin } = require("../middleware/authMiddleware");
const {
    getAllOrders,
    getOrderById,
    updateOrderStatus,
} = require("../controllers/orderController");
const { orderLimiter } = require("../middleware/rateLimitMiddleware");

// Admin routes with rate limiting
router.route("/").get(protect, admin, orderLimiter, getAllOrders);
router.route("/:id").get(protect, admin, getOrderById);
router.route("/:id/status").put(protect, admin, orderLimiter, updateOrderStatus);

module.exports = router;
