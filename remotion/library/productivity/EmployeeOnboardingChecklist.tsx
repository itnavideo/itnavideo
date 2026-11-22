import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';

export interface EmployeeOnboardingChecklistProps {
  title?: string;
  [key: string]: any;
}

export const EmployeeOnboardingChecklist: React.FC<EmployeeOnboardingChecklistProps> = (props) => {
  const frame = useCurrentFrame();
  const defaultValues = {"title":"Developer Ramp-Up Journey","employeeName":"Aisha Malik","roleTitle":"Senior Video Engineer","phases":[{"phase":"Day 1","task":"Dev environment & GitHub access","status":"done"},{"phase":"Week 1","task":"First Remotion template deployed","status":"done"},{"phase":"Month 1","task":"Full ownership of Lambda pipeline","status":"in-progress"},{"phase":"Month 3","task":"Lead architecture review","status":"queued"}],"overallProgress":60,"accentColor":"#10B981","theme":"dark"};
  const merged = { ...defaultValues, ...props };
  const { title, employeeName, roleTitle, phases, overallProgress, accentColor, theme } = merged;


  return (
    <div style={{
      width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
      background: theme === 'dark' ? '#071610' : '#ECFDF5',
      color: theme === 'dark' ? '#ECFDF5' : '#064E3B',
      padding: '24px', boxSizing: 'border-box', fontFamily: 'Inter, system-ui, sans-serif'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <div style={{ fontSize: '18px', fontWeight: 800 }}>{title}</div>
          <div style={{ fontSize: '11px', color: '#10B981' }}>{employeeName} — {roleTitle}</div>
        </div>
        <div style={{ fontSize: '16px', fontWeight: 900, color: '#10B981' }}>{overallProgress}% Ready</div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
        {phases.map((p: any, idx: number) => (
          <div key={idx} style={{
            background: theme === 'dark' ? '#0F291E' : '#FFFFFF',
            padding: '10px 14px', borderRadius: '8px', border: '1px solid #10B98133',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#10B981', width: '60px' }}>{p.phase}</span>
              <span style={{ fontSize: '12px' }}>{p.task}</span>
            </div>
            <span style={{ fontSize: '10px', fontWeight: 700, color: p.status === 'done' ? '#10B981' : '#64748B' }}>
              {p.status === 'done' ? '✓ Complete' : p.status === 'in-progress' ? '⚡ In Progress' : 'Queued'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
