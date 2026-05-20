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
        price: { type: String },
        buyLink: { type: String },
    },
    { timestamps: true }
);

// Indexes for performance
gemstoneSchema.index({ name: 1 }); // For name searches
gemstoneSchema.index({ color: 1 }); // For filtering by color
gemstoneSchema.index({ zodiac: 1 }); // For filtering by zodiac
gemstoneSchema.index({ rarity: 1 }); // For filtering by rarity
gemstoneSchema.index({ chakra: 1 }); // For filtering by chakra
gemstoneSchema.index({ createdAt: -1 }); // For sorting by newest
gemstoneSchema.index({ name: 'text', shortDescription: 'text', meaning: 'text' }); // For text search

module.exports = mongoose.model("Gemstone", gemstoneSchema);
