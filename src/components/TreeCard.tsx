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

  const outOfStock = tree.status === "out-of-stock" || !tree.isInStock;
  const inactive   = tree.status === "inactive";
  const id         = (tree as any)._id || tree.id;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (outOfStock) return;
    addToCart({
      id,
      name:  tree.name,
      price: tree.priceNum || parseFloat(tree.price.replace(/[^0-9.]/g, "")),
      image: tree.image || "/images/Trees.webp",
      qty:   1,
      type:  "Tree",
    });
    toast.success("Added to cart");
  };

  return (
    <motion.div
      className="bg-white rounded-3xl shadow-lg p-5 flex flex-col cursor-pointer relative"
      style={{ minHeight: "420px" }}
      whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)" }}
      onClick={() => navigate(`/tree/${id}`)}
    >
      {/* Image */}
      <div className="aspect-square rounded-lg overflow-hidden mb-4 bg-gray-100 relative">
        <img
          src={tree.image || "/images/Trees.webp"}
          alt={tree.name}
          className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 ${outOfStock ? "opacity-60" : ""}`}
          onError={(e) => { (e.target as HTMLImageElement).src = "/images/Trees.webp"; }}
        />

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
        {!outOfStock && tree.stock > 0 && tree.stock <= (tree.lowStockThreshold ?? 5) && (
          <div className="absolute top-3 right-3 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            Only {tree.stock} left
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col px-1">
        <h3 className="font-semibold text-xl text-gray-900 mb-1">{tree.name}</h3>
        <p className="text-sm text-gray-500 mb-4 line-clamp-2">{tree.numerology}</p>

        <div className="mt-auto">
          {tree.price && (
            <p className="text-3xl font-bold text-gray-900 mb-4">{tree.price}</p>
          )}

          <div className="flex gap-3">
            {!outOfStock && !inactive && (
              <button
                className="flex-1 py-3 rounded-full font-semibold text-white transition-all hover:opacity-90 active:scale-95"
                style={{ backgroundColor: "#9B2533" }}
                onClick={(e) => { e.stopPropagation(); navigate(`/tree/${id}`); }}
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

export default TreeCard;
