import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface TeamsAppTabIntegrationProps {
  tabAppName?: string;
  tabSourceUrl?: string;
  activeStatus?: string;
}

export const TeamsAppTabIntegration: React.FC<TeamsAppTabIntegrationProps> = (props) => {
  const {
    tabAppName = "Power BI Analytics Dashboard",
    tabSourceUrl = "https://app.powerbi.com/reports/itnavideo-kpi",
    activeStatus = "Live Embedded App",
  } = props;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame, fps, config: { damping: 14 } });

  return (
    <div style={{
      width: '100%',
      height: '100%',
      backgroundColor: '#11101d',
      color: '#f8fafc',
      padding: '24px',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      gap: '14px',
      fontFamily: 'Segoe UI, sans-serif',
      opacity: entrance,
    }}>
      {/* Tab Ribbon Bar */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid #2d2a45', paddingBottom: '8px' }}>
        {['Posts', 'Files', '📊 Power BI Dashboard', '+'].map((tab, idx) => (
          <div key={idx} style={{
            fontSize: '12px',
            padding: '4px 12px',
            borderRadius: '4px',
            backgroundColor: idx === 2 ? '#5B5FC7' : '#1e1c2e',
            color: idx === 2 ? '#fff' : '#94a3b8',
            fontWeight: idx === 2 ? 700 : 400,
          }}>
            {tab}
          </div>
        ))}
      </div>

      {/* Embedded Content Shell */}
      <div style={{
        backgroundColor: '#1e1c2e',
        borderRadius: '6px',
        padding: '20px',
        border: '1px solid #2d2a45',
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#c7d2fe',
        fontSize: '13px',
      }}>
        Embedded App Canvas: {tabAppName} ({activeStatus})
      </div>
    </div>
  );
};
