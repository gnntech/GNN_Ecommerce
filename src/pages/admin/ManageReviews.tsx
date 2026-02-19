import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash, Edit } from "lucide-react";
import { toast } from "sonner";
import FileUpload from "@/components/admin/FileUpload";
import api from "@/lib/api";

const ManageReviews = () => {
    const [reviews, setReviews] = useState<any[]>([]);
    const [formData, setFormData] = useState({ name: "", role: "", image: "", videoUrl: "", order: 0 });
    const [editingId, setEditingId] = useState<string | null>(null);

    useEffect(() => { fetchReviews(); }, []);

    const fetchReviews = async () => {
        try {
            const { data } = await api.get("/content/reviews");
            setReviews(data);
        } catch (error) { console.error(error); }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingId) {
                await api.put(`/content/reviews/${editingId}`, formData);
            } else {
                await api.post("/content/reviews", formData);
            }

            toast.success(editingId ? "Review updated" : "Review added");
            setFormData({ name: "", role: "", image: "", videoUrl: "", order: 0 });
            setEditingId(null);
            fetchReviews();
        } catch (error) { toast.error("Operation failed"); }
    };

    return (
        <div className="p-8 space-y-8">
            <h1 className="text-3xl font-bold">Manage Celebrity Reviews</h1>
            <Card>
                <CardHeader><CardTitle>{editingId ? "Edit Review" : "Add Review"}</CardTitle></CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input placeholder="Celebrity Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                        <Input placeholder="Role" value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} required />
                        <div className="flex gap-2 items-center">
                            <Input placeholder="Image URL" value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })} required />
                            <FileUpload onUpload={(url) => setFormData({ ...formData, image: url })} label="Upload Image" />
                        </div>
                        <div className="flex gap-2 items-center">
                            <Input placeholder="Video URL (Embed Link)" value={formData.videoUrl} onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })} required />
                            {/* Note: Cloudinary video upload returns a raw URL, might need processing for embed if not standard */}
                            <FileUpload onUpload={(url) => setFormData({ ...formData, videoUrl: url })} label="Upload Video" />
                        </div>
                        <Input type="number" placeholder="Order" value={formData.order} onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })} />
                        <Button type="submit">{editingId ? "Update" : "Add"}</Button>
                        {editingId && <Button variant="outline" type="button" onClick={() => { setEditingId(null); setFormData({ name: "", role: "", image: "", videoUrl: "", order: 0 }); }} className="ml-2">Cancel</Button>}
                    </form>
                </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {reviews.map((item) => (
                    <Card key={item._id} className="group relative">
                        <CardContent className="pt-6">
                            <img src={item.image} alt={item.name} className="w-full h-40 object-cover rounded mb-4" />
                            <h3 className="font-bold">{item.name}</h3>
                            <p className="text-sm text-gray-500">{item.role}</p>
                            <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 bg-white p-1 rounded shadow">
                                <Button size="icon" variant="ghost" onClick={() => { setFormData(item); setEditingId(item._id); }}><Edit className="w-4 h-4 text-blue-500" /></Button>
                                <Button size="icon" variant="ghost" onClick={async () => { if (confirm("Delete?")) { await api.delete(`/content/reviews/${item._id}`); fetchReviews(); } }}><Trash className="w-4 h-4 text-red-500" /></Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default ManageReviews;
