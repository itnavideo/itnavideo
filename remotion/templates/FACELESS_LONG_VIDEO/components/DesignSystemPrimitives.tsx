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
import { HandwritingHighlight } from '../../../components/library/HandwritingHighlight';

export interface SceneCanvasProps {
  children: React.ReactNode;
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
 * Crisp geometric kicker badge with a glowing indicator dot and tracked uppercase typography.
 */
export function EyebrowPill({
  label,
  tone = 'coral',
  palette,
  progress = 1,
}: EyebrowPillProps) {
  const ds = useVideoDesignSystem({ palette });
  const accent = ds.accents[tone] || ds.accents.coral;

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '10px',
        padding: '7px 18px',
        borderRadius: '9999px',
        backgroundColor: accent.SoftBg,
        border: `1.5px solid ${accent.border}`,
        boxShadow: ds.surface.shadowBadge,
        opacity: progress,
        transform: `translateY(${interpolate(progress, [0, 1], [-12, 0])}px)`,
      }}
    >
      <span
        style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: accent.solid,
          boxShadow: `0 0 8px ${accent.solid}`,
          flexShrink: 0,
        }}
      />
      <span
        style={{
          fontSize: `${ds.type.eyebrow.fontSize}px`,
          fontWeight: ds.type.eyebrow.fontWeight,
          letterSpacing: ds.type.eyebrow.letterSpacing,
          lineHeight: ds.type.eyebrow.lineHeight,
          color: accent.textOnSoft,
          textTransform: 'uppercase',
          whiteSpace: 'nowrap',
        }}
      >
        {label}
      </span>
    </div>
  );
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
  headingFont = 'Montserrat, "Plus Jakarta Sans", sans-serif',
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
      {categoryPill && (
        <div style={{ marginBottom: '14px' }}>
          <EyebrowPill
            label={categoryPill}
            tone={tone}
            palette={palette}
            progress={ds.motion.eyebrowSpring}
          />
        </div>
      )}

      <h1
        style={{
          fontFamily: headingFont,
          fontSize: `${baseFontSize}px`,
          fontWeight: ds.type.sceneTitle.fontWeight,
          letterSpacing: ds.type.sceneTitle.letterSpacing,
          lineHeight: ds.type.sceneTitle.lineHeight,
          color: ds.surface.textPrimary,
          margin: 0,
          maxWidth: ds.layout.isVertical ? '900px' : '1280px',
          opacity: ds.motion.headerSpring,
          transform: `translateY(${interpolate(ds.motion.headerSpring, [0, 1], [18, 0])}px)`,
        }}
      >
        {highlightIndex !== -1 ? (
          <>
            {cleanHeading.slice(0, highlightIndex)}
            <HandwritingHighlight
              color="#FFE600"
              textColor="#0F172A"
              delayFrames={8}
              durationFrames={14}
              type="highlighter"
            >
              {cleanHeading.slice(highlightIndex, highlightIndex + highlightWord.length)}
            </HandwritingHighlight>
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
  children: React.ReactNode;
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
 * Unified editorial surface container with refined 1.5px border, optional top accent bar,
 * and multi-layered studio shadow.
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
  const accent = ds.accents[tone] || ds.accents.coral;

  const ty = interpolate(progress, [0, 1], [translateYFrom, 0]);
  const tx = interpolate(progress, [0, 1], [translateXFrom, 0]);
  const sc = interpolate(progress, [0, 1], [scaleFrom, 1]);

  return (
    <div
      style={{
        position: 'relative',
        borderRadius: `${ds.layout.cardRadius}px`,
        backgroundColor: muted
          ? ds.surface.cardBgMuted
          : elevated
          ? ds.surface.cardBgElevated
          : ds.surface.cardBg,
        border: elevated ? `1.5px solid ${accent.border}` : ds.surface.borderSubtle,
        boxShadow: elevated ? ds.surface.shadowElevated : ds.surface.shadowCard,
        padding: ds.layout.cardPadding,
        overflow: 'hidden',
        opacity: progress,
        transform: `translate3d(${tx}px, ${ty}px, 0) scale(${sc})`,
        boxSizing: 'border-box',
        ...style,
      }}
    >
      {topAccentBar && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '5px',
            backgroundColor: accent.solid,
          }}
        />
      )}
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
