import { useState, useEffect } from "react";
import api from "@/lib/api";
import Navbar from "@/components/Navbar";
import GemstoneForm from "@/components/admin/GemstoneForm";
import { Trash2, Edit3, Plus, ArrowLeft, Gem } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

const ManageGemstones = () => {
    const [gemstones, setGemstones] = useState<any[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [currentGemstone, setCurrentGemstone] = useState<any>(null);

    const fetchGemstones = async () => {
        try {
            const { data } = await api.get("/products/gemstones");
            setGemstones(data);
        } catch (error) {
            console.error("Failed to fetch gemstones", error);
        }
    };

    useEffect(() => {
        fetchGemstones();
    }, []);

    const handleDelete = async (id: string) => {
        if (window.confirm("Are you sure you want to delete this gemstone inventory? This action cannot be undone.")) {
            try {
                await api.delete(`/products/gemstones/${id}`);
                toast.success("Gemstone record removed");
                fetchGemstones();
            } catch (error) {
                toast.error("Failed to delete record");
            }
        }
    };

    const handleEdit = (gemstone: any) => {
        setCurrentGemstone(gemstone);
        setIsEditing(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCreate = () => {
        setCurrentGemstone(null);
        setIsEditing(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSuccess = () => {
        setIsEditing(false);
        fetchGemstones();
    };

    return (
        <div className="min-h-screen bg-[#FDFCF6]">
            <Navbar />
            <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                {/* Navigation & Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                    <div className="flex items-center gap-4">
                        {isEditing && (
                            <button
                                onClick={() => setIsEditing(false)}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <ArrowLeft className="w-6 h-6 text-gray-600" />
                            </button>
                        )}
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                                <Gem className="w-8 h-8 text-red-600" />
                                {isEditing ? (currentGemstone ? "Edit Details" : "Add New Gemstone") : "Gemstone Inventory"}
                            </h1>
                            <p className="text-gray-500 mt-1">
                                {isEditing ? "Fill in the details below to update your catalog." : "Maintain and manage your collection of healing gemstones."}
                            </p>
                        </div>
                    </div>

                    {!isEditing && (
                        <button
                            onClick={handleCreate}
                            className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-full hover:bg-red-700 transition-all shadow-lg hover:shadow-red-600/20 font-bold"
                        >
                            <Plus className="w-5 h-5" /> Add New Gemstone
                        </button>
                    )}
                </div>

                <AnimatePresence mode="wait">
                    {isEditing ? (
                        <motion.div
                            key="form"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            <div className="bg-transparent mb-8">
                                <GemstoneForm
                                    onSuccess={handleSuccess}
                                    initialData={currentGemstone}
                                    onCancel={() => setIsEditing(false)}
                                />
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="list"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                        >
                            {gemstones.map((gemstone) => (
                                <motion.div
                                    layout
                                    key={gemstone._id}
                                    className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-6 flex flex-col gap-6 group hover:shadow-xl transition-all duration-300"
                                >
                                    <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-gray-50 relative">
                                        <img
                                            src={gemstone.image}
                                            alt={gemstone.name}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <div className="absolute top-4 right-4 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-bold text-red-600 shadow-sm">
                                            {gemstone.price || "Contact for Price"}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <h3 className="font-bold text-2xl text-gray-900 group-hover:text-red-700 transition-colors uppercase tracking-tight">{gemstone.name}</h3>
                                        <p className="text-gray-500 text-sm line-clamp-2 leading-relaxed">{gemstone.shortDescription}</p>
                                    </div>

                                    <div className="flex gap-3 mt-auto pt-4 border-t border-gray-50">
                                        <button
                                            onClick={() => handleEdit(gemstone)}
                                            className="flex-1 px-4 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 flex items-center justify-center gap-2 transition-all font-medium"
                                        >
                                            <Edit3 className="w-4 h-4" /> Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(gemstone._id)}
                                            className="px-4 py-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 flex items-center justify-center transition-all"
                                            title="Delete Gemstone"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}

                            {gemstones.length === 0 && (
                                <div className="col-span-full py-32 text-center bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200">
                                    <Gem className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                    <h3 className="text-xl font-bold text-gray-400">No gemstones in your collection yet</h3>
                                    <button onClick={handleCreate} className="mt-4 text-red-600 font-bold hover:underline">Click here to add your first one</button>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default ManageGemstones;
