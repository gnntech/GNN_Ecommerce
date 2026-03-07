import React, { useState, useEffect } from "react";
import { Star, Trash2, Edit3, Plus, ArrowLeft, Video, User, Save, X } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";
import Navbar from "@/components/Navbar";
import { motion, AnimatePresence } from "framer-motion";

const ManageReviews = () => {
    const [reviews, setReviews] = useState<any[]>([]);
    const [formData, setFormData] = useState({ name: "", role: "", image: "", videoUrl: "", order: 0, file: null as File | null });
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    useEffect(() => { fetchReviews(); }, []);

    const fetchReviews = async () => {
        try {
            const { data } = await api.get("/content/reviews");
            setReviews(data);
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
        data.append("name", formData.name);
        data.append("role", formData.role);
        data.append("videoUrl", formData.videoUrl);
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
                await api.put(`/content/reviews/${editingId}`, data, config);
                toast.success("Review updated successfully");
            } else {
                await api.post("/content/reviews", data, config);
                toast.success("New celebrity review added");
            }
            resetForm();
            fetchReviews();
        } catch (error) { toast.error("Operation failed"); }
    };

    const handleEdit = (item: any) => {
        setFormData({
            name: item.name,
            role: item.role,
            image: item.image,
            videoUrl: item.videoUrl,
            order: item.order || 0,
            file: null
        });
        setEditingId(item._id);
        setIsEditing(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Remove this celebrity testimonial? This will hide it from the website immediately.")) return;
        try {
            await api.delete(`/content/reviews/${id}`);
            toast.success("Review removed");
            fetchReviews();
        } catch (error) { toast.error("Delete failed"); }
    };

    const resetForm = () => {
        setFormData({ name: "", role: "", image: "", videoUrl: "", order: 0, file: null });
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
                                <Star className="w-8 h-8 text-yellow-600 fill-yellow-600" />
                                {isEditing ? (editingId ? "Modify Testimonial" : "New Celebrity Review") : "Celebrity Testimonials"}
                            </h1>
                            <p className="text-gray-500 mt-1">Manage feedback and video reviews from your elite clientele.</p>
                        </div>
                    </div>

                    {!isEditing && (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-full hover:bg-red-700 transition-all shadow-lg hover:shadow-red-600/20 font-bold"
                        >
                            <Plus className="w-5 h-5" /> Add New Review
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
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-gray-700 flex items-center gap-2"><User className="w-3 h-3" /> Celebrity Name</label>
                                            <input
                                                className="w-full bg-gray-50 p-4 rounded-2xl border border-gray-200 outline-none focus:ring-2 focus:ring-red-500/20 transition-all font-medium"
                                                placeholder="e.g. John Doe"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-gray-700 font-medium">Role / Profession</label>
                                            <input
                                                className="w-full bg-gray-50 p-4 rounded-2xl border border-gray-200 outline-none focus:ring-2 focus:ring-red-500/20 transition-all font-medium"
                                                placeholder="e.g. Renowned Numerologist"
                                                value={formData.role}
                                                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-sm font-bold text-gray-700">Reviewer Profile Image</label>
                                        <div className="flex items-center gap-6">
                                            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-200 bg-gray-50 flex-shrink-0 relative group">
                                                {formData.file || formData.image ? (
                                                    <img
                                                        src={formData.file ? URL.createObjectURL(formData.file) : formData.image}
                                                        alt="Profile Preview"
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                        <User className="w-10 h-10" />
                                                    </div>
                                                )}
                                            </div>
                                            <label className="flex-1 px-6 py-4 border-2 border-dashed border-gray-200 rounded-2xl cursor-pointer hover:bg-gray-50 transition-all flex flex-col items-center justify-center gap-1 group">
                                                <Star className="w-5 h-5 text-gray-400 group-hover:text-yellow-500 transition-colors" />
                                                <span className="text-sm font-bold text-gray-500">Upload Photo</span>
                                                <input type="file" onChange={handleFileChange} accept="image/*" className="hidden" />
                                            </label>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700 flex items-center gap-2 font-medium"><Video className="w-4 h-4" /> Video URL (YouTube Embed)</label>
                                        <input
                                            className="w-full bg-gray-50 p-4 rounded-2xl border border-gray-200 outline-none focus:ring-2 focus:ring-red-500/20 transition-all font-medium"
                                            placeholder="e.g. https://www.youtube.com/embed/..."
                                            value={formData.videoUrl}
                                            onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700 font-medium">Display Priority</label>
                                        <input
                                            type="number"
                                            className="w-full bg-gray-50 p-4 rounded-2xl border border-gray-200 outline-none focus:ring-2 focus:ring-red-500/20 transition-all h-14 w-32 font-medium"
                                            value={formData.order}
                                            onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                                        />
                                    </div>

                                    <div className="flex gap-4 pt-4">
                                        <button
                                            type="submit"
                                            className="flex-1 px-8 py-4 bg-red-600 text-white font-bold rounded-2xl hover:bg-red-700 transition-all shadow-lg hover:shadow-red-600/20 flex items-center justify-center gap-2"
                                        >
                                            <Save className="w-5 h-5" /> {editingId ? "Update Review" : "Publish Testimonial"}
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
                            {reviews.map((item) => (
                                <motion.div
                                    layout
                                    key={item._id}
                                    className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-6 flex flex-col gap-6 group hover:shadow-xl transition-all duration-300 relative overflow-hidden"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-red-50 shadow-sm">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg text-gray-900 line-clamp-1">{item.name}</h3>
                                            <p className="text-red-600 text-xs font-semibold uppercase tracking-wider">{item.role}</p>
                                        </div>
                                    </div>

                                    <div className="relative aspect-video rounded-2xl overflow-hidden bg-gray-100">
                                        <iframe
                                            src={item.videoUrl}
                                            className="w-full h-full"
                                            loading="lazy"
                                        />
                                        <div className="absolute top-2 right-2 px-2 py-0.5 bg-black/50 backdrop-blur-sm text-white rounded text-[10px] font-bold">
                                            Order: {item.order}
                                        </div>
                                    </div>

                                    <div className="flex gap-3 pt-2 border-t border-gray-50">
                                        <button
                                            onClick={() => handleEdit(item)}
                                            className="flex-1 px-4 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 flex items-center justify-center gap-2 transition-all font-medium text-sm"
                                        >
                                            <Edit3 className="w-4 h-4" /> Edit Record
                                        </button>
                                        <button
                                            onClick={() => handleDelete(item._id)}
                                            className="px-4 py-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all font-bold"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}

                            {reviews.length === 0 && (
                                <div className="col-span-full py-32 text-center bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200">
                                    <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                    <h3 className="text-xl font-bold text-gray-400">No celebrity reviews found</h3>
                                    <button onClick={() => setIsEditing(true)} className="mt-4 text-red-600 font-bold hover:underline">Add the first testimonial</button>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default ManageReviews;
