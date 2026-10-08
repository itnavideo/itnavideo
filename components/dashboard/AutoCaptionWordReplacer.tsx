"use client";

import React, { useState } from "react";
import { Search, Replace, Sparkles, Check } from "lucide-react";

interface AutoCaptionWordReplacerProps {
  transcript: string;
  onTranscriptChange: (newTranscript: string) => void;
  isTranscribing?: boolean;
}

export function AutoCaptionWordReplacer({
  transcript,
  onTranscriptChange,
  isTranscribing = false,
}: AutoCaptionWordReplacerProps) {
  const [findWord, setFindWord] = useState("");
  const [replaceWord, setReplaceWord] = useState("");
  const [replaceSuccessMsg, setReplaceSuccessMsg] = useState<string | null>(null);

  const words = transcript ? transcript.split(/\s+/).filter(Boolean) : [];

  const handleQuickWordClick = (word: string) => {
    const clean = word.replace(/[^a-zA-Z0-9']/g, "");
    setFindWord(clean);
  };

  const executeReplace = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!findWord.trim() || !transcript) return;

    const regex = new RegExp(`\\b${findWord.trim()}\\b`, "gi");
    const matches = transcript.match(regex);
    const count = matches ? matches.length : 0;

    if (count === 0) {
      setReplaceSuccessMsg(`Word "${findWord}" not found.`);
      setTimeout(() => setReplaceSuccessMsg(null), 2500);
      return;
    }

    const updated = transcript.replace(regex, replaceWord.trim());
    onTranscriptChange(updated);
    setReplaceSuccessMsg(`Replaced ${count} instance${count > 1 ? "s" : ""} of "${findWord}" with "${replaceWord.trim()}".`);
    setFindWord("");
    setReplaceWord("");
    setTimeout(() => setReplaceSuccessMsg(null), 3500);
  };

  return (
    <div className="rounded-[22px] border border-white/10 bg-[#161720] p-4 shadow-2xl space-y-3.5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#FF6D00]/20 text-[#FF9100]">
            <Sparkles size={13} />
          </div>
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-white">
              Smart Script Review &amp; Proper Noun Replacer
            </h4>
            <p className="text-[10px] text-slate-400">
              Fix names, brands, or Hindi-English words with 1 click before rendering.
            </p>
          </div>
        </div>
        <span className="text-[10px] font-mono font-bold text-slate-400">
          {words.length} Words Transcribed
        </span>
      </div>

      {/* Quick Find & Replace Input Row */}
      <form onSubmit={executeReplace} className="grid grid-cols-1 sm:grid-cols-12 gap-2">
        <div className="sm:col-span-5 relative">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Find word (e.g. rohigems)..."
            value={findWord}
            onChange={(e) => setFindWord(e.target.value)}
            onKeyDown={(e) => {
              if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault();
                executeReplace();
              }
            }}
            className="w-full rounded-xl bg-[#090A0F] border border-white/10 pl-8 pr-3 py-2 text-xs font-mono text-white placeholder-slate-500 focus:border-[#FF6D00] focus:outline-none"
          />
        </div>

        <div className="sm:col-span-5 relative">
          <Replace size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Replace with (e.g. ruhejems)..."
            value={replaceWord}
            onChange={(e) => setReplaceWord(e.target.value)}
            onKeyDown={(e) => {
              if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault();
                executeReplace();
              }
            }}
            className="w-full rounded-xl bg-[#090A0F] border border-white/10 pl-8 pr-3 py-2 text-xs font-mono text-white placeholder-slate-500 focus:border-[#FF6D00] focus:outline-none"
          />
        </div>

        <div className="sm:col-span-2">
          <button
            type="submit"
            disabled={!findWord.trim() || !transcript}
            className="w-full h-full min-h-[36px] flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-[#FF6D00] to-[#FF8F00] text-black text-xs font-black shadow-md hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed transition active:scale-95 cursor-pointer"
          >
            <span>Replace</span>
          </button>
        </div>
      </form>

      {/* Success / Alert message */}
      {replaceSuccessMsg && (
        <div className="flex items-center gap-2 rounded-xl bg-[#FF6D00]/10 border border-[#FF6D00]/30 px-3 py-1.5 text-xs font-bold text-[#FFA726]">
          <Check size={13} />
          <span>{replaceSuccessMsg}</span>
        </div>
      )}

      {/* Clickable Word Chips Preview (Top 40 words for fast inspection) */}
      {words.length > 0 && (
        <div className="space-y-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Click any word below to populate &quot;Find&quot;:
          </span>
          <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto pr-1 custom-scrollbar">
            {words.slice(0, 40).map((w, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleQuickWordClick(w)}
                className="rounded-lg bg-[#090A0F] hover:bg-[#1E202E] hover:border-[#FF6D00]/40 border border-white/10 px-2 py-0.5 text-[11px] font-mono text-slate-300 hover:text-[#FFA726] transition active:scale-90 cursor-pointer"
              >
                {w}
              </button>
            ))}
            {words.length > 40 && (
              <span className="text-[10px] font-mono text-slate-500 self-center pl-1">
                +{words.length - 40} more words
              </span>
            )}
          </div>
        </div>
      )}

      {/* Full Script Textarea */}
      <div>
        <textarea
          rows={3}
          value={transcript}
          onChange={(e) => onTranscriptChange(e.target.value)}
          placeholder={isTranscribing ? "Transcribing speech via Groq Whisper..." : "Transcript will appear here once audio is loaded. You can directly edit text."}
          className="w-full rounded-2xl bg-[#090A0F] border border-white/10 p-3 text-xs leading-relaxed text-slate-200 placeholder-slate-600 focus:border-[#FF6D00] focus:outline-none font-sans"
        />
      </div>
    </div>
  );
}
