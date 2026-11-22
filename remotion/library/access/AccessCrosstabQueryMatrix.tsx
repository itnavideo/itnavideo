import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface AccessCrosstabQueryMatrixProps {
  rowField?: string;
  columnField?: string;
  valueAggregate?: string;
}

export const AccessCrosstabQueryMatrix: React.FC<AccessCrosstabQueryMatrixProps> = (props) => {
  const {
    rowField = "ProductCategory",
    columnField = "Quarter (Q1, Q2, Q3, Q4)",
    valueAggregate = "Sum([SalesAmount])",
  } = props;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame, fps, config: { damping: 14 } });

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
        <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700 }}>TRANSFORM / Crosstab Pivot Matrix</h3>
        <span style={{ fontSize: '11px', color: '#38bdf8' }}>{valueAggregate}</span>
      </div>

      <div style={{
        flex: 1,
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        color: '#1e293b',
        boxShadow: '0 6px 20px rgba(0,0,0,0.3)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* Table Header */}
        <div style={{ display: 'grid', gridTemplateColumns: '160px repeat(4, 1fr)', backgroundColor: '#A4373A', color: '#fff', padding: '10px 14px', fontSize: '11px', fontWeight: 700 }}>
          <span>Category</span>
          <span>Q1</span>
          <span>Q2</span>
          <span>Q3</span>
          <span>Q4</span>
        </div>

        {/* Rows */}
        {[
          { cat: 'Cloud Compute', q1: '$42k', q2: '$54k', q3: '$61k', q4: '$75k' },
          { cat: 'Video AI Engine', q1: '$89k', q2: '$112k', q3: '$140k', q4: '$180k' },
          { cat: 'Media CDN', q1: '$18k', q2: '$22k', q3: '$27k', q4: '$34k' },
        ].map((r, i) => (
          <div key={r.cat} style={{ display: 'grid', gridTemplateColumns: '160px repeat(4, 1fr)', padding: '10px 14px', fontSize: '12px', borderBottom: '1px solid #e2e8f0', backgroundColor: i % 2 === 0 ? '#f8fafc' : '#ffffff' }}>
            <strong>{r.cat}</strong>
            <span>{r.q1}</span>
            <span>{r.q2}</span>
            <span>{r.q3}</span>
            <span style={{ color: '#16a34a', fontWeight: 700 }}>{r.q4}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
