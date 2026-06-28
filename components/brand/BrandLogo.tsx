import Link from 'next/link';

type BrandLogoProps = {
  href?: string;
  size?: 'sm' | 'md' | 'lg';
  iconOnly?: boolean;
  showTagline?: boolean;
  className?: string;
};

const sizeMap = {
  sm: {
    icon: 'h-8 w-8',
    iconPx: 32,
    word: 'text-xl',
    tagline: 'text-[9px]',
  },
  md: {
    icon: 'h-10 w-10',
    iconPx: 40,
    word: 'text-2xl',
    tagline: 'text-[10px]',
  },
  lg: {
    icon: 'h-12 w-12',
    iconPx: 48,
    word: 'text-3xl',
    tagline: 'text-[11px]',
  },
};

export default function BrandLogo({
  href = '/',
  size = 'md',
  iconOnly = false,
  showTagline = false,
  className = '',
}: BrandLogoProps) {
  const sizing = sizeMap[size];
  const svgSize = Math.round(sizing.iconPx * 0.78);
  const content = (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <span
        className={`relative inline-flex ${sizing.icon} shrink-0 items-center justify-center overflow-hidden rounded-lg border border-white/10 bg-[#0F172A] shadow-[0_12px_40px_rgba(37,99,235,0.18)]`}
        style={{
          width: sizing.iconPx,
          height: sizing.iconPx,
          minWidth: sizing.iconPx,
          maxWidth: sizing.iconPx,
          minHeight: sizing.iconPx,
          maxHeight: sizing.iconPx,
        }}
      >
        <span className="absolute inset-0 bg-[radial-gradient(circle_at_28%_18%,rgba(34,211,238,0.45),transparent_28%),linear-gradient(135deg,rgba(37,99,235,0.94),rgba(6,182,212,0.82)_58%,rgba(96,165,250,0.72))]" />
        <svg
          width={svgSize}
          height={svgSize}
          viewBox="0 0 48 48"
          aria-hidden="true"
          className="relative text-black/85"
          style={{ width: svgSize, height: svgSize, maxWidth: svgSize, maxHeight: svgSize }}
        >
          <rect x="8" y="11" width="32" height="26" rx="7" fill="rgba(2,6,23,0.88)" />
          <path d="M19 18.5v11l10-5.5-10-5.5Z" fill="white" />
          <path d="M10 25h4m20 0h4" stroke="white" strokeWidth="2.4" strokeLinecap="round" opacity="0.92" />
          <path d="M14 19v10M34 19v10" stroke="#22d3ee" strokeWidth="2.4" strokeLinecap="round" />
          <path d="M6 22v4M42 22v4" stroke="#60a5fa" strokeWidth="2.4" strokeLinecap="round" />
        </svg>
      </span>

      {!iconOnly && (
        <span className="min-w-0 leading-none">
          <span className={`block font-heading ${sizing.word} font-black tracking-normal text-white`}>
            Itna<span className="text-brand-mint">video</span>
          </span>
          {showTagline && (
            <span className="mt-1 block" style={{ fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: 'var(--text-dark-muted)' }}>
              AI Shorts engine
            </span>
          )}
        </span>
      )}
    </span>
  );

  return (
    <Link href={href} aria-label="Itnavideo home" className="inline-flex rounded-lg outline-none transition hover:opacity-90 focus-visible:ring-2 focus-visible:ring-brand-mint/60">
      {content}
    </Link>
  );
}
