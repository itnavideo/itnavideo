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
  const content = (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <span
        className={`relative inline-flex ${sizing.icon} shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#0B1120] shadow-[0_12px_32px_rgba(34,211,238,0.16)]`}
        style={{
          width: sizing.iconPx,
          height: sizing.iconPx,
          minWidth: sizing.iconPx,
          maxWidth: sizing.iconPx,
          minHeight: sizing.iconPx,
          maxHeight: sizing.iconPx,
        }}
      >
        <svg
          width={sizing.iconPx}
          height={sizing.iconPx}
          viewBox="0 0 48 48"
          aria-hidden="true"
          className="relative"
          style={{ width: sizing.iconPx, height: sizing.iconPx }}
        >
          <mask id={`itnavideo-play-${size}`}>
            <rect x="0" y="0" width="48" height="48" fill="white" />
            {/* play-triangle knockout — reads as "video / play" even at 32px */}
            <polygon points="23,20 23,34 34,27" fill="black" />
          </mask>
          {/* offset back frame for depth + the brand "reveal frame" idea */}
          <rect x="11" y="11" width="20" height="20" rx="6" fill="#22D3EE" opacity="0.30" />
          {/* front frame with play knockout (navy container shows through) */}
          <rect x="17" y="17" width="20" height="20" rx="6" fill="#22D3EE" mask={`url(#itnavideo-play-${size})`} />
        </svg>
      </span>

      {!iconOnly && (
        <span className="min-w-0 leading-none">
          <span className={`block font-heading ${sizing.word} font-black tracking-normal text-white`}>
            Itna<span className="text-[#22D3EE]">video</span>
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
