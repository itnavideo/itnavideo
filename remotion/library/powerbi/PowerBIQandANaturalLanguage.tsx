import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface PowerBIQandANaturalLanguageProps {
  userQuestion?: string;
  inferredVisual?: string;
}

export const PowerBIQandANaturalLanguage: React.FC<PowerBIQandANaturalLanguageProps> = (props) => {
  const {
    userQuestion = "Show total video render jobs by region as horizontal bar chart",
    inferredVisual = "Horizontal Clustered Bar Chart",
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
      gap: '14px',
      fontFamily: 'Segoe UI, sans-serif',
      opacity: entrance,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700 }}>Q&A Natural Language Visual Engine</h3>
        <span style={{ fontSize: '11px', color: '#F2C811' }}>Azure Cognitive NLP</span>
      </div>

      {/* Question Input Box */}
      <div style={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '6px', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '16px' }}>💬</span>
        <span style={{ fontSize: '13px', color: '#f8fafc' }}>{userQuestion}</span>
      </div>

      {/* Rendered Output Visual Mock */}
      <div style={{
        backgroundColor: '#1e293b',
        borderRadius: '6px',
        padding: '16px',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}>
        <div style={{ fontSize: '11px', color: '#94a3b8' }}>Interpreted: {inferredVisual}</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div>
            <div style={{ fontSize: '10px', color: '#cbd5e1' }}>us-central1 (Cloud Run): 1,420 renders</div>
            <div style={{ width: '85%', height: '8px', backgroundColor: '#F2C811', borderRadius: '4px' }} />
          </div>
          <div>
            <div style={{ fontSize: '10px', color: '#cbd5e1' }}>us-east-1 (Lambda): 3,890 renders</div>
            <div style={{ width: '100%', height: '8px', backgroundColor: '#38bdf8', borderRadius: '4px' }} />
          </div>
        </div>
      </div>
    </div>
  );
};
