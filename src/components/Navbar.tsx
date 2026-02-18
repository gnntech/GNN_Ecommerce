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
    const handleScroll = () => setShowStrip(window.scrollY > 0);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* ================= DESKTOP NAVBAR ================= */}
      <nav className="fixed top-5 left-1/2 -translate-x-1/2 z-50 hidden md:block">
        <div
          className="
    flex
    items-center
    justify-between
    w-[90vw]
    max-w-[1200px]
    px-8
    py-2
    rounded-full
    backdrop-blur-[10px]
  "
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
                <div key={link.name} className="relative">
                  <span
                    onClick={() =>
                      setOpenDropdown(
                        openDropdown === link.name ? null : link.name,
                      )
                    }
                    className="cursor-pointer text-lg px-3 py-1 rounded-full font-medium hover:text-maroon"
                  >
                    {link.name}
                  </span>
                </div>
              ) : (
                <Link
                  key={link.name}
                  to={link.path}
                  className="text-lg px-3 py-1 rounded-full font-medium hover:text-maroon"
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
    px-4
    py-1.5
    rounded-full
    text-sm
    font-semibold
    shrink-0
  "
          >
            <Phone className="w-4 h-4" />
            Call Now
          </a>
        </div>
      </nav>

      {/* ================= MOBILE NAVBAR ================= */}
      <nav className="md:hidden fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[92vw]">
        <div
          className="
      flex
      items-center
      justify-between
      px-4
      py-2
      rounded-full
      backdrop-blur-[10px]
    "
          style={{
            background: "rgba(255, 255, 255, 0.92)",
            boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
          }}
        >
          {/* LOGO */}
          <Link to="/" className="flex items-center shrink-0">
            <img src="/images/logo.png" alt="GNN Logo" className="h-7 w-auto" />
          </Link>

          {/* HAMBURGER */}
          <button onClick={() => setIsOpen(!isOpen)} className="text-black p-2">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* ================= MOBILE MENU ================= */}
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
    </>
  );
};

export default Navbar;
