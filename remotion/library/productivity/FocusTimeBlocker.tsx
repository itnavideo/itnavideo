import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';

export interface FocusTimeBlockerProps {
  title?: string;
  [key: string]: any;
}

export const FocusTimeBlocker: React.FC<FocusTimeBlockerProps> = (props) => {
  const frame = useCurrentFrame();
  const defaultValues = {"title":"Deep Work Shield","focusDurationMinutes":90,"blockedNotifications":24,"soundscape":"Binaural Alpha Waves","accentColor":"#3B82F6","theme":"dark"};
  const {
    title = defaultValues.title,
    accentColor = defaultValues.accentColor || '#3B82F6',
    theme = defaultValues.theme || 'dark',
    ...rest
  } = props;
  
  const merged = { ...defaultValues, ...rest, title, accentColor, theme };
  const { title, focusDurationMinutes, blockedNotifications, soundscape, accentColor, theme } = merged;


  const wave = Math.sin(frame / 6) * 12;
  return (
    <div style={{
      width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      background: theme === 'dark' ? '#070C18' : '#F0F9FF',
      color: theme === 'dark' ? '#F0F9FF' : '#0C4A6E',
      padding: '24px', boxSizing: 'border-box', fontFamily: 'Inter, system-ui, sans-serif'
    }}>
      <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#3B82F622', border: '2px solid #3B82F6', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
      </div>
      <div style={{ fontSize: '20px', fontWeight: 800 }}>{title}</div>
      <div style={{ fontSize: '11px', color: '#38BDF8', marginTop: '4px' }}>Do Not Disturb Active • {soundscape}</div>
      <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
        <div style={{ textAlign: 'center', background: theme === 'dark' ? '#0F172A' : '#E0F2FE', padding: '10px 16px', borderRadius: '8px' }}>
          <div style={{ fontSize: '18px', fontWeight: 900, color: '#38BDF8' }}>{focusDurationMinutes} min</div>
          <div style={{ fontSize: '10px', color: '#64748B' }}>Target Focus</div>
        </div>
        <div style={{ textAlign: 'center', background: theme === 'dark' ? '#0F172A' : '#E0F2FE', padding: '10px 16px', borderRadius: '8px' }}>
          <div style={{ fontSize: '18px', fontWeight: 900, color: '#EF4444' }}>{blockedNotifications}</div>
          <div style={{ fontSize: '10px', color: '#64748B' }}>Silenced Pings</div>
        </div>
      </div>
    </div>
  );
};
