const express = require('express');
const router = express.Router();
const {
    addOrderItems,
    getOrderById,
    getMyOrders,
    updateOrderToDelivered,
    getOrders,
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

// User places an order (accessible to any logged-in user)
router.route('/').post(protect, addOrderItems);

// Admin gets all orders (admin only)
router.route('/').get(protect, admin, getOrders);

// User gets their own orders (accessible to any logged-in user)
router.route('/myorders').get(protect, getMyOrders);

// User gets a specific order by ID (user must be owner or admin)
router.route('/:id').get(protect, getOrderById);

// Admin updates an order to delivered (admin only)
router.route('/:id/deliver').put(protect, admin, updateOrderToDelivered);

module.exports = router;