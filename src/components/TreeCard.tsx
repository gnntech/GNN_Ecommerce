import { useNavigate } from "react-router-dom";
import { Tree } from "@/types/collection";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface Props {
  tree: Tree;
  onOpenPreview?: (tree: Tree) => void;
}

const TreeCard: React.FC<Props> = ({ tree, onOpenPreview }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart({
      id: (tree as any)._id || tree.id,
      name: tree.name,
      price: parseFloat(tree.price.replace(/[^0-9.]/g, '')),
      image: tree.image || "/images/Trees.png",
      qty: 1,
      type: 'Tree'
    });
    toast.success("Added to cart");
  };

  return (
    <motion.div
      className="bg-white rounded-3xl shadow-lg p-5 flex flex-col cursor-pointer"
      style={{ minHeight: "420px" }}
      whileHover={{
        y: -5,
        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      }}
      onClick={() => navigate(`/tree/${(tree as any)._id || tree.id}`)}
    >
      <div className="aspect-square rounded-lg overflow-hidden mb-4 bg-gray-100 relative">
        <img
          src={tree.image || "/images/Trees.png"}
          alt={tree.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/images/Trees.png";
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
          <h3 className="font-semibold text-xl text-gray-900">{tree.name}</h3>
          {/* Like Removed */}
        </div>

        {/* Description */}
        <p className="text-sm text-gray-500 mb-4 line-clamp-2">
          {tree.numerology}
        </p>

        {/* Footer */}
        <div className="mt-auto">
          {tree.price && (
            <p className="text-3xl font-bold text-gray-900 mb-4">
              {tree.price}
            </p>
          )}

          {/* ACTION BUTTONS */}
          <div className="flex gap-3">
            <button
              className="flex-1 py-3 rounded-full font-semibold text-center text-white"
              style={{ backgroundColor: "#9B2533" }}
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/tree/${(tree as any)._id || tree.id}`);
              }}
            >
              Buy Now
            </button>

            <button
              className="flex-1 py-3 rounded-full font-semibold border-2 bg-white"
              style={{
                borderColor: "#9B2533",
                color: "#9B2533",
              }}
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

export default TreeCard;
