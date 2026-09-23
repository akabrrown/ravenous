"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { uploadMedia } from "@/lib/actions";
import { Loader2, UploadCloud, X } from "lucide-react";
import { Input } from "@/components/ui/input";

interface MediaUploaderProps {
  onUploadSuccess: (mediaId: string, url: string) => void;
  currentMediaUrl?: string | null;
  label?: string;
  isMultiple?: boolean;
}

export function MediaUploader({ onUploadSuccess, currentMediaUrl, label = "Upload Image", isMultiple = false }: MediaUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentMediaUrl || null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Handle single file upload for now (if multiple, we loop, but let's do single for simplicity unless looping)
    // For isMultiple, we can process each file and call onUploadSuccess for each.
    setIsUploading(true);
    
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Show local preview immediately if it's the first image (for single)
        if (i === 0 && !isMultiple) {
          const objectUrl = URL.createObjectURL(file);
          setPreview(objectUrl);
        }

        const formData = new FormData();
        formData.append("file", file);

        const media = await uploadMedia(formData);
        
        if (media) {
          if (!isMultiple) {
            setPreview(media.deliveryUrl);
          }
          onUploadSuccess(media.id, media.deliveryUrl);
        }
      }
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload media. Please try again.");
      if (!isMultiple) {
        setPreview(currentMediaUrl || null); // revert
      }
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-3 w-full">
      <div className="text-sm font-medium leading-none">{label}</div>
      
      {!isMultiple && preview ? (
        <div className="relative group w-full h-48 bg-gray-100 rounded-md overflow-hidden border border-border">
          <img src={preview} alt="Preview" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Button 
              type="button"
              variant="destructive" 
              size="icon"
              onClick={() => { setPreview(null); onUploadSuccess("", ""); }}
            >
              <X size={16} />
            </Button>
          </div>
        </div>
      ) : (
        <div className="relative flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-md border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-colors bg-white">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            {isUploading ? (
              <Loader2 className="w-8 h-8 text-primary animate-spin mb-2" />
            ) : (
              <UploadCloud className="w-8 h-8 text-gray-400 mb-2" />
            )}
            <p className="mb-2 text-sm text-gray-500">
              <span className="font-semibold">{isUploading ? "Uploading..." : "Click to upload"}</span> or drag and drop
            </p>
            <p className="text-xs text-gray-500">SVG, PNG, JPG or GIF (MAX. 10MB)</p>
          </div>
          <Input 
            id="dropzone-file" 
            type="file" 
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
            onChange={handleFileChange}
            disabled={isUploading}
            multiple={isMultiple}
            accept="image/*,video/*"
          />
        </div>
      )}
    </div>
  );
}
