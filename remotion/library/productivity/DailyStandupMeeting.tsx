import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';

export interface DailyStandupMeetingProps {
  title?: string;
  [key: string]: any;
}

export const DailyStandupMeeting: React.FC<DailyStandupMeetingProps> = (props) => {
  const frame = useCurrentFrame();
  const defaultValues = {"title":"Engineering Daily Standup","currentSpeaker":"Sarah Connor (Lead Dev)","yesterdayTasks":["Merged PR #412 for Lambda video engine","Resolved S3 CORS upload issue"],"todayTasks":["Implement Remotion player caching","Review Batch 76 PR"],"blockers":["Waiting on Cloud Run IAM secret permissions"],"accentColor":"#10B981","theme":"dark"};
  const {
    title = defaultValues.title,
    accentColor = defaultValues.accentColor || '#3B82F6',
    theme = defaultValues.theme || 'dark',
    ...rest
  } = props;
  
  const merged = { ...defaultValues, ...rest, title, accentColor, theme };
  const { title, currentSpeaker, yesterdayTasks, todayTasks, blockers, accentColor, theme } = merged;


  const timerSec = Math.floor((frame % 900) / 30);
  return (
    <div style={{
      width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
      background: theme === 'dark' ? '#06130D' : '#F0FDF4',
      color: theme === 'dark' ? '#F0FDF4' : '#064E3B',
      padding: '24px', boxSizing: 'border-box', fontFamily: 'Inter, system-ui, sans-serif'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
        <div>
          <div style={{ fontSize: '18px', fontWeight: 800 }}>{title}</div>
          <div style={{ fontSize: '11px', color: '#10B981' }}>Speaking: {currentSpeaker}</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#10B98122', border: '1px solid #10B981', padding: '6px 12px', borderRadius: '8px', color: '#10B981', fontWeight: 700, fontSize: '13px' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          0:{timerSec < 10 ? '0' + timerSec : timerSec} / 2:00
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', flex: 1 }}>
        <div style={{ background: theme === 'dark' ? '#0C2317' : '#FFFFFF', borderRadius: '10px', padding: '14px', border: '1px solid #10B98133' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#34D399', marginBottom: '8px' }}>1. YESTERDAY COMPLETED</div>
          {yesterdayTasks.map((t: string, idx: number) => (
            <div key={idx} style={{ fontSize: '11px', marginBottom: '6px', color: theme === 'dark' ? '#A7F3D0' : '#065F46' }}>✓ {t}</div>
          ))}
        </div>
        <div style={{ background: theme === 'dark' ? '#0C2317' : '#FFFFFF', borderRadius: '10px', padding: '14px', border: '1px solid #10B98133' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#34D399', marginBottom: '8px' }}>2. TODAY PLANNED</div>
          {todayTasks.map((t: string, idx: number) => (
            <div key={idx} style={{ fontSize: '11px', marginBottom: '6px', color: theme === 'dark' ? '#A7F3D0' : '#065F46' }}>• {t}</div>
          ))}
        </div>
      </div>
      <div style={{ marginTop: '12px', background: '#EF444422', border: '1px solid #EF444466', borderRadius: '8px', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ fontSize: '11px', fontWeight: 800, color: '#EF4444' }}>BLOCKER:</span>
        <span style={{ fontSize: '11px', color: theme === 'dark' ? '#FECACA' : '#991B1B' }}>{blockers[0]}</span>
      </div>
    </div>
  );
};
