const express = require('express');
const router = express.Router();
const {
    getProducts,
    getProductById,
    deleteProduct,
    createProduct,
    updateProduct,
} = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public route for getting all products
router.route('/').get(getProducts);

// Admin route for creating a product
router.route('/').post(protect, admin, createProduct);

// Public route for getting a single product by its ID
router.route('/:id').get(getProductById);

// Admin routes for deleting and updating a product
router.route('/:id').delete(protect, admin, deleteProduct);
router.route('/:id').put(protect, admin, updateProduct);

module.exports = router;