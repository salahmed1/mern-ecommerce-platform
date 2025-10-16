require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Import route files
const productRoutes = require('./routes/productRoutes'); // <-- ADD THIS LINE
const paymentRoutes = require('./routes/paymentRoutes');
const userRoutes = require('./routes/userRoutes'); 
const orderRoutes = require('./routes/orderRoutes');

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('E-Commerce Platform API is running...');
});

// Use the imported routes
app.use('/api/products', productRoutes); // <-- ADD THIS LINE
app.use('/api/payment', paymentRoutes); 
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes); 

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running in development mode on port ${PORT}`);
});