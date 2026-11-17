'use client';

import React, { useState } from 'react';
import { X, Sparkles, Check, CheckCircle2, Loader2, Send } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthContext';

export const IMPROVEMENT_CATEGORIES = [
  { id: 'visual_quality', label: 'Visual quality' },
  { id: 'scene_selection', label: 'Scene selection' },
  { id: 'voiceover_quality', label: 'Voiceover quality' },
  { id: 'background_music', label: 'Background music' },
  { id: 'sound_effects', label: 'Sound effects' },
  { id: 'motion_graphics', label: 'Animation & motion graphics' },
  { id: 'captions_typography', label: 'Captions & typography' },
  { id: 'transitions', label: 'Transitions' },
  { id: 'pacing_timing', label: 'Video pacing & timing' },
  { id: 'visual_storytelling', label: 'Visual storytelling' },
  { id: 'overall_quality', label: 'Overall professional quality' },
  { id: 'other', label: 'Other' },
] as const;

export const RATING_OPTIONS = [
  { id: 'excellent', score: 4, label: 'Excellent', emoji: '🤩' },
  { id: 'good', score: 3, label: 'Good', emoji: '😊' },
  { id: 'average', score: 2, label: 'Average', emoji: '😐' },
  { id: 'poor', score: 1, label: 'Poor', emoji: '😞' },
] as const;

export interface GeneralPlatformFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GeneralPlatformFeedbackModal({
  isOpen,
  onClose,
}: GeneralPlatformFeedbackModalProps) {
  const { user } = useAuth();
  const [rating, setRating] = useState<'excellent' | 'good' | 'average' | 'poor' | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const toggleTag = (id: string) => {
    setSelectedTags((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating) {
      setErrorMessage('Please select how your experience has been.');
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage('');

      const res = await fetch('/api/feedback/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          feedbackType: 'general_platform',
          userId: user?.id || user?.uid || 'anonymous',
          userEmail: user?.email || undefined,
          rating,
          ratingScore: RATING_OPTIONS.find((r) => r.id === rating)?.score || 3,
          improvementTags: selectedTags,
          comment: comment.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.error || 'Failed to submit feedback.');
      }

      setIsSubmitted(true);
      setTimeout(() => {
        onClose();
      }, 2500);
    } catch (err: any) {
      setErrorMessage(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden text-left">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500 p-6 text-white">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/15 hover:bg-white/25 text-white transition cursor-pointer"
          >
            <X size={18} />
          </button>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles size={12} />
            <span>Help Us Improve</span>
          </div>
          <h3 className="text-xl font-black font-sans">Help Us Build Better AI Videos</h3>
          <p className="text-xs text-white/90 mt-1 leading-relaxed">
            Your honest feedback directly guides our development roadmap.
          </p>
        </div>

        {/* Content */}
        <div className="p-6">
          {isSubmitted ? (
            <div className="py-8 text-center space-y-3">
              <div className="h-14 w-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
                <CheckCircle2 size={32} />
              </div>
              <h4 className="text-lg font-black text-slate-900 font-sans">Thank You for Your Feedback!</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Your input has been delivered to our engineering and AI models team.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Rating selection */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-800 mb-2">
                  How has your experience been with Itnavideo?
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {RATING_OPTIONS.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => {
                        setRating(opt.id);
                        setErrorMessage('');
                      }}
                      className={`flex flex-col items-center justify-center py-2.5 px-2 rounded-2xl border transition-all cursor-pointer ${
                        rating === opt.id
                          ? 'border-orange-500 bg-orange-50/80 ring-2 ring-orange-500/25 shadow-xs'
                          : 'border-slate-200 bg-slate-50/70 hover:bg-slate-100 hover:border-slate-300'
                      }`}
                    >
                      <span className="text-2xl mb-1">{opt.emoji}</span>
                      <span className="text-xs font-bold text-slate-800">{opt.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Improvement Tags */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-800 mb-1.5">
                  What should we improve? <span className="text-slate-400 font-medium lowercase">(select all that apply)</span>
                </label>
                <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto pr-1">
                  {IMPROVEMENT_CATEGORIES.map((cat) => {
                    const isSelected = selectedTags.includes(cat.id);
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => toggleTag(cat.id)}
                        className={`text-xs px-3 py-1.5 rounded-xl border transition-all cursor-pointer flex items-center gap-1.5 font-medium ${
                          isSelected
                            ? 'border-orange-500 bg-orange-50 text-orange-800 font-bold shadow-xs'
                            : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:border-slate-300'
                        }`}
                      >
                        {isSelected && <Check size={12} className="text-orange-600" />}
                        <span>{cat.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Comment text */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-800 mb-1.5">
                  Detailed Comments <span className="text-slate-400 font-normal normal-case">(optional)</span>
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Tell us what looked wrong or what you expected to see in your video..."
                  rows={3}
                  className="w-full p-3 rounded-2xl border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition resize-none font-sans"
                />
              </div>

              {errorMessage && (
                <p className="text-xs font-bold text-red-600 bg-red-50 p-2.5 rounded-xl border border-red-200">
                  {errorMessage}
                </p>
              )}

              {/* Actions */}
              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:brightness-105 active:scale-95 text-white text-xs font-black shadow-md shadow-orange-500/25 transition cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={13} className="animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send size={13} />
                      <span>Submit Feedback</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
