const express = require("express");
const router = express.Router();
const {
    getGemstones,
    getGemstoneById,
    createGemstone,
    deleteGemstone,
    updateGemstone,
    getTrees,
    getTreeById,
    createTree,
    deleteTree,
    updateTree,
    getBracelets,
    getBraceletById,
    createBracelet,
    deleteBracelet,
    updateBracelet,
    searchProducts,
} = require("../controllers/productController");
const { protect, admin } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const { publicLimiter } = require("../middleware/rateLimitMiddleware");

// Search Route - with lenient rate limiting for public access
router.route("/search").get(publicLimiter, searchProducts);

// Gemstone Routes
router
    .route("/gemstones")
    .get(publicLimiter, getGemstones)
    .post(protect, admin, upload.single("image"), createGemstone);

router
    .route("/gemstones/:id")
    .get(publicLimiter, getGemstoneById)
    .delete(protect, admin, deleteGemstone)
    .put(protect, admin, upload.single("image"), updateGemstone);

// Tree Routes
router
    .route("/trees")
    .get(publicLimiter, getTrees)
    .post(protect, admin, upload.single("image"), createTree);

router
    .route("/trees/:id")
    .get(publicLimiter, getTreeById)
    .delete(protect, admin, deleteTree)
    .put(protect, admin, upload.single("image"), updateTree);

// Bracelet Routes
router
    .route("/bracelets")
    .get(publicLimiter, getBracelets)
    .post(protect, admin, upload.single("image"), createBracelet);

router
    .route("/bracelets/:id")
    .get(publicLimiter, getBraceletById)
    .delete(protect, admin, deleteBracelet)
    .put(protect, admin, upload.single("image"), updateBracelet);

module.exports = router;
