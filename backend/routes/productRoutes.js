const express = require("express");
const router = express.Router();
const {
    // Unified product endpoints
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    updateProductStatus,
    updateProductStock,
    
    // Category-specific endpoints (backward compatibility)
    getGemstones,
    getGemstoneById,
    createGemstone,
    updateGemstone,
    deleteGemstone,
    getTrees,
    getTreeById,
    createTree,
    updateTree,
    deleteTree,
    getBracelets,
    getBraceletById,
    createBracelet,
    updateBracelet,
    deleteBracelet,
    
    // Search & filtering
    searchProducts,
    getFeaturedProducts,
    getProductsByCategory,
    
    // Analytics & admin
    getProductAnalytics,
    bulkUpdateStatus,
} = require("../controllers/productController");
const { protect, admin } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const { publicLimiter } = require("../middleware/rateLimitMiddleware");

// ─────────────────────────────────────────────────────────────────────────────
// IMPORTANT: Specific routes MUST come before generic /:id routes
// ─────────────────────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────────────────────
// SEARCH & FILTERING ROUTES (must be before /:id)
// ─────────────────────────────────────────────────────────────────────────────

// Search products
router.route("/search").get(publicLimiter, searchProducts);

// Featured products
router.route("/featured").get(publicLimiter, getFeaturedProducts);

// Products by category
router.route("/categories/:category").get(publicLimiter, getProductsByCategory);

// ─────────────────────────────────────────────────────────────────────────────
// ADMIN & ANALYTICS ROUTES (must be before /:id)
// ─────────────────────────────────────────────────────────────────────────────

// Analytics dashboard
router.route("/analytics/dashboard").get(protect, admin, getProductAnalytics);

// Bulk operations
router.route("/bulk/update-status").post(protect, admin, bulkUpdateStatus);

// ─────────────────────────────────────────────────────────────────────────────
// BACKWARD COMPATIBILITY ROUTES (must be before /:id)
// ─────────────────────────────────────────────────────────────────────────────

// Gemstone Routes
router
    .route("/gemstones")
    .get(publicLimiter, getGemstones)
    .post(protect, admin, upload.single("image"), createGemstone);

router
    .route("/gemstones/:id")
    .get(publicLimiter, getGemstoneById)
    .put(protect, admin, upload.single("image"), updateGemstone)
    .delete(protect, admin, deleteGemstone);

// Tree Routes
router
    .route("/trees")
    .get(publicLimiter, getTrees)
    .post(protect, admin, upload.single("image"), createTree);

router
    .route("/trees/:id")
    .get(publicLimiter, getTreeById)
    .put(protect, admin, upload.single("image"), updateTree)
    .delete(protect, admin, deleteTree);

// Bracelet Routes
router
    .route("/bracelets")
    .get(publicLimiter, getBracelets)
    .post(protect, admin, upload.single("image"), createBracelet);

router
    .route("/bracelets/:id")
    .get(publicLimiter, getBraceletById)
    .put(protect, admin, upload.single("image"), updateBracelet)
    .delete(protect, admin, deleteBracelet);

// ─────────────────────────────────────────────────────────────────────────────
// UNIFIED PRODUCT ROUTES (generic routes come LAST)
// ─────────────────────────────────────────────────────────────────────────────

// Main product routes
router
    .route("/")
    .get(publicLimiter, getProducts)
    .post(protect, admin, upload.single("image"), createProduct);

// Generic /:id routes MUST be last to avoid catching specific routes
router
    .route("/:id")
    .get(publicLimiter, getProductById)
    .put(protect, admin, upload.single("image"), (req, res, next) => {
        console.log('=== AFTER MULTER: PUT /api/products/:id ===');
        console.log('Product ID:', req.params.id);
        console.log('Has file:', !!req.file);
        console.log('Body:', req.body);
        console.log('Stock value:', req.body.stock);
        next();
    }, updateProduct)
    .delete(protect, admin, deleteProduct);

// Product status management
router
    .route("/:id/status")
    .patch(protect, admin, updateProductStatus);

// Stock management
router
    .route("/:id/stock")
    .patch(protect, admin, updateProductStock);

module.exports = router;
