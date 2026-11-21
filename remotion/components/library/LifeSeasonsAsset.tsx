import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface LifeSeasonItem {
  id: string;
  seasonName: string;
  tagline: string;
  primaryMetric: string;
  color: string;
  isActive?: boolean;
}

export interface LifeSeasonsAssetProps {
  sceneFrame?: number;
  isDark?: boolean;
  scale?: number;
  startDelayFrames?: number;
  activeSeasonId?: string;
}

/**
 * LifeSeasonsAsset
 * The "Seasons of Life" Focus Framework (Building, Health/Recovery, Family/Presence).
 * Learned from Ali Abdaal's "Brutally Honest Advice About Productivity" (YouTube: BNRfzI6E1Es).
 */
export const LifeSeasonsAsset: React.FC<LifeSeasonsAssetProps> = ({
  sceneFrame,
  isDark = false,
  scale = 1.0,
  startDelayFrames = 5,
  activeSeasonId = 'build',
}) => {
  const currentFrame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const activeFrame = (sceneFrame !== undefined ? sceneFrame : currentFrame) - startDelayFrames;
  const frame = Math.max(0, activeFrame);

  const seasons: LifeSeasonItem[] = [
    {
      id: 'build',
      seasonName: '1. Season of Building',
      tagline: 'Deep work sprints • Asymmetric business growth • Revenue engine',
      primaryMetric: 'High Output Mode',
      color: '#EA580C',
      isActive: activeSeasonId === 'build',
    },
    {
      id: 'health',
      seasonName: '2. Season of Recovery',
      tagline: 'Deep restorative sleep • Nervous system reset • Longevity & gym',
      primaryMetric: 'Recharge & Heal',
      color: '#059669',
      isActive: activeSeasonId === 'health',
    },
    {
      id: 'family',
      seasonName: '3. Season of Presence',
      tagline: 'Family dinners • Deep friendships • Travel & slow living',
      primaryMetric: 'Protected Time',
      color: '#0284C7',
      isActive: activeSeasonId === 'family',
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
            The Seasons of Life Framework
          </h3>
          <span style={{ fontSize: 12, color: isDark ? '#A1A1AA' : '#71717A' }}>
            Seasonal Priority Model • Choose One Dominant Focus
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
          Never run all 3 at once!
        </div>
      </div>

      {/* 3 Seasons Vertical Stack */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {seasons.map((season, idx) => {
          const rowSpring = spring({
            frame: Math.max(0, frame - idx * 5),
            fps,
            config: { damping: 14, stiffness: 130 },
          });

          return (
            <div
              key={season.id}
              style={{
                opacity: rowSpring,
                transform: `translateX(${interpolate(rowSpring, [0, 1], [-16, 0])}px)`,
                padding: '14px 18px',
                borderRadius: 14,
                backgroundColor: isDark ? 'rgba(24, 24, 27, 0.90)' : '#FFFFFF',
                border: season.isActive
                  ? `2px solid ${season.color}`
                  : isDark
                  ? '1px solid rgba(255, 255, 255, 0.08)'
                  : '1px solid rgba(0, 0, 0, 0.07)',
                boxShadow: season.isActive
                  ? `0 10px 30px -8px ${season.color}35`
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
                    color: season.color,
                    fontSize: 14,
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {idx + 1}
                </div>

                <div>
                  <div
                    style={{
                      fontSize: 15,
                      fontWeight: 700,
                      color: isDark ? '#FFFFFF' : '#18181B',
                      marginBottom: 2,
                    }}
                  >
                    {season.seasonName}
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: isDark ? '#A1A1AA' : '#64748B',
                    }}
                  >
                    {season.tagline}
                  </div>
                </div>
              </div>

              <div
                style={{
                  padding: '4px 12px',
                  borderRadius: 20,
                  backgroundColor: season.isActive
                    ? season.color
                    : isDark
                    ? 'rgba(255, 255, 255, 0.06)'
                    : '#F4F4F5',
                  color: season.isActive ? '#FFFFFF' : season.color,
                  fontSize: 11,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                }}
              >
                {season.isActive ? '★ ACTIVE FOCUS' : season.primaryMetric}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

