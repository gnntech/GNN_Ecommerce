const express = require("express");
const router = express.Router();
const { authUser, registerAdmin } = require("../controllers/authController");
const { authLimiter } = require("../middleware/rateLimitMiddleware");

// Apply strict rate limiting to authentication endpoints
router.post("/login", authLimiter, authUser);
router.post("/register-admin", authLimiter, registerAdmin); // Use cautiously

module.exports = router;
