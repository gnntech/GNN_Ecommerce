import { cn } from "@/lib/utils";
import { ProductStatus } from "@/types/collection";

interface ProductStatusBadgeProps {
  status: ProductStatus;
  stock?: number;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const ProductStatusBadge = ({ 
  status, 
  stock = 0, 
  className,
  size = "md" 
}: ProductStatusBadgeProps) => {
  const getStatusConfig = () => {
    switch (status) {
      case "active":
        if (stock === 0) {
          return {
            label: "Out of Stock",
            className: "bg-red-100 text-red-800 border-red-200",
            icon: "⚠️"
          };
        }
        if (stock <= 5) {
          return {
            label: `Low Stock (${stock})`,
            className: "bg-yellow-100 text-yellow-800 border-yellow-200",
            icon: "⚡"
          };
        }
        return {
          label: "In Stock",
          className: "bg-green-100 text-green-800 border-green-200",
          icon: "✅"
        };
      
      case "inactive":
        return {
          label: "Inactive",
          className: "bg-gray-100 text-gray-800 border-gray-200",
          icon: "⏸️"
        };
      
      case "out-of-stock":
        return {
          label: "Out of Stock",
          className: "bg-red-100 text-red-800 border-red-200",
          icon: "❌"
        };
      
      default:
        return {
          label: "Unknown",
          className: "bg-gray-100 text-gray-800 border-gray-200",
          icon: "❓"
        };
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "px-2 py-1 text-xs";
      case "lg":
        return "px-4 py-2 text-sm";
      default:
        return "px-3 py-1.5 text-xs";
    }
  };

  const config = getStatusConfig();

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border font-medium",
        getSizeClasses(),
        config.className,
        className
      )}
    >
      <span className="text-xs">{config.icon}</span>
      {config.label}
    </span>
  );
};

export default ProductStatusBadge;