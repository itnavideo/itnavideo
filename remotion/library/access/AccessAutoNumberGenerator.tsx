import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface AccessAutoNumberGeneratorProps {
  currentSequence?: number;
  nextValue?: number;
}

export const AccessAutoNumberGenerator: React.FC<AccessAutoNumberGeneratorProps> = (props) => {
  const {
    currentSequence = 49218,
    nextValue = 49219,
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
        <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700 }}>AutoNumber Sequence Generator</h3>
        <span style={{ fontSize: '11px', color: '#facc15' }}>🔑 Surrogate Primary Key</span>
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
        alignItems: 'center',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '12px', color: '#94a3b8' }}>Current Commited ID:</div>
          <div style={{ fontSize: '32px', fontWeight: 800, color: '#f8fafc' }}>#{currentSequence}</div>
        </div>

        <div style={{ backgroundColor: 'rgba(250, 204, 21, 0.1)', border: '1px solid #facc15', borderRadius: '6px', padding: '10px 18px', textAlign: 'center' }}>
          Next Inserted Record: <strong style={{ color: '#facc15' }}>#{nextValue}</strong> (Immutable 32-bit Integer)
        </div>
      </div>
    </div>
  );
};
