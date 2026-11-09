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

const sizeMap: Record<string, { height: number; width: number; icon: number; badge: string; responsiveClass: string }> = {
  sm: { height: 26, width: 119, icon: 24, badge: 'px-1.5 py-0.5 text-[8px]', responsiveClass: 'max-h-[20px] sm:max-h-[26px]' },
  md: { height: 32, width: 146, icon: 28, badge: 'px-2 py-0.5 text-[9px]', responsiveClass: 'max-h-[24px] sm:max-h-[32px]' },
  lg: { height: 42, width: 192, icon: 36, badge: 'px-2.5 py-1 text-[10px]', responsiveClass: 'max-h-[30px] sm:max-h-[42px]' },
};

export default function BrandLogo({
  href = '/',
  size = 'md',
  iconOnly = false,
  showTagline = false,
  showBadge = false,
  variant = 'light',
  className = '',
  priority = true,
}: BrandLogoProps) {
  const s =
    typeof size === 'number'
      ? {
          height: size,
          width: Math.round(size * 4.58),
          icon: size,
          badge: 'px-2 py-0.5 text-[9px]',
          responsiveClass: `max-h-[${Math.round(size * 0.75)}px] sm:max-h-[${size}px]`,
        }
      : sizeMap[String(size)] || sizeMap.md;

  const isLight = variant === 'light';
  // Use ultra-high-definition 2130x465 master source for crystal-clear rendering across all screens
  const logoSrc = isLight ? '/brand/itnavideo-logo-full.png' : '/brand/itnavideo-logo-dark.png';
  const iconSrc = '/brand/icon.svg';

  const badgeStyle = isLight
    ? 'border-orange-500/30 bg-orange-500/10 text-orange-700'
    : 'border-orange-500/40 bg-orange-500/15 text-orange-400 shadow-xs';

  const content = (
    <span className={`inline-flex flex-col ${className}`}>
      <span className="inline-flex items-center gap-1.5 sm:gap-2 select-none">
        {iconOnly ? (
          <Image
            src={iconSrc}
            alt="Itnavideo Icon"
            width={s.icon * 2}
            height={s.icon * 2}
            priority={priority}
            quality={95}
            className={`h-auto w-auto object-contain transition-transform duration-200 group-hover:scale-105 ${s.responsiveClass}`}
            style={{ width: 'auto' }}
          />
        ) : (
          <Image
            src={logoSrc}
            alt="Itnavideo Logo"
            width={s.width * 2}
            height={s.height * 2}
            priority={priority}
            quality={95}
            className={`h-auto w-auto object-contain transition-transform duration-200 group-hover:scale-[1.01] ${s.responsiveClass}`}
            style={{ width: 'auto' }}
          />
        )}

        {showBadge && (
          <span className={`rounded-md border ${badgeStyle} ${s.badge} font-black uppercase tracking-wider shrink-0`}>
            AI STUDIO
          </span>
        )}
      </span>

      {showTagline && (
        <span className={`text-[10px] sm:text-[11px] font-medium tracking-tight mt-0.5 ${isLight ? 'text-zinc-500' : 'text-zinc-400'}`}>
          Don&apos;t edit, just speak.
        </span>
      )}
    </span>
  );

  if (!href || href === '') {
    return (
      <span aria-label="Itnavideo" className="group inline-flex items-center outline-none">
        {content}
      </span>
    );
  }

  return (
    <Link
      href={href}
      aria-label="Itnavideo"
      className="group inline-flex items-center outline-none transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-orange-500 rounded-md"
    >
      {content}
    </Link>
  );
}
