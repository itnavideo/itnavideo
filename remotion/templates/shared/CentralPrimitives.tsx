/**
 * ITNAVIDEO CENTRAL VIDEO DESIGN PRIMITIVES (`CentralPrimitives.tsx`)
 * ============================================================================
 * Shared visual building blocks used across all standard scene-based templates
 * (16:9 Faceless Video, 9:16 Faceless Shorts, Book Summary, Image-to-Video).
 */

import React from 'react';
import { interpolate } from 'remotion';
import {
  type AccentTone,
  useVideoDesignSystem,
} from './CentralDesignSystem';

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
 * subtle architectural dot grid texture, ambient accent lighting, and camera drift.
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
      {/* Architectural Dot Grid Texture */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `radial-gradient(circle, ${ds.surface.gridDotColor} 1.25px, transparent 1.25px)`,
          backgroundSize: ds.layout.isVertical ? '32px 32px' : '36px 36px',
          pointerEvents: 'none',
        }}
      />

      {/* Ambient Studio Radial Glow */}
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
          alignItems: align === 'stretch' ? 'stretch' : 'center',
          justifyContent,
          zIndex: 20,
          opacity: ds.motion.enterOpacity * ds.motion.exitOpacity,
          transform: enableDrift
            ? `translateY(${ds.motion.enterY + ds.motion.exitY}px) scale(${ds.motion.enterScale})`
            : undefined,
        }}
      >
        {children}
      </div>
    </div>
  );
}

export interface EyebrowPillProps {
  text: string;
  accentTone?: AccentTone;
  icon?: string;
  palette?: { isDark?: boolean } | null;
}

export function EyebrowPill({ text, accentTone = 'coral', icon, palette }: EyebrowPillProps) {
  const ds = useVideoDesignSystem({ palette });
  const accent = ds.accents[accentTone] || ds.accents.coral;

  if (!text) return null;

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        padding: '8px 18px',
        borderRadius: '9999px',
        backgroundColor: accent.SoftBg,
        border: `1px solid ${accent.border}`,
        color: accent.textOnSoft,
        fontSize: `${ds.typeScale.eyebrow.fontSize}px`,
        fontWeight: ds.typeScale.eyebrow.fontWeight,
        letterSpacing: ds.typeScale.eyebrow.letterSpacing,
        textTransform: 'uppercase',
        boxShadow: ds.surface.shadowBadge,
      }}
    >
      {icon && <span>{icon}</span>}
      <span>{text}</span>
    </div>
  );
}

export interface SceneHeaderProps {
  heading: string;
  eyebrow?: string;
  supportingText?: string;
  accentTone?: AccentTone;
  align?: 'center' | 'left';
  palette?: { isDark?: boolean } | null;
  headingFont?: string;
}

export function SceneHeader({
  heading,
  eyebrow,
  supportingText,
  accentTone = 'coral',
  align = 'center',
  palette,
  headingFont,
}: SceneHeaderProps) {
  const ds = useVideoDesignSystem({ palette });

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: align === 'left' ? 'flex-start' : 'center',
        textAlign: align,
        maxWidth: ds.layout.isVertical ? '100%' : '1400px',
        gap: '12px',
      }}
    >
      {eyebrow && <EyebrowPill text={eyebrow} accentTone={accentTone} palette={palette} />}
      {heading && (
        <h2
          style={{
            margin: 0,
            fontSize: `${ds.typeScale.sceneTitle.fontSize}px`,
            fontWeight: ds.typeScale.sceneTitle.fontWeight,
            lineHeight: ds.typeScale.sceneTitle.lineHeight,
            letterSpacing: ds.typeScale.sceneTitle.letterSpacing,
            color: ds.surface.textPrimary,
            fontFamily: headingFont || 'Montserrat, sans-serif',
            textTransform: 'uppercase',
          }}
        >
          {heading}
        </h2>
      )}
      {supportingText && (
        <p
          style={{
            margin: 0,
            fontSize: `${ds.typeScale.bodyLg.fontSize}px`,
            fontWeight: ds.typeScale.bodyLg.fontWeight,
            lineHeight: ds.typeScale.bodyLg.lineHeight,
            color: ds.surface.textSecondary,
            maxWidth: ds.layout.isVertical ? '100%' : '1100px',
          }}
        >
          {supportingText}
        </p>
      )}
    </div>
  );
}

export interface StudioCardProps {
  children: React.ReactNode;
  accentTone?: AccentTone;
  palette?: { isDark?: boolean } | null;
  padding?: string;
  elevated?: boolean;
}

export function StudioCard({
  children,
  accentTone = 'slate',
  palette,
  padding,
  elevated = false,
}: StudioCardProps) {
  const ds = useVideoDesignSystem({ palette });
  const accent = ds.accents[accentTone] || ds.accents.slate;

  return (
    <div
      style={{
        backgroundColor: elevated ? ds.surface.cardBgElevated : ds.surface.cardBg,
        border: `1px solid ${ds.surface.borderSubtle}`,
        borderRadius: '24px',
        padding: padding || (ds.layout.isVertical ? '28px 28px' : '36px 40px'),
        boxShadow: elevated ? ds.surface.shadowElevated : ds.surface.shadowCard,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          backgroundColor: accent.solid,
        }}
      />
      {children}
    </div>
  );
}

export interface StepNumberBadgeProps {
  step: number | string;
  accentTone?: AccentTone;
  palette?: { isDark?: boolean } | null;
}

export function StepNumberBadge({ step, accentTone = 'coral', palette }: StepNumberBadgeProps) {
  const ds = useVideoDesignSystem({ palette });
  const accent = ds.accents[accentTone] || ds.accents.coral;

  return (
    <div
      style={{
        width: ds.layout.isVertical ? '48px' : '56px',
        height: ds.layout.isVertical ? '48px' : '56px',
        borderRadius: '16px',
        backgroundColor: accent.solid,
        color: accent.textOnSolid,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: ds.layout.isVertical ? '22px' : '26px',
        fontWeight: 900,
        boxShadow: ds.surface.shadowBadge,
        flexShrink: 0,
      }}
    >
      {step}
    </div>
  );
}
