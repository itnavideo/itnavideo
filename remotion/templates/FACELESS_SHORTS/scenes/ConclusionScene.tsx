import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneBlueprintItem } from '../../../../services/ai/sceneBlueprintTypes';
import type { BackgroundColorPalette } from '../../../components/backgrounds/BackgroundCatalog';
import { HandwritingHighlight } from '../../../components/library/HandwritingHighlight';

export interface ConclusionSceneProps {
  scene: SceneBlueprintItem;
  headingFont?: string;
  bodyFont?: string;
  sceneFrame?: number;
  palette?: BackgroundColorPalette;
}

export function ConclusionScene({
  scene,
  headingFont = 'Montserrat, Inter, sans-serif',
  bodyFont = 'Inter, sans-serif',
  sceneFrame,
  palette,
}: ConclusionSceneProps) {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const currentFrame = sceneFrame ?? frame;

  const isPortrait = height > width;
  const isDark = palette?.isDark ?? false;

  const bg = isDark ? (palette?.background || '#090D16') : '#FFFFFF';
  const textPrimary = isDark ? '#F8FAFC' : '#0F172A';
  const textSecondary = isDark ? '#94A3B8' : '#475569';
  const accentColor = palette?.primary || '#10B981';

  // Responsive scale factor (authored around 1080)
  const s = Math.min(width, height) / 1080;

  // Spring animations with stagger
  const badgeSpring = spring({
    frame: currentFrame,
    fps,
    config: { damping: 14, mass: 0.8, stiffness: 120 },
  });

  const headlineSpring = spring({
    frame: Math.max(0, currentFrame - 6),
    fps,
    config: { damping: 14, mass: 0.8, stiffness: 110 },
  });

  const bodySpring = spring({
    frame: Math.max(0, currentFrame - 14),
    fps,
    config: { damping: 16, mass: 0.9, stiffness: 100 },
  });

  const ctaSpring = spring({
    frame: Math.max(0, currentFrame - 22),
    fps,
    config: { damping: 12, mass: 0.7, stiffness: 130 },
  });

  // Ambient gentle breathe
  const breathe = Math.sin((currentFrame / fps) * 2) * 2;

  const headline = scene.heading || 'Take Action Today';
  const rawHighlight = scene.highlightedWords?.[0] || '';
  const highlightWord = rawHighlight.length >= 2 ? rawHighlight : '';
  const supporting = scene.supportingText || scene.narrationSegment?.text || '';

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: bg,
        padding: isPortrait ? `${180 * s}px ${60 * s}px ${200 * s}px` : `${100 * s}px ${120 * s}px`,
        boxSizing: 'border-box',
        overflow: 'hidden',
      }}
    >
      {/* Background radial accent glow */}
      <div
        style={{
          position: 'absolute',
          width: `${500 * s}px`,
          height: `${500 * s}px`,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${accentColor}22 0%, transparent 70%)`,
          filter: `blur(${60 * s}px)`,
          pointerEvents: 'none',
        }}
      />

      {/* ── 1. Eyebrow Badge ── */}
      <div
        style={{
          opacity: badgeSpring,
          transform: `translateY(${interpolate(badgeSpring, [0, 1], [24 * s, 0])}px) scale(${badgeSpring})`,
          display: 'inline-flex',
          alignItems: 'center',
          gap: `${8 * s}px`,
          padding: `${8 * s}px ${20 * s}px`,
          borderRadius: `${999 * s}px`,
          backgroundColor: isDark ? `${accentColor}20` : `${accentColor}15`,
          border: `1.5px solid ${accentColor}55`,
          marginBottom: `${28 * s}px`,
          boxShadow: `0 ${4 * s}px ${16 * s}px ${accentColor}25`,
        }}
      >
        {/* SVG Checkmark/Target Icon */}
        <svg
          width={18 * s}
          height={18 * s}
          viewBox="0 0 24 24"
          fill="none"
          stroke={accentColor}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
        <span
          style={{
            fontFamily: headingFont,
            fontSize: `${14 * s}px`,
            fontWeight: 800,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: accentColor,
          }}
        >
          FINAL TAKEAWAY
        </span>
      </div>

      {/* ── 2. Primary Headline ── */}
      <div
        style={{
          opacity: headlineSpring,
          transform: `translateY(${interpolate(headlineSpring, [0, 1], [30 * s, 0])}px)`,
          maxWidth: isPortrait ? '92%' : '80%',
          textAlign: 'center',
          marginBottom: `${24 * s}px`,
        }}
      >
        <h1
          style={{
            margin: 0,
            fontFamily: headingFont,
            fontSize: isPortrait ? `${54 * s}px` : `${64 * s}px`,
            fontWeight: 900,
            color: textPrimary,
            lineHeight: 1.15,
            letterSpacing: '-0.03em',
          }}
        >
          {highlightWord && headline.toLowerCase().includes(highlightWord.toLowerCase()) ? (
            <>
              {headline.slice(0, headline.toLowerCase().indexOf(highlightWord.toLowerCase()))}
              <HandwritingHighlight
                text={highlightWord.toUpperCase()}
                variant="underline"
                color={accentColor}
                delayFrames={8}
              />
              {headline.slice(
                headline.toLowerCase().indexOf(highlightWord.toLowerCase()) + highlightWord.length
              )}
            </>
          ) : (
            headline
          )}
        </h1>
      </div>

      {/* ── 3. Supporting Text Card ── */}
      {supporting && (
        <div
          style={{
            opacity: bodySpring,
            transform: `translateY(${interpolate(bodySpring, [0, 1], [30 * s, 0])}px)`,
            maxWidth: isPortrait ? '90%' : '72%',
            textAlign: 'center',
            marginBottom: `${36 * s}px`,
            padding: `${16 * s}px ${28 * s}px`,
            borderRadius: `${16 * s}px`,
            backgroundColor: isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(15, 23, 42, 0.03)',
            border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.06)',
          }}
        >
          <p
            style={{
              margin: 0,
              fontFamily: bodyFont,
              fontSize: isPortrait ? `${24 * s}px` : `${28 * s}px`,
              fontWeight: 500,
              color: textSecondary,
              lineHeight: 1.45,
            }}
          >
            {supporting}
          </p>
        </div>
      )}

      {/* ── 4. Call-To-Action Pill ── */}
      <div
        style={{
          opacity: ctaSpring,
          transform: `translateY(${interpolate(ctaSpring, [0, 1], [25 * s, 0]) + breathe}px) scale(${ctaSpring})`,
          display: 'inline-flex',
          alignItems: 'center',
          gap: `${10 * s}px`,
          padding: `${14 * s}px ${32 * s}px`,
          borderRadius: `${999 * s}px`,
          backgroundColor: accentColor,
          boxShadow: `0 ${10 * s}px ${30 * s}px ${accentColor}44`,
        }}
      >
        <span
          style={{
            fontFamily: headingFont,
            fontSize: `${18 * s}px`,
            fontWeight: 800,
            color: '#FFFFFF',
            letterSpacing: '0.04em',
          }}
        >
          START TODAY
        </span>
        <svg
          width={18 * s}
          height={18 * s}
          viewBox="0 0 24 24"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="12 5 19 12 12 19" />
        </svg>
      </div>
    </div>
  );
}

export default ConclusionScene;
