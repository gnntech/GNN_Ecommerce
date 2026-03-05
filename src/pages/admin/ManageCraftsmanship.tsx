import React, { useState, useEffect } from "react";
import { Hammer, Save, ArrowLeft, Video, PenTool, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";
import Navbar from "@/components/Navbar";
import { motion, AnimatePresence } from "framer-motion";

const ManageCraftsmanship = () => {
    const [formData, setFormData] = useState({
        sectionName: "craftsmanship",
        title: "",
        subtitle: "",
        description: "",
        videoUrl: "",
        ctaText: "",
        ctaLink: "",
        image: "",
        file: null as File | null
    });
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => { fetchContent(); }, []);

    const fetchContent = async () => {
        try {
            const { data } = await api.get("/content/sections/craftsmanship");
            if (data) setFormData({ ...data, file: null });
        } catch (error) { console.error(error); }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFormData(prev => ({ ...prev, file: e.target.files![0] }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        const data = new FormData();
        data.append("sectionName", formData.sectionName);
        data.append("title", formData.title);
        data.append("subtitle", formData.subtitle || "");
        data.append("description", formData.description || "");
        data.append("videoUrl", formData.videoUrl || "");
        data.append("ctaText", formData.ctaText || "");
        data.append("ctaLink", formData.ctaLink || "");

        if (formData.file) {
            data.append("image", formData.file);
        } else if (formData.image) {
            data.append("image", formData.image);
        }

        try {
            await api.put("/content/sections/craftsmanship", data);
            toast.success("Craftsmanship story updated successfully");
        } catch (error) {
            toast.error("Failed to save changes");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FDFCF6]">
            <Navbar />
            <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
                {/* Header */}
                <div className="mb-10">
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                        <Hammer className="w-8 h-8 text-amber-800" />
                        Craftsmanship Story
                    </h1>
                    <p className="text-gray-500 mt-1">Design the narrative of your artistry and technical precision for your visitors.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Form Side */}
                    <div className="lg:col-span-2 space-y-6">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100"
                        >
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 flex items-center gap-2"><PenTool className="w-4 h-4" /> Editorial Title</label>
                                    <input
                                        className="w-full bg-gray-50 p-4 rounded-2xl border border-gray-200 outline-none focus:ring-2 focus:ring-red-500/20 transition-all font-display text-xl"
                                        placeholder="e.g. The Art of Spiritual Precision"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">Persuasive Subtitle</label>
                                    <input
                                        className="w-full bg-gray-50 p-4 rounded-2xl border border-gray-200 outline-none focus:ring-2 focus:ring-red-500/20 transition-all"
                                        placeholder="e.g. Handcrafted with Vedic knowledge..."
                                        value={formData.subtitle}
                                        onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">Full Brand Narrative</label>
                                    <textarea
                                        className="w-full bg-gray-50 p-4 rounded-2xl border border-gray-200 outline-none focus:ring-2 focus:ring-red-500/20 transition-all h-48 leading-relaxed"
                                        placeholder="Share the secrets of your process..."
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-4">
                                    <label className="text-sm font-bold text-gray-700">Craftsmanship Background Image</label>
                                    <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-200 rounded-2xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-all group relative overflow-hidden">
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
                                            <div className="flex flex-col items-center justify-center py-6">
                                                <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
                                                <p className="text-xs text-gray-500 font-bold">Upload Background</p>
                                            </div>
                                        )}
                                        <input type="file" onChange={handleFileChange} accept="image/*" className="hidden" />
                                    </label>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 flex items-center gap-2"><Video className="w-4 h-4" /> Cinematic Video URL</label>
                                    <input
                                        className="w-full bg-gray-50 p-4 rounded-2xl border border-gray-200 outline-none focus:ring-2 focus:ring-red-500/20 transition-all text-sm"
                                        placeholder="YouTube Embed Link"
                                        value={formData.videoUrl}
                                        onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700">Button Text</label>
                                        <input
                                            className="w-full bg-gray-50 p-4 rounded-2xl border border-gray-200 outline-none focus:ring-2 focus:ring-red-500/20 transition-all font-medium"
                                            placeholder="Explore More"
                                            value={formData.ctaText}
                                            onChange={(e) => setFormData({ ...formData, ctaText: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700 font-medium">Button Link</label>
                                        <div className="relative">
                                            <ExternalLink className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <input
                                                className="w-full bg-gray-50 p-4 pl-10 rounded-2xl border border-gray-200 outline-none focus:ring-2 focus:ring-red-500/20 transition-all font-medium"
                                                placeholder="/portfolio"
                                                value={formData.ctaLink}
                                                onChange={(e) => setFormData({ ...formData, ctaLink: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className="w-full py-4 bg-red-600 text-white font-bold rounded-2xl hover:bg-red-700 transition-all shadow-xl hover:shadow-red-600/20 flex items-center justify-center gap-2 disabled:bg-gray-400"
                                >
                                    <Save className="w-5 h-5" /> {isSaving ? "Saving Masterpiece..." : "Update Section Information"}
                                </button>
                            </form>
                        </motion.div>
                    </div>

                    {/* Preview Side */}
                    <div className="space-y-6">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-gray-900 p-2 rounded-[2rem] shadow-2xl overflow-hidden aspect-[9/16] lg:sticky lg:top-40 border-4 border-gray-800"
                        >
                            <div className="w-full h-full rounded-[1.5rem] overflow-hidden bg-black relative">
                                {formData.videoUrl ? (
                                    <iframe
                                        className="w-full h-full object-cover"
                                        src={formData.videoUrl}
                                        title="Preview"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    ></iframe>
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-full text-gray-600 text-center p-8">
                                        <Video className="w-12 h-12 mb-4 opacity-20" />
                                        <p className="text-sm italic">Add a video URL to see how the storytelling section looks to visitors.</p>
                                    </div>
                                )}
                                <div className="absolute top-4 left-1/2 -translate-x-1/2 w-20 h-1 bg-white/20 rounded-full" />
                            </div>
                        </motion.div>
                        <p className="text-center text-xs text-gray-400 font-medium uppercase tracking-widest">Live Mobile Preview</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManageCraftsmanship;
