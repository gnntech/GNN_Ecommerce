const mongoose = require("mongoose");

// ─────────────────────────────────────────────────────────────────────────────
// PRODUCT VARIANT SCHEMA
// ─────────────────────────────────────────────────────────────────────────────

const variantSchema = new mongoose.Schema({
    label: { type: String, required: true }, // e.g. "Small / Red / 108 beads"
    size: { type: String }, // S, M, L, XL, etc.
    color: { type: String }, // Red, Blue, Natural, etc.
    beadCount: { type: String }, // 108, 54, 27, etc.
    stock: { type: Number, default: 0, min: 0 },
    price: { type: Number }, // Variant-specific price override
    sku: { type: String }, // Unique SKU for this variant
    isActive: { type: Boolean, default: true },
}, { _id: true });

// ─────────────────────────────────────────────────────────────────────────────
// UNIFIED PRODUCT SCHEMA
// ─────────────────────────────────────────────────────────────────────────────

const productSchema = new mongoose.Schema(
    {
        // ── Basic Information ──────────────────────────────────────────────
        name: { type: String, required: true, trim: true },
        shortDescription: { type: String, trim: true },
        meaning: { type: String, trim: true },
        
        // ── Category & Type ────────────────────────────────────────────────
        category: {
            type: String,
            required: true,
            trim: true,
            lowercase: true
            // Removed enum to allow dynamic categories
            // Categories are now managed in the Category collection
        },
        
        // ── Category-Specific Fields ───────────────────────────────────────
        // For Gemstones
        color: { type: String },
        colorClass: { type: String }, // CSS class for color styling
        glowClass: { type: String }, // CSS class for glow effect
        zodiac: { type: String },
        rarity: { type: String },
        hardness: { type: String },
        chakra: { type: String },
        
        // For Trees & Bracelets
        numerology: { type: String }, // Used as card description
        
        // ── Media ──────────────────────────────────────────────────────────
        image: { type: String, required: true }, // Cloudinary URL
        images: [String], // Additional product images
        
        // ── Content Arrays ─────────────────────────────────────────────────
        benefits: [String],
        whoShouldWear: [String],
        careInstructions: [String],
        
        // ── Pricing ────────────────────────────────────────────────────────
        price: { type: Number, required: true, min: 0 }, // Base price in numbers
        priceDisplay: { type: String }, // Formatted display price "₹1,200"
        compareAtPrice: { type: Number }, // Original price for discounts
        
        // ── Inventory & Stock ──────────────────────────────────────────────
        stock: { type: Number, default: 0, min: 0 },
        lowStockThreshold: { type: Number, default: 5 },
        trackQuantity: { type: Boolean, default: true },
        
        // ── Product Status ─────────────────────────────────────────────────
        status: {
            type: String,
            enum: ["active", "inactive", "out-of-stock"],
            default: "active"
        },
        
        // ── Variants ───────────────────────────────────────────────────────
        variants: [variantSchema],
        hasVariants: { type: Boolean, default: false },
        
        // ── SEO & Marketing ────────────────────────────────────────────────
        slug: { type: String, unique: true, sparse: true },
        metaTitle: { type: String },
        metaDescription: { type: String },
        tags: [String],
        
        // ── Sales & Analytics ──────────────────────────────────────────────
        soldCount: { type: Number, default: 0, min: 0 },
        viewCount: { type: Number, default: 0, min: 0 },
        rating: { type: Number, default: 0, min: 0, max: 5 },
        reviewCount: { type: Number, default: 0, min: 0 },
        
        // ── External Links ─────────────────────────────────────────────────
        buyLink: { type: String },
        
        // ── Computed Fields ────────────────────────────────────────────────
        isInStock: { type: Boolean, default: true },
        totalStock: { type: Number, default: 0 }, // Base stock + variant stocks
        
        // ── Admin Fields ───────────────────────────────────────────────────
        featured: { type: Boolean, default: false },
        publishedAt: { type: Date },
        
    },
    { 
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

// ─────────────────────────────────────────────────────────────────────────────
// VIRTUALS
// ─────────────────────────────────────────────────────────────────────────────

// Auto-generate price display
productSchema.virtual('formattedPrice').get(function() {
    return this.priceDisplay || `₹${this.price.toLocaleString('en-IN')}`;
});

// Check if product has active variants
productSchema.virtual('activeVariants').get(function() {
    return this.variants.filter(v => v.isActive && v.stock > 0);
});

// Get lowest variant price
productSchema.virtual('lowestPrice').get(function() {
    if (!this.hasVariants || this.variants.length === 0) return this.price;
    const variantPrices = this.variants
        .filter(v => v.isActive && v.price)
        .map(v => v.price);
    return variantPrices.length > 0 ? Math.min(this.price, ...variantPrices) : this.price;
});

// ─────────────────────────────────────────────────────────────────────────────
// MIDDLEWARE
// ─────────────────────────────────────────────────────────────────────────────

// Pre-save middleware for computed fields
productSchema.pre('save', async function() {
    // Update hasVariants flag
    this.hasVariants = this.variants && this.variants.length > 0;
    
    // Calculate total stock (base + variants)
    const variantStock = this.variants.reduce((sum, variant) => sum + (variant.stock || 0), 0);
    this.totalStock = this.stock + variantStock;
    
    // Update isInStock status
    this.isInStock = this.totalStock > 0;
    
    // Auto-update status based on stock
    // If stock is added and status is out-of-stock, change to active
    // If stock reaches 0 and status is active, change to out-of-stock
    if (this.totalStock > 0 && this.status === 'out-of-stock') {
        this.status = 'active';
        console.log('Auto-changed status from out-of-stock to active (stock added)');
    } else if (this.totalStock === 0 && this.status === 'active') {
        this.status = 'out-of-stock';
        console.log('Auto-changed status from active to out-of-stock (no stock)');
    }
    
    // Generate slug if not provided or if it's a new document
    if (this.isNew && !this.slug && this.name) {
        let baseSlug = this.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
        
        // Check for duplicate slugs and append number if needed
        let slug = baseSlug;
        let counter = 1;
        while (await this.constructor.findOne({ slug, _id: { $ne: this._id } })) {
            slug = `${baseSlug}-${counter}`;
            counter++;
        }
        this.slug = slug;
    }
    
    // Auto-generate price display if not provided
    if (!this.priceDisplay) {
        this.priceDisplay = `₹${this.price.toLocaleString('en-IN')}`;
    }
    
    // Set published date for active products
    if (this.status === 'active' && !this.publishedAt) {
        this.publishedAt = new Date();
    }
});

// ─────────────────────────────────────────────────────────────────────────────
// INDEXES FOR PERFORMANCE
// ─────────────────────────────────────────────────────────────────────────────

// Basic indexes
productSchema.index({ name: 1 });
productSchema.index({ category: 1 });
productSchema.index({ status: 1 });

// Sorting indexes
productSchema.index({ createdAt: -1 }); // Newest first
productSchema.index({ soldCount: -1 }); // Popularity
productSchema.index({ price: 1 }); // Price ascending
productSchema.index({ price: -1 }); // Price descending
productSchema.index({ rating: -1 }); // Rating

// Filtering indexes
productSchema.index({ isInStock: 1 });
productSchema.index({ featured: 1 });
productSchema.index({ totalStock: 1 });

// Compound indexes for common queries
productSchema.index({ category: 1, status: 1 });
productSchema.index({ category: 1, price: 1 });
productSchema.index({ category: 1, soldCount: -1 });
productSchema.index({ category: 1, createdAt: -1 });
productSchema.index({ status: 1, createdAt: -1 });
productSchema.index({ featured: 1, status: 1 });

// Text search index
productSchema.index({ 
    name: 'text', 
    shortDescription: 'text', 
    tags: 'text' 
});

// Gemstone-specific indexes
productSchema.index({ zodiac: 1 });
productSchema.index({ color: 1 });
productSchema.index({ chakra: 1 });
productSchema.index({ rarity: 1 });

// ─────────────────────────────────────────────────────────────────────────────
// STATIC METHODS
// ─────────────────────────────────────────────────────────────────────────────

// Find products by category with pagination and sorting
productSchema.statics.findByCategory = function(category, options = {}) {
    const {
        page = 1,
        limit = 12,
        sort = 'createdAt',
        order = 'desc',
        status = 'active',
        inStockOnly = false,
        minPrice,
        maxPrice
    } = options;
    
    const query = { category };
    
    // Status filter
    if (status) query.status = status;
    
    // Stock filter
    if (inStockOnly) query.isInStock = true;
    
    // Price range filter
    if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) query.price.$gte = Number(minPrice);
        if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    
    // Sort configuration
    const sortObj = {};
    if (sort === 'newest') sortObj.createdAt = -1;
    else if (sort === 'popular') sortObj.soldCount = -1;
    else if (sort === 'price') sortObj.price = order === 'asc' ? 1 : -1;
    else if (sort === 'rating') sortObj.rating = -1;
    else sortObj[sort] = order === 'asc' ? 1 : -1;
    
    const skip = (page - 1) * limit;
    
    return Promise.all([
        this.find(query).sort(sortObj).skip(skip).limit(limit),
        this.countDocuments(query)
    ]).then(([products, total]) => ({
        products,
        total,
        page,
        pages: Math.ceil(total / limit),
        limit
    }));
};

// Search products across all categories
productSchema.statics.searchProducts = function(searchTerm, options = {}) {
    const {
        category,
        minPrice,
        maxPrice,
        status = 'active',
        page = 1,
        limit = 12
    } = options;
    
    const query = {
        $text: { $search: searchTerm },
        status
    };
    
    if (category) query.category = category;
    
    if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) query.price.$gte = Number(minPrice);
        if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    
    const skip = (page - 1) * limit;
    
    return Promise.all([
        this.find(query, { score: { $meta: 'textScore' } })
            .sort({ score: { $meta: 'textScore' } })
            .skip(skip)
            .limit(limit),
        this.countDocuments(query)
    ]).then(([products, total]) => ({
        products,
        total,
        page,
        pages: Math.ceil(total / limit),
        limit
    }));
};

// ─────────────────────────────────────────────────────────────────────────────
// INSTANCE METHODS
// ─────────────────────────────────────────────────────────────────────────────

// Update stock for a specific variant
productSchema.methods.updateVariantStock = function(variantId, quantity) {
    const variant = this.variants.id(variantId);
    if (variant) {
        variant.stock = Math.max(0, variant.stock + quantity);
        return this.save();
    }
    throw new Error('Variant not found');
};

// Increment view count
productSchema.methods.incrementViews = function() {
    this.viewCount += 1;
    return this.save();
};

// Check if product can be purchased
productSchema.methods.canPurchase = function(variantId = null, quantity = 1) {
    if (this.status !== 'active') return false;
    
    if (variantId) {
        const variant = this.variants.id(variantId);
        return variant && variant.isActive && variant.stock >= quantity;
    }
    
    return this.isInStock && this.stock >= quantity;
};

module.exports = mongoose.model("Product", productSchema);