import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { resolveTheme, ThemeMode } from './themeTokens';

// ─── ANIMATED BAR CHART ────────────────────────────────────────────────────────

export interface BarChartItem {
  label: string;
  value: number;
  formattedValue?: string;
  color?: string;
}

export interface AnimatedBarChartProps {
  /** Title above chart (optional) */
  title?: string;
  /** Explicit array of data items (must not be empty) */
  items: BarChartItem[];
  /** Max baseline value for scaling (calculated automatically if omitted) */
  maxValue?: number;
  /** Chart orientation */
  orientation?: 'horizontal' | 'vertical';
  /** Delay in frames before bars animate */
  delayFrames?: number;
  /** Theme mode preference */
  theme?: ThemeMode;
  /** Custom canvas background to resolve contrast */
  canvasBgColor?: string;
  width?: number | string;
  style?: React.CSSProperties;
  className?: string;
}

/**
 * Animated SVG / CSS Bar Chart.
 * Strict Truthfulness Guard: Renders ONLY when valid, non-empty numerical data is provided.
 */
export const AnimatedBarChart: React.FC<AnimatedBarChartProps> = ({
  title,
  items,
  maxValue,
  orientation = 'horizontal',
  delayFrames = 0,
  theme = 'auto',
  canvasBgColor,
  width = '100%',
  style = {},
  className = '',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 1. Strict Validation: Do not render if items missing or empty
  if (!items || !Array.isArray(items) || items.length === 0) {
    return null;
  }

  // Filter out items with NaN or invalid negative values
  const validItems = items.filter(
    (item) => typeof item.value === 'number' && !isNaN(item.value) && item.value >= 0
  );
  if (validItems.length === 0) {
    return null;
  }

  const palette = resolveTheme(theme, canvasBgColor);
  const calculatedMax =
    maxValue && maxValue > 0
      ? maxValue
      : Math.max(...validItems.map((i) => i.value), 1);

  return (
    <div
      className={className}
      style={{
        width,
        backgroundColor: palette.surface,
        border: `1px solid ${palette.border}`,
        borderRadius: '16px',
        padding: '24px 28px',
        boxShadow: palette.shadow,
        ...style,
      }}
    >
      {title && (
        <div
          style={{
            fontSize: '15px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            color: palette.textMuted,
            marginBottom: '20px',
          }}
        >
          {title}
        </div>
      )}

      {orientation === 'horizontal' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {validItems.map((item, idx) => {
            const itemDelay = delayFrames + idx * 4;
            const barSpring = spring({
              frame: Math.max(0, frame - itemDelay),
              fps,
              config: { damping: 14, stiffness: 90 },
            });

            const targetWidthPct = Math.min(100, (item.value / calculatedMax) * 100);
            const currentWidth = interpolate(barSpring, [0, 1], [0, targetWidthPct]);
            const barColor = item.color || (idx === 0 ? palette.accent : palette.borderStrong);

            return (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '14px',
                    fontWeight: 600,
                    color: palette.textPrimary,
                  }}
                >
                  <span>{item.label}</span>
                  <span style={{ fontWeight: 700 }}>
                    {item.formattedValue || item.value.toLocaleString()}
                  </span>
                </div>
                <div
                  style={{
                    width: '100%',
                    height: '10px',
                    backgroundColor: palette.mode === 'light' ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.08)',
                    borderRadius: '9999px',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      width: `${currentWidth}%`,
                      height: '100%',
                      backgroundColor: barColor,
                      borderRadius: '9999px',
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-around',
            height: '160px',
            gap: '12px',
            paddingTop: '20px',
          }}
        >
          {validItems.map((item, idx) => {
            const itemDelay = delayFrames + idx * 4;
            const barSpring = spring({
              frame: Math.max(0, frame - itemDelay),
              fps,
              config: { damping: 14, stiffness: 90 },
            });

            const targetHeightPct = Math.min(100, (item.value / calculatedMax) * 100);
            const currentHeight = interpolate(barSpring, [0, 1], [0, targetHeightPct]);
            const barColor = item.color || (idx === 0 ? palette.accent : palette.borderStrong);

            return (
              <div
                key={idx}
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  height: '100%',
                  justifyContent: 'flex-end',
                  gap: '8px',
                }}
              >
                <span
                  style={{
                    fontSize: '12px',
                    fontWeight: 700,
                    color: palette.textPrimary,
                  }}
                >
                  {item.formattedValue || item.value}
                </span>
                <div
                  style={{
                    width: '100%',
                    maxWidth: '48px',
                    height: `${currentHeight}%`,
                    backgroundColor: barColor,
                    borderRadius: '8px 8px 0 0',
                  }}
                />
                <span
                  style={{
                    fontSize: '12px',
                    fontWeight: 500,
                    color: palette.textMuted,
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
      )}
    </div>
  );
};

// ─── DONUT BREAKDOWN CHART ─────────────────────────────────────────────────────

export interface DonutSlice {
  label: string;
  value: number;
  color?: string;
}

export interface DonutBreakdownProps {
  /** Array of slices (must sum to > 0) */
  slices: DonutSlice[];
  /** Center headline (e.g. "80%") */
  centerValue?: string;
  /** Center label (e.g. "Pareto Principle") */
  centerLabel?: string;
  /** Delay in frames before arc animates */
  delayFrames?: number;
  /** Theme preference */
  theme?: ThemeMode;
  canvasBgColor?: string;
  size?: number;
  style?: React.CSSProperties;
  className?: string;
}

/**
 * Animated SVG Donut Chart for proportional data (e.g. 80/20 rule, 3-slice distribution).
 * Strict Truthfulness Guard: Renders only when valid numbers summing to > 0 are passed.
 */
export const DonutBreakdown: React.FC<DonutBreakdownProps> = ({
  slices,
  centerValue,
  centerLabel,
  delayFrames = 0,
  theme = 'auto',
  canvasBgColor,
  size = 200,
  style = {},
  className = '',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (!slices || !Array.isArray(slices) || slices.length === 0) {
    return null;
  }

  const validSlices = slices.filter((s) => typeof s.value === 'number' && !isNaN(s.value) && s.value > 0);
  const total = validSlices.reduce((acc, s) => acc + s.value, 0);
  if (total <= 0) {
    return null;
  }

  const palette = resolveTheme(theme, canvasBgColor);
  const radius = size * 0.38;
  const circumference = 2 * Math.PI * radius;

  const arcSpring = spring({
    frame: Math.max(0, frame - delayFrames),
    fps,
    config: { damping: 16, stiffness: 70 },
  });

  const defaultColors = [palette.accent, '#38BDF8', '#10B981', '#F59E0B', '#A855F7'];

  let accumulatedPercent = 0;

  return (
    <div
      className={className}
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '20px',
        backgroundColor: palette.surface,
        border: `1px solid ${palette.border}`,
        borderRadius: '20px',
        boxShadow: palette.shadow,
        ...style,
      }}
    >
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)' }}>
          {/* Base track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={palette.mode === 'light' ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.08)'}
            strokeWidth={size * 0.12}
          />

          {/* Animated Slices */}
          {validSlices.map((slice, idx) => {
            const slicePercent = slice.value / total;
            const strokeDasharray = `${circumference * slicePercent * arcSpring} ${circumference}`;
            const strokeDashoffset = -circumference * accumulatedPercent * arcSpring;
            accumulatedPercent += slicePercent;
            const sliceColor = slice.color || defaultColors[idx % defaultColors.length];

            return (
              <circle
                key={idx}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={sliceColor}
                strokeWidth={size * 0.12}
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
              />
            );
          })}
        </svg>

        {/* Center Text */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '10px',
          }}
        >
          {centerValue && (
            <div
              style={{
                fontSize: `${size * 0.16}px`,
                fontWeight: 800,
                color: palette.textPrimary,
                lineHeight: 1.1,
              }}
            >
              {centerValue}
            </div>
          )}
          {centerLabel && (
            <div
              style={{
                fontSize: `${size * 0.065}px`,
                fontWeight: 600,
                color: palette.textMuted,
                marginTop: '4px',
                maxWidth: `${size * 0.6}px`,
              }}
            >
              {centerLabel}
            </div>
          )}
        </div>
      </div>

      {/* Legend */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '12px',
          marginTop: '16px',
          justifyContent: 'center',
        }}
      >
        {validSlices.map((slice, idx) => (
          <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: palette.textMuted }}>
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: slice.color || defaultColors[idx % defaultColors.length],
              }}
            />
            <span>{slice.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
