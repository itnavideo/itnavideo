import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface LightningStrikeProps {
  title?: string;
  strikeInterval?: number;
  branchCount?: number;
  primaryColor?: string;
  aspectRatio?: '16:9' | '9:16' | 'both';
}

export const LightningStrike: React.FC<LightningStrikeProps> = ({
  title = 'High-Voltage Lightning Strike',
  strikeInterval = 75,
  branchCount = 3,
  primaryColor = '#A855F7',
  aspectRatio = 'both',
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const isVertical = aspectRatio === '9:16' || height > width;

  const anim = spring({ frame, fps, config: { damping: 14, stiffness: 85 } });

  // Strike flashes on specific frames
  const cycleFrame = frame % strikeInterval;
  const isStriking = cycleFrame >= 10 && cycleFrame <= 18;
  const flashAlpha = isStriking ? (cycleFrame % 2 === 0 ? 1 : 0.4) : 0;

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#06030b',
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
            background: 'rgba(168, 85, 247, 0.15)',
            border: `1px solid ${primaryColor}40`,
            color: '#c084fc',
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: 1.2,
            textTransform: 'uppercase',
            marginBottom: 8,
          }}
        >
          <span>⚡ PLASMA DISCHARGE</span>
          <span>•</span>
          <span>ELECTRICAL STRIKE</span>
        </div>
        <h2 style={{ margin: 0, fontSize: isVertical ? 24 : 32, fontWeight: 800 }}>{title}</h2>
      </div>

      {/* Lightning Viewport Canvas */}
      <div
        style={{
          width: isVertical ? '90%' : '65%',
          height: isVertical ? 320 : 320,
          borderRadius: 20,
          border: '1px solid rgba(255, 255, 255, 0.15)',
          background: isStriking ? '#2e1065' : '#090514',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'background 0.05s ease',
        }}
      >
        {/* Sky Lightning Flash Strobe Glow */}
        {isStriking && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(circle at 50% 10%, rgba(255, 255, 255, 0.8) 0%, rgba(168, 85, 247, 0.6) 50%, transparent 100%)',
              mixBlendMode: 'screen',
              opacity: flashAlpha,
            }}
          />
        )}

        {/* Branching Jagged Lightning Bolt SVG */}
        {isStriking && (
          <svg
            viewBox="0 0 300 320"
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              filter: 'drop-shadow(0 0 15px #c084fc)',
            }}
          >
            {/* Main Trunk Bolt */}
            <polyline
              points="140,0 155,70 130,120 170,180 145,240 160,320"
              fill="none"
              stroke="#ffffff"
              strokeWidth="4"
              strokeLinecap="round"
            />
            {/* Branch 1 */}
            <polyline
              points="130,120 90,160 80,210"
              fill="none"
              stroke="#e9d5ff"
              strokeWidth="2"
            />
            {/* Branch 2 */}
            <polyline
              points="170,180 215,220 230,260"
              fill="none"
              stroke="#e9d5ff"
              strokeWidth="2"
            />
          </svg>
        )}

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
            color: '#d8b4fe',
          }}
        >
          VOLTAGE: 300MV | CURRENT: 30kA | PLASMA: ACTIVE
        </div>
      </div>
    </div>
  );
};
