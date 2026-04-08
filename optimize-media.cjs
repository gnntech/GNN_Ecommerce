const imagemin = require('imagemin');
const imageminWebp = require('imagemin-webp');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Handle both default and named exports
const webpPlugin = imageminWebp.default || imageminWebp;

// List of images to convert (automatically detected)
const imagesToConvert = [];

// Scan public/images directory for all PNG, JPG, JPEG files
function scanImages() {
  const imagesDir = path.join(__dirname, 'public', 'images');
  
  if (!fs.existsSync(imagesDir)) {
    console.log('❌ public/images directory not found');
    return;
  }

  const files = fs.readdirSync(imagesDir);
  
  files.forEach(file => {
    if (/\.(png|jpg|jpeg)$/i.test(file)) {
      imagesToConvert.push(path.join('images', file));
    }
  });

  // Also check root public directory
  const publicDir = path.join(__dirname, 'public');
  const publicFiles = fs.readdirSync(publicDir);
  
  publicFiles.forEach(file => {
    if (/\.(png|jpg|jpeg)$/i.test(file)) {
      imagesToConvert.push(file);
    }
  });

  console.log(`📸 Found ${imagesToConvert.length} images to process\n`);
}

// Convert images to WebP
async function convertImages() {
  console.log('🔄 Starting image conversion to WebP...\n');

  let converted = 0;
  let skipped = 0;
  let errors = 0;

  for (const image of imagesToConvert) {
    const imagePath = path.join('public', image);

    // Check if file exists
    if (!fs.existsSync(imagePath)) {
      console.log(`⚠️  Skipping ${image} - file not found`);
      skipped++;
      continue;
    }

    // Check if WebP version already exists
    const webpName = image.replace(/\.(png|jpeg|jpg)$/i, '.webp');
    const webpPath = path.join('public', webpName);

    if (fs.existsSync(webpPath)) {
      console.log(`✅ ${webpName} already exists - skipping`);
      skipped++;
      continue;
    }

    try {
      const outputDir = path.dirname(webpPath);
      
      await imagemin([imagePath], {
        destination: outputDir,
        plugins: [
          webpPlugin({
            quality: 85,
            method: 6,
          })
        ]
      });

      // Get file sizes for comparison
      const originalSize = (fs.statSync(imagePath).size / 1024).toFixed(2);
      const webpSize = (fs.statSync(webpPath).size / 1024).toFixed(2);
      const savings = ((1 - webpSize / originalSize) * 100).toFixed(1);

      console.log(`✅ Converted: ${image} → ${webpName}`);
      console.log(`   Original: ${originalSize}KB | WebP: ${webpSize}KB | Saved: ${savings}%\n`);
      converted++;
    } catch (error) {
      console.error(`❌ Error converting ${image}:`, error.message);
      errors++;
    }
  }

  console.log('\n📊 Image Conversion Summary:');
  console.log(`   ✅ Converted: ${converted}`);
  console.log(`   ⏭️  Skipped: ${skipped}`);
  console.log(`   ❌ Errors: ${errors}`);
}

// Convert video to optimized WebM format
async function convertVideos() {
  console.log('\n\n🎥 Starting video optimization...\n');

  const videosToConvert = [];
  const publicDir = path.join(__dirname, 'public');

  // Scan for videos
  function scanDirectory(dir) {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory() && file !== 'node_modules') {
        scanDirectory(fullPath);
      } else if (/\.(mp4|mov|avi)$/i.test(file)) {
        const relativePath = path.relative(publicDir, fullPath);
        videosToConvert.push(relativePath);
      }
    });
  }

  scanDirectory(publicDir);

  if (videosToConvert.length === 0) {
    console.log('ℹ️  No videos found to convert');
    return;
  }

  console.log(`🎬 Found ${videosToConvert.length} video(s) to process\n`);

  // Check if ffmpeg is installed
  try {
    execSync('ffmpeg -version', { stdio: 'ignore' });
  } catch (error) {
    console.log('❌ FFmpeg not installed. Please install FFmpeg to convert videos.');
    console.log('   Download from: https://ffmpeg.org/download.html');
    console.log('   Or install via: choco install ffmpeg (Windows)');
    return;
  }

  let converted = 0;
  let skipped = 0;

  for (const video of videosToConvert) {
    const videoPath = path.join('public', video);
    const webmName = video.replace(/\.(mp4|mov|avi)$/i, '.webm');
    const webmPath = path.join('public', webmName);

    if (fs.existsSync(webmPath)) {
      console.log(`✅ ${webmName} already exists - skipping`);
      skipped++;
      continue;
    }

    try {
      console.log(`🔄 Converting: ${video} → ${webmName}`);
      
      // Convert to WebM with optimized settings
      execSync(
        `ffmpeg -i "${videoPath}" -c:v libvpx-vp9 -crf 30 -b:v 0 -b:a 128k -c:a libopus "${webmPath}"`,
        { stdio: 'inherit' }
      );

      const originalSize = (fs.statSync(videoPath).size / 1024 / 1024).toFixed(2);
      const webmSize = (fs.statSync(webmPath).size / 1024 / 1024).toFixed(2);
      const savings = ((1 - webmSize / originalSize) * 100).toFixed(1);

      console.log(`✅ Converted: ${video}`);
      console.log(`   Original: ${originalSize}MB | WebM: ${webmSize}MB | Saved: ${savings}%\n`);
      converted++;
    } catch (error) {
      console.error(`❌ Error converting ${video}:`, error.message);
    }
  }

  console.log('\n📊 Video Conversion Summary:');
  console.log(`   ✅ Converted: ${converted}`);
  console.log(`   ⏭️  Skipped: ${skipped}`);
}

// Generate usage report
function generateReport() {
  console.log('\n\n📋 Media Optimization Report\n');
  console.log('━'.repeat(60));
  
  const publicDir = path.join(__dirname, 'public');
  let totalOriginalSize = 0;
  let totalWebpSize = 0;
  let webpCount = 0;

  function calculateSizes(dir) {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory() && file !== 'node_modules') {
        calculateSizes(fullPath);
      } else if (/\.(png|jpg|jpeg)$/i.test(file)) {
        totalOriginalSize += stat.size;
        
        const webpPath = fullPath.replace(/\.(png|jpg|jpeg)$/i, '.webp');
        if (fs.existsSync(webpPath)) {
          totalWebpSize += fs.statSync(webpPath).size;
          webpCount++;
        }
      }
    });
  }

  calculateSizes(publicDir);

  const originalMB = (totalOriginalSize / 1024 / 1024).toFixed(2);
  const webpMB = (totalWebpSize / 1024 / 1024).toFixed(2);
  const savedMB = (originalMB - webpMB).toFixed(2);
  const savedPercent = ((savedMB / originalMB) * 100).toFixed(1);

  console.log(`Total Original Images: ${originalMB}MB`);
  console.log(`Total WebP Images: ${webpMB}MB`);
  console.log(`Total Saved: ${savedMB}MB (${savedPercent}%)`);
  console.log(`WebP Images Created: ${webpCount}`);
  console.log('━'.repeat(60));
}

// Main execution
async function main() {
  console.log('\n🚀 GNN E-commerce Media Optimization Tool\n');
  console.log('━'.repeat(60));
  
  scanImages();
  await convertImages();
  await convertVideos();
  generateReport();
  
  console.log('\n✨ Optimization complete!\n');
  console.log('💡 Next steps:');
  console.log('   1. Update image references in your code to use .webp');
  console.log('   2. Add fallback support for older browsers');
  console.log('   3. Test loading times before and after');
  console.log('   4. Consider deleting original files if not needed\n');
}

main().catch(console.error);
