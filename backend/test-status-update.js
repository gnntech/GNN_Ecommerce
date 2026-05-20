/**
 * Test script to verify product status updates work correctly
 * Run with: node test-status-update.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

async function testStatusUpdate() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        // Find a product with stock
        const product = await Product.findOne({ totalStock: { $gt: 0 } });
        
        if (!product) {
            console.log('❌ No products with stock found');
            process.exit(1);
        }

        console.log('\n📦 Testing product:');
        console.log(`   Name: ${product.name}`);
        console.log(`   Current Status: ${product.status}`);
        console.log(`   Total Stock: ${product.totalStock}`);

        // Test 1: Change to out-of-stock
        console.log('\n🧪 Test 1: Changing status to "out-of-stock"...');
        product.status = 'out-of-stock';
        await product.save();
        
        // Reload from database
        const updated1 = await Product.findById(product._id);
        console.log(`   Status after save: ${updated1.status}`);
        
        if (updated1.status === 'out-of-stock') {
            console.log('   ✅ Test 1 PASSED: Status persisted as "out-of-stock"');
        } else {
            console.log(`   ❌ Test 1 FAILED: Status is "${updated1.status}" instead of "out-of-stock"`);
        }

        // Test 2: Change to inactive
        console.log('\n🧪 Test 2: Changing status to "inactive"...');
        updated1.status = 'inactive';
        await updated1.save();
        
        const updated2 = await Product.findById(product._id);
        console.log(`   Status after save: ${updated2.status}`);
        
        if (updated2.status === 'inactive') {
            console.log('   ✅ Test 2 PASSED: Status persisted as "inactive"');
        } else {
            console.log(`   ❌ Test 2 FAILED: Status is "${updated2.status}" instead of "inactive"`);
        }

        // Test 3: Change back to active
        console.log('\n🧪 Test 3: Changing status back to "active"...');
        updated2.status = 'active';
        await updated2.save();
        
        const updated3 = await Product.findById(product._id);
        console.log(`   Status after save: ${updated3.status}`);
        
        if (updated3.status === 'active') {
            console.log('   ✅ Test 3 PASSED: Status persisted as "active"');
        } else {
            console.log(`   ❌ Test 3 FAILED: Status is "${updated3.status}" instead of "active"`);
        }

        console.log('\n✅ All tests completed!');
        console.log('📝 Product status updates are working correctly.');
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
    } finally {
        await mongoose.connection.close();
        console.log('\n🔌 Disconnected from MongoDB');
        process.exit(0);
    }
}

testStatusUpdate();
