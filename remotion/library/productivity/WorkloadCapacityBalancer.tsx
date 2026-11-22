import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';

export interface WorkloadCapacityBalancerProps {
  title?: string;
  [key: string]: any;
}

export const WorkloadCapacityBalancer: React.FC<WorkloadCapacityBalancerProps> = (props) => {
  const frame = useCurrentFrame();
  const defaultValues = {"title":"Engineering Team Workload","teamMembers":[{"name":"Dave Miller","allocation":92,"role":"Backend Lead"},{"name":"Elena Zhou","allocation":115,"role":"Frontend Architect"},{"name":"Carlos Gomez","allocation":70,"role":"DevOps / SRE"},{"name":"Maya Patel","allocation":85,"role":"AI / Remotion"}],"thresholdWarning":100,"accentColor":"#3B82F6","theme":"dark"};
  const {
    title = defaultValues.title,
    accentColor = defaultValues.accentColor || '#3B82F6',
    theme = defaultValues.theme || 'dark',
    ...rest
  } = props;
  
  const merged = { ...defaultValues, ...rest, title, accentColor, theme };
  const { title, teamMembers, thresholdWarning, accentColor, theme } = merged;


  return (
    <div style={{
      width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
      background: theme === 'dark' ? '#0B0F19' : '#F8FAFC',
      color: theme === 'dark' ? '#F8FAFC' : '#0F172A',
      padding: '24px', boxSizing: 'border-box', fontFamily: 'Inter, system-ui, sans-serif'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
        <div>
          <div style={{ fontSize: '18px', fontWeight: 800 }}>{title}</div>
          <div style={{ fontSize: '11px', color: '#64748B' }}>Sprint 42 Resource Capacity & Rebalancing</div>
        </div>
        <span style={{ fontSize: '11px', padding: '4px 10px', background: '#EF444422', color: '#EF4444', borderRadius: '6px', fontWeight: 700 }}>Max Cap: 100%</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
        {teamMembers.map((m: any, idx: number) => {
          const isOver = m.allocation > thresholdWarning;
          return (
            <div key={idx} style={{
              background: theme === 'dark' ? '#111827' : '#FFFFFF',
              borderRadius: '8px', padding: '12px 14px', border: '1px solid ' + (theme === 'dark' ? '#1F2937' : '#E2E8F0')
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '12px', fontWeight: 700 }}>{m.name} <span style={{ fontSize: '10px', color: '#64748B', fontWeight: 400 }}>({m.role})</span></span>
                <span style={{ fontSize: '11px', fontWeight: 800, color: isOver ? '#EF4444' : '#10B981' }}>{m.allocation}%</span>
              </div>
              <div style={{ width: '100%', height: '6px', background: theme === 'dark' ? '#1F2937' : '#E2E8F0', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: `${Math.min(m.allocation, 100)}%`, height: '100%', background: isOver ? '#EF4444' : '#3B82F6', borderRadius: '3px' }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
