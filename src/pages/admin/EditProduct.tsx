import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Save, Upload, X } from "lucide-react";
import api from "@/lib/api";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";

interface Category {
  _id: string;
  name: string;
  slug: string;
}

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>("");

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    totalStock: "",
    status: "active",
    shortDescription: "",
    description: "",
    numerology: "",
    meaning: "",
    benefits: "",
    whoShouldWear: "",
    careInstructions: "",
    image: null as File | null,
    currentImage: "",
  });

  // Fetch product and categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productRes, categoriesRes] = await Promise.all([
          api.get(`/products/${id}`),
          api.get("/categories"),
        ]);

        const product = productRes.data;
        setCategories(categoriesRes.data);

        setFormData({
          name: product.name || "",
          category: product.category || "",
          price: product.price?.toString() || "",
          totalStock: (product.stock || product.totalStock || 0).toString(),
          status: product.status || "active",
          shortDescription: product.shortDescription || "",
          description: product.description || "",
          numerology: product.numerology || "",
          meaning: product.meaning || "",
          benefits: Array.isArray(product.benefits)
            ? product.benefits.join("\n")
            : "",
          whoShouldWear: Array.isArray(product.whoShouldWear)
            ? product.whoShouldWear.join("\n")
            : "",
          careInstructions: Array.isArray(product.careInstructions)
            ? product.careInstructions.join("\n")
            : "",
          image: null,
          currentImage: product.image || "",
        });

        if (product.image) {
          setImagePreview(product.image);
        }
      } catch (error: any) {
        console.error("Failed to fetch product:", error);
        toast.error("Failed to load product");
        navigate("/admin/products");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      console.log('=== EDIT PRODUCT SUBMIT ===');
      console.log('Form data:', formData);
      
      const data = new FormData();
      data.append("name", formData.name);
      data.append("category", formData.category);
      data.append("price", formData.price);
      data.append("stock", formData.totalStock); // Use 'stock' not 'totalStock'
      data.append("status", formData.status);
      
      console.log('Sending stock value:', formData.totalStock);

      if (formData.shortDescription)
        data.append("shortDescription", formData.shortDescription);
      if (formData.description)
        data.append("description", formData.description);
      if (formData.numerology) data.append("numerology", formData.numerology);
      if (formData.meaning) data.append("meaning", formData.meaning);

      // Handle array fields
      if (formData.benefits) {
        const benefitsArray = formData.benefits
          .split("\n")
          .filter((b) => b.trim());
        data.append("benefits", JSON.stringify(benefitsArray));
      }
      if (formData.whoShouldWear) {
        const whoArray = formData.whoShouldWear
          .split("\n")
          .filter((w) => w.trim());
        data.append("whoShouldWear", JSON.stringify(whoArray));
      }
      if (formData.careInstructions) {
        const careArray = formData.careInstructions
          .split("\n")
          .filter((c) => c.trim());
        data.append("careInstructions", JSON.stringify(careArray));
      }

      if (formData.image) {
        data.append("image", formData.image);
      }

      await api.put(`/products/${id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log('Update successful!');
      toast.success("Product updated successfully!");
      navigate(`/admin/products?category=${formData.category}`);
    } catch (error: any) {
      console.error("Failed to update product:", error);
      console.error("Error response:", error.response);
      toast.error(
        error.response?.data?.message || "Failed to update product"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFCF6] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFCF6]">
      <Navbar />
      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Edit Product</h1>
            <p className="text-gray-600 mt-1">Update product information</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Basic Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter product name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat.slug}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price (₹) *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stock Quantity *
                </label>
                <input
                  type="number"
                  name="totalStock"
                  value={formData.totalStock}
                  onChange={handleChange}
                  required
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Products with 0 stock will be marked as out-of-stock
                </p>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status *
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="out-of-stock">Out of Stock</option>
                </select>
              </div>
            </div>
          </div>

          {/* Descriptions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Descriptions
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Short Description
                </label>
                <textarea
                  name="shortDescription"
                  value={formData.shortDescription}
                  onChange={handleChange}
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Brief description for listings"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Detailed product description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Numerology
                </label>
                <textarea
                  name="numerology"
                  value={formData.numerology}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Numerological significance"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meaning
                </label>
                <textarea
                  name="meaning"
                  value={formData.meaning}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Spiritual or symbolic meaning"
                />
              </div>
            </div>
          </div>

          {/* Additional Details */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Additional Details
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Benefits (one per line)
                </label>
                <textarea
                  name="benefits"
                  value={formData.benefits}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Benefit 1&#10;Benefit 2&#10;Benefit 3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Who Should Wear (one per line)
                </label>
                <textarea
                  name="whoShouldWear"
                  value={formData.whoShouldWear}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Recommendation 1&#10;Recommendation 2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Care Instructions (one per line)
                </label>
                <textarea
                  name="careInstructions"
                  value={formData.careInstructions}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Instruction 1&#10;Instruction 2"
                />
              </div>
            </div>
          </div>

          {/* Image Upload */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Product Image
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                  {imagePreview ? (
                    <div className="relative w-full h-full">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-contain rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          setImagePreview("");
                          setFormData((prev) => ({ ...prev, image: null }));
                        }}
                        className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-12 h-12 text-gray-400 mb-3" />
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Click to upload</span>{" "}
                        or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">
                        PNG, JPG or WEBP (MAX. 5MB)
                      </p>
                    </div>
                  )}
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProduct;
