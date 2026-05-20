const mongoose = require("mongoose");

const braceletSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        shortDescription: { type: String },
        meaning: { type: String },
        numerology: { type: String }, // Used as description
        benefits: [String],
        whoShouldWear: [String],
        careInstructions: [String],
        image: { type: String, required: true }, // Cloudinary URL
        price: { type: String },          // Display string e.g. "₹1,200"
        priceNum: { type: Number, default: 0 }, // Numeric for sorting/filtering
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
        // Variants (size, color, bead count)
        variants: [
            {
                label:    { type: String, required: true },
                size:     { type: String },
                color:    { type: String },
                beadCount:{ type: String },
                stock:    { type: Number, default: 0 },
                priceNum: { type: Number },
                sku:      { type: String },
            }
        ],
        soldCount: { type: Number, default: 0 },
    },
    { timestamps: true }
);

// Auto-sync isInStock and status whenever stock changes
braceletSchema.pre('save', function (next) {
    this.isInStock = this.stock > 0;
    if (this.stock === 0 && this.status === 'active') this.status = 'out-of-stock';
    if (this.stock > 0 && this.status === 'out-of-stock') this.status = 'active';
    if (this.price && !this.priceNum) {
        const parsed = parseFloat(this.price.replace(/[^0-9.]/g, ''));
        if (!isNaN(parsed)) this.priceNum = parsed;
    }
    next();
});

// Indexes for performance
braceletSchema.index({ name: 1 });
braceletSchema.index({ createdAt: -1 });
braceletSchema.index({ priceNum: 1 });
braceletSchema.index({ soldCount: -1 });
braceletSchema.index({ status: 1 });
braceletSchema.index({ stock: 1 });
braceletSchema.index({ isInStock: 1 });
braceletSchema.index({ name: 'text', shortDescription: 'text', meaning: 'text' });

module.exports = mongoose.model("Bracelet", braceletSchema);
