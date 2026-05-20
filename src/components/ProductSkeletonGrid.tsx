import React from "react";
import ProductSkeleton from "./ProductSkeleton";

interface ProductSkeletonGridProps {
  count?: number;
  className?: string;
}

/**
 * ProductSkeletonGrid Component
 * 
 * Displays a responsive grid of skeleton loaders while products are being fetched
 * 
 * Props:
 * - count: Number of skeleton cards to display (default: 6)
 * - className: Additional CSS classes for the grid container
 * 
 * Features:
 * - Responsive grid layout (1 col mobile, 2 col tablet, 3 col desktop, 4 col xl)
 * - Matches actual product grid spacing
 * - Staggered animation for premium feel
 * 
 * Usage:
 * ```tsx
 * {loading ? (
 *   <ProductSkeletonGrid count={6} />
 * ) : (
 *   <ProductGrid products={products} />
 * )}
 * ```
 */

const ProductSkeletonGrid: React.FC<ProductSkeletonGridProps> = ({
  count = 6,
  className = "",
}) => {
  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8 ${className}`}
    >
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          style={{
            animation: `fadeIn 0.5s ease-in-out ${index * 0.1}s both`,
          }}
        >
          <ProductSkeleton />
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

export default ProductSkeletonGrid;
