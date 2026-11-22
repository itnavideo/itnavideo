import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface GoogleGeminiWorkspaceCopilotProps {
  promptText?: string;
}

export const GoogleGeminiWorkspaceCopilot: React.FC<GoogleGeminiWorkspaceCopilotProps> = (props) => {
  const {
    promptText = "Help me draft an executive summary for our Q4 Cloud Run video rendering migration",
  } = props;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame, fps, config: { damping: 14 } });

  return (
    <div style={{
      width: '100%',
      height: '100%',
      backgroundColor: '#ffffff',
      color: '#202124',
      padding: '24px',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'Roboto, Segoe UI, sans-serif',
      opacity: entrance,
    }}>
      <div style={{
        backgroundColor: '#f8fafd',
        borderRadius: '8px',
        border: '1px solid #c2e7ff',
        padding: '20px',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '18px' }}>✨</span>
          <span style={{ fontSize: '14px', fontWeight: 800, color: '#0b57d0' }}>Gemini for Google Workspace</span>
        </div>

        <div style={{ backgroundColor: '#ffffff', padding: '12px', borderRadius: '6px', fontSize: '12px', color: '#444746', border: '1px solid #e0e3e7' }}>
          "{promptText}"
        </div>

        <div style={{ fontSize: '11px', color: '#0b57d0', fontWeight: 700 }}>
          Streaming draft response into active Google Doc...
        </div>
      </div>
    </div>
  );
};
