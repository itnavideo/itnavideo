import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface PowerBIWaterfallBreakdownProps {
  startingTotal?: string;
  endingTotal?: string;
}

export const PowerBIWaterfallBreakdown: React.FC<PowerBIWaterfallBreakdownProps> = (props) => {
  const {
    startingTotal = "$1,000,000 (Base)",
    endingTotal = "$1,480,000 (Ending)",
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
        <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700 }}>Financial Waterfall Breakdown</h3>
        <span style={{ fontSize: '11px', color: '#4ade80' }}>+$480,000 Net Growth</span>
      </div>

      <div style={{
        backgroundColor: '#1e293b',
        borderRadius: '8px',
        padding: '20px',
        border: '1px solid #334155',
        flex: 1,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-around',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '40px', height: '100px', backgroundColor: '#38bdf8', borderRadius: '4px' }} />
          <span style={{ fontSize: '10px', color: '#cbd5e1', display: 'block', marginTop: '6px' }}>Start</span>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '40px', height: '40px', backgroundColor: '#4ade80', borderRadius: '4px' }} />
          <span style={{ fontSize: '10px', color: '#4ade80', display: 'block', marginTop: '6px' }}>+New</span>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '40px', height: '18px', backgroundColor: '#ef4444', borderRadius: '4px' }} />
          <span style={{ fontSize: '10px', color: '#ef4444', display: 'block', marginTop: '6px' }}>-Churn</span>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '40px', height: '135px', backgroundColor: '#F2C811', borderRadius: '4px' }} />
          <span style={{ fontSize: '10px', color: '#F2C811', fontWeight: 700, display: 'block', marginTop: '6px' }}>End</span>
        </div>
      </div>
    </div>
  );
};
