import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface VersionHistoryTimelineProps {
  currentVersion?: string;
  totalRevisions?: number;
}

export const VersionHistoryTimeline: React.FC<VersionHistoryTimelineProps> = (props) => {
  const {
    currentVersion = "v2.4 (Current)",
    totalRevisions = 8,
  } = props;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame, fps, config: { damping: 14 } });

  const versions = [
    { tag: 'v2.4 (Current)', author: 'Sarah Connor', note: 'Added Remotion 9:16 kinetic subtitle presets', date: 'Today 11:30 AM' },
    { tag: 'v2.3', author: 'Marcus Vance', note: 'Configured AWS Lambda 30fps Chromium engine', date: 'Yesterday' },
    { tag: 'v2.2', author: 'Elena Rostova', note: 'Designed responsive 3-step studio creation flow', date: 'Nov 18, 2026' },
  ];

  return (
    <div style={{
      width: '100%',
      height: '100%',
      backgroundColor: '#0c101c',
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
        <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700 }}>Version History Timeline</h3>
        <span style={{ fontSize: '11px', color: '#38bdf8' }}>{totalRevisions} Revisions Logged</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
        {versions.map((v, i) => (
          <div key={v.tag} style={{
            backgroundColor: i === 0 ? 'rgba(56, 189, 248, 0.15)' : '#1e293b',
            border: i === 0 ? '1px solid #38bdf8' : '1px solid #334155',
            borderRadius: '6px',
            padding: '10px 14px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <div>
              <div style={{ fontSize: '12px', fontWeight: 700, color: i === 0 ? '#38bdf8' : '#f8fafc' }}>{v.tag} • {v.author}</div>
              <div style={{ fontSize: '10px', color: '#94a3b8' }}>{v.note}</div>
            </div>
            <span style={{ fontSize: '10px', color: '#64748b' }}>{v.date}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
