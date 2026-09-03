"use client";

import { useState, useRef, useEffect } from "react";
import { Check, Pencil, X, ChevronDown, ChevronUp } from "lucide-react";
import type { PreviewCaption } from "./types";

type Props = {
  captions: PreviewCaption[];
  currentTime: number; // seconds, from player
  onUpdate: (updated: PreviewCaption[]) => void;
};

export function CaptionEditor({ captions, currentTime, onUpdate }: Props) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");
  const [expanded, setExpanded] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const activeRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to active caption
  const activeIndex = captions.findIndex(
    (c) => currentTime >= c.start && currentTime < c.end
  );

  useEffect(() => {
    if (activeRef.current) {
      activeRef.current.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  }, [activeIndex]);

  const startEdit = (index: number) => {
    setEditingIndex(index);
    setEditValue(captions[index].text);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const commitEdit = (index: number) => {
    if (editValue.trim() === captions[index].text) {
      setEditingIndex(null);
      return;
    }
    const updated = captions.map((c, i) =>
      i === index
        ? {
            ...c,
            text: editValue.trim(),
            // Rebuild words proportionally if word-level data exists
            words: c.words?.length
              ? rebuildWords(editValue.trim(), c.start, c.end)
              : undefined,
          }
        : c
    );
    onUpdate(updated);
    setEditingIndex(null);
  };

  const cancelEdit = () => {
    setEditingIndex(null);
    setEditValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Enter") commitEdit(index);
    if (e.key === "Escape") cancelEdit();
  };

  const formatTime = (s: number) =>
    `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60)
      .toFixed(1)
      .padStart(4, "0")}`;

  return (
    <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-white hover:bg-zinc-800 transition-colors"
      >
        <span className="flex items-center gap-2">
          <span className="text-emerald-400">📝</span>
          Captions
          <span className="text-xs font-normal text-zinc-500">
            ({captions.length} chunks)
          </span>
        </span>
        {expanded ? (
          <ChevronUp size={14} className="text-zinc-500" />
        ) : (
          <ChevronDown size={14} className="text-zinc-500" />
        )}
      </button>

      {expanded && (
        <div className="max-h-64 overflow-y-auto divide-y divide-zinc-800">
          {captions.map((cap, i) => {
            const isActive = i === activeIndex;
            const isEditing = editingIndex === i;

            return (
              <div
                key={i}
                ref={isActive ? activeRef : undefined}
                className={`px-4 py-2 flex items-start gap-3 group transition-colors ${
                  isActive
                    ? "bg-emerald-950/40 border-l-2 border-emerald-500"
                    : "hover:bg-zinc-800/50"
                }`}
              >
                {/* Timestamp */}
                <span className="text-[10px] text-zinc-500 mt-1 shrink-0 w-14 tabular-nums">
                  {formatTime(cap.start)}
                </span>

                {/* Text or input */}
                <div className="flex-1 min-w-0">
                  {isEditing ? (
                    <div className="flex items-center gap-2">
                      <input
                        ref={inputRef}
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onKeyDown={(e) => handleKeyDown(e, i)}
                        className="flex-1 bg-zinc-800 border border-emerald-500 rounded px-2 py-1 text-sm text-white outline-none"
                      />
                      <button
                        onClick={() => commitEdit(i)}
                        className="text-green-400 hover:text-green-300 shrink-0"
                        title="Save"
                      >
                        <Check size={14} />
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="text-red-400 hover:text-red-300 shrink-0"
                        title="Cancel"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <span
                      className={`text-sm leading-snug ${
                        isActive ? "text-white font-medium" : "text-zinc-300"
                      }`}
                    >
                      {cap.text}
                    </span>
                  )}
                </div>

                {/* Edit button */}
                {!isEditing && (
                  <button
                    onClick={() => startEdit(i)}
                    className="opacity-0 group-hover:opacity-100 text-zinc-500 hover:text-white transition-all shrink-0 mt-0.5"
                    title="Edit caption"
                  >
                    <Pencil size={12} />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// Rebuild word-level timestamps proportionally when user edits caption text
function rebuildWords(
  text: string,
  start: number,
  end: number
): Array<{ word: string; start: number; end: number }> {
  const words = text.split(/\s+/).filter(Boolean);
  if (!words.length) return [];
  const dur = Math.max(0.1, end - start);
  const perWord = dur / words.length;
  return words.map((word, i) => ({
    word,
    start: Math.round((start + perWord * i) * 1000) / 1000,
    end: Math.round((start + perWord * (i + 1)) * 1000) / 1000,
  }));
}
