import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface GoogleFormsQuizSurveyProps {
  formTitle?: string;
  questionText?: string;
}

export const GoogleFormsQuizSurvey: React.FC<GoogleFormsQuizSurveyProps> = (props) => {
  const {
    formTitle = "Creator Feedback: Remotion Auto Caption Generator",
    questionText = "Which subtitle kinetic style provides the highest viewer retention on TikTok & Reels?",
  } = props;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame, fps, config: { damping: 14 } });

  return (
    <div style={{
      width: '100%',
      height: '100%',
      backgroundColor: '#f0ebf8',
      color: '#202124',
      padding: '24px',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'Roboto, Segoe UI, sans-serif',
      opacity: entrance,
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        borderTop: '8px solid #7248b9',
        padding: '24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 800, margin: '0 0 6px 0', color: '#202124' }}>{formTitle}</h2>
          <div style={{ fontSize: '12px', color: '#ea4335', marginBottom: '16px' }}>* Indicates required question</div>
          <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px' }}>{questionText} *</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input type="radio" checked readOnly /> Karaoke Bounce (High Retention)
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input type="radio" readOnly /> Neon Glow Minimal
            </label>
          </div>
        </div>

        <button style={{ backgroundColor: '#7248b9', color: '#fff', border: 'none', borderRadius: '4px', padding: '8px 24px', fontSize: '13px', fontWeight: 700, alignSelf: 'flex-start' }}>
          Submit
        </button>
      </div>
    </div>
  );
};
