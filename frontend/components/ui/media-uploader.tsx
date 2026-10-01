"use client";

import { useId, useState } from "react";
import { Button } from "@/components/ui/button";
import { uploadMedia } from "@/lib/actions";
import { Loader2, UploadCloud, X, RefreshCw } from "lucide-react";

interface MediaUploaderProps {
  onUploadSuccess: (mediaId: string, url: string) => void;
  currentMediaUrl?: string | null;
  label?: string;
  isMultiple?: boolean;
}

export function MediaUploader({
  onUploadSuccess,
  currentMediaUrl,
  label = "Upload Image",
  isMultiple = false,
}: MediaUploaderProps) {
  // Unique id per component instance so multiple uploaders on one page don't clash
  const inputId = useId();
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentMediaUrl || null);
  const [error, setError] = useState<string | null>(null);

  const processFiles = async (files: FileList) => {
    if (!files || files.length === 0) return;
    setIsUploading(true);
    setError(null);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        if (i === 0 && !isMultiple) {
          setPreview(URL.createObjectURL(file));
        }

        const fd = new FormData();
        fd.append("file", file);

        const media = await uploadMedia(fd);

        if (media) {
          if (!isMultiple) setPreview(media.deliveryUrl);
          onUploadSuccess(media.id, media.deliveryUrl);
        }
      }
    } catch (err: any) {
      console.error("Upload failed:", err);
      setError("Upload failed — check your connection and try again.");
      if (!isMultiple) setPreview(currentMediaUrl || null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) processFiles(e.target.files);
    // Reset input value so the same file can be re-selected after an error
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files) processFiles(e.dataTransfer.files);
  };

  const handleClear = () => {
    setPreview(null);
    setError(null);
    onUploadSuccess("", "");
  };

  return (
    <div className="space-y-3 w-full">
      <div className="text-sm font-medium leading-none">{label}</div>

      {!isMultiple && preview ? (
        <div className="relative group w-full h-48 bg-gray-100 rounded-md overflow-hidden border border-border">
          <img src={preview} alt="Preview" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            {/* Replace button — triggers file picker without clearing current preview */}
            <label
              htmlFor={inputId}
              className="cursor-pointer inline-flex items-center gap-1 px-3 py-1.5 rounded text-xs font-semibold bg-white text-secondary hover:bg-gray-100 transition-colors"
            >
              <RefreshCw size={12} />
              Replace
            </label>
            <Button
              type="button"
              variant="destructive"
              size="icon"
              onClick={handleClear}
            >
              <X size={16} />
            </Button>
          </div>
        </div>
      ) : (
        <label
          htmlFor={inputId}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="relative flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-md border-gray-300 hover:bg-gray-50 hover:border-primary/50 transition-colors bg-white cursor-pointer"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6 pointer-events-none">
            {isUploading ? (
              <Loader2 className="w-8 h-8 text-primary animate-spin mb-2" />
            ) : (
              <UploadCloud className="w-8 h-8 text-gray-400 mb-2" />
            )}
            <p className="mb-1 text-sm text-gray-500">
              <span className="font-semibold">
                {isUploading ? "Uploading…" : "Click to upload"}
              </span>{" "}
              or drag and drop
            </p>
            <p className="text-xs text-gray-400">PNG, JPG, GIF, MP4 — max 10 MB</p>
          </div>
        </label>
      )}

      {/* Single hidden file input — always present, always tied to unique id */}
      <input
        id={inputId}
        type="file"
        className="sr-only"
        onChange={handleFileChange}
        disabled={isUploading}
        multiple={isMultiple}
        accept="image/*,video/*"
      />

      {isUploading && (
        <p className="text-xs text-primary flex items-center gap-1">
          <Loader2 size={12} className="animate-spin" /> Uploading, please wait…
        </p>
      )}

      {error && (
        <p className="text-xs text-destructive">{error}</p>
      )}
    </div>
  );
}
