const mongoose = require("mongoose");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

// Import models
const Product = require("./models/Product");
const Gemstone = require("./models/Gemstone");
const Tree = require("./models/Tree");
const Bracelet = require("./models/Bracelet");

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

// ─────────────────────────────────────────────────────────────────────────────
// MIGRATION FUNCTIONS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Convert price string to number
 * "₹1,200" -> 1200
 */
const parsePrice = (priceStr) => {
    if (!priceStr) return 0;
    if (typeof priceStr === 'number') return priceStr;
    const cleaned = String(priceStr).replace(/[^0-9.]/g, '');
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? 0 : parsed;
};

/**
 * Migrate gemstones to unified product collection
 */
const migrateGemstones = async () => {
    console.log('\n🔮 Migrating Gemstones...');
    
    try {
        const gemstones = await Gemstone.find({});
        console.log(`Found ${gemstones.length} gemstones to migrate`);
        
        let migrated = 0;
        let errors = 0;
        
        for (const gemstone of gemstones) {
            try {
                // Check if already migrated
                const existing = await Product.findOne({ 
                    name: gemstone.name, 
                    category: 'gemstones' 
                });
                
                if (existing) {
                    console.log(`⚠️  Gemstone "${gemstone.name}" already exists, skipping...`);
                    continue;
                }
                
                const productData = {
                    // Basic info
                    name: gemstone.name,
                    shortDescription: gemstone.shortDescription,
                    meaning: gemstone.meaning,
                    category: 'gemstones',
                    
                    // Gemstone-specific fields
                    color: gemstone.color,
                    colorClass: gemstone.colorClass,
                    glowClass: gemstone.glowClass,
                    zodiac: gemstone.zodiac,
                    rarity: gemstone.rarity,
                    hardness: gemstone.hardness,
                    chakra: gemstone.chakra,
                    
                    // Media
                    image: gemstone.image,
                    
                    // Content
                    benefits: gemstone.benefits || [],
                    whoShouldWear: gemstone.whoShouldWear || [],
                    careInstructions: gemstone.careInstructions || [],
                    
                    // Pricing - Convert string to number
                    price: parsePrice(gemstone.priceNum || gemstone.price),
                    priceDisplay: gemstone.price,
                    
                    // Inventory
                    stock: gemstone.stock || 0,
                    lowStockThreshold: gemstone.lowStockThreshold || 5,
                    trackQuantity: true,
                    
                    // Status
                    status: gemstone.status || 'active',
                    
                    // Variants - migrate existing variants
                    variants: (gemstone.variants || []).map(variant => ({
                        label: variant.label,
                        size: variant.size,
                        color: variant.color,
                        beadCount: variant.beadCount,
                        stock: variant.stock || 0,
                        price: variant.priceNum || variant.price,
                        sku: variant.sku,
                        isActive: true
                    })),
                    
                    // Analytics
                    soldCount: gemstone.soldCount || 0,
                    viewCount: 0,
                    rating: 0,
                    reviewCount: 0,
                    
                    // External
                    buyLink: gemstone.buyLink,
                    
                    // Marketing
                    featured: false,
                    
                    // Timestamps
                    createdAt: gemstone.createdAt,
                    updatedAt: gemstone.updatedAt
                };
                
                const product = new Product(productData);
                await product.save();
                migrated++;
                
                console.log(`✅ Migrated gemstone: ${gemstone.name}`);
                
            } catch (error) {
                console.error(`❌ Error migrating gemstone "${gemstone.name}":`, error.message);
                errors++;
            }
        }
        
        console.log(`\n🔮 Gemstones Migration Complete:`);
        console.log(`   ✅ Migrated: ${migrated}`);
        console.log(`   ❌ Errors: ${errors}`);
        
    } catch (error) {
        console.error('❌ Error in gemstone migration:', error);
    }
};

/**
 * Migrate trees to unified product collection
 */
const migrateTrees = async () => {
    console.log('\n🌳 Migrating Trees...');
    
    try {
        const trees = await Tree.find({});
        console.log(`Found ${trees.length} trees to migrate`);
        
        let migrated = 0;
        let errors = 0;
        
        for (const tree of trees) {
            try {
                // Check if already migrated
                const existing = await Product.findOne({ 
                    name: tree.name, 
                    category: 'trees' 
                });
                
                if (existing) {
                    console.log(`⚠️  Tree "${tree.name}" already exists, skipping...`);
                    continue;
                }
                
                const productData = {
                    // Basic info
                    name: tree.name,
                    shortDescription: tree.shortDescription,
                    meaning: tree.meaning,
                    category: 'trees',
                    
                    // Tree-specific fields
                    numerology: tree.numerology,
                    
                    // Media
                    image: tree.image,
                    
                    // Content
                    benefits: tree.benefits || [],
                    whoShouldWear: tree.whoShouldWear || [],
                    careInstructions: tree.careInstructions || [],
                    
                    // Pricing - Convert string to number
                    price: parsePrice(tree.priceNum || tree.price),
                    priceDisplay: tree.price,
                    
                    // Inventory
                    stock: tree.stock || 0,
                    lowStockThreshold: tree.lowStockThreshold || 5,
                    trackQuantity: true,
                    
                    // Status
                    status: tree.status || 'active',
                    
                    // Variants - migrate existing variants
                    variants: (tree.variants || []).map(variant => ({
                        label: variant.label,
                        size: variant.size,
                        color: variant.color,
                        beadCount: variant.beadCount,
                        stock: variant.stock || 0,
                        price: variant.priceNum || variant.price,
                        sku: variant.sku,
                        isActive: true
                    })),
                    
                    // Analytics
                    soldCount: tree.soldCount || 0,
                    viewCount: 0,
                    rating: 0,
                    reviewCount: 0,
                    
                    // External
                    buyLink: tree.buyLink,
                    
                    // Marketing
                    featured: false,
                    
                    // Timestamps
                    createdAt: tree.createdAt,
                    updatedAt: tree.updatedAt
                };
                
                const product = new Product(productData);
                await product.save();
                migrated++;
                
                console.log(`✅ Migrated tree: ${tree.name}`);
                
            } catch (error) {
                console.error(`❌ Error migrating tree "${tree.name}":`, error.message);
                errors++;
            }
        }
        
        console.log(`\n🌳 Trees Migration Complete:`);
        console.log(`   ✅ Migrated: ${migrated}`);
        console.log(`   ❌ Errors: ${errors}`);
        
    } catch (error) {
        console.error('❌ Error in tree migration:', error);
    }
};

/**
 * Migrate bracelets to unified product collection
 */
const migrateBracelets = async () => {
    console.log('\n📿 Migrating Bracelets...');
    
    try {
        const bracelets = await Bracelet.find({});
        console.log(`Found ${bracelets.length} bracelets to migrate`);
        
        let migrated = 0;
        let errors = 0;
        
        for (const bracelet of bracelets) {
            try {
                // Check if already migrated
                const existing = await Product.findOne({ 
                    name: bracelet.name, 
                    category: 'bracelets' 
                });
                
                if (existing) {
                    console.log(`⚠️  Bracelet "${bracelet.name}" already exists, skipping...`);
                    continue;
                }
                
                const productData = {
                    // Basic info
                    name: bracelet.name,
                    shortDescription: bracelet.shortDescription,
                    meaning: bracelet.meaning,
                    category: 'bracelets',
                    
                    // Bracelet-specific fields
                    numerology: bracelet.numerology,
                    
                    // Media
                    image: bracelet.image,
                    
                    // Content
                    benefits: bracelet.benefits || [],
                    whoShouldWear: bracelet.whoShouldWear || [],
                    careInstructions: bracelet.careInstructions || [],
                    
                    // Pricing - Convert string to number
                    price: parsePrice(bracelet.priceNum || bracelet.price),
                    priceDisplay: bracelet.price,
                    
                    // Inventory
                    stock: bracelet.stock || 0,
                    lowStockThreshold: bracelet.lowStockThreshold || 5,
                    trackQuantity: true,
                    
                    // Status
                    status: bracelet.status || 'active',
                    
                    // Variants - migrate existing variants
                    variants: (bracelet.variants || []).map(variant => ({
                        label: variant.label,
                        size: variant.size,
                        color: variant.color,
                        beadCount: variant.beadCount,
                        stock: variant.stock || 0,
                        price: variant.priceNum || variant.price,
                        sku: variant.sku,
                        isActive: true
                    })),
                    
                    // Analytics
                    soldCount: bracelet.soldCount || 0,
                    viewCount: 0,
                    rating: 0,
                    reviewCount: 0,
                    
                    // External
                    buyLink: bracelet.buyLink,
                    
                    // Marketing
                    featured: false,
                    
                    // Timestamps
                    createdAt: bracelet.createdAt,
                    updatedAt: bracelet.updatedAt
                };
                
                const product = new Product(productData);
                await product.save();
                migrated++;
                
                console.log(`✅ Migrated bracelet: ${bracelet.name}`);
                
            } catch (error) {
                console.error(`❌ Error migrating bracelet "${bracelet.name}":`, error.message);
                errors++;
            }
        }
        
        console.log(`\n📿 Bracelets Migration Complete:`);
        console.log(`   ✅ Migrated: ${migrated}`);
        console.log(`   ❌ Errors: ${errors}`);
        
    } catch (error) {
        console.error('❌ Error in bracelet migration:', error);
    }
};

/**
 * Verify migration results
 */
const verifyMigration = async () => {
    console.log('\n🔍 Verifying Migration...');
    
    try {
        const productCounts = await Product.aggregate([
            { $group: { _id: '$category', count: { $sum: 1 } } }
        ]);
        
        console.log('\n📊 Product counts by category:');
        productCounts.forEach(({ _id, count }) => {
            console.log(`   ${_id}: ${count} products`);
        });
        
        const totalProducts = await Product.countDocuments();
        console.log(`\n📦 Total products in unified collection: ${totalProducts}`);
        
        // Check for price conversion issues
        const priceIssues = await Product.find({ 
            $or: [
                { price: { $type: 'string' } },
                { price: 0 },
                { price: null }
            ]
        });
        
        if (priceIssues.length > 0) {
            console.log(`\n⚠️  Found ${priceIssues.length} products with price issues:`);
            priceIssues.forEach(product => {
                console.log(`   - ${product.name}: price = ${product.price} (${typeof product.price})`);
            });
        } else {
            console.log('\n✅ All products have valid numeric prices');
        }
        
        // Check stock status consistency
        const stockIssues = await Product.find({
            $expr: {
                $ne: ['$isInStock', { $gt: ['$totalStock', 0] }]
            }
        });
        
        if (stockIssues.length > 0) {
            console.log(`\n⚠️  Found ${stockIssues.length} products with stock status issues`);
        } else {
            console.log('✅ All products have consistent stock status');
        }
        
    } catch (error) {
        console.error('❌ Error in verification:', error);
    }
};

/**
 * Create backup of original collections
 */
const createBackup = async () => {
    console.log('\n💾 Creating backup collections...');
    
    try {
        // Create backup collections with timestamp
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        
        const db = mongoose.connection.db;
        
        // Backup gemstones
        await db.collection('gemstones').aggregate([
            { $out: `gemstones_backup_${timestamp}` }
        ]).toArray();
        
        // Backup trees
        await db.collection('trees').aggregate([
            { $out: `trees_backup_${timestamp}` }
        ]).toArray();
        
        // Backup bracelets
        await db.collection('bracelets').aggregate([
            { $out: `bracelets_backup_${timestamp}` }
        ]).toArray();
        
        console.log(`✅ Backup collections created with timestamp: ${timestamp}`);
        
    } catch (error) {
        console.error('❌ Error creating backup:', error);
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// MAIN MIGRATION FUNCTION
// ─────────────────────────────────────────────────────────────────────────────

const runMigration = async () => {
    console.log('🚀 Starting Product Collection Migration...');
    console.log('==========================================');
    
    try {
        await connectDB();
        
        // Create backup first
        await createBackup();
        
        // Run migrations
        await migrateGemstones();
        await migrateTrees();
        await migrateBracelets();
        
        // Verify results
        await verifyMigration();
        
        console.log('\n🎉 Migration completed successfully!');
        console.log('\n📋 Next steps:');
        console.log('   1. Update your controllers to use the unified Product model');
        console.log('   2. Update your frontend to use the new API endpoints');
        console.log('   3. Test the application thoroughly');
        console.log('   4. Once confirmed working, you can drop the old collections');
        
    } catch (error) {
        console.error('❌ Migration failed:', error);
    } finally {
        await mongoose.connection.close();
        console.log('\n🔌 Database connection closed');
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// CLI INTERFACE
// ─────────────────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const command = args[0];

if (command === 'verify-only') {
    // Just run verification
    connectDB().then(verifyMigration).then(() => mongoose.connection.close());
} else if (command === 'backup-only') {
    // Just create backup
    connectDB().then(createBackup).then(() => mongoose.connection.close());
} else {
    // Run full migration
    runMigration();
}

// Handle process termination
process.on('SIGINT', async () => {
    console.log('\n⚠️  Migration interrupted by user');
    await mongoose.connection.close();
    process.exit(0);
});

process.on('unhandledRejection', async (err) => {
    console.error('❌ Unhandled Promise Rejection:', err);
    await mongoose.connection.close();
    process.exit(1);
});