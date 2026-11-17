'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sparkles, MessageSquareHeart, CheckCircle2, ArrowRight } from 'lucide-react';
import { GeneralPlatformFeedbackModal } from './GeneralPlatformFeedbackModal';

export default function HomepageFeedbackBanner() {
  const [showModal, setShowModal] = useState(false);

  return (
    <section className="relative overflow-hidden bg-white py-16 px-4 sm:px-6 lg:px-8 border-t border-slate-200/80">
      <div className="mx-auto max-w-5xl rounded-3xl border border-orange-500/25 bg-gradient-to-br from-orange-50/70 via-amber-50/40 to-white p-8 sm:p-12 shadow-sm text-center space-y-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-1.5 text-xs font-bold text-orange-700">
          <Sparkles size={14} className="text-orange-600" />
          <span>HELP US BUILD BETTER AI VIDEOS</span>
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight font-sans">
          Create Videos for Free.{' '}
          <span className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500 bg-clip-text text-transparent">
            Share Your Honest Feedback.
          </span>
        </h2>

        <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-600 leading-relaxed font-sans">
          We believe in complete transparency. Our AI video models are continuously improving, and your real feedback
          directly guides our scene planning, visual selection, and audio pacing. Enjoy 2 free video downloads daily.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500 px-7 py-3.5 text-sm font-black text-white shadow-md shadow-orange-500/25 hover:shadow-orange-500/40 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
          >
            <span>Start Creating in Studio</span>
            <ArrowRight size={16} />
          </Link>

          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white hover:bg-slate-50 px-6 py-3.5 text-sm font-bold text-slate-700 hover:text-slate-900 shadow-xs hover:border-slate-400 active:scale-95 transition-all cursor-pointer"
          >
            <MessageSquareHeart size={16} className="text-orange-600" />
            <span>Share Platform Feedback</span>
          </button>
        </div>

        <div className="pt-4 flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-slate-500">
          <span className="inline-flex items-center gap-1.5 text-emerald-700 font-bold">
            <CheckCircle2 size={14} className="text-emerald-600" />
            2 Free Downloads Daily
          </span>
          <span className="text-slate-300">•</span>
          <span>Unlimited Cloud Previews</span>
          <span className="text-slate-300">•</span>
          <span>Resets Daily at 12:00 AM IST</span>
        </div>
      </div>

      {showModal && (
        <GeneralPlatformFeedbackModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
        />
      )}
    </section>
  );
}
