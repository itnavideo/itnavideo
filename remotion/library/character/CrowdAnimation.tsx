import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface CrowdAnimationProps {
  title?: string;
  crowdCount?: number;
  cheerIntensity?: number;
  primaryColor?: string;
  aspectRatio?: '16:9' | '9:16' | 'both';
}

export const CrowdAnimation: React.FC<CrowdAnimationProps> = ({
  title = 'Cheering Audience & Crowd Simulation',
  crowdCount = 12,
  cheerIntensity = 1,
  primaryColor = '#38BDF8',
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
            color: '#38bdf8',
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: 1.2,
            textTransform: 'uppercase',
            marginBottom: 8,
          }}
        >
          <span>👥 MULTI-AGENT SYNTHESIS</span>
          <span>•</span>
          <span>CROWD BEHAVIOR</span>
        </div>
        <h2 style={{ margin: 0, fontSize: isVertical ? 24 : 32, fontWeight: 800 }}>{title}</h2>
      </div>

      {/* Crowd Viewport Canvas */}
      <div
        style={{
          width: isVertical ? '90%' : '65%',
          height: isVertical ? 340 : 340,
          borderRadius: 20,
          border: '1px solid rgba(255, 255, 255, 0.15)',
          background: 'linear-gradient(to top, #0f172a 0%, #1e1b4b 60%, #030712 100%)',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
          paddingBottom: 25,
        }}
      >
        {/* Stadium Audience Bleachers Row */}
        <div
          style={{
            display: 'flex',
            gap: isVertical ? 10 : 16,
            alignItems: 'flex-end',
            width: '95%',
            justifyContent: 'center',
          }}
        >
          {Array.from({ length: crowdCount }).map((_, idx) => {
            const bounce = Math.abs(Math.sin((frame + idx * 8) * 0.15)) * (16 * cheerIntensity);
            const armRaise = Math.sin((frame + idx * 12) * 0.2) * 10;
            const colors = ['#38bdf8', '#ec4899', '#f59e0b', '#10b981', '#a855f7'];
            const charColor = colors[idx % colors.length];

            return (
              <div
                key={idx}
                style={{
                  transform: `translateY(${-bounce}px)`,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                {/* Arms cheering */}
                <div style={{ display: 'flex', gap: 14, marginBottom: -6 }}>
                  <div style={{ width: 3, height: 16, background: '#ffffff', transform: `rotate(${-20 + armRaise}deg)` }} />
                  <div style={{ width: 3, height: 16, background: '#ffffff', transform: `rotate(${20 - armRaise}deg)` }} />
                </div>
                {/* Head */}
                <div style={{ width: 18, height: 18, borderRadius: '50%', background: charColor }} />
                {/* Torso */}
                <div style={{ width: 22, height: 35, borderRadius: '4px 4px 0 0', background: '#334155', marginTop: 2 }} />
              </div>
            );
          })}
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
          AGENTS: {crowdCount} | STATE: EXCITED (CHEER 100%)
        </div>
      </div>
    </div>
  );
};
