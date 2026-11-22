import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';

export interface EVChargingStationHubProps {
  title?: string;
  [key: string]: any;
}

export const EVChargingStationHub: React.FC<EVChargingStationHubProps> = (props) => {
  const frame = useCurrentFrame();
  const defaultValues = {"title":"Ultra-Fast DC Supercharger","stallId":"Stall 4B (350 kW CCS)","batteryPercent":78,"chargingRateKw":"240 kW","energyDeliveredKwh":"52.4 kWh","sessionDuration":"18 min 40 sec","accentColor":"#10B981","theme":"dark"};
  const {
    title = defaultValues.title,
    accentColor = defaultValues.accentColor || '#38BDF8',
    theme = defaultValues.theme || 'dark',
    ...rest
  } = props;
  
  const merged = { ...defaultValues, ...rest, title, accentColor, theme };
  const { title, stallId, batteryPercent, chargingRateKw, energyDeliveredKwh, sessionDuration, accentColor, theme } = merged;


  const pulse = Math.sin(frame / 6) * 0.05 + 1;
  return (
    <div style={{
      width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
      background: theme === 'dark' ? '#04160E' : '#ECFDF5',
      color: theme === 'dark' ? '#ECFDF5' : '#064E3B',
      padding: '24px', boxSizing: 'border-box', fontFamily: 'Inter, system-ui, sans-serif'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <div style={{ fontSize: '18px', fontWeight: 800 }}>{title}</div>
          <div style={{ fontSize: '11px', color: '#10B981' }}>{stallId}</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '16px', transform: `scale(${pulse})` }}>⚡</span>
          <span style={{ fontSize: '14px', fontWeight: 900, color: '#10B981' }}>{chargingRateKw}</span>
        </div>
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ fontSize: '12px', fontWeight: 700 }}>State of Charge (SoC)</span>
          <span style={{ fontSize: '24px', fontWeight: 900, color: '#10B981' }}>{batteryPercent}%</span>
        </div>
        <div style={{ width: '100%', height: '12px', background: theme === 'dark' ? '#0F2E1E' : '#A7F3D0', borderRadius: '6px', overflow: 'hidden' }}>
          <div style={{ width: `${batteryPercent}%`, height: '100%', background: '#10B981' }} />
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#6EE7B7' }}>
        <span>Energy: {energyDeliveredKwh}</span>
        <span>Session: {sessionDuration}</span>
      </div>
    </div>
  );
};
