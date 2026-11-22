import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';

export interface PomodoroTimerCardProps {
  title?: string;
  [key: string]: any;
}

export const PomodoroTimerCard: React.FC<PomodoroTimerCardProps> = (props) => {
  const frame = useCurrentFrame();
  const defaultValues = {"title":"Deep Focus Sprint","currentMinutes":24,"totalMinutes":25,"sessionsCompleted":3,"mode":"Focus Session","accentColor":"#EF4444","theme":"dark"};
  const {
    title = defaultValues.title,
    accentColor = defaultValues.accentColor || '#3B82F6',
    theme = defaultValues.theme || 'dark',
    ...rest
  } = props;
  
  const merged = { ...defaultValues, ...rest, title, accentColor, theme };
  const { title, currentMinutes, totalMinutes, sessionsCompleted, mode, accentColor, theme } = merged;


  const pulse = Math.sin(frame / 10) * 0.05 + 1;
  const radius = 64;
  const circ = 2 * Math.PI * radius;
  const progressRatio = currentMinutes / totalMinutes;
  const strokeDash = circ * progressRatio;
  return (
    <div style={{
      width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      background: theme === 'dark' ? '#0C0A09' : '#FFF7ED',
      color: theme === 'dark' ? '#FAFAF9' : '#1C1917',
      padding: '24px', boxSizing: 'border-box', fontFamily: 'Inter, system-ui, sans-serif'
    }}>
      <div style={{ fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', color: accentColor, fontWeight: 700, marginBottom: '6px' }}>{mode}</div>
      <div style={{ fontSize: '20px', fontWeight: 800, marginBottom: '20px' }}>{title}</div>
      <div style={{ position: 'relative', width: '160px', height: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width="160" height="160" viewBox="0 0 160 160">
          <circle cx="80" cy="80" r={radius} fill="none" stroke={theme === 'dark' ? '#292524' : '#FED7AA'} strokeWidth="10" />
          <circle cx="80" cy="80" r={radius} fill="none" stroke={accentColor} strokeWidth="10"
            strokeDasharray={circ} strokeDashoffset={circ - strokeDash} strokeLinecap="round"
            transform="rotate(-90 80 80)" style={{ filter: `drop-shadow(0 0 8px ${accentColor}66)` }}
          />
        </svg>
        <div style={{ position: 'absolute', textAlign: 'center', transform: `scale(${pulse})` }}>
          <div style={{ fontSize: '32px', fontWeight: 900 }}>24:18</div>
          <div style={{ fontSize: '10px', color: '#A8A29E', fontWeight: 600 }}>REMAINING</div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: '8px', marginTop: '24px' }}>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} style={{
            width: '12px', height: '12px', borderRadius: '50%',
            background: i <= sessionsCompleted ? accentColor : (theme === 'dark' ? '#292524' : '#FED7AA')
          }} />
        ))}
      </div>
      <div style={{ fontSize: '11px', color: '#78716C', marginTop: '10px' }}>Round 3 of 4 Completed</div>
    </div>
  );
};
