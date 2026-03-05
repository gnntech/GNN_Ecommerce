import React, { useState, useEffect } from "react";
import { LayoutTemplate, Trash2, Edit3, Plus, ArrowLeft, Image as ImageIcon, Save, X } from "lucide-react";
import api from "@/lib/api";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import { motion, AnimatePresence } from "framer-motion";

const ManageSlider = () => {
    const [slides, setSlides] = useState<any[]>([]);
    const [formData, setFormData] = useState({ title: "", description: "", image: "", order: 0, file: null as File | null });
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    useEffect(() => {
        fetchSlides();
    }, []);

    const fetchSlides = async () => {
        try {
            const { data } = await api.get("/content/slider");
            setSlides(data);
        } catch (error) {
            console.error("Failed to fetch slides");
        }
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
        data.append("order", formData.order.toString());

        if (formData.file) {
            data.append("image", formData.file);
        } else if (formData.image) {
            data.append("image", formData.image);
        }

        try {
            if (editingId) {
                await api.put(`/content/slider/${editingId}`, data);
                toast.success("Banner updated successfully");
            } else {
                await api.post("/content/slider", data);
                toast.success("New banner added to slider");
            }
            resetForm();
            fetchSlides();
        } catch (error) {
            toast.error("Operation failed. Please check your connection.");
        }
    };

    const handleEdit = (slide: any) => {
        setFormData({
            title: slide.title,
            description: slide.description,
            image: slide.image,
            order: slide.order || 0,
            file: null
        });
        setEditingId(slide._id);
        setIsEditing(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to remove this banner? It will stop appearing on the homepage immediately.")) return;
        try {
            await api.delete(`/content/slider/${id}`);
            toast.success("Banner removed");
            fetchSlides();
        } catch (error) {
            toast.error("Delete failed");
        }
    };

    const resetForm = () => {
        setFormData({ title: "", description: "", image: "", order: 0, file: null });
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
                                <LayoutTemplate className="w-8 h-8 text-red-600" />
                                {isEditing ? (editingId ? "Update Banner" : "New Home Banner") : "Homepage Sliders"}
                            </h1>
                            <p className="text-gray-500 mt-1">
                                {isEditing ? "Design the banner that appears at the very top of your website." : "Manage the hero images and messages that greet your visitors."}
                            </p>
                        </div>
                    </div>

                    {!isEditing && (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-full hover:bg-red-700 transition-all shadow-lg hover:shadow-red-600/20 font-bold"
                        >
                            <Plus className="w-5 h-5" /> Add New Slide
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
                                        <label className="text-sm font-bold text-gray-700">Banner Title</label>
                                        <input
                                            className="w-full bg-gray-50 p-4 rounded-2xl border border-gray-200 outline-none focus:ring-2 focus:ring-red-500/20 transition-all font-display text-lg"
                                            placeholder="Catchy headline for the slide..."
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700">Sub-headline / Description</label>
                                        <textarea
                                            className="w-full bg-gray-50 p-4 rounded-2xl border border-gray-200 outline-none focus:ring-2 focus:ring-red-500/20 transition-all h-32"
                                            placeholder="Tell your story in a few sentences..."
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-sm font-bold text-gray-700">Slider Image</label>
                                        <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-200 rounded-2xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-all group relative overflow-hidden">
                                            {formData.file || formData.image ? (
                                                <div className="absolute inset-0 z-10">
                                                    <img
                                                        src={formData.file ? URL.createObjectURL(formData.file) : formData.image}
                                                        alt="Preview"
                                                        className="w-full h-full object-cover"
                                                    />
                                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity font-bold">
                                                        Change Banner Image
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center justify-center py-10 text-center">
                                                    <ImageIcon className="w-12 h-12 text-gray-400 mb-3" />
                                                    <p className="text-sm text-gray-500 font-bold">Upload Slide Image</p>
                                                    <p className="text-xs text-gray-400 mt-1 px-10">Recommended: 1920x1080px (16:9)</p>
                                                </div>
                                            )}
                                            <input type="file" onChange={handleFileChange} accept="image/*" className="hidden" />
                                        </label>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700">Display Order</label>
                                        <input
                                            type="number"
                                            className="w-full bg-gray-50 p-4 rounded-2xl border border-gray-200 outline-none focus:ring-2 focus:ring-red-500/20 transition-all"
                                            placeholder="Priority (0-9)"
                                            value={formData.order}
                                            onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                                        />
                                    </div>

                                    <div className="flex gap-4 pt-4">
                                        <button
                                            type="submit"
                                            className="flex-1 px-8 py-4 bg-red-600 text-white font-bold rounded-2xl hover:bg-red-700 transition-all shadow-lg hover:shadow-red-600/20 flex items-center justify-center gap-2"
                                        >
                                            <Save className="w-5 h-5" /> {editingId ? "Update Banner" : "Launch Banner"}
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
                            {slides.map((slide) => (
                                <motion.div
                                    layout
                                    key={slide._id}
                                    className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-6 flex flex-col gap-6 group hover:shadow-xl transition-all duration-300 relative"
                                >
                                    <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-gray-100">
                                        <img src={slide.image} alt={slide.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                        <div className="absolute top-4 left-4 px-3 py-1 bg-black/50 backdrop-blur-sm text-white rounded-full text-[10px] font-bold uppercase tracking-wider">
                                            Slide #{slide.order}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <h3 className="font-bold text-xl text-gray-900 group-hover:text-red-700 transition-colors line-clamp-1 uppercase tracking-tight">{slide.title}</h3>
                                        <p className="text-gray-500 text-sm line-clamp-2 leading-relaxed">{slide.description}</p>
                                    </div>

                                    <div className="flex gap-3 pt-2 border-t border-gray-50">
                                        <button
                                            onClick={() => handleEdit(slide)}
                                            className="flex-1 px-4 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 flex items-center justify-center gap-2 transition-all font-medium text-sm"
                                        >
                                            <Edit3 className="w-4 h-4" /> Edit Content
                                        </button>
                                        <button
                                            onClick={() => handleDelete(slide._id)}
                                            className="px-4 py-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all"
                                            title="Delete Slide"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}

                            {slides.length === 0 && (
                                <div className="col-span-full py-32 text-center bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200">
                                    <LayoutTemplate className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                    <h3 className="text-xl font-bold text-gray-400">Your homepage slider is currently empty</h3>
                                    <button onClick={() => setIsEditing(true)} className="mt-4 text-red-600 font-bold hover:underline">Create your first banner</button>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default ManageSlider;
