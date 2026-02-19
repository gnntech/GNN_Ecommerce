const mongoose = require('mongoose');

const sectionContentSchema = new mongoose.Schema({
    sectionName: {
        type: String,
        required: true,
        unique: true, // e.g., 'craftsmanship', 'productSearch'
    },
    title: {
        type: String,
        required: true,
    },
    subtitle: {
        type: String,
        default: '',
    },
    description: {
        type: String,
        default: '',
    },
    image: {
        type: String,
        default: '',
    },
    videoUrl: {
        type: String,
        default: '',
    },
    ctaText: {
        type: String,
        default: '',
    },
    ctaLink: {
        type: String,
        default: '',
    },
}, { timestamps: true });

module.exports = mongoose.model('SectionContent', sectionContentSchema);
