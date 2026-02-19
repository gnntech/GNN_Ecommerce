const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Slider = require("./models/Slider");
const Review = require("./models/Review");
const Collection = require("./models/Collection");
const SectionContent = require("./models/SectionContent");
const Gallery = require("./models/Gallery");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const seedData = async () => {
    try {
        // Clear existing data
        await Slider.deleteMany({});
        await Review.deleteMany({});
        await Collection.deleteMany({});
        await SectionContent.deleteMany({});
        await Gallery.deleteMany({});

        console.log("Cleared existing data.");

        // --- Slider ---
        const sliders = [
            {
                title: "Gaurab Nerpagar Numerologics",
                description: "Unlock the ancient wisdom of numerology to reveal your true potential, understand your destiny, and navigate life's journey with clarity and purpose.",
                image: "/images/slider-blue.png",
                order: 1
            },
            {
                title: "Sacred Spiritual Trees",
                description: "Invite harmony and positive energy into your space with our curated collection of spiritual trees, each bringing unique blessings to your home.",
                image: "/images/Trees.png",
                order: 2
            },
            {
                title: "Healing Crystal Bracelets",
                description: "Adorn yourself with the power of nature. Our handcrafted crystal bracelets are designed to balance your energy and enhance your well-being.",
                image: "/images/S-TigerEye Bracelet.png",
                order: 3
            }
        ];
        await Slider.insertMany(sliders);
        console.log("Seeded Sliders");

        // --- Reviews ---
        const reviews = [
            {
                name: "Celebrity 1",
                role: "Actor",
                image: "/images/slider-blue.png",
                videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=0",
                order: 1
            },
            {
                name: "Celebrity 2",
                role: "Singer",
                image: "/images/slider1.png",
                videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=0",
                order: 2
            },
            {
                name: "Rakesh Maini",
                role: "Indian Idol Season - 5",
                image: "/images/slider3.png",
                videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=0",
                order: 3
            },
            {
                name: "Celebrity 4",
                role: "Influencer",
                image: "/images/slider2.png",
                videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=0",
                order: 4
            }
        ];
        await Review.insertMany(reviews);
        console.log("Seeded Reviews");

        // --- Collections ---
        const collections = [
            {
                title: "Gemstones",
                description: "Explore our hand-selected gemstones with unique energy.",
                image: "/images/Gemstone.png",
                link: "/collection",
                order: 1
            },
            {
                title: "Bracelets",
                description: "Find bracelets with numerology and spiritual significance.",
                image: "/images/S-TigerEye Bracelet.png",
                link: "/bracelets",
                order: 2
            },
            {
                title: "Trees",
                description: "Discover mystical trees that bring energy and harmony.",
                image: "/images/Trees.png",
                link: "/trees",
                order: 3
            }
        ];
        await Collection.insertMany(collections);
        console.log("Seeded Collections");

        // --- Gallery ---
        const galleryItems = [
            { title: "Premium Gemstones", image: "/images/Gemstone.png", link: "/collection", order: 1 },
            { title: "Spiritual Trees", image: "/images/Trees.png", link: "/trees", order: 2 },
            { title: "Healing Bracelets", image: "/images/S-TigerEye Bracelet.png", link: "/bracelets", order: 3 },
            { title: "Vedic Wisdom", image: "/images/section2-bg.png", link: "/about", order: 4 },
            { title: "Numerology", image: "/images/slider-blue.png", link: "/contact", order: 5 },
            { title: "Astrology", image: "/images/slider1.png", link: "/contact", order: 6 }
        ];
        await Gallery.insertMany(galleryItems);
        console.log("Seeded Gallery");

        // --- Section Content ---
        const sections = [
            {
                sectionName: "craftsmanship",
                title: "The Art of Perfect Craftsmanship",
                subtitle: "By World-Class Jewellers",
                description: "Every gemstone is brought to life through passion, precision, and timeless craftsmanship—made to reflect your unique story.",
                videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=0&mute=1&controls=1&loop=1",
                ctaText: "Discover More",
                ctaLink: "#"
            },
            {
                sectionName: "marquee",
                title: "Marquee Content",
                description: JSON.stringify([
                    "Book your consultation @ Rs. 499",
                    "Slots are limited",
                    "Reserve yours now !!"
                ])
            }
        ];
        await SectionContent.insertMany(sections);
        console.log("Seeded Sections");

        console.log("Data seeding completed successfully!");
        process.exit();
    } catch (error) {
        console.error("Error seeding data:", error);
        process.exit(1);
    }
};

seedData();
