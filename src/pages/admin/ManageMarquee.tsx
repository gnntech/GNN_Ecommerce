import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Trash, Plus } from "lucide-react";

const ManageMarquee = () => {
    const [lines, setLines] = useState<string[]>([]);

    useEffect(() => { fetchContent(); }, []);

    const fetchContent = async () => {
        try {
            const res = await fetch("http://localhost:5000/api/content/sections/marquee");
            const data = await res.json();
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
    const removeLine = (index: number) => setLines(lines.filter((_, i) => i !== index));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await fetch("http://localhost:5000/api/content/sections/marquee", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: "marquee", // Required by backend to identify section
                    title: "Marquee Content",
                    description: JSON.stringify(lines)
                }),
            });
            toast.success("Marquee updated successfully");
        } catch (error) { toast.error("Update failed"); }
    };

    return (
        <div className="p-8 space-y-8">
            <h1 className="text-3xl font-bold">Manage Marquee Text</h1>
            <Card>
                <CardHeader><CardTitle>Edit Scrolling Text</CardTitle></CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {lines.map((line, index) => (
                            <div key={index} className="flex gap-2">
                                <Input
                                    value={line}
                                    onChange={(e) => handleLineChange(index, e.target.value)}
                                    placeholder="Enter text line..."
                                />
                                <Button type="button" variant="destructive" size="icon" onClick={() => removeLine(index)}>
                                    <Trash className="w-4 h-4" />
                                </Button>
                            </div>
                        ))}
                        <Button type="button" variant="outline" onClick={addLine} className="w-full">
                            <Plus className="w-4 h-4 mr-2" /> Add Line
                        </Button>
                        <Button type="submit" className="w-full">Save Changes</Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default ManageMarquee;
