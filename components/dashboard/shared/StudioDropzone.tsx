"use client";

import React, { useRef, useState } from "react";
import { Upload, FileAudio, FileVideo, FileText, CheckCircle2, X, AlertCircle } from "lucide-react";
import {
  STUDIO_DROPZONE_CLASS,
  STUDIO_DROPZONE_ACTIVE,
  STUDIO_SECONDARY_BUTTON,
} from "./studioDesignSystem";

export interface StudioDropzoneProps {
  accept: string;
  mediaType?: "audio" | "video" | "both" | "image";
  selectedFile: File | null;
  onSelectFile: (file: File | null) => void;
  maxSizeMB?: number;
  label?: string;
  helperText?: string;
  className?: string;
}

export default function StudioDropzone({
  accept,
  mediaType = "both",
  selectedFile,
  onSelectFile,
  maxSizeMB = 200,
  label,
  helperText,
  className = "",
}: StudioDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const defaultLabel =
    mediaType === "audio"
      ? "Upload speech voiceover or narration"
      : mediaType === "video"
      ? "Upload widescreen or vertical video"
      : mediaType === "image"
      ? "Upload scene images"
      : "Upload video or speech audio";

  const defaultHelper =
    mediaType === "audio"
      ? `MP3, WAV, M4A or AAC (up to ${maxSizeMB}MB)`
      : mediaType === "video"
      ? `MP4, MOV or WebM (up to ${maxSizeMB}MB)`
      : `MP4, MOV, MP3, WAV or M4A (up to ${maxSizeMB}MB)`;

  const handleFiles = (files: FileList | null) => {
    setErrorMsg(null);
    if (!files || files.length === 0) return;
    const file = files[0];

    // File size check
    if (file.size > maxSizeMB * 1024 * 1024) {
      setErrorMsg(`File exceeds maximum size of ${maxSizeMB}MB`);
      return;
    }

    onSelectFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  // If a file is selected, show the clean white SaaS uploaded state
  if (selectedFile) {
    const isAudio =
      selectedFile.type.startsWith("audio/") ||
      /\.(mp3|wav|m4a|aac)$/i.test(selectedFile.name);
    const sizeFormatted = (selectedFile.size / (1024 * 1024)).toFixed(1);

    return (
      <div className={`p-4 rounded-2xl border border-slate-200/90 bg-white shadow-xs ${className}`}>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-10 w-10 rounded-xl bg-orange-50 border border-orange-200/60 flex items-center justify-center shrink-0">
              {isAudio ? (
                <FileAudio size={20} className="text-orange-500" />
              ) : (
                <FileVideo size={20} className="text-orange-500" />
              )}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-xs font-black text-slate-900 truncate max-w-[220px] sm:max-w-md">
                  {selectedFile.name}
                </p>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200/60 shrink-0">
                  <CheckCircle2 size={10} />
                  Ready
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-500 mt-0.5">
                {sizeFormatted} MB • {isAudio ? "Audio Track" : "Video File"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className={STUDIO_SECONDARY_BUTTON}
            >
              Replace
            </button>
            <button
              type="button"
              onClick={() => {
                onSelectFile(null);
                if (fileInputRef.current) fileInputRef.current.value = "";
              }}
              className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
              title="Remove file"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>
    );
  }

  return (
    <div className={className}>
      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`${STUDIO_DROPZONE_CLASS} ${
          isDragging ? STUDIO_DROPZONE_ACTIVE : ""
        }`}
      >
        <div className="h-12 w-12 rounded-2xl bg-orange-50 border border-orange-200/60 flex items-center justify-center text-orange-500 group-hover:scale-105 group-hover:bg-orange-100 transition-all shadow-2xs">
          <Upload size={22} />
        </div>

        <div>
          <p className="text-xs sm:text-sm font-black text-slate-900 tracking-tight">
            {label || defaultLabel}
          </p>
          <p className="text-xs font-medium text-slate-500 mt-1">
            Drag and drop your file here, or{" "}
            <span className="text-orange-600 font-bold hover:underline">browse</span>
          </p>
        </div>

        <p className="text-[11px] font-semibold text-slate-400">
          {helperText || defaultHelper}
        </p>

        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {errorMsg && (
        <div className="mt-2.5 p-3 rounded-xl bg-rose-50 border border-rose-200/80 text-rose-700 text-xs font-semibold flex items-center gap-2">
          <AlertCircle size={15} className="shrink-0 text-rose-600" />
          <span>{errorMsg}</span>
        </div>
      )}
    </div>
  );
}

