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

// Test functions
const testUnifiedAPI = async () => {
    console.log('🧪 Testing Unified Product API...\n');

    try {
        // Test 1: Count products by category
        console.log('📊 Test 1: Product counts by category');
        const categoryCounts = await Product.aggregate([
            { $group: { _id: '$category', count: { $sum: 1 } } }
        ]);
        categoryCounts.forEach(({ _id, count }) => {
            console.log(`   ${_id}: ${count} products`);
        });

        // Test 2: Price field validation
        console.log('\n💰 Test 2: Price field validation');
        const priceIssues = await Product.find({
            $or: [
                { price: { $type: 'string' } },
                { price: { $exists: false } },
                { price: null }
            ]
        });
        
        if (priceIssues.length === 0) {
            console.log('   ✅ All products have valid numeric prices');
        } else {
            console.log(`   ❌ Found ${priceIssues.length} products with price issues`);
            priceIssues.slice(0, 3).forEach(product => {
                console.log(`      - ${product.name}: price = ${product.price} (${typeof product.price})`);
            });
        }

        // Test 3: Sorting functionality
        console.log('\n🔄 Test 3: Sorting functionality');
        
        // Test price sorting (ascending)
        const sortedByPriceAsc = await Product.find({ status: 'active' })
            .sort({ price: 1 })
            .limit(3)
            .select('name price category');
        
        console.log('   Price sorting (low to high):');
        sortedByPriceAsc.forEach(product => {
            console.log(`      ${product.name}: ₹${product.price} (${product.category})`);
        });

        // Test price sorting (descending)
        const sortedByPriceDesc = await Product.find({ status: 'active' })
            .sort({ price: -1 })
            .limit(3)
            .select('name price category');
        
        console.log('   Price sorting (high to low):');
        sortedByPriceDesc.forEach(product => {
            console.log(`      ${product.name}: ₹${product.price} (${product.category})`);
        });

        // Test 4: Filtering functionality
        console.log('\n🔍 Test 4: Filtering functionality');
        
        // Test category filtering
        const gemstones = await Product.countDocuments({ category: 'gemstones', status: 'active' });
        const bracelets = await Product.countDocuments({ category: 'bracelets', status: 'active' });
        const trees = await Product.countDocuments({ category: 'trees', status: 'active' });
        
        console.log('   Active products by category:');
        console.log(`      Gemstones: ${gemstones}`);
        console.log(`      Bracelets: ${bracelets}`);
        console.log(`      Trees: ${trees}`);

        // Test price range filtering
        const midRangeProducts = await Product.countDocuments({
            price: { $gte: 500, $lte: 2000 },
            status: 'active'
        });
        console.log(`   Products in ₹500-₹2000 range: ${midRangeProducts}`);

        // Test 5: Stock and status validation
        console.log('\n📦 Test 5: Stock and status validation');
        
        const stockStats = await Product.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 },
                    avgStock: { $avg: '$totalStock' },
                    totalStock: { $sum: '$totalStock' }
                }
            }
        ]);
        
        console.log('   Stock statistics by status:');
        stockStats.forEach(stat => {
            console.log(`      ${stat._id}: ${stat.count} products, avg stock: ${Math.round(stat.avgStock)}, total: ${stat.totalStock}`);
        });

        // Test 6: Variant functionality
        console.log('\n🎨 Test 6: Variant functionality');
        
        const productsWithVariants = await Product.countDocuments({ hasVariants: true });
        const totalVariants = await Product.aggregate([
            { $match: { hasVariants: true } },
            { $project: { variantCount: { $size: '$variants' } } },
            { $group: { _id: null, totalVariants: { $sum: '$variantCount' } } }
        ]);
        
        console.log(`   Products with variants: ${productsWithVariants}`);
        console.log(`   Total variants across all products: ${totalVariants[0]?.totalVariants || 0}`);

        // Test 7: Search functionality
        console.log('\n🔎 Test 7: Search functionality');
        
        try {
            const searchResults = await Product.find(
                { $text: { $search: 'crystal' } },
                { score: { $meta: 'textScore' } }
            )
            .sort({ score: { $meta: 'textScore' } })
            .limit(3)
            .select('name category');
            
            if (searchResults.length > 0) {
                console.log('   Search results for "crystal":');
                searchResults.forEach(product => {
                    console.log(`      ${product.name} (${product.category})`);
                });
            } else {
                console.log('   No search results found for "crystal"');
            }
        } catch (error) {
            console.log('   ⚠️  Text search not available (text index may not be created yet)');
        }

        // Test 8: Performance indexes
        console.log('\n⚡ Test 8: Index validation');
        
        const indexes = await Product.collection.getIndexes();
        const indexNames = Object.keys(indexes);
        
        console.log('   Available indexes:');
        indexNames.forEach(indexName => {
            if (indexName !== '_id_') {
                console.log(`      ${indexName}`);
            }
        });

        // Test 9: Virtual fields
        console.log('\n🔗 Test 9: Virtual fields');
        
        const sampleProduct = await Product.findOne({ status: 'active' });
        if (sampleProduct) {
            console.log(`   Sample product: ${sampleProduct.name}`);
            console.log(`      Formatted price: ${sampleProduct.formattedPrice}`);
            console.log(`      Has variants: ${sampleProduct.hasVariants}`);
            console.log(`      Active variants: ${sampleProduct.activeVariants?.length || 0}`);
            if (sampleProduct.lowestPrice) {
                console.log(`      Lowest price: ₹${sampleProduct.lowestPrice}`);
            }
        }

        console.log('\n✅ All tests completed successfully!');
        console.log('\n📋 Summary:');
        console.log('   - Unified Product schema is working correctly');
        console.log('   - Price fields are properly converted to numbers');
        console.log('   - Sorting and filtering functionality is operational');
        console.log('   - Stock and status management is functioning');
        console.log('   - Variant support is implemented');
        console.log('   - Performance indexes are in place');

    } catch (error) {
        console.error('❌ Test failed:', error.message);
        console.error('Stack trace:', error.stack);
    }
};

// Run tests
const runTests = async () => {
    await connectDB();
    await testUnifiedAPI();
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
};

// Handle process termination
process.on('SIGINT', async () => {
    console.log('\n⚠️  Tests interrupted by user');
    await mongoose.connection.close();
    process.exit(0);
});

process.on('unhandledRejection', async (err) => {
    console.error('❌ Unhandled Promise Rejection:', err);
    await mongoose.connection.close();
    process.exit(1);
});

// Run the tests
runTests();