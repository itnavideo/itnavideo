// components/preview/FullTranscriptEditor.tsx
// Unified Full Paragraph & Chunk Caption Editor for Preview Studio

'use client';

import React, { useState, useMemo } from 'react';
import {
  FileText,
  Layers,
  Check,
  RotateCcw,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import type { PreviewCaption } from './types';
import type { TranscriptDocument } from '@/lib/captions/types';
import { alignEditedTranscript, createTranscriptDocument } from '@/lib/captions/transcriptAlignment';
import { planCaptionEvents } from '@/lib/captions/eventPlanner';

interface FullTranscriptEditorProps {
  captions: PreviewCaption[];
  currentTime: number;
  onUpdateCaptions: (updated: PreviewCaption[]) => void;
  rawTranscriptText?: string;
  durationSeconds?: number;
}

export const FullTranscriptEditor: React.FC<FullTranscriptEditorProps> = ({
  captions,
  currentTime,
  onUpdateCaptions,
  rawTranscriptText,
  durationSeconds = 60,
}) => {
  const [viewMode, setViewMode] = useState<'paragraph' | 'chunks'>('paragraph');

  // Derive initial full paragraph text
  const initialFullText = useMemo(() => {
    if (rawTranscriptText) return rawTranscriptText;
    return captions.map((c) => c.text).join(' ');
  }, [captions, rawTranscriptText]);

  const [paragraphText, setParagraphText] = useState(initialFullText);
  const [isSaved, setIsSaved] = useState(false);

  // Active caption index
  const activeIndex = captions.findIndex(
    (c) => currentTime >= c.start && currentTime < c.end
  );

  const handleApplyParagraph = () => {
    // 1. Reconstruct words from existing captions
    const allWords: Array<{ word: string; start: number; end: number }> = [];
    captions.forEach((c) => {
      if (c.words && c.words.length > 0) {
        c.words.forEach((w) => allWords.push({ word: w.word, start: w.start, end: w.end }));
      } else {
        const split = c.text.trim().split(/\s+/);
        const perWord = (c.end - c.start) / Math.max(1, split.length);
        split.forEach((w, i) => {
          allWords.push({
            word: w,
            start: c.start + i * perWord,
            end: c.start + (i + 1) * perWord,
          });
        });
      }
    });

    const doc = createTranscriptDocument(initialFullText, allWords, durationSeconds);
    const alignedDoc = alignEditedTranscript(doc, paragraphText);

    // Re-plan caption events and map back to PreviewCaption[]
    const events = planCaptionEvents(alignedDoc, {
      canvasWidth: 1080,
      canvasHeight: 1920,
    });

    const updatedCaptions: PreviewCaption[] = events.map((ev) => ({
      start: ev.start,
      end: ev.end,
      text: ev.text,
      words: ev.words.map((w) => ({
        word: w.word,
        start: w.start,
        end: w.end,
      })),
      heroText: ev.heroText,
      leadText: ev.leadText,
      subText: ev.subText,
    }));

    onUpdateCaptions(updatedCaptions);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden flex flex-col">
      {/* Header Tabs */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-zinc-900/90 border-b border-zinc-800">
        <div className="flex items-center gap-1 bg-zinc-800/80 p-0.5 rounded-lg border border-zinc-700/50">
          <button
            onClick={() => setViewMode('paragraph')}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
              viewMode === 'paragraph'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <FileText size={13} />
            Full Transcript
          </button>
          <button
            onClick={() => setViewMode('chunks')}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
              viewMode === 'chunks'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Layers size={13} />
            Caption Cards ({captions.length})
          </button>
        </div>

        {isSaved && (
          <span className="text-xs text-emerald-400 flex items-center gap-1 font-medium animate-in fade-in">
            <Check size={14} /> Updated & Synced
          </span>
        )}
      </div>

      {/* Paragraph Editor View */}
      {viewMode === 'paragraph' ? (
        <div className="p-3 flex flex-col gap-2">
          <textarea
            value={paragraphText}
            onChange={(e) => {
              setParagraphText(e.target.value);
              setIsSaved(false);
            }}
            placeholder="Edit complete transcript here..."
            className="w-full rounded-lg bg-zinc-950 border border-zinc-800 p-3 text-xs leading-relaxed text-zinc-100 placeholder-zinc-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none h-36"
            spellCheck
          />
          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] text-zinc-500">
              Editing automatically preserves word timestamps via smart alignment.
            </span>
            <button
              onClick={handleApplyParagraph}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 active:scale-95 rounded-lg transition-all"
            >
              <Sparkles size={13} />
              Apply to Captions
            </button>
          </div>
        </div>
      ) : (
        /* Chunk List View */
        <div className="max-h-56 overflow-y-auto divide-y divide-zinc-800/80 p-2">
          {captions.map((cap, i) => {
            const isActive = i === activeIndex;
            return (
              <div
                key={i}
                className={`p-2 rounded-lg flex items-start gap-2.5 text-xs transition-colors ${
                  isActive
                    ? 'bg-blue-950/40 border border-blue-500/30 text-white font-medium'
                    : 'text-zinc-300 hover:bg-zinc-800/40'
                }`}
              >
                <span className="text-[10px] text-zinc-500 font-mono mt-0.5 shrink-0">
                  {cap.start.toFixed(1)}s
                </span>
                <span className="flex-1 leading-snug">{cap.text}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
