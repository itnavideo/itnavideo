import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface TeamsNoiseSuppressionProps {
  suppressionLevel?: 'High' | 'Low' | 'Auto' | 'Off';
  backgroundNoiseDampenedDb?: number;
}

export const TeamsNoiseSuppression: React.FC<TeamsNoiseSuppressionProps> = (props) => {
  const {
    suppressionLevel = "High",
    backgroundNoiseDampenedDb = 28,
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
      gap: '16px',
      fontFamily: 'Segoe UI, sans-serif',
      opacity: entrance,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700 }}>AI Noise Suppression</h3>
        <span style={{ backgroundColor: '#22c55e', color: '#111', fontSize: '11px', fontWeight: 800, padding: '2px 8px', borderRadius: '4px' }}>
          LEVEL: {suppressionLevel}
        </span>
      </div>

      <div style={{
        backgroundColor: '#1e1c2e',
        borderRadius: '8px',
        padding: '20px',
        border: '1px solid #2d2a45',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}>
        <div style={{ fontSize: '13px', color: '#cbd5e1' }}>
          Deep neural network isolates spoken human voice while attenuating keystrokes, barking dogs, and fan noise by <strong style={{ color: '#4ade80' }}>-{backgroundNoiseDampenedDb} dB</strong>.
        </div>

        {/* Audio Waveform Comparison */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div style={{ flex: 1, height: '36px', backgroundColor: '#0f172a', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: '10px', color: '#ef4444' }}>Raw Audio (Noisy)</span>
          </div>
          <span>➡️</span>
          <div style={{ flex: 1, height: '36px', backgroundColor: '#0f172a', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: '10px', color: '#22c55e' }}>Filtered Voice (Isolated)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
