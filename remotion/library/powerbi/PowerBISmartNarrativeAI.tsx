import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface PowerBISmartNarrativeAIProps {
  headline?: string;
  narrativeText?: string;
}

export const PowerBISmartNarrativeAI: React.FC<PowerBISmartNarrativeAIProps> = (props) => {
  const {
    headline = "Executive Telemetry Insights",
    narrativeText = "Between Q1 and Q3, platform rendering throughput rose by 34.2%, driven by automated Subtitle Reel optimizations. Peak concurrency was observed on AWS Lambda in us-east-1.",
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
      fontFamily: 'Segoe UI, sans-serif',
      opacity: entrance,
    }}>
      <div style={{
        backgroundColor: '#1e293b',
        borderRadius: '8px',
        padding: '24px',
        border: '1px solid #334155',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '18px' }}>✨</span>
          <span style={{ fontSize: '14px', fontWeight: 800, color: '#F2C811' }}>Smart Narrative AI</span>
        </div>

        <p style={{ fontSize: '13px', lineHeight: '1.8', color: '#cbd5e1', margin: '14px 0' }}>
          {narrativeText}
        </p>

        <div style={{ fontSize: '10px', color: '#94a3b8' }}>
          Auto-updates dynamically whenever viewers apply slicers or cross-highlight charts.
        </div>
      </div>
    </div>
  );
};
