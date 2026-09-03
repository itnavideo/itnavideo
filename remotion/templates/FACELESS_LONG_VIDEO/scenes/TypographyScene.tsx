import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { Heading } from '../components/Heading';
import type { SceneBlueprintItem } from '../../../../services/ai/sceneBlueprintTypes';

export interface TypographySceneProps {
  scene: SceneBlueprintItem;
  headingFont?: string;
  bodyFont?: string;
}

export function TypographyScene({ scene, headingFont = 'Montserrat, sans-serif' }: TypographySceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Smooth Spring Entrance & Ken Burns Motion
  const slideEntrance = spring({
    frame,
    fps,
    config: { damping: 14, mass: 0.8 },
  });

  const subtleZoom = interpolate(frame, [0, 150], [1.0, 1.05], { extrapolateRight: 'clamp' });
  const headline = scene.heading || 'CORE TAKEAWAY';

  // Only render concise supporting text if explicitly distinct from narration
  const supportingBullet = scene.supportingText && scene.supportingText !== scene.narrationSegment?.text
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
        padding: '48px',
        textAlign: 'center',
        zIndex: 10,
        opacity: slideEntrance,
        transform: `translateY(${interpolate(slideEntrance, [0, 1], [40, 0])}px) scale(${subtleZoom})`,
      }}
    >
      <div
        style={{
          position: 'relative',
          maxWidth: '1100px',
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
            marginBottom: '20px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            borderRadius: '9999px',
            border: '1px solid rgba(168, 85, 247, 0.4)',
            backgroundColor: 'rgba(168, 85, 247, 0.12)',
            padding: '8px 20px',
            fontSize: '12px',
            fontWeight: 900,
            textTransform: 'uppercase',
            letterSpacing: '0.15em',
            color: '#C084FC',
          }}
        >
          <span>CHAPTER INSIGHT</span>
        </div>

        <Heading
          text={headline}
          level="h1"
          fontFamily={headingFont}
          color="#FFFFFF"
          style={{ marginBottom: '16px', maxWidth: '1000px', lineHeight: 1.15 }}
        />

        {supportingBullet && (
          <p
            style={{
              fontSize: '20px',
              fontWeight: 600,
              color: '#CBD5E1',
              marginTop: '8px',
              maxWidth: '850px',
              lineHeight: 1.5,
            }}
          >
            {supportingBullet}
          </p>
        )}
      </div>
    </div>
  );
}
