import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';

export interface TaskChecklistProgressProps {
  title?: string;
  [key: string]: any;
}

export const TaskChecklistProgress: React.FC<TaskChecklistProgressProps> = (props) => {
  const frame = useCurrentFrame();
  const defaultValues = {"title":"Launch Readiness Checklist","items":[{"text":"Finalize Remotion 30fps configs","done":true},{"text":"Deploy Lambda rendering worker","done":true},{"text":"Set S3 asset lifecycle retention","done":true},{"text":"Review Stripe webhook keys","done":false},{"text":"Run live end-to-end user test","done":false}],"completedCount":3,"accentColor":"#6366F1","theme":"dark"};
  const merged = { ...defaultValues, ...props };
  const { title, items, completedCount, accentColor, theme } = merged;


  const percent = Math.round((completedCount / items.length) * 100);
  return (
    <div style={{
      width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
      background: theme === 'dark' ? '#0B0F19' : '#EEF2FF',
      color: theme === 'dark' ? '#EEF2FF' : '#1E1B4B',
      padding: '24px', boxSizing: 'border-box', fontFamily: 'Inter, system-ui, sans-serif'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <div style={{ fontSize: '18px', fontWeight: 800 }}>{title}</div>
          <div style={{ fontSize: '11px', color: '#6366F1' }}>{completedCount} of {items.length} Tasks Complete</div>
        </div>
        <div style={{ fontSize: '18px', fontWeight: 900, color: '#6366F1' }}>{percent}%</div>
      </div>
      <div style={{ width: '100%', height: '8px', background: theme === 'dark' ? '#1E293B' : '#E0E7FF', borderRadius: '4px', overflow: 'hidden', marginBottom: '18px' }}>
        <div style={{ width: `${percent}%`, height: '100%', background: '#6366F1', borderRadius: '4px' }} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {items.map((it: any, idx: number) => (
          <div key={idx} style={{
            background: theme === 'dark' ? '#111827' : '#FFFFFF',
            padding: '10px 14px', borderRadius: '8px', border: '1px solid ' + (theme === 'dark' ? '#1F2937' : '#E0E7FF'),
            display: 'flex', alignItems: 'center', gap: '10px'
          }}>
            <div style={{
              width: '18px', height: '18px', borderRadius: '4px',
              background: it.done ? '#6366F1' : 'transparent',
              border: '2px solid ' + (it.done ? '#6366F1' : '#64748B'),
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF', fontSize: '11px', fontWeight: 700
            }}>
              {it.done && '✓'}
            </div>
            <span style={{ fontSize: '12px', textDecoration: it.done ? 'line-through' : 'none', color: it.done ? '#64748B' : (theme === 'dark' ? '#F1F5F9' : '#0F172A') }}>
              {it.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
