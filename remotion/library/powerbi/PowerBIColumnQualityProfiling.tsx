import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface PowerBIColumnQualityProfilingProps {
  validPercent?: number;
  errorPercent?: number;
  emptyPercent?: number;
}

export const PowerBIColumnQualityProfiling: React.FC<PowerBIColumnQualityProfilingProps> = (props) => {
  const {
    validPercent = 99,
    errorPercent = 0,
    emptyPercent = 1,
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
      gap: '16px',
      fontFamily: 'Segoe UI, sans-serif',
      opacity: entrance,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700 }}>Power Query Column Quality Profiling</h3>
        <span style={{ fontSize: '11px', color: '#4ade80' }}>Data Cleansing</span>
      </div>

      <div style={{
        backgroundColor: '#1e293b',
        borderRadius: '8px',
        padding: '20px',
        border: '1px solid #334155',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}>
        {/* Quality Bar */}
        <div style={{ display: 'flex', height: '16px', borderRadius: '8px', overflow: 'hidden' }}>
          <div style={{ width: `\%`, backgroundColor: '#10b981' }} title="Valid" />
          <div style={{ width: `\%`, backgroundColor: '#f59e0b' }} title="Empty" />
          <div style={{ width: `\%`, backgroundColor: '#ef4444' }} title="Error" />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-around', fontSize: '12px' }}>
          <span style={{ color: '#10b981' }}>Valid: {validPercent}%</span>
          <span style={{ color: '#f59e0b' }}>Empty: {emptyPercent}%</span>
          <span style={{ color: '#ef4444' }}>Error: {errorPercent}%</span>
        </div>
      </div>
    </div>
  );
};
