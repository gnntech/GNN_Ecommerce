import React from "react";

/**
 * ProductSkeleton Component
 * 
 * A modern skeleton loader that matches the exact layout of product cards
 * (GemstoneCard, BraceletCard, TreeCard)
 * 
 * Features:
 * - Premium shimmer animation effect
 * - Matches product card dimensions and spacing exactly
 * - Responsive design
 * - Light and elegant background matching bracelet website UI
 * - Smooth transitions
 */

const ProductSkeleton: React.FC = () => {
  return (
    <div
      className="bg-white rounded-3xl shadow-lg p-5 flex flex-col overflow-hidden relative"
      style={{ minHeight: "420px" }}
    >
      {/* Shimmer overlay effect */}
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/40 to-transparent" />

      {/* Image Skeleton */}
      <div className="aspect-square rounded-lg overflow-hidden mb-4 bg-gradient-to-br from-gray-100 to-gray-200 relative">
        <div className="absolute inset-0 bg-gray-200/50" />
      </div>

      {/* Content Skeleton */}
      <div className="flex-1 flex flex-col px-1">
        {/* Title Skeleton */}
        <div className="mb-3">
          <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-100 rounded-lg w-3/4" />
        </div>

        {/* Description Skeleton - 2 lines */}
        <div className="mb-4 space-y-2">
          <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-100 rounded w-full" />
          <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-100 rounded w-5/6" />
        </div>

        {/* Footer Skeleton */}
        <div className="mt-auto">
          {/* Price Skeleton */}
          <div className="mb-4">
            <div className="h-9 bg-gradient-to-r from-gray-200 to-gray-100 rounded-lg w-1/2" />
          </div>

          {/* Buttons Skeleton - Buy Now & Add to Cart */}
          <div className="flex gap-3">
            <div className="flex-1 h-12 bg-gradient-to-r from-gray-200 to-gray-100 rounded-full" />
            <div className="flex-1 h-12 bg-gradient-to-r from-gray-200 to-gray-100 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductSkeleton;
