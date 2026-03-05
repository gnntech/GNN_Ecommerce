import React, { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import api from "@/lib/api";

const HeroSlider = () => {
  const [slides, setSlides] = useState<any[]>([]);
  const [marqueeLines, setMarqueeLines] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Initialize Embla with Autoplay plugin
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    duration: 40,
    skipSnaps: false
  }, [
    Autoplay({ delay: 4000, stopOnInteraction: false })
  ]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  useEffect(() => {
    // Fetch Slider Data
    api.get('/content/slider')
      .then(res => setSlides(res.data))
      .catch(err => console.error("Failed to load slider data", err));

    // Fetch Marquee Data
    api.get('/content/sections/marquee')
      .then((res: any) => {
        const data = res.data;
        if (data && data.description) {
          try {
            setMarqueeLines(JSON.parse(data.description));
          } catch (e) {
            console.error("Failed to parse marquee data");
          }
        }
      })
      .catch((err: any) => console.error("Failed to load marquee data", err));
  }, []);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  if (slides.length === 0) return null;

  return (
    <div className="relative w-full bg-background mt-0 group overflow-hidden">
      {/* Background Image Layer (Cross-fading, not sliding) */}
      <div className="absolute inset-0 z-0">
        {slides.map((slide, index) => (
          <div
            key={`bg-${index}`}
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${index === selectedIndex ? "opacity-100" : "opacity-0"
              }`}
            style={{ backgroundImage: `url('${slide.image}')` }}
          >
            {/* Premium Faint Grey/Dark Overlay */}
            <div className="absolute inset-0 bg-black/40 backdrop-brightness-95" />
          </div>
        ))}
      </div>

      {/* Main Hero Container */}
      <div className="hero min-h-screen relative overflow-hidden z-10">
        {/* Embla Carousel Viewport (For Text Only) */}
        <div className="overflow-hidden h-full" ref={emblaRef}>
          <div className="flex h-full items-center">
            {slides.map((slide, index) => (
              <div key={`text-${index}`} className="relative flex-[0_0_100%] h-screen min-w-0 flex items-center">
                {/* Text Content */}
                <div className="hero-container w-full px-6 md:px-20 max-w-[1400px] mx-auto">
                  <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="max-w-[800px] space-y-6 text-center md:text-left"
                  >
                    <h1
                      className="font-bold tracking-tight leading-[1.1] text-white drop-shadow-lg"
                      style={{
                        fontFamily: "Poppins, sans-serif",
                        fontSize: "clamp(32px, 5vw, 72px)",
                      }}
                    >
                      {slide.title}
                    </h1>
                    <p
                      className="text-white/90 leading-relaxed font-light max-w-[600px] mx-auto md:mx-0 drop-shadow-md"
                      style={{
                        fontSize: "clamp(18px, 1.5vw, 24px)",
                        fontFamily: "Inter, sans-serif"
                      }}
                    >
                      {slide.description}
                    </p>

                    <div className="pt-4">
                      <button className="px-8 py-3 bg-white text-black font-bold rounded-full hover:bg-gray-100 transition-all transform hover:scale-105 shadow-xl">
                        Discover More
                      </button>
                    </div>
                  </motion.div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Premium Minimalist Navigation Buttons */}
        <button
          onClick={scrollPrev}
          className="absolute left-8 top-1/2 -translate-y-1/2 z-30 p-4 rounded-full border-2 border-white/30 text-white hover:bg-white hover:text-black hover:border-white transition-all duration-500 opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 group/btn"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-6 h-6 transform group-hover:-translate-x-1 transition-transform" />
        </button>

        <button
          onClick={scrollNext}
          className="absolute right-8 top-1/2 -translate-y-1/2 z-30 p-4 rounded-full border-2 border-white/30 text-white hover:bg-white hover:text-black hover:border-white transition-all duration-500 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 group/btn"
          aria-label="Next slide"
        >
          <ChevronRight className="w-6 h-6 transform group-hover:translate-x-1 transition-transform" />
        </button>

        {/* Improved Pagination Dots */}
        <div className="absolute bottom-32 left-1/2 -translate-x-1/2 z-30 flex gap-3">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => emblaApi?.scrollTo(index)}
              className={`h-1.5 transition-all duration-500 rounded-full ${index === selectedIndex ? "w-8 bg-white" : "w-2 bg-white/40"
                }`}
            />
          ))}
        </div>

        {/* Marquee - Absolute at bottom of hero section */}
        {marqueeLines.length > 0 && (
          <div
            className="absolute bottom-0 left-0 right-0 w-full overflow-hidden flex items-center z-20"
            style={{
              height: "80px",
              backgroundColor: "#9B2533", // Maroon
              boxShadow: "0px -10px 30px rgba(0,0,0,0.3)",
            }}
          >
            <div className="flex w-full whitespace-nowrap marquee-track">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="flex shrink-0 items-center justify-around min-w-full animate-marquee">
                  {marqueeLines.map((line, idx) => (
                    <React.Fragment key={idx}>
                      <span
                        className="flex items-center gap-4 text-white text-[16px] font-bold uppercase tracking-widest px-12"
                        style={{ fontFamily: "Inter, sans-serif" }}
                      >
                        {line}
                      </span>
                      <span className="text-white/50 font-black">/</span>
                    </React.Fragment>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <style>{`
        @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-100%); }
        }
        .animate-marquee {
            animation: marquee 40s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default HeroSlider;
