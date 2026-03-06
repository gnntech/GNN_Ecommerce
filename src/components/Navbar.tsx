import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Phone, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const location = useLocation();

  const navLinks = [
    { name: "Home", path: "/" },
    {
      name: "Products",
      path: "/products",
      children: [
        { name: "Gemstones", path: "/collection" },
        { name: "Bracelets", path: "/bracelets" },
        { name: "Trees", path: "/trees" },
      ],
    },
    { name: "About", path: "/about" },
    { name: "Testimonials", path: "/testimonials" },
    { name: "Contact", path: "/contact" },
  ];

  const [showStrip, setShowStrip] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowStrip(window.scrollY > 0);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* ================= DESKTOP NAVBAR ================= */}
      <nav className="fixed top-5 left-1/2 -translate-x-1/2 z-50 hidden md:block">
        <div
          className={`
            flex items-center justify-between rounded-full backdrop-blur-[10px] transition-all duration-300
            ${showStrip ? 'w-[85vw] max-w-[1000px] px-6 py-1.5' : 'w-[90vw] max-w-[1200px] px-8 py-2'}
          `}
          style={{
            fontFamily: "Matter, sans-serif",
            background: "rgba(255, 255, 255, 0.92)",
            boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
          }}
        >
          {/* LOGO */}
          <Link to="/" className="flex items-center shrink-0">
            <img src="/images/logo.png" alt="GNN Logo" className="h-8 w-auto" />
          </Link>

          {/* NAV LINKS */}
          <div className="flex items-center gap-6">
            {navLinks.map((link) =>
              link.children ? (
                <div
                  key={link.name}
                  className="relative group"
                  onMouseEnter={() => setOpenDropdown(link.name)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <span
                    className={`
                      cursor-pointer text-lg px-4 py-2 rounded-full font-medium transition-colors flex items-center gap-1
                      ${openDropdown === link.name ? 'text-maroon' : 'hover:text-maroon'}
                    `}
                  >
                    {link.name}
                    <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${openDropdown === link.name ? 'rotate-180' : ''}`} />
                  </span>

                  <AnimatePresence>
                    {openDropdown === link.name && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-100 py-3 overflow-hidden"
                      >
                        {link.children.map((child) => (
                          <Link
                            key={child.name}
                            to={child.path}
                            className="block px-6 py-2.5 text-[15px] font-medium text-gray-700 hover:bg-maroon hover:text-white transition-all"
                            onClick={() => setOpenDropdown(null)}
                          >
                            {child.name}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  key={link.name}
                  to={link.path}
                  className="text-lg px-3 py-1 rounded-full font-medium hover:text-maroon transition-colors"
                >
                  {link.name}
                </Link>
              ),
            )}
          </div>

          {/* CALL NOW BUTTON */}
          <a
            href="tel:+1234567890"
            className="
    flex
    items-center
    gap-2
    bg-maroon
    text-white
    px-5
    py-2
    rounded-full
    text-sm
    font-semibold
    shrink-0
    hover:bg-red-800
    transition-all
    shadow-lg
    hover:shadow-maroon/20
  "
          >
            <Phone className="w-4 h-4" />
            Call Now
          </a>
        </div>
      </nav>

      {/* ================= MOBILE NAVBAR ================= */}
      <nav className="md:hidden fixed top-0 left-0 w-full z-50 transition-all duration-300">
        <div className={`bg-maroon transition-all duration-300 ${showStrip ? 'py-2' : 'py-3'} flex justify-center items-center`}>
          <div
            className={`
              flex items-center justify-between rounded-full bg-white transition-all duration-300
              ${showStrip ? 'w-[95vw] px-3 py-1.5' : 'w-[92vw] px-4 py-2'}
            `}
            style={{
              boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
            }}
          >
            {/* LOGO */}
            <Link to="/" className="flex items-center shrink-0">
              <img src="/images/logo.png" alt="GNN Logo" className="h-7 w-auto" />
            </Link>

            {/* HAMBURGER */}
            <button onClick={() => setIsOpen(!isOpen)} className="text-black p-2 rounded-full hover:bg-gray-100 transition-colors">
              <Menu size={24} />
            </button>
          </div>
        </div>
      </nav>

      {/* ================= MOBILE MENU ================= */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-[60] bg-[#FDFCF6] md:hidden flex flex-col"
          >
            {/* Top Bar (Maroon strip) */}
            <div className="bg-maroon p-4 h-24 flex items-center justify-center relative">
              <div className="bg-white rounded-full w-full max-w-[92vw] px-4 py-2 flex items-center justify-between shadow-lg">
                <Link to="/" onClick={() => setIsOpen(false)} className="flex items-center shrink-0">
                  <img src="/images/logo.png" alt="GNN Logo" className="h-7 w-auto" />
                </Link>
                <button onClick={() => setIsOpen(false)} className="text-black p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <X size={24} />
                </button>
              </div>
            </div>

            {/* Menu Items */}
            <div className="flex-1 overflow-y-auto pt-8 pb-20 px-6">
              <div className="flex flex-col space-y-8 items-center">
                {navLinks.map((link) =>
                  link.children ? (
                    <div key={link.name} className="w-full text-center">
                      <button
                        className={`text-3xl font-medium transition-colors flex items-center justify-center gap-2 mx-auto ${openDropdown === link.name ? 'text-maroon' : 'text-black'}`}
                        onClick={() =>
                          setOpenDropdown(
                            openDropdown === link.name ? null : link.name,
                          )
                        }
                      >
                        {link.name}
                        <ChevronDown className={`w-6 h-6 transition-transform duration-300 ${openDropdown === link.name ? 'rotate-180' : ''}`} />
                      </button>

                      <AnimatePresence>
                        {openDropdown === link.name && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="mt-4 space-y-4 overflow-hidden"
                          >
                            {link.children.map((child) => (
                              <Link
                                key={child.name}
                                to={child.path}
                                className="block text-xl text-gray-600 hover:text-maroon transition-colors"
                                onClick={() => {
                                  setIsOpen(false);
                                  setOpenDropdown(null);
                                }}
                              >
                                {child.name}
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <Link
                      key={link.name}
                      to={link.path}
                      className="text-3xl font-medium text-black hover:text-maroon transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      {link.name}
                    </Link>
                  ),
                )}

                {/* Call Now Button (Centered at bottom of scroll area or fixed) */}
                <div className="pt-4 w-full flex justify-center">
                  <a
                    href="tel:+1234567890"
                    className="flex items-center gap-2 bg-maroon text-white px-10 py-4 rounded-full text-xl font-bold shadow-xl hover:shadow-maroon/20 hover:scale-105 active:scale-95 transition-all"
                  >
                    <Phone className="w-6 h-6" />
                    Call Now
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;