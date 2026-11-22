import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface AccessCalculatedFieldRowProps {
  formulaExpression?: string;
  sampleResult?: string;
}

export const AccessCalculatedFieldRow: React.FC<AccessCalculatedFieldRowProps> = (props) => {
  const {
    formulaExpression = "[UnitPrice] * [Quantity] * (1 - [DiscountRate])",
    sampleResult = "$1,870.00 USD",
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
      gap: '16px',
      fontFamily: 'Segoe UI, sans-serif',
      opacity: entrance,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700 }}>Table-Level Calculated Field</h3>
        <span style={{ fontSize: '11px', color: '#4ade80' }}>Native Engine Evaluation</span>
      </div>

      <div style={{
        backgroundColor: '#1e293b',
        borderRadius: '8px',
        padding: '20px',
        border: '1px solid #334155',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}>
        <div style={{ backgroundColor: '#0f172a', padding: '12px', borderRadius: '6px' }}>
          <div style={{ fontSize: '10px', color: '#94a3b8' }}>CALCULATION EXPRESSION:</div>
          <code style={{ fontSize: '13px', color: '#38bdf8' }}>{formulaExpression}</code>
        </div>

        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '12px', color: '#94a3b8' }}>Dynamic Computed Result:</div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: '#4ade80' }}>{sampleResult}</div>
        </div>
      </div>
    </div>
  );
};
