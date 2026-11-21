import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface ProblemAuditItem {
  id: string;
  problem: string;
  clientImpact: string;
  solvableFee: string;
  isHighValue?: boolean;
}

export interface ProblemAuditCardAssetProps {
  sceneFrame?: number;
  isDark?: boolean;
  scale?: number;
  startDelayFrames?: number;
}

/**
 * ProblemAuditCardAsset
 * Notion/Apple Notes-style "Problems List" card.
 * Learned from Ali Abdaal's "Don't Sell Skills, Sell Solutions to Expensive Problems" concept.
 */
export const ProblemAuditCardAsset: React.FC<ProblemAuditCardAssetProps> = ({
  sceneFrame,
  isDark = false,
  scale = 1.0,
  startDelayFrames = 8,
}) => {
  const currentFrame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const activeFrame = (sceneFrame !== undefined ? sceneFrame : currentFrame) - startDelayFrames;
  const frame = Math.max(0, activeFrame);

  const problems: ProblemAuditItem[] = [
    {
      id: 'p1',
      problem: 'Leaking $40k/yr on unoptimized Google Ad spend',
      clientImpact: 'High Friction • Wasted Budget',
      solvableFee: '$4,000 Audit & Fix',
      isHighValue: true,
    },
    {
      id: 'p2',
      problem: 'Losing 20 hrs/week manually copying client data',
      clientImpact: 'Operational Bottleneck',
      solvableFee: '$2,500 Automation Script',
      isHighValue: true,
    },
    {
      id: 'p3',
      problem: 'YouTube videos having < 30% retention at 30 seconds',
      clientImpact: 'Channel Growth Stalled',
      solvableFee: '$3,000 Hook Optimization',
      isHighValue: true,
    },
  ];

  const cardSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 120 },
  });

  return (
    <div
      style={{
        transform: `scale(${scale})`,
        transformOrigin: 'center center',
        width: '100%',
        maxWidth: 760,
        margin: '0 auto',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      {/* Container Card */}
      <div
        style={{
          opacity: cardSpring,
          transform: `translateY(${interpolate(cardSpring, [0, 1], [16, 0])}px)`,
          backgroundColor: isDark ? 'rgba(24, 24, 27, 0.92)' : '#FFFFFF',
          borderRadius: 18,
          border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.08)',
          boxShadow: isDark
            ? '0 16px 40px -10px rgba(0, 0, 0, 0.6)'
            : '0 16px 40px -10px rgba(0, 0, 0, 0.08)',
          padding: 24,
        }}
      >
        {/* Document Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.06)',
            paddingBottom: 14,
            marginBottom: 16,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 20 }}>📝</span>
            <div>
              <div
                style={{
                  fontSize: 16,
                  fontWeight: 700,
                  fontFamily: 'Lora, Georgia, serif',
                  color: isDark ? '#FAFAFA' : '#18181B',
                }}
              >
                High-Value Problems List.md
              </div>
              <div style={{ fontSize: 12, color: isDark ? '#A1A1AA' : '#71717A' }}>
                Rule: "Sell the $5,000 solution, never the $30/hr chore"
              </div>
            </div>
          </div>

          <div
            style={{
              padding: '3px 10px',
              borderRadius: 6,
              backgroundColor: isDark ? 'rgba(16, 185, 129, 0.15)' : 'rgba(16, 185, 129, 0.1)',
              color: '#059669',
              fontSize: 11,
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
            }}
          >
            Client ROI Focus
          </div>
        </div>

        {/* Problems Rows */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {problems.map((item, idx) => {
            const rowSpring = spring({
              frame: Math.max(0, frame - 10 - idx * 6),
              fps,
              config: { damping: 14, stiffness: 130 },
            });

            return (
              <div
                key={item.id}
                style={{
                  opacity: rowSpring,
                  transform: `translateX(${interpolate(rowSpring, [0, 1], [-16, 0])}px)`,
                  padding: '12px 14px',
                  borderRadius: 10,
                  backgroundColor: isDark ? 'rgba(255, 255, 255, 0.03)' : '#F8FAFC',
                  border: isDark ? '1px solid rgba(255, 255, 255, 0.05)' : '1px solid rgba(0, 0, 0, 0.04)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 12,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div
                    style={{
                      width: 18,
                      height: 18,
                      borderRadius: 4,
                      border: '1.5px solid #EA580C',
                      backgroundColor: 'rgba(234, 88, 12, 0.12)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#EA580C" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>

                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: isDark ? '#E4E4E7' : '#27272A' }}>
                      {item.problem}
                    </div>
                    <div style={{ fontSize: 11, color: isDark ? '#71717A' : '#94A3B8' }}>
                      Impact: {item.clientImpact}
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    padding: '4px 10px',
                    borderRadius: 6,
                    backgroundColor: isDark ? 'rgba(217, 119, 6, 0.18)' : '#FEF3C7',
                    border: '1px solid rgba(217, 119, 6, 0.3)',
                    color: '#D97706',
                    fontSize: 12,
                    fontWeight: 700,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {item.solvableFee}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

