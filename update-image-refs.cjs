const fs = require('fs');
const path = require('path');

// Files to update
const filesToUpdate = [
  'src/data/bracelet.ts',
  'src/components/BraceletCard.tsx',
  'src/components/TreeCard.tsx',
  'src/components/GemstoneCard.tsx',
  'src/components/ProductSearchSection.tsx',
  'src/pages/BraceletDetail.tsx',
  'src/pages/TreeDetail.tsx',
  'src/pages/GemstoneDetail.tsx',
  'src/pages/Checkout.tsx',
  'src/components/ImageGalleryScroll.tsx',
  'src/components/About.tsx',
];

function updateImageReferences(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(`⏭️  Skipping ${filePath} - file not found`);
    return { updated: false };
  }

  let content = fs.readFileSync(filePath, 'utf8');
  const originalContent = content;
  
  // Replace .png, .jpg, .jpeg with .webp in image paths
  content = content.replace(/\/images\/([^"']+)\.(png|jpg|jpeg)/gi, '/images/$1.webp');
  content = content.replace(/\/public\/images\/([^"']+)\.(png|jpg|jpeg)/gi, '/public/images/$1.webp');
  
  // Update specific patterns
  content = content.replace(/\.png["']/g, '.webp"');
  content = content.replace(/\.jpg["']/g, '.webp"');
  content = content.replace(/\.jpeg["']/g, '.webp"');
  
  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    return { updated: true, changes: content.length - originalContent.length };
  }
  
  return { updated: false };
}

function main() {
  console.log('\n🔄 Updating Image References to WebP\n');
  console.log('━'.repeat(60));
  
  let updatedCount = 0;
  let skippedCount = 0;
  
  for (const file of filesToUpdate) {
    const result = updateImageReferences(file);
    
    if (result.updated) {
      console.log(`✅ Updated: ${file}`);
      updatedCount++;
    } else {
      console.log(`⏭️  No changes: ${file}`);
      skippedCount++;
    }
  }
  
  console.log('\n━'.repeat(60));
  console.log(`\n📊 Summary:`);
  console.log(`   ✅ Updated: ${updatedCount} files`);
  console.log(`   ⏭️  Skipped: ${skippedCount} files`);
  console.log('\n✨ Image references updated!\n');
  console.log('💡 Next steps:');
  console.log('   1. Test the application');
  console.log('   2. Check browser console for any 404 errors');
  console.log('   3. Verify images load correctly');
  console.log('   4. Test on different browsers\n');
}

main();
