const mongoose = require('mongoose');

const collectionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
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

module.exports = mongoose.model('Collection', collectionSchema);
