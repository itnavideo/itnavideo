import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';

export interface GanttProjectTimelineProps {
  title?: string;
  [key: string]: any;
}

export const GanttProjectTimeline: React.FC<GanttProjectTimelineProps> = (props) => {
  const frame = useCurrentFrame();
  const defaultValues = {"title":"Product Launch Timeline","tasks":[{"name":"Architecture Design","start":5,"duration":25,"progress":100,"color":"#3B82F6"},{"name":"Core Engine Build","start":20,"duration":40,"progress":75,"color":"#8B5CF6"},{"name":"UI / UX Integration","start":45,"duration":30,"progress":40,"color":"#10B981"},{"name":"Security & QA Audit","start":65,"duration":25,"progress":10,"color":"#F59E0B"}],"todayMarker":55,"accentColor":"#3B82F6","theme":"dark"};
  const {
    title = defaultValues.title,
    accentColor = defaultValues.accentColor || '#3B82F6',
    theme = defaultValues.theme || 'dark',
    ...rest
  } = props;
  
  const merged = { ...defaultValues, ...rest, title, accentColor, theme };
  const { title, tasks, todayMarker, accentColor, theme } = merged;


  const animProgress = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: 'clamp' });
  return (
    <div style={{
      width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
      background: theme === 'dark' ? '#0B0F19' : '#FFFFFF',
      color: theme === 'dark' ? '#F8FAFC' : '#0F172A',
      padding: '28px', boxSizing: 'border-box', fontFamily: 'Inter, system-ui, sans-serif'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <div style={{ fontSize: '18px', fontWeight: 700 }}>{title}</div>
          <div style={{ fontSize: '11px', color: '#64748B' }}>Multi-Phase Gantt Execution Schedule</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', background: '#EF444422', color: '#EF4444', padding: '4px 10px', borderRadius: '6px', fontWeight: 600 }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#EF4444' }} />
          Today: Day {todayMarker}
        </div>
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '14px', position: 'relative' }}>
        <div style={{ display: 'flex', borderBottom: '1px solid ' + (theme === 'dark' ? '#1E293B' : '#E2E8F0'), paddingBottom: '6px', fontSize: '11px', color: '#64748B' }}>
          <div style={{ width: '180px' }}>Task Phase</div>
          <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between' }}>
            <span>Week 1</span><span>Week 2</span><span>Week 3</span><span>Week 4</span>
          </div>
        </div>
        {tasks.map((task: any, idx: number) => (
          <div key={idx} style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ width: '180px', fontSize: '13px', fontWeight: 600, color: theme === 'dark' ? '#E2E8F0' : '#1E293B' }}>{task.name}</div>
            <div style={{ flex: 1, height: '32px', background: theme === 'dark' ? '#111827' : '#F1F5F9', borderRadius: '6px', position: 'relative', overflow: 'hidden' }}>
              <div style={{
                position: 'absolute',
                left: `${task.start}%`,
                width: `${task.duration * animProgress}%`,
                top: '4px', bottom: '4px',
                background: task.color,
                borderRadius: '4px',
                display: 'flex', alignItems: 'center', paddingLeft: '8px',
                fontSize: '10px', color: '#FFF', fontWeight: 700
              }}>
                {task.progress}%
              </div>
            </div>
          </div>
        ))}
        <div style={{
          position: 'absolute', top: '24px', bottom: '0px', left: `calc(180px + ${todayMarker}% * 0.75)`,
          width: '2px', background: '#EF4444', opacity: 0.8, pointerEvents: 'none'
        }} />
      </div>
    </div>
  );
};
