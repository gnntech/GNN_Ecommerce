const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const config = {
  webp: {
    quality: 85,
    effort: 6,
  },
  video: {
    crf: 30,
    audioBitrate: '128k',
  }
};

// Scan for images
function scanImages(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory() && file !== 'node_modules') {
      scanImages(fullPath, fileList);
    } else if (/\.(png|jpg|jpeg)$/i.test(file)) {
      fileList.push(fullPath);
    }
  });
  
  return fileList;
}

// Convert single image to WebP
async function convertToWebP(imagePath) {
  const webpPath = imagePath.replace(/\.(png|jpg|jpeg)$/i, '.webp');
  
  // Skip if WebP already exists
  if (fs.existsSync(webpPath)) {
    return { status: 'skipped', path: imagePath };
  }
  
  try {
    const originalSize = fs.statSync(imagePath).size;
    
    await sharp(imagePath)
      .webp(config.webp)
      .toFile(webpPath);
    
    const webpSize = fs.statSync(webpPath).size;
    const savings = ((1 - webpSize / originalSize) * 100).toFixed(1);
    
    return {
      status: 'converted',
      path: imagePath,
      originalSize: (originalSize / 1024).toFixed(2),
      webpSize: (webpSize / 1024).toFixed(2),
      savings: savings
    };
  } catch (error) {
    return {
      status: 'error',
      path: imagePath,
      error: error.message
    };
  }
}

// Convert all images
async function convertAllImages() {
  console.log('🔄 Starting image conversion to WebP...\n');
  
  const publicDir = path.join(__dirname, 'public');
  const images = scanImages(publicDir);
  
  console.log(`📸 Found ${images.length} images to process\n`);
  
  const results = {
    converted: 0,
    skipped: 0,
    errors: 0,
    totalOriginalSize: 0,
    totalWebpSize: 0
  };
  
  for (const imagePath of images) {
    const relativePath = path.relative(publicDir, imagePath);
    const result = await convertToWebP(imagePath);
    
    if (result.status === 'converted') {
      console.log(`✅ Converted: ${relativePath}`);
      console.log(`   Original: ${result.originalSize}KB | WebP: ${result.webpSize}KB | Saved: ${result.savings}%\n`);
      results.converted++;
      results.totalOriginalSize += parseFloat(result.originalSize);
      results.totalWebpSize += parseFloat(result.webpSize);
    } else if (result.status === 'skipped') {
      console.log(`⏭️  Skipped: ${relativePath} (already exists)`);
      results.skipped++;
    } else {
      console.log(`❌ Error: ${relativePath} - ${result.error}`);
      results.errors++;
    }
  }
  
  console.log('\n📊 Image Conversion Summary:');
  console.log(`   ✅ Converted: ${results.converted}`);
  console.log(`   ⏭️  Skipped: ${results.skipped}`);
  console.log(`   ❌ Errors: ${results.errors}`);
  
  if (results.converted > 0) {
    const totalSavings = results.totalOriginalSize - results.totalWebpSize;
    const savingsPercent = ((totalSavings / results.totalOriginalSize) * 100).toFixed(1);
    console.log(`   💾 Total Saved: ${totalSavings.toFixed(2)}KB (${savingsPercent}%)`);
  }
}

// Convert videos
async function convertVideos() {
  console.log('\n\n🎥 Starting video optimization...\n');
  
  // Check if ffmpeg is installed
  try {
    execSync('ffmpeg -version', { stdio: 'ignore' });
  } catch (error) {
    console.log('❌ FFmpeg not installed. Skipping video conversion.');
    console.log('   Install FFmpeg: https://ffmpeg.org/download.html');
    console.log('   Or use: choco install ffmpeg (Windows)\n');
    return;
  }
  
  const publicDir = path.join(__dirname, 'public');
  const videos = [];
  
  // Scan for videos
  function scanVideos(dir) {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory() && file !== 'node_modules') {
        scanVideos(fullPath);
      } else if (/\.(mp4|mov|avi)$/i.test(file)) {
        videos.push(fullPath);
      }
    });
  }
  
  scanVideos(publicDir);
  
  if (videos.length === 0) {
    console.log('ℹ️  No videos found to convert\n');
    return;
  }
  
  console.log(`🎬 Found ${videos.length} video(s) to process\n`);
  
  let converted = 0;
  let skipped = 0;
  
  for (const videoPath of videos) {
    const relativePath = path.relative(publicDir, videoPath);
    const webmPath = videoPath.replace(/\.(mp4|mov|avi)$/i, '.webm');
    
    if (fs.existsSync(webmPath)) {
      console.log(`✅ ${path.basename(webmPath)} already exists - skipping`);
      skipped++;
      continue;
    }
    
    try {
      console.log(`🔄 Converting: ${relativePath}`);
      
      const originalSize = fs.statSync(videoPath).size;
      
      execSync(
        `ffmpeg -i "${videoPath}" -c:v libvpx-vp9 -crf ${config.video.crf} -b:v 0 -b:a ${config.video.audioBitrate} -c:a libopus "${webmPath}"`,
        { stdio: 'inherit' }
      );
      
      const webmSize = fs.statSync(webmPath).size;
      const originalMB = (originalSize / 1024 / 1024).toFixed(2);
      const webmMB = (webmSize / 1024 / 1024).toFixed(2);
      const savings = ((1 - webmSize / originalSize) * 100).toFixed(1);
      
      console.log(`✅ Converted: ${relativePath}`);
      console.log(`   Original: ${originalMB}MB | WebM: ${webmMB}MB | Saved: ${savings}%\n`);
      converted++;
    } catch (error) {
      console.log(`❌ Error converting ${relativePath}: ${error.message}\n`);
    }
  }
  
  console.log('📊 Video Conversion Summary:');
  console.log(`   ✅ Converted: ${converted}`);
  console.log(`   ⏭️  Skipped: ${skipped}`);
}

// Main execution
async function main() {
  console.log('\n🚀 GNN E-commerce Media Optimization Tool\n');
  console.log('━'.repeat(60));
  
  await convertAllImages();
  await convertVideos();
  
  console.log('\n✨ Optimization complete!\n');
  console.log('💡 Next steps:');
  console.log('   1. Update image references to use .webp format');
  console.log('   2. Add <picture> tags with fallbacks');
  console.log('   3. Test on different browsers');
  console.log('   4. Measure performance improvements\n');
}

main().catch(console.error);
