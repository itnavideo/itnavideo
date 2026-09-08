import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { Heading } from '../components/Heading';
import type { SceneBlueprintItem } from '../../../../services/ai/sceneBlueprintTypes';

export interface HookSceneProps {
  scene: SceneBlueprintItem;
  headingFont?: string;
  bodyFont?: string;
}

export function HookScene({ scene, headingFont = 'Montserrat, sans-serif' }: HookSceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Smooth Spring Entrance & Ken Burns Scale Bounce
  const scaleEntrance = spring({
    frame,
    fps,
    config: { damping: 14, mass: 0.8 },
  });

  const subtleZoom = interpolate(frame, [0, 150], [1.0, 1.06], { extrapolateRight: 'clamp' });
  const headline = scene.heading || 'HIGH IMPACT HOOK';

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
        opacity: scaleEntrance,
        transform: `scale(${interpolate(scaleEntrance, [0, 1], [0.9, 1.0]) * subtleZoom})`,
      }}
    >
      <div
        style={{
          position: 'relative',
          maxWidth: '1100px',
          width: '100%',
          borderRadius: '32px',
          border: '1px solid rgba(56, 189, 248, 0.35)',
          backgroundColor: 'rgba(15, 23, 42, 0.85)',
          padding: '48px 56px',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.85), 0 0 50px rgba(56, 189, 248, 0.2)',
          backdropFilter: 'blur(24px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Clean Vox-Style Chapter Pill (No Debug Labels!) */}
        <div
          style={{
            marginBottom: '20px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            borderRadius: '9999px',
            border: '1px solid rgba(0, 255, 157, 0.4)',
            backgroundColor: 'rgba(0, 255, 157, 0.12)',
            padding: '8px 20px',
            fontSize: '12px',
            fontWeight: 900,
            textTransform: 'uppercase',
            letterSpacing: '0.15em',
            color: '#00FF9D',
          }}
        >
          <span>✦ FEATURED OVERVIEW</span>
        </div>

        {/* Big Punchy Hook Headline (NO duplicate narration body text!) */}
        <Heading
          text={headline}
          level="h1"
          fontFamily={headingFont}
          color="#FFFFFF"
          style={{ marginBottom: '16px', maxWidth: '1000px', lineHeight: 1.15 }}
        />

        {/* Highlighted Keyword Pills */}
        {scene.highlightedWords && scene.highlightedWords.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center', marginTop: '12px' }}>
            {scene.highlightedWords.map((word, idx) => (
              <span
                key={idx}
                style={{
                  fontSize: '14px',
                  fontWeight: 800,
                  color: '#38BDF8',
                  backgroundColor: 'rgba(56, 189, 248, 0.15)',
                  border: '1px solid rgba(56, 189, 248, 0.35)',
                  padding: '6px 16px',
                  borderRadius: '12px',
                }}
              >
                #{word.toUpperCase()}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
