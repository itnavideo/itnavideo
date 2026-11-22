import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface PowerBIGaugeMeterTargetProps {
  currentValue?: number;
  targetValue?: number;
  maxValue?: number;
  unitLabel?: string;
}

export const PowerBIGaugeMeterTarget: React.FC<PowerBIGaugeMeterTargetProps> = (props) => {
  const {
    currentValue = 7.8,
    targetValue = 7,
    maxValue = 10,
    unitLabel = "$M ARR",
  } = props;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame, fps, config: { damping: 14 } });

  return (
    <div style={{
      width: '100%',
      height: '100%',
      backgroundColor: '#0b1120',
      color: '#f8fafc',
      padding: '24px',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      fontFamily: 'Segoe UI, sans-serif',
      opacity: entrance,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700 }}>Gauge Visual • Performance vs Target</h3>
        <span style={{ fontSize: '11px', color: '#4ade80' }}>Target Achieved (111%)</span>
      </div>

      <div style={{
        backgroundColor: '#1e293b',
        borderRadius: '8px',
        padding: '24px',
        border: '1px solid #334155',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div style={{ fontSize: '42px', fontWeight: 900, color: '#F2C811' }}>
          M <span style={{ fontSize: '16px', color: '#94a3b8' }}>{unitLabel}</span>
        </div>

        {/* Gauge Progress Track */}
        <div style={{ width: '80%', height: '14px', backgroundColor: '#0f172a', borderRadius: '7px', overflow: 'hidden' }}>
          <div style={{ width: `\%`, height: '100%', backgroundColor: '#F2C811' }} />
        </div>

        <div style={{ width: '80%', display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#94a3b8' }}>
          <span>Min: $0M</span>
          <span style={{ color: '#4ade80', fontWeight: 700 }}>Target: M</span>
          <span>Max: M</span>
        </div>
      </div>
    </div>
  );
};
