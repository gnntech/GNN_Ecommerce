import React, { useState, useEffect } from "react";
import { Layers, Trash2, Edit3, Plus, ArrowLeft, Link as LinkIcon, Save, X, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";
import Navbar from "@/components/Navbar";
import { motion, AnimatePresence } from "framer-motion";

const ManageCollections = () => {
    const [collections, setCollections] = useState<any[]>([]);
    const [formData, setFormData] = useState({ title: "", description: "", image: "", link: "", order: 0, file: null as File | null });
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    useEffect(() => { fetchCollections(); }, []);

    const fetchCollections = async () => {
        try {
            const { data } = await api.get("/content/collections");
            setCollections(data);
        } catch (error) { console.error(error); }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFormData(prev => ({ ...prev, file: e.target.files![0] }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const data = new FormData();
        data.append("title", formData.title);
        data.append("description", formData.description);
        data.append("link", formData.link);
        data.append("order", formData.order.toString());

        if (formData.file) {
            data.append("image", formData.file);
        } else if (formData.image) {
            data.append("image", formData.image);
        }

        try {
            const storedUser = localStorage.getItem("adminUser");
            const token = storedUser ? JSON.parse(storedUser).token : "";
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };

            if (editingId) {
                await api.put(`/content/collections/${editingId}`, data, config);
                toast.success("Collection updated successfully");
            } else {
                await api.post("/content/collections", data, config);
                toast.success("New collection group added");
            }
            resetForm();
            fetchCollections();
        } catch (error) { toast.error("Operation failed"); }
    };

    const handleEdit = (item: any) => {
        setFormData({
            title: item.title,
            description: item.description,
            image: item.image,
            link: item.link,
            order: item.order || 0,
            file: null
        });
        setEditingId(item._id);
        setIsEditing(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Permanently archive this collection group?")) return;
        try {
            await api.delete(`/content/collections/${id}`);
            toast.success("Collection removed");
            fetchCollections();
        } catch (error) { toast.error("Delete failed"); }
    };

    const resetForm = () => {
        setFormData({ title: "", description: "", image: "", link: "", order: 0, file: null });
        setEditingId(null);
        setIsEditing(false);
    };

    return (
        <div className="min-h-screen bg-[#FDFCF6]">
            <Navbar />
            <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                    <div className="flex items-center gap-4">
                        {isEditing && (
                            <button onClick={resetForm} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                <ArrowLeft className="w-6 h-6 text-gray-600" />
                            </button>
                        )}
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                                <Layers className="w-8 h-8 text-indigo-600" />
                                {isEditing ? (editingId ? "Modify Collection" : "New Curated Collection") : "Product Collections"}
                            </h1>
                            <p className="text-gray-500 mt-1">Organize your offerings into beautiful, themed shopping experiences.</p>
                        </div>
                    </div>

                    {!isEditing && (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-full hover:bg-red-700 transition-all shadow-lg hover:shadow-red-600/20 font-bold"
                        >
                            <Plus className="w-5 h-5" /> Add Collection
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
                            className="max-w-2xl mx-auto"
                        >
                            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100 space-y-8">
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700">Collection Title</label>
                                        <input
                                            className="w-full bg-gray-50 p-4 rounded-2xl border border-gray-200 outline-none focus:ring-2 focus:ring-red-500/20 transition-all font-display text-lg"
                                            placeholder="e.g. Earthy Elegance"
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700">Display Description</label>
                                        <textarea
                                            className="w-full bg-gray-50 p-4 rounded-2xl border border-gray-200 outline-none focus:ring-2 focus:ring-red-500/20 transition-all h-32"
                                            placeholder="A few words about this curated group..."
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-gray-700">Navigation Link</label>
                                            <div className="relative">
                                                <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                <input
                                                    className="w-full bg-gray-50 p-4 pl-10 rounded-2xl border border-gray-200 outline-none focus:ring-2 focus:ring-red-500/20 transition-all text-sm font-medium"
                                                    placeholder="/gemstones"
                                                    value={formData.link}
                                                    onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-gray-700 font-medium">Display Priority</label>
                                            <input
                                                type="number"
                                                className="w-full bg-gray-50 p-4 rounded-2xl border border-gray-200 outline-none focus:ring-2 focus:ring-red-500/20 transition-all font-medium"
                                                value={formData.order}
                                                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-sm font-bold text-gray-700">Collection Thumbnail</label>
                                        <label className="flex flex-col items-center justify-center w-full h-44 border-2 border-dashed border-gray-200 rounded-2xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-all group relative overflow-hidden">
                                            {formData.file || formData.image ? (
                                                <div className="absolute inset-0 z-10">
                                                    <img
                                                        src={formData.file ? URL.createObjectURL(formData.file) : formData.image}
                                                        alt="Preview"
                                                        className="w-full h-full object-cover"
                                                    />
                                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity font-bold">
                                                        Change Image
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center justify-center py-10">
                                                    <ImageIcon className="w-10 h-10 text-gray-400 mb-2" />
                                                    <p className="text-sm text-gray-500 font-bold">Upload Thumbnail</p>
                                                </div>
                                            )}
                                            <input type="file" onChange={handleFileChange} accept="image/*" className="hidden" />
                                        </label>
                                    </div>

                                    <div className="flex gap-4 pt-4">
                                        <button
                                            type="submit"
                                            className="flex-1 px-8 py-4 bg-red-600 text-white font-bold rounded-2xl hover:bg-red-700 transition-all shadow-lg hover:shadow-red-600/20 flex items-center justify-center gap-2"
                                        >
                                            <Save className="w-5 h-5" /> {editingId ? "Update Collection" : "Create Collection"}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={resetForm}
                                            className="px-8 py-4 bg-gray-100 text-gray-600 font-bold rounded-2xl hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
                                        >
                                            <X className="w-5 h-5" /> Cancel
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="list"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                        >
                            {collections.map((item) => (
                                <motion.div
                                    layout
                                    key={item._id}
                                    className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-6 flex flex-col gap-6 group hover:shadow-xl transition-all duration-300 relative"
                                >
                                    <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100 shadow-inner">
                                        <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex justify-between items-start">
                                            <h3 className="font-bold text-xl text-gray-900 group-hover:text-red-700 transition-colors uppercase tracking-tight">{item.title}</h3>
                                            <span className="px-2 py-0.5 bg-gray-50 text-[10px] font-bold text-gray-400 border border-gray-100 rounded-md">#{item.order}</span>
                                        </div>
                                        <p className="text-gray-500 text-sm line-clamp-2 leading-relaxed">{item.description}</p>
                                        <div className="flex items-center gap-1.5 text-[11px] font-bold text-indigo-500 uppercase tracking-wider pt-2">
                                            <LinkIcon className="w-3 h-3" /> {item.link}
                                        </div>
                                    </div>

                                    <div className="flex gap-3 pt-2 border-t border-gray-50">
                                        <button
                                            onClick={() => handleEdit(item)}
                                            className="flex-1 px-4 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 flex items-center justify-center gap-2 transition-all font-medium text-sm"
                                        >
                                            <Edit3 className="w-4 h-4" /> Edit Group
                                        </button>
                                        <button
                                            onClick={() => handleDelete(item._id)}
                                            className="px-4 py-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all"
                                            title="Archive Collection"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}

                            {collections.length === 0 && (
                                <div className="col-span-full py-32 text-center bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200">
                                    <Layers className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                    <h3 className="text-xl font-bold text-gray-400">No collections defined yet</h3>
                                    <button onClick={() => setIsEditing(true)} className="mt-4 text-red-600 font-bold hover:underline">Start a new collection</button>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence >
            </div >
        </div >
    );
};

export default ManageCollections;
