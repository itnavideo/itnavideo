import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

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

  // Official Brand Logo Assets:
  // - Light variant: Navy "Itna" + Orange "Video" (matches white background)
  // - Dark variant: White "Itna" + Orange "Video" (matches dark background)
  // - Icon only: Official Folded Play Ribbon (transparent)
  const logoSrc = isLight ? '/brand/logo-transparent.png' : '/brand/logo-dark.png';
  const iconSrc = '/brand/icon-transparent.png';

  const content = (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      {iconOnly ? (
        <Image
          src={iconSrc}
          alt="ItnaVideo Icon"
          width={s.icon}
          height={s.icon}
          priority={priority}
          className="shrink-0 object-contain select-none transition-transform duration-300 group-hover:scale-105"
        />
      ) : (
        <span className="flex items-center gap-2">
          <Image
            src={logoSrc}
            alt="ItnaVideo"
            width={s.width}
            height={s.height}
            priority={priority}
            className="h-auto w-auto object-contain select-none transition-transform duration-300 group-hover:scale-[1.02]"
          />
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
