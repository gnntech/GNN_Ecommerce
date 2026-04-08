const fs = require('fs');
const path = require('path');

// Images that are actually used in the codebase
const usedImages = [
  // Bracelet images
  'S-Amazonite Bracelet.webp',
  'S-Amethyst Bracelet.webp',
  'S-Azurite Bracelet.webp',
  'S-BloodstoneBracelet.webp',
  'S-CatEye Bracelet.webp',
  'S-Citrine Bracelet.webp',
  'S-DragonVein Bracelet.webp',
  'S-GreenAventurian Bracelet.webp',
  'S-GreenJade Bracelet.webp',
  'S-Howlite Bracelet.webp',
  'S-Lava Bracelet.webp',
  'S-MoonStone Bracelet.webp',
  'S-ReadJasper Bracelet.webp',
  'S-RoseQuartz Bracelet.webp',
  'S-SulemaniHaquik Bracelet.webp',
  'S-TigerEye Bracelet.webp',
  'S-Turquoise Bracelet.webp',
  
  // UI/Layout images
  'logo.webp',
  'GaurabNPP.webp',
  'expertise.webp',
  'Trees.webp',
  'Gemstone.webp',
  'D.webp',
  'WingsD.webp',
  'Square.webp',
  'bg.webp',
  'A-Icon1o.webp',
  'A-Icon2o.webp',
  'A-Icon3o.webp',
  'FiveStars.webp',
  
  // Hero/Background images
  'NewHeroVid.mp4',
  'NewHeroVid.webm',
  'section2-bg.webp',
  'text-overlay.webp',
  
  // Circle images (hero section)
  'Circle1.webp',
  'Circle2.webp',
  'Circle3.webp',
  'Circle4.webp',
  
  // Slider images
  'slider1.webp',
  'slider2.webp',
  'slider3.webp',
  'slider4.webp',
  'slider-blue.webp',
  'hero-new.webp',
  'HeroBg.webp',
  'NewHero.webp',
  'Shop1.webp',
];

// Root public images
const rootPublicImages = [
  'angel_numbers_vibration_1772369577059.webp',
  'astrology_zodiac_wheel_1772369534438.webp',
  'golden_ratio_celestial_1772369518930.webp',
  'numerologist_portrait_1772371205774.webp',
  'numerology_chart_mystic_1772369558989.webp',
  'numerology_products_bracelets_1772371244109.webp',
  'numerology_products_gemstones_1772371227250.webp',
  'sacred_lotus_mandala_1772369604643.webp',
  'robots.txt',
];

function cleanupImages() {
  console.log('\n🧹 Cleaning up unused and duplicate images...\n');
  console.log('━'.repeat(60));
  
  const imagesDir = path.join(__dirname, 'public', 'images');
  const publicDir = path.join(__dirname, 'public');
  
  let deletedCount = 0;
  let keptCount = 0;
  let totalSaved = 0;
  
  // Clean images directory
  if (fs.existsSync(imagesDir)) {
    const files = fs.readdirSync(imagesDir);
    
    files.forEach(file => {
      const filePath = path.join(imagesDir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isFile()) {
        // Delete old PNG/JPG files (we have WebP now)
        if (/\.(png|jpg|jpeg)$/i.test(file)) {
          const fileSize = stat.size;
          fs.unlinkSync(filePath);
          console.log(`🗑️  Deleted old format: ${file} (${(fileSize / 1024).toFixed(2)}KB)`);
          deletedCount++;
          totalSaved += fileSize;
        }
        // Keep only used WebP files
        else if (!usedImages.includes(file)) {
          const fileSize = stat.size;
          fs.unlinkSync(filePath);
          console.log(`🗑️  Deleted unused: ${file} (${(fileSize / 1024).toFixed(2)}KB)`);
          deletedCount++;
          totalSaved += fileSize;
        } else {
          keptCount++;
        }
      }
    });
  }
  
  // Clean root public directory
  const publicFiles = fs.readdirSync(publicDir);
  publicFiles.forEach(file => {
    const filePath = path.join(publicDir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isFile()) {
      // Delete old PNG/JPG files
      if (/\.(png|jpg|jpeg)$/i.test(file)) {
        const fileSize = stat.size;
        fs.unlinkSync(filePath);
        console.log(`🗑️  Deleted old format: ${file} (${(fileSize / 1024).toFixed(2)}KB)`);
        deletedCount++;
        totalSaved += fileSize;
      }
      // Keep only used files
      else if (!rootPublicImages.includes(file)) {
        if (/\.(webp|mp4|webm)$/i.test(file)) {
          const fileSize = stat.size;
          fs.unlinkSync(filePath);
          console.log(`🗑️  Deleted unused: ${file} (${(fileSize / 1024).toFixed(2)}KB)`);
          deletedCount++;
          totalSaved += fileSize;
        }
      }
    }
  });
  
  console.log('\n━'.repeat(60));
  console.log(`\n📊 Cleanup Summary:`);
  console.log(`   🗑️  Deleted: ${deletedCount} files`);
  console.log(`   ✅ Kept: ${keptCount} files`);
  console.log(`   💾 Space saved: ${(totalSaved / 1024 / 1024).toFixed(2)}MB`);
}

function updateSeedFiles() {
  console.log('\n\n📝 Updating seed files with WebP images...\n');
  console.log('━'.repeat(60));
  
  const seedFiles = [
    'backend/seed_products.js',
    'backend/seed.js',
    'backend/seed_content.js',
    'backend/seed_testimonials.js',
  ];
  
  let updatedCount = 0;
  
  seedFiles.forEach(seedFile => {
    const filePath = path.join(__dirname, seedFile);
    
    if (!fs.existsSync(filePath)) {
      console.log(`⏭️  Skipping ${seedFile} - file not found`);
      return;
    }
    
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;
    
    // Replace PNG/JPG with WebP
    content = content.replace(/\/images\/([^"']+)\.(png|jpg|jpeg)/gi, '/images/$1.webp');
    content = content.replace(/\.png/g, '.webp');
    content = content.replace(/\.jpg/g, '.webp');
    content = content.replace(/\.jpeg/g, '.webp');
    
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Updated: ${seedFile}`);
      updatedCount++;
    } else {
      console.log(`⏭️  No changes: ${seedFile}`);
    }
  });
  
  console.log('\n━'.repeat(60));
  console.log(`\n📊 Seed Files Summary:`);
  console.log(`   ✅ Updated: ${updatedCount} files`);
}

function createReseedScript() {
  console.log('\n\n📜 Creating database reseed script...\n');
  
  const reseedScript = `const mongoose = require('mongoose');
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
  console.log('\\n🗑️  Clearing old data...\\n');
  
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
    
    console.log('\\n✨ Database cleared successfully!\\n');
  } catch (error) {
    console.error('❌ Error clearing database:', error);
    throw error;
  }
}

async function seedDatabase() {
  console.log('🌱 Seeding database with new data...\\n');
  
  try {
    // Run seed scripts
    console.log('📦 Seeding products...');
    require('./seed_products');
    
    console.log('📦 Seeding content...');
    require('./seed_content');
    
    console.log('📦 Seeding testimonials...');
    require('./seed_testimonials');
    
    console.log('\\n✨ Database seeded successfully!\\n');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

async function reseed() {
  try {
    console.log('\\n🚀 Starting database reseed...\\n');
    console.log('━'.repeat(60));
    
    await clearDatabase();
    await seedDatabase();
    
    console.log('━'.repeat(60));
    console.log('\\n🎉 Reseed complete!\\n');
    
    process.exit(0);
  } catch (error) {
    console.error('\\n❌ Reseed failed:', error);
    process.exit(1);
  }
}

reseed();
`;
  
  fs.writeFileSync(path.join(__dirname, 'backend', 'reseed.js'), reseedScript);
  console.log('✅ Created backend/reseed.js');
  
  console.log('\n💡 To reseed the database, run:');
  console.log('   cd backend && node reseed.js');
}

function main() {
  console.log('\n🚀 GNN E-commerce Cleanup & Seed Update Tool\n');
  console.log('━'.repeat(60));
  console.log('\nThis script will:');
  console.log('  1. Delete old PNG/JPG files (WebP versions exist)');
  console.log('  2. Remove unused images');
  console.log('  3. Update seed files to use WebP');
  console.log('  4. Create database reseed script');
  console.log('\n━'.repeat(60));
  
  cleanupImages();
  updateSeedFiles();
  createReseedScript();
  
  console.log('\n\n✨ Cleanup complete!\n');
  console.log('📋 Next steps:');
  console.log('   1. Review deleted files list above');
  console.log('   2. Test the application (npm run dev)');
  console.log('   3. Reseed database: cd backend && node reseed.js');
  console.log('   4. Verify all images load correctly');
  console.log('   5. Commit changes to git\n');
}

main();
