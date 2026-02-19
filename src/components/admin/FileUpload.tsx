import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Upload, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface FileUploadProps {
    onUpload: (url: string) => void;
    label?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({ onUpload, label = "Upload Image/Video" }) => {
    const [uploading, setUploading] = useState(false);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch('http://localhost:5000/api/upload', {
                method: 'POST',
                body: formData,
            });
            const data = await res.json();

            if (res.ok) {
                onUpload(data.url);
                toast.success('File uploaded successfully');
            } else {
                toast.error(data.message || 'Upload failed');
            }
        } catch (error) {
            console.error('Error uploading file:', error);
            toast.error('Upload failed');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="flex items-center gap-4">
            <Button
                type="button"
                variant="outline"
                className="cursor-pointer"
                disabled={uploading}
                onClick={() => document.getElementById(`file-upload-${label.replace(/\s+/g, '-')}`)?.click()}
            >
                {uploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                {uploading ? 'Uploading...' : label}
            </Button>
            <input
                id={`file-upload-${label.replace(/\s+/g, '-')}`}
                type="file"
                className="hidden"
                accept="image/*,video/*"
                onChange={handleFileChange}
            />
        </div>
    );
};

export default FileUpload;
