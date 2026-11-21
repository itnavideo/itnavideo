import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface VisionActionMatrixAssetProps {
  sceneFrame?: number;
  isDark?: boolean;
  scale?: number;
  startDelayFrames?: number;
  activeQuadrant?: 'dreamer' | 'master' | 'drifter' | 'hamster';
}

/**
 * VisionActionMatrixAsset
 * 2x2 Ambition & Productivity Matrix (Drifter, Dreamer, Hamster, Master).
 * Learned from Ali Abdaal's "If you're ambitious but feel stuck, please watch this" (YouTube: 6-ZxPvpV8ec).
 */
export const VisionActionMatrixAsset: React.FC<VisionActionMatrixAssetProps> = ({
  sceneFrame,
  isDark = false,
  scale = 1.0,
  startDelayFrames = 5,
  activeQuadrant = 'dreamer',
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

  const quadrants = [
    {
      id: 'dreamer',
      title: 'THE DREAMER',
      subtitle: 'High Vision • Low Action',
      desc: 'Paralyzed by big goals • High friction & overwhelm • Chronic overthinking',
      color: '#EA580C',
      bgColor: 'rgba(234, 88, 12, 0.08)',
      isTarget: activeQuadrant === 'dreamer',
      tag: 'You Are Likely Here',
    },
    {
      id: 'master',
      title: 'THE MASTER',
      subtitle: 'High Vision • High Action',
      desc: 'Clear North Star • Daily execution systems • Consistent compound growth',
      color: '#059669',
      bgColor: 'rgba(5, 150, 105, 0.08)',
      isTarget: activeQuadrant === 'master',
      tag: '★ The Ideal State',
    },
    {
      id: 'drifter',
      title: 'THE DRIFTER',
      subtitle: 'Low Vision • Low Action',
      desc: 'Zombie autopilot • Passive consumer • Zero long-term direction',
      color: '#64748B',
      bgColor: 'rgba(100, 116, 139, 0.06)',
      isTarget: activeQuadrant === 'drifter',
      tag: 'Autopilot Trap',
    },
    {
      id: 'hamster',
      title: 'THE HAMSTER',
      subtitle: 'Low Vision • High Action',
      desc: 'Exhausting busywork • 80h grind on the wrong ladder • Burnout',
      color: '#D97706',
      bgColor: 'rgba(217, 119, 6, 0.06)',
      isTarget: activeQuadrant === 'hamster',
      tag: 'Busywork Wheel',
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
            The Ambition vs Action Matrix
          </h3>
          <span style={{ fontSize: 12, color: isDark ? '#A1A1AA' : '#71717A' }}>
            Vision Axis (Y) × Execution Axis (X)
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
          Shift: Dreamer $\rightarrow$ Master!
        </div>
      </div>

      {/* 2x2 Matrix Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 12,
        }}
      >
        {quadrants.map((q, idx) => {
          const qSpring = spring({
            frame: Math.max(0, frame - idx * 4),
            fps,
            config: { damping: 14, stiffness: 130 },
          });

          return (
            <div
              key={q.id}
              style={{
                opacity: qSpring,
                transform: `scale(${interpolate(qSpring, [0, 1], [0.94, 1])})`,
                backgroundColor: isDark ? 'rgba(24, 24, 27, 0.90)' : '#FFFFFF',
                borderRadius: 16,
                padding: '16px 18px',
                border: q.isTarget
                  ? `2px solid ${q.color}`
                  : isDark
                  ? '1px solid rgba(255, 255, 255, 0.08)'
                  : '1px solid rgba(0, 0, 0, 0.07)',
                boxShadow: q.isTarget
                  ? `0 12px 30px -8px ${q.color}40`
                  : '0 4px 12px rgba(0, 0, 0, 0.04)',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: 120,
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span
                    style={{
                      fontSize: 14,
                      fontWeight: 800,
                      color: q.color,
                      letterSpacing: '0.04em',
                    }}
                  >
                    {q.title}
                  </span>
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: 12,
                      backgroundColor: isDark ? 'rgba(255, 255, 255, 0.06)' : '#F4F4F5',
                      color: q.color,
                      border: `1px solid ${q.color}35`,
                    }}
                  >
                    {q.tag}
                  </span>
                </div>

                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 650,
                    color: isDark ? '#E4E4E7' : '#27272A',
                    marginBottom: 4,
                  }}
                >
                  {q.subtitle}
                </div>

                <div
                  style={{
                    fontSize: 11,
                    color: isDark ? '#A1A1AA' : '#64748B',
                    lineHeight: 1.4,
                  }}
                >
                  {q.desc}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

