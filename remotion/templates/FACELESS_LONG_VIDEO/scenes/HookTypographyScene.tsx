import React from 'react';
import { interpolate, spring } from 'remotion';
import type { SceneBlueprintItem } from '../../../../services/ai/sceneBlueprintTypes';
import type { BackgroundColorPalette } from '../../../components/backgrounds/BackgroundCatalog';
import { useVideoDesignSystem } from '../designSystem';
import {
  EyebrowPill,
  SceneCanvas,
} from '../components/DesignSystemPrimitives';

export interface HookTypographySceneProps {
  scene: SceneBlueprintItem;
  headingFont?: string;
  bodyFont?: string;
  sceneFrame?: number;
  palette?: BackgroundColorPalette;
}

/**
 * L01. HookTypographyScene
 * Full-width cinematic typography hero — typography IS the visual.
 * Strictly NO stickmen or empty gray placeholders.
 * Features:
 *  - Massive display typography (80–120px) with spring entrance
 *  - Marker tape sweep highlight on key emphasis word
 *  - Accent underline stroke / decorative marker bar
 *  - Floating ambient subtle particles/stars
 */
export function HookTypographyScene({
  scene,
  headingFont = 'Montserrat, "Plus Jakarta Sans", sans-serif',
  bodyFont = 'Inter, "Plus Jakarta Sans", sans-serif',
  sceneFrame,
  palette,
}: HookTypographySceneProps) {
  const ds = useVideoDesignSystem({
    sceneFrame,
    durationSec: scene.duration,
    palette,
  });

  const headline = String(scene.heading || 'A REVOLUTION IN DELIVERY').trim();
  const kicker = String(scene.categoryPill || 'THE CRITICAL SHIFT').trim();

  // Find emphasis word to highlight with marker tape
  const rawHighlight =
    scene.highlightedWords && typeof scene.highlightedWords[0] === 'string'
      ? scene.highlightedWords[0].trim()
      : '';
  const highlightWord = rawHighlight.length >= 2 ? rawHighlight : '';
  const highlightIndex = highlightWord
    ? headline.toLowerCase().indexOf(highlightWord.toLowerCase())
    : -1;

  // Staggered springs
  const kickerSpring = ds.motion.stagger(0, 4, 6);
  const headlineSpring = ds.motion.stagger(1, 6, 6);
  const underlineSpring = spring({
    frame: Math.max(0, ds.localFrame - 14),
    fps: ds.fps,
    config: { damping: 14, mass: 0.8, stiffness: 140 },
  });

  const isDark = ds.surface.isDark;
  const textColor = isDark ? '#FFFFFF' : '#0F172A';
  const markerBg = '#FFE600';
  const markerTextColor = '#0F172A';

  return (
    <SceneCanvas
      sceneFrame={sceneFrame}
      durationSec={scene.duration}
      palette={palette}
      accentTone="coral"
      fontFamily={bodyFont}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '1520px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '40px 60px',
          position: 'relative',
        }}
      >
        {/* Subtle Kicker Pill */}
        <div
          style={{
            marginBottom: '28px',
            opacity: kickerSpring,
            transform: `translateY(${interpolate(kickerSpring, [0, 1], [-16, 0])}px)`,
          }}
        >
          <EyebrowPill
            label={kicker}
            tone="coral"
            palette={palette}
            progress={kickerSpring}
          />
        </div>

        {/* Display Typography Hero */}
        <h1
          style={{
            fontFamily: headingFont,
            fontSize: headline.length > 35 ? '84px' : headline.length > 20 ? '104px' : '124px',
            fontWeight: 900,
            letterSpacing: '-0.03em',
            lineHeight: 1.12,
            color: textColor,
            margin: '0 0 24px 0',
            maxWidth: '1420px',
            opacity: headlineSpring,
            transform: `translateY(${interpolate(headlineSpring, [0, 1], [30, 0])}px) scale(${interpolate(
              headlineSpring,
              [0, 1],
              [0.96, 1]
            )})`,
            wordBreak: 'break-word',
          }}
        >
          {highlightIndex !== -1 ? (
            <>
              {headline.slice(0, highlightIndex)}
              <span
                style={{
                  position: 'relative',
                  display: 'inline-block',
                  margin: '0 8px',
                  padding: '4px 16px',
                  borderRadius: '8px',
                  backgroundColor: markerBg,
                  color: markerTextColor,
                  boxShadow: '0 6px 22px rgba(255, 230, 0, 0.45)',
                  transform: 'rotate(-1.2deg)',
                  verticalAlign: 'baseline',
                }}
              >
                {headline.slice(highlightIndex, highlightIndex + highlightWord.length)}
              </span>
              {headline.slice(highlightIndex + highlightWord.length)}
            </>
          ) : (
            headline
          )}
        </h1>

        {/* Dynamic Underline Accent Bar */}
        <div
          style={{
            width: `${interpolate(underlineSpring, [0, 1], [0, Math.min(680, headline.length * 20)])}px`,
            height: '6px',
            borderRadius: '3px',
            background: 'linear-gradient(90deg, #EA580C, #F59E0B, #EA580C)',
            boxShadow: '0 2px 10px rgba(234, 88, 12, 0.4)',
            marginBottom: '24px',
          }}
        />

        {/* Subtle Ambient Decorative Sparkles */}
        <div
          style={{
            position: 'absolute',
            top: '20%',
            left: '10%',
            opacity: interpolate(underlineSpring, [0, 1], [0, 0.7]),
            transform: `rotate(${ds.localFrame * 0.4}deg)`,
            pointerEvents: 'none',
          }}
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="#F59E0B">
            <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" />
          </svg>
        </div>
        <div
          style={{
            position: 'absolute',
            bottom: '22%',
            right: '12%',
            opacity: interpolate(underlineSpring, [0, 1], [0, 0.6]),
            transform: `rotate(-${ds.localFrame * 0.3}deg)`,
            pointerEvents: 'none',
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="#EA580C">
            <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" />
          </svg>
        </div>
      </div>
    </SceneCanvas>
  );
}
