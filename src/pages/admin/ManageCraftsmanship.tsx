import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import FileUpload from "@/components/admin/FileUpload";
import api from "@/lib/api";

const ManageCraftsmanship = () => {
    const [formData, setFormData] = useState({
        sectionName: "craftsmanship",
        title: "",
        subtitle: "",
        description: "",
        videoUrl: "",
        ctaText: "",
        ctaLink: ""
    });

    useEffect(() => { fetchContent(); }, []);

    const fetchContent = async () => {
        try {
            const { data } = await api.get("/content/sections/craftsmanship");
            if (data) setFormData(data);
        } catch (error) { console.error(error); }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.put("/content/sections/craftsmanship", formData);
            toast.success("Section updated successfully");
        } catch (error) { toast.error("Update failed"); }
    };

    return (
        <div className="p-8 space-y-8">
            <h1 className="text-3xl font-bold">Manage Craftsmanship Section</h1>
            <Card>
                <CardHeader><CardTitle>Edit Content</CardTitle></CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input placeholder="Main Title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
                        <Input placeholder="Subtitle" value={formData.subtitle} onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })} />
                        <Textarea placeholder="Description" rows={4} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                        <div className="flex gap-2 items-center">
                            <Input placeholder="Video URL (Embed Link)" value={formData.videoUrl} onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })} />
                            <FileUpload onUpload={(url) => setFormData({ ...formData, videoUrl: url })} label="Upload Video" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <Input placeholder="CTA Text" value={formData.ctaText} onChange={(e) => setFormData({ ...formData, ctaText: e.target.value })} />
                            <Input placeholder="CTA Link" value={formData.ctaLink} onChange={(e) => setFormData({ ...formData, ctaLink: e.target.value })} />
                        </div>
                        <Button type="submit">Save Changes</Button>
                    </form>
                </CardContent>
            </Card>

            <Card>
                <CardHeader><CardTitle>Preview (Video)</CardTitle></CardHeader>
                <CardContent>
                    {formData.videoUrl && (
                        <div className="aspect-video w-full max-w-lg rounded overflow-hidden bg-black">
                            <iframe className="w-full h-full" src={formData.videoUrl} title="Preview"></iframe>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default ManageCraftsmanship;
