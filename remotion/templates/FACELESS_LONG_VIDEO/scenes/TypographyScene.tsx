import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { ResponsiveTypography } from '../components/ResponsiveTypography';
import type { SceneBlueprintItem } from '../../../../services/ai/sceneBlueprintTypes';
import { resolveFont } from '../../../utils/fonts';

export interface TypographySceneProps {
  scene: SceneBlueprintItem;
  headingFont?: string;
  bodyFont?: string;
}

export function TypographyScene({
  scene,
  headingFont = 'Plus Jakarta Sans',
  bodyFont = 'Inter',
}: TypographySceneProps) {
  const resolvedBodyFont = resolveFont(bodyFont);
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Smooth Spring Entrance & Ken Burns Motion
  const slideEntrance = spring({
    frame,
    fps,
    config: { damping: 14, mass: 0.8 },
  });

  const subtleZoom = interpolate(frame, [0, 150], [1.0, 1.05], { extrapolateRight: 'clamp' });
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
        padding: '100px 140px', // Strict 1920x1080 safe area (140px X, 100px Y)
        textAlign: 'center',
        zIndex: 10,
        opacity: slideEntrance,
        transform: `translateY(${interpolate(slideEntrance, [0, 1], [30, 0])}px) scale(${subtleZoom})`,
      }}
    >
      <div
        style={{
          position: 'relative',
          maxWidth: '1150px', // Controlled width (never 1800px)
          width: '100%',
          borderRadius: '32px',
          border: '1px solid rgba(168, 85, 247, 0.35)',
          backgroundColor: 'rgba(15, 23, 42, 0.85)',
          padding: '48px 56px',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.85), 0 0 50px rgba(168, 85, 247, 0.2)',
          backdropFilter: 'blur(24px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            marginBottom: '24px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            borderRadius: '9999px',
            border: '1px solid rgba(168, 85, 247, 0.4)',
            backgroundColor: 'rgba(168, 85, 247, 0.12)',
            padding: '8px 22px',
            fontSize: '13px',
            fontWeight: 900,
            textTransform: 'uppercase',
            letterSpacing: '0.15em',
            color: '#C084FC',
          }}
        >
          <span>CHAPTER INSIGHT</span>
        </div>

        {/* Responsive Typography Engine handles dynamic font scale, balance & line wrap */}
        <ResponsiveTypography
          text={headline}
          mode={scene.typographyTreatment}
          fontFamily={headingFont}
          color="#FFFFFF"
          accentColor="#C084FC"
          availableWidth={1050}
          availableHeight={480}
        />

        {supportingBullet && (
          <p
            style={{
              fontFamily: resolvedBodyFont,
              fontSize: '22px',
              fontWeight: 600,
              color: '#CBD5E1',
              marginTop: '20px',
              maxWidth: '850px',
              lineHeight: 1.45,
            }}
          >
            {supportingBullet}
          </p>
        )}
      </div>
    </div>
  );
}
