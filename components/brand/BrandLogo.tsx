import React from 'react';
import Link from 'next/link';

type BrandLogoProps = {
  href?: string;
  size?: 'sm' | 'md' | 'lg';
  iconOnly?: boolean;
  showTagline?: boolean;
  showBadge?: boolean;
  className?: string;
};

const sizeMap = {
  sm: { icon: 30, word: 'text-base sm:text-lg', tagline: 'text-[9px]', badge: 'px-1.5 py-0.5 text-[8px]' },
  md: { icon: 36, word: 'text-lg sm:text-xl', tagline: 'text-[10px]', badge: 'px-2 py-0.5 text-[9px]' },
  lg: { icon: 44, word: 'text-xl sm:text-2xl', tagline: 'text-[11px]', badge: 'px-2.5 py-1 text-[10px]' },
};

export default function BrandLogo({
  href = '/',
  size = 'md',
  iconOnly = false,
  showTagline = false,
  showBadge = true,
  className = '',
}: BrandLogoProps) {
  const s = sizeMap[size];

  const content = (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      {/* Kinetic AI Play Mark Icon - Google Analytics Harmonized Palette */}
      <span
        className="relative inline-flex shrink-0 items-center justify-center transition-transform duration-300 group-hover:scale-105"
        style={{
          width: s.icon,
          height: s.icon,
        }}
      >
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-[0_0_14px_rgba(245,158,11,0.28)]"
        >
          <defs>
            {/* Google Tech Blue Gradient */}
            <linearGradient id="itnaBlueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="100%" stopColor="#1D4ED8" />
            </linearGradient>
            {/* Google Analytics Signature Amber-Orange Gradient */}
            <linearGradient id="itnaAmberGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FBBF24" />
              <stop offset="50%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#EA580C" />
            </linearGradient>
            {/* Warm Gold Sparkle Gradient */}
            <linearGradient id="itnaSparkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FEF08A" />
              <stop offset="100%" stopColor="#F59E0B" />
            </linearGradient>
          </defs>

          {/* Left Vertical Ribbon Stem ('I' for ITNA) - Google Royal Blue */}
          <rect
            x="14"
            y="14"
            width="18"
            height="72"
            rx="9"
            fill="url(#itnaBlueGrad)"
          />

          {/* Forward Kinetic Play Chevron ('▶' for VIDEO) - Google Analytics Amber/Orange */}
          <path
            d="M 38 18 C 38 14 42.5 11.5 46 13.8 L 84 45.8 C 87.2 48 87.2 52 84 54.2 L 46 86.2 C 42.5 88.5 38 86 38 82 Z"
            fill="url(#itnaAmberGrad)"
          />

          {/* AI Sparkle Star (✦) Top Right Corner - Warm Gold */}
          <path
            d="M 80 12 C 80 18.6 85.4 24 92 24 C 85.4 24 80 29.4 80 36 C 80 29.4 74.6 24 68 24 C 74.6 24 80 18.6 80 12 Z"
            fill="url(#itnaSparkGrad)"
          />
        </svg>
      </span>

      {!iconOnly && (
        <span className="min-w-0 leading-none">
          <span className="flex items-center gap-2">
            {/* GitHub-Style Bold All-Caps Typography with Google Analytics Amber Match */}
            <span className={`block font-sans ${s.word} font-black tracking-wider uppercase text-white`}>
              ITNA<span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-orange-400">VIDEO</span>
            </span>
            {showBadge && (
              <span className={`rounded-md border border-amber-500/30 bg-amber-500/10 ${s.badge} font-black uppercase tracking-wider text-amber-400 backdrop-blur-md`}>
                AI STUDIO
              </span>
            )}
          </span>
          {showTagline && (
            <span className="mt-1 block text-[9px] font-extrabold uppercase tracking-[0.2em] text-slate-400">
              NEXT-GEN AI VIDEO ENGINE
            </span>
          )}
        </span>
      )}
    </span>
  );

  return (
    <Link
      href={href}
      aria-label="ITNAVIDEO home"
      className="group inline-flex items-center rounded-xl outline-none transition-all duration-300 focus-visible:ring-2 focus-visible:ring-amber-400"
    >
      {content}
    </Link>
  );
}
