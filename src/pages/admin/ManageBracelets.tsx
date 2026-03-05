import { useState, useEffect } from "react";
import api from "@/lib/api";
import Navbar from "@/components/Navbar";
import SimpleProductForm from "@/components/admin/SimpleProductForm";
import { Trash2, Edit3, Plus, ArrowLeft, Watch } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

const ManageBracelets = () => {
    const [bracelets, setBracelets] = useState<any[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [currentBracelet, setCurrentBracelet] = useState<any>(null);

    const fetchBracelets = async () => {
        try {
            const { data } = await api.get("/products/bracelets");
            setBracelets(data);
        } catch (error) {
            console.error("Failed to fetch bracelets", error);
        }
    };

    useEffect(() => {
        fetchBracelets();
    }, []);

    const handleDelete = async (id: string) => {
        if (window.confirm("Remove this handcrafted bracelet from your catalog? This cannot be undone.")) {
            try {
                await api.delete(`/products/bracelets/${id}`);
                toast.success("Bracelet removed");
                fetchBracelets();
            } catch (error) {
                toast.error("Failed to delete record");
            }
        }
    };

    const handleEdit = (bracelet: any) => {
        setCurrentBracelet(bracelet);
        setIsEditing(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCreate = () => {
        setCurrentBracelet(null);
        setIsEditing(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSuccess = () => {
        setIsEditing(false);
        fetchBracelets();
    };

    return (
        <div className="min-h-screen bg-[#FDFCF6]">
            <Navbar />
            <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                    <div className="flex items-center gap-4">
                        {isEditing && (
                            <button onClick={() => setIsEditing(false)} className="p-2 hover:bg-gray-100 rounded-full">
                                <ArrowLeft className="w-6 h-6 text-gray-600" />
                            </button>
                        )}
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                                <Watch className="w-8 h-8 text-amber-700" />
                                {isEditing ? (currentBracelet ? "Update Design" : "New Bracelet Design") : "Bracelet Inventory"}
                            </h1>
                            <p className="text-gray-500 mt-1">Manage your catalog of handcrafted medicinal and energy bracelets.</p>
                        </div>
                    </div>
                    {!isEditing && (
                        <button onClick={handleCreate} className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-full hover:bg-red-700 shadow-xl transition-all font-bold">
                            <Plus className="w-5 h-5" /> Add Design
                        </button>
                    )}
                </div>

                <AnimatePresence mode="wait">
                    {isEditing ? (
                        <motion.div key="form" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                            <SimpleProductForm
                                type="bracelets"
                                onSuccess={handleSuccess}
                                initialData={currentBracelet}
                                onCancel={() => setIsEditing(false)}
                            />
                        </motion.div>
                    ) : (
                        <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {bracelets.map((bracelet) => (
                                <motion.div layout key={bracelet._id} className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-6 flex flex-col gap-6 group hover:shadow-xl transition-all duration-300">
                                    <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-gray-50 relative">
                                        <img src={bracelet.image} alt={bracelet.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                        <div className="absolute top-4 right-4 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-bold text-red-600 shadow-sm">
                                            {bracelet.price || "Check Price"}
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="font-bold text-2xl text-gray-900 uppercase tracking-tight">{bracelet.name}</h3>
                                        <p className="text-gray-500 text-sm line-clamp-2 leading-relaxed">{bracelet.numerology}</p>
                                    </div>
                                    <div className="flex gap-3 mt-auto pt-4 border-t border-gray-50">
                                        <button onClick={() => handleEdit(bracelet)} className="flex-1 px-4 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 flex items-center justify-center gap-2 transition-all font-medium">
                                            <Edit3 className="w-4 h-4" /> Edit Design
                                        </button>
                                        <button onClick={() => handleDelete(bracelet._id)} className="px-4 py-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all">
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default ManageBracelets;
