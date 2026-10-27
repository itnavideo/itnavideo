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
  variant = 'dark',
  className = '',
}: BrandLogoProps) {
  const s = typeof size === 'number'
    ? { icon: size, word: 'text-lg sm:text-xl', tagline: 'text-[10px]', badge: 'px-2 py-0.5 text-[9px]' }
    : (sizeMap[String(size)] || sizeMap.md);

  // Ensure ITNA is always high-contrast:
  // variant === 'light' -> dark obsidian (text-slate-900) for white/light backgrounds
  // variant === 'dark' or default ('auto') -> crisp white (text-white) for all dashboards and dark surfaces
  const isLight = variant === 'light';

  const itnaTextColor = isLight ? 'text-slate-900' : 'text-white';

  const badgeStyle = isLight
    ? 'border-[#FF5722]/30 bg-[#FF5722]/10 text-[#FF5722]'
    : 'border-[#FFA000]/40 bg-[#FFA000]/15 text-[#FFA000] shadow-xs';

  const taglineColor = isLight
    ? 'text-slate-500'
    : 'text-zinc-400';

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
          className="w-full h-full drop-shadow-[0_2px_14px_rgba(255,87,34,0.35)]"
        >
          <defs>
            {/* Signature Flame Orange & Warm Amber Gradient for Hollow Play Ribbon */}
            <linearGradient id="itnaBrandPlayGrad" x1="15%" y1="0%" x2="85%" y2="100%">
              <stop offset="0%" stopColor="#FF7A45" />
              <stop offset="50%" stopColor="#FF5722" />
              <stop offset="100%" stopColor="#F4511E" />
            </linearGradient>
          </defs>

          {/* Unified Hollow Rounded Play Triangle */}
          <path
            d="M 28 22 C 28 16 34 12.5 39 15.5 L 80 43.5 C 85 46.5 85 53.5 80 56.5 L 39 84.5 C 34 87.5 28 84 28 78 Z"
            fill="none"
            stroke="url(#itnaBrandPlayGrad)"
            strokeWidth="15"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        </svg>
      </span>

      {!iconOnly && (
        <span className="min-w-0 leading-none">
          <span className="flex items-center gap-2">
            {/* High-Contrast Bold Typography matching Brand Image (ItnaVideo) */}
            <span className={`block font-sans ${s.word} font-black tracking-tight select-none`}>
              <span className={itnaTextColor}>Itna</span>
              <span className="text-[#FF5722]">Video</span>
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
