import { useState, useEffect } from "react";
import api from "@/lib/api";
import Navbar from "@/components/Navbar";
import SimpleProductForm from "@/components/admin/SimpleProductForm";
import { Trash2, Edit3, Plus, ArrowLeft, Trees as TreeIcon } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

const STATUS_STYLES: Record<string, string> = {
  active:        "bg-green-100 text-green-700",
  "out-of-stock":"bg-red-100 text-red-700",
  inactive:      "bg-gray-100 text-gray-500",
};
const STATUS_LABELS: Record<string, string> = {
  active: "Active", "out-of-stock": "Out of Stock", inactive: "Inactive",
};

const ManageTrees = () => {
    const [trees, setTrees] = useState<any[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [currentTree, setCurrentTree] = useState<any>(null);

    const fetchTrees = async () => {
        try {
            const { data } = await api.get("/products/trees?all=true");
            setTrees(data);
        } catch (error) {
            console.error("Failed to fetch trees", error);
        }
    };

    useEffect(() => {
        fetchTrees();
    }, []);

    const handleDelete = async (id: string) => {
        if (window.confirm("Delete this energy tree from inventory? This cannot be undone.")) {
            try {
                await api.delete(`/products/trees/${id}`);
                toast.success("Tree record removed");
                fetchTrees();
            } catch (error) {
                toast.error("Failed to delete record");
            }
        }
    };

    const handleStatusChange = async (id: string, status: string) => {
        try {
            const formData = new FormData();
            formData.append("status", status);
            await api.put(`/products/trees/${id}`, formData);
            toast.success(`Status updated to ${STATUS_LABELS[status]}`);
            fetchTrees();
        } catch {
            toast.error("Failed to update status");
        }
    };

    const handleEdit = (tree: any) => {
        setCurrentTree(tree);
        setIsEditing(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCreate = () => {
        setCurrentTree(null);
        setIsEditing(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSuccess = () => {
        setIsEditing(false);
        fetchTrees();
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
                                <TreeIcon className="w-8 h-8 text-green-700" />
                                {isEditing ? (currentTree ? "Update Tree" : "Add New Tree") : "Crystal Tree Inventory"}
                            </h1>
                            <p className="text-gray-500 mt-1">Manage your collection of energy-balancing crystal trees.</p>
                        </div>
                    </div>
                    {!isEditing && (
                        <button onClick={handleCreate} className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-full hover:bg-red-700 shadow-xl transition-all font-bold">
                            <Plus className="w-5 h-5" /> Add New Tree
                        </button>
                    )}
                </div>

                <AnimatePresence mode="wait">
                    {isEditing ? (
                        <motion.div key="form" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                            <SimpleProductForm
                                type="trees"
                                onSuccess={handleSuccess}
                                initialData={currentTree}
                                onCancel={() => setIsEditing(false)}
                            />
                        </motion.div>
                    ) : (
                        <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {trees.map((tree) => (
                                <motion.div layout key={tree._id} className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-6 flex flex-col gap-6 group hover:shadow-xl transition-all duration-300">
                                    <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-gray-50 relative">
                                        <img src={tree.image} alt={tree.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                        <div className="absolute top-4 right-4 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-bold text-red-600 shadow-sm">
                                            {tree.price || "Check Price"}
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between gap-2">
                                            <h3 className="font-bold text-2xl text-gray-900 uppercase tracking-tight">{tree.name}</h3>
                                            <span className={`text-xs font-semibold px-2 py-1 rounded-full shrink-0 ${STATUS_STYLES[tree.status] || STATUS_STYLES.inactive}`}>
                                                {STATUS_LABELS[tree.status] || tree.status}
                                            </span>
                                        </div>
                                        <p className="text-gray-500 text-sm line-clamp-2 leading-relaxed">{tree.numerology}</p>
                                        <p className="text-xs text-gray-400">Stock: <span className="font-semibold text-gray-700">{tree.stock ?? 0}</span></p>
                                    </div>
                                    <div className="flex gap-3 mt-auto pt-4 border-t border-gray-50">
                                        <select
                                            value={tree.status || "active"}
                                            onChange={(e) => handleStatusChange(tree._id, e.target.value)}
                                            className="flex-1 text-xs border border-gray-200 rounded-xl px-2 py-2 bg-white focus:outline-none focus:border-red-400"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <option value="active">✅ Active</option>
                                            <option value="out-of-stock">🚫 Out of Stock</option>
                                            <option value="inactive">🔒 Inactive</option>
                                        </select>
                                        <button onClick={() => handleEdit(tree)} className="px-4 py-2 bg-gray-900 text-white rounded-xl hover:bg-gray-800 flex items-center gap-1 transition-all font-medium text-sm">
                                            <Edit3 className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => handleDelete(tree._id)} className="px-4 py-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all">
                                            <Trash2 className="w-4 h-4" />
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

export default ManageTrees;
