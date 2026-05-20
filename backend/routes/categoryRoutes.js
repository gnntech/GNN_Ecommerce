const express = require("express");
const router  = express.Router();
const { getCategories, createCategory, updateCategory, deleteCategory } = require("../controllers/categoryController");
const { protect, admin } = require("../middleware/authMiddleware");
const { publicLimiter }  = require("../middleware/rateLimitMiddleware");

// Public — Navbar fetches this
router.get("/", publicLimiter, getCategories);

// Admin only
router.post("/",    protect, admin, createCategory);
router.put("/:id",  protect, admin, updateCategory);
router.delete("/:id", protect, admin, deleteCategory);

module.exports = router;
