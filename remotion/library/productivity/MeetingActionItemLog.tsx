import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';

export interface MeetingActionItemLogProps {
  title?: string;
  [key: string]: any;
}

export const MeetingActionItemLog: React.FC<MeetingActionItemLogProps> = (props) => {
  const frame = useCurrentFrame();
  const defaultValues = {"title":"Executive Sync Action Items","meetingTitle":"Architecture Review Meeting","actionItems":[{"task":"Provision AWS Lambda rendering concurrency","owner":"Carlos","due":"Nov 26"},{"task":"Optimize Remotion audio waveform generator","owner":"Elena","due":"Nov 27"},{"task":"Refactor Supabase RLS policies for quotas","owner":"Dave","due":"Nov 29"}],"accentColor":"#8B5CF6","theme":"dark"};
  const {
    title = defaultValues.title,
    accentColor = defaultValues.accentColor || '#3B82F6',
    theme = defaultValues.theme || 'dark',
    ...rest
  } = props;
  
  const merged = { ...defaultValues, ...rest, title, accentColor, theme };
  const { title, meetingTitle, actionItems, accentColor, theme } = merged;


  return (
    <div style={{
      width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
      background: theme === 'dark' ? '#0F172A' : '#FAF5FF',
      color: theme === 'dark' ? '#F8FAFC' : '#2E1065',
      padding: '24px', boxSizing: 'border-box', fontFamily: 'Inter, system-ui, sans-serif'
    }}>
      <div style={{ marginBottom: '18px' }}>
        <div style={{ fontSize: '18px', fontWeight: 800 }}>{title}</div>
        <div style={{ fontSize: '11px', color: '#8B5CF6' }}>Source: {meetingTitle}</div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
        {actionItems.map((item: any, idx: number) => (
          <div key={idx} style={{
            background: theme === 'dark' ? '#1E293B' : '#FFFFFF',
            padding: '12px 16px', borderRadius: '8px', border: '1px solid ' + (theme === 'dark' ? '#334155' : '#E9D5FF'),
            display: 'flex', justifyContent: 'space-between', alignItems: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '11px', width: '22px', height: '22px', borderRadius: '50%', background: '#8B5CF622', color: '#8B5CF6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
                {idx + 1}
              </span>
              <span style={{ fontSize: '12px', fontWeight: 600 }}>{item.task}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '10px', background: '#8B5CF6', color: '#FFF', padding: '2px 8px', borderRadius: '12px', fontWeight: 700 }}>
                @{item.owner}
              </span>
              <span style={{ fontSize: '10px', color: '#64748B' }}>Due {item.due}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
