const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    link: {
        type: String,
        required: true,
    },
    order: {
        type: Number,
        default: 0,
    },
}, { timestamps: true });

// Indexes for performance
gallerySchema.index({ order: 1 }); // For sorting gallery items by order
gallerySchema.index({ createdAt: -1 }); // For sorting by newest

module.exports = mongoose.model('Gallery', gallerySchema);
