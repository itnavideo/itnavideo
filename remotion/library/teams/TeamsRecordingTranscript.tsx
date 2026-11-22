import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface TeamsRecordingTranscriptProps {
  recordingTitle?: string;
  duration?: string;
  aiKeyTakeawaysCount?: number;
}

export const TeamsRecordingTranscript: React.FC<TeamsRecordingTranscriptProps> = (props) => {
  const {
    recordingTitle = "Q4 Product Roadmap & Cloud Run Deployment",
    duration = "48m 12s",
    aiKeyTakeawaysCount = 4,
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
        <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700 }}>Meeting Recap & Intelligent Transcript</h3>
        <span style={{ fontSize: '11px', color: '#7b83eb' }}>{duration}</span>
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
        <div style={{ fontSize: '14px', fontWeight: 700 }}>{recordingTitle}</div>
        
        <div style={{ backgroundColor: '#11101d', padding: '12px', borderRadius: '6px', fontSize: '12px', color: '#cbd5e1' }}>
          <strong>✨ Microsoft 365 Copilot AI Summary:</strong><br />
          • Approved sub-2 minute Remotion rendering quotas<br />
          • Completed zero-duplicate library validation (1,102 components)
        </div>

        <button style={{ backgroundColor: '#5B5FC7', color: '#fff', border: 'none', borderRadius: '4px', padding: '6px', fontSize: '11px', fontWeight: 700 }}>
          Download MP4 & VTT Transcript
        </button>
      </div>
    </div>
  );
};
