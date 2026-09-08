// components/captions/TranscriptReviewModal.tsx
// Professional Full Transcript Review & Editable Document Modal

'use client';

import React, { useState, useMemo } from 'react';
import {
  FileText,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Sparkles,
  X,
  Clock,
  Hash,
  Languages,
} from 'lucide-react';
import type { TranscriptDocument } from '@/lib/captions/types';
import { alignEditedTranscript } from '@/lib/captions/transcriptAlignment';

interface TranscriptReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialDoc: TranscriptDocument;
  onApply: (updatedDoc: TranscriptDocument) => void;
}

export const TranscriptReviewModal: React.FC<TranscriptReviewModalProps> = ({
  isOpen,
  onClose,
  initialDoc,
  onApply,
}) => {
  const [editedText, setEditedText] = useState(
    initialDoc.editedTranscript || initialDoc.rawTranscript
  );
  const [hasApplied, setHasApplied] = useState(false);

  // Calculate live word count & stats
  const wordsCount = useMemo(() => {
    return editedText.trim().split(/\s+/).filter(Boolean).length;
  }, [editedText]);

  const rawWordsCount = useMemo(() => {
    return initialDoc.rawTranscript.trim().split(/\s+/).filter(Boolean).length;
  }, [initialDoc.rawTranscript]);

  const isModified = editedText.trim() !== initialDoc.rawTranscript.trim();

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleReset = () => {
    setEditedText(initialDoc.rawTranscript);
    setHasApplied(false);
  };

  const handleApply = () => {
    const updated = alignEditedTranscript(initialDoc, editedText);
    onApply(updated);
    setHasApplied(true);
    setTimeout(() => {
      onClose();
    }, 450);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-2xl border border-zinc-700 bg-zinc-900/95 p-6 shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
              <FileText size={22} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                Review Your Transcript
                {isModified ? (
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    Edited
                  </span>
                ) : (
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                    AI Generated
                  </span>
                )}
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Correct spelling, brand names, or punctuation before generating caption animations.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-3 my-4">
          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-zinc-800/60 border border-zinc-700/50">
            <Hash size={16} className="text-zinc-400" />
            <div>
              <div className="text-[11px] text-zinc-400 uppercase tracking-wider font-semibold">
                Words
              </div>
              <div className="text-sm font-bold text-white">
                {wordsCount}
                {isModified && wordsCount !== rawWordsCount && (
                  <span className="text-xs text-zinc-400 font-normal ml-1">
                    ({wordsCount > rawWordsCount ? `+${wordsCount - rawWordsCount}` : wordsCount - rawWordsCount})
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-zinc-800/60 border border-zinc-700/50">
            <Clock size={16} className="text-zinc-400" />
            <div>
              <div className="text-[11px] text-zinc-400 uppercase tracking-wider font-semibold">
                Duration
              </div>
              <div className="text-sm font-bold text-white">
                {formatDuration(initialDoc.durationSeconds)}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-zinc-800/60 border border-zinc-700/50">
            <Languages size={16} className="text-zinc-400" />
            <div>
              <div className="text-[11px] text-zinc-400 uppercase tracking-wider font-semibold">
                Language
              </div>
              <div className="text-sm font-bold text-white uppercase">
                {initialDoc.language || 'English'}
              </div>
            </div>
          </div>
        </div>

        {/* Editable Full Paragraph Area */}
        <div className="flex-1 flex flex-col min-h-0 mb-4">
          <label className="text-xs font-semibold text-zinc-300 mb-2 flex items-center justify-between">
            <span>Editable Full Transcript</span>
            <span className="text-[11px] text-zinc-500 font-normal">
              Edit words directly • Timings are preserved automatically
            </span>
          </label>
          <textarea
            value={editedText}
            onChange={(e) => {
              setEditedText(e.target.value);
              setHasApplied(false);
            }}
            placeholder="Type or edit your video transcript..."
            className="flex-1 w-full rounded-xl bg-zinc-950 border border-zinc-700 p-4 text-sm leading-relaxed text-zinc-100 placeholder-zinc-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none overflow-y-auto"
            rows={8}
            spellCheck
          />
        </div>

        {/* Reassurance Banner */}
        <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs mb-5">
          <CheckCircle2 size={16} className="shrink-0 text-emerald-400" />
          <span>
            {hasApplied
              ? '✓ Transcript updated! Caption timing recalculated automatically.'
              : 'Smart Alignment Active: Word timestamps are preserved and synchronized with speech.'}
          </span>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-zinc-800">
          <button
            onClick={handleReset}
            disabled={!isModified}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-zinc-400 hover:text-white disabled:opacity-40 transition-colors"
          >
            <RotateCcw size={14} />
            Reset to Original
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleApply}
              className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 active:scale-95 rounded-xl shadow-lg shadow-blue-600/25 transition-all"
            >
              <Sparkles size={14} />
              Apply & Recalculate Captions
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
