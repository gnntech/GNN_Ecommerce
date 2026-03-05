const Slider = require('../models/Slider');
const Review = require('../models/Review');
const Collection = require('../models/Collection');
const SectionContent = require('../models/SectionContent');
const Gallery = require('../models/Gallery');

// Helper to create CRUD controller
const createCrudController = (Model) => ({
    getAll: async (req, res) => {
        try {
            const items = await Model.find().sort({ order: 1 });
            res.json(items);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    create: async (req, res) => {
        try {
            const data = { ...req.body };
            if (req.file) {
                data.image = req.file.path;
            }
            const newItem = new Model(data);
            await newItem.save();
            res.status(201).json(newItem);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },
    update: async (req, res) => {
        try {
            const data = { ...req.body };
            if (req.file) {
                data.image = req.file.path;
            }
            const updatedItem = await Model.findByIdAndUpdate(req.params.id, data, { new: true });
            if (!updatedItem) return res.status(404).json({ message: 'Item not found' });
            res.json(updatedItem);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },
    delete: async (req, res) => {
        try {
            const deletedItem = await Model.findByIdAndDelete(req.params.id);
            if (!deletedItem) return res.status(404).json({ message: 'Item not found' });
            res.json({ message: 'Item deleted' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
});

// Helper for SectionContent (find by name)
const sectionController = {
    getByName: async (req, res) => {
        try {
            const section = await SectionContent.findOne({ sectionName: req.params.name });
            if (!section) return res.status(404).json({ message: 'Section not found' });
            res.json(section);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    updateByName: async (req, res) => {
        try {
            const data = { ...req.body };
            if (req.file) {
                data.image = req.file.path;
            }
            const section = await SectionContent.findOneAndUpdate(
                { sectionName: req.params.name },
                data,
                { new: true, upsert: true } // Create if not exists
            );
            res.json(section);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
};

module.exports = {
    slider: createCrudController(Slider),
    reviews: createCrudController(Review),
    collections: createCrudController(Collection),
    gallery: createCrudController(Gallery),
    section: sectionController
};
