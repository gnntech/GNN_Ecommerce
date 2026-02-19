import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash, Edit, Plus } from "lucide-react";
import api from "@/lib/api"; // Assuming axios instance
import { toast } from "sonner";
import FileUpload from "@/components/admin/FileUpload";

const ManageSlider = () => {
    const [slides, setSlides] = useState<any[]>([]);
    const [formData, setFormData] = useState({ title: "", description: "", image: "", order: 0 });
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingId) {
                await api.put(`/content/slider/${editingId}`, formData);
                toast.success("Slide updated successfully");
            } else {
                await api.post("/content/slider", formData);
                toast.success("Slide added successfully");
            }
            setFormData({ title: "", description: "", image: "", order: 0 });
            setEditingId(null);
            fetchSlides();
        } catch (error) {
            toast.error("Operation failed");
        }
    };

    const handleEdit = (slide: any) => {
        setFormData({
            title: slide.title,
            description: slide.description,
            image: slide.image,
            order: slide.order || 0
        });
        setEditingId(slide._id);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure?")) return;
        try {
            await api.delete(`/content/slider/${id}`);
            toast.success("Slide deleted");
            fetchSlides();
        } catch (error) {
            toast.error("Delete failed");
        }
    };

    return (
        <div className="p-8 space-y-8">
            <h1 className="text-3xl font-bold">Manage Hero Slider</h1>

            <Card>
                <CardHeader>
                    <CardTitle>{editingId ? "Edit Slide" : "Add New Slide"}</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input
                            placeholder="Title"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            required
                        />
                        <Textarea
                            placeholder="Description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            required
                        />
                        <div className="flex gap-2 items-center">
                            <Input
                                placeholder="Image URL (e.g., /images/slider-blue.png)"
                                value={formData.image}
                                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                required
                            />
                            <FileUpload onUpload={(url) => setFormData({ ...formData, image: url })} />
                        </div>
                        <Input
                            type="number"
                            placeholder="Order"
                            value={formData.order}
                            onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                        />
                        <Button type="submit">{editingId ? "Update Slide" : "Add Slide"}</Button>
                        {editingId && (
                            <Button variant="outline" type="button" onClick={() => { setEditingId(null); setFormData({ title: "", description: "", image: "", order: 0 }); }} className="ml-2">
                                Cancel
                            </Button>
                        )}
                    </form>
                </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {slides.map((slide) => (
                    <Card key={slide._id} className="relative group">
                        <CardContent className="pt-6">
                            <img src={slide.image} alt={slide.title} className="w-full h-40 object-cover rounded mb-4" />
                            <h3 className="font-bold text-lg mb-2">{slide.title}</h3>
                            <p className="text-sm text-gray-500 line-clamp-2">{slide.description}</p>
                            <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white p-1 rounded shadow">
                                <Button size="icon" variant="ghost" onClick={() => handleEdit(slide)}>
                                    <Edit className="w-4 h-4 text-blue-500" />
                                </Button>
                                <Button size="icon" variant="ghost" onClick={() => handleDelete(slide._id)}>
                                    <Trash className="w-4 h-4 text-red-500" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default ManageSlider;
