'use client';

import React, { useState } from 'react';
import { X, Sparkles, Check, CheckCircle2, Loader2, Send, ThumbsUp } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthContext';
import { IMPROVEMENT_CATEGORIES, RATING_OPTIONS } from './GeneralPlatformFeedbackModal';

export interface PostDownloadFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoId: string;
  videoType?: string;
  aspectRatio?: '16:9' | '9:16';
  durationSeconds?: number;
  templateStyle?: string;
  generationSettings?: Record<string, any>;
}

export function PostDownloadFeedbackModal({
  isOpen,
  onClose,
  videoId,
  videoType = 'generic',
  aspectRatio = '16:9',
  durationSeconds,
  templateStyle,
  generationSettings,
}: PostDownloadFeedbackModalProps) {
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
      setErrorMessage('Please select a rating for your generated video.');
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage('');

      const res = await fetch('/api/feedback/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          feedbackType: 'video_contextual',
          userId: user?.id || user?.uid || 'anonymous',
          userEmail: user?.email || undefined,
          videoId,
          videoType,
          aspectRatio,
          durationSeconds: durationSeconds ? Math.round(durationSeconds) : undefined,
          templateStyle,
          generationSettings: generationSettings || {},
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
      }, 2000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden text-left">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500 p-6 text-white">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/15 hover:bg-white/25 text-white transition cursor-pointer"
            title="Dismiss"
          >
            <X size={18} />
          </button>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-xs font-bold uppercase tracking-wider mb-2">
            <ThumbsUp size={12} />
            <span>Download Complete</span>
          </div>
          <h3 className="text-xl font-black font-sans">How was your video?</h3>
          <p className="text-xs text-white/90 mt-1 leading-relaxed">
            We are improving Itnavideo. Your feedback helps us create better videos.
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
                Your ratings and comments will help us fine-tune scene selection, pacing, and visual matching.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Rating selection */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-800 mb-2">
                  Rate your video experience
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

              {/* What should we improve? */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-800 mb-1.5">
                  What should we improve? <span className="text-slate-400 font-medium lowercase">(select all that apply)</span>
                </label>
                <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-1">
                  {IMPROVEMENT_CATEGORIES.map((cat) => {
                    const isSelected = selectedTags.includes(cat.id);
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => toggleTag(cat.id)}
                        className={`text-xs px-2.5 py-1.5 rounded-xl border transition-all cursor-pointer flex items-center gap-1 font-medium ${
                          isSelected
                            ? 'border-orange-500 bg-orange-50 text-orange-800 font-bold shadow-xs'
                            : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:border-slate-300'
                        }`}
                      >
                        {isSelected && <Check size={11} className="text-orange-600" />}
                        <span>{cat.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Comment text */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-800 mb-1.5">
                  Comments &amp; Expectations <span className="text-slate-400 font-normal normal-case">(optional)</span>
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Tell us what looked wrong or what you expected to see in your video..."
                  rows={2}
                  className="w-full p-2.5 rounded-2xl border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition resize-none font-sans"
                />
              </div>

              {errorMessage && (
                <p className="text-xs font-bold text-red-600 bg-red-50 p-2.5 rounded-xl border border-red-200">
                  {errorMessage}
                </p>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="text-xs font-bold text-slate-500 hover:text-slate-800 transition cursor-pointer"
                >
                  Maybe Later
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:brightness-105 active:scale-95 text-white text-xs font-black shadow-md shadow-orange-500/25 transition cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={13} className="animate-spin" />
                      <span>Submitting...</span>
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
