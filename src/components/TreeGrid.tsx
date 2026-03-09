import TreeCard from "./TreeCard";
import { useState, useEffect } from "react";
import api from "@/lib/api";
import { motion } from "framer-motion";

const TreeGrid = () => {
  const [trees, setTrees] = useState<any[]>([]);

  useEffect(() => {
    const fetchTrees = async () => {
      try {
        const { data } = await api.get("/products/trees");
        setTrees(data);
      } catch (error) {
        console.error("Failed to fetch trees", error);
      }
    };
    fetchTrees();
  }, []);

  return (
    <div className="w-full">
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {trees.map((tree) => (
          <TreeCard key={tree._id} tree={tree} />
        ))}
      </motion.div>
    </div>
  );
};

export default TreeGrid;
