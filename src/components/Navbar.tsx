import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Phone } from "lucide-react";

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
    const handleScroll = () => {
      setShowStrip(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <div className="fixed top-5 right-8 z-50 hidden md:block">
        <a
          href="tel:+1234567890"
          className="flex items-center gap-2 bg-maroon text-white px-5 py-2 rounded-full text-base font-semibold hover:bg-maroon/90 transition-colors shadow-lg"
        >
          <Phone className="w-5 h-5 fill-current" />
          Call Now
        </a>
      </div>
      <nav className="fixed top-5 left-0 right-0 z-40 flex justify-between md:justify-center items-center px-4">
        <div
          className="hidden md:flex w-full max-w-[850px] rounded-full px-6 py-2 items-center gap-4 transition-all duration-300 backdrop-blur-[10px]"
          style={{
            fontFamily: "Matter, sans-serif",
            background: "rgba(255, 255, 255, 0.92)",
            boxShadow: "0 8px 30px rgba(0,0,0,0.08)"
          }}
        >
          {/* ================= Logo ================= */}
          <Link to="/" className="flex items-center">
            <img src="/images/logo.png" alt="Logo" className="h-10 w-auto" />
          </Link>

          {/* ================= Desktop Navigation ================= */}
          <div className="hidden md:flex flex-grow items-center justify-center gap-5 lg:gap-7">
            {navLinks.map((link) =>
              link.children ? (
                <div
                  key={link.name}
                  className="relative"
                  onClick={() =>
                    setOpenDropdown(
                      openDropdown === link.name ? null : link.name,
                    )
                  }
                >
                  <span
                    className={`cursor-pointer text-lg px-4 py-1.5 rounded-full transition-colors font-medium ${location.pathname.startsWith(link.path)
                      ? "text-maroon"
                      : "text-black hover:text-maroon"
                      }`}
                  >
                    {link.name}
                  </span>

                  {openDropdown === link.name && (
                    <div className="absolute top-full mt-3 left-1/2 -translate-x-1/2 bg-white rounded-2xl shadow-xl py-3 min-w-[220px]">
                      {link.children.map((child) => (
                        <Link
                          key={child.name}
                          to={child.path}
                          className="block px-6 py-3 text-base text-black hover:bg-cream hover:text-maroon transition-colors"
                        >
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`text-lg px-3 py-1 rounded-full transition-colors text-center font-medium ${location.pathname === link.path
                    ? "text-maroon"
                    : "text-black hover:text-maroon"
                    }`}
                >
                  {link.name}
                </Link>
              ),
            )}
          </div>
        </div>

        {/* ================= Mobile Menu ================= */}
        {/* ================= Mobile Hamburger Only ================= */}
        <button
          className=" md:hidden
    fixed
    top-5
    left-4
    z-50
    text-white
    p-2"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
        {isOpen && (
          <div className="fixed inset-0 top-[80px] z-40 bg-cream/95 backdrop-blur-md p-4 md:hidden">
            <div className="flex flex-col space-y-5 items-center pt-8">
              {navLinks.map((link) =>
                link.children ? (
                  <div key={link.name} className="w-full text-center">
                    <button
                      className="text-2xl font-medium text-black"
                      onClick={() =>
                        setOpenDropdown(
                          openDropdown === link.name ? null : link.name,
                        )
                      }
                    >
                      {link.name}
                    </button>

                    {openDropdown === link.name && (
                      <div className="mt-3 space-y-3">
                        {link.children.map((child) => (
                          <Link
                            key={child.name}
                            to={child.path}
                            className="block text-lg text-gray-700"
                            onClick={() => {
                              setIsOpen(false);
                              setOpenDropdown(null);
                            }}
                          >
                            {child.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    key={link.name}
                    to={link.path}
                    className="text-2xl font-medium text-black"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.name}
                  </Link>
                ),
              )}

              <a
                href="tel:+1234567890"
                className="flex items-center gap-2 bg-maroon text-white px-6 py-3 rounded-full text-lg mt-6"
              >
                <Phone className="w-5 h-5" />
                Call Now
              </a>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
