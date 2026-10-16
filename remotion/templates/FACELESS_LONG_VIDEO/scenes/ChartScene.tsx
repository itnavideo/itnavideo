import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneBlueprintItem } from '../../../../services/ai/sceneBlueprintTypes';

export interface ChartSceneProps {
  scene: SceneBlueprintItem;
  headingFont?: string;
  bodyFont?: string;
}

export function ChartScene({
  scene,
  headingFont = 'Montserrat, sans-serif',
  bodyFont = 'Inter, sans-serif',
}: ChartSceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({
    frame,
    fps,
    config: { damping: 14, mass: 0.8 },
  });

  const percentVal = Math.min(100, Math.max(10, scene.chartValuePercent || 78));
  const animatedPercent = Math.round(
    interpolate(
      spring({ frame: Math.max(0, frame - 5), fps, config: { damping: 16, stiffness: 90 } }),
      [0, 1],
      [0, percentVal]
    )
  );

  const statLabel = scene.statLabel || scene.heading || 'GROWTH TRAJECTORY & METRICS';
  const subtitle = scene.supportingText || 'Verified performance index over active measurement cycle';

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '100px 140px',
        zIndex: 10,
        opacity: entrance,
        transform: `scale(${interpolate(entrance, [0, 1], [0.94, 1.0])})`,
      }}
    >
      <div
        style={{
          maxWidth: '1100px',
          width: '100%',
          borderRadius: '36px',
          border: '1px solid rgba(255, 87, 34, 0.35)',
          backgroundColor: 'rgba(15, 23, 42, 0.92)',
          padding: '52px 64px',
          boxShadow: '0 30px 80px rgba(0, 0, 0, 0.85), 0 0 50px rgba(255, 87, 34, 0.15)',
          backdropFilter: 'blur(24px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
        }}
      >
        {/* Headline */}
        <h2
          style={{
            fontFamily: headingFont,
            fontSize: '44px',
            fontWeight: 900,
            color: '#FFFFFF',
            textTransform: 'uppercase',
            letterSpacing: '-0.02em',
            marginBottom: '14px',
            lineHeight: 1.2,
          }}
        >
          {statLabel}
        </h2>

        {/* Animated Progress Gauge / Bar */}
        <div style={{ width: '100%', maxWidth: '780px', marginTop: '16px', marginBottom: '24px' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'baseline',
              marginBottom: '14px',
            }}
          >
            <span
              style={{
                fontFamily: headingFont,
                fontSize: '56px',
                fontWeight: 900,
                color: '#FFA000',
                letterSpacing: '-0.02em',
              }}
            >
              +{animatedPercent}%
            </span>
          </div>

          {/* Bar track */}
          <div
            style={{
              height: '24px',
              width: '100%',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              borderRadius: '9999px',
              padding: '4px',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${animatedPercent}%`,
                borderRadius: '9999px',
                background: 'linear-gradient(90deg, #FF5722 0%, #FF7043 50%, #FFA000 100%)',
                boxShadow: '0 0 20px rgba(255, 87, 34, 0.65)',
                transition: 'width 0.1s ease',
              }}
            />
          </div>
        </div>

        {/* Supporting Subtitle */}
        <p
          style={{
            fontFamily: bodyFont,
            fontSize: '19px',
            color: '#CBD5E1',
            maxWidth: '820px',
            lineHeight: 1.5,
            fontWeight: 500,
          }}
        >
          {subtitle}
        </p>
      </div>
    </div>
  );
}
