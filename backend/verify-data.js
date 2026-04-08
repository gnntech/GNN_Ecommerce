const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Bracelet = require('./models/Bracelet');
const Tree = require('./models/Tree');
const Gemstone = require('./models/Gemstone');
const Review = require('./models/Review');
const Slider = require('./models/Slider');
const Gallery = require('./models/Gallery');
const Collection = require('./models/Collection');
const SectionContent = require('./models/SectionContent');

dotenv.config();

async function verifyData() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected\n');
    
    const braceletCount = await Bracelet.countDocuments();
    const treeCount = await Tree.countDocuments();
    const gemstoneCount = await Gemstone.countDocuments();
    const reviewCount = await Review.countDocuments();
    const sliderCount = await Slider.countDocuments();
    const galleryCount = await Gallery.countDocuments();
    const collectionCount = await Collection.countDocuments();
    const sectionContentCount = await SectionContent.countDocuments();
    
    console.log('📊 Database Statistics:');
    console.log(`   Bracelets: ${braceletCount}`);
    console.log(`   Trees: ${treeCount}`);
    console.log(`   Gemstones: ${gemstoneCount}`);
    console.log(`   Reviews: ${reviewCount}`);
    console.log(`   Sliders: ${sliderCount}`);
    console.log(`   Gallery: ${galleryCount}`);
    console.log(`   Collections: ${collectionCount}`);
    console.log(`   Section Content: ${sectionContentCount}`);
    
    if (braceletCount > 0) {
      console.log('\n📿 Sample Bracelets:');
      const bracelets = await Bracelet.find().limit(3);
      bracelets.forEach(b => {
        console.log(`   - ${b.name}`);
        console.log(`     Image: ${b.image}`);
        console.log(`     Price: ${b.price}`);
      });
    }
    
    if (treeCount > 0) {
      console.log('\n🌳 Sample Trees:');
      const trees = await Tree.find().limit(2);
      trees.forEach(t => {
        console.log(`   - ${t.name}`);
        console.log(`     Image: ${t.image}`);
      });
    }
    
    if (gemstoneCount > 0) {
      console.log('\n💎 Sample Gemstones:');
      const gemstones = await Gemstone.find().limit(2);
      gemstones.forEach(g => {
        console.log(`   - ${g.name}`);
        console.log(`     Image: ${g.image}`);
      });
    }
    
    if (reviewCount > 0) {
      console.log('\n⭐ Sample Reviews:');
      const reviews = await Review.find().limit(3);
      reviews.forEach(r => {
        console.log(`   - ${r.name} (${r.role})`);
        console.log(`     Quote: ${r.quote.substring(0, 60)}...`);
        console.log(`     Image: ${r.image}`);
        console.log(`     Video: ${r.isVideoTestimonial ? 'Yes' : 'No'}`);
      });
    }
    
    if (sliderCount > 0) {
      console.log('\n🎠 Sample Sliders:');
      const sliders = await Slider.find().limit(2);
      sliders.forEach(s => {
        console.log(`   - ${s.title}`);
        console.log(`     Image: ${s.image}`);
      });
    }
    
    console.log('\n✨ Verification complete!\n');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

verifyData();
