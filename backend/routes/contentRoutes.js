const express = require('express');
const router = express.Router();
const contentController = require('../controllers/contentController');

// Helper to register routes
const registerRoutes = (path, controller) => {
    router.get(`/${path}`, controller.getAll);
    router.post(`/${path}`, controller.create);
    router.put(`/${path}/:id`, controller.update);
    router.delete(`/${path}/:id`, controller.delete);
};

registerRoutes('slider', contentController.slider);
registerRoutes('reviews', contentController.reviews);
registerRoutes('collections', contentController.collections);
registerRoutes('gallery', contentController.gallery);

// Section specific routes
router.get('/sections/:name', contentController.section.getByName);
router.put('/sections/:name', contentController.section.updateByName);

module.exports = router;
