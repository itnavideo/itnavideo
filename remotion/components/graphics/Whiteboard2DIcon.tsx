import React from 'react';
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
  label?: string;
  style?: React.CSSProperties;
  className?: string;
}

/**
 * Whiteboard2DIcon — Rich 2D colored illustrations with bold black outlines
 * matching the executive & educational whiteboard explainer standard.
 */
export const Whiteboard2DIcon: React.FC<Whiteboard2DIconProps> = ({
  type,
  size = 120,
  animated = true,
  startFrame = 0,
  durationFrames = 18,
  label,
  style = {},
  className = '',
}) => {
  const frame = useCurrentFrame();

  const progress = animated
    ? interpolate(frame, [startFrame, startFrame + durationFrames], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
    : 1;

  if (progress <= 0) return null;

  // Scale and opacity spring entrance
  const scale = 0.85 + progress * 0.15;
  const opacity = Math.min(1, progress * 1.4);

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

    default:
      return null;
  }
};
