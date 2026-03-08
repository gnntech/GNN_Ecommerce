import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import TestimonialSection from '@/components/TestimonialSection';
import { motion } from 'framer-motion';

const Testimonials = () => {
    return (
        <div className="min-h-screen bg-[#FDFCF6]">
            <Navbar />

            {/* Header Section */}
            <section className="relative w-full h-[200px] bg-luxury-deep-wine flex flex-col items-center justify-center pt-20 px-4 overflow-hidden">
                <div className="relative text-center z-10">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="font-playfair text-4xl md:text-6xl text-luxury-gold tracking-wider drop-shadow-lg uppercase"
                    >
                        Customer Stories
                    </motion.h1>
                    <motion.div
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 0.8, width: "6rem" }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                        className="mt-6 h-[2px] bg-luxury-gold mx-auto shadow-[0_0_15px_#c6a75e]"
                    ></motion.div>

                </div>
                <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-[#FDFCF6] to-transparent opacity-20 pointer-events-none"></div>
            </section>

            {/* Main Content */}
            <div className="pt-0 pb-12">
                <TestimonialSection />
            </div>

            <Footer />
        </div>
    );
};

export default Testimonials;
