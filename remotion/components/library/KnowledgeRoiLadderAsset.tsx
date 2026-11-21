import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface KnowledgeTier {
  level: number;
  title: string;
  costRange: string;
  description: string;
  roiTag: string;
  color: string;
  isHighValue?: boolean;
}

export interface KnowledgeRoiLadderAssetProps {
  sceneFrame?: number;
  isDark?: boolean;
  scale?: number;
  startDelayFrames?: number;
  activeTierLevel?: number;
}

/**
 * KnowledgeRoiLadderAsset
 * The 3 Levels of Information & Knowledge ROI (Free Info -> Courses -> High-Level Mentorship).
 * Learned from Ali Abdaal's "The Business Advice You Won't Find on YouTube" (YouTube: dKsp8aXrwJw).
 */
export const KnowledgeRoiLadderAsset: React.FC<KnowledgeRoiLadderAssetProps> = ({
  sceneFrame,
  isDark = false,
  scale = 1.0,
  startDelayFrames = 5,
  activeTierLevel = 3,
}) => {
  const currentFrame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const activeFrame = (sceneFrame !== undefined ? sceneFrame : currentFrame) - startDelayFrames;
  const frame = Math.max(0, activeFrame);

  const tiers: KnowledgeTier[] = [
    {
      level: 1,
      title: 'Free Public Content (YouTube & AI)',
      costRange: '$0 Investment',
      description: 'Broad tactics • High noise • Zero accountability or personalized feedback',
      roiTag: 'Baseline Theory',
      color: '#64748B',
      isHighValue: false,
    },
    {
      level: 2,
      title: 'Curated Books & Self-Paced Courses',
      costRange: '$100 – $1,000',
      description: 'Structured roadmaps • Templates • Self-paced without tailored blind-spot diagnosis',
      roiTag: 'Structured Path',
      color: '#0284C7',
      isHighValue: false,
    },
    {
      level: 3,
      title: 'Private Masterminds & High-Level Mentorship',
      costRange: '$10k – $100k+ Investment',
      description: 'Blind-spot elimination • Peer proximity • Compresses 5 years of mistakes into 6 months',
      roiTag: '⚡ 10x Speed & Proximity',
      color: '#D97706',
      isHighValue: true,
    },
  ];

  const headerSpring = spring({
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
            The Knowledge ROI Ladder
          </h3>
          <span style={{ fontSize: 12, color: isDark ? '#A1A1AA' : '#71717A' }}>
            Why Mentorship &amp; Peer Proximity Beat Free Information
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
          Pay for speed, not information!
        </div>
      </div>

      {/* 3 Tiers Vertical Stack */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {tiers.map((tier, idx) => {
          const rowSpring = spring({
            frame: Math.max(0, frame - idx * 5),
            fps,
            config: { damping: 14, stiffness: 130 },
          });

          const isSelected = activeTierLevel === tier.level;

          return (
            <div
              key={tier.level}
              style={{
                opacity: rowSpring,
                transform: `translateX(${interpolate(rowSpring, [0, 1], [-16, 0])}px)`,
                padding: '14px 18px',
                borderRadius: 14,
                backgroundColor: isDark ? 'rgba(24, 24, 27, 0.90)' : '#FFFFFF',
                border: isSelected
                  ? `2px solid ${tier.color}`
                  : isDark
                  ? '1px solid rgba(255, 255, 255, 0.08)'
                  : '1px solid rgba(0, 0, 0, 0.07)',
                boxShadow: isSelected
                  ? `0 10px 30px -8px ${tier.color}35`
                  : '0 4px 12px rgba(0, 0, 0, 0.04)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                position: 'relative',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 10,
                    backgroundColor: isDark ? 'rgba(255, 255, 255, 0.06)' : '#F4F4F5',
                    color: tier.color,
                    fontSize: 14,
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {tier.level}
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                    <span
                      style={{
                        fontSize: 15,
                        fontWeight: 700,
                        color: isDark ? '#FFFFFF' : '#18181B',
                      }}
                    >
                      {tier.title}
                    </span>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 650,
                        color: tier.color,
                        backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : '#F4F4F5',
                        padding: '1px 6px',
                        borderRadius: 4,
                      }}
                    >
                      {tier.costRange}
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: isDark ? '#A1A1AA' : '#64748B',
                    }}
                  >
                    {tier.description}
                  </div>
                </div>
              </div>

              <div
                style={{
                  padding: '4px 12px',
                  borderRadius: 20,
                  backgroundColor: isSelected
                    ? tier.color
                    : isDark
                    ? 'rgba(255, 255, 255, 0.06)'
                    : '#F4F4F5',
                  color: isSelected ? '#FFFFFF' : tier.color,
                  fontSize: 11,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  whiteSpace: 'nowrap',
                }}
              >
                {tier.roiTag}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

