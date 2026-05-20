import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, ShoppingCart, Eye, Star, Package } from "lucide-react";
import { Product, ProductVariant } from "@/types/collection";
import ProductStatusBadge from "./ProductStatusBadge";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  showCategory?: boolean;
  showStatus?: boolean;
  showRating?: boolean;
  onAddToCart?: (product: Product, variant?: ProductVariant) => void;
  onQuickView?: (product: Product) => void;
  onWishlist?: (product: Product) => void;
  className?: string;
}

const ProductCard = ({
  product,
  showCategory = false,
  showStatus = true,
  showRating = true,
  onAddToCart,
  onQuickView,
  onWishlist,
  className
}: ProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(
    product.variants?.[0]
  );

  // Calculate display price
  const getDisplayPrice = () => {
    if (selectedVariant?.price) {
      return `₹${selectedVariant.price.toLocaleString('en-IN')}`;
    }
    return product.priceDisplay || `₹${product.price.toLocaleString('en-IN')}`;
  };

  // Check if product can be purchased
  const canPurchase = () => {
    if (product.status !== 'active') return false;
    
    if (product.hasVariants && selectedVariant) {
      return selectedVariant.isActive && selectedVariant.stock > 0;
    }
    
    return product.isInStock && product.stock > 0;
  };

  // Get stock info
  const getStockInfo = () => {
    if (product.hasVariants && selectedVariant) {
      return {
        stock: selectedVariant.stock,
        isInStock: selectedVariant.stock > 0
      };
    }
    return {
      stock: product.stock,
      isInStock: product.isInStock
    };
  };

  const stockInfo = getStockInfo();

  // Handle add to cart
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (canPurchase() && onAddToCart) {
      onAddToCart(product, selectedVariant);
    }
  };

  // Handle quick view
  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (onQuickView) {
      onQuickView(product);
    }
  };

  // Handle wishlist
  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (onWishlist) {
      onWishlist(product);
    }
  };

  return (
    <motion.div
      className={cn(
        "group relative bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-all duration-300",
        "hover:shadow-lg hover:border-gray-300",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -2 }}
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <img
          src={product.image}
          alt={product.name}
          className={cn(
            "w-full h-full object-cover transition-all duration-500",
            imageLoaded ? "opacity-100 scale-100" : "opacity-0 scale-105",
            isHovered && "scale-110"
          )}
          onLoad={() => setImageLoaded(true)}
        />

        {/* Status Badge */}
        {showStatus && (
          <div className="absolute top-3 left-3">
            <ProductStatusBadge 
              status={product.status} 
              stock={stockInfo.stock}
              size="sm"
            />
          </div>
        )}

        {/* Category Badge */}
        {showCategory && (
          <div className="absolute top-3 right-3">
            <span className="px-2 py-1 bg-white/90 backdrop-blur-sm text-xs font-medium text-gray-700 rounded-full capitalize">
              {product.category}
            </span>
          </div>
        )}

        {/* Featured Badge */}
        {product.featured && (
          <div className="absolute top-3 right-3">
            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
              ⭐ Featured
            </span>
          </div>
        )}

        {/* Hover Actions */}
        <motion.div
          className="absolute inset-0 bg-black/20 flex items-center justify-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        >
          {onQuickView && (
            <button
              onClick={handleQuickView}
              className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors"
              title="Quick View"
            >
              <Eye className="w-4 h-4 text-gray-700" />
            </button>
          )}

          {onWishlist && (
            <button
              onClick={handleWishlist}
              className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors"
              title="Add to Wishlist"
            >
              <Heart className="w-4 h-4 text-gray-700" />
            </button>
          )}
        </motion.div>

        {/* Discount Badge */}
        {product.compareAtPrice && product.compareAtPrice > product.price && (
          <div className="absolute bottom-3 left-3">
            <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
              {Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)}% OFF
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Title and Description */}
        <div>
          <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {product.name}
          </h3>
          
          {(product.shortDescription || product.numerology) && (
            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
              {product.shortDescription || product.numerology}
            </p>
          )}
        </div>

        {/* Rating */}
        {showRating && product.rating > 0 && (
          <div className="flex items-center gap-1">
            <div className="flex items-center">
              {Array.from({ length: 5 }, (_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "w-3 h-3",
                    i < Math.floor(product.rating)
                      ? "text-yellow-400 fill-current"
                      : "text-gray-300"
                  )}
                />
              ))}
            </div>
            <span className="text-xs text-gray-600">
              ({product.reviewCount || 0})
            </span>
          </div>
        )}

        {/* Variants */}
        {product.hasVariants && product.variants && product.variants.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-1">
              <Package className="w-3 h-3 text-gray-500" />
              <span className="text-xs text-gray-600">Variants available</span>
            </div>
            
            <div className="flex flex-wrap gap-1">
              {product.variants.slice(0, 3).map((variant) => (
                <button
                  key={variant._id}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setSelectedVariant(variant);
                  }}
                  className={cn(
                    "px-2 py-1 text-xs rounded border transition-colors",
                    selectedVariant?._id === variant._id
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-gray-200 text-gray-600 hover:border-gray-300"
                  )}
                >
                  {variant.size || variant.color || variant.label}
                </button>
              ))}
              
              {product.variants.length > 3 && (
                <span className="px-2 py-1 text-xs text-gray-500">
                  +{product.variants.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Price */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-gray-900">
                {getDisplayPrice()}
              </span>
              
              {product.compareAtPrice && product.compareAtPrice > product.price && (
                <span className="text-sm text-gray-500 line-through">
                  ₹{product.compareAtPrice.toLocaleString('en-IN')}
                </span>
              )}
            </div>
            
            {stockInfo.stock <= 5 && stockInfo.stock > 0 && (
              <p className="text-xs text-orange-600">
                Only {stockInfo.stock} left!
              </p>
            )}
          </div>

          {/* Add to Cart Button */}
          {onAddToCart && (
            <button
              onClick={handleAddToCart}
              disabled={!canPurchase()}
              className={cn(
                "flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all",
                canPurchase()
                  ? "bg-blue-600 text-white hover:bg-blue-700 active:scale-95"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              )}
            >
              <ShoppingCart className="w-4 h-4" />
              {product.status === 'out-of-stock' || !stockInfo.isInStock 
                ? "Out of Stock" 
                : "Add to Cart"
              }
            </button>
          )}
        </div>

        {/* Additional Info */}
        {product.soldCount > 0 && (
          <div className="text-xs text-gray-500">
            {product.soldCount} sold
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ProductCard;