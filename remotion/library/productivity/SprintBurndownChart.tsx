import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';

export interface SprintBurndownChartProps {
  title?: string;
  [key: string]: any;
}

export const SprintBurndownChart: React.FC<SprintBurndownChartProps> = (props) => {
  const frame = useCurrentFrame();
  const defaultValues = {"title":"Sprint 14 Burndown Velocity","sprintName":"Mobile Core V2","idealPoints":[100,80,60,40,20,0],"actualPoints":[100,88,72,48,30],"currentDay":4,"totalDays":5,"accentColor":"#06B6D4","theme":"dark"};
  const merged = { ...defaultValues, ...props };
  const { title, sprintName, idealPoints, actualPoints, currentDay, totalDays, accentColor, theme } = merged;


  const animRatio = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: 'clamp' });
  return (
    <div style={{
      width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
      background: theme === 'dark' ? '#04151C' : '#ECFEFF',
      color: theme === 'dark' ? '#ECFEFF' : '#083344',
      padding: '24px', boxSizing: 'border-box', fontFamily: 'Inter, system-ui, sans-serif'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <div style={{ fontSize: '18px', fontWeight: 800 }}>{title}</div>
          <div style={{ fontSize: '11px', color: '#06B6D4' }}>{sprintName} — 30 Story Points Remaining</div>
        </div>
        <div style={{ display: 'flex', gap: '12px', fontSize: '11px' }}>
          <span style={{ color: '#94A3B8' }}>--- Ideal</span>
          <span style={{ color: '#06B6D4', fontWeight: 700 }}>— Actual</span>
        </div>
      </div>
      <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'flex-end', borderLeft: '2px solid #0E7490', borderBottom: '2px solid #0E7490', padding: '10px' }}>
        <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', overflow: 'visible' }}>
          <line x1="0%" y1="0%" x2="100%" y2="100%" stroke="#64748B" strokeWidth="2" strokeDasharray="4 4" />
          <polyline
            fill="none" stroke="#06B6D4" strokeWidth="3"
            points="0,10 80,45 160,80 240,150 320,190"
            strokeDasharray="400"
            strokeDashoffset={400 * (1 - animRatio)}
          />
        </svg>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', fontSize: '10px', color: '#64748B' }}>
        <span>Day 1</span><span>Day 2</span><span>Day 3</span><span>Day 4 (Today)</span><span>Day 5</span>
      </div>
    </div>
  );
};
