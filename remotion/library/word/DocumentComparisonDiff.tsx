import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface DocumentComparisonDiffProps {
  originalFile?: string;
  revisedFile?: string;
  insertionsCount?: number;
  deletionsCount?: number;
  similarityRatio?: number;
}

export const DocumentComparisonDiff: React.FC<DocumentComparisonDiffProps> = (props) => {
  const {
    originalFile = "Service_Agreement_v1.docx",
    revisedFile = "Service_Agreement_v2_Final.docx",
    insertionsCount = 24,
    deletionsCount = 11,
    similarityRatio = 94,
  } = props;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({ frame, fps, config: { damping: 12 } });

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
      gap: '16px',
      fontFamily: 'Segoe UI, sans-serif',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700 }}>Compare Documents (Legal Diff)</h3>
        <span style={{ fontSize: '12px', color: '#38bdf8' }}>{similarityRatio}% Similarity</span>
      </div>

      {/* Revision Stats Cards */}
      <div style={{ display: 'flex', gap: '12px' }}>
        <div style={{ flex: 1, backgroundColor: '#1e293b', padding: '12px', borderRadius: '6px', borderLeft: '4px solid #16a34a' }}>
          <div style={{ fontSize: '10px', color: '#94a3b8' }}>INSERTIONS</div>
          <div style={{ fontSize: '20px', fontWeight: 800, color: '#4ade80' }}>+{insertionsCount}</div>
        </div>
        <div style={{ flex: 1, backgroundColor: '#1e293b', padding: '12px', borderRadius: '6px', borderLeft: '4px solid #dc2626' }}>
          <div style={{ fontSize: '10px', color: '#94a3b8' }}>DELETIONS</div>
          <div style={{ fontSize: '20px', fontWeight: 800, color: '#f87171' }}>-{deletionsCount}</div>
        </div>
        <div style={{ flex: 1, backgroundColor: '#1e293b', padding: '12px', borderRadius: '6px', borderLeft: '4px solid #3b82f6' }}>
          <div style={{ fontSize: '10px', color: '#94a3b8' }}>MOVES / REFORMATS</div>
          <div style={{ fontSize: '20px', fontWeight: 800, color: '#60a5fa' }}>5</div>
        </div>
      </div>

      {/* Side-by-Side Dual Document Mock */}
      <div style={{ display: 'flex', gap: '12px', flex: 1 }}>
        <div style={{ flex: 1, backgroundColor: '#ffffff', color: '#1e293b', borderRadius: '6px', padding: '16px', fontSize: '11px', lineHeight: '1.6' }}>
          <div style={{ fontWeight: 700, color: '#64748b', marginBottom: '8px' }}>Original: {originalFile}</div>
          <p style={{ margin: 0 }}>The vendor must provide security logs within 7 business days.</p>
        </div>
        <div style={{ flex: 1, backgroundColor: '#ffffff', color: '#1e293b', borderRadius: '6px', padding: '16px', fontSize: '11px', lineHeight: '1.6' }}>
          <div style={{ fontWeight: 700, color: '#2563eb', marginBottom: '8px' }}>Revised: {revisedFile}</div>
          <p style={{ margin: 0 }}>
            The vendor must provide{' '}
            <span style={{ backgroundColor: 'rgba(22, 163, 74, 0.2)', color: '#15803d', fontWeight: 700 }}>
              real-time automated security telemetry
            </span>{' '}
            within 24 hours.
          </p>
        </div>
      </div>
    </div>
  );
};
