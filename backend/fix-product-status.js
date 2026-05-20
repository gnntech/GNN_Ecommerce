const mongoose = require("mongoose");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

// Import the unified Product model
const Product = require("./models/Product");

// Connect to MongoDB
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

// Fix product statuses and add stock
const fixProductStatus = async () => {
    console.log('🔧 Fixing Product Status and Stock...\n');

    try {
        // Get all products
        const products = await Product.find({});
        console.log(`Found ${products.length} products to update\n`);

        let updated = 0;

        for (const product of products) {
            // Add stock if it's 0
            if (product.stock === 0) {
                product.stock = 10; // Set default stock to 10
            }

            // Update status to active if it's out-of-stock
            if (product.status === 'out-of-stock') {
                product.status = 'active';
            }

            await product.save();
            updated++;
            
            console.log(`✅ Updated: ${product.name}`);
            console.log(`   Category: ${product.category}`);
            console.log(`   Stock: ${product.stock}`);
            console.log(`   Status: ${product.status}`);
            console.log(`   Total Stock: ${product.totalStock}\n`);
        }

        console.log(`\n🎉 Successfully updated ${updated} products!`);

        // Verify the changes
        const activeProducts = await Product.countDocuments({ status: 'active' });
        const inStockProducts = await Product.countDocuments({ isInStock: true });
        
        console.log('\n📊 Current Status:');
        console.log(`   Active products: ${activeProducts}`);
        console.log(`   In-stock products: ${inStockProducts}`);

        // Show products by category
        const categoryCounts = await Product.aggregate([
            { $match: { status: 'active' } },
            { $group: { _id: '$category', count: { $sum: 1 } } }
        ]);

        console.log('\n📦 Active products by category:');
        categoryCounts.forEach(({ _id, count }) => {
            console.log(`   ${_id}: ${count} products`);
        });

    } catch (error) {
        console.error('❌ Error fixing product status:', error);
    }
};

// Run the fix
const runFix = async () => {
    await connectDB();
    await fixProductStatus();
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
};

// Handle process termination
process.on('SIGINT', async () => {
    console.log('\n⚠️  Process interrupted by user');
    await mongoose.connection.close();
    process.exit(0);
});

process.on('unhandledRejection', async (err) => {
    console.error('❌ Unhandled Promise Rejection:', err);
    await mongoose.connection.close();
    process.exit(1);
});

// Run the fix
runFix();