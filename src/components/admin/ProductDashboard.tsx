import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Package, 
  TrendingUp, 
  AlertTriangle, 
  Eye, 
  Edit, 
  Trash2,
  Plus,
  Filter,
  Search,
  MoreVertical,
  CheckCircle,
  XCircle,
  Clock
} from "lucide-react";
import api from "@/lib/api";
import { Product, ProductAnalytics, ProductStatus } from "@/types/collection";
import ProductStatusBadge from "../ProductStatusBadge";

const ProductDashboard = () => {
  const [analytics, setAnalytics] = useState<ProductAnalytics | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<ProductStatus | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch analytics data
  const fetchAnalytics = async () => {
    try {
      const { data } = await api.get("/products/analytics/dashboard");
      setAnalytics(data);
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
    }
  };

  // Fetch products with filters
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        all: "true", // Admin view
        limit: "50"
      });
      
      if (statusFilter !== "all") {
        params.set("status", statusFilter);
      }
      
      if (searchQuery) {
        params.set("search", searchQuery);
      }

      const { data } = await api.get(`/products?${params.toString()}`);
      setProducts(Array.isArray(data) ? data : data.products || []);
    } catch (error) {
      console.error("Failed to fetch products:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
    fetchProducts();
  }, [statusFilter, searchQuery]);

  // Handle bulk status update
  const handleBulkStatusUpdate = async (status: ProductStatus) => {
    if (selectedProducts.length === 0) return;

    try {
      console.log('Bulk updating products:', { productIds: selectedProducts, status });
      const response = await api.post("/products/bulk/update-status", {
        productIds: selectedProducts,
        status
      });
      console.log('Bulk update response:', response.data);
      
      setSelectedProducts([]);
      fetchProducts();
      fetchAnalytics();
    } catch (error: any) {
      console.error("Failed to update product status:", error);
      console.error("Error response:", error.response?.data);
      alert(`Failed to bulk update products: ${error.response?.data?.message || error.message}`);
    }
  };

  // Handle individual product status update
  const handleStatusUpdate = async (productId: string, status: ProductStatus) => {
    try {
      console.log('Updating product status:', { productId, status });
      const response = await api.patch(`/products/${productId}/status`, { status });
      console.log('Status update response:', response.data);
      fetchProducts();
      fetchAnalytics();
    } catch (error: any) {
      console.error("Failed to update product status:", error);
      console.error("Error response:", error.response?.data);
      alert(`Failed to update product status: ${error.response?.data?.message || error.message}`);
    }
  };

  // Handle product deletion
  const handleDeleteProduct = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      await api.delete(`/products/${productId}`);
      fetchProducts();
      fetchAnalytics();
    } catch (error) {
      console.error("Failed to delete product:", error);
    }
  };

  const getStatusIcon = (status: ProductStatus) => {
    switch (status) {
      case "active": return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "inactive": return <Clock className="w-4 h-4 text-yellow-600" />;
      case "out-of-stock": return <XCircle className="w-4 h-4 text-red-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Analytics Cards */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Products</p>
                <p className="text-2xl font-bold text-gray-900">
                  {analytics.overview.totalProducts}
                </p>
              </div>
              <Package className="w-8 h-8 text-blue-600" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Products</p>
                <p className="text-2xl font-bold text-green-600">
                  {analytics.overview.activeProducts}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Out of Stock</p>
                <p className="text-2xl font-bold text-red-600">
                  {analytics.overview.outOfStockProducts}
                </p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Low Stock</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {analytics.lowStockProducts.length}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-yellow-600" />
            </div>
          </motion.div>
        </div>
      )}

      {/* Product Management */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Product Management</h2>
              <p className="text-sm text-gray-600">Manage your product inventory and status</p>
            </div>

            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Plus className="w-4 h-4" />
              Add Product
            </button>
          </div>

          {/* Filters and Search */}
          <div className="mt-4 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as ProductStatus | "all")}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="out-of-stock">Out of Stock</option>
            </select>
          </div>

          {/* Bulk Actions */}
          {selectedProducts.length > 0 && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between">
                <span className="text-sm text-blue-800">
                  {selectedProducts.length} product(s) selected
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleBulkStatusUpdate("active")}
                    className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Activate
                  </button>
                  <button
                    onClick={() => handleBulkStatusUpdate("inactive")}
                    className="px-3 py-1 text-xs bg-yellow-600 text-white rounded hover:bg-yellow-700"
                  >
                    Deactivate
                  </button>
                  <button
                    onClick={() => handleBulkStatusUpdate("out-of-stock")}
                    className="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Mark Out of Stock
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Product Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedProducts.length === products.length && products.length > 0}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedProducts(products.map(p => p._id!));
                      } else {
                        setSelectedProducts([]);
                      }
                    }}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td colSpan={7} className="px-6 py-4">
                      <div className="animate-pulse flex space-x-4">
                        <div className="rounded-full bg-gray-200 h-4 w-4"></div>
                        <div className="flex-1 space-y-2 py-1">
                          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    No products found
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedProducts.includes(product._id!)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedProducts([...selectedProducts, product._id!]);
                          } else {
                            setSelectedProducts(selectedProducts.filter(id => id !== product._id));
                          }
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-10 h-10 rounded-lg object-cover mr-3"
                        />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {product.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {product.shortDescription}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 capitalize">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      ₹{product.price.toLocaleString('en-IN')}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div className="flex items-center gap-2">
                        <span>{product.totalStock}</span>
                        {product.totalStock <= product.lowStockThreshold! && (
                          <AlertTriangle className="w-4 h-4 text-yellow-500" />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <ProductStatusBadge 
                        status={product.status} 
                        stock={product.totalStock}
                        size="sm"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {/* Handle view */}}
                          className="p-1 text-gray-400 hover:text-gray-600"
                          title="View Product"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {/* Handle edit */}}
                          className="p-1 text-gray-400 hover:text-gray-600"
                          title="Edit Product"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product._id!)}
                          className="p-1 text-gray-400 hover:text-red-600"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        
                        {/* Status Quick Actions */}
                        <div className="relative group">
                          <button className="p-1 text-gray-400 hover:text-gray-600">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                          <div className="absolute right-0 top-6 w-48 bg-white rounded-md shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                            <div className="py-1">
                              <button
                                onClick={() => handleStatusUpdate(product._id!, "active")}
                                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              >
                                <CheckCircle className="w-4 h-4 text-green-600" />
                                Mark Active
                              </button>
                              <button
                                onClick={() => handleStatusUpdate(product._id!, "inactive")}
                                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              >
                                <Clock className="w-4 h-4 text-yellow-600" />
                                Mark Inactive
                              </button>
                              <button
                                onClick={() => handleStatusUpdate(product._id!, "out-of-stock")}
                                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              >
                                <XCircle className="w-4 h-4 text-red-600" />
                                Mark Out of Stock
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Low Stock Alert */}
      {analytics && analytics.lowStockProducts.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600" />
            <h3 className="font-medium text-yellow-800">Low Stock Alert</h3>
          </div>
          <div className="space-y-2">
            {analytics.lowStockProducts.slice(0, 5).map((product) => (
              <div key={product._id} className="flex items-center justify-between text-sm">
                <span className="text-yellow-800">{product.name}</span>
                <span className="text-yellow-600">
                  {product.totalStock} left (threshold: {product.lowStockThreshold})
                </span>
              </div>
            ))}
            {analytics.lowStockProducts.length > 5 && (
              <p className="text-sm text-yellow-600">
                +{analytics.lowStockProducts.length - 5} more products with low stock
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDashboard;