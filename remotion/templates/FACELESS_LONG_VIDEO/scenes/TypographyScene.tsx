import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { ResponsiveTypography } from '../components/ResponsiveTypography';
import type { SceneBlueprintItem } from '../../../../services/ai/sceneBlueprintTypes';
import { resolveFont } from '../../../utils/fonts';

import type { BackgroundColorPalette } from '../../../components/backgrounds/BackgroundCatalog';

export interface TypographySceneProps {
  scene: SceneBlueprintItem;
  headingFont?: string;
  bodyFont?: string;
  sceneFrame?: number;
  palette?: BackgroundColorPalette;
}

export function TypographyScene({
  scene,
  headingFont = 'Plus Jakarta Sans',
  bodyFont = 'Inter',
  sceneFrame,
  palette,
}: TypographySceneProps) {
  const resolvedBodyFont = resolveFont(bodyFont);
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const currentFrame = sceneFrame ?? frame;

  const isDark = palette?.isDark ?? true;
  const textColor = isDark ? '#FFFFFF' : '#0F172A';
  const supportingTextColor = isDark ? '#CBD5E1' : '#475569';
  const accentColor = '#FF5722';

  // Smooth Spring Entrance & Ken Burns Motion (frame-relative)
  const slideEntrance = spring({
    frame: currentFrame,
    fps,
    config: { damping: 14, mass: 0.8 },
  });

  const subtleZoom = interpolate(currentFrame, [0, 150], [1.0, 1.05], { extrapolateRight: 'clamp' });
  const headline = scene.heading || scene.narrationSegment?.text || 'CORE TAKEAWAY';

  // Only render concise supporting text if explicitly distinct from headline
  const supportingBullet = scene.supportingText && scene.supportingText !== headline && scene.supportingText !== scene.narrationSegment?.text
    ? scene.supportingText
    : '';

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '100px 140px', // Strict 1920x1080 safe area
        textAlign: 'center',
        zIndex: 10,
        overflow: 'hidden',
      }}
    >
      {/* ── Ambient Motion Graphics Background ── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: isDark
            ? 'radial-gradient(circle, rgba(255, 255, 255, 0.05) 1px, transparent 1px)'
            : 'radial-gradient(circle, rgba(15, 23, 42, 0.04) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          opacity: 0.65,
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: '800px',
          height: '500px',
          borderRadius: '50%',
          background: isDark
            ? 'radial-gradient(circle, rgba(255, 87, 34, 0.12) 0%, rgba(255, 160, 0, 0.04) 50%, transparent 75%)'
            : 'radial-gradient(circle, rgba(255, 87, 34, 0.06) 0%, transparent 65%)',
          filter: 'blur(70px)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          opacity: slideEntrance,
          transform: `translateY(${interpolate(slideEntrance, [0, 1], [30, 0])}px) scale(${subtleZoom})`,
          maxWidth: '1380px',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2,
        }}
      >
        {/* Responsive Typography Engine handles dynamic font scale, balance & line wrap */}
        <ResponsiveTypography
          text={headline}
          mode={scene.typographyTreatment}
          fontFamily={headingFont}
          color={textColor}
          accentColor={accentColor}
          availableWidth={1150}
          availableHeight={520}
        />

        {supportingBullet && (
          <p
            style={{
              fontFamily: resolvedBodyFont,
              fontSize: '24px',
              fontWeight: 600,
              color: supportingTextColor,
              marginTop: '28px',
              maxWidth: '920px',
              lineHeight: 1.5,
              textShadow: isDark ? '0 2px 14px rgba(0,0,0,0.85)' : 'none',
            }}
          >
            {supportingBullet}
          </p>
        )}
      </div>
    </div>
  );
}
