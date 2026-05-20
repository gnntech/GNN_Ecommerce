import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import api from "@/lib/api";
import GemstoneCard from "./GemstoneCard";
import ProductSkeletonGrid from "./ProductSkeletonGrid";

const GemstoneGrid = () => {
  const [gemstones, setGemstones] = useState<any[]>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGemstones = async () => {
      setLoading(true);
      try {
        const { data } = await api.get("/products/gemstones");
        setGemstones(data);
      } catch (error) {
        console.error("Failed to fetch gemstones", error);
        setGemstones([]);
      } finally {
        setLoading(false);
      }
    };
    fetchGemstones();
  }, []);

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

        {/* Skeleton while loading */}
        {loading || !gemstones ? (
          <ProductSkeletonGrid count={8} />
        ) : gemstones.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">No gemstones found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
            {gemstones.map((gemstone, index) => (
              <motion.div
                key={gemstone._id || gemstone.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
              >
                <GemstoneCard gemstone={gemstone} index={index} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default GemstoneGrid;
