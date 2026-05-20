import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ShoppingCart, Package } from "lucide-react";
import api from "@/lib/api";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";

interface Product {
  _id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  shortDescription?: string;
  description?: string;
  numerology?: string;
  meaning?: string;
  benefits?: string[];
  whoShouldWear?: string[];
  careInstructions?: string[];
  status: string;
  totalStock: number;
  isInStock: boolean;
}

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;

      setLoading(true);
      try {
        const { data } = await api.get(`/products/${id}`);
        setProduct(data);
      } catch (error: any) {
        console.error("Failed to fetch product:", error);
        toast.error("Failed to load product");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, navigate]);

  const handleAddToCart = () => {
    if (!product) return;
    
    addToCart({
      id: product._id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
    });
    
    toast.success("Added to cart!");
  };

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

  if (!product) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#FDFCF6]">
      <Navbar />
      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-[#9B2533] transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        {/* Product Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-white shadow-lg">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {!product.isInStock && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="bg-red-500 text-white px-6 py-3 rounded-full text-lg font-semibold">
                  Out of Stock
                </span>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <div className="mb-6">
              <span className="inline-block px-3 py-1 bg-[#9B2533]/10 text-[#9B2533] rounded-full text-sm font-medium mb-4 capitalize">
                {product.category}
              </span>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>
              {product.shortDescription && (
                <p className="text-lg text-gray-600 mb-6">
                  {product.shortDescription}
                </p>
              )}
              <div className="text-3xl font-bold text-[#9B2533] mb-6">
                ₹{product.price.toLocaleString("en-IN")}
              </div>
            </div>

            {/* Add to Cart */}
            <div className="mb-8">
              <button
                onClick={handleAddToCart}
                disabled={!product.isInStock}
                className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-[#9B2533] text-white rounded-full text-lg font-semibold hover:bg-[#7a1d28] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                <ShoppingCart className="w-5 h-5" />
                {product.isInStock ? "Add to Cart" : "Out of Stock"}
              </button>
              {product.isInStock && product.totalStock <= 5 && (
                <p className="text-orange-600 text-sm mt-2 text-center">
                  Only {product.totalStock} left in stock!
                </p>
              )}
            </div>

            {/* Product Details Sections */}
            <div className="space-y-6">
              {product.description && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-3">
                    Description
                  </h2>
                  <p className="text-gray-700 leading-relaxed">
                    {product.description}
                  </p>
                </div>
              )}

              {product.numerology && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-3">
                    Numerology
                  </h2>
                  <p className="text-gray-700 leading-relaxed">
                    {product.numerology}
                  </p>
                </div>
              )}

              {product.meaning && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-3">
                    Meaning
                  </h2>
                  <p className="text-gray-700 leading-relaxed">
                    {product.meaning}
                  </p>
                </div>
              )}

              {product.benefits && product.benefits.length > 0 && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-3">
                    Benefits
                  </h2>
                  <ul className="space-y-2">
                    {product.benefits.map((benefit, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-2 text-gray-700"
                      >
                        <span className="text-[#9B2533] mt-1">•</span>
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {product.whoShouldWear && product.whoShouldWear.length > 0 && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-3">
                    Who Should Wear
                  </h2>
                  <ul className="space-y-2">
                    {product.whoShouldWear.map((item, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-2 text-gray-700"
                      >
                        <span className="text-[#9B2533] mt-1">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {product.careInstructions &&
                product.careInstructions.length > 0 && (
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-3">
                      Care Instructions
                    </h2>
                    <ul className="space-y-2">
                      {product.careInstructions.map((instruction, index) => (
                        <li
                          key={index}
                          className="flex items-start gap-2 text-gray-700"
                        >
                          <span className="text-[#9B2533] mt-1">•</span>
                          <span>{instruction}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductDetail;
