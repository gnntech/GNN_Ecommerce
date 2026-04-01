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
        className="relative w-full overflow-hidden"
      >
        {/* Background Layer */}
        <div
          className="absolute inset-0 bg-[rgb(155,37,51)] bg-cover bg-center"
          style={{ backgroundImage: "url(/images/About_bg.png)" }}
        />

        {/* Content Wrapper */}
        <div
          className="relative z-10 min-h-[90vh] lg:min-h-screen 
                  flex flex-col lg:grid lg:grid-cols-2 
                  px-6 sm:px-8 lg:px-12"
        >
          {/* ================= DESKTOP IMAGE ================= */}
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

          {/* ================= TEXT CONTENT ================= */}
          <motion.div
            className="text-white 
                 max-w-xl 
                 mx-auto lg:mx-0 
                 flex flex-col justify-center
                 pt-24 sm:pt-28 lg:pt-0 
                 pb-12 lg:pb-0
                 text-center lg:text-left
                 space-y-6"
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div>
              <h1
                className="font-bebas font-bold
                       text-[clamp(2.2rem,8vw,5.5rem)] 
                       leading-[0.9] 
                       tracking-tight"
              >
                GAURAB NERPAGAR
              </h1>

              <p
                className="font-bebas 
                      text-[clamp(1rem,4vw,2.2rem)] 
                      text-white/90 
                      mt-4 tracking-wide"
              >
                NUMEROLOGY GUIDE
              </p>
            </div>

            <p
              className="font-matter 
                    text-sm sm:text-base lg:text-xl 
                    leading-relaxed 
                    text-white/95"
            >
              I’m a numerology practitioner dedicated to helping individuals
              find clarity, balance, and deeper understanding through the
              language of numbers.
            </p>
          </motion.div>

          {/* ================= MOBILE IMAGE ================= */}
          <div
            className="lg:hidden 
                    flex justify-center items-end 
                    mt-auto 
                    h-[45vh] sm:h-[55vh]"
          >
            <img
              src="/images/GaurabNPP.png"
              alt="Gaurab Nerpagar"
              className="object-contain w-full max-w-[280px] sm:max-w-[340px]"
            />
          </div>
        </div>
      </motion.section>

      {/* ================= SERVICES SECTION ================= */}
      <section className="w-full bg-white py-16 sm:py-20 lg:py-28 px-4 sm:px-6 lg:px-12">
        <div className="max-w-6xl mx-auto text-center">
          {/* ===== Heading with Side Decor ===== */}
          <div className="flex items-center justify-center gap-4 sm:gap-6 mb-12 lg:mb-16">
            {/* Left Decor */}
            <img
              src="/images/D.png"
              alt="left decor"
              className="w-16 sm:w-28 lg:w-56 h-auto object-contain"
            />

            {/* Title */}
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bebas font-bold text-[#9b2533] uppercase tracking-wide text-center leading-tight">
              Our Premium Services
            </h2>

            {/* Right Decor */}
            <img
              src="/images/D.png"
              alt="right decor"
              className="w-16 sm:w-28 lg:w-56 h-auto object-contain"
            />
          </div>

          {/* ===== Cards Grid ===== */}
          <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
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
                className="
            relative rounded-2xl 
            p-6 sm:p-8 lg:p-10
            bg-[rgb(155,37,51)]/5 
            border border-[rgb(155,37,51)]/20 
            shadow-lg
            overflow-hidden 
            transition-all duration-300 ease-in-out 
            hover:-translate-y-2 
            hover:shadow-2xl 
            hover:scale-[1.02]
          "
              >
                {/* Background Layer */}
                <div className="absolute inset-0 z-0 pointer-events-none">
                  <img
                    src="/images/bg.png"
                    alt="card background"
                    className="w-full h-full object-cover opacity-10 sm:opacity-20"
                  />
                </div>

                {/* Card Content */}
                <div className="relative z-10">
                  <img
                    src={card.icon}
                    alt={card.title}
                    className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 mb-4 sm:mb-6 mx-auto"
                  />

                  <h3 className="font-bebas text-2xl sm:text-3xl text-[rgb(155,37,51)] mb-3 sm:mb-4 tracking-wide">
                    {card.title.toUpperCase()}
                  </h3>

                  <p className="font-matter text-sm sm:text-base text-gray-700 leading-relaxed">
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

            <h2 className="font-bebas font-bold text-4xl lg:text-6xl tracking-wider uppercase text-white">
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

      {/* ABOUT ECOMMERCE SECTION – Responsive Slider */}
      <section className="w-full bg-[#ffffff] py-20">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 text-center">
          {/* Heading with Side Design Images */}
          <div className="flex items-center justify-center gap-6 mb-6">
            {/* Left Design Image */}
            <img
              src="./images/D.png"
              alt="Left Design"
              className="w-32 sm:w-48 lg:w-72 h-auto"
            />

            {/* Title */}
            <h2 className="text-2xl lg:text-6xl font-bebas font-bold text-[#9b2533] uppercase tracking-wide text-center">
              Our Sacred Collection
            </h2>

            {/* Right Design Image */}
            <img
              src="./images/D.png"
              alt="Right Design"
              className="w-32 sm:w-48 lg:w-72 h-auto"
            />
          </div>

          {/* Center Description */}
          <p className="font-matter text-gray-700 text-lg leading-relaxed max-w-4xl mx-auto mb-16">
            Each product in our store is thoughtfully curated using
            numerological wisdom and energetic alignment. We offer spiritually
            meaningful tools designed to enhance positivity, prosperity, and
            personal balance according to your unique number vibration.
          </p>

          {/* Scroll Wrapper */}
          <div
            className="
        flex lg:grid
        lg:grid-cols-4
        gap-12
        overflow-x-auto
        lg:overflow-visible
        snap-x snap-mandatory
        scroll-smooth
        no-scrollbar
      "
          >
            {/* ITEM 1 */}
            <div
              className="
          group flex flex-col items-center
          min-w-full lg:min-w-0
          snap-center
          transition duration-300
        "
            >
              <div
                className="
            w-48 h-48 lg:w-64 lg:h-64 rounded-full
            overflow-hidden
            shadow-md
            border border-gray-200
            transition-all duration-500
            group-hover:shadow-2xl
            group-hover:-translate-y-2
            group-hover:border-[#9b2533]
          "
              >
                <img
                  src="./images/Circle1.png"
                  alt="Personalized Remedies"
                  className="
              w-full h-full object-cover
              transition-transform duration-700
              group-hover:scale-110
            "
                />
              </div>

              <h3 className="font-bebas text-4xl text-[#9b2533] mt-6 ">
                Personalized Remedies
              </h3>

              <p className="font-matter text-lg text-gray-600 mt-2 px-6">
                Tailored solutions aligned with your birth number and destiny
                path.
              </p>
            </div>

            {/* ITEM 2 */}
            <div
              className="
          group flex flex-col items-center
          min-w-full lg:min-w-0
          snap-center
          transition duration-300
        "
            >
              <div
                className="
            w-48 h-48 lg:w-64 lg:h-64 rounded-full
            overflow-hidden
            shadow-md
            border border-gray-200
            transition-all duration-500
            group-hover:shadow-2xl
            group-hover:-translate-y-2
            group-hover:border-[#9b2533]
          "
              >
                <img
                  src="./images/Circle2.png"
                  alt="Energy Accessories"
                  className="
              w-full h-full object-cover
              transition-transform duration-700
              group-hover:scale-110
            "
                />
              </div>

              <h3 className="font-bebas text-4xl text-[#9b2533] mt-6 ">
                Energy Accessories
              </h3>

              <p className="font-matter text-lg text-gray-600 mt-2 px-6">
                Bracelets, charms, and tools that balance spiritual vibrations.
              </p>
            </div>

            {/* ITEM 3 */}
            <div
              className="
          group flex flex-col items-center
          min-w-full lg:min-w-0
          snap-center
          transition duration-300
        "
            >
              <div
                className="
            w-48 h-48 lg:w-64 lg:h-64 rounded-full
            overflow-hidden
            shadow-md
            border border-gray-200
            transition-all duration-500
            group-hover:shadow-2xl
            group-hover:-translate-y-2
            group-hover:border-[#9b2533]
          "
              >
                <img
                  src="./images/Circle3.png"
                  alt="Prosperity Tools"
                  className="
              w-full h-full object-cover
              transition-transform duration-700
              group-hover:scale-110
            "
                />
              </div>

              <h3 className="font-bebas text-4xl text-[#9b2533] mt-6 ">
                Prosperity Tools
              </h3>

              <p className="font-matter text-lg text-gray-600 mt-2 px-6">
                Sacred items designed to attract abundance and growth.
              </p>
            </div>

            {/* ITEM 4 */}
            <div
              className="
          group flex flex-col items-center
          min-w-full lg:min-w-0
          snap-center
          transition duration-300
        "
            >
              <div
                className="
            w-48 h-48 lg:w-64 lg:h-64 rounded-full
            overflow-hidden
            shadow-md
            border border-gray-200
            transition-all duration-500
            group-hover:shadow-2xl
            group-hover:-translate-y-2
            group-hover:border-[#9b2533]
          "
              >
                <img
                  src="./images/Circle4.png"
                  alt="Spiritual Gifting"
                  className="
              w-full h-full object-cover
              transition-transform duration-700
              group-hover:scale-110
            "
                />
              </div>

              <h3 className="font-bebas text-4xl text-[#9b2533] mt-6 ">
                Spiritual Gifting
              </h3>

              <p className="font-matter text-lg text-gray-600 mt-2 px-6">
                Meaningful gifts aligned with destiny numbers and cosmic timing.
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* GALLERY – Bento Grid Layout */}
      <section className="w-full bg-gradient-to-b from-white to-[#FDFCF6] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-center gap-6 mb-12"
          >
            <img
              src="/images/FiveStars.png"
              alt="left decor"
              className="w-32 sm:w-48 lg:w-72 h-auto"
            />

            <h2 className="text-5xl md:text-6xl font-bebas font-bold text-[#9b2533] uppercase tracking-wide">
              Gallery
            </h2>

            <img
              src="/images/FiveStars.png"
              alt="right decor"
              className="w-32 sm:w-48 lg:w-72 h-auto"
            />
          </motion.div>

          {/* Bento Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[200px]">
            {/* Large - Amazonite */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="col-span-2 row-span-2 relative group cursor-pointer rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500"
            >
              <img
                src="/images/S-Amazonite Bracelet.png"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                alt="Amazonite Bracelet"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                <h3 className="text-white font-bold text-2xl tracking-wide">Amazonite Bracelet</h3>
                <div className="w-16 h-1 bg-[#FACC15] mt-2" />
              </div>
            </motion.div>

            {/* Small - Amethyst */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="col-span-1 row-span-1 relative group cursor-pointer rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500"
            >
              <img
                src="/images/S-Amethyst Bracelet.png"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                alt="Amethyst Bracelet"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                <h3 className="text-white font-bold text-lg">Amethyst</h3>
                <div className="w-12 h-1 bg-[#FACC15] mt-2" />
              </div>
            </motion.div>

            {/* Tall - Azurite */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="col-span-1 row-span-2 relative group cursor-pointer rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500"
            >
              <img
                src="/images/S-Azurite Bracelet.png"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                alt="Azurite Bracelet"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                <h3 className="text-white font-bold text-lg">Azurite</h3>
                <div className="w-12 h-1 bg-[#FACC15] mt-2" />
              </div>
            </motion.div>

            {/* Small - Trees */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="col-span-1 row-span-1 relative group cursor-pointer rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500"
            >
              <img
                src="/images/Trees.png"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                alt="Crystal Trees"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                <h3 className="text-white font-bold text-lg">Crystal Trees</h3>
                <div className="w-12 h-1 bg-[#FACC15] mt-2" />
              </div>
            </motion.div>

            {/* Wide - Rose Quartz */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="col-span-2 row-span-1 relative group cursor-pointer rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500"
            >
              <img
                src="/images/S-RoseQuartz Bracelet.png"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                alt="Rose Quartz Bracelet"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                <h3 className="text-white font-bold text-xl">Rose Quartz Bracelet</h3>
                <div className="w-16 h-1 bg-[#FACC15] mt-2" />
              </div>
            </motion.div>

            {/* Small - Tiger Eye */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="col-span-1 row-span-1 relative group cursor-pointer rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500"
            >
              <img
                src="/images/S-TigerEye Bracelet.png"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                alt="Tiger Eye Bracelet"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                <h3 className="text-white font-bold text-lg">Tiger Eye</h3>
                <div className="w-12 h-1 bg-[#FACC15] mt-2" />
              </div>
            </motion.div>

            {/* Small - Citrine */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="col-span-1 row-span-1 relative group cursor-pointer rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500"
            >
              <img
                src="/images/S-Citrine Bracelet.png"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                alt="Citrine Bracelet"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                <h3 className="text-white font-bold text-lg">Citrine</h3>
                <div className="w-12 h-1 bg-[#FACC15] mt-2" />
              </div>
            </motion.div>
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
