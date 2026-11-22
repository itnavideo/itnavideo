import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';

export interface SLAEscalationTrackerProps {
  title?: string;
  [key: string]: any;
}

export const SLAEscalationTracker: React.FC<SLAEscalationTrackerProps> = (props) => {
  const frame = useCurrentFrame();
  const defaultValues = {"title":"Incident SLA Tracker","ticketId":"INC-9042","timeRemaining":"18m 42s","slaTarget":"45m 00s","escalationLevel":"Tier 2 Escalated","priority":"P1 - Critical","accentColor":"#EF4444","theme":"dark"};
  const merged = { ...defaultValues, ...props };
  const { title, ticketId, timeRemaining, slaTarget, escalationLevel, priority, accentColor, theme } = merged;


  const blink = Math.floor(frame / 15) % 2 === 0;
  return (
    <div style={{
      width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
      background: theme === 'dark' ? '#180B0B' : '#FEF2F2',
      color: theme === 'dark' ? '#FEF2F2' : '#991B1B',
      padding: '24px', boxSizing: 'border-box', fontFamily: 'Inter, system-ui, sans-serif'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <div style={{ fontSize: '18px', fontWeight: 800 }}>{title} ({ticketId})</div>
          <div style={{ fontSize: '11px', color: '#EF4444', fontWeight: 700 }}>{priority}</div>
        </div>
        <span style={{ fontSize: '11px', background: '#EF4444', color: '#FFF', padding: '4px 10px', borderRadius: '6px', fontWeight: 700, opacity: blink ? 1 : 0.7 }}>
          {escalationLevel}
        </span>
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ fontSize: '36px', fontWeight: 900, color: '#EF4444', letterSpacing: '1px' }}>{timeRemaining}</div>
        <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '6px' }}>Target: {slaTarget} until breach</div>
        <div style={{ width: '80%', height: '8px', background: theme === 'dark' ? '#3F1616' : '#FEE2E2', borderRadius: '4px', marginTop: '16px', overflow: 'hidden' }}>
          <div style={{ width: '42%', height: '100%', background: '#EF4444' }} />
        </div>
      </div>
    </div>
  );
};
