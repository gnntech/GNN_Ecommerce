import { useState } from "react";
import api from "@/lib/api";
import { toast } from "sonner";
import { Image as ImageIcon, Sparkles } from "lucide-react";

interface SimpleProductFormProps {
    type: "trees" | "bracelets";
    onSuccess: () => void;
    initialData?: any;
    onCancel: () => void;
}

const SimpleProductForm: React.FC<SimpleProductFormProps> = ({
    type,
    onSuccess,
    initialData,
    onCancel,
}) => {
    const [formData, setFormData] = useState({
        name: initialData?.name || "",
        numerology: initialData?.numerology || "",
        shortDescription: initialData?.shortDescription || "",
        meaning: initialData?.meaning || "",
        price: initialData?.price || "",
        buyLink: initialData?.buyLink || "",
        image: null as File | null,
        benefits: initialData?.benefits?.join("\n") || "",
        whoShouldWear: initialData?.whoShouldWear?.join("\n") || "",
        careInstructions: initialData?.careInstructions?.join("\n") || "",
        stock: initialData?.stock ?? 0,
        status: initialData?.status || "active",
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFormData((prev) => ({ ...prev, image: e.target.files![0] }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const data = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            if (key === "benefits" || key === "whoShouldWear" || key === "careInstructions") {
                data.append(key, JSON.stringify(value.split("\n").filter((i: string) => i.trim() !== "")));
            } else if (key === "image" && value) {
                data.append(key, value);
            } else if (key !== "image") {
                data.append(key, value as string);
            }
        });

        try {
            if (initialData) {
                await api.put(`/products/${type}/${initialData._id}`, data);
                toast.success(`Product updated successfully`);
            } else {
                await api.post(`/products/${type}`, data);
                toast.success(`Product created successfully`);
            }
            onSuccess();
        } catch (error: any) {
            let errorMessage = "Something went wrong";
            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (typeof error.response?.data === 'string') {
                errorMessage = error.response.data.includes('<!DOCTYPE html>')
                    ? `Server Error (${error.response.status})`
                    : error.response.data;
            } else if (error.message) {
                errorMessage = error.message;
            }
            toast.error(errorMessage);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8 font-sans max-w-4xl mx-auto pb-10">
            {/* Basic Information */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
                <h3 className="text-lg font-bold text-gray-900 border-b pb-3 flex items-center gap-2">
                    General Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Display Name <small className="text-red-500">*</small></label>
                        <input name="name" placeholder={`e.g. Energy ${type === 'trees' ? 'Tree' : 'Bracelet'}`} value={formData.name} onChange={handleChange} required className="w-full bg-gray-50 p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-500/20 outline-none transition-all" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Price Display</label>
                        <input name="price" placeholder="e.g. ₹1,250" value={formData.price} onChange={handleChange} className="w-full bg-gray-50 p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-500/20 outline-none transition-all" />
                    </div>
                </div>

                {/* Stock & Status row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Stock Quantity</label>
                        <input
                            name="stock"
                            type="number"
                            min="0"
                            placeholder="e.g. 10"
                            value={formData.stock}
                            onChange={handleChange}
                            className="w-full bg-gray-50 p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-500/20 outline-none transition-all"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Product Status</label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                            className="w-full bg-gray-50 p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-500/20 outline-none transition-all"
                        >
                            <option value="active">✅ Active (visible to customers)</option>
                            <option value="out-of-stock">🚫 Out of Stock</option>
                            <option value="inactive">🔒 Inactive (hidden)</option>
                        </select>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        Numerology Significance <Sparkles className="w-3 h-3 text-red-400" />
                    </label>
                    <textarea name="numerology" placeholder="Describe the numerological vibration..." value={formData.numerology} onChange={handleChange} className="w-full bg-gray-50 p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-500/20 outline-none transition-all h-24" />
                </div>
            </div>

            {/* Content & Descriptions */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
                <h3 className="text-lg font-bold text-gray-900 border-b pb-3">Descriptions</h3>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Short Summary</label>
                        <textarea name="shortDescription" placeholder="A brief one-liner for search results..." value={formData.shortDescription} onChange={handleChange} className="w-full bg-gray-50 p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-500/20 outline-none transition-all h-20" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Full Meaning & Vibration</label>
                        <textarea name="meaning" placeholder="Deep dive into properties..." value={formData.meaning} onChange={handleChange} className="w-full bg-gray-50 p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-500/20 outline-none transition-all h-32" />
                    </div>
                </div>
            </div>

            {/* List Details */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
                <h3 className="text-lg font-bold text-gray-900 border-b pb-3">Usage & Benefits</h3>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">Key Benefits <small className="text-gray-400 font-normal">(One per line)</small></label>
                        <textarea name="benefits" value={formData.benefits} onChange={handleChange} className="w-full bg-gray-50 p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-500/20 outline-none transition-all h-24" />
                    </div>
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">Who Is This For? <small className="text-gray-400 font-normal">(One per line)</small></label>
                        <textarea name="whoShouldWear" value={formData.whoShouldWear} onChange={handleChange} className="w-full bg-gray-50 p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-500/20 outline-none transition-all h-24" />
                    </div>
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">Care & Maintenance <small className="text-gray-400 font-normal">(One per line)</small></label>
                        <textarea name="careInstructions" value={formData.careInstructions} onChange={handleChange} className="w-full bg-gray-50 p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-500/20 outline-none transition-all h-24" />
                    </div>
                </div>
            </div>

            {/* Media & Links */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
                <h3 className="text-lg font-bold text-gray-900 border-b pb-3">Media & Shop</h3>
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">External Shop Link</label>
                    <input name="buyLink" placeholder="https://..." value={formData.buyLink} onChange={handleChange} className="w-full bg-gray-50 p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-500/20 outline-none transition-all" />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Product Image</label>
                    <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-all group overflow-hidden relative">
                        {formData.image ? (
                            <div className="absolute inset-0 bg-white z-10">
                                <img src={URL.createObjectURL(formData.image)} alt="Preview" className="w-full h-full object-contain" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity">
                                    <span className="text-sm font-bold">Replace Image</span>
                                </div>
                            </div>
                        ) : initialData?.image ? (
                            <div className="absolute inset-0 bg-white z-10">
                                <img src={initialData.image} alt="Current" className="w-full h-full object-contain" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity">
                                    <span className="text-sm font-bold">Replace Image</span>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <ImageIcon className="w-8 h-8 text-gray-400 mb-3" />
                                <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span></p>
                                <p className="text-xs text-gray-400">PNG, JPG or WEBP</p>
                            </div>
                        )}
                        <input type="file" onChange={handleFileChange} accept="image/*" className="hidden" />
                    </label>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 pt-4">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-8 py-3 text-gray-700 font-medium hover:bg-gray-100 rounded-full transition-all"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="px-10 py-3 bg-red-600 text-white font-bold rounded-full hover:bg-red-700 shadow-lg hover:shadow-red-600/20 transition-all font-display"
                >
                    {initialData ? "Apply Changes" : `Create ${type === 'trees' ? 'Tree' : 'Bracelet'}`}
                </button>
            </div>
        </form>
    );
};

export default SimpleProductForm;
