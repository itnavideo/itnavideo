import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface PowerBIRibbonChartRankProps {
  topCategory?: string;
  rankGrowth?: string;
}

export const PowerBIRibbonChartRank: React.FC<PowerBIRibbonChartRankProps> = (props) => {
  const {
    topCategory = "Cloud Media Generation",
    rankGrowth = "Rank #1 (Ascended from #3 in Q1)",
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
        <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700 }}>Ribbon Chart • Rank Dynamic Visual</h3>
        <span style={{ fontSize: '11px', color: '#F2C811' }}>{rankGrowth}</span>
      </div>

      <div style={{
        backgroundColor: '#1e293b',
        borderRadius: '8px',
        padding: '20px',
        border: '1px solid #334155',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-around',
      }}>
        {['Q1: $120K (Rank 3)', 'Q2: $240K (Rank 2)', 'Q3: $490K (Rank 1)'].map((q, idx) => (
          <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ width: '130px', fontSize: '11px', color: '#94a3b8' }}>{q}</span>
            <div style={{ flex: 1, height: '22px', backgroundColor: '#F2C811', borderRadius: '4px', opacity: 0.6 + idx * 0.2 }} />
          </div>
        ))}
      </div>
    </div>
  );
};
