import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface SpillSuppressorProps {
  title?: string;
  spillTarget?: 'green' | 'blue';
  despillStrength?: number;
  showComparison?: boolean;
  aspectRatio?: '16:9' | '9:16' | 'both';
}

export const SpillSuppressor: React.FC<SpillSuppressorProps> = ({
  title = 'Chroma Spill Suppressor',
  spillTarget = 'green',
  despillStrength = 0.9,
  showComparison = true,
  aspectRatio = 'both',
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const isVertical = aspectRatio === '9:16' || height > width;

  const anim = spring({ frame, fps, config: { damping: 14, stiffness: 85 } });
  const splitPos = interpolate(frame % 100, [0, 50, 100], [25, 75, 25]);

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
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '4px 14px',
            borderRadius: 9999,
            background: 'rgba(34, 197, 94, 0.15)',
            border: '1px solid rgba(34, 197, 94, 0.4)',
            color: '#4ade80',
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: 1.2,
            textTransform: 'uppercase',
            marginBottom: 8,
          }}
        >
          <span>✦ DESPILL ALGORITHM</span>
          <span>•</span>
          <span>{spillTarget.toUpperCase()} SCREEN CORRECTION</span>
        </div>
        <h2 style={{ margin: 0, fontSize: isVertical ? 24 : 32, fontWeight: 800 }}>{title}</h2>
      </div>

      {/* Split Comparison Canvas */}
      <div
        style={{
          width: isVertical ? '90%' : '65%',
          height: isVertical ? 300 : 300,
          borderRadius: 20,
          border: '1px solid rgba(255, 255, 255, 0.15)',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0b0c10',
        }}
      >
        {/* Raw with Green Spill */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(circle at 50% 50%, #22c55e 0%, #14532d 50%, #052e16 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div style={{ textAlign: 'center', color: '#86efac', fontWeight: 800, fontSize: 20 }}>
            RAW SPILL BOUNCE
          </div>
        </div>

        {/* Cleaned Neutral Output (Clipped on right) */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(circle at 50% 50%, #71717a 0%, #3f3f46 50%, #18181b 100%)',
            clipPath: `inset(0 0 0 ${splitPos}%)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div style={{ textAlign: 'center', color: '#f4f4f5', fontWeight: 800, fontSize: 20 }}>
            NEUTRALIZED EDGES
          </div>
        </div>

        {/* Split Divider */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: `${splitPos}%`,
            width: 2,
            background: '#ffffff',
            boxShadow: '0 0 10px #ffffff',
          }}
        />

        {/* HUD Info */}
        <div
          style={{
            position: 'absolute',
            bottom: 12,
            left: 14,
            background: 'rgba(0,0,0,0.75)',
            padding: '4px 10px',
            borderRadius: 6,
            fontSize: 11,
            fontFamily: 'monospace',
            color: '#4ade80',
          }}
        >
          DESPILL GAIN: {Math.round(despillStrength * 100)}% | TARGET: G &gt; (R+B)/2
        </div>
      </div>
    </div>
  );
};
