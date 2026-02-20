"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react";

interface ImageUploadProps {
    value: string;
    onChange: (url: string) => void;
    label?: string;
}

export default function ImageUpload({ value, onChange, label = "이미지" }: ImageUploadProps) {
    const [uploading, setUploading] = useState(false);
    const [dragOver, setDragOver] = useState(false);
    const [error, setError] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    const handleUpload = useCallback(async (file: File) => {
        setError("");

        if (file.size > 5 * 1024 * 1024) {
            setError("파일 크기는 5MB 이하여야 합니다."); return;
        }

        const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
        if (!allowedTypes.includes(file.type)) {
            setError("jpg, png, webp, gif만 지원"); return;
        }

        setUploading(true);
        try {
            const formData = new FormData();
            formData.append("file", file);
            const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "업로드 실패");
            }
            const data = await res.json();
            onChange(data.url);
        } catch (e) {
            setError(e instanceof Error ? e.message : "업로드에 실패했습니다.");
        } finally {
            setUploading(false);
        }
    }, [onChange]);

    const onDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files?.[0];
        if (file) handleUpload(file);
    }, [handleUpload]);

    const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleUpload(file);
        e.target.value = "";
    };

    return (
        <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                {label}
            </label>

            {value ? (
                <div className="relative group rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                    <img
                        src={value}
                        alt="Uploaded"
                        className="w-full h-48 object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                        <button
                            type="button"
                            onClick={() => inputRef.current?.click()}
                            className="p-2.5 rounded-lg bg-white/20 text-white hover:bg-white/30 transition-colors backdrop-blur-sm"
                        >
                            <Upload size={18} />
                        </button>
                        <button
                            type="button"
                            onClick={() => onChange("")}
                            className="p-2.5 rounded-lg bg-red-500/80 text-white hover:bg-red-500 transition-colors backdrop-blur-sm"
                        >
                            <X size={18} />
                        </button>
                    </div>
                </div>
            ) : (
                <div
                    onClick={() => !uploading && inputRef.current?.click()}
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={onDrop}
                    className={`
                        relative cursor-pointer rounded-xl border-2 border-dashed p-8
                        flex flex-col items-center justify-center gap-3 transition-all
                        ${dragOver
                            ? "border-accent bg-accent/5"
                            : "border-slate-300 dark:border-slate-600 hover:border-accent/50 hover:bg-accent/5"
                        }
                        ${uploading ? "pointer-events-none opacity-60" : ""}
                    `}
                >
                    {uploading ? (
                        <Loader2 size={28} className="text-accent animate-spin" />
                    ) : (
                        <div className="p-3 rounded-xl bg-accent/10">
                            <ImageIcon size={24} className="text-accent" />
                        </div>
                    )}
                    <div className="text-center">
                        <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                            {uploading ? "업로드 중..." : dragOver ? "여기에 놓으세요" : "클릭하거나 드래그하여 업로드"}
                        </p>
                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                            JPG, PNG, WebP, GIF · 최대 5MB
                        </p>
                    </div>
                </div>
            )}

            <input
                ref={inputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={onFileSelect}
                className="hidden"
            />

            {error && (
                <p className="mt-1.5 text-xs text-red-500">{error}</p>
            )}
        </div>
    );
}
