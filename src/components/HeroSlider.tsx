import React, { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const HeroSlider = () => {
  const [slides, setSlides] = useState<any[]>([]);
  const [marqueeLines, setMarqueeLines] = useState<string[]>([]);

  // Initialize Embla with Autoplay plugin
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, duration: 40 }, [
    Autoplay({ delay: 4000, stopOnInteraction: false })
  ]);

  useEffect(() => {
    // Fetch Slider Data
    fetch('http://localhost:5000/api/content/slider')
      .then(res => res.json())
      .then(data => setSlides(data))
      .catch(err => console.error("Failed to load slider data", err));

    // Fetch Marquee Data
    fetch('http://localhost:5000/api/content/sections/marquee')
      .then(res => res.json())
      .then(data => {
        if (data && data.description) {
          try {
            setMarqueeLines(JSON.parse(data.description));
          } catch (e) {
            console.error("Failed to parse marquee data");
          }
        }
      })
      .catch(err => console.error("Failed to load marquee data", err));
  }, []);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  if (slides.length === 0) return null;

  return (
    <div className="relative w-full bg-background mt-0 group">
      {/* Main Hero Container - 100vh constraint */}
      <div className="hero min-h-screen relative overflow-hidden">
        {/* Embla Carousel Viewport */}
        <div className="overflow-hidden h-full" ref={emblaRef}>
          <div className="flex h-full">
            {slides.map((slide, index) => (
              <div key={index} className="relative flex-[0_0_100%] h-screen min-w-0">
                {/* Background Image Layer */}
                <div
                  className="absolute inset-0 z-0 bg-cover bg-center transition-all duration-700"
                  style={{ backgroundImage: `url('${slide.image}')` }}
                />
                {/* Dark Overlay for better text readability */}
                <div className="absolute inset-0 bg-black/30 z-0" />

                {/* Text Content */}
                <div className="hero-container z-10 w-full pl-0 flex items-center h-full relative">
                  <div className="relative p-6 md:p-14 max-w-[900px] mx-auto md:mx-0">
                    <div className="relative z-10 space-y-4 text-center md:text-left">
                      <h1
                        className="font-bold tracking-tight leading-[1.1] text-white"
                        style={{
                          fontFamily: "Matter, sans-serif",
                          fontSize: "clamp(32px, 2.8vw, 50px)",
                        }}
                      >
                        {slide.title}
                      </h1>
                      <p
                        className="text-white/90 leading-relaxed font-light italic max-w-[600px] mx-auto md:mx-0"
                        style={{
                          fontSize: "clamp(18px, 1.5vw, 22px)",
                        }}
                      >
                        {slide.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Premium Navigation Buttons */}
        <button
          onClick={scrollPrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all duration-300 opacity-0 group-hover:opacity-100 -translate-x-10 group-hover:translate-x-0"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-8 h-8" />
        </button>

        <button
          onClick={scrollNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all duration-300 opacity-0 group-hover:opacity-100 translate-x-10 group-hover:translate-x-0"
          aria-label="Next slide"
        >
          <ChevronRight className="w-8 h-8" />
        </button>

        {/* Marquee - Absolute at bottom of hero section */}
        {marqueeLines.length > 0 && (
          <div
            className="absolute bottom-0 left-0 right-0 w-full overflow-hidden flex items-center z-20 group/marquee"
            style={{
              height: "100px",
              backgroundColor: "#9B2533", // Maroon
              boxShadow: "0px -9px 9.4px 0px #00000040",
            }}
          >
            {/* Infinite Scroll Container for Seamless Loop */}
            <div className="flex w-full whitespace-nowrap marquee-track group-hover/marquee:paused">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="flex shrink-0 items-center justify-around min-w-full animate-marquee">
                  {marqueeLines.map((line, idx) => (
                    <React.Fragment key={idx}>
                      <span
                        className="flex items-center gap-4 text-white text-[20px] font-normal uppercase tracking-wide px-8"
                        style={{ fontFamily: "Matter, sans-serif" }}
                      >
                        {line}
                      </span>
                      <span className="text-white">•</span>
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
            animation: marquee 30s linear infinite;
        }
        .group-hover\\/marquee:paused .animate-marquee {
            animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};

export default HeroSlider;
