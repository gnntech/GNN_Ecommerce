require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

const updateStock = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Find the product
        const product = await Product.findOne({ name: 'Jay' });
        if (!product) {
            console.log('Product not found');
            process.exit(1);
        }

        console.log('Current product:');
        console.log('- Stock:', product.stock);
        console.log('- Total Stock:', product.totalStock);
        console.log('- Status:', product.status);

        // Update stock
        product.stock = 10;
        await product.save();

        console.log('\nAfter update:');
        console.log('- Stock:', product.stock);
        console.log('- Total Stock:', product.totalStock);
        console.log('- Status:', product.status);

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

updateStock();
