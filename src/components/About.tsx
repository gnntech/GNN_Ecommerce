import React, { useState } from "react";
import Footer from "../components/Footer";
import Navbar from "./Navbar";
import { motion, AnimatePresence } from "framer-motion";

const About: React.FC = () => {
  const [openExpertise, setOpenExpertise] = useState<number | null>(0);

  const expertiseItems = [
    {
      title: "Numerology",
      desc: "Understanding life patterns through numbers.",
    },
    {
      title: "Wealth Astrology",
      desc: "Identify your money patterns and abundance.",
    },
    {
      title: "Life Guidance",
      desc: "Gain clarity and balance for daily decisions.",
    },
    {
      title: "Career Guidance",
      desc: "Align your professional work with purpose.",
    },
    {
      title: "Astrology",
      desc: "Insights into planetary timing and influence.",
    },
  ];

  return (
    <div className="flex flex-col overflow-x-hidden">
      <Navbar />
      {/* ================= HERO SECTION ================= */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative min-h-screen"
      >
        <div
          className="absolute inset-0 bg-[rgb(155,37,51)]"
          style={{ backgroundImage: "url(/images/About_bg.png)" }}
        />

        <div className="relative z-10 min-h-screen flex flex-col lg:grid lg:grid-cols-2 px-6 lg:px-12">
          {/* Desktop Image */}
          <div className="hidden lg:flex items-end justify-center">
            <img
              src="/images/GaurabNPP.png"
              alt="Gaurab Nerpagar"
              className="object-contain object-bottom"
              style={{
                height: "clamp(500px, 85vh, 90vh)",
                maxWidth: "clamp(400px, 45vw, 700px)",
              }}
            />
          </div>

          {/* Text Content */}
          <motion.div
            className="text-white max-w-xl mx-auto lg:mx-0 self-center pt-20 lg:pt-0 space-y-6"
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div>
              <h1 className="font-bebas text-[clamp(2.5rem,7vw,5.5rem)] leading-[0.9] tracking-tight">
                GAURAB NERPAGAR
              </h1>
              <p className="font-bebas text-[clamp(1.2rem,3vw,2.2rem)] text-white/90 mt-2">
                NUMEROLOGY GUIDE
              </p>
            </div>

            <p className="font-matter text-base lg:text-xl leading-relaxed">
              I’m a numerology practitioner dedicated to helping individuals
              find clarity, balance, and deeper understanding through the
              language of numbers.
            </p>
          </motion.div>

          {/* Mobile Image */}
          <div className="lg:hidden flex justify-center items-end mt-auto h-[50vh] sm:h-[60vh]">
            <img
              src="/images/GaurabNPP.png"
              alt="Gaurab Nerpagar"
              className="object-contain w-full max-w-[320px]"
            />
          </div>
        </div>
      </motion.section>

      {/* ================= SERVICES SECTION ================= */}
      <section className="min-h-screen flex items-center justify-center bg-white px-6 lg:px-12">
        <div className="max-w-6xl mx-auto text-center w-full mb-16">
          <div className="flex items-center justify-center gap-6 mb-12">
            <img
              src="/images/D.png"
              alt="left decor"
              className="w-32 sm:w-48 lg:w-72 h-auto"
            />

            <h2 className="text-6xl font-bebas text-[#9b2533] uppercase tracking-wide">
              Our Premium Services
            </h2>

            <img
              src="/images/D.png"
              alt="right decor"
              className="w-32 sm:w-48 lg:w-72 h-auto"
            />
          </div>

          <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: "/images/A-Icon1o.png",
                title: "Belief",
                desc: "I believe that numbers are more than calculations — they are subtle guides that reflect our inner patterns, strengths, and life cycles. When understood with awareness, they offer clarity rather than limitation.",
              },
              {
                icon: "/images/A-Icon2o.png",
                title: "Guidance",
                desc: "My approach is grounded, positive, and empowering. I focus on insight rather than prediction, helping clients feel supported instead of overwhelmed. My work is guided by balance, intention, and conscious awareness.",
              },
              {
                icon: "/images/A-Icon3o.png",
                title: "Approach",
                desc: "Each individual’s journey is unique. I take time to understand personal experiences, challenges, & goals to provide guidance that feels relevant, respectful, & aligned with one’s natural rhythm.",
              },
            ].map((card, index) => (
              <div
                key={index}
                className="relative rounded-2xl shadow-xl p-10 bg-[rgb(155,37,51)]/5 border border-[rgb(155,37,51)]/20 overflow-hidden 
transition-all duration-300 ease-in-out 
hover:-translate-y-2 hover:shadow-2xl hover:scale-[1.02]"
              >
                {/* Background PNG Layer */}
                <div className="absolute inset-0 z-0 pointer-events-none">
                  <img
                    src="/images/bg.png"
                    alt="card background"
                    className="w-full h-full object-cover opacity-20"
                  />
                </div>

                {/* Card Content */}
                <div className="relative z-10">
                  <img
                    src={card.icon}
                    alt={card.title}
                    className="w-16 h-16 mb-6 mx-auto"
                  />

                  <h3 className="font-bebas text-3xl text-[rgb(155,37,51)] mb-4">
                    {card.title.toUpperCase()}
                  </h3>

                  <p className="font-matter text-gray-700 leading-relaxed">
                    {card.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* OUR EXPERTISE SECTION (FINAL – MAROON + BG IMAGE + HOVER EFFECTS) */}
      <section className="relative min-h-screen w-full bg-[rgb(155,37,51)] px-4 sm:px-6 lg:px-12 z-20 overflow-hidden flex items-start lg:items-center">
        {/* Background PNG Layer */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <img
            src="/images/bg.png"
            alt="background texture"
            className="w-full h-full object-cover opacity-25"
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto w-full h-full flex flex-col justify-center">
          <div className="flex items-center justify-center gap-6 mb-8 lg:mb-12 translate-y-16 sm:translate-y-4">
            <img
              src="/images/Square.png"
              alt="left decor"
              className="w-16 sm:w-24 lg:w-36 h-auto opacity-70"
            />

            <h2 className="font-bebas text-4xl lg:text-6xl tracking-wider uppercase text-white">
              Our Expertise
            </h2>

            <img
              src="/images/Square.png"
              alt="right decor"
              className="w-16 sm:w-24 lg:w-36 h-auto opacity-70"
            />
          </div>

          <div className="w-full h-full grid lg:grid-cols-2 gap-12 items-end">
            {/* LEFT SIDE: ACCORDION */}
            <div className="text-white flex flex-col justify-start lg:justify-end pb-10 lg:pb-20 translate-y-20 sm:translate-y-6 lg:translate-y-16">
              <div className="space-y-6 max-w-xl mx-auto lg:mx-0 pb-8">
                {expertiseItems.map((item, index) => {
                  const isOpen = openExpertise === index;

                  return (
                    <div
                      key={index}
                      className="border-b border-white/30 pb-4 transition-all duration-300 hover:border-white hover:pl-2"
                    >
                      <button
                        onClick={() => setOpenExpertise(isOpen ? null : index)}
                        className="w-full flex justify-between items-center text-left group"
                      >
                        <span className="font-matter font-bold text-xl lg:text-2xl tracking-tight uppercase transition-all duration-300 group-hover:tracking-wide">
                          {item.title}
                        </span>

                        <span className="text-2xl font-light ">
                          {isOpen ? "−" : "+"}
                        </span>
                      </button>

                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.4 }}
                            className="overflow-hidden"
                          >
                            <p className="font-matter text-base mt-4 opacity-90 leading-relaxed">
                              {item.desc}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* RIGHT SIDE: FIXED BOTTOM IMAGE */}
            <div className="relative w-full flex justify-center mt-10 lg:mt-0">
              <img
                src="/images/expertise.png"
                alt="Expertise"
                className="sm:absolute w-[80%] sm:w-[100%] sm:bottom-[-220px] lg:bottom-0 object-contain sm:translate-y-16 transition-transform duration-500 "
              />
            </div>
          </div>
        </div>
      </section>
      {/* GALLERY – Desktop Sizes Restored, Mobile Optimized */}
      <section className="w-full bg-white py-2">
        <div className="w-full px-4 lg:px-12">
          <div className="flex items-center justify-center gap-6 mb-6">
            <img
              src="/images/FiveStars.png"
              alt="left decor"
              className="w-32 sm:w-48 lg:w-72 h-auto"
            />

            <h2 className="text-6xl font-bebas text-[#9b2533] uppercase tracking-wide">
              Gallery
            </h2>

            <img
              src="/images/FiveStars.png"
              alt="right decor"
              className="w-32 sm:w-48 lg:w-72 h-auto"
            />
          </div>

          <div className="flex flex-col lg:flex-row justify-start items-center lg:items-start gap-4 w-full">
            {/* Column 1: Images 1 & 4 */}
            <div className="flex flex-col gap-4 shrink-0 items-center">
              {/* Image 1 */}
              <div className="relative w-full max-w-[393px] h-[423px] rounded-2xl overflow-hidden shadow-lg border border-gray-100 group">
                <img
                  src="./images/image57.png"
                  className="w-full h-full object-cover"
                  alt="img1"
                />
                {/* BOTTOM TEXT OVERLAY */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-4 sm:p-4">
                  {/* Main Heading */}
                  <h3 className="font-bebas text-2xl sm:text-2xl text-white leading-[0.8] tracking-wide mb-0 pb-0">
                    MAIN TITLE
                  </h3>

                  {/* Subtext (The "Suntext") */}
                  <p className="font-matter font-thin text-sm sm:text-sm text-white  mt-0  uppercase opacity-90">
                    12 Jan,2026
                  </p>
                </div>
              </div>

              {/* Image 4 */}
              <div className="relative w-full max-w-[393px] h-[411px] rounded-2xl overflow-hidden shadow-lg border border-gray-100 group">
                <img
                  src="./images/image58.png"
                  className="w-full h-full object-cover"
                  alt="img4"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-4 sm:p-4">
                  {/* Main Heading */}
                  <h3 className="font-bebas text-2xl sm:text-2xl text-white leading-none tracking-wide">
                    MAIN TITLE
                  </h3>

                  {/* Subtext (The "Suntext") */}
                  <p className="font-matter font-thin text-sm sm:text-sm text-white mt-0 uppercase opacity-90">
                    13 Jan,2026
                  </p>
                </div>
              </div>
            </div>

            {/* Column 2: Images 2 & 5 */}
            <div className="flex flex-col gap-4 shrink-0 items-center">
              {/* Image 2 (Hidden on mobile) */}
              <div className="relative hidden lg:block w-[696px] h-[222px] rounded-2xl overflow-hidden shadow-lg border border-gray-100 group">
                <img
                  src="./images/image59.png"
                  className="w-full h-full object-cover"
                  alt="img2"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-4 sm:p-4">
                  {/* Main Heading */}
                  <h3 className="font-bebas text-2xl sm:text-2xl text-white leading-none tracking-wide">
                    MAIN TITLE
                  </h3>

                  {/* Subtext (The "Suntext") */}
                  <p className="font-matter font-thin text-sm sm:text-sm text-white mt-0 uppercase opacity-90">
                    14 Jan,2026
                  </p>
                </div>
              </div>

              {/* Image 5 */}
              <div className="relative w-full max-w-[393px] h-[423px] lg:max-w-none lg:w-[696px] lg:h-[602px] rounded-2xl overflow-hidden shadow-lg border border-gray-100 group">
                <img
                  src="./images/image60.png"
                  className="w-full h-full object-cover"
                  alt="img5"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-4">
                  <h3 className="font-bebas text-xl text-white leading-none tracking-wide">
                    MAIN TITLE
                  </h3>
                  <p className="font-matter font-thin text-xs text-white mt-0 uppercase opacity-90">
                    15 Jan,2026
                  </p>
                </div>
              </div>
            </div>

            {/* Column 3: Images 3 & 6 */}
            <div className="flex flex-col gap-4 shrink-0 items-center">
              {/* Image 3 */}
              <div className="relative w-full max-w-[393px] h-[423px] lg:max-w-none lg:w-[284px] lg:h-[222px] rounded-2xl overflow-hidden shadow-lg border border-gray-100 group">
                <img
                  src="./images/image62.png"
                  className="w-full h-full object-cover"
                  alt="img3"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-4 sm:p-4">
                  {/* Main Heading */}
                  <h3 className="font-bebas text-2xl sm:text-2xl text-white leading-none tracking-wide">
                    MAIN TITLE
                  </h3>

                  {/* Subtext (The "Suntext") */}
                  <p className="font-matter font-thin text-sm sm:text-sm text-white mt-0 uppercase opacity-90">
                    17 Jan,2026
                  </p>
                </div>
              </div>

              {/* Image 6 (Hidden on mobile) */}
              <div className="relative hidden lg:block w-[284px] h-[602px] rounded-2xl overflow-hidden shadow-lg border border-gray-100 group">
                <img
                  src="./images/image61.png"
                  className="w-full h-full object-cover"
                  alt="img6"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-4 sm:p-4">
                  {/* Main Heading */}
                  <h3 className="font-bebas text-2xl sm:text-2xl text-white leading-none tracking-wide">
                    MAIN TITLE
                  </h3>

                  {/* Subtext (The "Suntext") */}
                  <p className="font-matter font-thin text-sm sm:text-sm text-white mt-0 uppercase opacity-90">
                    18 Jan,2026
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* WHITE SPACER */}
      <div className="w-full h-16 bg-white"></div>

      <Footer />
    </div>
  );
};

export default About;
