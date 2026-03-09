import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BraceletGrid from "@/components/BraceletGrid";

const Bracelets = () => {
  return (
    <div className="min-h-screen bg-luxury-cream-gradient font-sans">
      <Navbar />

      {/* SECTION 1 — DEEP WINE LUXURY HEADING BAND */}
      <section className="relative w-full h-[250px] bg-luxury-deep-wine flex flex-col items-center justify-center pt-20 px-4 overflow-hidden">
        {/* Optional: Add a subtle overly for texture if possible, otherwise just the gradient */}
        <div className="relative text-center z-10">
          <h1 className="font-playfair text-5xl md:text-6xl text-luxury-gold tracking-wider drop-shadow-lg">
            Our Bracelets
          </h1>
          <div className="mt-6 w-24 h-[2px] bg-luxury-gold mx-auto opacity-80 shadow-[0_0_15px_#c6a75e]"></div>
        </div>

        {/* Subtle fade transition to the section below */}
        <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-[#f8f5f2] to-transparent opacity-20 pointer-events-none"></div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <BraceletGrid />
      </section>

      <Footer />
    </div>
  );
};

export default Bracelets;
