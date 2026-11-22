import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface PowerBIKPICardVisualProps {
  cardTitle?: string;
  primaryValue?: string;
  variancePercentage?: string;
  targetGoal?: string;
  themeColor?: string;
}

export const PowerBIKPICardVisual: React.FC<PowerBIKPICardVisualProps> = (props) => {
  const {
    cardTitle = "Total Enterprise ARR",
    primaryValue = "$24.8M",
    variancePercentage = "+18.4%",
    targetGoal = "$21.0M Target",
    themeColor = "#F2C811",
  } = props;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame, fps, config: { damping: 14 } });

  return (
    <div style={{
      width: '100%',
      height: '100%',
      backgroundColor: '#0f172a',
      color: '#f8fafc',
      padding: '24px',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'Segoe UI, sans-serif',
      opacity: entrance,
    }}>
      <div style={{
        backgroundColor: '#1e293b',
        borderRadius: '8px',
        border: '1px solid #334155',
        padding: '24px',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        boxShadow: '0 6px 20px rgba(0,0,0,0.3)',
      }}>
        {/* Card Title */}
        <div style={{ fontSize: '13px', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase' }}>
          {cardTitle}
        </div>

        {/* Primary Big Metric */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '16px' }}>
          <span style={{ fontSize: '48px', fontWeight: 900, color: '#ffffff' }}>{primaryValue}</span>
          <span style={{
            fontSize: '14px',
            fontWeight: 800,
            color: '#4ade80',
            backgroundColor: 'rgba(74, 222, 128, 0.12)',
            padding: '4px 10px',
            borderRadius: '12px',
          }}>
            ▲ {variancePercentage}
          </span>
        </div>

        {/* Reference Target & Sparkline Bar */}
        <div style={{ borderTop: '1px solid #334155', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '12px', color: '#cbd5e1' }}>Goal: {targetGoal}</span>
          <span style={{ fontSize: '11px', color: '#38bdf8' }}>Status: Above Target</span>
        </div>
      </div>
    </div>
  );
};
