import { useState } from "react";
import api from "@/lib/api";
import { toast } from "sonner";

interface SimpleProductFormProps {
    type: "trees" | "bracelets";
    onSuccess: () => void;
    initialData?: any;
    onCancel: () => void;
}

const SimpleProductForm: React.FC<SimpleProductFormProps> = ({
    type,
    onSuccess,
    initialData,
    onCancel,
}) => {
    const [formData, setFormData] = useState({
        name: initialData?.name || "",
        numerology: initialData?.numerology || "",
        shortDescription: initialData?.shortDescription || "",
        meaning: initialData?.meaning || "",
        price: initialData?.price || "",
        buyLink: initialData?.buyLink || "",
        image: null as File | null,
        benefits: initialData?.benefits?.join("\n") || "",
        whoShouldWear: initialData?.whoShouldWear?.join("\n") || "",
        careInstructions: initialData?.careInstructions?.join("\n") || "",
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFormData((prev) => ({ ...prev, image: e.target.files![0] }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const data = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            if (key === "benefits" || key === "whoShouldWear" || key === "careInstructions") {
                data.append(key, JSON.stringify(value.split("\n").filter((i: string) => i.trim() !== "")));
            } else if (key === "image" && value) {
                data.append(key, value);
            } else if (key !== "image") {
                data.append(key, value as string);
            }
        });

        try {
            if (initialData) {
                await api.put(`/products/${type}/${initialData._id}`, data);
                toast.success(`Product updated successfully`);
            } else {
                await api.post(`/products/${type}`, data);
                toast.success(`Product created successfully`);
            }
            onSuccess();
        } catch (error: any) {
            let errorMessage = "Something went wrong";
            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (typeof error.response?.data === 'string') {
                // To prevent rendering full HTML pages in toast, checking if it's HTML
                errorMessage = error.response.data.includes('<!DOCTYPE html>')
                    ? `Server Error (${error.response.status})`
                    : error.response.data;
            } else if (error.message) {
                errorMessage = error.message;
            }
            toast.error(errorMessage);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 font-sans">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input name="name" placeholder="Name" value={formData.name} onChange={handleChange} required className="input bg-secondary/50 p-2 rounded" />
                <input name="price" placeholder="Price (e.g. ₹1,250)" value={formData.price} onChange={handleChange} className="input bg-secondary/50 p-2 rounded" />
            </div>

            <textarea name="numerology" placeholder="Numerology" value={formData.numerology} onChange={handleChange} className="input w-full bg-secondary/50 p-2 rounded h-24" />
            <textarea name="shortDescription" placeholder="Short Description" value={formData.shortDescription} onChange={handleChange} className="input w-full bg-secondary/50 p-2 rounded h-20" />
            <textarea name="meaning" placeholder="Meaning" value={formData.meaning} onChange={handleChange} className="input w-full bg-secondary/50 p-2 rounded h-32" />

            <div className="space-y-2">
                <label className="block text-sm font-medium">Benefits (One per line)</label>
                <textarea name="benefits" value={formData.benefits} onChange={handleChange} className="input w-full bg-secondary/50 p-2 rounded h-24" />
            </div>
            <div className="space-y-2">
                <label className="block text-sm font-medium">Who Should Wear (One per line)</label>
                <textarea name="whoShouldWear" value={formData.whoShouldWear} onChange={handleChange} className="input w-full bg-secondary/50 p-2 rounded h-24" />
            </div>
            <div className="space-y-2">
                <label className="block text-sm font-medium">Care Instructions (One per line)</label>
                <textarea name="careInstructions" value={formData.careInstructions} onChange={handleChange} className="input w-full bg-secondary/50 p-2 rounded h-24" />
            </div>

            <input name="buyLink" placeholder="Buy Link" value={formData.buyLink} onChange={handleChange} className="input w-full bg-secondary/50 p-2 rounded" />

            <div className="space-y-2">
                <label className="block text-sm font-medium">Image</label>
                <input type="file" onChange={handleFileChange} accept="image/*" className="block w-full text-sm text-foreground file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90" />
            </div>

            <div className="flex justify-end gap-2 pt-4">
                <button type="button" onClick={onCancel} className="px-4 py-2 border rounded hover:bg-muted">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90">Save</button>
            </div>
        </form>
    );
};

export default SimpleProductForm;
