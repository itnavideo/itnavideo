import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';

export interface TimesheetTrackerCardProps {
  title?: string;
  [key: string]: any;
}

export const TimesheetTrackerCard: React.FC<TimesheetTrackerCardProps> = (props) => {
  const frame = useCurrentFrame();
  const defaultValues = {"title":"Weekly Billable Hours","employeeName":"Julian Vance","days":[{"day":"Mon","hours":8.5,"billable":7.5},{"day":"Tue","hours":9,"billable":8},{"day":"Wed","hours":8,"billable":8},{"day":"Thu","hours":7.5,"billable":6.5},{"day":"Fri","hours":6,"billable":5}],"totalHours":39,"billableRate":"$140/hr","accentColor":"#10B981","theme":"dark"};
  const {
    title = defaultValues.title,
    accentColor = defaultValues.accentColor || '#3B82F6',
    theme = defaultValues.theme || 'dark',
    ...rest
  } = props;
  
  const merged = { ...defaultValues, ...rest, title, accentColor, theme };
  const { title, employeeName, days, totalHours, billableRate, accentColor, theme } = merged;


  const grow = interpolate(frame, [0, 25], [0, 1], { extrapolateRight: 'clamp' });
  return (
    <div style={{
      width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
      background: theme === 'dark' ? '#0F172A' : '#F8FAFC',
      color: theme === 'dark' ? '#F8FAFC' : '#0F172A',
      padding: '24px', boxSizing: 'border-box', fontFamily: 'Inter, system-ui, sans-serif'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <div style={{ fontSize: '18px', fontWeight: 800 }}>{title}</div>
          <div style={{ fontSize: '11px', color: '#64748B' }}>Consultant: {employeeName} • {billableRate}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '20px', fontWeight: 800, color: '#10B981' }}>{totalHours} hrs</div>
          <div style={{ fontSize: '10px', color: '#64748B' }}>35.0 Billable</div>
        </div>
      </div>
      <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', gap: '16px', paddingBottom: '10px' }}>
        {days.map((d: any, idx: number) => {
          const barH = (d.hours / 10) * 140 * grow;
          return (
            <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '10px', color: '#10B981', fontWeight: 700 }}>{d.hours}h</span>
              <div style={{ width: '32px', height: `${barH}px`, background: '#10B981', borderRadius: '6px 6px 0 0', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: `${(d.billable / d.hours) * 100}%`, background: '#059669' }} />
              </div>
              <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>{d.day}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
