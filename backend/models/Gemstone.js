const mongoose = require("mongoose");

const gemstoneSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        shortDescription: { type: String },
        meaning: { type: String },
        color: { type: String },
        colorClass: { type: String }, // CSS class for color styling
        glowClass: { type: String }, // CSS class for glow effect
        zodiac: { type: String },
        rarity: { type: String },
        hardness: { type: String },
        chakra: { type: String },
        image: { type: String, required: true }, // Cloudinary URL
        benefits: [String],
        whoShouldWear: [String],
        careInstructions: [String],
        price: { type: String },          // Display string e.g. "₹1,200" (kept for display)
        priceNum: { type: Number, default: 0 }, // Numeric price for sorting/filtering
        buyLink: { type: String },
        // Inventory & Status
        stock:      { type: Number, default: 0, min: 0 },
        isInStock:  { type: Boolean, default: true },
        lowStockThreshold: { type: Number, default: 5 },
        status: {
            type: String,
            enum: ["active", "inactive", "out-of-stock"],
            default: "active",
        },
        // Variants (size, color, bead count, etc.)
        variants: [
            {
                label:    { type: String, required: true }, // e.g. "Small / Red / 8mm"
                size:     { type: String },
                color:    { type: String },
                beadCount:{ type: String },
                stock:    { type: Number, default: 0 },
                priceNum: { type: Number },                 // variant-level price override
                sku:      { type: String },
            }
        ],
        soldCount: { type: Number, default: 0 },            // for popularity sort
    },
    { timestamps: true }
);

// Auto-sync isInStock and status whenever stock changes
gemstoneSchema.pre('save', function (next) {
    this.isInStock = this.stock > 0;
    if (this.stock === 0 && this.status === 'active') {
        this.status = 'out-of-stock';
    }
    if (this.stock > 0 && this.status === 'out-of-stock') {
        this.status = 'active';
    }
    // Sync priceNum from price string if priceNum not explicitly set
    if (this.price && !this.priceNum) {
        const parsed = parseFloat(this.price.replace(/[^0-9.]/g, ''));
        if (!isNaN(parsed)) this.priceNum = parsed;
    }
    next();
});

// Indexes for performance
gemstoneSchema.index({ name: 1 });
gemstoneSchema.index({ color: 1 });
gemstoneSchema.index({ zodiac: 1 });
gemstoneSchema.index({ rarity: 1 });
gemstoneSchema.index({ chakra: 1 });
gemstoneSchema.index({ createdAt: -1 });
gemstoneSchema.index({ priceNum: 1 });        // numeric price sort/filter
gemstoneSchema.index({ soldCount: -1 });      // popularity sort
gemstoneSchema.index({ status: 1 });
gemstoneSchema.index({ stock: 1 });
gemstoneSchema.index({ isInStock: 1 });
gemstoneSchema.index({ name: 'text', shortDescription: 'text', meaning: 'text' });

module.exports = mongoose.model("Gemstone", gemstoneSchema);
