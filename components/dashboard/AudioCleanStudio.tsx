"use client";

import React, { useState, useTransition, useMemo } from "react";
import {
  Mic,
  FileText,
  Upload,
  CheckCircle2,
  Download,
  Sparkles,
  RefreshCw,
  Hash,
  ListOrdered,
  AlignLeft,
  Volume2,
  Play,
  Pause,
  RotateCcw,
  Check,
  ChevronDown,
  Layers,
  Copy,
  Scissors,
  Sliders,
  ShieldCheck,
  Music2,
  FileAudio,
  AlertCircle,
  HelpCircle,
} from "lucide-react";
import type { AudioCleanSegment } from "@/services/ai/audioCleanService";
import type { StructuredScriptBlock, ScriptBlockSentence } from "@/services/ai/structuredScriptService";
import { blocksToMarkdown } from "@/services/ai/structuredScriptService";

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
  const [editorView, setEditorView] = useState<"document" | "markdown">("document");
  const [copiedScript, setCopiedScript] = useState(false);

  // Format seconds to mm:ss
  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Toggle sentence cut/keep inside a block
  const handleToggleSentence = (blockIndex: number, sentenceId: string, segmentId?: string) => {
    if (!audioCleanAnalysis?.structuredBlocks) return;

    const blocks = [...audioCleanAnalysis.structuredBlocks];
    const targetBlock = blocks[blockIndex];
    if (!targetBlock) return;

    let targetAction: "keep" | "cut" = "keep";

    // Update sentence in block
    if (targetBlock.sentences && targetBlock.sentences.length > 0) {
      targetBlock.sentences = targetBlock.sentences.map((sent) => {
        if (sent.id === sentenceId || (segmentId && sent.id === segmentId)) {
          const newAct = (sent.action === "cut" ? "keep" : "cut") as "keep" | "cut";
          targetAction = newAct;
          return {
            ...sent,
            action: newAct,
            reason: newAct === "cut" ? ("repeat" as const) : undefined,
          };
        }
        return sent;
      });
    }

    // Update corresponding segments in audioCleanAnalysis.segments
    const updatedSegments = (audioCleanAnalysis.segments || []).map((seg) => {
      if (seg.id === sentenceId || (segmentId && seg.id === segmentId)) {
        return {
          ...seg,
          action: targetAction,
          reason: targetAction === "cut" ? ("repeat" as const) : undefined,
        };
      }
      return seg;
    });

    // Check if entire block is cut
    const allSentencesCut =
      targetBlock.sentences &&
      targetBlock.sentences.length > 0 &&
      targetBlock.sentences.every((s) => s.action === "cut");
    targetBlock.action = allSentencesCut ? "cut" : "keep";

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
      structuredBlocks: blocks,
      estimatedCleanDuration: cleanDuration,
      markdown: blocksToMarkdown(blocks),
      stats: {
        ...audioCleanAnalysis.stats,
        repeatedTakesCount: updatedSegments.filter(
          (s) => s.action === "cut" && (s.reason === "repeat" || s.reason === "mistake")
        ).length,
        secondsSaved: Number(totalCutSeconds.toFixed(1)),
      },
    });
  };

  const handleChangeBlockType = (blockIndex: number, newType: "heading" | "step" | "explanation") => {
    if (!audioCleanAnalysis?.structuredBlocks) return;
    const blocks = [...audioCleanAnalysis.structuredBlocks];
    if (!blocks[blockIndex]) return;

    blocks[blockIndex] = {
      ...blocks[blockIndex],
      type: newType,
      title:
        newType === "heading" && !blocks[blockIndex].title
          ? blocks[blockIndex].text?.slice(0, 50) || "Section Heading"
          : newType === "step" && !blocks[blockIndex].title
            ? `Step ${blockIndex + 1}: ${blocks[blockIndex].text?.slice(0, 40) || "Action point"}`
            : blocks[blockIndex].title,
    };

    setAudioCleanAnalysis({
      ...audioCleanAnalysis,
      structuredBlocks: blocks,
      markdown: blocksToMarkdown(blocks),
    });
  };

  const handleEditTitle = (blockIndex: number, newTitle: string) => {
    if (!audioCleanAnalysis?.structuredBlocks) return;
    const blocks = [...audioCleanAnalysis.structuredBlocks];
    if (!blocks[blockIndex]) return;
    blocks[blockIndex] = { ...blocks[blockIndex], title: newTitle };
    setAudioCleanAnalysis({
      ...audioCleanAnalysis,
      structuredBlocks: blocks,
      markdown: blocksToMarkdown(blocks),
    });
  };

  const handleCopyScript = () => {
    const textToCopy =
      audioCleanAnalysis?.markdown ||
      (audioCleanAnalysis?.structuredBlocks
        ? blocksToMarkdown(audioCleanAnalysis.structuredBlocks)
        : audioCleanAnalysis?.transcript || "");
    if (textToCopy) {
      navigator.clipboard.writeText(textToCopy);
      setCopiedScript(true);
      setTimeout(() => setCopiedScript(false), 2000);
    }
  };

  const handleToggleOption = (key: string) => {
    setAudioCleanOptions((prev: any) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const wordCount = useMemo(() => {
    if (audioCleanAnalysis?.stats?.totalWords) return audioCleanAnalysis.stats.totalWords;
    if (audioCleanAnalysis?.transcript) {
      return audioCleanAnalysis.transcript.trim().split(/\s+/).filter(Boolean).length;
    }
    return 0;
  }, [audioCleanAnalysis]);

  const blocksCount = audioCleanAnalysis?.structuredBlocks?.length || 0;
  const stepsCount = (audioCleanAnalysis?.structuredBlocks || []).filter((b) => b.type === "step").length;

  return (
    <div className="w-full space-y-6">
      {/* 1. TOP HEADER & WORKFLOW SELECTOR */}
      <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[#1a1822] p-6 shadow-2xl sm:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#d0bcff]/20 bg-[#381e72]/40 px-3.5 py-1 text-xs font-semibold text-[#eaddff]">
              <Sparkles size={13} className="text-[#d0bcff]" />
              AI Voiceover Cleaning & Script Studio
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Clean Studio Voiceover & Script Review
            </h2>
            <p className="max-w-2xl text-xs sm:text-sm leading-relaxed text-[#ccc2dc]">
              Upload your raw voiceover audio. AI detects retakes, repeated mistakes, and dead silences,
              giving you a broadcast-mastered MP3 without cutting valid sentences.
            </p>
          </div>

          {/* TWO CLEAR OPTIONS */}
          <div className="inline-flex rounded-full border border-white/10 bg-[#121118] p-1.5 shadow-inner">
            <button
              type="button"
              onClick={() => setActiveTab("auto")}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold transition-all ${
                activeTab === "auto"
                  ? "border border-[#d0bcff]/40 bg-[#381e72] text-[#eaddff] shadow-md"
                  : "text-[#cac4d0] hover:text-white"
              }`}
            >
              <Mic size={14} />
              Option 1: Extract Script from Audio
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("paste")}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold transition-all ${
                activeTab === "paste"
                  ? "border border-[#d0bcff]/40 bg-[#381e72] text-[#eaddff] shadow-md"
                  : "text-[#cac4d0] hover:text-white"
              }`}
            >
              <FileText size={14} />
              Option 2: Paste My Script
            </button>
          </div>
        </div>

        {/* AUDIO UPLOAD BOX */}
        <div className="mt-6 rounded-2xl border border-white/10 bg-[#22202c] p-4 transition hover:border-white/20">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#381e72]/60 text-[#d0bcff] shadow-md">
                <FileAudio size={24} />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="truncate text-sm font-semibold text-white">
                    {selectedFile ? selectedFile.name : "Upload Voiceover Audio File"}
                  </p>
                  {selectedFile && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[11px] font-bold text-emerald-400 border border-emerald-500/30">
                      <Check size={11} /> Audio Ready
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#cac4d0]">
                  {selectedFile
                    ? `${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB • Up to 60 min supported (M4A, MP3, WAV, AAC)`
                    : "Supports MP3, M4A, WAV, AAC, MP4, MOV (Up to 60 minutes full duration)"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-full border border-white/15 bg-[#2b2837] px-4 py-2 text-xs font-semibold text-[#eaddff] transition hover:bg-[#363345] hover:border-[#d0bcff]/30">
                <Upload size={14} />
                {selectedFile ? "Change Audio" : "Select Audio File"}
                <input
                  type="file"
                  accept="audio/*,video/*,.mp3,.m4a,.wav,.aac,.mp4,.mov"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) onSelectFile(file);
                  }}
                />
              </label>
            </div>
          </div>
        </div>

        {/* OPTION 2: PASTE SCRIPT INPUT */}
        {activeTab === "paste" && (
          <div className="mt-5 space-y-3 rounded-2xl border border-[#d0bcff]/20 bg-[#121118] p-5 shadow-lg">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#d0bcff] flex items-center gap-1.5">
                  <FileText size={14} />
                  Paste Your Intended Script (# Headings, Step 1, Step 2...)
                </label>
                <p className="text-[11px] text-[#cac4d0] mt-0.5">
                  AI compares audio against your canonical text to find retakes while guaranteeing 100% of your script lines are protected.
                </p>
              </div>
              <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded-full">
                Protected Mode
              </span>
            </div>
            <textarea
              value={pastedScript}
              onChange={(e) => setPastedScript(e.target.value)}
              placeholder={`# How to Build Wealth from Zero\n\nSTEP 1 — Understand Where Your Money is Going\nBefore you think about investing, or building wealth, you need to understand your money.\nThink about it. If you don't know where your salary goes every month, how can you control it?\n\nSTEP 2 — Spend Less Than You Earn\nThis sounds extremely obvious, doesn't it?\nYet most people fail here.`}
              rows={7}
              className="w-full resize-y rounded-xl border border-white/15 bg-[#1a1822] p-4 font-mono text-xs leading-relaxed text-[#eaddff] placeholder:text-zinc-600 focus:border-[#d0bcff] focus:outline-none focus:ring-1 focus:ring-[#d0bcff]"
            />
            {onReanalyzeWithScript && selectedFile && (
              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-zinc-400">
                  {pastedScript.trim() ? `${pastedScript.trim().split(/\s+/).length} words in script` : "Paste your script above"}
                </span>
                <button
                  type="button"
                  disabled={isAnalyzingAudio || !pastedScript.trim()}
                  onClick={() => onReanalyzeWithScript(pastedScript)}
                  className="inline-flex items-center gap-2 rounded-full border border-[#d0bcff]/40 bg-[#381e72] px-5 py-2.5 text-xs font-bold text-[#eaddff] shadow-md transition hover:bg-[#4f378b] disabled:opacity-50"
                >
                  <Sparkles size={14} className="text-[#d0bcff]" />
                  {isAnalyzingAudio ? "Aligning Audio to Script..." : "Align & Verify Audio with Script"}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 2. LOADING STATE */}
      {isAnalyzingAudio && (
        <div className="rounded-[28px] border border-white/10 bg-[#1a1822] p-10 text-center shadow-xl">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#381e72]/40 text-[#d0bcff]">
            <RefreshCw size={26} className="animate-spin" />
          </div>
          <h3 className="mt-4 text-lg font-bold text-white">Transcribing & Aligning Script...</h3>
          <p className="mt-1 text-xs text-[#ccc2dc]">
            Groq Whisper is processing speech, structuring sections, and matching duplicate takes.
          </p>
        </div>
      )}

      {/* 3. STRUCTURED SCRIPT DOCUMENT BOARD (COMPACT & SCROLLABLE) */}
      {audioCleanAnalysis && !isAnalyzingAudio && (
        <div className="rounded-[28px] border border-white/10 bg-[#1a1822] shadow-2xl overflow-hidden">
          {/* Top Bar with Stats & View Toggle */}
          <div className="flex flex-col gap-3 border-b border-white/10 p-5 sm:flex-row sm:items-center sm:justify-between sm:px-6 bg-[#16141e]">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#d0bcff]/30 bg-[#381e72]/40 px-3 py-1 text-xs font-bold text-[#eaddff]">
                <Layers size={13} className="text-[#d0bcff]" />
                {stepsCount > 0 ? `${stepsCount} Steps (${blocksCount} Sections)` : `${blocksCount} Sections`}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-[#22202c] px-3 py-1 text-xs font-semibold text-[#cac4d0]">
                {wordCount} Words
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-[#22202c] px-3 py-1 text-xs font-semibold text-[#cac4d0]">
                Original: {formatTime(audioCleanAnalysis.originalDuration)} → Clean: {formatTime(audioCleanAnalysis.estimatedCleanDuration)}
              </span>
              {audioCleanAnalysis.stats?.repeatedTakesCount > 0 && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-300">
                  <Scissors size={12} />
                  {audioCleanAnalysis.stats.repeatedTakesCount} Retakes Detected
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <div className="inline-flex rounded-full border border-white/10 bg-[#121118] p-1">
                <button
                  type="button"
                  onClick={() => setEditorView("document")}
                  className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                    editorView === "document"
                      ? "bg-[#381e72] text-[#eaddff]"
                      : "text-[#cac4d0] hover:text-white"
                  }`}
                >
                  Document View
                </button>
                <button
                  type="button"
                  onClick={() => setEditorView("markdown")}
                  className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                    editorView === "markdown"
                      ? "bg-[#381e72] text-[#eaddff]"
                      : "text-[#cac4d0] hover:text-white"
                  }`}
                >
                  Markdown View
                </button>
              </div>

              <button
                type="button"
                onClick={handleCopyScript}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-[#22202c] px-3 py-1 text-xs font-semibold text-[#eaddff] transition hover:bg-[#2b2837]"
              >
                {copiedScript ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                {copiedScript ? "Copied" : "Copy"}
              </button>
            </div>
          </div>

          {/* AI SAFEGUARD BANNER */}
          <div className="bg-emerald-950/20 border-b border-emerald-500/20 px-6 py-2.5 flex items-center justify-between text-xs text-emerald-300">
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-emerald-400 shrink-0" />
              <span>
                <strong>Script Safeguard Active:</strong> All canonical script sentences are protected and kept intact. Only verified speech stumbles and duplicate takes are flagged for cutting.
              </span>
            </div>
            <span className="text-[11px] text-zinc-400 hidden sm:inline">
              Click any highlighted retake to restore
            </span>
          </div>

          {/* SCROLLABLE DOCUMENT VIEW (CONTAINED & COMPACT) */}
          <div className="p-5 sm:p-6">
            {editorView === "document" ? (
              <div className="max-h-[580px] overflow-y-auto pr-2 space-y-4 scrollbar-thin scrollbar-thumb-zinc-700/60 scrollbar-track-transparent">
                {(audioCleanAnalysis.structuredBlocks && audioCleanAnalysis.structuredBlocks.length > 0
                  ? audioCleanAnalysis.structuredBlocks
                  : [
                      {
                        id: "b-0",
                        type: "explanation" as const,
                        text: audioCleanAnalysis.transcript || "",
                        segmentIds: [],
                        sentences: [],
                      },
                    ]
                ).map((block, bIdx) => {
                  const isHeading = block.type === "heading";
                  const isStep = block.type === "step";

                  // Sentences to render
                  const sentences: ScriptBlockSentence[] =
                    block.sentences && block.sentences.length > 0
                      ? block.sentences
                      : (block.segmentIds && block.segmentIds.length > 0
                          ? audioCleanAnalysis.segments.filter((s) => block.segmentIds.includes(s.id))
                          : [{ id: `s-${bIdx}`, text: block.text, action: "keep" as const, reason: undefined }]
                        ).map((s) => ({
                          id: s.id,
                          text: s.text,
                          action: s.action,
                          reason: s.reason,
                        }));

                  return (
                    <div
                      key={block.id || bIdx}
                      className="group rounded-2xl border border-white/10 bg-[#1e1c26] p-4 sm:p-5 transition hover:border-white/20"
                    >
                      {/* Section Header */}
                      <div className="flex items-center justify-between gap-3 border-b border-white/5 pb-3">
                        <div className="flex items-center gap-2">
                          {isStep ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/20 border border-amber-500/40 px-3 py-1 text-xs font-black uppercase tracking-wider text-amber-300">
                              <ListOrdered size={13} />
                              Step {block.stepNumber || bIdx}
                            </span>
                          ) : isHeading ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-[#381e72]/60 border border-[#d0bcff]/40 px-3 py-1 text-xs font-bold text-[#eaddff]">
                              <Hash size={13} />
                              Heading
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-full bg-white/5 border border-white/10 px-2.5 py-0.5 text-xs text-zinc-400">
                              <AlignLeft size={12} /> Section
                            </span>
                          )}

                          <input
                            type="text"
                            value={block.title || block.text || ""}
                            onChange={(e) => handleEditTitle(bIdx, e.target.value)}
                            placeholder={isHeading ? "Heading..." : isStep ? "Step title..." : "Section title..."}
                            className="bg-transparent text-sm sm:text-base font-bold text-white px-1.5 py-0.5 rounded hover:bg-white/5 focus:bg-[#121118] focus:outline-none focus:ring-1 focus:ring-[#d0bcff] transition-all w-full max-w-lg"
                          />
                        </div>

                        {/* Quick block type switcher */}
                        <div className="opacity-40 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleChangeBlockType(bIdx, isStep ? "heading" : "step")}
                            title={isStep ? "Convert to Heading" : "Convert to Step"}
                            className="text-[11px] font-medium text-zinc-400 hover:text-white px-2 py-0.5 rounded border border-white/10 hover:bg-white/5"
                          >
                            {isStep ? "To Heading" : "To Step"}
                          </button>
                        </div>
                      </div>

                      {/* Continuous Paragraph Flow with Interactive Sentences */}
                      <div className="mt-3.5 text-xs sm:text-sm leading-relaxed text-zinc-200">
                        {sentences.map((sent, sIdx) => {
                          const isCut = sent.action === "cut";

                          return (
                            <span
                              key={sent.id || sIdx}
                              onClick={() => handleToggleSentence(bIdx, sent.id)}
                              title={isCut ? "Click to RESTORE this take" : "Click to CUT this take"}
                              className={`inline cursor-pointer transition-all rounded px-1 py-0.5 -mx-0.5 mr-1.5 ${
                                isCut
                                  ? "bg-red-950/40 border border-red-500/30 text-red-300 line-through hover:bg-red-900/60"
                                  : "hover:bg-[#381e72]/30 hover:text-white"
                              }`}
                            >
                              {sent.text}
                              {isCut && (
                                <span className="ml-1 inline-flex items-center gap-0.5 rounded bg-red-500/20 px-1 py-0.2 text-[9px] font-bold uppercase tracking-wider text-red-300 no-underline border border-red-500/40">
                                  ✂️ Cut
                                </span>
                              )}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-2xl border border-white/10 bg-[#121118] p-5">
                <pre className="max-h-[540px] overflow-y-auto whitespace-pre-wrap font-mono text-xs leading-relaxed text-[#eaddff]">
                  {audioCleanAnalysis.markdown ||
                    (audioCleanAnalysis.structuredBlocks
                      ? blocksToMarkdown(audioCleanAnalysis.structuredBlocks)
                      : audioCleanAnalysis.transcript)}
                </pre>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4. PROCESSING FILTERS */}
      <div className="rounded-[28px] border border-white/10 bg-[#1a1822] p-6 shadow-2xl sm:p-7">
        <div className="flex items-center gap-2 border-b border-white/10 pb-4">
          <Sliders size={18} className="text-[#d0bcff]" />
          <h3 className="text-base font-bold text-white">Audio Processing Filters</h3>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div
            onClick={() => handleToggleOption("removeRepeats")}
            className="flex cursor-pointer items-start justify-between rounded-2xl border border-white/10 bg-[#22202c] p-4 transition hover:border-white/20"
          >
            <div className="space-y-1">
              <p className="text-sm font-semibold text-white">Remove Retakes & Stutters</p>
              <p className="text-xs text-[#cac4d0]">
                Auto-cuts false starts and repeated takes
              </p>
            </div>
            <div
              className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
                audioCleanOptions.removeRepeats ? "bg-[#381e72]" : "bg-zinc-700"
              }`}
            >
              <span
                className={`absolute top-1 h-4 w-4 rounded-full bg-[#d0bcff] transition-transform ${
                  audioCleanOptions.removeRepeats ? "left-6" : "left-1"
                }`}
              />
            </div>
          </div>

          <div
            onClick={() => handleToggleOption("removeSilence")}
            className="flex cursor-pointer items-start justify-between rounded-2xl border border-white/10 bg-[#22202c] p-4 transition hover:border-white/20"
          >
            <div className="space-y-1">
              <p className="text-sm font-semibold text-white">Smart Silence Trimming</p>
              <p className="text-xs text-[#cac4d0]">
                Shortens pauses & dead air over 0.8s
              </p>
            </div>
            <div
              className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
                audioCleanOptions.removeSilence ? "bg-[#381e72]" : "bg-zinc-700"
              }`}
            >
              <span
                className={`absolute top-1 h-4 w-4 rounded-full bg-[#d0bcff] transition-transform ${
                  audioCleanOptions.removeSilence ? "left-6" : "left-1"
                }`}
              />
            </div>
          </div>

          <div
            onClick={() => handleToggleOption("volumeNormalize")}
            className="flex cursor-pointer items-start justify-between rounded-2xl border border-white/10 bg-[#22202c] p-4 transition hover:border-white/20"
          >
            <div className="space-y-1">
              <p className="text-sm font-semibold text-white">Studio Loudness & EQ</p>
              <p className="text-xs text-[#cac4d0]">
                EBU R128 (-16 LUFS) broadcast curve
              </p>
            </div>
            <div
              className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
                audioCleanOptions.volumeNormalize ? "bg-[#381e72]" : "bg-zinc-700"
              }`}
            >
              <span
                className={`absolute top-1 h-4 w-4 rounded-full bg-[#d0bcff] transition-transform ${
                  audioCleanOptions.volumeNormalize ? "left-6" : "left-1"
                }`}
              />
            </div>
          </div>

          <div
            onClick={() => handleToggleOption("noiseReduction")}
            className="flex cursor-pointer items-start justify-between rounded-2xl border border-white/10 bg-[#22202c] p-4 transition hover:border-white/20"
          >
            <div className="space-y-1">
              <p className="text-sm font-semibold text-white">Background Noise Removal</p>
              <p className="text-xs text-[#cac4d0]">
                Spectral de-noise (fan, room hum, hiss)
              </p>
            </div>
            <div
              className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
                audioCleanOptions.noiseReduction ? "bg-[#381e72]" : "bg-zinc-700"
              }`}
            >
              <span
                className={`absolute top-1 h-4 w-4 rounded-full bg-[#d0bcff] transition-transform ${
                  audioCleanOptions.noiseReduction ? "left-6" : "left-1"
                }`}
              />
            </div>
          </div>

          <div
            onClick={() => handleToggleOption("trimEnds")}
            className="flex cursor-pointer items-start justify-between rounded-2xl border border-white/10 bg-[#22202c] p-4 transition hover:border-white/20"
          >
            <div className="space-y-1">
              <p className="text-sm font-semibold text-white">Trim Start & End Air</p>
              <p className="text-xs text-[#cac4d0]">
                Cuts mic warm-up and end silence
              </p>
            </div>
            <div
              className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
                audioCleanOptions.trimEnds ? "bg-[#381e72]" : "bg-zinc-700"
              }`}
            >
              <span
                className={`absolute top-1 h-4 w-4 rounded-full bg-[#d0bcff] transition-transform ${
                  audioCleanOptions.trimEnds ? "left-6" : "left-1"
                }`}
              />
            </div>
          </div>
        </div>

        {/* PLAYBACK & EXPORT SPEED SELECTOR */}
        <div className="mt-4 flex flex-col gap-3 rounded-2xl border border-white/10 bg-[#22202c] p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold text-white">Voice Playback & Export Speed</p>
              <span className="rounded-full bg-[#381e72] px-2 py-0.5 text-[10px] font-bold text-[#d0bcff]">
                Natural Pitch Preserved
              </span>
            </div>
            <p className="text-xs text-[#cac4d0]">
              Faster tempo without the high-pitched chipmunk effect
            </p>
          </div>
          <div className="flex items-center gap-1.5 rounded-full border border-white/10 bg-[#16141f] p-1">
            {[
              { val: 1.0, label: "1.0x Normal" },
              { val: 1.25, label: "1.25x Crisp" },
              { val: 1.5, label: "1.5x Fast" },
            ].map((sp) => {
              const isSelected = (audioCleanOptions.playbackSpeed || 1.0) === sp.val;
              return (
                <button
                  key={sp.val}
                  type="button"
                  onClick={() => {
                    setAudioCleanOptions((prev: any) => ({ ...prev, playbackSpeed: sp.val }));
                    const audios = document.querySelectorAll("audio");
                    audios.forEach((a) => {
                      a.playbackRate = sp.val;
                    });
                  }}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${
                    isSelected
                      ? "bg-[#d0bcff] text-[#1e0060] shadow-sm font-bold"
                      : "text-[#cac4d0] hover:text-white hover:bg-white/5"
                  }`}
                >
                  {sp.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* CLEAN BUTTON */}
        <div className="mt-7">
          <button
            type="button"
            disabled={!selectedFile || isCleaning || isAnalyzingAudio}
            onClick={onCleanAudio}
            className="group relative flex h-14 w-full items-center justify-center gap-3 rounded-full bg-gradient-to-r from-[#d0bcff] to-[#b69df8] text-base font-bold text-[#1e0060] shadow-lg shadow-[#381e72]/30 transition-all hover:brightness-105 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Sparkles size={19} className="transition group-hover:rotate-12" />
            <span>
              {isCleaning
                ? "Splicing, Denoiser & Mastering Audio..."
                : isAnalyzingAudio
                  ? "Transcribing Speech..."
                  : `Clean Studio Audio with AI (${audioCleanOptions.playbackSpeed || 1.0}x)`}
            </span>
          </button>
          <p className="mt-2 text-center text-xs text-[#938f99]">
            Outputs clean studio MP3 (256 kbps, -16 LUFS) • Cuts repeated stumbles & room noise • Natural pitch preserved
          </p>
        </div>
      </div>

      {/* 5. CLEAN AUDIO RESULT (AUDIO ONLY, NO VIDEO!) */}
      {audioCleanResult && (
        <div className="rounded-[28px] border border-emerald-500/20 bg-gradient-to-br from-[#1a1822] to-[#162720] p-6 shadow-2xl sm:p-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400">
                <Music2 size={24} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-base font-bold text-white">Your Clean Audio is Ready</h4>
                  <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[11px] font-bold text-emerald-300">
                    {audioCleanOptions.playbackSpeed ? `${audioCleanOptions.playbackSpeed}x Speed` : 'Mastered'}
                  </span>
                </div>
                <p className="text-xs text-[#cac4d0]">
                  Studio mastered MP3 • Multi-band noise removal • EBU R128 broadcast curve
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <audio
                controls
                className="h-10 rounded-full"
                src={audioCleanResult.outputUrl}
                ref={(node) => {
                  if (node && audioCleanOptions.playbackSpeed) {
                    node.playbackRate = audioCleanOptions.playbackSpeed;
                  }
                }}
              />
              <a
                href={audioCleanResult.outputUrl}
                download={`itnavideo-clean-studio-audio-${audioCleanOptions.playbackSpeed || 1.0}x.mp3`}
                className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500 px-5 py-2.5 text-xs font-bold text-black shadow-md transition hover:bg-emerald-400"
              >
                <Download size={15} />
                Download Clean Audio ({audioCleanOptions.playbackSpeed || 1.0}x MP3)
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
