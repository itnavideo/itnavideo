import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';

export interface FleetTruckTelemetryProps {
  title?: string;
  [key: string]: any;
}

export const FleetTruckTelemetry: React.FC<FleetTruckTelemetryProps> = (props) => {
  const frame = useCurrentFrame();
  const defaultValues = {"title":"Freight Telematics Unit #TR-408","driver":"Marcus Kane (CDL-A)","hoursOfService":"6h 45m / 11h Max Driving","dieselFuel":"84% (820 km Range)","engineRpm":"1,420 RPM","tirePressure":"105 PSI (All Green)","accentColor":"#38BDF8","theme":"dark"};
  const {
    title = defaultValues.title,
    accentColor = defaultValues.accentColor || '#38BDF8',
    theme = defaultValues.theme || 'dark',
    ...rest
  } = props;
  
  const merged = { ...defaultValues, ...rest, title, accentColor, theme };
  const { title, driver, hoursOfService, dieselFuel, engineRpm, tirePressure, accentColor, theme } = merged;


  return (
    <div style={{
      width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
      background: theme === 'dark' ? '#0F172A' : '#F8FAFC',
      color: theme === 'dark' ? '#F8FAFC' : '#0F172A',
      padding: '24px', boxSizing: 'border-box', fontFamily: 'Inter, system-ui, sans-serif'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <div style={{ fontSize: '18px', fontWeight: 800 }}>{title}</div>
          <div style={{ fontSize: '11px', color: '#38BDF8' }}>Driver: {driver}</div>
        </div>
        <span style={{ fontSize: '11px', background: '#10B98122', color: '#10B981', padding: '4px 10px', borderRadius: '6px', fontWeight: 700 }}>ELD Compliant</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', flex: 1 }}>
        <div style={{ background: theme === 'dark' ? '#1E293B' : '#FFFFFF', padding: '12px 14px', borderRadius: '8px' }}>
          <div style={{ fontSize: '10px', color: '#94A3B8' }}>Hours of Service</div>
          <div style={{ fontSize: '15px', fontWeight: 800, color: '#38BDF8', marginTop: '4px' }}>{hoursOfService}</div>
        </div>
        <div style={{ background: theme === 'dark' ? '#1E293B' : '#FFFFFF', padding: '12px 14px', borderRadius: '8px' }}>
          <div style={{ fontSize: '10px', color: '#94A3B8' }}>Diesel Fuel Tank</div>
          <div style={{ fontSize: '15px', fontWeight: 800, color: '#10B981', marginTop: '4px' }}>{dieselFuel}</div>
        </div>
        <div style={{ background: theme === 'dark' ? '#1E293B' : '#FFFFFF', padding: '12px 14px', borderRadius: '8px' }}>
          <div style={{ fontSize: '10px', color: '#94A3B8' }}>Engine Telemetry</div>
          <div style={{ fontSize: '15px', fontWeight: 800, color: '#F59E0B', marginTop: '4px' }}>{engineRpm}</div>
        </div>
        <div style={{ background: theme === 'dark' ? '#1E293B' : '#FFFFFF', padding: '12px 14px', borderRadius: '8px' }}>
          <div style={{ fontSize: '10px', color: '#94A3B8' }}>Tire Pressure (TPMS)</div>
          <div style={{ fontSize: '15px', fontWeight: 800, color: '#38BDF8', marginTop: '4px' }}>{tirePressure}</div>
        </div>
      </div>
    </div>
  );
};
