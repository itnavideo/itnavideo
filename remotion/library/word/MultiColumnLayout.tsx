import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface MultiColumnLayoutProps {
  columnCount?: number;
  gutterWidthMm?: number;
  showLineBetween?: boolean;
}

export const MultiColumnLayout: React.FC<MultiColumnLayoutProps> = (props) => {
  const {
    columnCount = 3,
    gutterWidthMm = 12.5,
    showLineBetween = true,
  } = props;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame, fps, config: { damping: 14 } });

  return (
    <div style={{
      width: '100%',
      height: '100%',
      backgroundColor: '#0f172a',
      padding: '24px',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'Segoe UI, sans-serif',
      opacity: entrance,
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        flex: 1,
        borderRadius: '8px',
        padding: '28px',
        color: '#1e293b',
        boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* Magazine Title */}
        <div style={{ borderBottom: '2px solid #0f172a', paddingBottom: '8px', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 800 }}>THE MONTHLY DISPATCH</h2>
          <span style={{ fontSize: '10px', color: '#64748b' }}>{columnCount} Columns • Line Between: {showLineBetween ? 'Yes' : 'No'}</span>
        </div>

        {/* 3-Column Content Reflow */}
        <div style={{ display: 'flex', gap: '16px', flex: 1, position: 'relative' }}>
          {[1, 2, 3].map((col, idx) => (
            <div key={col} style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              borderRight: showLineBetween && idx < 2 ? '1px solid #cbd5e1' : 'none',
              paddingRight: showLineBetween && idx < 2 ? '16px' : '0',
            }}>
              <div style={{ fontWeight: 700, fontSize: '12px', color: '#2563eb' }}>Column {col}</div>
              <p style={{ fontSize: '11px', lineHeight: '1.6', color: '#475569', margin: 0, textAlign: 'justify' }}>
                Programmatic document reflow automatically partitions flowing paragraph text across equal-width columns while enforcing balanced bottom margins.
              </p>
              <div style={{ height: '4px', backgroundColor: '#e2e8f0', borderRadius: '2px', width: '80%' }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
