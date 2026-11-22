import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface TeamsMeetingWhiteboardProps {
  boardTitle?: string;
  stickyNotesCount?: number;
  collaboratorsCount?: number;
}

export const TeamsMeetingWhiteboard: React.FC<TeamsMeetingWhiteboardProps> = (props) => {
  const {
    boardTitle = "Sprint 42 System Architecture Flow",
    stickyNotesCount = 4,
    collaboratorsCount = 5,
  } = props;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame, fps, config: { damping: 14 } });

  return (
    <div style={{
      width: '100%',
      height: '100%',
      backgroundColor: '#11101d',
      padding: '24px',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'Segoe UI, sans-serif',
      opacity: entrance,
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        padding: '24px',
        flex: 1,
        boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
      }}>
        {/* Whiteboard Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px' }}>
          <div style={{ fontSize: '14px', fontWeight: 800, color: '#1e1c2e' }}>🎨 Microsoft Whiteboard • {boardTitle}</div>
          <span style={{ fontSize: '11px', color: '#64748b' }}>👥 {collaboratorsCount} Active Collaborators</span>
        </div>

        {/* Canvas Sticky Notes */}
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
          <div style={{ width: '130px', height: '110px', backgroundColor: '#fef08a', padding: '10px', borderRadius: '4px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', color: '#854d0e', fontSize: '11px' }}>
            <strong>Speech-to-Text:</strong><br />Groq Whisper turbo API fallback to Gemini 2.0
          </div>
          <div style={{ width: '130px', height: '110px', backgroundColor: '#bae6fd', padding: '10px', borderRadius: '4px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', color: '#0369a1', fontSize: '11px' }}>
            <strong>Render Cloud:</strong><br />AWS Lambda distributed 30fps Chromium engine
          </div>
          <div style={{ width: '130px', height: '110px', backgroundColor: '#bbf7d0', padding: '10px', borderRadius: '4px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', color: '#15803d', fontSize: '11px' }}>
            <strong>Media CDN:</strong><br />Cloudinary & S3 presigned asset distribution
          </div>
        </div>

        <div style={{ fontSize: '10px', color: '#94a3b8', textAlign: 'center' }}>
          All changes synchronized automatically via Microsoft Fluid Framework.
        </div>
      </div>
    </div>
  );
};
