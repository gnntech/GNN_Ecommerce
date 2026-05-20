import { useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";
import { motion } from "framer-motion";

/**
 * Generic Product Interface
 * Can be used for Bracelets, Gemstones, Trees, or any product type
 */
export interface Product {
  _id?: string;
  id?: string;
  name: string;
  price: string | number;
  image?: string;
  description?: string;
  numerology?: string;
  type?: string;
}

interface ProductCardProps {
  product: Product;
  productType?: "Bracelet" | "Gemstone" | "Tree" | "Product";
  onOpenPreview?: (product: Product) => void;
}

/**
 * ProductCard Component
 * 
 * A reusable, modern product card component for e-commerce
 * 
 * Features:
 * - Hover animations with framer-motion
 * - Add to cart functionality
 * - Buy now navigation
 * - Responsive design
 * - Matches skeleton loader layout exactly
 * - Premium UI with smooth transitions
 * 
 * Props:
 * - product: Product data object
 * - productType: Type of product (Bracelet, Gemstone, Tree, Product)
 * - onOpenPreview: Optional preview handler
 * 
 * Usage:
 * ```tsx
 * <ProductCard 
 *   product={bracelet} 
 *   productType="Bracelet"
 * />
 * ```
 */

const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  productType = "Product",
  onOpenPreview 
}) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  // Get product ID
  const productId = (product as any)._id || product.id;

  // Format price
  const formatPrice = (price: string | number): string => {
    if (typeof price === "number") {
      return `₹${price.toLocaleString()}`;
    }
    return price;
  };

  // Parse price for cart
  const parsePrice = (price: string | number): number => {
    if (typeof price === "number") return price;
    return parseFloat(price.replace(/[^0-9.]/g, ''));
  };

  // Handle add to cart
  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart({
      id: productId,
      name: product.name,
      price: parsePrice(product.price),
      image: product.image || "/images/S-Amazonite Bracelet.webp",
      qty: 1,
      type: productType
    });
    toast.success("Added to cart", {
      description: `${product.name} has been added to your cart`,
    });
  };

  // Handle buy now
  const handleBuyNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    const routeType = productType.toLowerCase();
    navigate(`/${routeType}/${productId}`);
  };

  // Handle card click
  const handleCardClick = () => {
    if (onOpenPreview) {
      onOpenPreview(product);
    } else {
      const routeType = productType.toLowerCase();
      navigate(`/${routeType}/${productId}`);
    }
  };

  return (
    <motion.div
      className="bg-white rounded-3xl shadow-lg p-5 flex flex-col cursor-pointer group"
      style={{ minHeight: "420px" }}
      whileHover={{
        y: -5,
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      onClick={handleCardClick}
    >
      {/* Product Image */}
      <div className="aspect-square rounded-lg overflow-hidden mb-4 bg-gray-100 relative">
        <img
          src={product.image || "/images/S-Amazonite Bracelet.webp"}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/images/S-Amazonite Bracelet.webp";
          }}
        />

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <span className="bg-white/90 text-black px-4 py-2 rounded-full text-sm font-semibold shadow-md transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
            View Details
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col px-1">
        {/* Title */}
        <div className="mb-1">
          <h3 className="font-semibold text-xl text-gray-900 group-hover:text-[#9B2533] transition-colors duration-300">
            {product.name}
          </h3>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-500 mb-4 line-clamp-2">
          {product.description || product.numerology || "Premium quality product"}
        </p>

        {/* Footer */}
        <div className="mt-auto">
          {/* Price */}
          <p className="text-3xl font-bold text-gray-900 mb-4">
            {formatPrice(product.price)}
          </p>

          {/* Action Buttons */}
          <div className="flex gap-3">
            {/* Buy Now Button */}
            <button
              className="flex-1 py-3 rounded-full font-semibold text-center text-white transition-all duration-300 hover:shadow-lg hover:scale-105 active:scale-95"
              style={{ backgroundColor: "#9B2533" }}
              onClick={handleBuyNow}
            >
              Buy Now
            </button>

            {/* Add to Cart Button */}
            <button
              className="flex-1 py-3 rounded-full font-semibold border-2 bg-white transition-all duration-300 hover:bg-[#9B2533] hover:text-white active:scale-95"
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

export default ProductCard;
