import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface TeamsLiveCaptionsSubtitleProps {
  speakerName?: string;
  speakerRole?: string;
  spokenCaptionText?: string;
  confidenceScore?: number;
}

export const TeamsLiveCaptionsSubtitle: React.FC<TeamsLiveCaptionsSubtitleProps> = (props) => {
  const {
    speakerName = "Sarah Connor",
    speakerRole = "Principal Architect",
    spokenCaptionText = "Our AWS Lambda render pipeline processes parallel Remotion video frames at 30fps with sub-2 minute latency.",
    confidenceScore = 99,
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
      justifyContent: 'flex-end',
      fontFamily: 'Segoe UI, sans-serif',
      opacity: entrance,
    }}>
      {/* Live Captions Subtitle Box */}
      <div style={{
        backgroundColor: 'rgba(26, 24, 41, 0.95)',
        border: '1px solid #5B5FC7',
        borderRadius: '8px',
        padding: '20px 24px',
        display: 'flex',
        gap: '16px',
        alignItems: 'flex-start',
        boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
      }}>
        {/* Speaker Avatar */}
        <div style={{
          width: '38px',
          height: '38px',
          borderRadius: '50%',
          backgroundColor: '#5B5FC7',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 800,
          fontSize: '14px',
          flexShrink: 0,
        }}>
          SC
        </div>

        {/* Caption Body */}
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#c7d2fe' }}>
              {speakerName} <span style={{ fontSize: '11px', fontWeight: 400, color: '#94a3b8' }}>({speakerRole})</span>
            </span>
            <span style={{ fontSize: '10px', color: '#4ade80' }}>⚡ Azure Cognitive Speech ({confidenceScore}%)</span>
          </div>
          <p style={{ fontSize: '14px', lineHeight: '1.7', color: '#f8fafc', margin: 0 }}>
            "{spokenCaptionText}"
          </p>
        </div>
      </div>
    </div>
  );
};
