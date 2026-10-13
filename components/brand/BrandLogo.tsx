import React from 'react';
import Link from 'next/link';

type BrandLogoProps = {
  href?: string;
  size?: 'sm' | 'md' | 'lg' | number | string;
  iconOnly?: boolean;
  showTagline?: boolean;
  showBadge?: boolean;
  variant?: 'auto' | 'light' | 'dark';
  className?: string;
};

const sizeMap: Record<string, { icon: number; word: string; tagline: string; badge: string }> = {
  sm: { icon: 32, word: 'text-base sm:text-lg', tagline: 'text-[9px]', badge: 'px-1.5 py-0.5 text-[8px]' },
  md: { icon: 38, word: 'text-lg sm:text-xl', tagline: 'text-[10px]', badge: 'px-2 py-0.5 text-[9px]' },
  lg: { icon: 46, word: 'text-xl sm:text-2xl', tagline: 'text-[11px]', badge: 'px-2.5 py-1 text-[10px]' },
};

export default function BrandLogo({
  href = '/',
  size = 'md',
  iconOnly = false,
  showTagline = false,
  showBadge = false,
  variant = 'auto',
  className = '',
}: BrandLogoProps) {
  const s = typeof size === 'number'
    ? { icon: size, word: 'text-lg sm:text-xl', tagline: 'text-[10px]', badge: 'px-2 py-0.5 text-[9px]' }
    : (sizeMap[String(size)] || sizeMap.md);

  // Ensure ITNA is always high-contrast (dark obsidian on light, crisp white on dark)
  const itnaTextColor = 
    variant === 'dark' 
      ? 'text-white' 
      : 'text-slate-900';

  const badgeStyle = 
    variant === 'dark' 
      ? 'border-[#FFA000]/40 bg-[#FFA000]/15 text-[#FFA000] shadow-xs' 
      : 'border-[#FF5722]/30 bg-[#FF5722]/10 text-[#FF5722]';

  const taglineColor = 
    variant === 'dark' 
      ? 'text-zinc-400' 
      : 'text-slate-500';

  const content = (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      {/* Kinetic AI Play Mark Icon - Flame Orange & Warm Amber */}
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
          className="w-full h-full drop-shadow-[0_0_16px_rgba(255,87,34,0.35)]"
        >
          <defs>
            {/* Vibrant Flame Orange Gradient for Stem */}
            <linearGradient id="itnaStemGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF5722" />
              <stop offset="100%" stopColor="#FF8A65" />
            </linearGradient>
            {/* Signature Flame Orange & Warm Amber Gradient for Play Chevron */}
            <linearGradient id="itnaAmberGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF5722" />
              <stop offset="50%" stopColor="#FF7043" />
              <stop offset="100%" stopColor="#FFA000" />
            </linearGradient>
            {/* Warm Gold Sparkle Gradient */}
            <linearGradient id="itnaSparkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFA000" />
              <stop offset="100%" stopColor="#FFD54F" />
            </linearGradient>
          </defs>

          {/* Left Vertical Ribbon Stem ('I' for ITNA) */}
          <rect
            x="14"
            y="14"
            width="18"
            height="72"
            rx="9"
            fill="url(#itnaStemGrad)"
          />

          {/* Forward Kinetic Play Chevron ('▶' for VIDEO) */}
          <path
            d="M 38 18 C 38 14 42.5 11.5 46 13.8 L 84 45.8 C 87.2 48 87.2 52 84 54.2 L 46 86.2 C 42.5 88.5 38 86 38 82 Z"
            fill="url(#itnaAmberGrad)"
          />

          {/* AI Sparkle Star (✦) Top Right Corner */}
          <path
            d="M 80 12 C 80 18.6 85.4 24 92 24 C 85.4 24 80 29.4 80 36 C 80 29.4 74.6 24 68 24 C 74.6 24 80 18.6 80 12 Z"
            fill="url(#itnaSparkGrad)"
          />
        </svg>
      </span>

      {!iconOnly && (
        <span className="min-w-0 leading-none">
          <span className="flex items-center gap-2">
            {/* High-Contrast Bold Typography with Orange/Amber Match */}
            <span className={`block font-sans ${s.word} font-black tracking-wider uppercase ${itnaTextColor}`}>
              ITNA<span className="bg-gradient-to-r from-[#FF5722] via-[#FF7043] to-[#FFA000] bg-clip-text text-transparent">VIDEO</span>
            </span>
            {showBadge && (
              <span className={`rounded-md border ${badgeStyle} ${s.badge} font-black uppercase tracking-wider`}>
                AI STUDIO
              </span>
            )}
          </span>
          {showTagline && (
            <span className={`mt-1 block text-[9px] font-extrabold uppercase tracking-[0.2em] ${taglineColor}`}>
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
      className="group inline-flex items-center rounded-xl outline-none transition-all duration-300 focus-visible:ring-2 focus-visible:ring-purple-400"
    >
      {content}
    </Link>
  );
}
