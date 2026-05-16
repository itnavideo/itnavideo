"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { FileAudio, UploadCloud, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/components/auth/AuthContext";
import { getMaxUploadBytes, getPipelineQualityLabel } from "@/lib/videoPipelineConfig";

const FREE_MAX_UPLOAD_BYTES = getMaxUploadBytes();
const PIPELINE_QUALITY = getPipelineQualityLabel();

export default function UploadBox({ onUploadStart }) {
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();
  const { user, loading } = useAuth();

  const handleFileChange = async (event) => {
    await handleFiles(Array.from(event.target.files || []));
    event.target.value = "";
  };

  const handleDrop = async (event) => {
    event.preventDefault();
    await handleFiles(Array.from(event.dataTransfer.files || []));
  };

  const handleFiles = async (files) => {
    const audioFile = files.find((file) => file.type.startsWith("audio/"));

    if (!audioFile) {
      toast.error("Voiceover audio is required.");
      return;
    }

    if (audioFile.size > FREE_MAX_UPLOAD_BYTES) {
      toast.error(`Free plan supports audio up to ${Math.round(FREE_MAX_UPLOAD_BYTES / (1024 * 1024))}MB for fast ${PIPELINE_QUALITY} exports. Use a shorter file now; Premium can unlock larger uploads later.`);
      return;
    }

    if (loading) return;

    if (!user) {
      toast.error("Please sign in before uploading.");
      router.push("/login");
      return;
    }

    setIsUploading(true);
    const title = audioFile.name.replace(/\.[^.]+$/, "") || "Faceless video project";

    try {
      onUploadStart?.(files);

      const voiceUrl = await uploadToCloudinary(audioFile, `itnavideo/uploads/${user.uid}`);
      const job = await startBackendJob({
        userId: user.uid,
        voiceoverUrl: voiceUrl,
        title,
      });
      saveLocalDashboardJob(user.uid, {
        id: job.jobId,
        title,
        status: "Queued",
        progress: 12,
        quality: PIPELINE_QUALITY,
        style: "reels_pacing",
        voiceUrl,
        timelineScenes: 0,
        captions: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      toast.success("Generation engine started. Watch live progress on dashboard.");
      router.push("/dashboard");
    } catch (error) {
      console.error("UploadBox generation start failed:", error);
      toast.error(error instanceof Error ? error.message : "Process failed to start.");
    } finally {
      setIsUploading(false);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      onDragOver={(event) => event.preventDefault()}
      onDrop={handleDrop}
      className={`rounded-lg border-2 border-dashed bg-zinc-950/80 p-8 text-center transition ${
        isUploading
          ? "border-white/10"
          : "border-brand-mint/40 shadow-[0_0_30px_rgba(94,234,212,0.12)] animate-pulse hover:border-brand-mint"
      }`}
    >
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="audio/*"
      />

      <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-lg bg-brand-mint/10 text-brand-mint">
        {isUploading ? (
          <Loader2 className="animate-spin" size={28} />
        ) : (
          <UploadCloud size={28} />
        )}
      </div>

      <h2 className="text-3xl font-black text-white">
        {isUploading ? "Starting render..." : "Upload faceless video audio"}
      </h2>
      
      <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-zinc-400">
        Add one clear MP3, WAV, or M4A file for the faceless workflow. For face-camera edits, use the dashboard create modal.
      </p>

      <div className="mx-auto mt-6 max-w-lg rounded-lg border border-dashed border-brand-mint/35 bg-brand-mint/5 px-5 py-4">
        <p className="text-sm font-bold text-zinc-300">Drag audio here or click to browse</p>
        <p className="mt-1 text-xs text-zinc-500">Voiceover audio is required to start generation.</p>
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-3">
        {[
          { label: "Faceless mode", icon: FileAudio },
          { label: `${PIPELINE_QUALITY} output`, icon: UploadCloud },
          { label: "About 1 minute", icon: Loader2 },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-bold text-zinc-300">
              <Icon className="mx-auto mb-2 text-brand-mint" size={18} />
              {item.label}
            </div>
          );
        })}
      </div>

      <button 
        onClick={triggerFileSelect}
        disabled={isUploading}
        className="mt-8 inline-flex items-center justify-center gap-2 rounded-lg bg-brand-mint px-8 py-4 font-black text-black transition hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isUploading ? <Loader2 className="animate-spin" size={18} /> : <FileAudio size={19} />}
        {isUploading ? "Processing..." : "Select voiceover audio"}
      </button>
    </div>
  );
}

async function uploadToCloudinary(file, folder) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("folder", folder);

  const response = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });
  const data = await response.json().catch(() => ({}));

  if (!response.ok || !data.url) {
    throw new Error(data.details || data.error || "Upload failed.");
  }

  return data.url;
}

async function startBackendJob({ userId, voiceoverUrl, title }) {
  const response = await fetch("/api/jobs/start", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userId,
      voiceoverUrl,
      title,
      config: {
        aspectRatio: "Portrait (9:16)",
        editingStyle: "reels_pacing",
        captionStyle: "Reels",
        quality: PIPELINE_QUALITY,
      },
    }),
  });
  const data = await response.json().catch(() => ({}));

  if (!response.ok || !data.success) {
    throw new Error(data.details || data.error || "Generation engine failed to start.");
  }

  return data;
}

function saveLocalDashboardJob(userId, job) {
  try {
    const storageKey = `itnavideo.projects.${userId}`;
    const existing = JSON.parse(window.localStorage.getItem(storageKey) || "[]");
    const withoutDuplicate = Array.isArray(existing) ? existing.filter((item) => item?.id !== job.id) : [];
    window.localStorage.setItem(storageKey, JSON.stringify([job, ...withoutDuplicate].slice(0, 20)));
  } catch (error) {
    console.warn("Local dashboard job save failed:", error);
  }
}
