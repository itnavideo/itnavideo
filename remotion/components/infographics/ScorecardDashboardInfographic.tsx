import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface ScorecardMetric {
  id: string;
  label: string;
  value: string | number;
  prefix?: string;
  suffix?: string;
  target?: string | number;
  trend?: string; // e.g. "+18.4%" or "-2.1%"
  trendDirection?: 'up' | 'down' | 'neutral';
  status?: 'EXCEEDED' | 'ON TRACK' | 'AT RISK' | 'OPTIMAL';
  color?: string;
  progressPercent?: number; // 0 to 100
}

export interface ScorecardDashboardInfographicProps {
  title?: string;
  subtitle?: string;
  metrics: ScorecardMetric[];
  isDark?: boolean;
  accentColor?: string;
  sceneFrame?: number;
}

/**
 * ScorecardDashboardInfographic
 * Executive KPI dashboard & performance scorecard infographic.
 * Features 4 animated metric cards with trend indicators, target bars, and status badges.
 */
export const ScorecardDashboardInfographic: React.FC<ScorecardDashboardInfographicProps> = ({
  title,
  subtitle,
  metrics,
  isDark = false,
  accentColor = '#EA580C',
  sceneFrame,
}) => {
  const currentFrame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const frame = sceneFrame !== undefined ? sceneFrame : currentFrame;

  const headerSpring = spring({ frame, fps, config: { damping: 14, stiffness: 100 } });

  const cardBg = isDark ? 'rgba(15, 23, 42, 0.94)' : '#FFFFFF';
  const cardBorder = isDark ? 'rgba(255, 255, 255, 0.11)' : 'rgba(30, 41, 59, 0.08)';
  const textPrimary = isDark ? '#F8FAFC' : '#141414';
  const textSecondary = isDark ? '#94A3B8' : '#2C2B29';

  const activeMetrics = metrics.slice(0, 4);

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        padding: '50px 80px',
        boxSizing: 'border-box',
      }}
    >
      {/* ── HEADER ── */}
      {(title || subtitle) && (
        <div
          style={{
            transform: `translateY(${(1 - headerSpring) * -20}px)`,
            opacity: headerSpring,
            marginBottom: '28px',
            zIndex: 10,
          }}
        >
          {title && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div
                style={{
                  width: '6px',
                  height: '32px',
                  backgroundColor: accentColor,
                  borderRadius: '3px',
                }}
              />
              <h2
                style={{
                  margin: 0,
                  fontSize: '36px',
                  fontFamily: 'Lora, "Playfair Display", Georgia, serif',
                  fontWeight: 700,
                  color: textPrimary,
                  letterSpacing: '-0.02em',
                }}
              >
                {title}
              </h2>
            </div>
          )}
          {subtitle && (
            <p
              style={{
                margin: '8px 0 0 20px',
                fontSize: '18px',
                fontWeight: 500,
                color: textSecondary,
              }}
            >
              {subtitle}
            </p>
          )}
        </div>
      )}

      {/* ── 2x2 SCORECARD GRID ── */}
      <div
        style={{
          flex: 1,
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gridTemplateRows: 'repeat(2, 1fr)',
          gap: '20px',
          width: '100%',
        }}
      >
        {activeMetrics.map((item, idx) => {
          const cardSpring = spring({
            frame: Math.max(0, frame - (8 + idx * 5)),
            fps,
            config: { damping: 14, stiffness: 120 },
          });

          const itemColor = item.color || (
            idx === 0 ? accentColor :
              idx === 1 ? '#3B82F6' :
                idx === 2 ? '#10B981' :
                  '#8B5CF6'
          );

          const isPositiveTrend =
            item.trendDirection === 'up' ||
            (typeof item.trend === 'string' && item.trend.startsWith('+')) ||
            (typeof item.trend === 'number' && item.trend > 0);
          const progressTarget = item.progressPercent ?? 75;
          const animatedProgress = interpolate(
            frame,
            [12 + idx * 5, 36 + idx * 5],
            [0, progressTarget],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
          );

          return (
            <div
              key={`metric-card-${idx}`}
              style={{
                transform: `scale(${cardSpring})`,
                opacity: cardSpring,
                borderRadius: '22px',
                backgroundColor: cardBg,
                border: `1.5px solid ${cardBorder}`,
                boxShadow: isDark
                  ? '0 16px 36px rgba(0,0,0,0.5)'
                  : '0 16px 36px rgba(180, 160, 140, 0.16)',
                padding: '24px 28px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              {/* Top Row: Label & Status Badge */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span
                  style={{
                    fontSize: '14px',
                    fontWeight: 700,
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                    color: textSecondary,
                  }}
                >
                  {item.label}
                </span>

                {item.status && (
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '4px 10px',
                      borderRadius: '999px',
                      fontSize: '11px',
                      fontWeight: 650,
                      letterSpacing: '0.05em',
                      textTransform: 'uppercase',
                      color: itemColor,
                      backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(30,41,59,0.05)',
                    }}
                  >
                    ● {item.status}
                  </span>
                )}
              </div>

              {/* Main Metric Value & Trend */}
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '14px', margin: '10px 0' }}>
                <div
                  style={{
                    fontSize: '48px',
                    fontWeight: 700,
                    color: textPrimary,
                    letterSpacing: '-0.03em',
                    lineHeight: 1.0,
                  }}
                >
                  {item.prefix || ''}{item.value}{item.suffix || ''}
                </div>

                {item.trend && (
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '4px 8px',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: 650,
                      color: isPositiveTrend ? '#10B981' : '#EF4444',
                      backgroundColor: isPositiveTrend
                        ? 'rgba(16, 185, 129, 0.12)'
                        : 'rgba(239, 68, 68, 0.12)',
                    }}
                  >
                    {isPositiveTrend ? '▲' : '▼'} {String(item.trend)}
                  </div>
                )}
              </div>

              {/* Bottom: Progress Bar towards Target */}
              <div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '12px',
                    fontWeight: 600,
                    color: textSecondary,
                    marginBottom: '6px',
                  }}
                >
                  <span>Progress to Target</span>
                  <span>{item.target ? `Target: ${item.target}` : `${Math.round(animatedProgress)}%`}</span>
                </div>

                <div
                  style={{
                    width: '100%',
                    height: '8px',
                    borderRadius: '4px',
                    backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(30,41,59,0.07)',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      width: `${animatedProgress}%`,
                      height: '100%',
                      borderRadius: '4px',
                      backgroundColor: itemColor,
                      transition: 'width 0.1s ease-out',
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

