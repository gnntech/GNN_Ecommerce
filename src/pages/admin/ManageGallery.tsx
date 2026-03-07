import React, { useState, useEffect } from "react";
import { Image as ImageIcon, Trash2, Edit3, Plus, ArrowLeft, Link as LinkIcon, Save, X, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";
import Navbar from "@/components/Navbar";
import { motion, AnimatePresence } from "framer-motion";

const ManageGallery = () => {
    const [items, setItems] = useState<any[]>([]);
    const [formData, setFormData] = useState({ title: "", image: "", link: "", order: 0, file: null as File | null });
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    useEffect(() => { fetchItems(); }, []);

    const fetchItems = async () => {
        try {
            const { data } = await api.get("/content/gallery");
            setItems(data);
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
                await api.put(`/content/gallery/${editingId}`, data, config);
                toast.success("Gallery item updated");
            } else {
                await api.post("/content/gallery", data, config);
                toast.success("New image added to gallery");
            }
            resetForm();
            fetchItems();
        } catch (error) { toast.error("Operation failed"); }
    };

    const handleEdit = (item: any) => {
        setFormData({
            title: item.title,
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
        if (!confirm("Permanently delete this gallery asset?")) return;
        try {
            await api.delete(`/content/gallery/${id}`);
            toast.success("Item removed");
            fetchItems();
        } catch (error) { toast.error("Delete failed"); }
    };

    const resetForm = () => {
        setFormData({ title: "", image: "", link: "", order: 0, file: null });
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
                                <ImageIcon className="w-8 h-8 text-rose-600" />
                                {isEditing ? (editingId ? "Edit Showcase Item" : "New Gallery Entry") : "Visual Showcase"}
                            </h1>
                            <p className="text-gray-500 mt-1">Manage the high-resolution imagery for your infinity-scroll exhibition.</p>
                        </div>
                    </div>

                    {!isEditing && (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-full hover:bg-red-700 transition-all shadow-lg hover:shadow-red-600/20 font-bold"
                        >
                            <Plus className="w-5 h-5" /> Add New Asset
                        </button>
                    )}
                </div>

                <AnimatePresence mode="wait">
                    {isEditing ? (
                        <motion.div
                            key="form"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="max-w-2xl mx-auto"
                        >
                            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100 space-y-8">
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700">Artwork Title / Caption</label>
                                        <input
                                            className="w-full bg-gray-50 p-4 rounded-2xl border border-gray-200 outline-none focus:ring-2 focus:ring-red-500/20 transition-all font-display"
                                            placeholder="e.g. Masterpiece Tree of Life"
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700">Featured Image</label>
                                        <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-200 rounded-2xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-all group relative overflow-hidden">
                                            {formData.file || formData.image ? (
                                                <div className="absolute inset-0 z-10">
                                                    <img
                                                        src={formData.file ? URL.createObjectURL(formData.file) : formData.image}
                                                        alt="Preview"
                                                        className="w-full h-full object-cover"
                                                    />
                                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity font-bold text-sm">
                                                        Change Image
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center justify-center py-6">
                                                    <ImageIcon className="w-10 h-10 text-gray-400 mb-2" />
                                                    <p className="text-sm text-gray-500 font-medium">Click to upload asset</p>
                                                    <p className="text-xs text-gray-400 mt-1">High-res PNG, JPG or WEBP</p>
                                                </div>
                                            )}
                                            <input type="file" onChange={handleFileChange} accept="image/*" className="hidden" />
                                        </label>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-gray-700 font-medium">Destination Link</label>
                                            <div className="relative">
                                                <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                <input
                                                    className="w-full bg-gray-50 p-4 pl-10 rounded-2xl border border-gray-200 outline-none focus:ring-2 focus:ring-red-500/20 transition-all text-sm font-medium"
                                                    placeholder="/products/category-id"
                                                    value={formData.link}
                                                    onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-gray-700 font-medium">Render Sequence</label>
                                            <input
                                                type="number"
                                                className="w-full bg-gray-50 p-4 rounded-2xl border border-gray-200 outline-none focus:ring-2 focus:ring-red-500/20 transition-all font-medium"
                                                value={formData.order}
                                                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex gap-4 pt-4">
                                        <button
                                            type="submit"
                                            className="flex-1 px-8 py-4 bg-red-600 text-white font-bold rounded-2xl hover:bg-red-700 transition-all shadow-lg hover:shadow-red-600/20 flex items-center justify-center gap-2"
                                        >
                                            <Save className="w-5 h-5" /> {editingId ? "Save Changes" : "Commit to Gallery"}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={resetForm}
                                            className="px-8 py-4 bg-gray-100 text-gray-600 font-bold rounded-2xl hover:bg-gray-200 transition-all"
                                        >
                                            <X className="w-5 h-5 inline mr-1" /> Discard
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
                            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                        >
                            {items.map((item) => (
                                <motion.div
                                    layout
                                    key={item._id}
                                    className="relative group aspect-square rounded-[2rem] overflow-hidden bg-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500"
                                >
                                    <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />

                                    {/* Overlay */}
                                    <div className="absolute inset-x-4 bottom-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-10">
                                        <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl flex flex-col gap-2">
                                            <h3 className="font-bold text-sm text-gray-900 line-clamp-1">{item.title}</h3>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleEdit(item)}
                                                    className="flex-1 py-2 bg-gray-900 text-white rounded-lg text-xs font-bold hover:bg-black transition-colors"
                                                >
                                                    <Edit3 className="w-3 h-3 inline mr-1" /> Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(item._id)}
                                                    className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="absolute top-4 right-4 bg-black/30 backdrop-blur-md text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                        <ExternalLink className="w-3 h-3" />
                                    </div>
                                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-2 py-1 rounded-md text-[10px] font-bold text-gray-900 border border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity">
                                        Seq: {item.order}
                                    </div>
                                </motion.div>
                            ))}

                            {items.length === 0 && (
                                <div className="col-span-full py-32 text-center bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200">
                                    <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                    <h3 className="text-xl font-bold text-gray-400">The showcase is currently empty</h3>
                                    <button onClick={() => setIsEditing(true)} className="mt-4 text-red-600 font-bold hover:underline">Begin uploading your curation</button>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default ManageGallery;
