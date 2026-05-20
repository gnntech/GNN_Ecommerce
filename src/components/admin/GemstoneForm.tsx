import { useState } from "react";
import api from "@/lib/api";
import { toast } from "sonner";
import { ChevronDown, ChevronUp, Image as ImageIcon, HelpCircle } from "lucide-react";

interface GemstoneFormProps {
    onSuccess: () => void;
    initialData?: any;
    onCancel: () => void;
}

const GemstoneForm: React.FC<GemstoneFormProps> = ({
    onSuccess,
    initialData,
    onCancel,
}) => {
    const [formData, setFormData] = useState({
        name: initialData?.name || "",
        shortDescription: initialData?.shortDescription || "",
        meaning: initialData?.meaning || "",
        color: initialData?.color || "",
        colorClass: initialData?.colorClass || "",
        glowClass: initialData?.glowClass || "",
        zodiac: initialData?.zodiac || "",
        rarity: initialData?.rarity || "",
        hardness: initialData?.hardness || "",
        chakra: initialData?.chakra || "",
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
            const storedUser = localStorage.getItem("adminUser");
            const token = storedUser ? JSON.parse(storedUser).token : "";
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };

            if (initialData) {
                await api.put(`/products/gemstones/${initialData._id}`, data, config);
                toast.success("Gemstone updated successfully");
            } else {
                await api.post("/products/gemstones", data, config);
                toast.success("Gemstone created successfully");
            }
            onSuccess();
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Something went wrong");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8 font-sans max-w-4xl mx-auto pb-10">
            {/* Basic Information Section */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
                <h3 className="text-lg font-bold text-gray-900 border-b pb-3">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Display Name <small className="text-red-500">*</small></label>
                        <input name="name" placeholder="e.g. Natural Blue Sapphire" value={formData.name} onChange={handleChange} required className="w-full bg-gray-50 p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-500/20 outline-none transition-all" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Price</label>
                        <input name="price" placeholder="e.g. ₹1,25,000" value={formData.price} onChange={handleChange} className="w-full bg-gray-50 p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-500/20 outline-none transition-all" />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Short Description</label>
                    <textarea name="shortDescription" placeholder="A brief summary for the catalog..." value={formData.shortDescription} onChange={handleChange} className="w-full bg-gray-50 p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-500/20 outline-none transition-all h-24" />
                </div>

                {/* Stock & Status */}
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
            </div>

            {/* Spiritual & Physical Properties Section */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
                <h3 className="text-lg font-bold text-gray-900 border-b pb-3">Properties & Attributes</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Base Color</label>
                        <input name="color" placeholder="e.g. Deep Blue" value={formData.color} onChange={handleChange} className="w-full bg-gray-50 p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-500/20 outline-none transition-all" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Zodiac Sign</label>
                        <input name="zodiac" placeholder="e.g. Capricorn" value={formData.zodiac} onChange={handleChange} className="w-full bg-gray-50 p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-500/20 outline-none transition-all" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                            Associated Chakra <HelpCircle className="w-3 h-3 text-gray-400" />
                        </label>
                        <input name="chakra" placeholder="e.g. Throat" value={formData.chakra} onChange={handleChange} className="w-full bg-gray-50 p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-500/20 outline-none transition-all" />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Hardness</label>
                        <input name="hardness" placeholder="e.g. 9.0" value={formData.hardness} onChange={handleChange} className="w-full bg-gray-50 p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-500/20 outline-none transition-all" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Rarity Level</label>
                        <input name="rarity" placeholder="e.g. Highly Rare" value={formData.rarity} onChange={handleChange} className="w-full bg-gray-50 p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-500/20 outline-none transition-all" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Purchase Link</label>
                        <input name="buyLink" placeholder="External shop URL" value={formData.buyLink} onChange={handleChange} className="w-full bg-gray-50 p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-500/20 outline-none transition-all" />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Spiritual Meaning</label>
                    <textarea name="meaning" placeholder="Detail the deeper meaning and vibrations..." value={formData.meaning} onChange={handleChange} className="w-full bg-gray-50 p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-500/20 outline-none transition-all h-32" />
                </div>
            </div>

            {/* Detailed Lists Section */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
                <h3 className="text-lg font-bold text-gray-900 border-b pb-3">Detailed Information</h3>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">Benefits <small className="text-gray-400 font-normal">(One per line)</small></label>
                        <textarea name="benefits" value={formData.benefits} onChange={handleChange} className="w-full bg-gray-50 p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-500/20 outline-none transition-all h-24" />
                    </div>
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">Who Should Wear <small className="text-gray-400 font-normal">(One per line)</small></label>
                        <textarea name="whoShouldWear" value={formData.whoShouldWear} onChange={handleChange} className="w-full bg-gray-50 p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-500/20 outline-none transition-all h-24" />
                    </div>
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">Care Instructions <small className="text-gray-400 font-normal">(One per line)</small></label>
                        <textarea name="careInstructions" value={formData.careInstructions} onChange={handleChange} className="w-full bg-gray-50 p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-500/20 outline-none transition-all h-24" />
                    </div>
                </div>
            </div>

            {/* Media Section */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
                <h3 className="text-lg font-bold text-gray-900 border-b pb-3">Product Media</h3>
                <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-all group overflow-hidden relative">
                        {formData.image ? (
                            <div className="absolute inset-0 flex items-center justify-center bg-gray-900/40 text-white opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                <span className="text-sm font-medium">Change Image</span>
                            </div>
                        ) : null}

                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <ImageIcon className="w-8 h-8 text-gray-400 mb-3" />
                            <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                            <p className="text-xs text-gray-400">PNG, JPG or WEBP (MAX. 800x800px)</p>
                        </div>
                        <input type="file" onChange={handleFileChange} accept="image/*" className="hidden" />

                        {formData.image && (
                            <div className="absolute inset-0 bg-white">
                                <img src={URL.createObjectURL(formData.image)} alt="Preview" className="w-full h-full object-contain" />
                            </div>
                        )}
                        {initialData?.image && !formData.image && (
                            <div className="absolute inset-0 bg-white">
                                <img src={initialData.image} alt="Preview" className="w-full h-full object-contain" />
                            </div>
                        )}
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
                    className="px-10 py-3 bg-red-600 text-white font-bold rounded-full hover:bg-red-700 shadow-lg hover:shadow-red-600/20 transition-all"
                >
                    {initialData ? "Update Gemstone" : "Create Gemstone"}
                </button>
            </div>
        </form>
    );
};

export default GemstoneForm;
