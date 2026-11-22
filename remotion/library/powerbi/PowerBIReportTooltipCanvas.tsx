import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface PowerBIReportTooltipCanvasProps {
  hoveredEntity?: string;
  tooltipTitle?: string;
}

export const PowerBIReportTooltipCanvas: React.FC<PowerBIReportTooltipCanvasProps> = (props) => {
  const {
    hoveredEntity = "Video Type: AUTO_CAPTION_GENERATOR",
    tooltipTitle = "Daily Quota & Render Latency Micro-Dashboard",
  } = props;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame, fps, config: { damping: 14 } });

  return (
    <div style={{
      width: '100%',
      height: '100%',
      backgroundColor: '#0b1120',
      color: '#f8fafc',
      padding: '24px',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      fontFamily: 'Segoe UI, sans-serif',
      opacity: entrance,
    }}>
      <div style={{
        width: '360px',
        backgroundColor: '#1e293b',
        border: '1px solid #F2C811',
        borderRadius: '8px',
        padding: '18px',
        boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
      }}>
        <div style={{ fontSize: '10px', color: '#F2C811', fontWeight: 700, textTransform: 'uppercase' }}>Report Page Tooltip (On Hover)</div>
        <div style={{ fontSize: '13px', fontWeight: 800, color: '#f8fafc', marginTop: '2px' }}>{hoveredEntity}</div>
        <div style={{ borderTop: '1px solid #334155', margin: '10px 0' }} />
        <div style={{ fontSize: '11px', color: '#cbd5e1' }}>
          • Avg Render Duration: <strong>48 seconds</strong><br />
          • Free Daily Renders: <strong>5 per user</strong> (Watermark applied)<br />
          • Transcription Engine: <strong>Groq Whisper large-v3-turbo</strong>
        </div>
      </div>
    </div>
  );
};
