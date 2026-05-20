/**
 * Run once to seed default navbar categories:
 *   node backend/seed_categories.js
 */
require("dotenv").config();
const mongoose = require("mongoose");
const Category = require("./models/Category");

const defaults = [
    { name: "Gemstones", slug: "/collection", icon: "Gem",      sortOrder: 1 },
    { name: "Bracelets", slug: "/bracelets",  icon: "Sparkles", sortOrder: 2 },
    { name: "Trees",     slug: "/trees",      icon: "TreePalm", sortOrder: 3 },
];

(async () => {
    await mongoose.connect(process.env.MONGO_URI);
    for (const cat of defaults) {
        await Category.findOneAndUpdate(
            { slug: cat.slug },
            { $setOnInsert: cat },
            { upsert: true, new: true }
        );
        console.log(`✅ ${cat.name} seeded`);
    }
    await mongoose.disconnect();
    console.log("Done.");
})();
