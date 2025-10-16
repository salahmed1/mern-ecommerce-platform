require('dotenv').config();
const connectDB = require('./config/db');
const Product = require('./models/productModel');
const productsData = require('./data/products');

connectDB();

const importData = async () => {
    try {
        // Clear existing data
        await Product.deleteMany({});

        await Product.insertMany(productsData);

        console.log('Data Imported Successfully!');
        process.exit();
    } catch (error) {
        console.error('Error with data import:', error);
        process.exit(1);
    }
};

const destroyData = async () => {
    try {
        await Product.deleteMany({});

        console.log('Data Destroyed Successfully!');
        process.exit();
    } catch (error) {
        console.error('Error with data destruction:', error);
        process.exit(1);
    }
};

// This allows us to run 'node seeder.js -d' from the command line
if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}