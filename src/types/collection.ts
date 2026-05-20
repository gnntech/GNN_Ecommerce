// ─────────────────────────────────────────────────────────────────────────────
// Product status & variant types
// ─────────────────────────────────────────────────────────────────────────────

export type ProductStatus = "active" | "inactive" | "out-of-stock";

export interface ProductVariant {
  _id?: string;
  label: string;
  size?: string;
  color?: string;
  beadCount?: string;
  stock: number;
  price?: number;
  sku?: string;
  isActive: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// Unified Product Interface
// ─────────────────────────────────────────────────────────────────────────────

export interface Product {
  _id?: string;
  id?: string | number;
  
  // Basic Information
  name: string;
  shortDescription?: string;
  meaning?: string;
  category: CollectionCategory;
  
  // Category-specific fields
  // Gemstones
  color?: string;
  colorClass?: string;
  glowClass?: string;
  zodiac?: string;
  rarity?: string;
  hardness?: string;
  chakra?: string;
  
  // Trees & Bracelets
  numerology?: string;
  
  // Media
  image: string;
  images?: string[];
  
  // Content
  benefits?: string[];
  whoShouldWear?: string[];
  careInstructions?: string[];
  
  // Pricing
  price: number;                    // Numeric price for calculations
  priceDisplay?: string;            // Formatted display price "₹1,200"
  formattedPrice?: string;          // Virtual field from backend
  compareAtPrice?: number;          // Original price for discounts
  
  // Inventory & Stock
  stock: number;
  lowStockThreshold?: number;
  trackQuantity: boolean;
  totalStock: number;               // Base stock + variant stocks
  isInStock: boolean;
  
  // Product Status
  status: ProductStatus;
  
  // Variants
  variants?: ProductVariant[];
  hasVariants: boolean;
  activeVariants?: ProductVariant[]; // Virtual field from backend
  lowestPrice?: number;             // Virtual field from backend
  
  // SEO & Marketing
  slug?: string;
  metaTitle?: string;
  metaDescription?: string;
  tags?: string[];
  featured: boolean;
  
  // Analytics
  soldCount: number;
  viewCount: number;
  rating: number;
  reviewCount: number;
  
  // External
  buyLink?: string;
  
  // Timestamps
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Legacy interfaces for backward compatibility
// ─────────────────────────────────────────────────────────────────────────────

export interface Gemstone extends Product {
  category: "gemstones";
}

export interface Tree extends Product {
  category: "trees";
}

export interface Bracelet extends Product {
  category: "bracelets";
}

// ─────────────────────────────────────────────────────────────────────────────
// API Response Types
// ─────────────────────────────────────────────────────────────────────────────

export interface PaginatedResponse<T> {
  products: T[];
  total: number;
  page: number;
  pages: number;
  limit: number;
}

export interface ProductAnalytics {
  overview: {
    totalProducts: number;
    activeProducts: number;
    outOfStockProducts: number;
    inactiveProducts: number;
  };
  categoryStats: Array<{
    _id: CollectionCategory;
    count: number;
  }>;
  topSellingProducts: Array<{
    _id: string;
    name: string;
    category: CollectionCategory;
    soldCount: number;
    price: number;
  }>;
  lowStockProducts: Array<{
    _id: string;
    name: string;
    category: CollectionCategory;
    totalStock: number;
    lowStockThreshold: number;
  }>;
}

// ─────────────────────────────────────────────────────────────────────────────
// Sorting and Filtering Types
// ─────────────────────────────────────────────────────────────────────────────

export type SortOption = "newest" | "popular" | "price-asc" | "price-desc" | "rating";

export interface ProductFilters {
  category?: CollectionCategory;
  status?: ProductStatus;
  minPrice?: number;
  maxPrice?: number;
  inStockOnly?: boolean;
  featured?: boolean;
  search?: string;
}

export interface ProductQueryParams extends ProductFilters {
  page?: number;
  limit?: number;
  sort?: SortOption;
  order?: "asc" | "desc";
}

// ─────────────────────────────────────────────────────────────────────────────
// Component Props Types
// ─────────────────────────────────────────────────────────────────────────────

export interface ProductCardProps {
  product: Product;
  showCategory?: boolean;
  showStatus?: boolean;
  onAddToCart?: (product: Product, variant?: ProductVariant) => void;
  onQuickView?: (product: Product) => void;
}

export interface ProductGridProps {
  category?: CollectionCategory;
  filters?: ProductFilters;
  showFilters?: boolean;
  showSorting?: boolean;
  limit?: number;
}

export interface VariantSelectorProps {
  variants: ProductVariant[];
  selectedVariant?: ProductVariant;
  onVariantChange: (variant: ProductVariant) => void;
  showStock?: boolean;
}

export interface ProductStatusBadgeProps {
  status: ProductStatus;
  stock?: number;
  className?: string;
}

export type CollectionCategory = "gemstones" | "bracelets" | "trees";
