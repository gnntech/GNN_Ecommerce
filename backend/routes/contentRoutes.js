const express = require('express');
const router = express.Router();
const contentController = require('../controllers/contentController');

const upload = require('../middleware/uploadMiddleware');

// Helper to register routes
const registerRoutes = (path, controller, useUpload = false) => {
    router.get(`/${path}`, controller.getAll);
    if (useUpload) {
        router.post(`/${path}`, upload.single('image'), controller.create);
        router.put(`/${path}/:id`, upload.single('image'), controller.update);
    } else {
        router.post(`/${path}`, controller.create);
        router.put(`/${path}/:id`, controller.update);
    }
    router.delete(`/${path}/:id`, controller.delete);
};

registerRoutes('slider', contentController.slider, true);
registerRoutes('reviews', contentController.reviews, true);
registerRoutes('collections', contentController.collections, true);
registerRoutes('gallery', contentController.gallery, true);

// Section specific routes
router.get('/sections/:name', contentController.section.getByName);
router.put('/sections/:name', upload.single('image'), contentController.section.updateByName);

module.exports = router;
