import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';

export interface EisenhowerMatrixCardProps {
  title?: string;
  [key: string]: any;
}

export const EisenhowerMatrixCard: React.FC<EisenhowerMatrixCardProps> = (props) => {
  const frame = useCurrentFrame();
  const defaultValues = {"title":"Priority Decision Matrix","quadrants":[{"name":"Do First","subtitle":"Urgent & Important","color":"#EF4444","tasks":["Server Crash Patch","Client Pitch"]},{"name":"Schedule","subtitle":"Not Urgent & Important","color":"#3B82F6","tasks":["Q3 Product Strategy","Workout Routine"]},{"name":"Delegate","subtitle":"Urgent & Not Important","color":"#F59E0B","tasks":["Weekly Report Gen","Inbox Sorting"]},{"name":"Delete","subtitle":"Not Urgent & Not Important","color":"#6B7280","tasks":["Random Browsing","Unsorted Spam"]}],"activeQuadrant":0,"accentColor":"#3B82F6","theme":"dark"};
  const merged = { ...defaultValues, ...props };
  const { title, quadrants, activeQuadrant, accentColor, theme } = merged;


  const scaleAnim = interpolate(frame, [0, 20], [0.9, 1], { extrapolateRight: 'clamp' });
  return (
    <div style={{
      width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
      background: theme === 'dark' ? '#0F172A' : '#F8FAFC',
      color: theme === 'dark' ? '#F8FAFC' : '#0F172A',
      padding: '24px', boxSizing: 'border-box', fontFamily: 'Inter, system-ui, sans-serif'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <div style={{ fontSize: '18px', fontWeight: 800 }}>{title}</div>
          <div style={{ fontSize: '11px', color: '#64748B' }}>Eisenhower Urgency vs Importance Taxonomy</div>
        </div>
        <span style={{ fontSize: '11px', padding: '4px 10px', background: '#3B82F622', color: '#3B82F6', borderRadius: '6px', fontWeight: 600 }}>Triage Mode</span>
      </div>
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: '14px', transform: `scale(${scaleAnim})` }}>
        {quadrants.map((q: any, idx: number) => (
          <div key={idx} style={{
            background: theme === 'dark' ? '#1E293B' : '#FFFFFF',
            borderRadius: '10px', padding: '14px', border: `1.5px solid ${q.color}44`,
            display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '13px', fontWeight: 800, color: q.color }}>{q.name}</span>
              <span style={{ fontSize: '9px', color: '#64748B' }}>{q.subtitle}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {q.tasks.map((task: string, tIdx: number) => (
                <div key={tIdx} style={{
                  background: theme === 'dark' ? '#0F172A' : '#F1F5F9',
                  padding: '6px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 500,
                  display: 'flex', alignItems: 'center', gap: '6px'
                }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: q.color }} />
                  {task}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
