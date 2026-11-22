import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface SnoozeEmailSchedulerProps {
  snoozeOption?: string;
  resurfaceTime?: string;
}

export const SnoozeEmailScheduler: React.FC<SnoozeEmailSchedulerProps> = (props) => {
  const {
    snoozeOption = "Tomorrow Morning",
    resurfaceTime = "Tomorrow at 08:00 AM",
  } = props;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame, fps, config: { damping: 14 } });

  return (
    <div style={{
      width: '100%',
      height: '100%',
      backgroundColor: '#0c1322',
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
        <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700 }}>Snooze Message</h3>
        <span style={{ fontSize: '11px', color: '#38bdf8' }}>Temporary Inbox Triage</span>
      </div>

      <div style={{
        backgroundColor: '#1e293b',
        borderRadius: '8px',
        padding: '20px',
        border: '1px solid #334155',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '24px' }}>⏰</span>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#f8fafc' }}>Selected: {snoozeOption}</div>
            <div style={{ fontSize: '11px', color: '#94a3b8' }}>Will reappear in Focused inbox at {resurfaceTime}</div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
          {['Later Today (6 PM)', 'Tomorrow (8 AM)', 'This Weekend', 'Choose a Date...'].map((opt) => (
            <div key={opt} style={{ backgroundColor: '#0f172a', padding: '8px', borderRadius: '4px', fontSize: '11px', textAlign: 'center', color: '#cbd5e1' }}>
              {opt}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
