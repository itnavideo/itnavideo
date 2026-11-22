import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface TeamsPollAttendanceProps {
  question?: string;
  totalVotes?: number;
  option1?: { text: string; pct: number };
  option2?: { text: string; pct: number };
}

export const TeamsPollAttendance: React.FC<TeamsPollAttendanceProps> = (props) => {
  const {
    question = "Quick Check: Should we add Microsoft PowerPoint components next?",
    totalVotes = 32,
    option1 = {"text":"Yes, proceed with PowerPoint (Batch 72)","pct":88},
    option2 = {"text":"No, let us explore Cloud Infrastructure first","pct":12},
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
        <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700 }}>Microsoft Forms • In-Meeting Poll</h3>
        <span style={{ fontSize: '11px', color: '#7b83eb' }}>{totalVotes} Responses</span>
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
        <div style={{ fontSize: '14px', fontWeight: 700, color: '#f8fafc' }}>{question}</div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
              <span>{option1.text}</span>
              <strong style={{ color: '#4ade80' }}>{option1.pct}%</strong>
            </div>
            <div style={{ width: '100%', height: '8px', backgroundColor: '#0f172a', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ width: `${option1.pct}%`, height: '100%', backgroundColor: '#4ade80' }} />
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
              <span>{option2.text}</span>
              <strong style={{ color: '#94a3b8' }}>{option2.pct}%</strong>
            </div>
            <div style={{ width: '100%', height: '8px', backgroundColor: '#0f172a', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ width: `${option2.pct}%`, height: '100%', backgroundColor: '#94a3b8' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
