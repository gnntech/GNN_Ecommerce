import { useState } from "react";
import { cn } from "@/lib/utils";
import { ProductVariant } from "@/types/collection";
import { Check, Package } from "lucide-react";

interface VariantSelectorProps {
  variants: ProductVariant[];
  selectedVariant?: ProductVariant;
  onVariantChange: (variant: ProductVariant) => void;
  showStock?: boolean;
  disabled?: boolean;
  className?: string;
}

const VariantSelector = ({
  variants,
  selectedVariant,
  onVariantChange,
  showStock = true,
  disabled = false,
  className
}: VariantSelectorProps) => {
  const [hoveredVariant, setHoveredVariant] = useState<string | null>(null);

  if (!variants || variants.length === 0) {
    return null;
  }

  const activeVariants = variants.filter(v => v.isActive);

  if (activeVariants.length === 0) {
    return (
      <div className="text-sm text-gray-500 italic">
        No variants available
      </div>
    );
  }

  const formatVariantLabel = (variant: ProductVariant) => {
    const parts = [];
    if (variant.size) parts.push(variant.size);
    if (variant.color) parts.push(variant.color);
    if (variant.beadCount) parts.push(`${variant.beadCount} beads`);
    return parts.length > 0 ? parts.join(" • ") : variant.label;
  };

  const getVariantPrice = (variant: ProductVariant, basePrice?: number) => {
    if (variant.price && basePrice && variant.price !== basePrice) {
      const diff = variant.price - basePrice;
      return diff > 0 ? `+₹${diff}` : `₹${Math.abs(diff)}`;
    }
    return null;
  };

  const isVariantAvailable = (variant: ProductVariant) => {
    return variant.isActive && variant.stock > 0;
  };

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center gap-2">
        <Package className="w-4 h-4 text-gray-600" />
        <span className="text-sm font-medium text-gray-900">
          Choose Variant
        </span>
      </div>

      <div className="grid gap-2">
        {activeVariants.map((variant) => {
          const isSelected = selectedVariant?._id === variant._id;
          const isAvailable = isVariantAvailable(variant);
          const isHovered = hoveredVariant === variant._id;

          return (
            <button
              key={variant._id}
              onClick={() => !disabled && isAvailable && onVariantChange(variant)}
              onMouseEnter={() => setHoveredVariant(variant._id)}
              onMouseLeave={() => setHoveredVariant(null)}
              disabled={disabled || !isAvailable}
              className={cn(
                "relative flex items-center justify-between p-3 rounded-lg border-2 transition-all duration-200 text-left",
                {
                  // Available states
                  "border-gray-200 hover:border-gray-300 hover:bg-gray-50": 
                    isAvailable && !isSelected && !disabled,
                  "border-blue-500 bg-blue-50": 
                    isAvailable && isSelected && !disabled,
                  
                  // Unavailable states
                  "border-gray-100 bg-gray-50 opacity-60 cursor-not-allowed": 
                    !isAvailable || disabled,
                  
                  // Hover effects
                  "shadow-sm": isHovered && isAvailable && !disabled,
                }
              )}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={cn(
                    "font-medium text-sm",
                    isAvailable ? "text-gray-900" : "text-gray-400"
                  )}>
                    {formatVariantLabel(variant)}
                  </span>
                  
                  {variant.sku && (
                    <span className="text-xs text-gray-500 font-mono">
                      {variant.sku}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3 mt-1">
                  {showStock && (
                    <span className={cn(
                      "text-xs",
                      variant.stock > 5 ? "text-green-600" :
                      variant.stock > 0 ? "text-yellow-600" : "text-red-600"
                    )}>
                      {variant.stock > 0 ? `${variant.stock} in stock` : "Out of stock"}
                    </span>
                  )}

                  {variant.price && (
                    <span className="text-xs font-medium text-gray-700">
                      ₹{variant.price.toLocaleString('en-IN')}
                    </span>
                  )}
                </div>
              </div>

              {/* Selection indicator */}
              <div className={cn(
                "flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors",
                {
                  "border-blue-500 bg-blue-500": isSelected && isAvailable,
                  "border-gray-300": !isSelected && isAvailable,
                  "border-gray-200 bg-gray-100": !isAvailable,
                }
              )}>
                {isSelected && isAvailable && (
                  <Check className="w-3 h-3 text-white" />
                )}
              </div>

              {/* Unavailable overlay */}
              {!isAvailable && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-lg">
                  <span className="text-xs font-medium text-gray-500">
                    Unavailable
                  </span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Variant summary */}
      {selectedVariant && (
        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-blue-900">
              Selected: {formatVariantLabel(selectedVariant)}
            </span>
            {selectedVariant.price && (
              <span className="text-sm font-bold text-blue-900">
                ₹{selectedVariant.price.toLocaleString('en-IN')}
              </span>
            )}
          </div>
          {showStock && selectedVariant.stock <= 5 && selectedVariant.stock > 0 && (
            <p className="text-xs text-blue-700 mt-1">
              Only {selectedVariant.stock} left in stock
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default VariantSelector;