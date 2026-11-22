import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';

export interface HighSpeedTrainSpeedometerProps {
  title?: string;
  [key: string]: any;
}

export const HighSpeedTrainSpeedometer: React.FC<HighSpeedTrainSpeedometerProps> = (props) => {
  const frame = useCurrentFrame();
  const defaultValues = {"title":"Bullet Train Cockpit Telemetry","speedKmh":320,"tractionPowerKw":"9,600 kW","lineVoltage":"25 kV AC 50Hz","cabSignal":"CAB 320 OK","trainModel":"Shinkansen N700S","accentColor":"#38BDF8","theme":"dark"};
  const merged = { ...defaultValues, ...props };
  const { title, speedKmh, tractionPowerKw, lineVoltage, cabSignal, trainModel, accentColor, theme } = merged;


  return (
    <div style={{
      width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
      background: theme === 'dark' ? '#070E1A' : '#F0F9FF',
      color: theme === 'dark' ? '#F0F9FF' : '#0C4A6E',
      padding: '24px', boxSizing: 'border-box', fontFamily: 'Inter, system-ui, sans-serif'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <div style={{ fontSize: '18px', fontWeight: 800 }}>{title}</div>
          <div style={{ fontSize: '11px', color: '#38BDF8' }}>{trainModel} • {cabSignal}</div>
        </div>
        <span style={{ fontSize: '11px', background: '#10B98122', color: '#10B981', padding: '4px 10px', borderRadius: '6px', fontWeight: 700 }}>ATC Active</span>
      </div>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
        <div style={{ fontSize: '64px', fontWeight: 900, color: '#38BDF8', letterSpacing: '-2px' }}>{speedKmh}</div>
        <div style={{ fontSize: '13px', fontWeight: 700, color: '#94A3B8', marginTop: '-8px' }}>KILOMETERS PER HOUR</div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <div style={{ background: theme === 'dark' ? '#0F1A2C' : '#FFFFFF', padding: '10px 14px', borderRadius: '8px' }}>
          <div style={{ fontSize: '10px', color: '#94A3B8' }}>Traction Power</div>
          <div style={{ fontSize: '14px', fontWeight: 800, color: '#38BDF8' }}>{tractionPowerKw}</div>
        </div>
        <div style={{ background: theme === 'dark' ? '#0F1A2C' : '#FFFFFF', padding: '10px 14px', borderRadius: '8px' }}>
          <div style={{ fontSize: '10px', color: '#94A3B8' }}>Overhead Catenary</div>
          <div style={{ fontSize: '14px', fontWeight: 800, color: '#10B981' }}>{lineVoltage}</div>
        </div>
      </div>
    </div>
  );
};
