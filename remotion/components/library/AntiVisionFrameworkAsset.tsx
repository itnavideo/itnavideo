import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface AntiVisionItem {
  id: string;
  antiGoal: string;
  idealGoal: string;
}

export interface AntiVisionFrameworkAssetProps {
  sceneFrame?: number;
  isDark?: boolean;
  scale?: number;
  startDelayFrames?: number;
}

/**
 * AntiVisionFrameworkAsset
 * The Anti-Vision vs The Vision Framework (Inverting What You Hate into Ideal Reality).
 * Learned from Ali Abdaal's "What To Do With Your Life" (YouTube: fEMHMd7fovM).
 */
export const AntiVisionFrameworkAsset: React.FC<AntiVisionFrameworkAssetProps> = ({
  sceneFrame,
  isDark = false,
  scale = 1.0,
  startDelayFrames = 5,
}) => {
  const currentFrame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const activeFrame = (sceneFrame !== undefined ? sceneFrame : currentFrame) - startDelayFrames;
  const frame = Math.max(0, activeFrame);

  const headerSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 120 },
  });

  const items: AntiVisionItem[] = [
    {
      id: 'work',
      antiGoal: 'Waking to an alarm & commuting to a micromanaged office',
      idealGoal: 'Slow mornings & working from a sunny desk on chosen projects',
    },
    {
      id: 'finance',
      antiGoal: 'Trading 40 hours for a fixed, capped monthly salary',
      idealGoal: 'High-leverage digital assets with uncapped upside',
    },
    {
      id: 'lifestyle',
      antiGoal: 'Exhausted evenings with zero energy for family or hobbies',
      idealGoal: 'Midday gym sessions & fully present evenings with loved ones',
    },
  ];

  return (
    <div
      style={{
        transform: `scale(${scale})`,
        transformOrigin: 'center center',
        width: '100%',
        maxWidth: 780,
        margin: '0 auto',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      {/* Title */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 16,
          opacity: headerSpring,
          transform: `translateY(${interpolate(headerSpring, [0, 1], [14, 0])}px)`,
        }}
      >
        <div>
          <h3
            style={{
              margin: 0,
              fontSize: 18,
              fontWeight: 700,
              fontFamily: 'Lora, Georgia, serif',
              color: isDark ? '#FAFAFA' : '#141414',
            }}
          >
            The Anti-Vision Inversion Method
          </h3>
          <span style={{ fontSize: 12, color: isDark ? '#A1A1AA' : '#71717A' }}>
            Define What You Hate $\rightarrow$ Invert into The Ideal Life
          </span>
        </div>

        <div
          style={{
            fontFamily: 'Caveat, cursive',
            fontSize: 18,
            fontWeight: 700,
            color: '#EA580C',
            transform: 'rotate(-4deg)',
            backgroundColor: isDark ? 'rgba(234, 88, 12, 0.15)' : '#FFF7ED',
            padding: '3px 10px',
            borderRadius: 8,
            border: '1px dashed #EA580C',
          }}
        >
          It&apos;s easier to know what you hate!
        </div>
      </div>

      {/* Dual Column Header */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 16,
          marginBottom: 10,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '6px 12px',
            borderRadius: 8,
            backgroundColor: isDark ? 'rgba(239, 68, 68, 0.15)' : '#FEF2F2',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#EF4444',
            fontSize: 12,
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
          }}
        >
          <span>✕</span> The Anti-Vision (What You Hate)
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '6px 12px',
            borderRadius: 8,
            backgroundColor: isDark ? 'rgba(16, 185, 129, 0.15)' : '#F0FDF4',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            color: '#059669',
            fontSize: 12,
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
          }}
        >
          <span>✓</span> The Inverted Vision (The Goal)
        </div>
      </div>

      {/* Rows */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {items.map((item, idx) => {
          const rowSpring = spring({
            frame: Math.max(0, frame - idx * 6),
            fps,
            config: { damping: 14, stiffness: 130 },
          });

          return (
            <div
              key={item.id}
              style={{
                opacity: rowSpring,
                transform: `translateY(${interpolate(rowSpring, [0, 1], [14, 0])}px)`,
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 16,
              }}
            >
              {/* Anti-Goal Card */}
              <div
                style={{
                  padding: '12px 14px',
                  borderRadius: 12,
                  backgroundColor: isDark ? 'rgba(24, 24, 27, 0.85)' : '#FFFFFF',
                  border: isDark ? '1px solid rgba(239, 68, 68, 0.2)' : '1px solid rgba(239, 68, 68, 0.15)',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.03)',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 8,
                }}
              >
                <span style={{ color: '#EF4444', fontWeight: 700, fontSize: 13 }}>✕</span>
                <span style={{ fontSize: 12, color: isDark ? '#A1A1AA' : '#64748B', lineHeight: 1.4 }}>
                  {item.antiGoal}
                </span>
              </div>

              {/* Ideal Goal Card */}
              <div
                style={{
                  padding: '12px 14px',
                  borderRadius: 12,
                  backgroundColor: isDark ? 'rgba(24, 24, 27, 0.85)' : '#FFFFFF',
                  border: isDark ? '1px solid rgba(16, 185, 129, 0.25)' : '1px solid rgba(16, 185, 129, 0.20)',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.03)',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 8,
                }}
              >
                <span style={{ color: '#059669', fontWeight: 700, fontSize: 13 }}>✓</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: isDark ? '#FAFAFA' : '#18181B', lineHeight: 1.4 }}>
                  {item.idealGoal}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
