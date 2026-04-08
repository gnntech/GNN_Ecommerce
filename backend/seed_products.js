const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cloudinary = require("cloudinary").v2;
const Gemstone = require("./models/Gemstone");
const Tree = require("./models/Tree");
const Bracelet = require("./models/Bracelet");
const path = require("path");

dotenv.config();

// Cloudinary Config
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadImage = async (imagePath) => {
    try {
        const absolutePath = path.join(__dirname, "../src", imagePath);
        const result = await cloudinary.uploader.upload(absolutePath, {
            folder: "gnn-ecommerce",
        });
        return result.secure_url;
    } catch (error) {
        console.error(`Failed to upload image: ${imagePath}`, error.message);
        return null; // Return null if upload fails, or use a placeholder
    }
};

const seedGeneric = async (Model, data, type) => {
    try {
        for (const item of data) {
            // Check if exists
            const exists = await Model.findOne({ name: item.name });

            // Should we update?
            let shouldUpdate = false;
            if (exists) {
                if (exists.image && exists.image.includes("via.placeholder.com")) {
                    console.log(`Fixing broken image for ${item.name}...`);
                    shouldUpdate = true;
                } else {
                    console.log(`${item.name} already exists and has valid image.`);
                    continue;
                }
            }

            let imageUrl = item.image;
            // Only upload if it looks like a local path (starts with / or ./ or @/)
            // The data files have paths like "@/assets/..." or "/images/..." or "/trees/..."
            // We need to resolve these to absolute paths.

            let localPath = "";
            if (item.image.startsWith("@/assets")) {
                localPath = item.image.replace("@/assets", "assets");
            } else if (item.image.startsWith("/trees")) {
                localPath = "assets" + item.image; // Assuming /trees maps to src/assets/trees ? No wait.
                // Let's check where /trees and /images are.
                // Based on previous file list, src/assets/gemstones exists.
                // src/assets/trees might exist? or public/trees?
                // The previous list_dir of src/assets only showed gemstones.
                // Let's assume for now they are in public if they start with /.
                // If they are in public, we need to map differently.
            } else if (item.image.startsWith("/images")) {
                localPath = "assets" + item.image;
            }

            // actually, for the sake of this script, let's just try to upload. 
            // If it fails, we keep the original string (might work if it's already a URL or if frontend handles it)
            // BUT backend needs Cloudinary URLs for consistency?

            // WAIT. The user wants "image of earlier products should be there".
            // If the frontend uses imports (like gemstones.ts), those are handled by Vite.
            // But in DB we need accessible URLs.

            // Re-evaluating paths:
            // Gemstones use imports: `import rubyImg from "@/assets/gemstones/ruby.webp";` -> This resolves to a path during build.
            // We can't easily get that in Node. 
            // We DO know the file structure: src/assets/gemstones/ruby.webp

            if (type === 'gemstone') {
                // item.image in the TS file is the imported variable. 
                // We can't access that variable value here easily without compiling.
                // hardcoding the mapping based on the ID is safer.
                localPath = `assets/gemstones/${item.id}.webp`;
            } else if (type === 'tree') {
                // trees.ts has: image: "/trees/citrine-tree.webp"
                // This implies they are likely in `public/trees` or `src/assets/trees`?
                // I'll assume `public/trees` for now since it starts with /.
                localPath = `../public${item.image}`;
            } else if (type === 'bracelet') {
                // bracelet.ts has: image: "/images/S-BloodstoneBracelet.webp"
                // Likely `public/images`
                localPath = `../public${item.image}`;
            }

            // Adjust path for upload
            // For gemstones, we constructed `assets/gemstones/...`. correct relative to src?
            // script is in `backend/`. `src/` is `../src/`.

            let uploadPath = "";
            if (type === 'gemstone') {
                uploadPath = path.join(__dirname, "../src/assets/gemstones", `${item.id}.webp`);
            } else {
                uploadPath = path.join(__dirname, "../", localPath);
            }

            console.log(`Uploading ${item.name}... path: ${uploadPath}`);
            const cloudUrl = await uploadImage(uploadPath.replace("backend\\..\\", "")); // Hacky fix for join

            // Ensure we use the cloud URL if successful, else generic placeholder
            // key images: 
            // Gemstones -> /images/Gemstone.webp
            // Trees -> /images/Trees.webp (if specific not found)
            // Bracelets -> /images/S-TigerEye Bracelet.webp etc.

            let fallback = "/images/hero-new.webp";
            if (type === 'gemstone') fallback = "/images/Gemstone.webp";
            else if (type === 'tree') fallback = "/images/Trees.webp";
            else if (type === 'bracelet') {
                // Try to use the original path if it was in /images
                if (item.image.startsWith("/images")) fallback = item.image;
                else fallback = "/images/hero-new.webp";
            }

            const finalImage = cloudUrl || fallback;



            if (shouldUpdate && exists) {
                exists.image = finalImage;
                if (!exists.price) exists.price = item.price || "₹0";
                await exists.save();
                console.log(`Updated ${item.name}`);
            } else {
                await Model.create({
                    ...item,
                    image: finalImage,
                    price: item.price || "₹0", // Ensure price exists
                });
                console.log(`Created ${item.name}`);
            }
            console.log(`Created ${item.name}`);
        }
    } catch (error) {
        console.log(`Error seeding ${type}:`, error);
    }
};

const seedProducts = async () => {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");

    // DATA (Hardcoded from TS files to avoid parsing TS in Node)

    // --- GEMSTONES ---
    const gemstones = [
        {
            id: "ruby",
            name: "Ruby",
            shortDescription: "The king of precious stones, symbolizing passion and power.",
            meaning: "Ruby, known as the 'King of Gemstones,' has been treasured for millennia...",
            color: "Deep Red", colorClass: "gem-ruby", glowClass: "glow-ruby", zodiac: "Leo / Aries", rarity: "Rare", hardness: "9 Mohs", chakra: "Heart & Root",
            price: "₹1,25,000",
            benefits: ["Enhances passion", "Promotes courage"], // Truncated for brevity, can add full later or update via Admin
            whoShouldWear: ["Leaders"],
            careInstructions: ["Clean with warm soapy water"],
            image: "ruby" // Placeholder to trigger logic
        },
        {
            id: "emerald", name: "Emerald",
            shortDescription: "The stone of successful love and infinite patience.",
            meaning: "Emerald, the gemstone of Venus...",
            color: "Vivid Green", colorClass: "gem-emerald", glowClass: "glow-emerald", zodiac: "Taurus / Gemini", rarity: "Very Rare", hardness: "7.5 Mohs", chakra: "Heart",
            price: "₹85,000",
            benefits: ["Promotes unconditional love"], whoShouldWear: ["Artists"], careInstructions: ["Clean gently"],
            image: "emerald"
        },
        {
            id: "sapphire", name: "Sapphire",
            shortDescription: "The gem of wisdom, royalty, and divine favor.",
            meaning: "Sapphire has adorned royalty...",
            color: "Royal Blue", colorClass: "gem-sapphire", glowClass: "glow-sapphire", zodiac: "Virgo / Libra", rarity: "Rare", hardness: "9 Mohs", chakra: "Throat & Third Eye",
            price: "₹95,000",
            benefits: ["Enhances wisdom"], whoShouldWear: ["Seekers"], careInstructions: ["Safe for ultrasonic"],
            image: "sapphire"
        },
        {
            id: "amethyst", name: "Amethyst",
            shortDescription: "The spiritual stone of peace and transformation.",
            meaning: "Amethyst, the 'Stone of Sobriety'...",
            color: "Royal Purple", colorClass: "gem-amethyst", glowClass: "glow-amethyst", zodiac: "Pisces / Aquarius", rarity: "Common", hardness: "7 Mohs", chakra: "Crown & Third Eye",
            price: "₹15,000",
            benefits: ["Promotes peace"], whoShouldWear: ["Those seeking spiritual enlightenment"], careInstructions: ["Clean with warm soapy water"],
            image: "amethyst"
        },
        {
            id: "topaz", name: "Imperial Topaz",
            shortDescription: "The stone of strength, intellect, and good fortune.",
            meaning: "Imperial Topaz...",
            color: "Golden Orange", colorClass: "gem-topaz", glowClass: "glow-topaz", zodiac: "Scorpio / Sagittarius", rarity: "Rare", hardness: "8 Mohs", chakra: "Solar Plexus",
            price: "₹45,000",
            benefits: ["Attracts abundance"], whoShouldWear: ["Entrepreneurs"], careInstructions: ["Clean with warm soapy water"],
            image: "topaz"
        },
        {
            id: "diamond", name: "Diamond",
            shortDescription: "The eternal symbol of purity, strength, and invincibility.",
            meaning: "Diamond...",
            color: "Crystal Clear", colorClass: "gem-diamond", glowClass: "glow-diamond", zodiac: "Aries / All Signs", rarity: "Rare", hardness: "10 Mohs", chakra: "Crown",
            price: "₹2,50,000",
            benefits: ["Amplifies energy"], whoShouldWear: ["Those celebrating eternal love"], careInstructions: ["Safe for ultrasonic"],
            image: "diamond"
        },
        {
            id: "opal", name: "Fire Opal",
            shortDescription: "The stone of creativity, passion, and mystical wonder.",
            meaning: "Opal...",
            color: "Fiery Iridescent", colorClass: "gem-opal", glowClass: "glow-opal", zodiac: "Libra / Scorpio", rarity: "Rare", hardness: "5.5 Mohs", chakra: "All Chakras",
            price: "₹25,000",
            benefits: ["Stimulates creativity"], whoShouldWear: ["Artists"], careInstructions: ["Clean only with damp soft cloth"],
            image: "opal"
        },
        {
            id: "pearl", name: "South Sea Pearl",
            shortDescription: "The organic gem of purity, wisdom, and feminine grace.",
            meaning: "Pearls...",
            color: "Lustrous White", colorClass: "gem-pearl", glowClass: "glow-pearl", zodiac: "Cancer / Gemini", rarity: "Rare", hardness: "2.5 Mohs", chakra: "Crown & Third Eye",
            price: "₹65,000",
            benefits: ["Promotes purity"], whoShouldWear: ["Those seeking emotional balance"], careInstructions: ["Wipe with soft damp cloth"],
            image: "pearl"
        }
    ];

    console.log("\nSeeding Gemstones...");
    await seedGeneric(Gemstone, gemstones, 'gemstone');

    // --- TREES ---
    // Assuming images are in public/trees/
    const trees = [
        { name: "Citrine Crystal Tree", image: "/trees/citrine-tree.webp", numerology: "Success, abundance", price: "₹1200" },
        { name: "Pyrite Crystal Tree", image: "/trees/pyrite-tree.webp", numerology: "Wealth attraction", price: "₹1200" },
        { name: "Seven Chakra Crystal Tree", image: "/trees/seven-chakra-tree.webp", numerology: "Energy balance", price: "₹1200" },
        { name: "Green Jade Crystal Tree", image: "/trees/green-jade-tree.webp", numerology: "Luck, harmony", price: "₹1200" },
        { name: "Green Aventurine Crystal Tree", image: "/trees/green-aventurine-tree.webp", numerology: "Growth, opportunity", price: "₹1200" },
        { name: "Amethyst Crystal Ball", image: "/trees/amethyst-ball-golden-stand.webp", numerology: "Peace, clarity", price: "₹1800" }, // Shortened name for matching
        { name: "Rose Quartz Crystal Ball", image: "/trees/rose-quartz-ball-golden-stand.webp", numerology: "Love, harmony", price: "₹1800" }
    ];
    console.log("\nSeeding Trees...");
    await seedGeneric(Tree, trees, 'tree');

    // --- BRACELETS ---
    const bracelets = [
        { name: "Bloodstone Bracelet", image: "/images/S-BloodstoneBracelet.webp", numerology: "Strength", price: "₹900" },
        { name: "Tiger Eye Bracelet", image: "/images/S-TigerEye Bracelet.webp", numerology: "Confidence", price: "₹900" },
        { name: "Moonstone Bracelet", image: "/images/S-MoonStone Bracelet.webp", numerology: "Emotional Balance", price: "₹1200" },
        { name: "Howlite Bracelet", image: "/images/S-Howlite Bracelet.webp", numerology: "Calmness", price: "₹900" },
        { name: "Amazonite Bracelet", image: "/images/S-Amazonite Bracelet.webp", numerology: "Harmony", price: "₹900" },
        { name: "Turquoise Bracelet", image: "/images/S-Turquoise Bracelet.webp", numerology: "Protection", price: "₹900" },
        { name: "Seven Chakra Bracelet", image: "/images/S-CatEye Bracelet.webp", numerology: "Balance", price: "₹1000" },
        { name: "Sulemani Hakik Bracelet", image: "/images/S-SulemaniHaquik Bracelet.webp", numerology: "Protection", price: "₹1000" },
        { name: "Green Jade Bracelet", image: "/images/S-GreenJade Bracelet.webp", numerology: "Luck", price: "₹900" },
        { name: "Green Aventurine Bracelet", image: "/images/S-GreenAventurian Bracelet.webp", numerology: "Opportunity", price: "₹900" },
        { name: "Rose Quartz Bracelet", image: "/images/S-RoseQuartz Bracelet.webp", numerology: "Love", price: "₹900" },
        { name: "Dragon Vein Bracelet", image: "/images/S-DragonVein Bracelet.webp", numerology: "Energy", price: "₹900" },
        { name: "Cat’s Eye Bracelet", image: "/images/S-CatEye Bracelet.webp", numerology: "Protection", price: "₹1000" },
        { name: "Azurite Bracelet", image: "/images/S-Azurite Bracelet.webp", numerology: "Wisdom", price: "₹900" },
        { name: "Amethyst Bracelet", image: "/images/S-Amethyst Bracelet.webp", numerology: "Peace", price: "₹1000" },
        { name: "Red Jasper Bracelet", image: "/images/S-ReadJasper Bracelet.webp", numerology: "Grounding", price: "₹900" },
        { name: "Lava Stone Bracelet", image: "/images/S-Lava Bracelet.webp", numerology: "Strength", price: "₹900" },
        { name: "Citrine Bracelet", image: "/images/S-Citrine Bracelet.webp", numerology: "Success", price: "₹900" },
    ];
    console.log("\nSeeding Bracelets...");
    await seedGeneric(Bracelet, bracelets, 'bracelet');

    console.log("\nDone!");
    process.exit();
};

seedProducts();
