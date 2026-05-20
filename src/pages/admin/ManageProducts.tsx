import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Edit,
  Trash2,
  ArrowLeft,
  Package,
  Eye,
  Search,
  Filter,
} from "lucide-react";
import api from "@/lib/api";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import ProductStatusBadge from "@/components/ProductStatusBadge";

interface Product {
  _id: string;
  name: string;
  category: string;
  price: number;
  totalStock: number;
  status: string;
  image: string;
  shortDescription?: string;
}

const ManageProducts = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const category = searchParams.get("category") || "all";

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Fetch products
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        all: "true", // Admin view
        limit: "100",
      });

      if (category !== "all") {
        params.set("category", category);
      }

      // Don't filter by status in admin view - show all products
      // if (statusFilter !== "all") {
      //   params.set("status", statusFilter);
      // }

      if (searchQuery) {
        params.set("search", searchQuery);
      }

      console.log('Fetching products with params:', params.toString());
      const { data } = await api.get(`/products?${params.toString()}`);
      console.log('Received products:', data);
      
      const productList = Array.isArray(data) ? data : data.products || [];
      
      // Apply status filter on client side if needed
      const filteredProducts = statusFilter === "all" 
        ? productList 
        : productList.filter((p: Product) => p.status === statusFilter);
      
      setProducts(filteredProducts);
    } catch (error: any) {
      console.error("Failed to fetch products:", error);
      toast.error("Failed to load products");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [category, statusFilter, searchQuery]);

  // Handle delete
  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

    try {
      await api.delete(`/products/${id}`);
      toast.success("Product deleted successfully");
      fetchProducts();
    } catch (error: any) {
      console.error("Failed to delete product:", error);
      toast.error("Failed to delete product");
    }
  };

  // Handle status update
  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      await api.patch(`/products/${id}/status`, { status });
      toast.success(`Product status updated to ${status}`);
      fetchProducts();
    } catch (error: any) {
      console.error("Failed to update status:", error);
      toast.error("Failed to update status");
    }
  };

  const categoryTitle =
    category === "all"
      ? "All Products"
      : category.charAt(0).toUpperCase() + category.slice(1);

  return (
    <div className="min-h-screen bg-[#FDFCF6]">
      <Navbar />
      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/admin/dashboard")}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Package className="w-8 h-8 text-[#9B2533]" />
                {categoryTitle}
              </h1>
              <p className="text-gray-600 mt-1">
                Manage products in this category
              </p>
            </div>
          </div>
          <button
            onClick={() =>
              navigate(
                `/admin/products/create?category=${category !== "all" ? category : ""}`
              )
            }
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
          >
            <Plus className="w-5 h-5" />
            Add Product
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="out-of-stock">Out of Stock</option>
              </select>
            </div>
          </div>
        </div>

        {/* Products List */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-lg shadow-sm">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">No products found</p>
            <p className="text-gray-500 text-sm mt-2">
              Create your first product to get started
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.map((product) => (
                  <tr
                    key={product._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-12 h-12 rounded-lg object-cover mr-3"
                        />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {product.name}
                          </div>
                          {product.shortDescription && (
                            <div className="text-sm text-gray-500 truncate max-w-xs">
                              {product.shortDescription}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 capitalize">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      ₹{product.price.toLocaleString("en-IN")}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {product.totalStock}
                    </td>
                    <td className="px-6 py-4">
                      <ProductStatusBadge
                        status={product.status as any}
                        stock={product.totalStock}
                        size="sm"
                      />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() =>
                            navigate(`/products/${product._id}`)
                          }
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          title="View Product"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() =>
                            navigate(`/admin/products/edit/${product._id}`)
                          }
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit Product"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() =>
                            handleDelete(product._id, product.name)
                          }
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>

                        {/* Status Quick Actions */}
                        <div className="relative group">
                          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                            <Filter className="w-4 h-4" />
                          </button>
                          <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                            <div className="py-1">
                              <button
                                onClick={() =>
                                  handleStatusUpdate(product._id, "active")
                                }
                                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              >
                                Mark Active
                              </button>
                              <button
                                onClick={() =>
                                  handleStatusUpdate(product._id, "inactive")
                                }
                                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              >
                                Mark Inactive
                              </button>
                              <button
                                onClick={() =>
                                  handleStatusUpdate(
                                    product._id,
                                    "out-of-stock"
                                  )
                                }
                                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              >
                                Mark Out of Stock
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageProducts;
