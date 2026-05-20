import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Package, ArrowLeft } from "lucide-react";
import api from "@/lib/api";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface Product {
  _id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  shortDescription?: string;
  status: string;
  totalStock: number;
}

interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
}

const CategoryPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!slug) return;

      setLoading(true);
      try {
        console.log('Fetching category with slug:', slug);
        
        // Fetch category details
        const { data: categories } = await api.get("/categories");
        console.log('All categories:', categories);
        
        const foundCategory = categories.find((cat: Category) => cat.slug === slug);
        console.log('Found category:', foundCategory);

        if (!foundCategory) {
          console.error('Category not found. Available slugs:', categories.map((c: Category) => c.slug));
          toast.error(`Category "${slug}" not found`);
          navigate("/");
          return;
        }

        setCategory(foundCategory);

        // Fetch products in this category (show all products, not just active)
        console.log('Fetching products for category:', slug);
        const { data } = await api.get(`/products?category=${slug}&all=true`);
        console.log('Products received:', data);
        
        setProducts(Array.isArray(data) ? data : data.products || []);
      } catch (error: any) {
        console.error("Failed to fetch category data:", error);
        toast.error("Failed to load category");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFCF6]">
        <Navbar />
        <div className="pt-32 pb-20 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#9B2533]"></div>
        </div>
      </div>
    );
  }

  if (!category) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#FDFCF6]">
      <Navbar />
      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-gray-600 hover:text-[#9B2533] transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </button>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {category.name}
          </h1>
          {category.description && (
            <p className="text-lg text-gray-600 max-w-3xl">
              {category.description}
            </p>
          )}
        </div>

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-lg shadow-sm">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">No products available</p>
            <p className="text-gray-500 text-sm mt-2">
              Check back soon for new items in this category
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product, index) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="group bg-white rounded-lg shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer"
                onClick={() => navigate(`/products/${product._id}`)}
              >
                {/* Product Image */}
                <div className="relative aspect-square overflow-hidden bg-gray-100">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  {product.totalStock === 0 && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="bg-red-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                        Out of Stock
                      </span>
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-[#9B2533] transition-colors">
                    {product.name}
                  </h3>
                  {product.shortDescription && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {product.shortDescription}
                    </p>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-[#9B2533]">
                      ₹{product.price.toLocaleString("en-IN")}
                    </span>
                    {product.totalStock > 0 && product.totalStock <= 5 && (
                      <span className="text-xs text-orange-600 font-medium">
                        Only {product.totalStock} left
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default CategoryPage;
