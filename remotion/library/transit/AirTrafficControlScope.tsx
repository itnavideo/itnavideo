import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';

export interface AirTrafficControlScopeProps {
  title?: string;
  [key: string]: any;
}

export const AirTrafficControlScope: React.FC<AirTrafficControlScopeProps> = (props) => {
  const frame = useCurrentFrame();
  const defaultValues = {"title":"Sector 4 ATC Radar Scope","frequency":"121.5 MHz VHF","activeTargets":6,"sweepRadius":"60 Nautical Miles","accentColor":"#10B981","theme":"dark"};
  const {
    title = defaultValues.title,
    accentColor = defaultValues.accentColor || '#38BDF8',
    theme = defaultValues.theme || 'dark',
    ...rest
  } = props;
  
  const merged = { ...defaultValues, ...rest, title, accentColor, theme };
  const { title, frequency, activeTargets, sweepRadius, accentColor, theme } = merged;


  const rot = (frame * 3) % 360;
  return (
    <div style={{
      width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
      background: '#03140C', color: '#ECFDF5',
      padding: '24px', boxSizing: 'border-box', fontFamily: 'monospace'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <div style={{ fontSize: '16px', fontWeight: 900, color: '#10B981' }}>{title}</div>
        <div style={{ fontSize: '11px', color: '#34D399' }}>{frequency}</div>
      </div>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{
          width: '160px', height: '160px', borderRadius: '50%', border: '2px solid #10B981',
          position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 0 20px rgba(16, 185, 129, 0.3)'
        }}>
          <div style={{ position: 'absolute', width: '100%', height: '1px', background: '#10B98144' }} />
          <div style={{ position: 'absolute', height: '100%', width: '1px', background: '#10B98144' }} />
          <div style={{ position: 'absolute', width: '50%', height: '2px', background: '#34D399', top: '50%', left: '50%', transformOrigin: '0 0', transform: `rotate(${rot}deg)` }} />
          <span style={{ fontSize: '10px', color: '#10B981', position: 'absolute', top: '30px', left: '40px' }}>UA842 ↑320</span>
        </div>
      </div>
      <div style={{ fontSize: '10px', color: '#059669', textAlign: 'center' }}>
        Range: {sweepRadius} • Targets: {activeTargets}
      </div>
    </div>
  );
};
