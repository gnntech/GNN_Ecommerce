import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import api from "@/lib/api";
import GemstoneCard from "@/components/GemstoneCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Gemstone } from "@/types/collection";
import GemstoneGrid from "@/components/GemstoneGrid";

const Collection = () => {
  return (
    <div className="min-h-screen bg-luxury-cream-gradient font-sans">
      <Navbar />

      {/* Heading Band */}
      <section className="relative w-full h-[250px] bg-luxury-deep-wine flex flex-col items-center justify-center pt-20 px-4 overflow-hidden">
        <div className="relative text-center z-10">
          <h1 className="font-playfair text-5xl md:text-6xl text-luxury-gold tracking-wider drop-shadow-lg">
            Our Gemstones
          </h1>
          <div className="mt-6 w-24 h-[2px] bg-luxury-gold mx-auto opacity-80 shadow-[0_0_15px_#c6a75e]"></div>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-[#f8f5f2] to-transparent opacity-20 pointer-events-none"></div>
      </section>

      {/* GemstoneGrid handles fetch, pagination, sort, skeleton, and out-of-stock */}
      <GemstoneGrid />

      <Footer />
    </div>
  );
};

export default Collection;
