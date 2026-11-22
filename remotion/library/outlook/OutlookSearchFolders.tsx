import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface OutlookSearchFoldersProps {
  activeSearchFolder?: string;
  unreadCount?: number;
  flaggedCount?: number;
  largeItemsCount?: number;
}

export const OutlookSearchFolders: React.FC<OutlookSearchFoldersProps> = (props) => {
  const {
    activeSearchFolder = "Flagged for Follow Up",
    unreadCount = 14,
    flaggedCount = 8,
    largeItemsCount = 5,
  } = props;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame, fps, config: { damping: 14 } });

  const folders = [
    { name: 'Unread Mail', count: unreadCount, icon: '✉️' },
    { name: 'Flagged for Follow Up', count: flaggedCount, icon: '🚩', active: true },
    { name: 'Large Mail (> 5 MB)', count: largeItemsCount, icon: '💾' },
    { name: 'Directly to Me', count: 12, icon: '👤' },
  ];

  return (
    <div style={{
      width: '100%',
      height: '100%',
      backgroundColor: '#090d16',
      color: '#f8fafc',
      padding: '24px',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      gap: '14px',
      fontFamily: 'Segoe UI, sans-serif',
      opacity: entrance,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700 }}>Outlook Smart Search Folders</h3>
        <span style={{ fontSize: '11px', color: '#38bdf8' }}>Virtual Aggregation</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
        {folders.map((f, i) => (
          <div key={i} style={{
            backgroundColor: f.active ? 'rgba(0, 120, 212, 0.2)' : '#1e293b',
            border: f.active ? '1px solid #0078D4' : '1px solid #334155',
            borderRadius: '6px',
            padding: '12px 16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span>{f.icon}</span>
              <span style={{ fontSize: '12px', fontWeight: f.active ? 700 : 500, color: f.active ? '#38bdf8' : '#cbd5e1' }}>{f.name}</span>
            </div>
            <span style={{ fontSize: '11px', fontWeight: 700, backgroundColor: '#0f172a', padding: '2px 8px', borderRadius: '10px', color: '#f8fafc' }}>
              {f.count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
