import { useNavigate } from "react-router-dom";
import { Gemstone } from "@/types/collection";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface GemstoneCardProps {
  gemstone: Gemstone;
  index: number;
  onOpenPreview?: (gemstone: Gemstone) => void;
}

const GemstoneCard: React.FC<GemstoneCardProps> = ({ gemstone, index, onOpenPreview }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const outOfStock = gemstone.status === "out-of-stock" || !gemstone.isInStock;
  const inactive   = gemstone.status === "inactive";
  const id         = (gemstone as any)._id || gemstone.id;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (outOfStock) return;
    addToCart({
      id,
      name:  gemstone.name,
      price: gemstone.priceNum || parseFloat(gemstone.price.replace(/[^0-9.]/g, "")),
      image: gemstone.image || "/images/Gemstone.webp",
      qty:   1,
      type:  "Gemstone",
    });
    toast.success("Added to cart");
  };

  return (
    <motion.div
      className="bg-white rounded-3xl shadow-lg p-5 flex flex-col cursor-pointer relative"
      style={{ minHeight: "420px" }}
      whileHover={{ y: -5, boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)" }}
      transition={{ duration: 0.3 }}
      onClick={() => navigate(`/gemstone/${id}`)}
    >
      {/* Image */}
      <div className="aspect-square rounded-lg overflow-hidden mb-4 bg-gray-100 relative group">
        <img
          src={gemstone.image || "/images/Gemstone.webp"}
          alt={gemstone.name}
          className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 ${outOfStock ? "opacity-60" : ""}`}
          onError={(e) => { (e.target as HTMLImageElement).src = "/images/Gemstone.webp"; }}
        />
        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <span className="bg-white/90 text-black px-4 py-2 rounded-full text-sm font-semibold shadow-md">
            View Details
          </span>
        </div>

        {outOfStock && (
          <div className="absolute top-3 left-3 bg-gray-800 text-white text-xs font-bold px-3 py-1 rounded-full">
            Out of Stock
          </div>
        )}
        {inactive && (
          <div className="absolute top-3 left-3 bg-yellow-500 text-white text-xs font-bold px-3 py-1 rounded-full">
            Unavailable
          </div>
        )}
        {!outOfStock && gemstone.stock > 0 && gemstone.stock <= (gemstone.lowStockThreshold ?? 5) && (
          <div className="absolute top-3 right-3 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            Only {gemstone.stock} left
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col px-1">
        <h3 className="font-semibold text-xl text-gray-900 mb-1">{gemstone.name}</h3>
        <p className="text-sm text-gray-500 mb-4 line-clamp-2">{gemstone.shortDescription}</p>

        <div className="mt-auto">
          {gemstone.price && (
            <p className="text-3xl font-bold text-gray-900 mb-4">{gemstone.price}</p>
          )}

          <div className="flex gap-3">
            {!outOfStock && !inactive && (
              <button
                className="flex-1 py-3 rounded-full font-semibold text-white transition-all hover:opacity-90 active:scale-95"
                style={{ backgroundColor: "#9B2533" }}
                onClick={(e) => { e.stopPropagation(); navigate(`/gemstone/${id}`); }}
              >
                Buy Now
              </button>
            )}

            {(outOfStock || inactive) && (
              <div className="flex-1 py-3 rounded-full font-semibold text-center text-gray-400 bg-gray-100 cursor-not-allowed">
                {inactive ? "Unavailable" : "Out of Stock"}
              </div>
            )}

            <button
              className={`flex-1 py-3 rounded-full font-semibold border-2 bg-white transition-all active:scale-95 ${
                outOfStock || inactive
                  ? "border-gray-200 text-gray-300 cursor-not-allowed"
                  : "hover:bg-[#9B2533] hover:text-white"
              }`}
              style={outOfStock || inactive ? {} : { borderColor: "#9B2533", color: "#9B2533" }}
              onClick={handleAddToCart}
              disabled={outOfStock || inactive}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default GemstoneCard;
