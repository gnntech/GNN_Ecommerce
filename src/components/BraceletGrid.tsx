import BraceletCard from "./BraceletCard";
import ProductSkeletonGrid from "./ProductSkeletonGrid";
import { useState, useEffect } from "react";
import api from "@/lib/api";
import { motion } from "framer-motion";

const BraceletGrid = () => {
  const [bracelets, setBracelets] = useState<any[]>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBracelets = async () => {
      setLoading(true);
      try {
        const { data } = await api.get("/products/bracelets");
        setBracelets(data);
      } catch (error) {
        console.error("Failed to fetch bracelets", error);
        setBracelets([]); // Set empty array on error to stop loading
      } finally {
        setLoading(false);
      }
    };
    fetchBracelets();
  }, []);

  // Show skeleton while loading
  if (loading || !bracelets) {
    return (
      <div className="w-full">
        <ProductSkeletonGrid count={6} />
      </div>
    );
  }

  // Show empty state if no bracelets
  if (bracelets.length === 0) {
    return (
      <div className="w-full text-center py-16">
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
          No Bracelets Found
        </h3>
        <p className="text-gray-500">
          Check back later for new products
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, staggerChildren: 0.1 }}
      >
        {bracelets.map((bracelet, index) => (
          <motion.div
            key={bracelet._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <BraceletCard bracelet={bracelet} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default BraceletGrid;
