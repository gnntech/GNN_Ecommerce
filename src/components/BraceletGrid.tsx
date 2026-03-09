import BraceletCard from "./BraceletCard";
import { useState, useEffect } from "react";
import api from "@/lib/api";
import { motion } from "framer-motion";

const BraceletGrid = () => {
  const [bracelets, setBracelets] = useState<any[]>([]);

  useEffect(() => {
    const fetchBracelets = async () => {
      try {
        const { data } = await api.get("/products/bracelets");
        setBracelets(data);
      } catch (error) {
        console.error("Failed to fetch bracelets", error);
      }
    };
    fetchBracelets();
  }, []);

  return (
    <div className="w-full">
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, staggerChildren: 0.1 }}
      >
        {bracelets.map((bracelet) => (
          <BraceletCard key={bracelet._id} bracelet={bracelet} />
        ))}
      </motion.div>
    </div>
  );
};

export default BraceletGrid;
