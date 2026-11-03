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
        padding: '180px 60px', // Strict 1080x1920 vertical mobile safe area
        textAlign: 'center',
        zIndex: 10,
        opacity: slideEntrance,
        transform: `translateY(${interpolate(slideEntrance, [0, 1], [30, 0])}px) scale(${subtleZoom})`,
      }}
    >
      <div
        style={{
          position: 'relative',
          maxWidth: '960px',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Responsive Typography Engine handles dynamic font scale, balance & line wrap */}
        <ResponsiveTypography
          text={headline}
          mode={scene.typographyTreatment}
          fontFamily={headingFont}
          color={textColor}
          accentColor={accentColor}
          availableWidth={920}
          availableHeight={720}
        />

        {supportingBullet && (
          <p
            style={{
              fontFamily: resolvedBodyFont,
              fontSize: '28px',
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
