import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';

export interface MicromobilityScooterLockProps {
  title?: string;
  [key: string]: any;
}

export const MicromobilityScooterLock: React.FC<MicromobilityScooterLockProps> = (props) => {
  const frame = useCurrentFrame();
  const defaultValues = {"title":"Shared E-Scooter Unlock","scooterId":"#SCOOT-410","batteryRange":"28 km Range (85%)","rate":"$1.00 unlock + $0.25/min","maxSpeed":"25 km/h","status":"Ready to Ride","accentColor":"#10B981","theme":"dark"};
  const {
    title = defaultValues.title,
    accentColor = defaultValues.accentColor || '#38BDF8',
    theme = defaultValues.theme || 'dark',
    ...rest
  } = props;
  
  const merged = { ...defaultValues, ...rest, title, accentColor, theme };
  const { title, scooterId, batteryRange, rate, maxSpeed, status, accentColor, theme } = merged;


  return (
    <div style={{
      width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
      background: theme === 'dark' ? '#0B130E' : '#ECFDF5',
      color: theme === 'dark' ? '#ECFDF5' : '#064E3B',
      padding: '24px', boxSizing: 'border-box', fontFamily: 'Inter, system-ui, sans-serif'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <div style={{ fontSize: '18px', fontWeight: 800 }}>{title}</div>
          <div style={{ fontSize: '11px', color: '#10B981' }}>Vehicle {scooterId}</div>
        </div>
        <span style={{ fontSize: '11px', background: '#10B98122', color: '#10B981', padding: '4px 10px', borderRadius: '6px', fontWeight: 700 }}>{status}</span>
      </div>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-around' }}>
        <div style={{ fontSize: '48px' }}>🛴</div>
        <div>
          <div style={{ fontSize: '18px', fontWeight: 800, color: '#10B981' }}>{batteryRange}</div>
          <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '4px' }}>Max Speed: {maxSpeed}</div>
          <div style={{ fontSize: '11px', color: '#34D399', marginTop: '2px' }}>{rate}</div>
        </div>
      </div>
    </div>
  );
};
