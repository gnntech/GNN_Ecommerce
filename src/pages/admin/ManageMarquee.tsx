import React, { useState, useEffect } from "react";
import { MoveRight, Plus, Trash2, Save, ArrowLeft, Type, Info } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";
import Navbar from "@/components/Navbar";
import { motion, AnimatePresence } from "framer-motion";

const ManageMarquee = () => {
    const [lines, setLines] = useState<string[]>([]);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => { fetchContent(); }, []);

    const fetchContent = async () => {
        try {
            const { data } = await api.get("/content/sections/marquee");
            if (data && data.description) {
                try {
                    setLines(JSON.parse(data.description));
                } catch (e) {
                    setLines([]);
                }
            }
        } catch (error) { console.error(error); }
    };

    const handleLineChange = (index: number, value: string) => {
        const newLines = [...lines];
        newLines[index] = value;
        setLines(newLines);
    };

    const addLine = () => setLines([...lines, ""]);
    const removeLine = (index: number) => {
        const newLines = lines.filter((_, i) => i !== index);
        setLines(newLines);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const storedUser = localStorage.getItem("adminUser");
            const token = storedUser ? JSON.parse(storedUser).token : "";
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };

            await api.put("/content/sections/marquee", {
                name: "marquee",
                title: "Marquee Content",
                description: JSON.stringify(lines.filter(l => l.trim() !== ""))
            }, config);
            toast.success("Scrolling announcements updated");
            fetchContent();
        } catch (error) {
            toast.error("Update failed");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FDFCF6]">
            <Navbar />
            <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-10 flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                            <MoveRight className="w-8 h-8 text-orange-600" />
                            Scrolling Announcements
                        </h1>
                        <p className="text-gray-500 mt-1">Edit the rotating highlights that glide across your homepage.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
                    <div className="lg:col-span-3">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100 space-y-8"
                        >
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-4">
                                    <AnimatePresence initial={false}>
                                        {lines.map((line, index) => (
                                            <motion.div
                                                key={index}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, scale: 0.9 }}
                                                className="flex gap-3 group items-center"
                                            >
                                                <div className="flex-none w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-xs font-bold text-gray-400 group-focus-within:bg-orange-50 group-focus-within:text-orange-600 transition-colors">
                                                    {index + 1}
                                                </div>
                                                <input
                                                    className="flex-1 bg-gray-50 p-4 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-orange-500/20 transition-all font-medium text-gray-700"
                                                    value={line}
                                                    onChange={(e) => handleLineChange(index, e.target.value)}
                                                    placeholder="Focusing on your spiritual growth..."
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeLine(index)}
                                                    className="flex-none p-4 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>

                                <button
                                    type="button"
                                    onClick={addLine}
                                    className="w-full py-4 border-2 border-dashed border-gray-200 text-gray-400 font-bold rounded-2xl hover:border-orange-200 hover:text-orange-600 hover:bg-orange-50/30 transition-all flex items-center justify-center gap-2"
                                >
                                    <Plus className="w-5 h-5" /> Add New Announcement
                                </button>

                                <div className="pt-4">
                                    <button
                                        type="submit"
                                        disabled={isSaving}
                                        className="w-full py-4 bg-gray-900 text-white font-bold rounded-2xl hover:bg-black transition-all shadow-xl flex items-center justify-center gap-2 disabled:bg-gray-400"
                                    >
                                        <Save className="w-5 h-5" /> {isSaving ? "Synchronizing..." : "Publish Live Updates"}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>

                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-orange-50 p-8 rounded-[2rem] border border-orange-100 flex flex-col gap-4">
                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                                <Info className="w-6 h-6 text-orange-600" />
                            </div>
                            <h3 className="font-bold text-gray-900">How it works</h3>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                These messages scroll continuously at the bottom of your hero section. Keep them short (under 10 words) for the best readability.
                            </p>
                            <div className="flex flex-col gap-2 pt-2">
                                <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                                    <div className="w-1.5 h-1.5 rounded-full bg-orange-400" /> Auto-rotates every few seconds
                                </div>
                                <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                                    <div className="w-1.5 h-1.5 rounded-full bg-orange-400" /> Supports emojis for visual flair
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-5">
                                <Type className="w-12 h-12" />
                            </div>
                            <h4 className="font-bold text-xs uppercase tracking-widest text-gray-400 mb-4">Live Character Count</h4>
                            <div className="text-3xl font-display font-bold text-gray-900">
                                {lines.reduce((acc, curr) => acc + curr.length, 0)}
                                <span className="text-sm font-normal text-gray-400 ml-2">Total Chars</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManageMarquee;
