import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';

export interface DroneDeliveryCorridorProps {
  title?: string;
  [key: string]: any;
}

export const DroneDeliveryCorridor: React.FC<DroneDeliveryCorridorProps> = (props) => {
  const frame = useCurrentFrame();
  const defaultValues = {"title":"Automated Drone Flight Corridor","droneId":"UAV-DELIVER-08","altitudeAGL":"120 m AGL","batteryLevel":"91%","payloadWeight":"1.8 kg Medical Kit","corridorStatus":"Airspace Cleared","accentColor":"#38BDF8","theme":"dark"};
  const merged = { ...defaultValues, ...props };
  const { title, droneId, altitudeAGL, batteryLevel, payloadWeight, corridorStatus, accentColor, theme } = merged;


  return (
    <div style={{
      width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
      background: theme === 'dark' ? '#09101A' : '#F0F9FF',
      color: theme === 'dark' ? '#F0F9FF' : '#0C4A6E',
      padding: '24px', boxSizing: 'border-box', fontFamily: 'Inter, system-ui, sans-serif'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <div style={{ fontSize: '18px', fontWeight: 800 }}>{title}</div>
          <div style={{ fontSize: '11px', color: '#38BDF8' }}>Vehicle: {droneId}</div>
        </div>
        <span style={{ fontSize: '11px', background: '#10B98122', color: '#10B981', padding: '4px 10px', borderRadius: '6px', fontWeight: 700 }}>{corridorStatus}</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', flex: 1 }}>
        <div style={{ background: theme === 'dark' ? '#111F33' : '#FFFFFF', borderRadius: '8px', padding: '14px' }}>
          <div style={{ fontSize: '10px', color: '#94A3B8' }}>Flight Altitude</div>
          <div style={{ fontSize: '18px', fontWeight: 800, color: '#38BDF8', marginTop: '4px' }}>{altitudeAGL}</div>
        </div>
        <div style={{ background: theme === 'dark' ? '#111F33' : '#FFFFFF', borderRadius: '8px', padding: '14px' }}>
          <div style={{ fontSize: '10px', color: '#94A3B8' }}>Battery Charge</div>
          <div style={{ fontSize: '18px', fontWeight: 800, color: '#10B981', marginTop: '4px' }}>{batteryLevel}</div>
        </div>
        <div style={{ background: theme === 'dark' ? '#111F33' : '#FFFFFF', borderRadius: '8px', padding: '14px' }}>
          <div style={{ fontSize: '10px', color: '#94A3B8' }}>Payload Delivery</div>
          <div style={{ fontSize: '14px', fontWeight: 800, color: '#F59E0B', marginTop: '4px' }}>{payloadWeight}</div>
        </div>
      </div>
    </div>
  );
};
