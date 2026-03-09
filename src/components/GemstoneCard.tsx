import { useNavigate } from "react-router-dom";
import { Gemstone } from "@/data/gemstones";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface GemstoneCardProps {
  gemstone: Gemstone;
  index: number;
  onOpenPreview?: (gemstone: Gemstone) => void;
}

const GemstoneCard: React.FC<GemstoneCardProps> = ({
  gemstone,
  index,
  onOpenPreview,
}) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart({
      id: (gemstone as any)._id || gemstone.id,
      name: gemstone.name,
      price: parseFloat(gemstone.price.replace(/[^0-9.]/g, '')),
      image: gemstone.image || "/images/Gemstone.png",
      qty: 1,
      type: 'Gemstone'
    });
    toast.success("Added to cart");
  };

  return (
    <motion.div
      className="bg-white rounded-3xl shadow-lg p-5 flex flex-col cursor-pointer"
      style={{ minHeight: "420px" }}
      whileHover={{
        y: -5,
        boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
      }}
      transition={{ duration: 0.3 }}
      onClick={() => navigate(`/gemstone/${(gemstone as any)._id || gemstone.id}`)}
    >
      {/* Image */}
      <div className="aspect-square rounded-lg overflow-hidden mb-4 bg-gray-100 relative cursor-pointer group">
        <img
          src={gemstone.image || "/images/Gemstone.png"}
          alt={gemstone.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/images/Gemstone.png";
          }}
        />
        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <span className="bg-white/90 text-black px-4 py-2 rounded-full text-sm font-semibold shadow-md">
            View Details
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col px-1">
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-semibold text-xl text-gray-900">
            {gemstone.name}
          </h3>
          {/* Like Button Removed */}
        </div>

        {/* Description */}
        <p className="text-sm text-gray-500 mb-4 line-clamp-2">
          {gemstone.shortDescription}
        </p>

        {/* Footer */}
        <div className="mt-auto">
          {gemstone.price && (
            <p className="text-3xl font-bold text-gray-900 mb-4">
              {gemstone.price}
            </p>
          )}
          <div className="flex gap-3">
            <button
              className="flex-1 py-3 rounded-full font-semibold text-center text-white"
              style={{ backgroundColor: "#9B2533" }}
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/gemstone/${(gemstone as any)._id || gemstone.id}`);
              }}
            >
              Buy Now
            </button>
            <button
              className="flex-1 py-3 rounded-full font-semibold border-2 bg-white"
              style={{ borderColor: "#9B2533", color: "#9B2533" }}
              onClick={handleAddToCart}
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
