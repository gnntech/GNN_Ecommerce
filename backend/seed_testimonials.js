const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Review = require("./models/Review");
const connectDB = require("./config/db");

dotenv.config({ path: './backend/.env' });
connectDB();

const seedTestimonials = async () => {
    try {
        // Clear existing reviews
        await Review.deleteMany({});
        console.log("Cleared existing reviews.");

        const testimonials = [
            // Video Testimonials
            {
                name: "Rakesh Maini",
                role: "Indian Idol Season - 5",
                image: "/images/slider3.png",
                videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
                quote: "The numerology guidance I received was life-changing. It gave me a new perspective on my career and personal growth.",
                location: "Mumbai, India",
                isVideoTestimonial: true,
                order: 1
            },
            {
                name: "Ananya Sharma",
                role: "Entrepreneur",
                image: "/images/slider1.png",
                videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
                quote: "Finding my life path number helped me align my business strategies with my natural strengths. Highly recommended!",
                location: "Delhi, India",
                isVideoTestimonial: true,
                order: 2
            },
            // Text Testimonials
            {
                name: "Vikram Malhotra",
                role: "Software Engineer",
                image: "/images/slider-blue.png",
                videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Template URL
                quote: "I was skeptical at first, but the accuracy of my reading was mind-blowing. It helped me make a crucial decision at the right time.",
                location: "Bangalore, India",
                isVideoTestimonial: false,
                order: 3
            },
            {
                name: "Sneha Patel",
                role: "Yoga Instructor",
                image: "/images/slider2.png",
                videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
                quote: "The energy of the gemstones suggested for me has been incredible. I feel more balanced and focused than ever before.",
                location: "Ahmedabad, India",
                isVideoTestimonial: false,
                order: 4
            },
            {
                name: "Rahul Khanna",
                role: "Marketing Director",
                image: "/images/Gemstone.png",
                videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
                quote: "A professional and insightful experience. The guidance provided was practical and easy to implement in my daily life.",
                location: "Pune, India",
                isVideoTestimonial: false,
                order: 5
            }
        ];

        await Review.insertMany(testimonials);
        console.log("Seeded " + testimonials.length + " testimonials successfully!");
        process.exit();
    } catch (error) {
        console.error("Error seeding testimonials:", error);
        process.exit(1);
    }
};

seedTestimonials();
