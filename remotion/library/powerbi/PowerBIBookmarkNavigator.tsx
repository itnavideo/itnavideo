import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface PowerBIBookmarkNavigatorProps {
  activeBookmark?: string;
}

export const PowerBIBookmarkNavigator: React.FC<PowerBIBookmarkNavigatorProps> = (props) => {
  const {
    activeBookmark = "Executive KPI View",
  } = props;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bookmarks = ['Executive KPI View', 'Operational Variance', 'Geographic Heatmap'];

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
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700 }}>Bookmark Navigator (Storytelling)</h3>
        <span style={{ fontSize: '11px', color: '#F2C811' }}>Preserved Visual State</span>
      </div>

      <div style={{ display: 'flex', gap: '8px' }}>
        {bookmarks.map((bm) => {
          const isActive = bm === activeBookmark;
          return (
            <div key={bm} style={{
              padding: '8px 16px',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: isActive ? 800 : 500,
              backgroundColor: isActive ? '#F2C811' : '#1e293b',
              color: isActive ? '#111827' : '#cbd5e1',
              cursor: 'pointer',
            }}>
              {bm}
            </div>
          );
        })}
      </div>

      <div style={{
        backgroundColor: '#1e293b',
        borderRadius: '6px',
        padding: '20px',
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#94a3b8',
        fontSize: '12px',
      }}>
        State snapshot restores visibility, filters, and spotlight configurations with zero reload.
      </div>
    </div>
  );
};
