import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';

export interface TimeboxScheduleCalendarProps {
  title?: string;
  [key: string]: any;
}

export const TimeboxScheduleCalendar: React.FC<TimeboxScheduleCalendarProps> = (props) => {
  const frame = useCurrentFrame();
  const defaultValues = {"title":"Daily Timebox Schedule","date":"Tuesday, Nov 24","timeblocks":[{"time":"09:00 - 11:30","name":"Deep Work: Core Engine","tag":"Deep Focus","color":"#3B82F6"},{"time":"11:30 - 12:30","name":"Sprint Standup & Triage","tag":"Team Sync","color":"#10B981"},{"time":"13:30 - 15:30","name":"Client Demo & Architecture","tag":"Meeting","color":"#8B5CF6"},{"time":"15:30 - 17:00","name":"Async Code Reviews","tag":"Admin","color":"#F59E0B"}],"currentTime":"10:45 AM","accentColor":"#3B82F6","theme":"dark"};
  const {
    title = defaultValues.title,
    accentColor = defaultValues.accentColor || '#3B82F6',
    theme = defaultValues.theme || 'dark',
    ...rest
  } = props;
  
  const merged = { ...defaultValues, ...rest, title, accentColor, theme };
  const { title, date, timeblocks, currentTime, accentColor, theme } = merged;


  return (
    <div style={{
      width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
      background: theme === 'dark' ? '#090D16' : '#F0F9FF',
      color: theme === 'dark' ? '#F0F9FF' : '#0C4A6E',
      padding: '24px', boxSizing: 'border-box', fontFamily: 'Inter, system-ui, sans-serif'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <div style={{ fontSize: '18px', fontWeight: 800 }}>{title}</div>
          <div style={{ fontSize: '11px', color: '#38BDF8' }}>{date}</div>
        </div>
        <div style={{ fontSize: '11px', background: '#38BDF822', color: '#38BDF8', padding: '4px 10px', borderRadius: '6px', fontWeight: 700 }}>
          Now: {currentTime}
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
        {timeblocks.map((block: any, idx: number) => (
          <div key={idx} style={{
            background: theme === 'dark' ? '#111827' : '#FFFFFF',
            borderRadius: '8px', padding: '12px 16px', borderLeft: `4px solid ${block.color}`,
            display: 'flex', justifyContent: 'space-between', alignItems: 'center'
          }}>
            <div>
              <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>{block.time}</div>
              <div style={{ fontSize: '13px', fontWeight: 700, marginTop: '2px' }}>{block.name}</div>
            </div>
            <span style={{ fontSize: '10px', background: `${block.color}22`, color: block.color, padding: '4px 8px', borderRadius: '4px', fontWeight: 700 }}>
              {block.tag}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
