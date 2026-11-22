import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';

export interface HabitStreakTrackerProps {
  title?: string;
  [key: string]: any;
}

export const HabitStreakTracker: React.FC<HabitStreakTrackerProps> = (props) => {
  const frame = useCurrentFrame();
  const defaultValues = {"title":"Daily Coding & Shipping Streak","habitName":"Production Commit","streakDays":47,"gridWeeks":8,"bestStreak":65,"accentColor":"#10B981","theme":"dark"};
  const merged = { ...defaultValues, ...props };
  const { title, habitName, streakDays, gridWeeks, bestStreak, accentColor, theme } = merged;


  const pulse = Math.sin(frame / 8) * 0.08 + 1;
  return (
    <div style={{
      width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
      background: theme === 'dark' ? '#04160E' : '#ECFDF5',
      color: theme === 'dark' ? '#ECFDF5' : '#064E3B',
      padding: '24px', boxSizing: 'border-box', fontFamily: 'Inter, system-ui, sans-serif'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <div style={{ fontSize: '18px', fontWeight: 800 }}>{title}</div>
          <div style={{ fontSize: '11px', color: '#10B981' }}>Habit: {habitName}</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '24px', transform: `scale(${pulse})` }}>🔥</span>
          <span style={{ fontSize: '22px', fontWeight: 900, color: '#10B981' }}>{streakDays} Days</span>
        </div>
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: '6px' }}>
          {Array.from({ length: 32 }).map((_, idx) => {
            const active = idx < 28;
            return (
              <div key={idx} style={{
                height: '24px', borderRadius: '4px',
                background: active ? '#10B981' : (theme === 'dark' ? '#0E3A24' : '#D1FAE5'),
                opacity: active ? (0.4 + (idx % 5) * 0.15) : 0.3
              }} />
            );
          })}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '14px', fontSize: '11px', color: '#6EE7B7' }}>
          <span>Current Streak: {streakDays} days</span>
          <span>Best Streak: {bestStreak} days</span>
        </div>
      </div>
    </div>
  );
};
