import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';

export interface MilestoneRoadmapTrackerProps {
  title?: string;
  [key: string]: any;
}

export const MilestoneRoadmapTracker: React.FC<MilestoneRoadmapTrackerProps> = (props) => {
  const frame = useCurrentFrame();
  const defaultValues = {"title":"2026 Product Milestone Roadmap","quarters":[{"quarter":"Q1","goal":"Core Remotion Engine","status":"Completed","color":"#10B981"},{"quarter":"Q2","goal":"AI Reel Automations","status":"In Progress","color":"#3B82F6"},{"quarter":"Q3","goal":"Multi-User Teams","status":"Planned","color":"#8B5CF6"},{"quarter":"Q4","goal":"Enterprise APIs","status":"Planned","color":"#64748B"}],"currentQuarter":"Q2","accentColor":"#3B82F6","theme":"dark"};
  const merged = { ...defaultValues, ...props };
  const { title, quarters, currentQuarter, accentColor, theme } = merged;


  return (
    <div style={{
      width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
      background: theme === 'dark' ? '#0F172A' : '#F8FAFC',
      color: theme === 'dark' ? '#F8FAFC' : '#0F172A',
      padding: '24px', boxSizing: 'border-box', fontFamily: 'Inter, system-ui, sans-serif'
    }}>
      <div style={{ marginBottom: '20px' }}>
        <div style={{ fontSize: '18px', fontWeight: 800 }}>{title}</div>
        <div style={{ fontSize: '11px', color: '#64748B' }}>Strategic Product Vision & Quarterly Deliverables</div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', flex: 1 }}>
        {quarters.map((q: any, idx: number) => {
          const isCurrent = q.quarter === currentQuarter;
          return (
            <div key={idx} style={{
              background: theme === 'dark' ? '#1E293B' : '#FFFFFF',
              borderRadius: '10px', padding: '16px', border: `1.5px solid ${isCurrent ? q.color : (theme === 'dark' ? '#334155' : '#E2E8F0')}`,
              display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
              boxShadow: isCurrent ? `0 0 16px ${q.color}44` : 'none'
            }}>
              <div>
                <span style={{ fontSize: '16px', fontWeight: 900, color: q.color }}>{q.quarter}</span>
                <div style={{ fontSize: '13px', fontWeight: 700, marginTop: '8px' }}>{q.goal}</div>
              </div>
              <span style={{ fontSize: '10px', fontWeight: 700, padding: '4px 8px', borderRadius: '4px', background: `${q.color}22`, color: q.color, width: 'fit-content' }}>
                {q.status}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
