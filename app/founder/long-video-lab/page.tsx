"use client";

import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  Check,
  Clock,
  Download,
  Film,
  ImageIcon,
  Loader2,
  Lock,
  Music,
  Play,
  Scissors,
  Shield,
  Sparkles,
  Upload,
  Volume2,
  X,
  Zap,
} from "lucide-react";
import { useAuth } from "@/components/auth/AuthContext";
import BrandLogo from "@/components/brand/BrandLogo";

const FOUNDER_EMAILS = ["itnavideo@gmail.com", "rohi@itnavideo.com"];

type LabState = "idle" | "uploading" | "processing" | "ready" | "error";

interface EditSettings {
  removeSilence: boolean;
  removeMistakes: boolean;
  addBgMusic: boolean;
  bgMusicStyle: "calm" | "corporate" | "upbeat" | "cinematic";
  addSoundEffects: boolean;
  addImages: boolean;
  addBroll: boolean;
  videoStyle: "finance-explainer" | "tutorial" | "review" | "story";
  targetLength: "short" | "medium" | "long";
}

const defaultSettings: EditSettings = {
  removeSilence: true,
  removeMistakes: true,
  addBgMusic: true,
  bgMusicStyle: "corporate",
  addSoundEffects: true,
  addImages: true,
  addBroll: true,
  videoStyle: "finance-explainer",
  targetLength: "medium",
};

const videoStyles = [
  { id: "finance-explainer", label: "Finance Explainer", description: "Loans, credit cards, personal finance" },
  { id: "tutorial", label: "Tutorial / How-To", description: "Step-by-step financial guides" },
  { id: "review", label: "Product Review", description: "Credit card or loan reviews" },
  { id: "story", label: "Story / Case Study", description: "Real financial stories and examples" },
];

const musicStyles = [
  { id: "calm", label: "Calm & Professional" },
  { id: "corporate", label: "Corporate" },
  { id: "upbeat", label: "Upbeat & Energetic" },
  { id: "cinematic", label: "Cinematic" },
];

export default function LongVideoLabPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [state, setState] = useState<LabState>("idle");
  const [message, setMessage] = useState("");
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [settings, setSettings] = useState<EditSettings>(defaultSettings);
  const [topicTitle, setTopicTitle] = useState("");
  const [topicDescription, setTopicDescription] = useState("");

  const isFounder = user?.email
    ? FOUNDER_EMAILS.includes(user.email.toLowerCase())
    : false;

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [loading, user, router]);

  // Block non-founder access
  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black text-white">
        <Loader2 size={20} className="animate-spin text-zinc-500" />
      </main>
    );
  }

  if (!user || !isFounder) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-black text-white gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 border border-red-500/20">
          <Lock size={24} className="text-red-400" />
        </div>
        <h1 className="text-xl font-black">Access Restricted</h1>
        <p className="text-sm text-zinc-400 max-w-md text-center">
          This is an internal testing lab. Only founder accounts can access this page.
        </p>
        <button
          onClick={() => router.push("/dashboard")}
          className="mt-4 rounded-xl bg-white/5 border border-white/10 px-5 py-2.5 text-sm font-bold text-zinc-300 hover:bg-white/10 transition"
        >
          Go to Dashboard
        </button>
      </main>
    );
  }

  const fileMeta = audioFile
    ? `${(audioFile.size / (1024 * 1024)).toFixed(1)} MB · ${audioFile.type || "audio file"}`
    : null;

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      if (!file.type.startsWith("audio/") && !file.type.startsWith("video/")) {
        setMessage("Please upload an audio or video file.");
        setState("error");
        return;
      }
      setAudioFile(file);
      setState("idle");
      setMessage("");
    }
    e.currentTarget.value = "";
  };

  const handleStartProcessing = () => {
    if (!audioFile) {
      setMessage("Please upload your audio/video first.");
      setState("error");
      return;
    }
    if (!topicTitle.trim()) {
      setMessage("Please enter a topic title.");
      setState("error");
      return;
    }

    // For now, just show the processing state as a placeholder
    // Actual local rendering will be connected later
    setState("processing");
    setMessage("Processing locally... This is a test flow. Local render integration coming soon.");

    // Simulate processing for demo
    setTimeout(() => {
      setState("ready");
      setMessage("Local processing complete (simulated). Connect local Remotion render for actual output.");
    }, 3000);
  };

  return (
    <main className="min-h-screen bg-[#0B1120] text-white">
      {/* Header */}
      <div className="border-b border-white/5 bg-black/50 backdrop-blur-sm sticky top-0 z-20">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <BrandLogo size="sm" />
            <div>
              <h1 className="text-sm font-black flex items-center gap-2">
                Long Video Lab
                <span className="rounded bg-yellow-500/10 border border-yellow-500/20 px-1.5 py-0.5 text-[9px] font-bold text-yellow-400 uppercase">
                  Internal
                </span>
              </h1>
              <p className="text-[10px] text-zinc-500">Finance Long-Form Video Editor · Local Render Only</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 rounded-lg bg-brand-mint/10 border border-brand-mint/20 px-2.5 py-1.5">
              <Shield size={11} className="text-brand-mint" />
              <span className="text-[10px] font-bold text-brand-mint">Founder Access</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        {/* Info banner */}
        <div className="mb-8 rounded-xl border border-yellow-500/20 bg-yellow-500/[0.04] p-4 flex items-start gap-3">
          <AlertTriangle size={16} className="shrink-0 text-yellow-400 mt-0.5" />
          <div>
            <p className="text-xs font-bold text-yellow-300">Internal Testing Only</p>
            <p className="text-[11px] text-zinc-400 mt-0.5">
              This video type uses local computer rendering — not AWS Lambda. Long videos can be expensive on cloud. Test locally first, then make public if results are good.
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr,340px]">
          {/* Left: Upload + Settings */}
          <div className="space-y-6">
            {/* Topic */}
            <div className="rounded-xl border border-white/8 bg-white/[0.02] p-5">
              <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <Film size={15} className="text-brand-mint" />
                Video Topic
              </h2>
              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold text-zinc-400 mb-1.5">Title</label>
                  <input
                    type="text"
                    value={topicTitle}
                    onChange={(e) => setTopicTitle(e.target.value)}
                    placeholder="e.g. Best Credit Cards 2025 in India"
                    className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:border-brand-mint/40 focus:outline-none focus:ring-1 focus:ring-brand-mint/20"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-zinc-400 mb-1.5">Description / Key Points (optional)</label>
                  <textarea
                    value={topicDescription}
                    onChange={(e) => setTopicDescription(e.target.value)}
                    placeholder="Describe key points to cover, comparisons, etc."
                    rows={3}
                    className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:border-brand-mint/40 focus:outline-none focus:ring-1 focus:ring-brand-mint/20 resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Upload */}
            <div className="rounded-xl border border-white/8 bg-white/[0.02] p-5">
              <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <Volume2 size={15} className="text-brand-mint" />
                Voice / Audio Upload
              </h2>
              <label className="flex min-h-36 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-white/15 bg-white/[0.02] p-5 text-center transition hover:border-brand-mint/30 hover:bg-brand-mint/[0.02]">
                <input
                  type="file"
                  accept="audio/*,video/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
                {audioFile ? (
                  <div className="space-y-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-mint/10 mx-auto">
                      <Check size={18} className="text-brand-mint" />
                    </div>
                    <p className="text-xs font-bold text-white">{audioFile.name}</p>
                    <p className="text-[10px] text-zinc-500">{fileMeta}</p>
                    <p className="text-[10px] text-brand-mint">Click to change file</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload size={24} className="text-zinc-500 mx-auto" />
                    <p className="text-xs font-bold text-zinc-300">Upload your voice recording</p>
                    <p className="text-[10px] text-zinc-500">MP3, WAV, M4A, MP4, MOV — any length</p>
                  </div>
                )}
              </label>
            </div>

            {/* Video Style */}
            <div className="rounded-xl border border-white/8 bg-white/[0.02] p-5">
              <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <Sparkles size={15} className="text-brand-mint" />
                Video Style
              </h2>
              <div className="grid grid-cols-2 gap-2">
                {videoStyles.map((style) => (
                  <button
                    key={style.id}
                    type="button"
                    onClick={() => setSettings((s) => ({ ...s, videoStyle: style.id as EditSettings["videoStyle"] }))}
                    className={`rounded-lg border p-3 text-left transition ${
                      settings.videoStyle === style.id
                        ? "border-brand-mint/50 bg-brand-mint/[0.06]"
                        : "border-white/8 bg-white/[0.02] hover:border-white/15"
                    }`}
                  >
                    <p className={`text-xs font-bold ${settings.videoStyle === style.id ? "text-brand-mint" : "text-white"}`}>
                      {style.label}
                    </p>
                    <p className="text-[10px] text-zinc-500 mt-0.5">{style.description}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Edit Settings + Actions */}
          <div className="space-y-5">
            {/* Edit Features */}
            <div className="rounded-xl border border-white/8 bg-white/[0.02] p-5">
              <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <Scissors size={15} className="text-brand-mint" />
                Edit Features
              </h2>
              <div className="space-y-3">
                {[
                  { key: "removeSilence", label: "Remove silence", desc: "Cut empty/quiet gaps", icon: Clock },
                  { key: "removeMistakes", label: "Remove mistakes", desc: "Cut uhh/umm/retakes", icon: X },
                  { key: "addBgMusic", label: "Background music", desc: "Add fitting music track", icon: Music },
                  { key: "addSoundEffects", label: "Sound effects", desc: "Whoosh, pop, transitions", icon: Zap },
                  { key: "addImages", label: "Relevant images", desc: "Auto-add context images", icon: ImageIcon },
                  { key: "addBroll", label: "B-roll clips", desc: "Add video footage cuts", icon: Play },
                ].map((feature) => (
                  <label
                    key={feature.key}
                    className="flex items-center gap-3 rounded-lg border border-white/5 bg-white/[0.01] px-3 py-2.5 cursor-pointer hover:bg-white/[0.03] transition"
                  >
                    <input
                      type="checkbox"
                      checked={settings[feature.key as keyof EditSettings] as boolean}
                      onChange={(e) => setSettings((s) => ({ ...s, [feature.key]: e.target.checked }))}
                      className="h-3.5 w-3.5 rounded border-white/20 bg-black accent-blue-500"
                    />
                    <feature.icon size={13} className="text-zinc-500 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-[11px] font-bold text-white">{feature.label}</p>
                      <p className="text-[9px] text-zinc-500">{feature.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Music Style */}
            {settings.addBgMusic && (
              <div className="rounded-xl border border-white/8 bg-white/[0.02] p-5">
                <h2 className="text-xs font-bold text-white mb-3">Music Style</h2>
                <div className="grid grid-cols-2 gap-2">
                  {musicStyles.map((ms) => (
                    <button
                      key={ms.id}
                      type="button"
                      onClick={() => setSettings((s) => ({ ...s, bgMusicStyle: ms.id as EditSettings["bgMusicStyle"] }))}
                      className={`rounded-lg border px-2.5 py-2 text-[10px] font-bold transition ${
                        settings.bgMusicStyle === ms.id
                          ? "border-brand-mint/40 bg-brand-mint/[0.06] text-brand-mint"
                          : "border-white/8 text-zinc-400 hover:border-white/15"
                      }`}
                    >
                      {ms.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Target Length */}
            <div className="rounded-xl border border-white/8 bg-white/[0.02] p-5">
              <h2 className="text-xs font-bold text-white mb-3">Target Length</h2>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "short", label: "5-8 min" },
                  { id: "medium", label: "8-15 min" },
                  { id: "long", label: "15-25 min" },
                ].map((len) => (
                  <button
                    key={len.id}
                    type="button"
                    onClick={() => setSettings((s) => ({ ...s, targetLength: len.id as EditSettings["targetLength"] }))}
                    className={`rounded-lg border px-2.5 py-2 text-[10px] font-bold transition ${
                      settings.targetLength === len.id
                        ? "border-brand-mint/40 bg-brand-mint/[0.06] text-brand-mint"
                        : "border-white/8 text-zinc-400 hover:border-white/15"
                    }`}
                  >
                    {len.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Action */}
            <button
              onClick={handleStartProcessing}
              disabled={!audioFile || !topicTitle.trim() || state === "processing"}
              className="w-full rounded-xl bg-brand-mint px-5 py-3.5 text-sm font-black text-black transition hover:bg-brand-mint/90 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {state === "processing" ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  Processing Locally...
                </>
              ) : (
                <>
                  <Sparkles size={15} />
                  Start Local Processing
                </>
              )}
            </button>

            {/* Status */}
            {message && (
              <div className={`rounded-lg border p-3 text-xs ${
                state === "error"
                  ? "border-red-500/20 bg-red-500/[0.04] text-red-300"
                  : state === "ready"
                  ? "border-brand-mint/20 bg-brand-mint/[0.04] text-brand-mint"
                  : "border-yellow-500/20 bg-yellow-500/[0.04] text-yellow-300"
              }`}>
                {message}
              </div>
            )}

            {/* Render info */}
            <div className="rounded-lg border border-white/5 bg-zinc-900/50 p-3">
              <p className="text-[10px] text-zinc-500 leading-relaxed">
                <strong className="text-zinc-400">Render mode:</strong> Local computer only.
                Not using AWS Lambda. This avoids cloud costs while testing long-form video quality.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
