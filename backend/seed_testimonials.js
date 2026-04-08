const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Review = require("./models/Review");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const seedTestimonials = async () => {
    try {
        // Clear existing reviews
        await Review.deleteMany({});
        console.log("Cleared existing reviews.");

        const testimonials = [
            // Text Testimonials
            {
                name: "Tejas Nimbalkar",
                role: "Client",
                image: "/images/slider1.webp",
                videoUrl: "https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sChdDSUhNMG9nS0VKWGY0SkthekkzRXVBRRAB!2m1!1s0x0:0x57a845f5cd997d50!3m1!1s2@1:CIHM0ogKEJXf4JKazI3EuAE%7C%7C?hl=en-GB",
                quote: "Amazing experience! The numerology report was super accurate and insightful. The crystals were beautiful and full of positive vibes. Highly recommended for genuine guidance!",
                location: "Client",
                isVideoTestimonial: false,
                order: 1
            },
            {
                name: "Sayli Bhadkamkar",
                role: "Client",
                image: "/images/slider2.webp",
                videoUrl: "https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sChdDSUhNMG9nS0VNajg4b2ZiMXNQNHJRRRAB!2m1!1s0x0:0x57a845f5cd997d50!3m1!1s2@1:CIHM0ogKEMj88ofb1sP4rQE%7C%7C?hl=en-GB",
                quote: "Life-changing consultation! Within 15 days of name correction, I got married. The crystal healing guidance also improved my health rapidly. Highly professional and transformative!",
                location: "Client",
                isVideoTestimonial: false,
                order: 2
            },
            {
                name: "Mrunmayi Datar",
                role: "Client",
                image: "/images/slider3.webp",
                videoUrl: "https://www.google.com/maps/reviews/@20.4717714,75.0188263,892m/data=!3m2!1e3!4b1!4m6!14m5!1m4!2m3!1sChdDSUhNMG9nS0VJQ0FnTUNZZ29yNjF3RRAB!2m1!1s0x0:0x57a845f5cd997d50!5m1!1e1?hl=en-GB",
                quote: "Incredibly accurate and insightful reading! Gaurab sir explained everything clearly and helped me understand patterns in my life. I felt seen, guided, and more confident about my future.",
                location: "Client",
                isVideoTestimonial: false,
                order: 3
            },
            {
                name: "Amol Hulle",
                role: "Client",
                image: "/images/slider4.webp",
                videoUrl: "https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sCi9DQUlRQUNvZENodHljRjlvT2pKMVlYbGFObXc1U0UxRmIwVkVXbEpQUXpGb05VRRAB!2m1!1s0x0:0x57a845f5cd997d50!3m1!1s2@1:CAIQACodChtycF9oOjJ1YXlaNmw5SE1Fb0VEWlJPQzFoNUE%7C%7C?hl=en-GB",
                quote: "One of the best counselling sessions in my life! The numerology report was shocking - so many things were true. Life changing moment after counselling. Thank you so much sir!",
                location: "Client",
                isVideoTestimonial: false,
                order: 4
            },
            {
                name: "Atharva Pachpute",
                role: "Client",
                image: "/images/slider-blue.webp",
                videoUrl: "https://www.google.com/maps/reviews/data=!4m8!14m7!1m6!2m5!1sChdDSUhNMG9nS0VJQ0FnTUNvX2R5ODN3RRAB!2m1!1s0x0:0x57a845f5cd997d50!3m1!1s2@1:CIHM0ogKEICAgMCo_dy83wE%7C%7C?hl=en-GB",
                quote: "Incredible experience! The insights were accurate and deeply enlightening. Personalized session with practical advice. I walked away feeling more confident, clear-headed, and aligned with my purpose.",
                location: "Client",
                isVideoTestimonial: false,
                order: 5
            },
            {
                name: "Tejas Nimbalkar",
                role: "Client",
                image: "/images/slider1.webp",
                videoUrl: "/images/NewHeroVid.mp4",
                quote: "Amazing experience! The numerology report was super accurate and insightful.",
                location: "Client",
                isVideoTestimonial: true,
                order: 6
            },
            {
                name: "Sayli Bhadkamkar",
                role: "Client",
                image: "/images/slider2.webp",
                videoUrl: "/images/NewHeroVid.mp4",
                quote: "Life-changing consultation! Within 15 days of name correction, I got married.",
                location: "Client",
                isVideoTestimonial: true,
                order: 7
            },
            {
                name: "Mrunmayi Datar",
                role: "Client",
                image: "/images/slider3.webp",
                videoUrl: "/images/NewHeroVid.mp4",
                quote: "Incredibly accurate and insightful reading! Gaurab sir explained everything clearly.",
                location: "Client",
                isVideoTestimonial: true,
                order: 8
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
