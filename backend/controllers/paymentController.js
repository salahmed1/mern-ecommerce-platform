const Stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Product = require('../models/productModel');

// @desc    Create a new payment intent
// @route   POST /api/payment/create-intent
// @access  Private (for now, we'll assume the user is logged in)
const createPaymentIntent = async (req, res) => {
    try {
        const { cartItems } = req.body;

        // --- Server-side amount calculation ---
        // This is a CRUCIAL security step.
        // The client should only send product IDs and quantities.
        // The server must look up the prices from the database to prevent manipulation.

        const productIds = cartItems.map(item => item.product);
        const productsFromDB = await Product.find({ _id: { $in: productIds } });

        const totalAmount = cartItems.reduce((acc, cartItem) => {
            const productDetails = productsFromDB.find(
                (p) => p._id.toString() === cartItem.product
            );
            // If product is found in DB, use its price. Otherwise, amount is 0.
            return acc + (productDetails ? productDetails.price * cartItem.qty : 0);
        }, 0);

        // Stripe expects the amount in the smallest currency unit (e.g., cents).
        const totalInCents = Math.round(totalAmount * 100);

        if (totalInCents <= 0) {
            return res.status(400).json({ message: 'Invalid cart amount' });
        }
        // --- End of server-side amount calculation ---

        const paymentIntent = await Stripe.paymentIntents.create({
            amount: totalInCents,
            currency: 'usd',
            automatic_payment_methods: {
                enabled: true,
            },
        });

        res.send({
            clientSecret: paymentIntent.client_secret,
        });

    } catch (error) {
        console.error('Stripe Error:', error);
        res.status(500).json({ message: 'Failed to create payment intent', error: error.message });
    }
};

module.exports = { createPaymentIntent };