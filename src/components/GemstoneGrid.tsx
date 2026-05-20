import { motion } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, ArrowUpDown, RefreshCw } from "lucide-react";
import api from "@/lib/api";
import GemstoneCard from "./GemstoneCard";
import ProductSkeletonGrid from "./ProductSkeletonGrid";
import { Gemstone } from "@/types/collection";

const LIMIT = 8;

type SortOption = "newest" | "popular" | "price-asc" | "price-desc";

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "newest",     label: "Newest First" },
  { value: "popular",    label: "Most Popular" },
  { value: "price-asc",  label: "Price: Low → High" },
  { value: "price-desc", label: "Price: High → Low" },
];

const GemstoneGrid = () => {
  const [gemstones, setGemstones]     = useState<Gemstone[]>();
  const [loading, setLoading]         = useState(true);
  const [page, setPage]               = useState(1);
  const [totalPages, setTotalPages]   = useState(1);
  const [total, setTotal]             = useState(0);
  const [sort, setSort]               = useState<SortOption>("newest");
  const [refreshing, setRefreshing]   = useState(false);

  const buildParams = (p: number, s: SortOption) => {
    const params = new URLSearchParams({ page: String(p), limit: String(LIMIT) });
    if (s === "price-asc")       { params.set("sort", "priceNum"); params.set("order", "asc"); }
    else if (s === "price-desc") { params.set("sort", "priceNum"); params.set("order", "desc"); }
    else params.set("sort", s);
    return params.toString();
  };

  const fetchGemstones = useCallback(async (p: number, s: SortOption) => {
    setLoading(true);
    try {
      const { data } = await api.get(`/products/gemstones?${buildParams(p, s)}`);
      setGemstones(data.products);
      setTotalPages(data.pages);
      setTotal(data.total);
    } catch {
      setGemstones([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchGemstones(page, sort); }, [page, sort, fetchGemstones]);

  // Auto-refetch when window regains focus (user comes back from admin panel)
  useEffect(() => {
    const handleFocus = () => fetchGemstones(page, sort);
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [page, sort, fetchGemstones]);

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
    await fetchGemstones(page, sort);
    setRefreshing(false);
  };

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="text-primary text-sm font-medium tracking-[0.3em] uppercase mb-4 block">
            Collection
          </span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground mb-6">
            Explore Our Gemstones
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
            Discover the beauty, meaning, and energy behind every stone.
          </p>
          <div className="divider-glow mt-8 max-w-xs mx-auto" />
        </motion.div>

        {/* Toolbar */}
        <div className="flex items-center justify-end gap-2 mb-8">
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
        {loading || !gemstones ? (
          <ProductSkeletonGrid count={LIMIT} />
        ) : gemstones.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">No gemstones found.</p>
          </div>
        ) : (
          <div className="space-y-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
              {gemstones.map((gemstone, index) => (
                <motion.div
                  key={(gemstone as any)._id || gemstone.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.06 }}
                >
                  <GemstoneCard gemstone={gemstone} index={index} />
                </motion.div>
              ))}
            </div>

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
          </div>
        )}
      </div>
    </section>
  );
};

export default GemstoneGrid;
