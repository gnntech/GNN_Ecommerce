import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowUpDown, Filter, Search, X } from "lucide-react";
import api from "@/lib/api";
import { 
  Product, 
  PaginatedResponse, 
  SortOption, 
  ProductFilters,
  CollectionCategory 
} from "@/types/collection";
import ProductCard from "./ProductCard";
import ProductSkeletonGrid from "./ProductSkeletonGrid";
import ProductStatusBadge from "./ProductStatusBadge";

const LIMIT = 12;

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "newest", label: "Newest First" },
  { value: "popular", label: "Most Popular" },
  { value: "price-asc", label: "Price: Low → High" },
  { value: "price-desc", label: "Price: High → Low" },
  { value: "rating", label: "Highest Rated" },
];

interface UnifiedProductGridProps {
  category?: CollectionCategory;
  initialFilters?: ProductFilters;
  showFilters?: boolean;
  showSearch?: boolean;
  title?: string;
  className?: string;
}

const UnifiedProductGrid = ({
  category,
  initialFilters = {},
  showFilters = true,
  showSearch = true,
  title,
  className = ""
}: UnifiedProductGridProps) => {
  // State management
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [sort, setSort] = useState<SortOption>("newest");
  
  // Filters state
  const [filters, setFilters] = useState<ProductFilters>({
    category,
    ...initialFilters
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [showFiltersPanel, setShowFiltersPanel] = useState(false);

  // Build API parameters
  const buildParams = useCallback((p: number, s: SortOption, f: ProductFilters, search?: string) => {
    const params = new URLSearchParams({
      page: String(p),
      limit: String(LIMIT),
      sort: s === "price-asc" || s === "price-desc" ? "price" : s,
      ...(s === "price-asc" && { order: "asc" }),
      ...(s === "price-desc" && { order: "desc" }),
    });

    // Add filters
    if (f.category) params.set("category", f.category);
    if (f.status) params.set("status", f.status);
    if (f.minPrice) params.set("minPrice", String(f.minPrice));
    if (f.maxPrice) params.set("maxPrice", String(f.maxPrice));
    if (f.inStockOnly) params.set("inStockOnly", "true");
    if (f.featured) params.set("featured", "true");
    if (search) params.set("search", search);

    return params.toString();
  }, []);

  // Fetch products
  const fetchProducts = useCallback(async (p: number, s: SortOption, f: ProductFilters, search?: string) => {
    setLoading(true);
    try {
      const endpoint = search 
        ? `/products/search?${buildParams(p, s, f, search)}`
        : `/products?${buildParams(p, s, f)}`;
      
      const { data }: { data: PaginatedResponse<Product> } = await api.get(endpoint);
      
      setProducts(data.products);
      setTotalPages(data.pages);
      setTotal(data.total);
    } catch (error) {
      console.error("Failed to fetch products:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [buildParams]);

  // Effects
  useEffect(() => {
    fetchProducts(page, sort, filters, searchQuery);
  }, [page, sort, filters, searchQuery, fetchProducts]);

  // Handlers
  const handleSortChange = (newSort: SortOption) => {
    setSort(newSort);
    setPage(1);
  };

  const handleFilterChange = (newFilters: Partial<ProductFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setPage(1);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setPage(1);
  };

  const clearFilters = () => {
    setFilters({ category });
    setSearchQuery("");
    setPage(1);
  };

  const hasActiveFilters = () => {
    return searchQuery || 
           filters.minPrice || 
           filters.maxPrice || 
           filters.inStockOnly || 
           filters.featured ||
           (filters.status && filters.status !== "active");
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          {title && (
            <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          )}
          <p className="text-sm text-gray-600 mt-1">
            {loading ? "Loading..." : `${total} products found`}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Search */}
          {showSearch && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
              />
              {searchQuery && (
                <button
                  onClick={() => handleSearch("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          )}

          {/* Filters Toggle */}
          {showFilters && (
            <button
              onClick={() => setShowFiltersPanel(!showFiltersPanel)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Filter className="w-4 h-4" />
              Filters
              {hasActiveFilters() && (
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              )}
            </button>
          )}

          {/* Sort Dropdown */}
          <div className="relative">
            <select
              value={sort}
              onChange={(e) => handleSortChange(e.target.value as SortOption)}
              className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {SORT_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ArrowUpDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && showFiltersPanel && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-gray-50 rounded-lg p-4 border border-gray-200"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Category Filter */}
            {!category && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={filters.category || ""}
                  onChange={(e) => handleFilterChange({ 
                    category: e.target.value as CollectionCategory || undefined 
                  })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Categories</option>
                  <option value="gemstones">Gemstones</option>
                  <option value="bracelets">Bracelets</option>
                  <option value="trees">Trees</option>
                </select>
              </div>
            )}

            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Min Price
              </label>
              <input
                type="number"
                placeholder="₹0"
                value={filters.minPrice || ""}
                onChange={(e) => handleFilterChange({ 
                  minPrice: e.target.value ? Number(e.target.value) : undefined 
                })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Price
              </label>
              <input
                type="number"
                placeholder="₹10000"
                value={filters.maxPrice || ""}
                onChange={(e) => handleFilterChange({ 
                  maxPrice: e.target.value ? Number(e.target.value) : undefined 
                })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Additional Filters */}
            <div className="space-y-3">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={filters.inStockOnly || false}
                  onChange={(e) => handleFilterChange({ inStockOnly: e.target.checked })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">In Stock Only</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={filters.featured || false}
                  onChange={(e) => handleFilterChange({ featured: e.target.checked })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Featured Products</span>
              </label>
            </div>
          </div>

          {/* Clear Filters */}
          {hasActiveFilters() && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <button
                onClick={clearFilters}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                Clear all filters
              </button>
            </div>
          )}
        </motion.div>
      )}

      {/* Products Grid */}
      {loading ? (
        <ProductSkeletonGrid count={LIMIT} />
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <ProductCard 
                product={product} 
                showCategory={!category}
                showStatus={true}
              />
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🔍</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-600 mb-4">
            {hasActiveFilters() 
              ? "Try adjusting your filters or search terms"
              : "No products available at the moment"
            }
          </p>
          {hasActiveFilters() && (
            <button
              onClick={clearFilters}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Clear filters
            </button>
          )}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing {((page - 1) * LIMIT) + 1} to {Math.min(page * LIMIT, total)} of {total} products
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = i + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                      page === pageNum
                        ? "bg-blue-600 text-white"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
              className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UnifiedProductGrid;