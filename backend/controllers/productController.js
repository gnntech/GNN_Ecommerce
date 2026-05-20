const Product = require("../models/Product");
const asyncHandler = require("express-async-handler");

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

/** Parse a price display string like "₹1,200" → 1200 */
const parsePriceStr = (str) => {
    if (!str) return 0;
    if (typeof str === 'number') return str;
    const n = parseFloat(String(str).replace(/[^0-9.]/g, ""));
    return isNaN(n) ? 0 : n;
};

/** Parse JSON array field sent as a string from FormData */
const parseArr = (val) => {
    if (!val) return [];
    if (Array.isArray(val)) return val;
    try { return JSON.parse(val); } catch { return []; }
};

/** Validate product data */
const validateProductData = (data) => {
    const errors = [];
    
    if (!data.name || data.name.trim().length === 0) {
        errors.push('Product name is required');
    }
    
    if (!data.category || data.category.trim().length === 0) {
        errors.push('Category is required');
    }
    
    if (!data.price || data.price <= 0) {
        errors.push('Valid price is required');
    }
    
    return errors;
};

/**
 * Enhanced paginated query helper for unified Product model.
 *
 * Supported query params:
 *   ?all=true            → admin bypass, returns plain array sorted by newest
 *   ?page=1&limit=12     → paginated response { products, total, page, pages, limit }
 *   ?sort=price&order=asc|desc
 *   ?sort=newest         → shorthand for createdAt desc
 *   ?sort=popular        → shorthand for soldCount desc
 *   ?sort=rating         → shorthand for rating desc
 *   ?minPrice=500&maxPrice=5000  → filter by price
 *   ?status=active       → filter by status (default: active for public)
 *   ?inStockOnly=true    → only isInStock=true
 *   ?category=gemstones  → filter by category
 *   ?featured=true       → only featured products
 *   ?search=term         → text search
 */
const paginatedFind = async (baseQuery, req, res) => {
    const query = { ...baseQuery };

    // ── Admin bypass ───────────────────────────────────────────────────────
    if (req.query.all === "true") {
        if (req.query.status) query.status = req.query.status;
        if (req.query.category) query.category = req.query.category;
        const products = await Product.find(query).sort({ createdAt: -1 });
        return res.json(products);
    }

    // ── Status filter ──────────────────────────────────────────────────────
    // Public: default to active only; allow explicit status param
    query.status = req.query.status || "active";

    // ── Category filter ────────────────────────────────────────────────────
    if (req.query.category) {
        query.category = req.query.category;
    }

    // ── Price range filter ─────────────────────────────────────────────────
    if (req.query.minPrice || req.query.maxPrice) {
        query.price = {};
        if (req.query.minPrice) query.price.$gte = Number(req.query.minPrice);
        if (req.query.maxPrice) query.price.$lte = Number(req.query.maxPrice);
    }

    // ── Stock filter ───────────────────────────────────────────────────────
    if (req.query.inStockOnly === "true") query.isInStock = true;

    // ── Featured filter ────────────────────────────────────────────────────
    if (req.query.featured === "true") query.featured = true;

    // ── Text search ────────────────────────────────────────────────────────
    if (req.query.search) {
        query.$text = { $search: req.query.search };
    }

    // ── Sort ───────────────────────────────────────────────────────────────
    let sortObj = { createdAt: -1 }; // default: newest
    const sortParam = req.query.sort;
    const orderDir  = req.query.order === "asc" ? 1 : -1;

    if (sortParam === "newest")       sortObj = { createdAt: -1 };
    else if (sortParam === "popular") sortObj = { soldCount: -1 };
    else if (sortParam === "price")   sortObj = { price: orderDir };
    else if (sortParam === "rating")  sortObj = { rating: -1 };
    else if (sortParam)               sortObj = { [sortParam]: orderDir };

    // ── Pagination ─────────────────────────────────────────────────────────
    const page  = Math.max(1, parseInt(req.query.page)  || 1);
    const limit = Math.min(50, parseInt(req.query.limit) || 12);
    const skip  = (page - 1) * limit;

    const [products, total] = await Promise.all([
        Product.find(query).sort(sortObj).skip(skip).limit(limit),
        Product.countDocuments(query),
    ]);

    res.json({ products, total, page, pages: Math.ceil(total / limit), limit });
};

/** Shared field updater for update controllers */
const applyFields = (doc, body, fields) => {
    fields.forEach(f => { if (body[f] !== undefined) doc[f] = body[f]; });
};

// ─────────────────────────────────────────────────────────────────────────────
// UNIFIED PRODUCT ENDPOINTS
// ─────────────────────────────────────────────────────────────────────────────

// @route GET /api/products
// @desc Get all products with filtering, sorting, and pagination
const getProducts = asyncHandler(async (req, res) => {
    await paginatedFind({}, req, res);
});

// @route GET /api/products/:id
// @desc Get single product by ID
const getProductById = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
        res.status(404);
        throw new Error("Product not found");
    }
    
    // Increment view count for analytics
    await product.incrementViews();
    
    res.json(product);
});

// @route POST /api/products
// @desc Create new product (Admin only)
const createProduct = asyncHandler(async (req, res) => {
    console.log('=== CREATE PRODUCT REQUEST ===');
    console.log('Body:', req.body);
    console.log('File:', req.file);
    console.log('User:', req.user);
    
    const image = req.file?.path;
    
    const {
        name, category, shortDescription, description, meaning, price, buyLink, 
        stock, status, numerology,
        // SEO fields
        metaTitle, metaDescription, tags,
        // Marketing fields
        featured, compareAtPrice
    } = req.body;

    // Validate required fields
    const priceNum = parsePriceStr(price);
    const errors = validateProductData({ name, category, price: priceNum });
    if (errors.length > 0) {
        console.error('Validation errors:', errors);
        res.status(400);
        throw new Error(errors.join(', '));
    }

    const compareAtPriceNum = compareAtPrice ? parsePriceStr(compareAtPrice) : null;

    const productData = {
        // Basic info
        name: name.trim(),
        category,
        shortDescription,
        description,
        meaning,
        image: image || '',
        
        // Numerology (for all products)
        numerology,
        
        // Content arrays
        benefits: parseArr(req.body.benefits),
        whoShouldWear: parseArr(req.body.whoShouldWear),
        careInstructions: parseArr(req.body.careInstructions),
        
        // Pricing
        price: priceNum,
        compareAtPrice: compareAtPriceNum,
        
        // Inventory - use 'stock' not 'totalStock'
        stock: stock !== undefined ? Number(stock) : 0,
        
        // Status
        status: status || "active",
        
        // Variants
        variants: parseArr(req.body.variants),
        
        // External
        buyLink,
        
        // SEO
        metaTitle,
        metaDescription,
        tags: parseArr(req.body.tags),
        
        // Marketing
        featured: featured === 'true' || featured === true,
    };

    console.log('Product data to create:', productData);

    try {
        const product = await Product.create(productData);
        console.log('Product created successfully:', product._id);
        res.status(201).json(product);
    } catch (error) {
        console.error('Error creating product:', error);
        throw error;
    }
});

// @route PUT /api/products/:id
// @desc Update product (Admin only)
const updateProduct = asyncHandler(async (req, res) => {
    console.log('=== UPDATE PRODUCT ===');
    console.log('Product ID:', req.params.id);
    console.log('Request body:', req.body);
    console.log('Request file:', req.file);
    
    const product = await Product.findById(req.params.id);
    
    if (!product) {
        res.status(404);
        throw new Error("Product not found");
    }

    console.log('Current product stock:', product.stock);
    console.log('New stock from request:', req.body.stock);

    // Update basic fields
    const basicFields = [
        'name', 'shortDescription', 'description', 'meaning', 'buyLink', 'status',
        'numerology', 'metaTitle', 'metaDescription'
    ];
    applyFields(product, req.body, basicFields);

    // Update numeric fields - handle both string and number types from FormData
    if (req.body.stock !== undefined && req.body.stock !== '') {
        const stockValue = Number(req.body.stock);
        console.log('Stock value from body:', req.body.stock, 'Parsed:', stockValue);
        if (!isNaN(stockValue)) {
            product.stock = stockValue;
            console.log('Updated product.stock to:', product.stock);
        }
    }
    if (req.body.price !== undefined) product.price = parsePriceStr(req.body.price);
    if (req.body.compareAtPrice !== undefined) {
        product.compareAtPrice = parsePriceStr(req.body.compareAtPrice);
    }
    if (req.body.featured !== undefined) {
        product.featured = req.body.featured === 'true' || req.body.featured === true;
    }

    // Update image if provided
    if (req.file) product.image = req.file.path;

    // Update array fields
    ['benefits', 'whoShouldWear', 'careInstructions', 'variants', 'tags'].forEach(field => {
        if (req.body[field]) product[field] = parseArr(req.body[field]);
    });

    console.log('Saving product...');
    const updatedProduct = await product.save();
    console.log('Product saved. New stock:', updatedProduct.stock, 'Total stock:', updatedProduct.totalStock);
    res.json(updatedProduct);
});

// @route DELETE /api/products/:id
// @desc Delete product (Admin only)
const deleteProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
        res.status(404);
        throw new Error("Product not found");
    }
    
    await product.deleteOne();
    res.json({ message: "Product removed successfully" });
});

// @route PATCH /api/products/:id/status
// @desc Update product status (Admin only)
const updateProductStatus = asyncHandler(async (req, res) => {
    const { status } = req.body;
    
    if (!['active', 'inactive', 'out-of-stock'].includes(status)) {
        res.status(400);
        throw new Error("Invalid status. Must be 'active', 'inactive', or 'out-of-stock'");
    }
    
    const product = await Product.findById(req.params.id);
    
    if (!product) {
        res.status(404);
        throw new Error("Product not found");
    }
    
    product.status = status;
    await product.save();
    
    res.json({ message: `Product status updated to ${status}`, product });
});

// @route PATCH /api/products/:id/stock
// @desc Update product stock (Admin only)
const updateProductStock = asyncHandler(async (req, res) => {
    const { stock, variantId } = req.body;
    
    if (stock === undefined || stock < 0) {
        res.status(400);
        throw new Error("Valid stock quantity is required");
    }
    
    const product = await Product.findById(req.params.id);
    
    if (!product) {
        res.status(404);
        throw new Error("Product not found");
    }
    
    if (variantId) {
        // Update variant stock
        const variant = product.variants.id(variantId);
        if (!variant) {
            res.status(404);
            throw new Error("Variant not found");
        }
        variant.stock = Number(stock);
    } else {
        // Update base product stock
        product.stock = Number(stock);
    }
    
    await product.save();
    res.json({ message: "Stock updated successfully", product });
});

// ─────────────────────────────────────────────────────────────────────────────
// CATEGORY-SPECIFIC ENDPOINTS (for backward compatibility)
// ─────────────────────────────────────────────────────────────────────────────

// @route GET /api/products/gemstones
const getGemstones = asyncHandler(async (req, res) => {
    await paginatedFind({ category: 'gemstones' }, req, res);
});

// @route GET /api/products/gemstones/:id
const getGemstoneById = asyncHandler(async (req, res) => {
    const product = await Product.findOne({ 
        _id: req.params.id, 
        category: 'gemstones' 
    });
    
    if (!product) {
        res.status(404);
        throw new Error("Gemstone not found");
    }
    
    await product.incrementViews();
    res.json(product);
});

// @route POST /api/products/gemstones
const createGemstone = asyncHandler(async (req, res) => {
    req.body.category = 'gemstones';
    return createProduct(req, res);
});

// @route PUT /api/products/gemstones/:id
const updateGemstone = asyncHandler(async (req, res) => {
    const product = await Product.findOne({ 
        _id: req.params.id, 
        category: 'gemstones' 
    });
    
    if (!product) {
        res.status(404);
        throw new Error("Gemstone not found");
    }
    
    req.params.id = product._id;
    return updateProduct(req, res);
});

// @route DELETE /api/products/gemstones/:id
const deleteGemstone = asyncHandler(async (req, res) => {
    const product = await Product.findOne({ 
        _id: req.params.id, 
        category: 'gemstones' 
    });
    
    if (!product) {
        res.status(404);
        throw new Error("Gemstone not found");
    }
    
    await product.deleteOne();
    res.json({ message: "Gemstone removed" });
});

// @route GET /api/products/trees
const getTrees = asyncHandler(async (req, res) => {
    await paginatedFind({ category: 'trees' }, req, res);
});

// @route GET /api/products/trees/:id
const getTreeById = asyncHandler(async (req, res) => {
    const product = await Product.findOne({ 
        _id: req.params.id, 
        category: 'trees' 
    });
    
    if (!product) {
        res.status(404);
        throw new Error("Tree not found");
    }
    
    await product.incrementViews();
    res.json(product);
});

// @route POST /api/products/trees
const createTree = asyncHandler(async (req, res) => {
    req.body.category = 'trees';
    return createProduct(req, res);
});

// @route PUT /api/products/trees/:id
const updateTree = asyncHandler(async (req, res) => {
    const product = await Product.findOne({ 
        _id: req.params.id, 
        category: 'trees' 
    });
    
    if (!product) {
        res.status(404);
        throw new Error("Tree not found");
    }
    
    req.params.id = product._id;
    return updateProduct(req, res);
});

// @route DELETE /api/products/trees/:id
const deleteTree = asyncHandler(async (req, res) => {
    const product = await Product.findOne({ 
        _id: req.params.id, 
        category: 'trees' 
    });
    
    if (!product) {
        res.status(404);
        throw new Error("Tree not found");
    }
    
    await product.deleteOne();
    res.json({ message: "Tree removed" });
});

// @route GET /api/products/bracelets
const getBracelets = asyncHandler(async (req, res) => {
    await paginatedFind({ category: 'bracelets' }, req, res);
});

// @route GET /api/products/bracelets/:id
const getBraceletById = asyncHandler(async (req, res) => {
    const product = await Product.findOne({ 
        _id: req.params.id, 
        category: 'bracelets' 
    });
    
    if (!product) {
        res.status(404);
        throw new Error("Bracelet not found");
    }
    
    await product.incrementViews();
    res.json(product);
});

// @route POST /api/products/bracelets
const createBracelet = asyncHandler(async (req, res) => {
    req.body.category = 'bracelets';
    return createProduct(req, res);
});

// @route PUT /api/products/bracelets/:id
const updateBracelet = asyncHandler(async (req, res) => {
    const product = await Product.findOne({ 
        _id: req.params.id, 
        category: 'bracelets' 
    });
    
    if (!product) {
        res.status(404);
        throw new Error("Bracelet not found");
    }
    
    req.params.id = product._id;
    return updateProduct(req, res);
});

// @route DELETE /api/products/bracelets/:id
const deleteBracelet = asyncHandler(async (req, res) => {
    const product = await Product.findOne({ 
        _id: req.params.id, 
        category: 'bracelets' 
    });
    
    if (!product) {
        res.status(404);
        throw new Error("Bracelet not found");
    }
    
    await product.deleteOne();
    res.json({ message: "Bracelet removed" });
});

// ─────────────────────────────────────────────────────────────────────────────
// SEARCH & FILTERING
// ─────────────────────────────────────────────────────────────────────────────

// @route GET /api/products/search
const searchProducts = asyncHandler(async (req, res) => {
    const { category, query, minPrice, maxPrice, sort, order } = req.query;
    
    if (!query || query.trim().length === 0) {
        res.status(400);
        throw new Error("Search query is required");
    }
    
    try {
        const searchOptions = {
            category,
            minPrice,
            maxPrice,
            page: parseInt(req.query.page) || 1,
            limit: parseInt(req.query.limit) || 12
        };
        
        const result = await Product.searchProducts(query.trim(), searchOptions);
        res.json(result);
        
    } catch (error) {
        console.error('Search error:', error);
        res.status(500);
        throw new Error("Search failed. Please try again.");
    }
});

// @route GET /api/products/featured
const getFeaturedProducts = asyncHandler(async (req, res) => {
    await paginatedFind({ featured: true }, req, res);
});

// @route GET /api/products/categories/:category
const getProductsByCategory = asyncHandler(async (req, res) => {
    const { category } = req.params;
    
    if (!['gemstones', 'bracelets', 'trees'].includes(category)) {
        res.status(400);
        throw new Error("Invalid category");
    }
    
    await paginatedFind({ category }, req, res);
});

// ─────────────────────────────────────────────────────────────────────────────
// ANALYTICS & ADMIN
// ─────────────────────────────────────────────────────────────────────────────

// @route GET /api/products/analytics/dashboard
const getProductAnalytics = asyncHandler(async (req, res) => {
    try {
        const [
            totalProducts,
            activeProducts,
            outOfStockProducts,
            categoryStats,
            topSellingProducts,
            lowStockProducts
        ] = await Promise.all([
            Product.countDocuments(),
            Product.countDocuments({ status: 'active' }),
            Product.countDocuments({ status: 'out-of-stock' }),
            Product.aggregate([
                { $group: { _id: '$category', count: { $sum: 1 } } }
            ]),
            Product.find({ status: 'active' })
                .sort({ soldCount: -1 })
                .limit(5)
                .select('name category soldCount price'),
            Product.find({ 
                status: 'active',
                $expr: { $lte: ['$totalStock', '$lowStockThreshold'] }
            })
                .select('name category totalStock lowStockThreshold')
                .limit(10)
        ]);
        
        res.json({
            overview: {
                totalProducts,
                activeProducts,
                outOfStockProducts,
                inactiveProducts: totalProducts - activeProducts - outOfStockProducts
            },
            categoryStats,
            topSellingProducts,
            lowStockProducts
        });
        
    } catch (error) {
        console.error('Analytics error:', error);
        res.status(500);
        throw new Error("Failed to fetch analytics data");
    }
});

// @route POST /api/products/bulk-update-status
const bulkUpdateStatus = asyncHandler(async (req, res) => {
    const { productIds, status } = req.body;
    
    if (!Array.isArray(productIds) || productIds.length === 0) {
        res.status(400);
        throw new Error("Product IDs array is required");
    }
    
    if (!['active', 'inactive', 'out-of-stock'].includes(status)) {
        res.status(400);
        throw new Error("Invalid status");
    }
    
    const result = await Product.updateMany(
        { _id: { $in: productIds } },
        { status }
    );
    
    res.json({
        message: `Updated ${result.modifiedCount} products to ${status}`,
        modifiedCount: result.modifiedCount
    });
});

// ─────────────────────────────────────────────────────────────────────────────
// EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
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
};