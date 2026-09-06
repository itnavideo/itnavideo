"use client";

import React, { useState, useTransition } from "react";
import {
  Mic,
  FileText,
  Upload,
  CheckCircle2,
  Download,
  Scissors,
  Sparkles,
  RefreshCw,
  Hash,
  ListOrdered,
  AlignLeft,
  Volume2,
  Trash2,
  Play,
  RotateCcw,
  Check,
  ChevronDown,
  Code2,
  Layers,
} from "lucide-react";
import type { AudioCleanOptions, AudioCleanSegment } from "@/services/ai/audioCleanService";
import type { StructuredScriptBlock } from "@/services/ai/structuredScriptService";

interface AudioCleanStudioProps {
  selectedFile: File | null;
  onSelectFile: (file: File | null) => void;
  audioCleanOptions: any;
  setAudioCleanOptions: React.Dispatch<React.SetStateAction<any>>;
  audioCleanAnalysis: {
    transcript: string;
    segments: AudioCleanSegment[];
    structuredBlocks?: StructuredScriptBlock[];
    markdown?: string;
    originalDuration: number;
    estimatedCleanDuration: number;
    stats: {
      totalWords: number;
      repeatedTakesCount: number;
      silenceCount: number;
      fillerCount: number;
      secondsSaved: number;
    };
    rawTranscript?: any;
    mediaKey: string;
  } | null;
  setAudioCleanAnalysis: React.Dispatch<any>;
  isAnalyzingAudio: boolean;
  onReanalyzeWithScript?: (pastedScript: string) => Promise<void>;
  audioCleanResult: {
    outputUrl: string;
    originalDuration: number;
    cleanedDuration: number;
    removedSegments?: number;
    stats?: {
      repeatedTakesCut: number;
      silencesCut: number;
      fillersCut: number;
      durationSavedSeconds: number;
    };
  } | null;
  onCleanAudio: () => void;
  isCleaning: boolean;
}

export function AudioCleanStudio({
  selectedFile,
  onSelectFile,
  audioCleanOptions,
  setAudioCleanOptions,
  audioCleanAnalysis,
  setAudioCleanAnalysis,
  isAnalyzingAudio,
  onReanalyzeWithScript,
  audioCleanResult,
  onCleanAudio,
  isCleaning,
}: AudioCleanStudioProps) {
  // Option 1: Auto-detect & structure from audio
  // Option 2: Paste script and align
  const [activeTab, setActiveTab] = useState<"auto" | "paste">("auto");
  const [pastedScript, setPastedScript] = useState("");
  const [editorView, setEditorView] = useState<"blocks" | "markdown">("blocks");
  const [isPending, startTransition] = useTransition();

  // Toggle Keep/Cut for a specific segment
  const handleToggleSegment = (segmentId: string) => {
    if (!audioCleanAnalysis) return;
    const updatedSegments = audioCleanAnalysis.segments.map((seg) => {
      if (seg.id === segmentId) {
        return {
          ...seg,
          action: (seg.action === "cut" ? "keep" : "cut") as "keep" | "cut",
          reason: seg.action === "cut" ? undefined : ("repeat" as const),
        };
      }
      return seg;
    });

    // Update corresponding structured block action
    const updatedBlocks = (audioCleanAnalysis.structuredBlocks || []).map((blk) => {
      if (blk.segmentIds.includes(segmentId)) {
        const blkSegs = updatedSegments.filter((s) => blk.segmentIds.includes(s.id));
        const allCut = blkSegs.length > 0 && blkSegs.every((s) => s.action === "cut");
        return {
          ...blk,
          action: (allCut ? "cut" : "keep") as "keep" | "cut",
        };
      }
      return blk;
    });

    // Recalculate stats
    let totalCutSeconds = 0;
    for (const seg of updatedSegments) {
      if (seg.action === "cut") {
        totalCutSeconds += Math.max(0, seg.end - seg.start);
      }
    }
    const cleanDuration = Math.max(
      1,
      Number((audioCleanAnalysis.originalDuration - totalCutSeconds).toFixed(1))
    );

    setAudioCleanAnalysis({
      ...audioCleanAnalysis,
      segments: updatedSegments,
      structuredBlocks: updatedBlocks,
      estimatedCleanDuration: cleanDuration,
      stats: {
        ...audioCleanAnalysis.stats,
        repeatedTakesCount: updatedSegments.filter(
          (s) => s.action === "cut" && (s.reason === "repeat" || s.reason === "mistake")
        ).length,
        secondsSaved: Number(totalCutSeconds.toFixed(1)),
      },
    });
  };

  // Change block type (Heading #, Step, Explanation)
  const handleChangeBlockType = (blockId: string, newType: "heading" | "step" | "explanation") => {
    if (!audioCleanAnalysis || !audioCleanAnalysis.structuredBlocks) return;
    const updatedBlocks = audioCleanAnalysis.structuredBlocks.map((blk) => {
      if (blk.id === blockId) {
        return {
          ...blk,
          type: newType,
          headingLevel: newType === "heading" ? (blk.headingLevel || 1) : undefined,
          stepNumber: newType === "step" ? (blk.stepNumber || 1) : undefined,
        };
      }
      return blk;
    });
    setAudioCleanAnalysis({
      ...audioCleanAnalysis,
      structuredBlocks: updatedBlocks,
    });
  };

  // Edit block text inline
  const handleEditBlockText = (blockId: string, newText: string) => {
    if (!audioCleanAnalysis || !audioCleanAnalysis.structuredBlocks) return;
    const updatedBlocks = audioCleanAnalysis.structuredBlocks.map((blk) => {
      if (blk.id === blockId) {
        return {
          ...blk,
          text: newText,
          title: blk.type !== "explanation" ? newText : blk.title,
        };
      }
      return blk;
    });
    setAudioCleanAnalysis({
      ...audioCleanAnalysis,
      structuredBlocks: updatedBlocks,
    });
  };

  // Toggle Cut/Keep for an entire block
  const handleToggleBlockAction = (block: StructuredScriptBlock) => {
    if (!audioCleanAnalysis) return;
    const newAction = block.action === "cut" ? "keep" : "cut";
    const segmentIdsSet = new Set(block.segmentIds);

    const updatedSegments = audioCleanAnalysis.segments.map((seg) => {
      if (segmentIdsSet.has(seg.id)) {
        return {
          ...seg,
          action: newAction as "keep" | "cut",
          reason: newAction === "cut" ? ("repeat" as const) : undefined,
        };
      }
      return seg;
    });

    const updatedBlocks = (audioCleanAnalysis.structuredBlocks || []).map((b) => {
      if (b.id === block.id) {
        return { ...b, action: newAction as "keep" | "cut" };
      }
      return b;
    });

    let totalCutSeconds = 0;
    for (const seg of updatedSegments) {
      if (seg.action === "cut") {
        totalCutSeconds += Math.max(0, seg.end - seg.start);
      }
    }
    const cleanDuration = Math.max(
      1,
      Number((audioCleanAnalysis.originalDuration - totalCutSeconds).toFixed(1))
    );

    setAudioCleanAnalysis({
      ...audioCleanAnalysis,
      segments: updatedSegments,
      structuredBlocks: updatedBlocks,
      estimatedCleanDuration: cleanDuration,
      stats: {
        ...audioCleanAnalysis.stats,
        secondsSaved: Number(totalCutSeconds.toFixed(1)),
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* ── 2 Main Options Selector ── */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => setActiveTab("auto")}
          className={`relative flex items-start gap-3.5 rounded-2xl border p-4 text-left transition-all ${
            activeTab === "auto"
              ? "border-orange-500 bg-orange-500/10 shadow-lg shadow-orange-950/30"
              : "border-white/10 bg-zinc-900/60 hover:border-white/20 hover:bg-zinc-900"
          }`}
        >
          <div
            className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl border ${
              activeTab === "auto"
                ? "border-orange-500/40 bg-orange-500/20 text-orange-400"
                : "border-white/10 bg-zinc-800 text-zinc-400"
            }`}
          >
            <Mic size={20} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-black text-white">
                1. Audio se Structured Script
              </span>
              {activeTab === "auto" && (
                <span className="rounded-full bg-orange-500/20 px-2 py-0.5 text-[9px] font-bold text-orange-400">
                  Active
                </span>
              )}
            </div>
            <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
              Audio upload karein. AI auto-detect karke <b className="text-zinc-200"># Headings</b>, <b className="text-zinc-200">Steps</b> aur <b className="text-zinc-200">Explanations</b> ka structured script dega.
            </p>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("paste")}
          className={`relative flex items-start gap-3.5 rounded-2xl border p-4 text-left transition-all ${
            activeTab === "paste"
              ? "border-sky-500 bg-sky-500/10 shadow-lg shadow-sky-950/30"
              : "border-white/10 bg-zinc-900/60 hover:border-white/20 hover:bg-zinc-900"
          }`}
        >
          <div
            className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl border ${
              activeTab === "paste"
                ? "border-sky-500/40 bg-sky-500/20 text-sky-400"
                : "border-white/10 bg-zinc-800 text-zinc-400"
            }`}
          >
            <FileText size={20} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-black text-white">
                2. Paste Apna Script
              </span>
              {activeTab === "paste" && (
                <span className="rounded-full bg-sky-500/20 px-2 py-0.5 text-[9px] font-bold text-sky-400">
                  Active
                </span>
              )}
            </div>
            <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
              Apna pehle se likha script paste karein (# Headings aur Steps ke sath). AI audio speech ko script se align karega aur retakes cut karega.
            </p>
          </div>
        </button>
      </div>

      {/* ── Option 2: Pasted Script Input Box ── */}
      {activeTab === "paste" && (
        <div className="rounded-2xl border border-sky-500/20 bg-sky-950/20 p-4 sm:p-5 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Code2 size={16} className="text-sky-400" />
              <label htmlFor="pasted-script-input" className="text-xs font-black uppercase tracking-wider text-sky-200">
                Pasted Script with Headings (#) & Steps
              </label>
            </div>
            <span className="text-[11px] text-muted-foreground">
              Format: <code className="text-sky-300"># Heading</code>, <code className="text-amber-300">## Step 1</code>, explanation lines
            </span>
          </div>
          <textarea
            id="pasted-script-input"
            rows={5}
            value={pastedScript}
            onChange={(e) => setPastedScript(e.target.value)}
            placeholder={`# Hook / Intro\nAaj ke video me hum 3 secret growth tips dekhenge.\n\n## Step 1: Target Audience\nPehle apne niche ke exact audience ko identify karein.\n\n## Step 2: High Retention Hook\nStarting ke 3 seconds me viewers ka interest grab karein.`}
            className="w-full resize-y rounded-xl border border-white/10 bg-black/40 p-3.5 text-xs font-mono text-zinc-200 placeholder:text-zinc-600 focus:border-sky-500/60 focus:outline-none focus:ring-1 focus:ring-sky-500/40"
          />
          {selectedFile && onReanalyzeWithScript && (
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => {
                  if (pastedScript.trim()) {
                    onReanalyzeWithScript(pastedScript.trim());
                  }
                }}
                disabled={isAnalyzingAudio || !pastedScript.trim()}
                className="inline-flex items-center gap-2 rounded-xl bg-sky-600 hover:bg-sky-500 px-4 py-2 text-xs font-bold text-white transition disabled:opacity-50 cursor-pointer"
              >
                <RefreshCw size={13} className={isAnalyzingAudio ? "animate-spin" : ""} />
                <span>Align Audio with Pasted Script</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── File Upload / Selected File Zone ── */}
      {!selectedFile ? (
        <label className="upload-zone flex min-h-44 min-w-0 max-w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-white/15 bg-zinc-900/40 p-6 text-center transition hover:border-orange-500/50 hover:bg-orange-500/[0.03]">
          <input
            accept="audio/mp3,audio/wav,audio/m4a,audio/aac,audio/ogg,audio/webm,video/mp4"
            className="hidden"
            onChange={(e) => onSelectFile(e.target.files?.[0] || null)}
            type="file"
          />
          <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-400 border border-orange-500/20">
            <Upload size={26} />
          </div>
          <p className="text-sm font-bold text-white">
            {activeTab === "paste"
              ? "Audio upload karein jise script se match karna hai"
              : "Voiceover / Audio recording upload karein"}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            MP3, WAV, M4A, AAC, WEBM • Up to 15 minutes
          </p>
        </label>
      ) : (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-zinc-900/70 p-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-orange-500/15 text-orange-400 border border-orange-500/20">
              <Mic size={18} />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-white">{selectedFile.name}</p>
              <p className="text-xs text-muted-foreground">
                {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onSelectFile(null)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-1.5 text-xs font-bold text-red-300 transition hover:bg-red-500/20"
          >
            <Trash2 size={13} />
            <span>Change File</span>
          </button>
        </div>
      )}

      {/* ── Analyzing Banner ── */}
      {isAnalyzingAudio && (
        <div className="rounded-2xl border border-orange-500/30 bg-orange-500/10 p-5 text-center">
          <div className="mx-auto mb-2.5 grid h-12 w-12 place-items-center rounded-full bg-orange-500/20 text-orange-400 animate-pulse">
            <Sparkles size={24} />
          </div>
          <p className="text-sm font-black text-white">
            AI Speech Analysis & Script Structuring in Progress...
          </p>
          <p className="mx-auto mt-1 max-w-md text-xs text-orange-200/80">
            Whisper full audio transcribe kar raha hai aur script ko <b># Headings</b>, <b>Steps</b>, aur <b>Explanations</b> me structure kar raha hai.
          </p>
        </div>
      )}

      {/* ── Structured Script Studio Editor ── */}
      {audioCleanAnalysis && (
        <div className="rounded-2xl border border-white/15 bg-zinc-900/90 p-4 sm:p-5 shadow-2xl space-y-4">
          {/* Header Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <FileText size={18} className="text-orange-400" />
                <h3 className="text-sm font-black text-white tracking-wide">
                  Structured Script & Retake Editor
                </h3>
              </div>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Script structured hai (Headings, Steps, Explanations). Aap block type badal sakte hain (#H, Step), text edit kar sakte hain aur retakes toggle kar sakte hain.
              </p>
            </div>

            {/* View Mode & Metrics */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Duration pill */}
              <span className="rounded-lg border border-zinc-700 bg-zinc-800/80 px-2.5 py-1 text-xs font-bold text-zinc-300">
                ⏱️ {audioCleanAnalysis.originalDuration}s ➔{" "}
                <span className="text-emerald-400">
                  {audioCleanAnalysis.estimatedCleanDuration}s
                </span>
              </span>

              {audioCleanAnalysis.stats.repeatedTakesCount > 0 && (
                <span className="rounded-lg border border-red-500/30 bg-red-950/60 px-2.5 py-1 text-xs font-bold text-red-300">
                  🔁 {audioCleanAnalysis.stats.repeatedTakesCount} retakes cut
                </span>
              )}

              {audioCleanAnalysis.stats.silenceCount > 0 && (
                <span className="rounded-lg border border-amber-500/30 bg-amber-950/60 px-2.5 py-1 text-xs font-bold text-amber-300">
                  🔇 {audioCleanAnalysis.stats.silenceCount} silences
                </span>
              )}

              {/* View toggle */}
              <div className="inline-flex rounded-xl border border-white/10 bg-black/40 p-0.5">
                <button
                  type="button"
                  onClick={() => setEditorView("blocks")}
                  className={`rounded-lg px-2.5 py-1 text-xs font-bold transition ${
                    editorView === "blocks"
                      ? "bg-orange-500 text-white shadow-sm"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <Layers size={13} />
                    <span>Blocks</span>
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setEditorView("markdown")}
                  className={`rounded-lg px-2.5 py-1 text-xs font-bold transition ${
                    editorView === "markdown"
                      ? "bg-orange-500 text-white shadow-sm"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <Code2 size={13} />
                    <span>Markdown</span>
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* ── Editor View: Blocks ── */}
          {editorView === "blocks" ? (
            <div className="max-h-[460px] overflow-y-auto space-y-3.5 pr-1.5">
              {audioCleanAnalysis.structuredBlocks &&
              audioCleanAnalysis.structuredBlocks.length > 0 ? (
                audioCleanAnalysis.structuredBlocks.map((block) => {
                  const isCut = block.action === "cut";
                  const blockSegments = audioCleanAnalysis.segments.filter((s) =>
                    block.segmentIds.includes(s.id)
                  );

                  return (
                    <div
                      key={block.id}
                      className={`group rounded-xl border p-3.5 transition-all ${
                        isCut
                          ? "border-red-500/30 bg-red-950/15"
                          : block.type === "heading"
                          ? "border-purple-500/30 bg-purple-950/15"
                          : block.type === "step"
                          ? "border-amber-500/30 bg-amber-950/15"
                          : "border-white/10 bg-black/25 hover:border-white/20"
                      }`}
                    >
                      {/* Top Bar of Block: Type Pill & Action Controls */}
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          {/* Block Type Selector Pill */}
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleChangeBlockType(block.id, "heading")}
                              className={`rounded-md px-2 py-0.5 text-[10px] font-black uppercase tracking-wider transition ${
                                block.type === "heading"
                                  ? "bg-purple-500 text-white shadow"
                                  : "bg-white/5 text-zinc-400 hover:text-purple-300"
                              }`}
                            >
                              # Heading
                            </button>
                            <button
                              type="button"
                              onClick={() => handleChangeBlockType(block.id, "step")}
                              className={`rounded-md px-2 py-0.5 text-[10px] font-black uppercase tracking-wider transition ${
                                block.type === "step"
                                  ? "bg-amber-500 text-slate-950 shadow"
                                  : "bg-white/5 text-zinc-400 hover:text-amber-300"
                              }`}
                            >
                              ⚡ Step {block.stepNumber ? block.stepNumber : ""}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleChangeBlockType(block.id, "explanation")}
                              className={`rounded-md px-2 py-0.5 text-[10px] font-black uppercase tracking-wider transition ${
                                block.type === "explanation"
                                  ? "bg-sky-600 text-white shadow"
                                  : "bg-white/5 text-zinc-400 hover:text-sky-300"
                              }`}
                            >
                              💬 Explanation
                            </button>
                          </div>

                          {block.start !== undefined && block.end !== undefined && (
                            <span className="font-mono text-[10px] text-zinc-400">
                              {block.start.toFixed(1)}s - {block.end.toFixed(1)}s
                            </span>
                          )}
                        </div>

                        {/* Block Action: Cut / Keep entire block */}
                        <button
                          type="button"
                          onClick={() => handleToggleBlockAction(block)}
                          className={`rounded-lg px-2.5 py-1 text-[11px] font-bold transition ${
                            isCut
                              ? "bg-red-900/40 text-red-300 border border-red-700/50 hover:bg-red-900/70"
                              : "bg-zinc-800 text-zinc-300 border border-zinc-700 hover:bg-zinc-700"
                          }`}
                        >
                          {isCut ? "Restore Block" : "Cut Block"}
                        </button>
                      </div>

                      {/* Block Title / Content Editor */}
                      <div className="space-y-2">
                        {block.type === "heading" ? (
                          <input
                            type="text"
                            value={block.title || block.text}
                            onChange={(e) => handleEditBlockText(block.id, e.target.value)}
                            className={`w-full rounded-lg border border-purple-500/20 bg-purple-950/20 px-3 py-1.5 text-sm font-bold text-purple-200 focus:border-purple-500 focus:outline-none ${
                              isCut ? "line-through opacity-60" : ""
                            }`}
                            placeholder="# Heading Title..."
                          />
                        ) : block.type === "step" ? (
                          <input
                            type="text"
                            value={block.title || block.text}
                            onChange={(e) => handleEditBlockText(block.id, e.target.value)}
                            className={`w-full rounded-lg border border-amber-500/20 bg-amber-950/20 px-3 py-1.5 text-sm font-bold text-amber-200 focus:border-amber-500 focus:outline-none ${
                              isCut ? "line-through opacity-60" : ""
                            }`}
                            placeholder="Step Title / Action..."
                          />
                        ) : (
                          <textarea
                            rows={2}
                            value={block.text}
                            onChange={(e) => handleEditBlockText(block.id, e.target.value)}
                            className={`w-full resize-none rounded-lg border border-white/5 bg-black/30 p-2.5 text-xs leading-relaxed text-zinc-100 focus:border-sky-500/50 focus:outline-none ${
                              isCut ? "line-through text-red-300/60" : ""
                            }`}
                            placeholder="Explanation dialogue..."
                          />
                        )}

                        {/* Spoken Sentences List with 1-Click Cut / Restore Toggles */}
                        {blockSegments.length > 0 && (
                          <div className="mt-2 space-y-1.5 pt-1 border-t border-white/5">
                            {blockSegments.map((seg) => {
                              const segCut = seg.action === "cut";
                              return (
                                <div
                                  key={seg.id}
                                  onClick={() => handleToggleSegment(seg.id)}
                                  className={`flex items-start justify-between gap-2.5 rounded-lg p-2 text-xs transition cursor-pointer ${
                                    segCut
                                      ? "bg-red-950/25 border border-red-500/30 hover:border-red-500/50"
                                      : "bg-zinc-950/40 border border-white/5 hover:border-white/20"
                                  }`}
                                >
                                  <div className="space-y-0.5 min-w-0">
                                    <div className="flex items-center gap-2">
                                      <span className="font-mono text-[10px] text-zinc-500">
                                        {seg.start.toFixed(1)}s - {seg.end.toFixed(1)}s
                                      </span>
                                      {segCut && (
                                        <span className="rounded bg-red-500/20 px-1.5 py-0.2 text-[9px] font-bold text-red-400 border border-red-500/30">
                                          {seg.reason === "repeat"
                                            ? "🔁 Repeated Take"
                                            : seg.reason === "mistake"
                                            ? "⚠️ Mistake"
                                            : seg.reason === "silence"
                                            ? "🔇 Silence"
                                            : "Cut"}
                                        </span>
                                      )}
                                    </div>
                                    <p
                                      className={`text-xs ${
                                        segCut
                                          ? "line-through text-red-300/70"
                                          : "text-zinc-200"
                                      }`}
                                    >
                                      {seg.text}
                                    </p>
                                  </div>

                                  <button
                                    type="button"
                                    className={`shrink-0 rounded px-2 py-0.5 text-[10px] font-bold transition ${
                                      segCut
                                        ? "bg-red-900/40 text-red-300 hover:bg-red-900/70"
                                        : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                                    }`}
                                  >
                                    {segCut ? "Restore" : "Cut"}
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-4 text-center text-xs text-zinc-400">
                  {audioCleanAnalysis.transcript || "No transcript speech available."}
                </div>
              )}
            </div>
          ) : (
            /* ── Editor View: Raw Markdown ── */
            <div className="space-y-2">
              <textarea
                rows={12}
                value={
                  audioCleanAnalysis.markdown ||
                  audioCleanAnalysis.structuredBlocks
                    ?.map((b) =>
                      b.type === "heading"
                        ? `# ${b.title || b.text}`
                        : b.type === "step"
                        ? `## Step ${b.stepNumber || 1}: ${b.title || b.text}`
                        : b.text
                    )
                    .join("\n\n") ||
                  ""
                }
                onChange={(e) =>
                  setAudioCleanAnalysis({
                    ...audioCleanAnalysis,
                    markdown: e.target.value,
                  })
                }
                className="w-full resize-y rounded-xl border border-white/10 bg-black/40 p-4 font-mono text-xs leading-relaxed text-zinc-200 focus:border-orange-500 focus:outline-none"
              />
              <p className="text-[11px] text-muted-foreground">
                You can edit the script markdown directly. Lines starting with <code className="text-purple-300">#</code> act as section headings, <code className="text-amber-300">## Step</code> as steps.
              </p>
            </div>
          )}
        </div>
      )}

      {/* ── 3. AI Cleaning Controls & Options ── */}
      <div className="rounded-2xl border border-white/10 bg-zinc-900/60 p-4 sm:p-5 space-y-3">
        <div>
          <h4 className="text-sm font-black text-white">AI Audio Processing Filters</h4>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Customize which audio imperfections are automatically cut and polished by the engine.
          </p>
        </div>

        <div className="grid gap-2 sm:grid-cols-2">
          {([
            {
              key: "removeRepeats",
              label: "Remove Repeated Takes & Mistakes",
              desc: "Detects when you stuttered or re-said a line, keeping only your best take.",
            },
            {
              key: "removeSilence",
              label: "Remove Long Silence (>1.0s)",
              desc: "Trims dead air pauses down to a natural 0.3s breathing space.",
            },
            {
              key: "volumeNormalize",
              label: "Studio Volume Normalization",
              desc: "Uniform EBU R128 broadcast volume across entire voiceover.",
            },
            {
              key: "noiseReduction",
              label: "Background Noise Removal",
              desc: "FFT spectral gating to eliminate fan hum, AC noise, and room hiss.",
            },
            {
              key: "removeFillers",
              label: "Remove Filler Words",
              desc: 'Cuts "um", "uh", "ah" hesitation sounds.',
            },
            {
              key: "trimEnds",
              label: "Trim Start & End Dead Air",
              desc: "Removes silence before first word and after last word.",
            },
          ] as const).map((opt) => (
            <div
              key={opt.key}
              className="flex items-center justify-between rounded-xl border border-white/5 bg-black/20 p-3"
            >
              <div className="pr-3">
                <p className="text-xs font-bold text-foreground">{opt.label}</p>
                <p className="mt-0.5 text-[10px] leading-4 text-muted-foreground">{opt.desc}</p>
              </div>
              <button
                type="button"
                onClick={() =>
                  setAudioCleanOptions((prev: any) => ({
                    ...prev,
                    [opt.key]: !prev?.[opt.key],
                  }))
                }
                className={`relative h-5 w-9 shrink-0 rounded-full transition ${
                  audioCleanOptions[opt.key as keyof typeof audioCleanOptions]
                    ? "bg-orange-500"
                    : "bg-zinc-700"
                }`}
              >
                <span
                  className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${
                    audioCleanOptions[opt.key as keyof typeof audioCleanOptions]
                      ? "translate-x-[18px]"
                      : "translate-x-0.5"
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* ── 4. Main Clean Action Button ── */}
      <div className="flex flex-col items-center justify-center gap-3 pt-2">
        <button
          type="button"
          onClick={onCleanAudio}
          disabled={!selectedFile || isCleaning || isAnalyzingAudio}
          className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 px-6 py-4 text-sm font-black text-white shadow-xl shadow-orange-950/40 transition hover:from-orange-400 hover:to-amber-400 disabled:opacity-40 sm:w-auto sm:min-w-64 cursor-pointer"
        >
          {isCleaning ? (
            <>
              <RefreshCw size={18} className="animate-spin" />
              <span>Cleaning Audio with FFmpeg Engine...</span>
            </>
          ) : (
            <>
              <Scissors size={18} />
              <span>Clean Audio with AI</span>
            </>
          )}
        </button>
        <p className="text-[11px] text-muted-foreground text-center">
          Takes under 15 seconds • Spliced losslessly with broadcast EBU loudness normalization
        </p>
      </div>

      {/* ── 5. Clean Audio Result Player & Download ── */}
      {audioCleanResult && (
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-5 shadow-2xl space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-emerald-500/20 pb-3">
            <div className="flex items-center gap-2.5 text-emerald-400">
              <CheckCircle2 size={20} />
              <p className="text-sm font-black text-white">
                Cleaned Voiceover Ready!
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="rounded-lg border border-emerald-500/30 bg-emerald-900/40 px-2.5 py-1 text-xs font-bold text-emerald-300">
                ⏱️ {audioCleanResult.cleanedDuration}s (was {audioCleanResult.originalDuration}s)
              </span>
              {audioCleanResult.stats?.durationSavedSeconds ? (
                <span className="rounded-lg border border-emerald-400/30 bg-emerald-500/10 px-2.5 py-1 text-xs font-bold text-emerald-400">
                  ⚡ Saved {audioCleanResult.stats.durationSavedSeconds}s
                </span>
              ) : null}
            </div>
          </div>

          <audio
            src={audioCleanResult.outputUrl}
            controls
            className="w-full rounded-xl"
          />

          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-3 text-xs text-emerald-200/80">
              {audioCleanResult.stats?.repeatedTakesCut ? (
                <span>🔁 {audioCleanResult.stats.repeatedTakesCut} takes removed</span>
              ) : null}
              {audioCleanResult.stats?.silencesCut ? (
                <span>🔇 {audioCleanResult.stats.silencesCut} silences trimmed</span>
              ) : null}
            </div>

            <a
              href={audioCleanResult.outputUrl}
              download="cleaned-voiceover.mp3"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-2.5 text-xs font-black text-slate-950 transition hover:bg-emerald-400 shadow-lg shadow-emerald-950/40"
            >
              <Download size={15} />
              <span>Download Clean Audio (.mp3)</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
