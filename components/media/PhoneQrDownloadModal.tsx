/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useEffect } from "react";
import {
  Smartphone,
  Download,
  Copy,
  Check,
  X,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";

export interface PhoneQrDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string;
  title?: string;
  aspectRatio?: "9:16" | "16:9" | string;
}

export function PhoneQrDownloadModal({
  isOpen,
  onClose,
  videoUrl,
  title = "Itnavideo Cloud Render",
  aspectRatio = "9:16",
}: PhoneQrDownloadModalProps) {
  const [copied, setCopied] = useState(false);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !videoUrl) return null;

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=280x280&margin=2&data=${encodeURIComponent(
    videoUrl
  )}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(videoUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md rounded-3xl bg-[#0D1019] border border-white/15 p-6 shadow-2xl text-center space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 transition cursor-pointer"
          title="Close modal"
        >
          <X size={16} />
        </button>

        {/* Header Pill & Title */}
        <div className="space-y-1.5 pt-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30">
            <Smartphone size={13} className="text-amber-400" />
            <span>Send to Phone (Direct Download)</span>
          </div>
          <h3 className="text-lg font-black text-white tracking-tight line-clamp-1">
            {title}
          </h3>
          <p className="text-xs text-zinc-400">
            Save directly into your phone’s Camera Roll / Photos ready to post to Shorts, Reels &amp; TikTok.
          </p>
        </div>

        {/* High-Contrast QR Code Card */}
        <div className="flex flex-col items-center justify-center">
          <div className="p-3 bg-white rounded-2xl shadow-xl border-4 border-[#FFA000]/30 transition-transform hover:scale-105 duration-200">
            <img
              src={qrImageUrl}
              alt="Scan QR code with phone camera to download MP4"
              className="w-52 h-52 object-contain rounded-lg"
            />
          </div>
          <span className="text-[11px] font-semibold text-zinc-400 mt-2 flex items-center gap-1">
            <Sparkles size={11} className="text-amber-400" />
            Direct 1080p MP4 • Presigned AWS Cloud Link
          </span>
        </div>

        {/* 3 Simple Camera Steps */}
        <div className="grid grid-cols-3 gap-2 text-left bg-black/40 border border-white/10 rounded-2xl p-3">
          <div className="space-y-1">
            <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-black flex items-center justify-center">
              1
            </span>
            <p className="text-[10px] font-bold text-white">Open Camera</p>
            <p className="text-[9px] text-zinc-400 leading-tight">iPhone or Android default camera</p>
          </div>
          <div className="space-y-1 border-l border-white/5 pl-2">
            <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-black flex items-center justify-center">
              2
            </span>
            <p className="text-[10px] font-bold text-white">Point at QR</p>
            <p className="text-[9px] text-zinc-400 leading-tight">No special QR app needed</p>
          </div>
          <div className="space-y-1 border-l border-white/5 pl-2">
            <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-black flex items-center justify-center">
              3
            </span>
            <p className="text-[10px] font-bold text-white">Save Video</p>
            <p className="text-[9px] text-zinc-400 leading-tight">Tap link to save in Camera Roll</p>
          </div>
        </div>

        {/* Action Buttons: Copy Link & Direct Download */}
        <div className="flex items-center gap-2 pt-1">
          <button
            type="button"
            onClick={handleCopy}
            className="flex-1 py-3 px-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-bold text-zinc-200 hover:text-white transition flex items-center justify-center gap-1.5 cursor-pointer"
          >
            {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
            <span>{copied ? "Link Copied!" : "Copy Link"}</span>
          </button>

          <a
            href={videoUrl}
            download
            target="_blank"
            rel="noreferrer"
            className="py-3 px-4 rounded-xl bg-gradient-to-r from-[#FF5722] to-[#FFA000] text-black font-black text-xs flex items-center justify-center gap-1.5 hover:brightness-110 transition cursor-pointer shadow-md"
          >
            <Download size={14} />
            <span>Download on PC</span>
          </a>
        </div>
      </div>
    </div>
  );
}
export default PhoneQrDownloadModal;

