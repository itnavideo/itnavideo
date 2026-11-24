/**
 * ITNAVIDEO CENTRAL VIDEO DESIGN SYSTEM PRIMITIVES (`DesignSystemPrimitives.tsx`)
 * ============================================================================
 * Reusable, broadcast-grade visual building blocks used across all scenes in
 * 16:9 Faceless Video and 9:16 Faceless Shorts.
 *
 * Replaces raw unstyled divs, inconsistent borders, random emojis, and broken
 * spacing with cohesive editorial typography, precision geometry, and spring motion.
 */

import React from 'react';
import { interpolate } from 'remotion';
import {
  type AccentTone,
  useVideoDesignSystem,
} from '../designSystem';

export interface SceneCanvasProps {
  children?: React.ReactNode;
  sceneFrame?: number;
  durationSec?: number;
  palette?: { isDark?: boolean } | null;
  accentTone?: AccentTone;
  fontFamily?: string;
  align?: 'center' | 'stretch';
  justify?: 'center' | 'space-between' | 'flex-start';
  enableDrift?: boolean;
}

/**
 * SceneCanvas
 * Enforces aspect-ratio safe zones (16:9 and 9:16), subtitle bottom clearance,
 * subtle architectural blueprint grid dots, ambient accent lighting, and camera drift.
 */
export function SceneCanvas({
  children,
  sceneFrame,
  durationSec = 5,
  palette,
  accentTone = 'coral',
  fontFamily = 'Inter, "Plus Jakarta Sans", system-ui, sans-serif',
  align = 'center',
  justify = 'center',
  enableDrift = true,
}: SceneCanvasProps) {
  const ds = useVideoDesignSystem({ sceneFrame, durationSec, palette });
  const accent = ds.accents[accentTone] || ds.accents.coral;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        backgroundColor: ds.surface.canvasBg,
        fontFamily,
        zIndex: 15,
      }}
    >
      {/* Subtle Architectural Dot Grid Texture */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `radial-gradient(circle, ${ds.surface.gridDotColor} 1.25px, transparent 1.25px)`,
          backgroundSize: ds.layout.isVertical ? '32px 32px' : '36px 36px',
          pointerEvents: 'none',
        }}
      />

      {/* Soft Ambient Studio Radial Glow */}
      <div
        style={{
          position: 'absolute',
          top: '12%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: ds.layout.isVertical ? '720px' : '1100px',
          height: ds.layout.isVertical ? '720px' : '560px',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${accent.glow} 0%, transparent 70%)`,
          filter: 'blur(48px)',
          pointerEvents: 'none',
        }}
      />

      {/* Safe-Zone Inner Stage */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          boxSizing: 'border-box',
          paddingTop: `${ds.layout.safePaddingTop}px`,
          paddingBottom: `${ds.layout.safePaddingBottom}px`,
          paddingLeft: `${ds.layout.safePaddingX}px`,
          paddingRight: `${ds.layout.safePaddingX}px`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: align,
          justifyContent: justify,
          transform: enableDrift ? `scale(${ds.motion.ambientDrift})` : undefined,
          transformOrigin: 'center center',
          zIndex: 2,
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: `${ds.layout.maxContentWidth}px`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: align,
            justifyContent: justify,
            flex: 1,
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

export interface EyebrowPillProps {
  label: string;
  tone?: AccentTone;
  palette?: { isDark?: boolean } | null;
  progress?: number;
}

/**
 * EyebrowPill
 * Zero Eyebrow Pill Badge Policy (Enterprise Standard): Never place small rounded-pill eyebrow tags in videos.
 */
export function EyebrowPill(_props: EyebrowPillProps) {
  return null;
}

export interface SceneHeaderProps {
  categoryPill?: string;
  heading: string;
  supportingText?: string;
  highlightedWords?: string[];
  headingFont?: string;
  bodyFont?: string;
  tone?: AccentTone;
  align?: 'center' | 'left';
  sceneFrame?: number;
  palette?: { isDark?: boolean } | null;
  compact?: boolean;
}

/**
 * SceneHeader
 * Standardized editorial header hierarchy: Eyebrow Pill -> Balanced Title (with Marker Highlight) -> Subtitle.
 */
export function SceneHeader({
  categoryPill,
  heading,
  supportingText,
  highlightedWords,
  headingFont = 'Lora, "Playfair Display", Georgia, serif',
  bodyFont = 'Inter, "Plus Jakarta Sans", sans-serif',
  tone = 'coral',
  align = 'center',
  sceneFrame,
  palette,
  compact = false,
}: SceneHeaderProps) {
  const ds = useVideoDesignSystem({ sceneFrame, palette });
  const cleanHeading = String(heading || '').trim();
  const cleanSupport =
    supportingText && supportingText.trim().toLowerCase() !== cleanHeading.toLowerCase()
      ? supportingText.trim()
      : '';

  const rawHighlight =
    highlightedWords && typeof highlightedWords[0] === 'string'
      ? highlightedWords[0].trim()
      : '';
  const highlightWord = rawHighlight.length >= 2 ? rawHighlight : '';
  const highlightIndex = highlightWord
    ? cleanHeading.toLowerCase().indexOf(highlightWord.toLowerCase())
    : -1;

  const baseFontSize = compact
    ? Math.round(ds.type.sceneTitle.fontSize * 0.88)
    : cleanHeading.length > 52
      ? Math.round(ds.type.sceneTitle.fontSize * 0.84)
      : ds.type.sceneTitle.fontSize;

  return (
    <div
      style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: align === 'center' ? 'center' : 'flex-start',
        textAlign: align,
        marginBottom: compact ? `${Math.round(ds.layout.headerMarginBottom * 0.72)}px` : `${ds.layout.headerMarginBottom}px`,
        flexShrink: 0,
      }}
    >
      <h1
        style={{
          fontFamily: headingFont || 'Lora, "Playfair Display", Georgia, serif',
          fontSize: `${baseFontSize}px`,
          fontWeight: 700,
          letterSpacing: '-0.025em',
          lineHeight: 1.15,
          color: ds.surface.textPrimary,
          margin: 0,
          maxWidth: ds.layout.isVertical ? '900px' : '1360px',
          opacity: ds.motion.headerSpring,
          transform: `translateY(${interpolate(ds.motion.headerSpring, [0, 1], [18, 0])}px)`,
          textShadow: ds.surface.isDark ? '0 4px 24px rgba(0,0,0,0.45)' : 'none',
        }}
      >
        {highlightIndex !== -1 ? (
          <>
            {cleanHeading.slice(0, highlightIndex)}
            <span
              style={{
                color: ds.accents[tone]?.solid || '#EA580C',
                fontWeight: 800,
                display: 'inline',
              }}
            >
              {cleanHeading.slice(highlightIndex, highlightIndex + highlightWord.length)}
            </span>
            {cleanHeading.slice(highlightIndex + highlightWord.length)}
          </>
        ) : (
          cleanHeading
        )}
      </h1>

      {cleanSupport && (
        <p
          style={{
            fontFamily: bodyFont,
            fontSize: `${ds.type.bodyMd.fontSize}px`,
            fontWeight: 600,
            lineHeight: ds.type.bodyMd.lineHeight,
            color: ds.surface.textSecondary,
            margin: '10px 0 0 0',
            maxWidth: ds.layout.isVertical ? '840px' : '980px',
            opacity: ds.motion.headerSpring,
            transform: `translateY(${interpolate(ds.motion.headerSpring, [0, 1], [14, 0])}px)`,
          }}
        >
          {cleanSupport}
        </p>
      )}
    </div>
  );
}

export interface StudioCardProps {
  children?: React.ReactNode;
  tone?: AccentTone;
  topAccentBar?: boolean;
  elevated?: boolean;
  muted?: boolean;
  palette?: { isDark?: boolean } | null;
  progress?: number;
  translateYFrom?: number;
  translateXFrom?: number;
  scaleFrom?: number;
  style?: React.CSSProperties;
}

/**
 * StudioCard
 * Borderless, seamless editorial surface container for broadcast video scenes.
 * Eliminates cheap PPT box wrappers, outer borders, and drop shadows so scenes sit cleanly on canvas.
 */
export function StudioCard({
  children,
  tone = 'coral',
  topAccentBar = false,
  elevated = false,
  muted = false,
  palette,
  progress = 1,
  translateYFrom = 22,
  translateXFrom = 0,
  scaleFrom = 0.97,
  style,
}: StudioCardProps) {
  const ds = useVideoDesignSystem({ palette });

  const ty = interpolate(progress, [0, 1], [translateYFrom, 0]);
  const tx = interpolate(progress, [0, 1], [translateXFrom, 0]);
  const sc = interpolate(progress, [0, 1], [scaleFrom, 1]);

  return (
    <div
      style={{
        position: 'relative',
        backgroundColor: 'transparent',
        border: 'none',
        boxShadow: 'none',
        padding: 0,
        opacity: progress,
        transform: `translate3d(${tx}px, ${ty}px, 0) scale(${sc})`,
        boxSizing: 'border-box',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export interface StepNumberBadgeProps {
  number: string | number;
  tone?: AccentTone;
  size?: number;
  palette?: { isDark?: boolean } | null;
}

/**
 * StepNumberBadge
 * Geometric numbered pill/square for step-by-step lists, roadmaps, and workflows.
 */
export function StepNumberBadge({
  number,
  tone = 'coral',
  size = 40,
  palette,
}: StepNumberBadgeProps) {
  const ds = useVideoDesignSystem({ palette });
  const accent = ds.accents[tone] || ds.accents.coral;
  const formatted =
    typeof number === 'number' ? String(number).padStart(2, '0') : String(number);

  return (
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: `${Math.round(size * 0.3)}px`,
        backgroundColor: accent.SoftBg,
        border: `1.5px solid ${accent.border}`,
        color: accent.solid,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: `${Math.round(size * 0.4)}px`,
        fontWeight: 900,
        letterSpacing: '-0.02em',
        flexShrink: 0,
      }}
    >
      {formatted}
    </div>
  );
}

export interface RelationshipArrowProps {
  /** Purpose of arrow: sequence (order), flow (direction/movement), transformation (shift/leap), contrast (tension) */
  type?: 'sequence' | 'flow' | 'transformation' | 'contrast';
  direction?: 'right' | 'down' | 'left' | 'up';
  label?: string; // e.g. "NEXT STEP", "CONVERTS TO", "LEADS TO", "TRANSFORMS"
  tone?: AccentTone;
  progress?: number; // 0 to 1 entrance spring
  sceneFrame?: number; // frame for continuous flow animation
  size?: number; // length / width
  palette?: { isDark?: boolean } | null;
  style?: React.CSSProperties;
}

/**
 * RelationshipArrow
 * =================
 * Broadcast-grade semantic connector used to visually communicate relationships:
 * 1. Sequential progression: which step follows which (Step 1 ➔ Step 2).
 * 2. Directional flow: which direction energy, data, or action is moving.
 * 3. Transformation / Connection: how two concepts bridge or relate to each other.
 */
export function RelationshipArrow({
  type = 'sequence',
  direction = 'right',
  label,
  tone = 'coral',
  progress = 1,
  sceneFrame = 0,
  size = 36,
  palette,
  style,
}: RelationshipArrowProps) {
  const ds = useVideoDesignSystem({ palette });
  const accent = ds.accents[tone] || ds.accents.coral;

  const isVertical = direction === 'down' || direction === 'up';
  const flowOffset = -((sceneFrame * 2) % 16);

  const arrowColor = accent.solid;
  const strokeColor = accent.border || ds.surface.borderSubtle;

  // Rotation based on direction
  const rotationDeg =
    direction === 'down' ? 90 : direction === 'left' ? 180 : direction === 'up' ? 270 : 0;

  return (
    <div
      style={{
        display: 'inline-flex',
        flexDirection: isVertical ? 'column' : 'column',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: progress,
        transform: `scale(${interpolate(progress, [0, 1], [0.8, 1])})`,
        gap: '4px',
        flexShrink: 0,
        userSelect: 'none',
        ...style,
      }}
    >
      {label && (
        <span
          style={{
            fontSize: '10px',
            fontWeight: 800,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: accent.textOnSoft,
            whiteSpace: 'nowrap',
            marginBottom: '2px',
          }}
        >
          {label}
        </span>
      )}

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transform: `rotate(${rotationDeg}deg)`,
          width: size,
          height: size,
        }}
      >
        {type === 'transformation' ? (
          // Transformation Badge: Glowing forward connector
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: size,
              height: size,
              borderRadius: '50%',
              backgroundColor: accent.SoftBg,
              border: `1.5px solid ${arrowColor}`,
              boxShadow: `0 0 16px ${arrowColor}40`,
            }}
          >
            <svg width={size * 0.55} height={size * 0.55} viewBox="0 0 24 24" fill="none">
              <path
                d="M5 12H19M19 12L13 6M19 12L13 18"
                stroke={arrowColor}
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        ) : type === 'flow' ? (
          // Directional Flow: Moving dashed connector line with dynamic dash animation
          <svg width={size} height="24" viewBox={`0 0 ${size} 24`} fill="none" style={{ overflow: 'visible' }}>
            <line
              x1="0"
              y1="12"
              x2={size - 8}
              y2="12"
              stroke={arrowColor}
              strokeWidth="2.5"
              strokeDasharray="5 5"
              strokeDashoffset={flowOffset}
            />
            <path
              d={`M ${size - 10} 6 L ${size} 12 L ${size - 10} 18`}
              stroke={arrowColor}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>
        ) : (
          // Sequence Arrow: Crisp, high-contrast directional arrow with subtle soft pill
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: size,
              height: size,
              borderRadius: '50%',
              backgroundColor: accent.SoftBg,
              border: `1px solid ${strokeColor}`,
            }}
          >
            <svg width={size * 0.5} height={size * 0.5} viewBox="0 0 24 24" fill="none">
              <path
                d="M5 12H19M19 12L13 6M19 12L13 18"
                stroke={arrowColor}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
}
