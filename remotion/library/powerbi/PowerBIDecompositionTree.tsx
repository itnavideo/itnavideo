import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface PowerBIDecompositionTreeProps {
  rootMetric?: string;
  rootValue?: string;
  firstSplit?: string;
  secondSplit?: string;
}

export const PowerBIDecompositionTree: React.FC<PowerBIDecompositionTreeProps> = (props) => {
  const {
    rootMetric = "Total Cloud Spend",
    rootValue = "$1,250,000",
    firstSplit = "Region: North America ($780K)",
    secondSplit = "Service: Lambda Rendering ($540K)",
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
        <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700 }}>AI Decomposition Tree Visual</h3>
        <span style={{ fontSize: '11px', color: '#F2C811' }}>Root-to-Leaf Analysis</span>
      </div>

      {/* Horizontal Tree Nodes */}
      <div style={{ display: 'flex', gap: '16px', flex: 1, alignItems: 'center' }}>
        {/* Root Node */}
        <div style={{ flex: 1, backgroundColor: '#1e293b', border: '2px solid #F2C811', borderRadius: '6px', padding: '14px' }}>
          <div style={{ fontSize: '11px', color: '#94a3b8' }}>{rootMetric}</div>
          <div style={{ fontSize: '18px', fontWeight: 800, color: '#F2C811' }}>{rootValue}</div>
        </div>

        <span style={{ fontSize: '18px', color: '#F2C811' }}>➔</span>

        {/* Level 1 Split */}
        <div style={{ flex: 1, backgroundColor: '#1e293b', border: '1px solid #38bdf8', borderRadius: '6px', padding: '14px' }}>
          <div style={{ fontSize: '10px', color: '#94a3b8' }}>HIGH VALUE SPLIT</div>
          <div style={{ fontSize: '13px', fontWeight: 700, color: '#38bdf8' }}>{firstSplit}</div>
        </div>

        <span style={{ fontSize: '18px', color: '#38bdf8' }}>➔</span>

        {/* Level 2 Split */}
        <div style={{ flex: 1, backgroundColor: '#1e293b', border: '1px solid #4ade80', borderRadius: '6px', padding: '14px' }}>
          <div style={{ fontSize: '10px', color: '#94a3b8' }}>GRANULAR DRIVER</div>
          <div style={{ fontSize: '13px', fontWeight: 700, color: '#4ade80' }}>{secondSplit}</div>
        </div>
      </div>
    </div>
  );
};
