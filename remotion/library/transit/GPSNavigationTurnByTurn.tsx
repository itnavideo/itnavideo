import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';

export interface GPSNavigationTurnByTurnProps {
  title?: string;
  [key: string]: any;
}

export const GPSNavigationTurnByTurn: React.FC<GPSNavigationTurnByTurnProps> = (props) => {
  const frame = useCurrentFrame();
  const defaultValues = {"title":"GPS Turn-By-Turn HUD","distanceMeters":"250 m","instruction":"In 250m, Turn Right onto Broadway Ave","nextRoad":"Broadway Ave","currentSpeed":"48 km/h","speedLimit":"50","etaTime":"12 min (6.4 km)","accentColor":"#10B981","theme":"dark"};
  const {
    title = defaultValues.title,
    accentColor = defaultValues.accentColor || '#38BDF8',
    theme = defaultValues.theme || 'dark',
    ...rest
  } = props;
  
  const merged = { ...defaultValues, ...rest, title, accentColor, theme };
  const { title, distanceMeters, instruction, nextRoad, currentSpeed, speedLimit, etaTime, accentColor, theme } = merged;


  const arrowPulse = Math.sin(frame / 6) * 4;
  return (
    <div style={{
      width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
      background: theme === 'dark' ? '#04160E' : '#ECFDF5',
      color: theme === 'dark' ? '#ECFDF5' : '#064E3B',
      padding: '24px', boxSizing: 'border-box', fontFamily: 'Inter, system-ui, sans-serif'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
        <div style={{ fontSize: '18px', fontWeight: 800 }}>{title}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '50%', border: '3px solid #EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 900, color: '#EF4444' }}>
            {speedLimit}
          </div>
          <span style={{ fontSize: '14px', fontWeight: 800 }}>{currentSpeed}</span>
        </div>
      </div>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '20px', background: theme === 'dark' ? '#0A2619' : '#FFFFFF', borderRadius: '12px', padding: '16px', border: '1px solid #10B98144' }}>
        <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `translateX(${arrowPulse}px)` }}>
          <span style={{ fontSize: '32px', color: '#FFF' }}>↱</span>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '26px', fontWeight: 900, color: '#10B981' }}>{distanceMeters}</div>
          <div style={{ fontSize: '14px', fontWeight: 700, marginTop: '2px' }}>{instruction}</div>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', fontSize: '11px', color: '#6EE7B7' }}>
        <span>Route ETA: {etaTime}</span>
        <span>GPS Signal: Strong (12 Sats)</span>
      </div>
    </div>
  );
};
