'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight, Zap } from 'lucide-react';
import { STUDIO_COUNT_EXACT_LABEL } from '@/constants/studios';

export default function StickyMobileActionBar() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let previousY = window.scrollY;
    let hideTimer: ReturnType<typeof setTimeout> | undefined;

    const handleScroll = () => {
      const currentY = window.scrollY;
      if (currentY <= 120 || currentY > previousY + 4) {
        setIsVisible(false);
      } else if (currentY < previousY - 4) {
        setIsVisible(true);
        if (hideTimer) clearTimeout(hideTimer);
        hideTimer = setTimeout(() => setIsVisible(false), 2200);
      }
      previousY = currentY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (hideTimer) clearTimeout(hideTimer);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <aside
      aria-label="Mobile quick action"
      className="fixed bottom-0 inset-x-0 z-50 md:hidden p-2.5 pb-[max(0.65rem,env(safe-area-inset-bottom))] transition-transform duration-300 ease-out animate-in slide-in-from-bottom"
    >
      <div className="relative mx-auto flex items-center justify-between gap-3 rounded-2xl border border-zinc-200/90 bg-white/95 px-3.5 py-2.5 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.12)]">
        {/* Left value / trust prompt */}
        <div className="flex flex-col min-w-0 pr-1">
          <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-zinc-900">
            <Zap size={12} className="text-zinc-950 fill-zinc-950" />
            <span>{STUDIO_COUNT_EXACT_LABEL}</span>
          </div>
          <span className="text-[11px] font-bold text-zinc-700 truncate">
            Instant Studio Access • 1080p HD
          </span>
        </div>

        {/* Right CTA Button */}
        <Link
          href="/dashboard"
          className="shrink-0 inline-flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500 hover:from-orange-500 hover:to-amber-500 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-orange-500/25 active:scale-95 transition-all"
        >
          <Sparkles size={13} className="text-white" />
          <span>Get Started</span>
          <ArrowRight size={13} />
        </Link>
      </div>
    </aside>
  );
}
