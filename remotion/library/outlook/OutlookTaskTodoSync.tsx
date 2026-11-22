import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface OutlookTaskTodoSyncProps {
  taskTitle?: string;
  dueDate?: string;
  categoryTag?: string;
  isCompleted?: boolean;
}

export const OutlookTaskTodoSync: React.FC<OutlookTaskTodoSyncProps> = (props) => {
  const {
    taskTitle = "Review Remotion Video Lambda render concurrency quotas",
    dueDate = "Due Tomorrow at 5:00 PM",
    categoryTag = "Infrastructure",
    isCompleted = false,
  } = props;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame, fps, config: { damping: 14 } });

  return (
    <div style={{
      width: '100%',
      height: '100%',
      backgroundColor: '#090d16',
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
        <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700 }}>Microsoft To Do • Flagged Email Task</h3>
        <span style={{ fontSize: '11px', color: '#38bdf8' }}>Synced with Exchange</span>
      </div>

      <div style={{
        backgroundColor: '#1e293b',
        borderRadius: '8px',
        padding: '20px',
        border: '1px solid #334155',
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
      }}>
        <div style={{
          width: '22px',
          height: '22px',
          borderRadius: '50%',
          border: '2px solid #38bdf8',
          cursor: 'pointer',
        }} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '14px', fontWeight: 700, color: '#f8fafc' }}>{taskTitle}</div>
          <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>⏰ {dueDate}</div>
        </div>
        <span style={{ backgroundColor: '#2563eb', color: '#fff', fontSize: '10px', padding: '3px 8px', borderRadius: '4px', fontWeight: 700 }}>
          {categoryTag}
        </span>
      </div>
    </div>
  );
};
