import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface OceanWavesProps {
  title?: string;
  wavePeriod?: number;
  foamIntensity?: number;
  primaryColor?: string;
  aspectRatio?: '16:9' | '9:16' | 'both';
}

export const OceanWaves: React.FC<OceanWavesProps> = ({
  title = 'Rolling Shoreline Ocean Waves',
  wavePeriod = 80,
  foamIntensity = 0.8,
  primaryColor = '#06B6D4',
  aspectRatio = 'both',
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const isVertical = aspectRatio === '9:16' || height > width;

  const anim = spring({ frame, fps, config: { damping: 14, stiffness: 85 } });
  const waveCycle = (frame % wavePeriod) / wavePeriod;
  const surgeY = interpolate(waveCycle, [0, 0.5, 1], [0, 60, 0]);

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#040d1a',
        color: '#ffffff',
        fontFamily: 'Inter, system-ui, sans-serif',
        padding: isVertical ? '32px 20px' : '40px 48px',
        boxSizing: 'border-box',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Title */}
      <div
        style={{
          textAlign: 'center',
          marginBottom: isVertical ? 20 : 28,
          opacity: anim,
          transform: `translateY(${interpolate(anim, [0, 1], [-15, 0])}px)`,
          zIndex: 10,
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '4px 14px',
            borderRadius: 9999,
            background: 'rgba(6, 182, 212, 0.15)',
            border: `1px solid ${primaryColor}40`,
            color: '#22d3ee',
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: 1.2,
            textTransform: 'uppercase',
            marginBottom: 8,
          }}
        >
          <span>🌊 SURF BREAK</span>
          <span>•</span>
          <span>COASTAL WAVES</span>
        </div>
        <h2 style={{ margin: 0, fontSize: isVertical ? 24 : 32, fontWeight: 800 }}>{title}</h2>
      </div>

      {/* Shoreline Viewport Canvas */}
      <div
        style={{
          width: isVertical ? '90%' : '65%',
          height: isVertical ? 320 : 320,
          borderRadius: 20,
          border: '1px solid rgba(255, 255, 255, 0.15)',
          background: 'linear-gradient(to top, #78350f 0%, #082f49 50%, #0369a1 100%)',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Curled Ocean Wave Crest */}
        <div
          style={{
            position: 'absolute',
            bottom: 40 + surgeY,
            width: '120%',
            height: 90,
            borderRadius: '50% 50% 0 0',
            background: 'linear-gradient(to top, #0284c7 0%, #38bdf8 70%, #ffffff 100%)',
            boxShadow: '0 0 25px rgba(56, 189, 248, 0.5)',
          }}
        />

        {/* White Foam Fringe */}
        <div
          style={{
            position: 'absolute',
            bottom: 125 + surgeY,
            width: '110%',
            height: 14,
            background: '#ffffff',
            borderRadius: 8,
            filter: 'blur(2px)',
            opacity: foamIntensity,
          }}
        />

        {/* HUD Info */}
        <div
          style={{
            position: 'absolute',
            bottom: 12,
            right: 14,
            background: 'rgba(0,0,0,0.7)',
            padding: '4px 10px',
            borderRadius: 6,
            fontSize: 11,
            fontFamily: 'monospace',
            color: '#67e8f9',
          }}
        >
          TIDE: HIGH SURGE | FREQUENCY: 0.12Hz
        </div>
      </div>
    </div>
  );
};
