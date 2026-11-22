import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface OceanSimulationProps {
  title?: string;
  waveAmplitude?: number;
  waveFrequency?: number;
  primaryColor?: string;
  aspectRatio?: '16:9' | '9:16' | 'both';
}

export const OceanSimulation: React.FC<OceanSimulationProps> = ({
  title = 'Deep Ocean Surface Simulation',
  waveAmplitude = 22,
  waveFrequency = 0.05,
  primaryColor = '#0284C7',
  aspectRatio = 'both',
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const isVertical = aspectRatio === '9:16' || height > width;

  const anim = spring({ frame, fps, config: { damping: 14, stiffness: 85 } });

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#040b17',
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
            background: 'rgba(2, 132, 199, 0.15)',
            border: `1px solid ${primaryColor}40`,
            color: '#38bdf8',
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: 1.2,
            textTransform: 'uppercase',
            marginBottom: 8,
          }}
        >
          <span>🌊 HYDRODYNAMIC FLUID</span>
          <span>•</span>
          <span>OPEN OCEAN</span>
        </div>
        <h2 style={{ margin: 0, fontSize: isVertical ? 24 : 32, fontWeight: 800 }}>{title}</h2>
      </div>

      {/* Ocean Mesh Canvas */}
      <div
        style={{
          width: isVertical ? '90%' : '65%',
          height: isVertical ? 320 : 320,
          borderRadius: 20,
          border: '1px solid rgba(255, 255, 255, 0.15)',
          background: 'linear-gradient(to bottom, #082f49 0%, #0369a1 40%, #0284c7 80%, #075985 100%)',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Layered Sinusoidal Wave Ribbons */}
        <svg
          viewBox="0 0 400 300"
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
          }}
        >
          {Array.from({ length: 4 }).map((_, idx) => {
            const phase = frame * 0.08 + idx * 1.5;
            const yBase = 160 + idx * 35;
            const amp = waveAmplitude - idx * 3;

            return (
              <path
                key={idx}
                d={`M 0,${yBase} Q 100,${yBase - Math.sin(phase) * amp} 200,${yBase} T 400,${yBase} L 400,300 L 0,300 Z`}
                fill={idx === 0 ? 'rgba(56, 189, 248, 0.35)' : idx === 1 ? 'rgba(14, 165, 233, 0.5)' : idx === 2 ? '#0284c7' : '#0369a1'}
                stroke="rgba(255,255,255,0.4)"
                strokeWidth={idx === 0 ? 2 : 1}
              />
            );
          })}
        </svg>

        {/* Specular Sun Glint */}
        <div
          style={{
            position: 'absolute',
            top: 60,
            width: 140,
            height: 14,
            background: 'radial-gradient(ellipse, rgba(255,255,255,0.8) 0%, transparent 80%)',
            filter: 'blur(3px)',
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
            color: '#7dd3fc',
          }}
        >
          SWELL: 2.8m | PERIOD: 8.4s | DEPTH: 1400m
        </div>
      </div>
    </div>
  );
};
