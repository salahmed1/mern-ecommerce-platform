const Order = require('../models/orderModel');

// @desc    Create a new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = async (req, res) => {
    try {
        const { orderItems, shippingAddress, totalPrice } = req.body;

        if (orderItems && orderItems.length === 0) {
            res.status(400).json({ message: 'No order items' });
            return;
        }

        const order = new Order({
            orderItems: orderItems.map(item => ({
                ...item,
                product: item.product, // Assuming product ID is passed correctly
            })),
            user: req.user._id, // From our 'protect' middleware
            shippingAddress,
            totalPrice,
        });

        const createdOrder = await order.save();

        res.status(201).json(createdOrder);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
    try {
        // Also fetch the user's name and email associated with the order
        const order = await Order.findById(req.params.id).populate('user', 'name email');

        if (order) {
            // Security check: Make sure the user is an admin or the owner of the order
            if (order.user._id.toString() !== req.user._id.toString() && !req.user.isAdmin) {
                res.status(401).json({ message: 'Not authorized to view this order' });
                return;
            }
            res.json(order);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get logged in user's orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (order) {
            order.isDelivered = true;
            order.deliveredAt = Date.now();

            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = async (req, res) => {
    try {
        // Populate the 'user' field, but only select the user's id and name
        const orders = await Order.find({}).populate('user', 'id name');
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};


// EXPORT THE NEW AND EXISTING FUNCTIONS
module.exports = {
    addOrderItems,
    getOrderById,
    getMyOrders,
    updateOrderToDelivered, // <-- NEW
    getOrders, // <-- NEW
};