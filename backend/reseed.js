const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import models
const Bracelet = require('./models/Bracelet');
const Tree = require('./models/Tree');
const Gemstone = require('./models/Gemstone');
const Review = require('./models/Review');
const Slider = require('./models/Slider');
const Gallery = require('./models/Gallery');
const Collection = require('./models/Collection');
const SectionContent = require('./models/SectionContent');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => {
    console.error('❌ MongoDB Connection Error:', err);
    process.exit(1);
  });

async function clearDatabase() {
  console.log('\n🗑️  Clearing old data...\n');
  
  try {
    await Bracelet.deleteMany({});
    console.log('✅ Cleared Bracelets');
    
    await Tree.deleteMany({});
    console.log('✅ Cleared Trees');
    
    await Gemstone.deleteMany({});
    console.log('✅ Cleared Gemstones');
    
    await Review.deleteMany({});
    console.log('✅ Cleared Reviews');
    
    await Slider.deleteMany({});
    console.log('✅ Cleared Sliders');
    
    await Gallery.deleteMany({});
    console.log('✅ Cleared Gallery');
    
    await Collection.deleteMany({});
    console.log('✅ Cleared Collections');
    
    await SectionContent.deleteMany({});
    console.log('✅ Cleared Section Content');
    
    console.log('\n✨ Database cleared successfully!\n');
  } catch (error) {
    console.error('❌ Error clearing database:', error);
    throw error;
  }
}

async function seedDatabase() {
  console.log('🌱 Seeding database with new data...\n');
  
  try {
    // Import and run seed functions directly
    const { exec } = require('child_process');
    const util = require('util');
    const execPromise = util.promisify(exec);
    
    console.log('📦 Seeding products...');
    await execPromise('node seed_products.js', { cwd: __dirname });
    
    console.log('📦 Seeding content...');
    await execPromise('node seed_content.js', { cwd: __dirname });
    
    console.log('📦 Seeding testimonials...');
    await execPromise('node seed_testimonials.js', { cwd: __dirname });
    
    console.log('\n✨ Database seeded successfully!\n');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

async function reseed() {
  try {
    console.log('\n🚀 Starting database reseed...\n');
    console.log('━'.repeat(60));
    
    await clearDatabase();
    await seedDatabase();
    
    console.log('━'.repeat(60));
    console.log('\n🎉 Reseed complete!\n');
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Reseed failed:', error);
    process.exit(1);
  }
}

reseed();
