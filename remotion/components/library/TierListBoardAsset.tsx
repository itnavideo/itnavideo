import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface TierListItem {
  id: string;
  name: string;
  iconText?: string;
  badge?: string;
}

export interface TierRowData {
  tier: 'S' | 'A' | 'B' | 'C' | 'D';
  label: string;
  color: string;
  bgColor: string;
  items: TierListItem[];
}

export interface TierListBoardAssetProps {
  sceneFrame?: number;
  isDark?: boolean;
  scale?: number;
  startDelayFrames?: number;
  currentlyRankingItem?: string;
  targetTier?: 'S' | 'A' | 'B' | 'C' | 'D';
}

/**
 * TierListBoardAsset
 * Clean Minimalist S/A/B/C/D Tier List Board.
 * Learned from Ali Abdaal's "I Ranked Every Productivity Tool From Worst to Best" (YouTube: uRCskQbL1KY).
 */
export const TierListBoardAsset: React.FC<TierListBoardAssetProps> = ({
  sceneFrame,
  isDark = false,
  scale = 1.0,
  startDelayFrames = 5,
  currentlyRankingItem = 'Notion',
  targetTier = 'S',
}) => {
  const currentFrame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const activeFrame = (sceneFrame !== undefined ? sceneFrame : currentFrame) - startDelayFrames;
  const frame = Math.max(0, activeFrame);

  const tiers: TierRowData[] = [
    {
      tier: 'S',
      label: 'LifeOS Essential',
      color: '#EF4444',
      bgColor: 'rgba(239, 68, 68, 0.12)',
      items: [
        { id: 'gcal', name: 'Google Calendar' },
        { id: 'notion', name: 'Notion' },
        { id: 'journal', name: 'Paper Journal' },
      ],
    },
    {
      tier: 'A',
      label: 'High Leverage',
      color: '#F59E0B',
      bgColor: 'rgba(245, 158, 11, 0.12)',
      items: [
        { id: 'claude', name: 'Claude / ChatGPT' },
        { id: 'readwise', name: 'Readwise' },
        { id: 'superhuman', name: 'Superhuman' },
      ],
    },
    {
      tier: 'B',
      label: 'Solid Utility',
      color: '#10B981',
      bgColor: 'rgba(16, 185, 129, 0.12)',
      items: [
        { id: 'zapier', name: 'Zapier' },
        { id: 'apple-notes', name: 'Apple Notes' },
        { id: 'opal', name: 'Opal' },
      ],
    },
    {
      tier: 'C',
      label: 'Nice to Have',
      color: '#0284C7',
      bgColor: 'rgba(2, 132, 199, 0.12)',
      items: [
        { id: 'obsidian', name: 'Obsidian' },
        { id: 'voicepal', name: 'Voicepal' },
      ],
    },
    {
      tier: 'D',
      label: 'Overkill / Friction',
      color: '#64748B',
      bgColor: 'rgba(100, 116, 139, 0.12)',
      items: [
        { id: 'todo-apps', name: 'Complex To-Do Apps' },
        { id: 'slack', name: 'Slack Always-On' },
      ],
    },
  ];

  const boardSpring = spring({
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
      {/* Board Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 14,
          opacity: boardSpring,
          transform: `translateY(${interpolate(boardSpring, [0, 1], [14, 0])}px)`,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              padding: '4px 10px',
              borderRadius: 8,
              backgroundColor: '#EA580C',
              color: '#FFFFFF',
              fontSize: 12,
              fontWeight: 800,
              letterSpacing: '0.04em',
            }}
          >
            TIER RANKING
          </div>
          <h3
            style={{
              margin: 0,
              fontSize: 17,
              fontWeight: 700,
              fontFamily: 'Lora, Georgia, serif',
              color: isDark ? '#FAFAFA' : '#141414',
            }}
          >
            Productivity Tool Hierarchy
          </h3>
        </div>

        {currentlyRankingItem && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 12,
              fontWeight: 600,
              color: isDark ? '#A1A1AA' : '#71717A',
            }}
          >
            <span>Ranking:</span>
            <span
              style={{
                color: '#EA580C',
                fontWeight: 700,
                backgroundColor: isDark ? 'rgba(234, 88, 12, 0.15)' : '#FFF7ED',
                padding: '2px 8px',
                borderRadius: 6,
              }}
            >
              {currentlyRankingItem} $\rightarrow$ Tier {targetTier}
            </span>
          </div>
        )}
      </div>

      {/* Tier Rows Grid */}
      <div
        style={{
          opacity: boardSpring,
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
          backgroundColor: isDark ? 'rgba(24, 24, 27, 0.85)' : '#FFFFFF',
          padding: 12,
          borderRadius: 16,
          border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.08)',
          boxShadow: isDark
            ? '0 16px 40px -10px rgba(0, 0, 0, 0.6)'
            : '0 16px 40px -10px rgba(0, 0, 0, 0.06)',
        }}
      >
        {tiers.map((t, idx) => {
          const rowSpring = spring({
            frame: Math.max(0, frame - idx * 4),
            fps,
            config: { damping: 14, stiffness: 130 },
          });

          return (
            <div
              key={t.tier}
              style={{
                display: 'flex',
                alignItems: 'center',
                minHeight: 52,
                borderRadius: 10,
                backgroundColor: isDark ? 'rgba(255, 255, 255, 0.03)' : '#F8FAFC',
                border: isDark ? '1px solid rgba(255, 255, 255, 0.05)' : '1px solid rgba(0, 0, 0, 0.04)',
                overflow: 'hidden',
                opacity: rowSpring,
                transform: `translateX(${interpolate(rowSpring, [0, 1], [-14, 0])}px)`,
              }}
            >
              {/* Left Tier Badge */}
              <div
                style={{
                  width: 58,
                  alignSelf: 'stretch',
                  backgroundColor: t.color,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  fontWeight: 900,
                  fontSize: 20,
                  fontFamily: 'Inter, system-ui, sans-serif',
                  flexShrink: 0,
                }}
              >
                {t.tier}
              </div>

              {/* Items Area */}
              <div
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: 8,
                  padding: '6px 12px',
                }}
              >
                {t.items.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      padding: '4px 10px',
                      borderRadius: 6,
                      backgroundColor: isDark ? 'rgba(255, 255, 255, 0.06)' : '#FFFFFF',
                      border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.08)',
                      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.04)',
                      fontSize: 12,
                      fontWeight: 600,
                      color: isDark ? '#E4E4E7' : '#27272A',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {item.name}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

