"use client";

import { Button } from "@/components/ui/button";
import { useCallback, useRef, useState } from "react";

interface ImageUploaderProps {
  onParsed: (data: { yield_g: number | null; duration_s: number | null }) => void;
}

export function ImageUploader({ onParsed }: ImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>("image/jpeg");
  const [base64, setBase64] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const processFile = (file: File) => {
    setMimeType(file.type);
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      const b64 = result.split(",")[1];
      setBase64(b64);
      setPreview(result);
    };
    reader.readAsDataURL(file);
  };

  const handleFile = (file: File | undefined) => {
    if (!file) return;
    processFile(file);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  }, []);

  const handleParse = async () => {
    if (!base64) return;
    setLoading(true);
    try {
      const res = await fetch("/api/parse-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: base64, mimeType }),
      });
      const data = await res.json();
      onParsed(data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          dragging ? "border-primary bg-primary/5" : "border-muted-foreground/30 hover:border-primary/50"
        }`}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        {preview ? (
          <img
            src={preview}
            alt="Scale preview"
            className="max-h-48 mx-auto rounded object-contain"
          />
        ) : (
          <p className="text-sm text-muted-foreground">
            Drop a scale photo here or click to upload
          </p>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
      </div>
      {base64 && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleParse}
          disabled={loading}
          className="w-full"
        >
          {loading ? "Parsing…" : "Parse Image with AI"}
        </Button>
      )}
    </div>
  );
}
