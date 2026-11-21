import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface MilestoneItem {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  badge: string;
  accentColor: string;
  icon: string;
  actionRule: string;
}

export interface FinancialMilestonesAssetProps {
  sceneFrame?: number;
  isDark?: boolean;
  scale?: number;
  startDelayFrames?: number;
}

/**
 * FinancialMilestonesAsset
 * The 5 True Money Milestones to Financial Freedom (Sharran Srivatsaa Framework)
 * Milestone 1: Positive Margin (Active Income > Expenses)
 * Milestone 2: Money Distribution System (Multi-Bucket Architecture)
 * Milestone 3: Strategic Asset Location (Liquidity & Tax Optimization)
 * Milestone 4: Active Cash Management (Every Dollar Has a Job)
 * Milestone 5: Wealth Asset Ownership (Passive Cashflow > Lifestyle Cost)
 * Learned from Sharran Srivatsaa (YouTube: aetr9LovwE4).
 */
export const FinancialMilestonesAsset: React.FC<FinancialMilestonesAssetProps> = ({
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

  const milestones: MilestoneItem[] = [
    {
      id: 'margin',
      number: '01',
      title: 'The Positive Gap',
      subtitle: 'Active Income > Expenses',
      badge: 'MARGIN GAP',
      accentColor: '#0284C7',
      icon: '📈',
      actionRule: 'Keep lifestyle expenses flat while skill-stacking doubles income.',
    },
    {
      id: 'distribution',
      number: '02',
      title: 'Distribution System',
      subtitle: 'Multi-Bucket Accounts',
      badge: 'PIPELINE',
      accentColor: '#6366F1',
      icon: '🏛️',
      actionRule: 'Never run life from 1 checking account. Automate splits on payday.',
    },
    {
      id: 'asset-location',
      number: '03',
      title: 'Asset Location',
      subtitle: 'Tax & Liquidity Buckets',
      badge: 'STRUCTURE',
      accentColor: '#059669',
      icon: '⚖️',
      actionRule: 'Know where money lives: Tax-sheltered vs liquid vs safe capital.',
    },
    {
      id: 'cash-mgmt',
      number: '04',
      title: 'Cash Productivity',
      subtitle: 'Give Every Dollar a Job',
      badge: 'ZERO IDLE CASH',
      accentColor: '#D97706',
      icon: '🎯',
      actionRule: 'Zero cash melting to inflation; deploy into yield & opportunity reserves.',
    },
    {
      id: 'wealth-assets',
      number: '05',
      title: 'Wealth Assets',
      subtitle: 'Passive > Living Cost',
      badge: 'TRUE FREEDOM',
      accentColor: '#8B5CF6',
      icon: '👑',
      actionRule: 'Cashflow from equity, businesses & index baskets pays for 100% of life.',
    },
  ];

  return (
    <div
      style={{
        transform: `scale(${scale})`,
        transformOrigin: 'center center',
        width: '100%',
        maxWidth: 880,
        margin: '0 auto',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      {/* Title & Callout Header */}
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
              fontSize: 20,
              fontWeight: 700,
              fontFamily: 'Lora, Georgia, serif',
              color: isDark ? '#FAFAFA' : '#141414',
            }}
          >
            The 5 Financial Freedom Milestones
          </h3>
          <span style={{ fontSize: 13, color: isDark ? '#A1A1AA' : '#71717A' }}>
            Sharran Srivatsaa Framework: Moving Beyond Society&apos;s Arbitrary Benchmarks
          </span>
        </div>

        <div
          style={{
            fontFamily: 'Caveat, cursive',
            fontSize: 20,
            fontWeight: 700,
            color: '#EA580C',
            transform: 'rotate(-3deg)',
            backgroundColor: isDark ? 'rgba(234, 88, 12, 0.15)' : '#FFF7ED',
            padding: '4px 12px',
            borderRadius: 8,
            border: '1px dashed #EA580C',
          }}
        >
          Never run life from one account!
        </div>
      </div>

      {/* 5 Milestone Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: 10,
          marginBottom: 14,
        }}
      >
        {milestones.map((ms, idx) => {
          const cardSpring = spring({
            frame: Math.max(0, frame - idx * 4),
            fps,
            config: { damping: 14, stiffness: 130 },
          });

          return (
            <div
              key={ms.id}
              style={{
                opacity: cardSpring,
                transform: `translateY(${interpolate(cardSpring, [0, 1], [16, 0])}px)`,
                borderRadius: 14,
                backgroundColor: isDark ? 'rgba(24, 24, 27, 0.85)' : '#FFFFFF',
                border: isDark
                  ? `1px solid ${ms.accentColor}33`
                  : `1px solid ${ms.accentColor}25`,
                boxShadow: isDark
                  ? '0 6px 18px rgba(0, 0, 0, 0.35)'
                  : '0 6px 18px rgba(0, 0, 0, 0.04)',
                padding: '12px 10px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Top Accent Strip */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 3,
                  backgroundColor: ms.accentColor,
                }}
              />

              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 800,
                      fontFamily: 'Inter, monospace',
                      color: ms.accentColor,
                      backgroundColor: isDark ? `${ms.accentColor}22` : `${ms.accentColor}12`,
                      padding: '2px 5px',
                      borderRadius: 4,
                    }}
                  >
                    STAGE {ms.number}
                  </span>
                  <span style={{ fontSize: 13 }}>{ms.icon}</span>
                </div>

                <div
                  style={{
                    fontSize: 8.5,
                    fontWeight: 700,
                    letterSpacing: '0.04em',
                    color: ms.accentColor,
                    marginBottom: 4,
                    textTransform: 'uppercase',
                  }}
                >
                  {ms.badge}
                </div>

                <h4
                  style={{
                    margin: '0 0 4px 0',
                    fontSize: 13,
                    fontWeight: 700,
                    color: isDark ? '#FAFAFA' : '#18181B',
                    fontFamily: 'Lora, Georgia, serif',
                    lineHeight: 1.2,
                  }}
                >
                  {ms.title}
                </h4>

                <div
                  style={{
                    fontSize: 10.5,
                    fontWeight: 600,
                    color: ms.accentColor,
                    marginBottom: 6,
                    lineHeight: 1.25,
                  }}
                >
                  {ms.subtitle}
                </div>

                <p style={{ margin: 0, fontSize: 10.5, color: isDark ? '#A1A1AA' : '#64748B', lineHeight: 1.35 }}>
                  {ms.actionRule}
                </p>
              </div>

              <div
                style={{
                  marginTop: 8,
                  paddingTop: 6,
                  borderTop: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #F1F5F9',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  fontSize: 9.5,
                  color: ms.accentColor,
                  fontWeight: 600,
                }}
              >
                <span>✓</span>
                <span>Milestone Gate</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Action Rule Callout Banner */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 14px',
          borderRadius: 10,
          backgroundColor: isDark ? 'rgba(139, 92, 246, 0.12)' : '#F5F3FF',
          border: '1px solid rgba(139, 92, 246, 0.25)',
        }}
      >
        <span style={{ fontSize: 11.5, fontWeight: 700, color: '#8B5CF6' }}>
          ★ The Cashflow Independence Formula:
        </span>
        <span style={{ fontSize: 11, color: isDark ? '#E4E4E7' : '#475569' }}>
          When passive income from assets covers baseline expenses, you work 100% by choice.
        </span>
      </div>
    </div>
  );
};
