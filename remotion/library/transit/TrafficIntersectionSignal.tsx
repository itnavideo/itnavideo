import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';

export interface TrafficIntersectionSignalProps {
  title?: string;
  [key: string]: any;
}

export const TrafficIntersectionSignal: React.FC<TrafficIntersectionSignalProps> = (props) => {
  const frame = useCurrentFrame();
  const defaultValues = {"title":"Traffic Signal Controller #IT-901","intersection":"Main St & 5th Avenue","activePhase":"North-South Green","secondsRemaining":18,"accentColor":"#10B981","theme":"dark"};
  const merged = { ...defaultValues, ...props };
  const { title, intersection, activePhase, secondsRemaining, accentColor, theme } = merged;


  return (
    <div style={{
      width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
      background: '#0B0F19', color: '#F8FAFC',
      padding: '24px', boxSizing: 'border-box', fontFamily: 'Inter, system-ui, sans-serif'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <div style={{ fontSize: '18px', fontWeight: 800 }}>{title}</div>
          <div style={{ fontSize: '11px', color: '#94A3B8' }}>{intersection}</div>
        </div>
        <span style={{ fontSize: '11px', background: '#10B98122', color: '#10B981', padding: '4px 10px', borderRadius: '6px', fontWeight: 700 }}>Adaptive Timing</span>
      </div>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '32px' }}>
        <div style={{ background: '#1E293B', borderRadius: '24px', padding: '12px', display: 'flex', flexDirection: 'column', gap: '10px', border: '3px solid #334155' }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#450A0A' }} />
          <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#451A03' }} />
          <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#22C55E', boxShadow: '0 0 16px #22C55E' }} />
        </div>
        <div>
          <div style={{ fontSize: '42px', fontWeight: 900, color: '#22C55E' }}>0:{secondsRemaining < 10 ? '0' + secondsRemaining : secondsRemaining}</div>
          <div style={{ fontSize: '12px', color: '#94A3B8' }}>Phase: {activePhase}</div>
        </div>
      </div>
    </div>
  );
};
