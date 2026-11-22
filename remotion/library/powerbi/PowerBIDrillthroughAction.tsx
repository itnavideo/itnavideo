import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface PowerBIDrillthroughActionProps {
  sourceVisual?: string;
  targetPage?: string;
}

export const PowerBIDrillthroughAction: React.FC<PowerBIDrillthroughActionProps> = (props) => {
  const {
    sourceVisual = "Executive Regional Revenue Summary",
    targetPage = "Granular Customer Transaction Ledger",
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
        <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700 }}>Drillthrough Filter Navigation</h3>
        <span style={{ fontSize: '11px', color: '#38bdf8' }}>Filter Inheritance Active</span>
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
        <div style={{ fontSize: '13px', color: '#cbd5e1' }}>
          Right-click data point on <strong>{sourceVisual}</strong> to pass selected CustomerID filter to target sheet.
        </div>

        <button style={{
          backgroundColor: '#F2C811',
          color: '#111827',
          border: 'none',
          borderRadius: '6px',
          padding: '10px 18px',
          fontSize: '12px',
          fontWeight: 800,
          alignSelf: 'flex-start',
        }}>
          ➔ Drillthrough to {targetPage}
        </button>
      </div>
    </div>
  );
};
