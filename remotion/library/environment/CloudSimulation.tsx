import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface CloudSimulationProps {
  title?: string;
  cloudSpeed?: number;
  cloudScale?: number;
  primaryColor?: string;
  aspectRatio?: '16:9' | '9:16' | 'both';
}

export const CloudSimulation: React.FC<CloudSimulationProps> = ({
  title = 'Cumulus Cloud & Sky Simulation',
  cloudSpeed = 0.8,
  cloudScale = 1,
  primaryColor = '#38BDF8',
  aspectRatio = 'both',
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const isVertical = aspectRatio === '9:16' || height > width;

  const anim = spring({ frame, fps, config: { damping: 14, stiffness: 85 } });
  const driftX = (frame * cloudSpeed * 1.5) % 450;

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#09090b',
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
            background: 'rgba(56, 189, 248, 0.15)',
            border: `1px solid ${primaryColor}40`,
            color: primaryColor,
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: 1.2,
            textTransform: 'uppercase',
            marginBottom: 8,
          }}
        >
          <span>⛅ TROPOSPHERE CLOUDS</span>
          <span>•</span>
          <span>CUMULUS FORMATIONS</span>
        </div>
        <h2 style={{ margin: 0, fontSize: isVertical ? 24 : 32, fontWeight: 800 }}>{title}</h2>
      </div>

      {/* Cloud Environment Viewport */}
      <div
        style={{
          width: isVertical ? '90%' : '65%',
          height: isVertical ? 320 : 320,
          borderRadius: 20,
          border: '1px solid rgba(255, 255, 255, 0.15)',
          background: 'linear-gradient(to top, #0284c7 0%, #0369a1 40%, #0c4a6e 100%)',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Sun Glow in background */}
        <div
          style={{
            position: 'absolute',
            top: 40,
            right: 50,
            width: 80,
            height: 80,
            borderRadius: '50%',
            background: 'radial-gradient(circle, #fef08a 0%, #f59e0b 60%, transparent 80%)',
            boxShadow: '0 0 35px #fef08a',
          }}
        />

        {/* Drifting Volumetric Cloud Group 1 */}
        <div
          style={{
            position: 'absolute',
            left: -120 + driftX,
            top: 60,
            display: 'flex',
            alignItems: 'center',
            filter: 'drop-shadow(0 15px 20px rgba(0,0,0,0.25))',
          }}
        >
          <div style={{ width: 90, height: 90, borderRadius: '50%', background: '#ffffff' }} />
          <div style={{ width: 130, height: 130, borderRadius: '50%', background: '#ffffff', marginLeft: -40, marginTop: -30 }} />
          <div style={{ width: 90, height: 90, borderRadius: '50%', background: '#ffffff', marginLeft: -35 }} />
        </div>

        {/* Drifting Volumetric Cloud Group 2 (Lower, Slower) */}
        <div
          style={{
            position: 'absolute',
            left: -200 + (driftX * 0.6),
            top: 140,
            display: 'flex',
            alignItems: 'center',
            opacity: 0.85,
            filter: 'drop-shadow(0 15px 20px rgba(0,0,0,0.2))',
          }}
        >
          <div style={{ width: 70, height: 70, borderRadius: '50%', background: '#e0f2fe' }} />
          <div style={{ width: 100, height: 100, borderRadius: '50%', background: '#e0f2fe', marginLeft: -30, marginTop: -20 }} />
          <div style={{ width: 70, height: 70, borderRadius: '50%', background: '#e0f2fe', marginLeft: -25 }} />
        </div>

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
          ALTITUDE: 2500m | COVERAGE: 40% SCATTERED
        </div>
      </div>
    </div>
  );
};
