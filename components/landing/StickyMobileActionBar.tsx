'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight, Zap } from 'lucide-react';

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
      <div className="relative mx-auto flex items-center justify-between gap-3 rounded-2xl border border-white/15 bg-[#090D18]/95 px-3.5 py-2.5 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
        {/* Subtle orange accent glow behind */}
        <div className="pointer-events-none absolute inset-x-4 top-0 h-[1px] bg-gradient-to-r from-transparent via-orange-500/60 to-transparent" />

        {/* Left value / trust prompt */}
        <div className="flex flex-col min-w-0 pr-1">
          <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-orange-400">
            <Zap size={12} className="text-[#FF5722] fill-[#FF5722]" />
            <span>10+ Studios</span>
          </div>
          <span className="text-[11px] font-bold text-white truncate">
            Instant Studio Access • 1080p HD
          </span>
        </div>

        {/* Right CTA Button */}
        <Link
          href="/dashboard"
          className="shrink-0 inline-flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-[#FF5722] via-[#FF7043] to-[#FFA000] px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-orange-500/25 hover:brightness-110 active:scale-95 transition-all"
        >
          <Sparkles size={13} className="text-white" />
          <span>Get Started</span>
          <ArrowRight size={13} />
        </Link>
      </div>
    </aside>
  );
}
