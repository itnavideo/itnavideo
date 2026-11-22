import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface StairStep {
  level: string;
  metric: string;
  color?: string;
}

export interface StaircaseGrowthProps {
  headline?: string;
  steps?: StairStep[];
  accentColor?: string;
  delay?: number;
  width?: number | string;
  height?: number;
}

const DEFAULT_STEPS: StairStep[] = [
  { level: 'Level 1', metric: '10K Views', color: '#64748b' },
  { level: 'Level 2', metric: '100K Views', color: '#38bdf8' },
  { level: 'Level 3', metric: '1M Views', color: '#818cf8' },
  { level: 'Level 4', metric: '10M+ Domination', color: '#f59e0b' },
];

/**
 * StaircaseGrowth — Ascending staircase step-ladder progression visualizer.
 * Renders elevating tier platforms with rising metrics and victory summit flag.
 */
export function StaircaseGrowth({
  headline = 'STEP-BY-STEP REVENUE ASCENSION',
  steps = DEFAULT_STEPS,
  accentColor = '#f59e0b',
  delay = 0,
  width = 520,
  height = 360,
}: StaircaseGrowthProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = Math.max(0, frame - delay);

  const intro = spring({
    frame: t,
    fps,
    config: { damping: 14, stiffness: 85 },
  });

  return (
    <div
      style={{
        width,
        height,
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '24px 20px',
        boxSizing: 'border-box',
        background: '#09090b',
        borderRadius: 24,
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 20px 40px rgba(0,0,0,0.8)',
        opacity: intro,
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      {/* Title */}
      <div>
        <div style={{ fontSize: 10, fontWeight: 800, color: accentColor, letterSpacing: '0.12em' }}>
          PROGRESSION FRAMEWORK
        </div>
        <div style={{ fontSize: 18, fontWeight: 900, color: '#ffffff', marginTop: 2 }}>
          {headline}
        </div>
      </div>

      {/* Ascending Staircase Blocks */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
          gap: 12,
          height: 200,
        }}
      >
        {steps.map((st, i) => {
          const stepSpr = spring({
            frame: Math.max(0, t - i * 6),
            fps,
            config: { damping: 14, stiffness: 90 },
          });

          const stepH = (i + 1) * 45;
          const currentHeight = interpolate(stepSpr, [0, 1], [0, stepH]);

          return (
            <div
              key={st.level}
              style={{
                width: 90,
                height: currentHeight,
                borderRadius: '12px 12px 4px 4px',
                background: `linear-gradient(180deg, ${st.color || accentColor}44, #18181b)`,
                border: `2px solid ${st.color || accentColor}`,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '10px 8px',
                boxSizing: 'border-box',
                boxShadow: `0 8px 16px rgba(0,0,0,0.7), 0 0 12px ${st.color || accentColor}22`,
              }}
            >
              <div style={{ fontSize: 9, fontWeight: 800, color: st.color || accentColor }}>
                {st.level}
              </div>
              <div style={{ fontSize: 11, fontWeight: 900, color: '#ffffff', lineHeight: 1.15 }}>
                {st.metric}
              </div>
            </div>
          );
        })}
      </div>

      {/* Summit Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#64748b' }}>
        <span>FOUNDATION TO SUMMIT</span>
        <span style={{ color: '#22c55e', fontWeight: 700 }}>PEAK MASTERY ACHIEVED</span>
      </div>
    </div>
  );
}
