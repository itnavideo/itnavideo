import React from 'react';
import * as LucideIcons from 'lucide-react';
import { interpolate, useCurrentFrame } from 'remotion';

export type Whiteboard2DType =
  | 'character_thinking'
  | 'character_happy'
  | 'savings_jar'
  | 'medical_emergency'
  | 'car_repairs'
  | 'graduation_cap'
  | 'future_house'
  | 'emergency_siren'
  | 'wealth_plant'
  | 'target_bullseye'
  | 'thought_bubble'
  | 'curly_bracket'
  | 'curved_arrow'
  | 'sparkle_rays'
  | 'growth_chart'
  | 'lightbulb_idea'
  | 'handshake_deal';

export interface Whiteboard2DIconProps {
  type: Whiteboard2DType | string;
  size?: number | string;
  animated?: boolean;
  startFrame?: number;
  durationFrames?: number;
  drawProgress?: number;
  label?: string;
  style?: React.CSSProperties;
  className?: string;
}

/**
 * Whiteboard2DIcon — Rich 2D colored illustrations with bold black outlines
 * matching the executive & educational whiteboard explainer standard.
 */

function getLucideIcon(name: string) {
  if (!name || typeof name !== 'string') return null;
  const clean = name.replace(/^(icon_|character_|whiteboard_|hero_)/, '');
  const pascal = clean
    .split(/[-_]/)
    .map(p => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase())
    .join('');
  return (LucideIcons as any)[pascal] || null;
}

export const Whiteboard2DIcon: React.FC<Whiteboard2DIconProps> = ({
  type,
  size = 120,
  animated = true,
  startFrame = 0,
  durationFrames = 18,
  drawProgress,
  label,
  style = {},
  className = '',
}) => {
  const frame = useCurrentFrame();

  const isProgressive = drawProgress !== undefined;

  const progress = isProgressive
    ? drawProgress
    : animated
    ? interpolate(frame, [startFrame, startFrame + durationFrames], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
    : 1;

  if (progress <= 0) return null;

  // VideoScribe 2-Stage Timing:
  // 1. Black ink outline drawing phase (0.0 to 0.68)
  const outlineProgress = isProgressive ? Math.min(1, Math.max(0, progress / 0.68)) : 1;
  // 2. Delayed color accent fill phase (0.65 to 1.0)
  const colorProgress = isProgressive ? Math.min(1, Math.max(0, (progress - 0.65) / 0.32)) : 1;

  // Progressive reveal sweep: unrolls from top to bottom matching marker pen sweep
  const revealBottomY = Math.min(100, outlineProgress * 108);
  const revealBottomLeftY = Math.min(100, outlineProgress * 108 - 6);
  const progressiveClip = isProgressive && outlineProgress < 0.99
    ? `polygon(0 0, 100% 0, 100% ${revealBottomY}%, 0% ${Math.max(0, revealBottomLeftY)}%)`
    : undefined;

  // Delayed color filter: high-contrast black ink sketch first, then saturated color fill floods in
  const progressiveFilter = isProgressive && colorProgress < 0.99
    ? `grayscale(${1 - colorProgress}) contrast(${1 + (1 - colorProgress) * 0.4}) saturate(${colorProgress * 100}%)`
    : undefined;

  // Subtle natural drawing scale
  const scale = isProgressive ? 0.94 + outlineProgress * 0.06 : 0.85 + progress * 0.15;
  const opacity = isProgressive ? (outlineProgress > 0.02 ? 1 : 0) : Math.min(1, progress * 1.4);

  const containerStyle: React.CSSProperties = {
    width: size,
    height: size,
    display: 'inline-flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    opacity,
    transform: `scale(${scale})`,
    transformOrigin: 'center center',
    overflow: 'visible',
    clipPath: progressiveClip,
    filter: progressiveFilter,
    transition: 'filter 0.08s ease-out',
    ...style,
  };

  switch (type) {
    // ── 1. THINKING 2D BOY / PERSON ───────────────────────────────────────────
    case 'character_thinking':
      return (
        <div style={containerStyle} className={className}>
          <svg viewBox="0 0 160 220" width="100%" height="100%" style={{ overflow: 'visible' }}>
            {/* Blue T-Shirt Body */}
            <path
              d="M 38 120 C 38 108 52 98 80 98 C 108 98 122 108 122 120 L 132 210 L 28 210 Z"
              fill="#2563EB"
              stroke="#0F172A"
              strokeWidth="4"
              strokeLinejoin="round"
            />
            {/* T-Shirt Collar */}
            <path
              d="M 66 98 C 72 108 88 108 94 98"
              fill="#1D4ED8"
              stroke="#0F172A"
              strokeWidth="3.5"
            />
            {/* Left Arm on Chin (Thinking Pose) */}
            <path
              d="M 120 125 C 135 150 120 180 100 170 L 88 135 L 86 115"
              fill="#FDBA74"
              stroke="#0F172A"
              strokeWidth="4"
              strokeLinejoin="round"
            />
            {/* Hand on Chin */}
            <ellipse cx="88" cy="115" rx="8" ry="7" fill="#FDBA74" stroke="#0F172A" strokeWidth="3" />
            <path d="M 84 112 C 86 108 90 108 92 112" stroke="#0F172A" strokeWidth="2.5" fill="none" />

            {/* Neck */}
            <rect x="70" y="82" width="20" height="20" fill="#FED7AA" stroke="#0F172A" strokeWidth="3.5" />

            {/* Head / Face */}
            <ellipse cx="80" cy="58" rx="28" ry="32" fill="#FED7AA" stroke="#0F172A" strokeWidth="4" />

            {/* Dark Hair */}
            <path
              d="M 52 50 C 48 30 62 18 80 16 C 98 14 112 25 108 50 C 102 34 88 30 76 34 C 64 38 58 44 52 50 Z"
              fill="#1E293B"
              stroke="#0F172A"
              strokeWidth="3.5"
              strokeLinejoin="round"
            />
            {/* Hair spikes on top */}
            <path d="M 72 18 L 68 10 L 78 16" fill="#1E293B" stroke="#0F172A" strokeWidth="2.5" />
            <path d="M 84 15 L 88 8 L 92 16" fill="#1E293B" stroke="#0F172A" strokeWidth="2.5" />

            {/* Ears */}
            <ellipse cx="52" cy="62" rx="4" ry="7" fill="#FED7AA" stroke="#0F172A" strokeWidth="3" />
            <ellipse cx="108" cy="62" rx="4" ry="7" fill="#FED7AA" stroke="#0F172A" strokeWidth="3" />

            {/* Eyes looking up/side (thinking) */}
            <circle cx="70" cy="54" r="3.5" fill="#0F172A" />
            <circle cx="90" cy="54" r="3.5" fill="#0F172A" />
            {/* Eyebrows */}
            <path d="M 64 46 Q 70 42 76 46" stroke="#0F172A" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <path d="M 84 46 Q 90 42 96 46" stroke="#0F172A" strokeWidth="2.5" fill="none" strokeLinecap="round" />

            {/* Nose & Slight Pondering Mouth */}
            <path d="M 80 58 L 78 66 L 82 66" stroke="#0F172A" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <path d="M 74 74 Q 80 72 86 74" stroke="#0F172A" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          </svg>
        </div>
      );

    // ── 2. HAPPY / LESS STRESS CHARACTER ─────────────────────────────────────
    case 'character_happy':
      return (
        <div style={containerStyle} className={className}>
          <svg viewBox="0 0 120 120" width="100%" height="100%" style={{ overflow: 'visible' }}>
            {/* Relief sparkles around head */}
            <path d="M 24 36 L 14 32 M 28 22 L 20 14 M 96 36 L 106 32 M 92 22 L 100 14" stroke="#38BDF8" strokeWidth="3" strokeLinecap="round" />
            {/* Body */}
            <path d="M 35 85 C 35 76 48 70 60 70 C 72 70 85 76 85 85 L 88 115 L 32 115 Z" fill="#3B82F6" stroke="#0F172A" strokeWidth="3.5" />
            {/* Head */}
            <ellipse cx="60" cy="46" rx="20" ry="22" fill="#FED7AA" stroke="#0F172A" strokeWidth="3.5" />
            {/* Dark Hair */}
            <path d="M 40 40 C 38 25 50 16 60 16 C 70 16 82 25 80 40 C 74 28 66 26 56 28 Z" fill="#1E293B" stroke="#0F172A" strokeWidth="3" />
            {/* Happy Closed Smiling Eyes (^^) */}
            <path d="M 50 44 Q 54 40 58 44" stroke="#0F172A" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <path d="M 62 44 Q 66 40 70 44" stroke="#0F172A" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            {/* Big Smile */}
            <path d="M 52 54 Q 60 62 68 54" stroke="#0F172A" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            {/* Rosy Cheeks */}
            <ellipse cx="48" cy="50" rx="3" ry="2" fill="#F87171" opacity="0.6" />
            <ellipse cx="72" cy="50" rx="3" ry="2" fill="#F87171" opacity="0.6" />
          </svg>
        </div>
      );

    // ── 3. HERO SAVINGS JAR (Glass jar with golden coins & label) ─────────────
    case 'savings_jar':
      return (
        <div style={containerStyle} className={className}>
          <svg viewBox="0 0 200 240" width="100%" height="100%" style={{ overflow: 'visible' }}>
            {/* Excitement Spark Rays */}
            <path d="M 28 100 L 14 96 M 24 130 L 10 134 M 172 100 L 186 96 M 176 130 L 190 134" stroke="#F59E0B" strokeWidth="4.5" strokeLinecap="round" />

            {/* Jar Rim & Metal Cap */}
            <rect x="58" y="24" width="84" height="14" rx="4" fill="#38BDF8" stroke="#0F172A" strokeWidth="4" />
            <rect x="52" y="38" width="96" height="10" rx="3" fill="#BAE6FD" stroke="#0F172A" strokeWidth="3.5" />

            {/* Glass Jar Body (Translucent Blue fill + Black Outline) */}
            <path
              d="M 58 48 C 34 56 30 82 30 115 C 30 160 34 212 50 220 C 66 226 134 226 150 220 C 166 212 170 160 170 115 C 170 82 166 56 142 48 Z"
              fill="#F0F9FF"
              stroke="#0F172A"
              strokeWidth="4.5"
              strokeLinejoin="round"
            />

            {/* Inner Glass Highlights / Reflections */}
            <path d="M 40 85 C 38 120 42 180 48 205" stroke="#BAE6FD" strokeWidth="4.5" fill="none" strokeLinecap="round" />

            {/* Golden Coins inside Jar (Piled Up) */}
            <ellipse cx="70" cy="204" rx="16" ry="10" fill="#FBBF24" stroke="#D97706" strokeWidth="2.5" />
            <ellipse cx="100" cy="208" rx="18" ry="10" fill="#F59E0B" stroke="#B45309" strokeWidth="2.5" />
            <ellipse cx="130" cy="202" rx="16" ry="10" fill="#FBBF24" stroke="#D97706" strokeWidth="2.5" />

            <ellipse cx="60" cy="186" rx="16" ry="9" fill="#FBBF24" stroke="#D97706" strokeWidth="2.5" />
            <ellipse cx="88" cy="190" rx="18" ry="10" fill="#FDE047" stroke="#D97706" strokeWidth="2.5" />
            <ellipse cx="118" cy="188" rx="17" ry="10" fill="#F59E0B" stroke="#B45309" strokeWidth="2.5" />
            <ellipse cx="140" cy="184" rx="15" ry="9" fill="#FBBF24" stroke="#D97706" strokeWidth="2.5" />

            <ellipse cx="74" cy="170" rx="17" ry="9" fill="#F59E0B" stroke="#B45309" strokeWidth="2.5" />
            <ellipse cx="102" cy="172" rx="18" ry="10" fill="#FDE047" stroke="#D97706" strokeWidth="2.5" />
            <ellipse cx="128" cy="168" rx="16" ry="9" fill="#FBBF24" stroke="#D97706" strokeWidth="2.5" />

            <ellipse cx="88" cy="154" rx="18" ry="9" fill="#FDE047" stroke="#D97706" strokeWidth="2.5" />
            <ellipse cx="114" cy="152" rx="17" ry="9" fill="#F59E0B" stroke="#B45309" strokeWidth="2.5" />

            {/* Center "SAVINGS" White Card Label */}
            <rect
              x="50"
              y="110"
              width="100"
              height="38"
              rx="6"
              fill="#FFFFFF"
              stroke="#0F172A"
              strokeWidth="3.5"
            />
            <text
              x="100"
              y="136"
              fontFamily="system-ui, -apple-system, sans-serif"
              fontWeight="900"
              fontSize="18"
              letterSpacing="0.08em"
              fill="#0F172A"
              textAnchor="middle"
            >
              {label || 'SAVINGS'}
            </text>

            {/* Jar Base Shadow */}
            <ellipse cx="100" cy="232" rx="55" ry="8" fill="#CBD5E1" opacity="0.6" />
          </svg>
        </div>
      );

    // ── 4. FIRST AID KIT / MEDICAL EMERGENCY ──────────────────────────────────
    case 'medical_emergency':
      return (
        <div style={containerStyle} className={className}>
          <svg viewBox="0 0 90 80" width="100%" height="100%" style={{ overflow: 'visible' }}>
            {/* Box Handle */}
            <path d="M 32 18 L 32 8 C 32 6 36 4 45 4 C 54 4 58 6 58 8 L 58 18" fill="none" stroke="#64748B" strokeWidth="3.5" strokeLinecap="round" />
            {/* White Kit Box */}
            <rect x="8" y="16" width="74" height="56" rx="10" fill="#FFFFFF" stroke="#0F172A" strokeWidth="3.5" />
            {/* Red Medical Cross */}
            <path
              d="M 38 28 H 52 V 37 H 61 V 51 H 52 V 60 H 38 V 51 H 29 V 37 H 38 Z"
              fill="#EF4444"
              stroke="#B91C1C"
              strokeWidth="2"
            />
          </svg>
        </div>
      );

    // ── 5. BLUE CAR / CAR REPAIRS ─────────────────────────────────────────────
    case 'car_repairs':
      return (
        <div style={containerStyle} className={className}>
          <svg viewBox="0 0 100 70" width="100%" height="100%" style={{ overflow: 'visible' }}>
            {/* Car Upper Cabin */}
            <path d="M 24 35 L 36 14 L 68 14 L 78 35 Z" fill="#60A5FA" stroke="#0F172A" strokeWidth="3.5" />
            {/* Windows */}
            <polygon points="38,18 48,18 48,32 30,32" fill="#E0F2FE" />
            <polygon points="52,18 64,18 72,32 52,32" fill="#E0F2FE" />
            {/* Car Lower Body */}
            <rect x="10" y="32" width="80" height="22" rx="7" fill="#3B82F6" stroke="#0F172A" strokeWidth="3.5" />
            {/* Headlights & Tail Lights */}
            <circle cx="86" cy="40" r="3.5" fill="#FDE047" stroke="#0F172A" strokeWidth="1.5" />
            <circle cx="14" cy="40" r="3.5" fill="#EF4444" stroke="#0F172A" strokeWidth="1.5" />
            {/* Wheels */}
            <circle cx="28" cy="54" r="9" fill="#1E293B" stroke="#0F172A" strokeWidth="3.5" />
            <circle cx="28" cy="54" r="3.5" fill="#94A3B8" />
            <circle cx="72" cy="54" r="9" fill="#1E293B" stroke="#0F172A" strokeWidth="3.5" />
            <circle cx="72" cy="54" r="3.5" fill="#94A3B8" />
          </svg>
        </div>
      );

    // ── 6. GRADUATION CAP / FUTURE GOALS ──────────────────────────────────────
    case 'graduation_cap':
      return (
        <div style={containerStyle} className={className}>
          <svg viewBox="0 0 90 70" width="100%" height="100%" style={{ overflow: 'visible' }}>
            {/* Cap Diamond Top */}
            <polygon points="45,10 82,24 45,38 8,24" fill="#1E293B" stroke="#0F172A" strokeWidth="3.5" strokeLinejoin="round" />
            {/* Cap Skull Under-base */}
            <path d="M 24 32 L 24 46 C 24 54 66 54 66 46 L 66 32" fill="#334155" stroke="#0F172A" strokeWidth="3" />
            {/* Gold Tassel button & String */}
            <circle cx="45" cy="24" r="3" fill="#F59E0B" />
            <path d="M 45 24 Q 65 30 74 44" stroke="#F59E0B" strokeWidth="3" fill="none" />
            <rect x="71" y="42" width="6" height="12" rx="2" fill="#D97706" />
          </svg>
        </div>
      );

    // ── 7. EMERGENCY SIREN / ALARM ────────────────────────────────────────────
    case 'emergency_siren':
      return (
        <div style={containerStyle} className={className}>
          <svg viewBox="0 0 90 85" width="100%" height="100%" style={{ overflow: 'visible' }}>
            {/* Light Rays */}
            <path d="M 18 20 L 10 14 M 45 8 L 45 2 M 72 20 L 80 14" stroke="#F97316" strokeWidth="3.5" strokeLinecap="round" />
            {/* Red Siren Dome */}
            <path d="M 25 58 C 25 32 32 18 45 18 C 58 18 65 32 65 58 Z" fill="#EF4444" stroke="#0F172A" strokeWidth="3.5" />
            {/* Gloss highlight on dome */}
            <path d="M 34 32 C 34 26 38 22 45 22" stroke="#FCA5A5" strokeWidth="3.5" fill="none" strokeLinecap="round" />
            {/* Metallic Base */}
            <rect x="18" y="58" width="54" height="14" rx="4" fill="#475569" stroke="#0F172A" strokeWidth="3.5" />
            <rect x="14" y="70" width="62" height="6" rx="2" fill="#0F172A" />
          </svg>
        </div>
      );

    // ── 8. WEALTH PLANT (Coins + Sprout) ──────────────────────────────────────
    case 'wealth_plant':
      return (
        <div style={containerStyle} className={className}>
          <svg viewBox="0 0 90 90" width="100%" height="100%" style={{ overflow: 'visible' }}>
            {/* Gold Coins Base Stack */}
            <ellipse cx="45" cy="74" rx="22" ry="7" fill="#FBBF24" stroke="#0F172A" strokeWidth="3" />
            <ellipse cx="45" cy="64" rx="20" ry="6" fill="#F59E0B" stroke="#0F172A" strokeWidth="3" />
            <ellipse cx="45" cy="54" rx="18" ry="6" fill="#FDE047" stroke="#0F172A" strokeWidth="3" />
            {/* Green Stem */}
            <path d="M 45 54 Q 45 32 45 20" stroke="#16A34A" strokeWidth="4" fill="none" strokeLinecap="round" />
            {/* Left Leaf */}
            <path d="M 45 36 C 30 36 24 24 24 24 C 24 24 38 20 45 36 Z" fill="#22C55E" stroke="#0F172A" strokeWidth="2.5" />
            {/* Right Leaf */}
            <path d="M 45 28 C 60 28 66 16 66 16 C 66 16 52 12 45 28 Z" fill="#22C55E" stroke="#0F172A" strokeWidth="2.5" />
          </svg>
        </div>
      );

    // ── 9. TARGET BULLSEYE WITH DART ──────────────────────────────────────────
    case 'target_bullseye':
      return (
        <div style={containerStyle} className={className}>
          <svg viewBox="0 0 90 90" width="100%" height="100%" style={{ overflow: 'visible' }}>
            {/* Concentric Circles */}
            <circle cx="45" cy="45" r="36" fill="#EF4444" stroke="#0F172A" strokeWidth="3.5" />
            <circle cx="45" cy="45" r="26" fill="#FFFFFF" stroke="#0F172A" strokeWidth="3" />
            <circle cx="45" cy="45" r="16" fill="#EF4444" stroke="#0F172A" strokeWidth="3" />
            <circle cx="45" cy="45" r="6" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2" />
            {/* Dart hitting center */}
            <path d="M 16 16 L 43 43" stroke="#0F172A" strokeWidth="4" strokeLinecap="round" />
            <polygon points="12,12 24,14 14,24" fill="#3B82F6" stroke="#0F172A" strokeWidth="2" />
          </svg>
        </div>
      );

    // ── 10. THOUGHT BUBBLE ────────────────────────────────────────────────────
    case 'thought_bubble':
      return (
        <div style={containerStyle} className={className}>
          <svg viewBox="0 0 160 110" width="100%" height="100%" style={{ overflow: 'visible' }}>
            {/* Little circles leading up to cloud */}
            <circle cx="28" cy="98" r="4.5" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2.5" />
            <circle cx="40" cy="85" r="7.5" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2.5" />
            {/* Main Cloud */}
            <path
              d="M 60 78 C 45 78 40 65 40 54 C 40 42 50 34 62 34 C 64 22 80 16 96 16 C 114 16 128 24 130 36 C 142 36 150 46 150 56 C 150 68 140 78 126 78 Z"
              fill="#FFFFFF"
              stroke="#0F172A"
              strokeWidth="3.5"
              strokeLinejoin="round"
            />
            {label && (
              <text
                x="95"
                y="52"
                fontFamily="system-ui, -apple-system, sans-serif"
                fontWeight="700"
                fontSize="13"
                fill="#0F172A"
                textAnchor="middle"
              >
                {label}
              </text>
            )}
          </svg>
        </div>
      );

    // ── 11. CURLY BRACKET ─────────────────────────────────────────────────────
    case 'curly_bracket':
      return (
        <div style={containerStyle} className={className}>
          <svg viewBox="0 0 40 140" width="100%" height="100%" style={{ overflow: 'visible' }}>
            <path
              d="M 30 10 C 15 10 15 30 15 50 C 15 65 5 70 5 70 C 5 70 15 75 15 90 C 15 110 15 130 30 130"
              fill="none"
              stroke="#0F172A"
              strokeWidth="4"
              strokeLinecap="round"
            />
          </svg>
        </div>
      );

    // ── 12. CURVED ARROW ──────────────────────────────────────────────────────
    case 'curved_arrow':
      return (
        <div style={containerStyle} className={className}>
          <svg viewBox="0 0 80 80" width="100%" height="100%" style={{ overflow: 'visible' }}>
            <path
              d="M 12 18 C 12 52 42 64 68 64 M 56 52 L 70 64 L 56 76"
              fill="none"
              stroke="#0F172A"
              strokeWidth="4.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      );

    // ── 13. SPARKLE RAYS ──────────────────────────────────────────────────────
    case 'sparkle_rays':
      return (
        <div style={containerStyle} className={className}>
          <svg viewBox="0 0 80 50" width="100%" height="100%" style={{ overflow: 'visible' }}>
            <path d="M 14 36 L 4 44 M 24 20 L 16 10 M 42 12 L 42 2 M 60 20 L 68 10 M 70 36 L 80 44" stroke="#38BDF8" strokeWidth="4" strokeLinecap="round" />
          </svg>
        </div>
      );

    // ── 14. 2D GROWTH BAR CHART ───────────────────────────────────────────────
    case 'growth_chart':
      return (
        <div style={containerStyle} className={className}>
          <svg viewBox="0 0 100 85" width="100%" height="100%" style={{ overflow: 'visible' }}>
            <path d="M 15 10 L 15 75 L 92 75" stroke="#0F172A" strokeWidth="3.5" fill="none" strokeLinecap="round" />
            <rect x="25" y="48" width="14" height="26" rx="3" fill="#60A5FA" stroke="#0F172A" strokeWidth="2.5" />
            <rect x="45" y="32" width="14" height="42" rx="3" fill="#3B82F6" stroke="#0F172A" strokeWidth="2.5" />
            <rect x="65" y="18" width="14" height="56" rx="3" fill="#2563EB" stroke="#0F172A" strokeWidth="2.5" />
            <path d="M 22 54 Q 50 40 85 14 M 72 14 L 86 14 L 86 28" stroke="#16A34A" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      );

    // ── 15. 2D LIGHTBULB IDEA ─────────────────────────────────────────────────
    case 'lightbulb_idea':
      return (
        <div style={containerStyle} className={className}>
          <svg viewBox="0 0 90 90" width="100%" height="100%" style={{ overflow: 'visible' }}>
            <path d="M 45 6 L 45 0 M 18 16 L 10 10 M 72 16 L 80 10 M 10 38 L 2 38 M 80 38 L 88 38" stroke="#F59E0B" strokeWidth="3.5" strokeLinecap="round" />
            <path d="M 30 46 C 22 36 24 20 36 12 C 48 4 64 12 64 26 C 64 34 58 42 54 48 L 54 58 L 36 58 Z" fill="#FDE047" stroke="#0F172A" strokeWidth="3.5" strokeLinejoin="round" />
            <path d="M 40 46 L 40 32 L 45 38 L 50 32 L 50 46" stroke="#D97706" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <rect x="38" y="60" width="14" height="6" rx="2" fill="#94A3B8" stroke="#0F172A" strokeWidth="2" />
            <rect x="40" y="66" width="10" height="4" rx="2" fill="#64748B" stroke="#0F172A" strokeWidth="2" />
          </svg>
        </div>
      );

    // ── 16. FUTURE HOUSE / DREAM HOME ─────────────────────────────────────────
    case 'future_house':
      return (
        <div style={containerStyle} className={className}>
          <svg viewBox="0 0 100 95" width="100%" height="100%" style={{ overflow: 'visible' }}>
            {/* Chimney & Smoke Puff */}
            <rect x="68" y="18" width="10" height="22" rx="2" fill="#94A3B8" stroke="#0F172A" strokeWidth="2.5" />
            <path d="M 73 14 Q 78 8 72 4" stroke="#CBD5E1" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            {/* Red Pitched Roof */}
            <polygon points="14,44 50,14 86,44" fill="#EF4444" stroke="#0F172A" strokeWidth="3.5" strokeLinejoin="round" />
            {/* Warm House Wall Base */}
            <rect x="22" y="44" width="56" height="42" fill="#FEF08A" stroke="#0F172A" strokeWidth="3.5" />
            {/* Blue Front Door */}
            <rect x="42" y="58" width="16" height="28" rx="3" fill="#3B82F6" stroke="#0F172A" strokeWidth="2.5" />
            <circle cx="53" cy="72" r="1.8" fill="#FDE047" />
            {/* Window with 4 Panes */}
            <rect x="62" y="52" width="12" height="12" rx="2" fill="#E0F2FE" stroke="#0F172A" strokeWidth="2" />
            <line x1="68" y1="52" x2="68" y2="64" stroke="#0F172A" strokeWidth="1.5" />
            <line x1="62" y1="58" x2="74" y2="58" stroke="#0F172A" strokeWidth="1.5" />
            {/* Garden Green Bush */}
            <circle cx="18" cy="84" r="6" fill="#22C55E" stroke="#0F172A" strokeWidth="2" />
            <circle cx="82" cy="84" r="6" fill="#22C55E" stroke="#0F172A" strokeWidth="2" />
          </svg>
        </div>
      );

    // ── 17. GOLDEN TROPHY / SUCCESS CUP ──────────────────────────────────────
    case 'trophy_gold':
    case 'trophy':
      return (
        <div style={containerStyle} className={className}>
          <svg viewBox="0 0 100 100" width="100%" height="100%" style={{ overflow: 'visible' }}>
            {/* Base Pedestal */}
            <rect x="32" y="82" width="36" height="12" rx="3" fill="#1E293B" stroke="#0F172A" strokeWidth="3" />
            <rect x="42" y="68" width="16" height="14" fill="#D97706" stroke="#0F172A" strokeWidth="3" />
            {/* Cup Stem Base */}
            <path d="M 38 68 L 62 68 L 56 54 L 44 54 Z" fill="#F59E0B" stroke="#0F172A" strokeWidth="3" />
            {/* Left Handle */}
            <path d="M 30 24 C 14 24 14 48 32 48" fill="none" stroke="#0F172A" strokeWidth="4.5" strokeLinecap="round" />
            <path d="M 30 24 C 18 24 18 44 32 44" fill="none" stroke="#FBBF24" strokeWidth="2.5" />
            {/* Right Handle */}
            <path d="M 70 24 C 86 24 86 48 68 48" fill="none" stroke="#0F172A" strokeWidth="4.5" strokeLinecap="round" />
            <path d="M 70 24 C 82 24 82 44 68 44" fill="none" stroke="#FBBF24" strokeWidth="2.5" />
            {/* Golden Cup Bowl */}
            <path
              d="M 28 16 C 28 46 40 56 50 56 C 60 56 72 46 72 16 Z"
              fill="#FBBF24"
              stroke="#0F172A"
              strokeWidth="4"
              strokeLinejoin="round"
            />
            {/* Front Star Emblem */}
            <polygon points="50,26 53,34 61,34 55,39 57,47 50,42 43,47 45,39 39,34 47,34" fill="#FFFFFF" stroke="#0F172A" strokeWidth="1.5" />
            {/* Blue Accent Ribbon */}
            <path d="M 45 58 L 40 76 L 47 72 L 53 76 L 50 58" fill="#3B82F6" stroke="#0F172A" strokeWidth="2" />
          </svg>
        </div>
      );

    // ── 18. PIGGY BANK / SAVINGS & ENTREPRENEUR ────────────────────────────────
    case 'piggy_bank':
    case 'savings':
      return (
        <div style={containerStyle} className={className}>
          <svg viewBox="0 0 100 100" width="100%" height="100%" style={{ overflow: 'visible' }}>
            {/* Dropping Gold Coin */}
            <circle cx="50" cy="14" r="8" fill="#F59E0B" stroke="#0F172A" strokeWidth="3" />
            <text x="50" y="18" fontSize="10" fontWeight="900" textAnchor="middle" fill="#0F172A">$</text>
            {/* Pig Ears */}
            <polygon points="32,32 24,18 38,24" fill="#F472B6" stroke="#0F172A" strokeWidth="3" strokeLinejoin="round" />
            {/* Pig Body */}
            <ellipse cx="50" cy="56" rx="34" ry="26" fill="#FBCFE8" stroke="#0F172A" strokeWidth="4" />
            {/* Coin Slot */}
            <rect x="42" y="32" width="16" height="4" rx="2" fill="#0F172A" />
            {/* Pig Snout */}
            <ellipse cx="20" cy="56" rx="8" ry="11" fill="#F472B6" stroke="#0F172A" strokeWidth="3" />
            <circle cx="18" cy="54" r="1.8" fill="#0F172A" />
            <circle cx="18" cy="58" r="1.8" fill="#0F172A" />
            {/* Eye */}
            <circle cx="34" cy="46" r="3" fill="#0F172A" />
            <circle cx="35" cy="45" r="1" fill="#FFFFFF" />
            {/* Legs */}
            <rect x="34" y="78" width="8" height="12" rx="3" fill="#F472B6" stroke="#0F172A" strokeWidth="3" />
            <rect x="58" y="78" width="8" height="12" rx="3" fill="#F472B6" stroke="#0F172A" strokeWidth="3" />
            {/* Curly Tail */}
            <path d="M 84 52 C 90 48 94 54 88 58" fill="none" stroke="#0F172A" strokeWidth="3" strokeLinecap="round" />
          </svg>
        </div>
      );

    // ── 19. PROCESS CURVED ARROW ──────────────────────────────────────────────
    case 'process_step_curved_arrow':
      return (
        <div style={containerStyle} className={className}>
          <svg viewBox="0 0 100 100" width="100%" height="100%" style={{ overflow: 'visible' }}>
            <path d="M 20 70 C 20 30 70 20 78 48" fill="none" stroke="#0F172A" strokeWidth="6" strokeLinecap="round" />
            <path d="M 20 70 C 20 30 70 20 78 48" fill="none" stroke="#3B82F6" strokeWidth="3.5" strokeLinecap="round" />
            <polygon points="68,44 86,54 82,34" fill="#3B82F6" stroke="#0F172A" strokeWidth="3" strokeLinejoin="round" />
          </svg>
        </div>
      );


    // ── 20. GOLD BARS / GOLD BULLION (SeeKen Secrets of Money Hallmark) ────────
    case 'gold_bars':
    case 'gold_bullion':
    case 'gold':
      return (
        <div style={containerStyle} className={className}>
          <svg viewBox="0 0 100 100" width="100%" height="100%" style={{ overflow: 'visible' }}>
            <polygon points="15,65 35,50 65,50 45,65" fill="#FBBF24" stroke="#0F172A" strokeWidth="3" />
            <polygon points="45,65 65,50 65,65 45,80" fill="#D97706" stroke="#0F172A" strokeWidth="3" />
            <polygon points="15,65 45,80 45,65 15,65" fill="#F59E0B" stroke="#0F172A" strokeWidth="3" />
            <polygon points="40,65 60,50 90,50 70,65" fill="#FBBF24" stroke="#0F172A" strokeWidth="3" />
            <polygon points="70,65 90,50 90,65 70,80" fill="#D97706" stroke="#0F172A" strokeWidth="3" />
            <polygon points="40,65 70,80 70,65 40,65" fill="#F59E0B" stroke="#0F172A" strokeWidth="3" />
            <polygon points="28,45 48,30 78,30 58,45" fill="#FEF08A" stroke="#0F172A" strokeWidth="3.5" />
            <polygon points="58,45 78,30 78,45 58,60" fill="#D97706" stroke="#0F172A" strokeWidth="3.5" />
            <polygon points="28,45 58,60 58,45 28,45" fill="#FBBF24" stroke="#0F172A" strokeWidth="3.5" />
            <text x="50" y="42" fontSize="7" fontWeight="900" fill="#78350F" textAnchor="middle" transform="rotate(-15 50 42)">999.9 GOLD</text>
            <path d="M 85 20 L 88 12 L 91 20 L 99 23 L 91 26 L 88 34 L 85 26 L 77 23 Z" fill="#FDE047" stroke="#0F172A" strokeWidth="1.5" />
          </svg>
        </div>
      );

    // ── 21. MONEY STACK / CASH PAPER NOTES ────────────────────────────────────
    case 'money_stack':
    case 'currency_notes':
    case 'cash':
    case 'currency':
      return (
        <div style={containerStyle} className={className}>
          <svg viewBox="0 0 100 100" width="100%" height="100%" style={{ overflow: 'visible' }}>
            <rect x="18" y="48" width="64" height="34" rx="4" fill="#BBF7D0" stroke="#0F172A" strokeWidth="3.5" transform="rotate(-6 50 65)" />
            <rect x="18" y="38" width="64" height="34" rx="4" fill="#86EFAC" stroke="#0F172A" strokeWidth="3.5" />
            <circle cx="50" cy="55" r="10" fill="#22C55E" stroke="#0F172A" strokeWidth="2.5" />
            <text x="50" y="60" fontSize="14" fontWeight="900" textAnchor="middle" fill="#FFFFFF">$</text>
            <text x="25" y="48" fontSize="8" fontWeight="800" fill="#166534">100</text>
            <text x="75" y="68" fontSize="8" fontWeight="800" fill="#166534">100</text>
            <rect x="42" y="38" width="16" height="34" fill="#FEF08A" stroke="#0F172A" strokeWidth="2" />
          </svg>
        </div>
      );

    // ── 22. OPEN BOOK / KNOWLEDGE & BOOK SUMMARY ──────────────────────────────
    case 'open_book':
    case 'book_reading':
    case 'book':
    case 'reading':
      return (
        <div style={containerStyle} className={className}>
          <svg viewBox="0 0 100 100" width="100%" height="100%" style={{ overflow: 'visible' }}>
            <path d="M 50 32 C 38 28 22 30 14 36 L 14 74 C 22 68 38 66 50 70 Z" fill="#FFFFFF" stroke="#0F172A" strokeWidth="3.5" strokeLinejoin="round" />
            <path d="M 50 32 C 62 28 78 30 86 36 L 86 74 C 78 68 62 66 50 70 Z" fill="#F8FAFC" stroke="#0F172A" strokeWidth="3.5" strokeLinejoin="round" />
            <path d="M 50 32 L 50 74" stroke="#3B82F6" strokeWidth="4" strokeLinecap="round" />
            <line x1="22" y1="44" x2="42" y2="42" stroke="#64748B" strokeWidth="2" strokeLinecap="round" />
            <line x1="22" y1="52" x2="42" y2="50" stroke="#64748B" strokeWidth="2" strokeLinecap="round" />
            <line x1="22" y1="60" x2="36" y2="58" stroke="#64748B" strokeWidth="2" strokeLinecap="round" />
            <line x1="58" y1="42" x2="78" y2="44" stroke="#64748B" strokeWidth="2" strokeLinecap="round" />
            <line x1="58" y1="50" x2="78" y2="52" stroke="#64748B" strokeWidth="2" strokeLinecap="round" />
            <line x1="58" y1="58" x2="72" y2="60" stroke="#64748B" strokeWidth="2" strokeLinecap="round" />
            <path d="M 50 32 L 50 62 L 46 58 L 42 62 L 42 32" fill="#EF4444" stroke="#0F172A" strokeWidth="2" />
            <path d="M 50 16 L 50 24 M 32 20 L 38 26 M 68 20 L 62 26" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" />
          </svg>
        </div>
      );

    // ── 23. BRAIN SYNAPSE / PSYCHOLOGY & MINDSET ──────────────────────────────
    case 'brain_synapse':
    case 'brain_idea':
    case 'brain':
    case 'mind':
      return (
        <div style={containerStyle} className={className}>
          <svg viewBox="0 0 100 100" width="100%" height="100%" style={{ overflow: 'visible' }}>
            <path d="M 50 25 C 42 18 30 20 26 28 C 20 32 18 42 22 50 C 18 58 22 70 30 74 C 36 78 46 76 50 70 Z" fill="#F472B6" stroke="#0F172A" strokeWidth="3.5" strokeLinejoin="round" />
            <path d="M 50 25 C 58 18 70 20 74 28 C 80 32 82 42 78 50 C 82 58 78 70 70 74 C 64 78 54 76 50 70 Z" fill="#FB7185" stroke="#0F172A" strokeWidth="3.5" strokeLinejoin="round" />
            <path d="M 50 25 C 48 38 52 56 50 70" stroke="#0F172A" strokeWidth="3" fill="none" />
            <path d="M 32 38 C 38 42 42 36 46 44" stroke="#831843" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <path d="M 28 54 C 34 50 38 60 46 58" stroke="#831843" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <path d="M 68 38 C 62 42 58 36 54 44" stroke="#831843" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <path d="M 72 54 C 66 50 62 60 54 58" stroke="#831843" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <circle cx="50" cy="16" r="4" fill="#FDE047" stroke="#0F172A" strokeWidth="2" />
            <path d="M 50 6 L 50 10 M 42 12 L 45 14 M 58 12 L 55 14" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </div>
      );

    // ── 24. ROCKET LAUNCH / SCALE & STARTUP ────────────────────────────────────
    case 'rocket_launch':
    case 'rocket':
      return (
        <div style={containerStyle} className={className}>
          <svg viewBox="0 0 100 100" width="100%" height="100%" style={{ overflow: 'visible' }}>
            <polygon points="50,75 42,95 50,88 58,95" fill="#F97316" stroke="#0F172A" strokeWidth="2.5" strokeLinejoin="round" />
            <polygon points="50,75 45,88 50,84 55,88" fill="#FDE047" />
            <path d="M 38 60 L 24 72 L 36 74 Z" fill="#EF4444" stroke="#0F172A" strokeWidth="3" strokeLinejoin="round" />
            <path d="M 62 60 L 76 72 L 64 74 Z" fill="#EF4444" stroke="#0F172A" strokeWidth="3" strokeLinejoin="round" />
            <path d="M 50 14 C 40 28 36 50 36 74 L 64 74 C 64 50 60 28 50 14 Z" fill="#F8FAFC" stroke="#0F172A" strokeWidth="3.5" strokeLinejoin="round" />
            <path d="M 50 14 C 44 24 40 32 40 36 L 60 36 C 60 32 56 24 50 14 Z" fill="#EF4444" stroke="#0F172A" strokeWidth="3" />
            <circle cx="50" cy="48" r="7" fill="#38BDF8" stroke="#0F172A" strokeWidth="3" />
            <circle cx="52" cy="46" r="2.5" fill="#FFFFFF" />
            <path d="M 28 88 C 22 88 20 94 24 98 M 72 88 C 78 88 80 94 76 98" stroke="#94A3B8" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          </svg>
        </div>
      );

    // ── 25. BALANCING SCALE / COMPARISON & TRADE-OFF ──────────────────────────
    case 'balancing_scale':
    case 'weighing_scale':
    case 'scale':
      return (
        <div style={containerStyle} className={className}>
          <svg viewBox="0 0 100 100" width="100%" height="100%" style={{ overflow: 'visible' }}>
            <rect x="36" y="86" width="28" height="8" rx="2" fill="#1E293B" stroke="#0F172A" strokeWidth="3" />
            <line x1="50" y1="24" x2="50" y2="86" stroke="#0F172A" strokeWidth="4.5" strokeLinecap="round" />
            <circle cx="50" cy="24" r="5" fill="#F59E0B" stroke="#0F172A" strokeWidth="3" />
            <line x1="18" y1="28" x2="82" y2="28" stroke="#0F172A" strokeWidth="4" strokeLinecap="round" />
            <line x1="18" y1="28" x2="10" y2="52" stroke="#64748B" strokeWidth="2" />
            <line x1="18" y1="28" x2="26" y2="52" stroke="#64748B" strokeWidth="2" />
            <path d="M 8 52 C 8 62 28 62 28 52 Z" fill="#FBBF24" stroke="#0F172A" strokeWidth="3" />
            <line x1="82" y1="28" x2="74" y2="52" stroke="#64748B" strokeWidth="2" />
            <line x1="82" y1="28" x2="90" y2="52" stroke="#64748B" strokeWidth="2" />
            <path d="M 72 52 C 72 62 92 62 92 52 Z" fill="#FBBF24" stroke="#0F172A" strokeWidth="3" />
          </svg>
        </div>
      );

    // ── 26. SHIELD SECURITY / PROTECTION & INSURANCE ──────────────────────────
    case 'shield_security':
    case 'shield_defend':
    case 'shield':
      return (
        <div style={containerStyle} className={className}>
          <svg viewBox="0 0 100 100" width="100%" height="100%" style={{ overflow: 'visible' }}>
            <path d="M 50 14 L 82 24 C 82 56 68 76 50 88 C 32 76 18 56 18 24 Z" fill="#3B82F6" stroke="#0F172A" strokeWidth="4" strokeLinejoin="round" />
            <path d="M 50 20 L 76 28 C 76 54 64 72 50 82 Z" fill="#60A5FA" />
            <path d="M 36 50 L 46 62 L 66 38" fill="none" stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M 36 50 L 46 62 L 66 38" fill="none" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      );

    // ── 27. VINTAGE HOURGLASS / TIME MANAGEMENT ───────────────────────────────
    case 'vintage_hourglass':
    case 'hourglass_draining':
    case 'hourglass':
      return (
        <div style={containerStyle} className={className}>
          <svg viewBox="0 0 100 100" width="100%" height="100%" style={{ overflow: 'visible' }}>
            <rect x="22" y="14" width="56" height="8" rx="2" fill="#92400E" stroke="#0F172A" strokeWidth="3" />
            <rect x="22" y="78" width="56" height="8" rx="2" fill="#92400E" stroke="#0F172A" strokeWidth="3" />
            <path d="M 28 22 C 28 44 46 48 50 50 C 54 48 72 44 72 22 Z" fill="#E0F2FE" stroke="#0F172A" strokeWidth="3.5" />
            <path d="M 50 50 C 46 52 28 56 28 78 L 72 78 C 72 56 54 52 50 50 Z" fill="#E0F2FE" stroke="#0F172A" strokeWidth="3.5" />
            <path d="M 34 32 C 34 44 48 46 50 48 C 52 46 66 44 66 32 Z" fill="#F59E0B" />
            <line x1="50" y1="48" x2="50" y2="70" stroke="#F59E0B" strokeWidth="2.5" strokeDasharray="3 3" />
            <path d="M 34 78 C 38 68 62 68 66 78 Z" fill="#F59E0B" />
            <line x1="25" y1="22" x2="25" y2="78" stroke="#0F172A" strokeWidth="3" />
            <line x1="75" y1="22" x2="75" y2="78" stroke="#0F172A" strokeWidth="3" />
          </svg>
        </div>
      );

    // ── 28. LEAKING BUCKET / INFLATION & LOSS (SeeKen Key Metaphor) ───────────
    case 'bucket_leaking':
    case 'leak':
      return (
        <div style={containerStyle} className={className}>
          <svg viewBox="0 0 100 100" width="100%" height="100%" style={{ overflow: 'visible' }}>
            <path d="M 22 36 C 22 14 78 14 78 36" fill="none" stroke="#0F172A" strokeWidth="3.5" />
            <polygon points="22,36 30,86 70,86 78,36" fill="#B45309" stroke="#0F172A" strokeWidth="4" strokeLinejoin="round" />
            <line x1="25" y1="52" x2="75" y2="52" stroke="#475569" strokeWidth="3" />
            <line x1="28" y1="72" x2="72" y2="72" stroke="#475569" strokeWidth="3" />
            <ellipse cx="50" cy="36" rx="28" ry="6" fill="#38BDF8" stroke="#0F172A" strokeWidth="2.5" />
            <circle cx="36" cy="62" r="3" fill="#0F172A" />
            <path d="M 34 65 Q 24 75 22 84" fill="none" stroke="#0284C7" strokeWidth="3" strokeLinecap="round" />
            <circle cx="20" cy="90" r="3" fill="#0284C7" />
            <text x="14" y="80" fontSize="10" fontWeight="900" fill="#16A34A">$</text>
          </svg>
        </div>
      );

    // ── 29. BANK BUILDING / INSTITUTION & SAFETY ──────────────────────────────
    case 'building_bank':
    case 'bank':
      return (
        <div style={containerStyle} className={className}>
          <svg viewBox="0 0 100 100" width="100%" height="100%" style={{ overflow: 'visible' }}>
            <polygon points="12,34 50,14 88,34" fill="#E2E8F0" stroke="#0F172A" strokeWidth="3.5" strokeLinejoin="round" />
            <circle cx="50" cy="27" r="4" fill="#F59E0B" stroke="#0F172A" strokeWidth="2" />
            <rect x="14" y="34" width="72" height="6" fill="#CBD5E1" stroke="#0F172A" strokeWidth="2.5" />
            <rect x="18" y="40" width="8" height="36" fill="#F8FAFC" stroke="#0F172A" strokeWidth="2.5" />
            <rect x="36" y="40" width="8" height="36" fill="#F8FAFC" stroke="#0F172A" strokeWidth="2.5" />
            <rect x="56" y="40" width="8" height="36" fill="#F8FAFC" stroke="#0F172A" strokeWidth="2.5" />
            <rect x="74" y="40" width="8" height="36" fill="#F8FAFC" stroke="#0F172A" strokeWidth="2.5" />
            <rect x="12" y="76" width="76" height="6" fill="#CBD5E1" stroke="#0F172A" strokeWidth="2.5" />
            <rect x="8" y="82" width="84" height="6" fill="#94A3B8" stroke="#0F172A" strokeWidth="2.5" />
            <text x="50" y="62" fontSize="14" fontWeight="900" fill="#16A34A" textAnchor="middle">$</text>
          </svg>
        </div>
      );

    // ── 30. LADDER CLIMB / CAREER PROGRESSION ─────────────────────────────────
    case 'ladder_climb':
    case 'stairs_up':
    case 'ladder':
      return (
        <div style={containerStyle} className={className}>
          <svg viewBox="0 0 100 100" width="100%" height="100%" style={{ overflow: 'visible' }}>
            <path d="M 60 20 C 56 12 70 8 76 14 C 84 10 92 18 88 26 C 94 30 90 38 82 38 L 58 38 C 50 38 48 30 54 26 C 50 22 54 16 60 20 Z" fill="#E0F2FE" stroke="#0F172A" strokeWidth="3" />
            <polygon points="74,18 76,24 82,24 77,28 79,34 74,30 69,34 71,28 66,24 72,24" fill="#FBBF24" stroke="#0F172A" strokeWidth="1.5" />
            <line x1="28" y1="92" x2="62" y2="28" stroke="#B45309" strokeWidth="4.5" strokeLinecap="round" />
            <line x1="40" y1="92" x2="74" y2="28" stroke="#B45309" strokeWidth="4.5" strokeLinecap="round" />
            <line x1="31" y1="82" x2="43" y2="82" stroke="#0F172A" strokeWidth="3" strokeLinecap="round" />
            <line x1="36" y1="72" x2="48" y2="72" stroke="#0F172A" strokeWidth="3" strokeLinecap="round" />
            <line x1="42" y1="62" x2="54" y2="62" stroke="#0F172A" strokeWidth="3" strokeLinecap="round" />
            <line x1="47" y1="52" x2="59" y2="52" stroke="#0F172A" strokeWidth="3" strokeLinecap="round" />
            <line x1="53" y1="42" x2="65" y2="42" stroke="#0F172A" strokeWidth="3" strokeLinecap="round" />
          </svg>
        </div>
      );

    // ── 31. COMPASS NORTH / VISION & DIRECTION ────────────────────────────────
    case 'compass_north':
    case 'compass':
      return (
        <div style={containerStyle} className={className}>
          <svg viewBox="0 0 100 100" width="100%" height="100%" style={{ overflow: 'visible' }}>
            <circle cx="50" cy="50" r="38" fill="#F8FAFC" stroke="#0F172A" strokeWidth="4" />
            <circle cx="50" cy="50" r="32" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5" />
            <circle cx="50" cy="8" r="6" fill="none" stroke="#0F172A" strokeWidth="3" />
            <text x="50" y="27" fontSize="10" fontWeight="900" fill="#EF4444" textAnchor="middle">N</text>
            <text x="50" y="79" fontSize="9" fontWeight="800" fill="#64748B" textAnchor="middle">S</text>
            <text x="77" y="53" fontSize="9" fontWeight="800" fill="#64748B" textAnchor="middle">E</text>
            <text x="23" y="53" fontSize="9" fontWeight="800" fill="#64748B" textAnchor="middle">W</text>
            <polygon points="50,28 45,50 50,47 55,50" fill="#EF4444" stroke="#0F172A" strokeWidth="2" strokeLinejoin="round" />
            <polygon points="50,72 45,50 50,47 55,50" fill="#1E293B" stroke="#0F172A" strokeWidth="2" strokeLinejoin="round" />
            <circle cx="50" cy="49" r="3.5" fill="#F59E0B" stroke="#0F172A" strokeWidth="2" />
          </svg>
        </div>
      );

    // ── 32. ALERT TRIANGLE / WARNING & MISTAKE ────────────────────────────────
    case 'alert_triangle':
    case 'warning':
    case 'caution':
      return (
        <div style={containerStyle} className={className}>
          <svg viewBox="0 0 100 100" width="100%" height="100%" style={{ overflow: 'visible' }}>
            <polygon points="50,14 14,82 86,82" fill="#FBBF24" stroke="#0F172A" strokeWidth="4.5" strokeLinejoin="round" />
            <polygon points="50,24 22,78 78,78" fill="#FDE047" />
            <line x1="50" y1="40" x2="50" y2="60" stroke="#0F172A" strokeWidth="6" strokeLinecap="round" />
            <circle cx="50" cy="70" r="3.5" fill="#0F172A" />
          </svg>
        </div>
      );

    // ── 33. LIGHTNING BOLT / ENERGY & SPEED ───────────────────────────────────
    case 'lightning_bolt':
    case 'energy':
    case 'power':
      return (
        <div style={containerStyle} className={className}>
          <svg viewBox="0 0 100 100" width="100%" height="100%" style={{ overflow: 'visible' }}>
            <polygon points="56,12 28,52 48,52 38,88 74,44 52,44" fill="#FDE047" stroke="#0F172A" strokeWidth="4" strokeLinejoin="round" />
          </svg>
        </div>
      );

    // ── 34. PENCIL WRITE / CHECKLIST & HABIT ──────────────────────────────────
    case 'pencil_write':
    case 'checklist':
    case 'habit':
      return (
        <div style={containerStyle} className={className}>
          <svg viewBox="0 0 100 100" width="100%" height="100%" style={{ overflow: 'visible' }}>
            <polygon points="32,24 44,12 84,52 72,64" fill="#FBBF24" stroke="#0F172A" strokeWidth="3" />
            <rect x="22" y="16" width="14" height="12" rx="3" fill="#F472B6" stroke="#0F172A" strokeWidth="3" transform="rotate(45 28 22)" />
            <polygon points="72,64 84,52 92,72" fill="#FED7AA" stroke="#0F172A" strokeWidth="2.5" />
            <polygon points="88,68 84,52 92,72" fill="#0F172A" />
            <path d="M 20 86 Q 50 78 86 78" fill="none" stroke="#22C55E" strokeWidth="4" strokeLinecap="round" />
          </svg>
        </div>
      );

    // ── 35. WALL CLOCK / DEADLINE & TIME ──────────────────────────────────────
    case 'wall_clock':
    case 'clock':
      return (
        <div style={containerStyle} className={className}>
          <svg viewBox="0 0 100 100" width="100%" height="100%" style={{ overflow: 'visible' }}>
            <circle cx="50" cy="50" r="38" fill="#FFFFFF" stroke="#0F172A" strokeWidth="4" />
            <circle cx="50" cy="50" r="4" fill="#0F172A" />
            <line x1="50" y1="50" x2="68" y2="50" stroke="#0F172A" strokeWidth="4" strokeLinecap="round" />
            <line x1="50" y1="50" x2="50" y2="24" stroke="#0F172A" strokeWidth="3" strokeLinecap="round" />
            <circle cx="50" cy="18" r="2" fill="#64748B" />
            <circle cx="82" cy="50" r="2" fill="#64748B" />
            <circle cx="50" cy="82" r="2" fill="#64748B" />
            <circle cx="18" cy="50" r="2" fill="#64748B" />
          </svg>
        </div>
      );

    // ── 36. COINS FALLING / ACCUMULATION & WEALTH ─────────────────────────────
    case 'coins_falling':
    case 'coin_stack':
      return (
        <div style={containerStyle} className={className}>
          <svg viewBox="0 0 100 100" width="100%" height="100%" style={{ overflow: 'visible' }}>
            <ellipse cx="36" cy="78" rx="16" ry="6" fill="#F59E0B" stroke="#0F172A" strokeWidth="2.5" />
            <ellipse cx="36" cy="72" rx="16" ry="6" fill="#FBBF24" stroke="#0F172A" strokeWidth="2.5" />
            <ellipse cx="36" cy="66" rx="16" ry="6" fill="#FDE047" stroke="#0F172A" strokeWidth="2.5" />
            <ellipse cx="64" cy="78" rx="16" ry="6" fill="#F59E0B" stroke="#0F172A" strokeWidth="2.5" />
            <ellipse cx="64" cy="72" rx="16" ry="6" fill="#FBBF24" stroke="#0F172A" strokeWidth="2.5" />
            <ellipse cx="64" cy="66" rx="16" ry="6" fill="#FDE047" stroke="#0F172A" strokeWidth="2.5" />
            <ellipse cx="64" cy="60" rx="16" ry="6" fill="#FEF08A" stroke="#0F172A" strokeWidth="2.5" />
            <ellipse cx="50" cy="30" rx="14" ry="14" fill="#FBBF24" stroke="#0F172A" strokeWidth="3" />
            <text x="50" y="35" fontSize="12" fontWeight="900" fill="#78350F" textAnchor="middle">$</text>
            <path d="M 78 26 L 81 20 L 84 26 L 90 28 L 84 30 L 81 36 L 78 30 L 72 28 Z" fill="#FDE047" stroke="#0F172A" strokeWidth="1" />
          </svg>
        </div>
      );

    // ── 37. HANDSHAKE DEAL / AGREEMENT & PARTNERSHIP ──────────────────────────
    case 'handshake_deal':
    case 'partnership':
    case 'trust':
      return (
        <div style={containerStyle} className={className}>
          <svg viewBox="0 0 100 100" width="100%" height="100%" style={{ overflow: 'visible' }}>
            <polygon points="12,38 32,46 26,66 8,56" fill="#2563EB" stroke="#0F172A" strokeWidth="3" strokeLinejoin="round" />
            <polygon points="88,38 68,46 74,66 92,56" fill="#EA580C" stroke="#0F172A" strokeWidth="3" strokeLinejoin="round" />
            <path d="M 32 46 L 44 40 C 50 38 56 42 62 48 L 68 46 L 70 52 L 60 62 L 48 64 L 40 56 Z" fill="#FED7AA" stroke="#0F172A" strokeWidth="3" strokeLinejoin="round" />
            <path d="M 44 48 L 52 54 M 48 44 L 56 50 M 52 40 L 60 46" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
      );

    // ── 38. STOPWATCH TIMER / SPEED & URGENCY ─────────────────────────────────
    case 'stopwatch_timer':
    case 'stopwatch':
    case 'timer':
      return (
        <div style={containerStyle} className={className}>
          <svg viewBox="0 0 100 100" width="100%" height="100%" style={{ overflow: 'visible' }}>
            <rect x="44" y="10" width="12" height="6" rx="2" fill="#94A3B8" stroke="#0F172A" strokeWidth="2.5" />
            <rect x="47" y="16" width="6" height="6" fill="#64748B" stroke="#0F172A" strokeWidth="2" />
            <rect x="22" y="20" width="8" height="5" rx="1.5" fill="#94A3B8" stroke="#0F172A" strokeWidth="2" transform="rotate(-30 26 22)" />
            <rect x="70" y="16" width="8" height="5" rx="1.5" fill="#94A3B8" stroke="#0F172A" strokeWidth="2" transform="rotate(30 74 18)" />
            <circle cx="50" cy="54" r="34" fill="#F8FAFC" stroke="#0F172A" strokeWidth="4" />
            <circle cx="50" cy="54" r="28" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5" />
            <circle cx="50" cy="54" r="3" fill="#0F172A" />
            <line x1="50" y1="54" x2="68" y2="40" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </div>
      );

    // ── 39. HEART PULSE / VITALITY & HEALTH ───────────────────────────────────
    case 'heart_pulse':
    case 'health':
      return (
        <div style={containerStyle} className={className}>
          <svg viewBox="0 0 100 100" width="100%" height="100%" style={{ overflow: 'visible' }}>
            <path d="M 50 82 C 18 60 12 34 26 22 C 38 12 48 20 50 28 C 52 20 62 12 74 22 C 88 34 82 60 50 82 Z" fill="#EF4444" stroke="#0F172A" strokeWidth="3.5" strokeLinejoin="round" />
            <path d="M 22 52 L 36 52 L 42 38 L 48 64 L 54 44 L 60 56 L 64 52 L 78 52" fill="none" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      );

    // ── 40. CALENDAR SHEET / DAILY DISCIPLINE & ROUTINE ───────────────────────
    case 'calendar_sheet':
    case 'calendar':
    case 'daily':
      return (
        <div style={containerStyle} className={className}>
          <svg viewBox="0 0 100 100" width="100%" height="100%" style={{ overflow: 'visible' }}>
            <rect x="20" y="24" width="60" height="62" rx="6" fill="#FFFFFF" stroke="#0F172A" strokeWidth="4" />
            <path d="M 20 28 C 20 25 24 24 28 24 L 72 24 C 76 24 80 25 80 28 L 80 40 L 20 40 Z" fill="#EF4444" stroke="#0F172A" strokeWidth="3" />
            <rect x="32" y="16" width="6" height="12" rx="2" fill="#CBD5E1" stroke="#0F172A" strokeWidth="2.5" />
            <rect x="62" y="16" width="6" height="12" rx="2" fill="#CBD5E1" stroke="#0F172A" strokeWidth="2.5" />
            <circle cx="50" cy="62" r="14" fill="#FEF08A" stroke="#F59E0B" strokeWidth="2.5" />
            <text x="50" y="67" fontSize="16" fontWeight="900" fill="#0F172A" textAnchor="middle">1</text>
          </svg>
        </div>
      );

    // ── 41. WALLET OPEN / EXPENSES & MONEY ────────────────────────────────────
    case 'wallet_open':
    case 'wallet':
      return (
        <div style={containerStyle} className={className}>
          <svg viewBox="0 0 100 100" width="100%" height="100%" style={{ overflow: 'visible' }}>
            <rect x="18" y="38" width="64" height="46" rx="6" fill="#B45309" stroke="#0F172A" strokeWidth="4" />
            <rect x="26" y="28" width="48" height="16" rx="2" fill="#86EFAC" stroke="#0F172A" strokeWidth="2.5" />
            <rect x="58" y="52" width="26" height="18" rx="4" fill="#78350F" stroke="#0F172A" strokeWidth="2.5" />
            <circle cx="70" cy="61" r="3" fill="#FBBF24" />
          </svg>
        </div>
      );

    default: {
      const LucideComp = getLucideIcon(type);
      if (LucideComp) {
        return (
          <div style={containerStyle} className={className}>
            <div
              style={{
                width: '84%',
                height: '84%',
                borderRadius: 32,
                border: '4px solid #0F172A',
                backgroundColor: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 24px -6px rgba(0,0,0,0.12)',
                position: 'relative',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: 12,
                  right: 12,
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  backgroundColor: '#FF5722',
                }}
              />
              <LucideComp size={Math.round(Number(size) * 0.52)} strokeWidth={2.8} color="#0F172A" />
            </div>
          </div>
        );
      }

      // Universal clean fallback: Lightbulb Concept Idea
      return (
        <div style={containerStyle} className={className}>
          <svg viewBox="0 0 100 100" width="100%" height="100%" style={{ overflow: 'visible' }}>
            <path
              d="M 50 18 C 34 18 24 30 24 44 C 24 54 32 62 36 70 L 64 70 C 68 62 76 54 76 44 C 76 30 66 18 50 18 Z"
              fill="#FEF08A"
              stroke="#0F172A"
              strokeWidth="4"
              strokeLinejoin="round"
            />
            <rect x="38" y="70" width="24" height="6" rx="2" fill="#94A3B8" stroke="#0F172A" strokeWidth="2.5" />
            <rect x="42" y="76" width="16" height="6" rx="2" fill="#64748B" stroke="#0F172A" strokeWidth="2.5" />
            <path d="M 50 6 L 50 12 M 22 18 L 28 22 M 78 18 L 72 22" stroke="#F59E0B" strokeWidth="3.5" strokeLinecap="round" />
          </svg>
        </div>
      );
    }
  }
};
