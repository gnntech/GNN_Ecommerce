/**
 * Seed default categories for navbar
 * Run with: node seed-default-categories.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('./models/Category');

const defaultCategories = [
    {
        name: 'Gemstones',
        slug: '/collection',
        icon: 'Gem',
        sortOrder: 0,
        isActive: true
    },
    {
        name: 'Bracelets',
        slug: '/bracelets',
        icon: 'Watch',
        sortOrder: 1,
        isActive: true
    },
    {
        name: 'Trees',
        slug: '/trees',
        icon: 'Trees',
        sortOrder: 2,
        isActive: true
    }
];

async function seedCategories() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        // Check if categories already exist
        const existingCount = await Category.countDocuments();
        
        if (existingCount > 0) {
            console.log(`ℹ️  ${existingCount} categories already exist`);
            console.log('   Skipping seed to avoid duplicates');
            process.exit(0);
        }

        // Insert default categories
        const result = await Category.insertMany(defaultCategories);
        console.log(`✅ Successfully seeded ${result.length} categories:`);
        
        result.forEach(cat => {
            console.log(`   - ${cat.name} (${cat.slug})`);
        });

    } catch (error) {
        console.error('❌ Error seeding categories:', error.message);
        process.exit(1);
    } finally {
        await mongoose.connection.close();
        console.log('\n🔌 Disconnected from MongoDB');
        process.exit(0);
    }
}

seedCategories();
