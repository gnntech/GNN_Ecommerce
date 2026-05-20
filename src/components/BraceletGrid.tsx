import BraceletCard from "./BraceletCard";
import ProductSkeletonGrid from "./ProductSkeletonGrid";
import { useState, useEffect, useCallback } from "react";
import api from "@/lib/api";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowUpDown, RefreshCw } from "lucide-react";
import { Product } from "@/types/collection";

const LIMIT = 6;

type SortOption = "newest" | "popular" | "price-asc" | "price-desc";

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "newest",     label: "Newest First" },
  { value: "popular",    label: "Most Popular" },
  { value: "price-asc",  label: "Price: Low → High" },
  { value: "price-desc", label: "Price: High → Low" },
];

const BraceletGrid = () => {
  const [bracelets, setBracelets]     = useState<Product[]>();
  const [loading, setLoading]         = useState(true);
  const [page, setPage]               = useState(1);
  const [totalPages, setTotalPages]   = useState(1);
  const [total, setTotal]             = useState(0);
  const [sort, setSort]               = useState<SortOption>("newest");
  const [refreshing, setRefreshing]   = useState(false);

  const buildParams = (p: number, s: SortOption) => {
    const params = new URLSearchParams({ 
      page: String(p), 
      limit: String(LIMIT),
      category: "bracelets"
    });
    
    if (s === "price-asc")  { params.set("sort", "price"); params.set("order", "asc"); }
    else if (s === "price-desc") { params.set("sort", "price"); params.set("order", "desc"); }
    else params.set("sort", s);
    return params.toString();
  };

  const fetchBracelets = useCallback(async (p: number, s: SortOption) => {
    setLoading(true);
    try {
      const { data } = await api.get(`/products?${buildParams(p, s)}`);
      setBracelets(data.products);
      setTotalPages(data.pages);
      setTotal(data.total);
    } catch {
      setBracelets([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchBracelets(page, sort); }, [page, sort, fetchBracelets]);

  // Auto-refetch when window regains focus (user comes back from admin panel)
  useEffect(() => {
    const handleFocus = () => fetchBracelets(page, sort);
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [page, sort, fetchBracelets]);

  const handlePage = (next: number) => {
    setPage(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSort = (s: SortOption) => {
    setSort(s);
    setPage(1);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchBracelets(page, sort);
    setRefreshing(false);
  };

  return (
    <div className="w-full space-y-6">
      {/* Toolbar */}
      <div className="flex items-center justify-end gap-2 mb-6">
        <button
          onClick={handleRefresh}
          disabled={refreshing || loading}
          className="p-2 text-gray-600 hover:text-[#9B2533] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title="Refresh products"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
        </button>
        <ArrowUpDown className="w-4 h-4 text-gray-400" />
        <select
          value={sort}
          onChange={(e) => handleSort(e.target.value as SortOption)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:border-[#9B2533] transition-colors"
        >
          {SORT_OPTIONS.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      {/* Grid */}
      {loading || !bracelets ? (
        <ProductSkeletonGrid count={LIMIT} />
      ) : bracelets.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-500 text-lg">No bracelets found.</p>
        </div>
      ) : (
        <>
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {bracelets.map((bracelet, index) => (
              <motion.div
                key={bracelet._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <BraceletCard bracelet={bracelet as any} />
              </motion.div>
            ))}
          </motion.div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <button
                onClick={() => handlePage(page - 1)}
                disabled={page === 1}
                className="p-2 rounded-full border border-gray-200 hover:border-[#9B2533] hover:text-[#9B2533] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                <button
                  key={n}
                  onClick={() => handlePage(n)}
                  className={`w-9 h-9 rounded-full text-sm font-semibold transition-colors ${
                    n === page ? "bg-[#9B2533] text-white" : "border border-gray-200 hover:border-[#9B2533] hover:text-[#9B2533]"
                  }`}
                >
                  {n}
                </button>
              ))}
              <button
                onClick={() => handlePage(page + 1)}
                disabled={page === totalPages}
                className="p-2 rounded-full border border-gray-200 hover:border-[#9B2533] hover:text-[#9B2533] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BraceletGrid;
