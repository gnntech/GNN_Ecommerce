import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import api from "@/lib/api";
import GemstoneCard from "@/components/GemstoneCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Gemstone } from "@/data/gemstones";

const Collection = () => {
  const [gemstones, setGemstones] = useState<Gemstone[]>([]);

  useEffect(() => {
    const fetchGemstones = async () => {
      try {
        const { data } = await api.get("/products/gemstones");
        setGemstones(data);
      } catch (error) {
        console.error("Failed to fetch gemstones", error);
      }
    };
    fetchGemstones();
  }, []);

  return (
    <div className="min-h-screen bg-luxury-cream-gradient font-sans">
      <Navbar />

      {/* SECTION 1 — DEEP WINE LUXURY HEADING BAND */}
      <section className="relative w-full h-[250px] bg-luxury-deep-wine flex flex-col items-center justify-center pt-20 px-4 overflow-hidden">
        <div className="relative text-center z-10">
          <h1 className="font-playfair text-5xl md:text-6xl text-luxury-gold tracking-wider drop-shadow-lg">
            Our Gemstones
          </h1>
          <div className="mt-6 w-24 h-[2px] bg-luxury-gold mx-auto opacity-80 shadow-[0_0_15px_#c6a75e]"></div>
        </div>

        {/* Subtle fade transition to the section below */}
        <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-[#f8f5f2] to-transparent opacity-20 pointer-events-none"></div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        {/* Gemstone Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {gemstones.map((gemstone, index) => (
            <GemstoneCard key={(gemstone as any)._id || gemstone.id} gemstone={gemstone} index={index} />
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Collection;
