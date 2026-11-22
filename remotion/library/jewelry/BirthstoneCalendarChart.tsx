import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';

export interface BirthstoneCalendarChartProps {
  title?: string;
  [key: string]: any;
}

export const BirthstoneCalendarChart: React.FC<BirthstoneCalendarChartProps> = (props) => {
  const frame = useCurrentFrame();
  const defaultValues = {"title":"Traditional 12-Month Birthstones","birthstones":[{"month":"Jan","stone":"Garnet","color":"#DC2626"},{"month":"Feb","stone":"Amethyst","color":"#9333EA"},{"month":"Mar","stone":"Aquamarine","color":"#38BDF8"},{"month":"Apr","stone":"Diamond","color":"#E2E8F0"},{"month":"May","stone":"Emerald","color":"#10B981"},{"month":"Jun","stone":"Pearl","color":"#F8FAFC"}],"accentColor":"#38BDF8","theme":"dark"};
  const {
    title = defaultValues.title,
    accentColor = defaultValues.accentColor || '#38BDF8',
    theme = defaultValues.theme || 'dark',
    ...rest
  } = props;
  
  const merged = { ...defaultValues, ...rest, title, accentColor, theme };
  const { title, birthstones, accentColor, theme } = merged;


  return (
    <div style={{
      width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
      background: theme === 'dark' ? '#090D16' : '#F8FAFC',
      color: theme === 'dark' ? '#F8FAFC' : '#0F172A',
      padding: '24px', boxSizing: 'border-box', fontFamily: 'Inter, system-ui, sans-serif'
    }}>
      <div style={{ marginBottom: '16px' }}>
        <div style={{ fontSize: '18px', fontWeight: 800 }}>{title}</div>
        <div style={{ fontSize: '11px', color: '#64748B' }}>Astrological & Traditional Gemstone Calendar</div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '10px', flex: 1 }}>
        {birthstones.map((b: any, idx: number) => (
          <div key={idx} style={{
            background: theme === 'dark' ? '#111827' : '#FFFFFF',
            borderRadius: '8px', padding: '12px', borderTop: `4px solid ${b.color}`,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
          }}>
            <span style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 600 }}>{b.month}</span>
            <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: b.color, margin: '8px 0', boxShadow: `0 0 10px ${b.color}88` }} />
            <span style={{ fontSize: '11px', fontWeight: 700 }}>{b.stone}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
