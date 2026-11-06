import React from 'react';
import Link from 'next/link';

export type BrandLogoProps = {
  href?: string | null;
  size?: 'sm' | 'md' | 'lg' | number | string;
  iconOnly?: boolean;
  showTagline?: boolean;
  showBadge?: boolean;
  variant?: 'auto' | 'light' | 'dark';
  className?: string;
  priority?: boolean;
};

const sizeMap: Record<string, { height: number; width: number; icon: number; tagline: string; badge: string }> = {
  sm: { height: 28, width: 134, icon: 28, tagline: 'text-[9px]', badge: 'px-1.5 py-0.5 text-[8px]' },
  md: { height: 34, width: 162, icon: 34, tagline: 'text-[10px]', badge: 'px-2 py-0.5 text-[9px]' },
  lg: { height: 44, width: 210, icon: 44, tagline: 'text-[11px]', badge: 'px-2.5 py-1 text-[10px]' },
};

export default function BrandLogo({
  href = '/',
  size = 'md',
  iconOnly = false,
  showTagline = false,
  showBadge = false,
  variant = 'dark',
  className = '',
  priority = false,
}: BrandLogoProps) {
  const s = typeof size === 'number'
    ? { height: size, width: Math.round(size * 4.78), icon: size, tagline: 'text-[10px]', badge: 'px-2 py-0.5 text-[9px]' }
    : (sizeMap[String(size)] || sizeMap.md);

  const isLight = variant === 'light';

  const badgeStyle = isLight
    ? 'border-[#FF5722]/30 bg-[#FF5722]/10 text-[#FF5722]'
    : 'border-[#FFA000]/40 bg-[#FFA000]/15 text-[#FFA000] shadow-xs';

  const taglineColor = isLight ? 'text-slate-600' : 'text-zinc-400';

  const content = (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      {iconOnly ? (
        <svg
          width={s.icon}
          height={s.icon}
          viewBox="0 0 80 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="shrink-0 select-none transition-transform duration-300 group-hover:scale-105"
          aria-label="ItnaVideo Icon"
        >
          <defs>
            <linearGradient id="brandLogoGradIcon" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF6D00" />
              <stop offset="100%" stopColor="#FFA726" />
            </linearGradient>
            <filter id="brandLogoGlowIcon" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#FF6D00" floodOpacity="0.35" />
            </filter>
          </defs>
          <g transform="translate(10, 9)" filter="url(#brandLogoGlowIcon)">
            <path
              d="M 10 4 C 10 1.5 12.8 0 15 1.4 L 56 28 C 58 29.3 58 32.7 56 34 L 15 60.6 C 12.8 62 10 60.5 10 58 Z"
              fill="url(#brandLogoGradIcon)"
            />
          </g>
        </svg>
      ) : (
        <span className="flex items-center gap-2">
          <svg
            width={s.width}
            height={s.height}
            viewBox="0 0 340 80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="h-auto object-contain select-none transition-transform duration-300 group-hover:scale-[1.02]"
            aria-label="ItnaVideo Logo"
          >
            <defs>
              <linearGradient id={isLight ? "brandGradLight" : "brandGradDark"} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FF6D00" />
                <stop offset="100%" stopColor="#FFA726" />
              </linearGradient>
              <filter id={isLight ? "brandGlowLight" : "brandGlowDark"} x="-30%" y="-30%" width="160%" height="160%">
                <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#FF6D00" floodOpacity={isLight ? "0.3" : "0.45"} />
              </filter>
            </defs>

            {/* PLAY TRIANGLE ICON */}
            <g transform="translate(6, 12)" filter={`url(#${isLight ? "brandGlowLight" : "brandGlowDark"})`}>
              <path
                d="M 10 4 C 10 1.5 12.8 0 15 1.4 L 56 28 C 58 29.3 58 32.7 56 34 L 15 60.6 C 12.8 62 10 60.5 10 58 Z"
                fill={`url(#${isLight ? "brandGradLight" : "brandGradDark"})`}
              />
            </g>

            {/* WORDMARK: "Itna" + "Video" */}
            <text
              x="80"
              y="53"
              fontFamily="'Plus Jakarta Sans', 'Inter', system-ui, -apple-system, sans-serif"
              fontWeight="800"
              fontSize="44"
              letterSpacing="-1"
            >
              <tspan fill={isLight ? "#0E1526" : "#FFFFFF"}>Itna</tspan>
              <tspan fill="#FF6D00">Video</tspan>
            </text>
          </svg>

          {showBadge && (
            <span className={`rounded-md border ${badgeStyle} ${s.badge} font-black uppercase tracking-wider shrink-0`}>
              AI STUDIO
            </span>
          )}
        </span>
      )}
      {showTagline && (
        <span className={`mt-0.5 block ${s.tagline} font-medium leading-snug ${taglineColor}`}>
          Create stunning videos with AI. No editing needed.
        </span>
      )}
    </span>
  );

  if (!href || href === '') {
    return (
      <span aria-label="ItnaVideo" className="group inline-flex items-center rounded-xl outline-none">
        {content}
      </span>
    );
  }

  return (
    <Link
      href={href}
      aria-label="ItnaVideo"
      className="group inline-flex items-center rounded-xl outline-none transition-all duration-300 focus-visible:ring-2 focus-visible:ring-orange-400"
    >
      {content}
    </Link>
  );
}
