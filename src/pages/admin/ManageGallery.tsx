import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash, Edit } from "lucide-react";
import { toast } from "sonner";
import FileUpload from "@/components/admin/FileUpload";

const ManageGallery = () => {
    const [items, setItems] = useState<any[]>([]);
    const [formData, setFormData] = useState({ title: "", image: "", link: "", order: 0 });
    const [editingId, setEditingId] = useState<string | null>(null);

    useEffect(() => { fetchItems(); }, []);

    const fetchItems = async () => {
        try {
            const res = await fetch("http://localhost:5000/api/content/gallery");
            setItems(await res.json());
        } catch (error) { console.error(error); }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const url = editingId
                ? `http://localhost:5000/api/content/gallery/${editingId}`
                : "http://localhost:5000/api/content/gallery";
            const method = editingId ? "PUT" : "POST";

            await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            toast.success(editingId ? "Item updated" : "Item added");
            setFormData({ title: "", image: "", link: "", order: 0 });
            setEditingId(null);
            fetchItems();
        } catch (error) { toast.error("Operation failed"); }
    };

    return (
        <div className="p-8 space-y-8">
            <h1 className="text-3xl font-bold">Manage Gallery (Infinity Scroll)</h1>
            <Card>
                <CardHeader><CardTitle>{editingId ? "Edit Item" : "Add Item"}</CardTitle></CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input placeholder="Title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
                        <div className="flex gap-2 items-center">
                            <Input placeholder="Image URL" value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })} required />
                            <FileUpload onUpload={(url) => setFormData({ ...formData, image: url })} />
                        </div>
                        <Input placeholder="Link" value={formData.link} onChange={(e) => setFormData({ ...formData, link: e.target.value })} required />
                        <Input type="number" placeholder="Order" value={formData.order} onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })} />
                        <Button type="submit">{editingId ? "Update" : "Add"}</Button>
                        {editingId && <Button variant="outline" type="button" onClick={() => { setEditingId(null); setFormData({ title: "", image: "", link: "", order: 0 }); }} className="ml-2">Cancel</Button>}
                    </form>
                </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {items.map((item) => (
                    <Card key={item._id} className="group relative">
                        <CardContent className="pt-6">
                            <img src={item.image} alt={item.title} className="w-full h-40 object-cover rounded mb-4" />
                            <h3 className="font-bold">{item.title}</h3>
                            <p className="text-xs text-blue-500">{item.link}</p>
                            <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 bg-white p-1 rounded shadow">
                                <Button size="icon" variant="ghost" onClick={() => { setFormData(item); setEditingId(item._id); }}><Edit className="w-4 h-4 text-blue-500" /></Button>
                                <Button size="icon" variant="ghost" onClick={async () => { if (confirm("Delete?")) { await fetch(`http://localhost:5000/api/content/gallery/${item._id}`, { method: "DELETE" }); fetchItems(); } }}><Trash className="w-4 h-4 text-red-500" /></Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default ManageGallery;
