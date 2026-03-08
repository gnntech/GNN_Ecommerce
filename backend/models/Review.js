const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
    },
    image: {
        type: String, // Placeholder image
        required: true,
    },
    quote: {
        type: String,
        default: "",
    },
    location: {
        type: String,
        default: "",
    },
    videoUrl: {
        type: String, // YouTube embed URL
        required: true,
    },
    isVideoTestimonial: {
        type: Boolean,
        default: true,
    },
    order: {
        type: Number,
        default: 0,
    },
}, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema);
