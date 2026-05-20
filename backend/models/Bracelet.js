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
        price: { type: String },
        buyLink: { type: String },
    },
    { timestamps: true }
);

// Indexes for performance
braceletSchema.index({ name: 1 }); // For name searches
braceletSchema.index({ createdAt: -1 }); // For sorting by newest
braceletSchema.index({ name: 'text', shortDescription: 'text', meaning: 'text' }); // For text search

module.exports = mongoose.model("Bracelet", braceletSchema);
