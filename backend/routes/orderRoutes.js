const express = require("express");
const router = express.Router();
const { protect, admin } = require("../middleware/authMiddleware");
const {
    getAllOrders,
    getOrderById,
    updateOrderStatus,
} = require("../controllers/orderController");

// Admin routes
router.route("/").get(protect, admin, getAllOrders);
router.route("/:id").get(protect, admin, getOrderById);
router.route("/:id/status").put(protect, admin, updateOrderStatus);

module.exports = router;
