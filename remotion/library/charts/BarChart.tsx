import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface BarChartDataPoint {
  label: string;
  value: number;
  formattedValue?: string;
  color?: string;
}

export interface BarChartProps {
  title?: string;
  subtitle?: string;
  data?: BarChartDataPoint[];
  orientation?: 'vertical' | 'horizontal';
  maxValue?: number;
  delayFrames?: number;
  width?: number | string;
  height?: number;
  theme?: 'dark' | 'light';
  accentColor?: string;
  showGrid?: boolean;
  showValues?: boolean;
  style?: React.CSSProperties;
}

const DEFAULT_BAR_DATA: BarChartDataPoint[] = [
  { label: 'Q1', value: 34000, formattedValue: '$34K', color: '#0066FF' },
  { label: 'Q2', value: 58000, formattedValue: '$58K', color: '#2563EB' },
  { label: 'Q3', value: 89000, formattedValue: '$89K', color: '#3B82F6' },
  { label: 'Q4', value: 124000, formattedValue: '$124K', color: '#10B981' },
];

export const BarChart: React.FC<BarChartProps> = ({
  title = 'Revenue Growth',
  subtitle = 'Quarterly performance breakdown',
  data = DEFAULT_BAR_DATA,
  orientation = 'vertical',
  maxValue,
  delayFrames = 5,
  width = '100%',
  height = 360,
  theme = 'dark',
  accentColor = '#0066FF',
  showGrid = true,
  showValues = true,
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const isDark = theme === 'dark';
  const bgColor = isDark ? '#111827' : '#FFFFFF';
  const textColor = isDark ? '#F8FAFC' : '#0F172A';
  const textMuted = isDark ? '#94A3B8' : '#64748B';
  const borderColor = isDark ? '#1E293B' : '#E2E8F0';
  const gridColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';

  const items = data && data.length > 0 ? data : DEFAULT_BAR_DATA;
  const calculatedMax = maxValue && maxValue > 0 ? maxValue : Math.max(...items.map((d) => d.value), 1) * 1.15;

  return (
    <div
      style={{
        width,
        height: '100%',
        backgroundColor: 'transparent',
        border: 'none',
        borderRadius: 0,
        padding: 0,
        boxShadow: 'none',
        boxSizing: 'border-box',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        ...style,
      }}
    >
      {/* Title Header */}
      {(title || subtitle) && (
        <div style={{ marginBottom: '28px' }}>
          {title && (
            <h3
              style={{
                margin: 0,
                fontSize: '32px',
                fontWeight: 900,
                color: textColor,
                letterSpacing: '-0.02em',
              }}
            >
              {title}
            </h3>
          )}
          {subtitle && (
            <p
              style={{
                margin: '6px 0 0 0',
                fontSize: '18px',
                fontWeight: 500,
                color: textMuted,
              }}
            >
              {subtitle}
            </p>
          )}
        </div>
      )}

      {/* Chart Canvas */}
      {orientation === 'vertical' ? (
        <div
          style={{
            position: 'relative',
            height: `${height}px`,
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            gap: '16px',
            paddingTop: '28px',
            paddingBottom: '28px',
            boxSizing: 'border-box',
          }}
        >
          {/* Background Grid Lines */}
          {showGrid && (
            <div
              style={{
                position: 'absolute',
                inset: '28px 0',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                pointerEvents: 'none',
              }}
            >
              {[0, 1, 2, 3].map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: '100%',
                    borderBottom: `1px dashed ${gridColor}`,
                  }}
                />
              ))}
            </div>
          )}

          {/* Vertical Bars */}
          {items.map((item, index) => {
            const barSpring = spring({
              frame: Math.max(0, frame - delayFrames - index * 4),
              fps,
              config: { damping: 14, stiffness: 95 },
            });

            const heightPercent = Math.min(100, (item.value / calculatedMax) * 100);
            const currentHeight = interpolate(barSpring, [0, 1], [0, heightPercent]);
            const barColor = item.color || accentColor;

            return (
              <div
                key={index}
                style={{
                  flex: 1,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  position: 'relative',
                  zIndex: 2,
                }}
              >
                {/* Value Label */}
                {showValues && (
                  <span
                    style={{
                      fontSize: '13px',
                      fontWeight: 800,
                      color: textColor,
                      marginBottom: '8px',
                      opacity: barSpring,
                      transform: `translateY(${(1 - barSpring) * 10}px)`,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {item.formattedValue || item.value.toLocaleString()}
                  </span>
                )}

                {/* Animated Bar Column */}
                <div
                  style={{
                    width: '100%',
                    maxWidth: '56px',
                    height: `${currentHeight}%`,
                    background: `linear-gradient(180deg, ${barColor} 0%, ${barColor}DD 100%)`,
                    borderRadius: '10px 10px 4px 4px',
                    boxShadow: `0 4px 16px ${barColor}44`,
                    transition: 'height 0.1s ease',
                  }}
                />

                {/* X-Axis Category Label */}
                <span
                  style={{
                    marginTop: '10px',
                    fontSize: '12px',
                    fontWeight: 600,
                    color: textMuted,
                    textAlign: 'center',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    maxWidth: '80px',
                  }}
                >
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>
      ) : (
        /* Horizontal Bars */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {items.map((item, index) => {
            const barSpring = spring({
              frame: Math.max(0, frame - delayFrames - index * 4),
              fps,
              config: { damping: 14, stiffness: 95 },
            });

            const widthPercent = Math.min(100, (item.value / calculatedMax) * 100);
            const currentWidth = interpolate(barSpring, [0, 1], [0, widthPercent]);
            const barColor = item.color || accentColor;

            return (
              <div key={index} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '13px',
                    fontWeight: 700,
                    color: textColor,
                  }}
                >
                  <span>{item.label}</span>
                  {showValues && (
                    <span style={{ color: barColor }}>
                      {item.formattedValue || item.value.toLocaleString()}
                    </span>
                  )}
                </div>

                <div
                  style={{
                    width: '100%',
                    height: '14px',
                    backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
                    borderRadius: '9999px',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      width: `${currentWidth}%`,
                      height: '100%',
                      background: `linear-gradient(90deg, ${barColor} 0%, ${barColor}DD 100%)`,
                      borderRadius: '9999px',
                      boxShadow: `0 0 12px ${barColor}66`,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
