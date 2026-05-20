const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import all models to ensure indexes are created
const User = require('./models/User');
const Gemstone = require('./models/Gemstone');
const Tree = require('./models/Tree');
const Bracelet = require('./models/Bracelet');
const Order = require('./models/Order');
const Review = require('./models/Review');
const Collection = require('./models/Collection');
const Gallery = require('./models/Gallery');

const buildIndexes = async () => {
    try {
        console.log('🔌 Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ MongoDB Connected');

        console.log('\n📊 Building indexes for all collections...\n');

        // Build indexes for each model
        const models = [
            { name: 'User', model: User },
            { name: 'Gemstone', model: Gemstone },
            { name: 'Tree', model: Tree },
            { name: 'Bracelet', model: Bracelet },
            { name: 'Order', model: Order },
            { name: 'Review', model: Review },
            { name: 'Collection', model: Collection },
            { name: 'Gallery', model: Gallery },
        ];

        for (const { name, model } of models) {
            try {
                console.log(`⏳ Building indexes for ${name}...`);
                await model.createIndexes();
                
                // Get index information
                const indexes = await model.collection.getIndexes();
                console.log(`✅ ${name} indexes created:`);
                Object.keys(indexes).forEach(indexName => {
                    console.log(`   - ${indexName}`);
                });
                console.log('');
            } catch (error) {
                console.error(`❌ Error building indexes for ${name}:`, error.message);
            }
        }

        console.log('🎉 All indexes built successfully!');
        console.log('\n📈 Performance optimization complete.');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await mongoose.connection.close();
        console.log('\n🔌 MongoDB connection closed');
        process.exit(0);
    }
};

// Run the script
buildIndexes();
