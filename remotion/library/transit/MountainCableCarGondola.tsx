import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';

export interface MountainCableCarGondolaProps {
  title?: string;
  [key: string]: any;
}

export const MountainCableCarGondola: React.FC<MountainCableCarGondolaProps> = (props) => {
  const frame = useCurrentFrame();
  const defaultValues = {"title":"Alpine Aerial Cable Car","resort":"Matterhorn Glacier Paradise","altitudeGain":"1,620 m → 3,883 m","cabinSpeed":"7.5 m/s","cableTension":"Optimal (620 kN)","accentColor":"#38BDF8","theme":"dark"};
  const {
    title = defaultValues.title,
    accentColor = defaultValues.accentColor || '#38BDF8',
    theme = defaultValues.theme || 'dark',
    ...rest
  } = props;
  
  const merged = { ...defaultValues, ...rest, title, accentColor, theme };
  const { title, resort, altitudeGain, cabinSpeed, cableTension, accentColor, theme } = merged;


  const gondolaPos = interpolate(frame, [0, 30], [15, 80], { extrapolateRight: 'clamp' });
  return (
    <div style={{
      width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
      background: theme === 'dark' ? '#09101D' : '#F8FAFC',
      color: theme === 'dark' ? '#F8FAFC' : '#0F172A',
      padding: '24px', boxSizing: 'border-box', fontFamily: 'Inter, system-ui, sans-serif'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <div style={{ fontSize: '18px', fontWeight: 800 }}>{title}</div>
          <div style={{ fontSize: '11px', color: '#38BDF8' }}>{resort} • {altitudeGain}</div>
        </div>
        <span style={{ fontSize: '11px', background: '#38BDF822', color: '#38BDF8', padding: '4px 10px', borderRadius: '6px', fontWeight: 700 }}>Speed {cabinSpeed}</span>
      </div>
      <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center' }}>
        <div style={{ position: 'absolute', left: '10%', right: '10%', height: '2px', background: '#64748B', transform: 'rotate(-10deg)' }} />
        <div style={{ position: 'absolute', left: `${gondolaPos}%`, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ width: '24px', height: '20px', background: '#38BDF8', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF', fontSize: '11px' }}>
            🚠
          </div>
        </div>
      </div>
      <div style={{ fontSize: '11px', color: '#94A3B8', textAlign: 'center' }}>
        Tension: {cableTension} • Continuous 3S Gondola System
      </div>
    </div>
  );
};
