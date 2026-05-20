import { useState, useEffect } from "react";
import ProductCard, { Product } from "./ProductCard";
import ProductSkeletonGrid from "./ProductSkeletonGrid";

interface ProductGridProps {
  products?: Product[];
  productType?: "Bracelet" | "Gemstone" | "Tree" | "Product";
  loading?: boolean;
  skeletonCount?: number;
  className?: string;
  onProductClick?: (product: Product) => void;
}

/**
 * ProductGrid Component
 * 
 * A smart grid component that handles loading states and product display
 * 
 * Features:
 * - Automatic skeleton loading state
 * - Responsive grid layout
 * - Smooth transitions between loading and loaded states
 * - Reusable for any product type
 * 
 * Props:
 * - products: Array of products to display
 * - productType: Type of products (Bracelet, Gemstone, Tree, Product)
 * - loading: Loading state (optional, auto-detected if products is undefined)
 * - skeletonCount: Number of skeleton cards to show (default: 6)
 * - className: Additional CSS classes
 * - onProductClick: Optional click handler for products
 * 
 * Usage:
 * ```tsx
 * // With explicit loading state
 * <ProductGrid 
 *   products={products}
 *   loading={isLoading}
 *   productType="Bracelet"
 * />
 * 
 * // Auto-detect loading (shows skeleton when products is undefined)
 * <ProductGrid 
 *   products={products}
 *   productType="Gemstone"
 * />
 * ```
 */

const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  productType = "Product",
  loading,
  skeletonCount = 6,
  className = "",
  onProductClick,
}) => {
  // Auto-detect loading state if not provided
  const isLoading = loading !== undefined ? loading : products === undefined;

  // Show skeleton while loading
  if (isLoading) {
    return <ProductSkeletonGrid count={skeletonCount} className={className} />;
  }

  // Show empty state if no products
  if (!products || products.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-gray-400 mb-4">
          <svg
            className="w-24 h-24 mx-auto"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          No Products Found
        </h3>
        <p className="text-gray-500">
          Check back later for new products
        </p>
      </div>
    );
  }

  // Show products grid
  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8 ${className}`}
    >
      {products.map((product, index) => (
        <div
          key={(product as any)._id || product.id || index}
          style={{
            animation: `fadeIn 0.5s ease-in-out ${index * 0.1}s both`,
          }}
        >
          <ProductCard
            product={product}
            productType={productType}
            onOpenPreview={onProductClick}
          />
        </div>
      ))}

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default ProductGrid;
