import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';

export interface ParkingGarageVacancyMeterProps {
  title?: string;
  [key: string]: any;
}

export const ParkingGarageVacancyMeter: React.FC<ParkingGarageVacancyMeterProps> = (props) => {
  const frame = useCurrentFrame();
  const defaultValues = {"title":"City Center Parking Garage","totalAvailable":148,"floors":[{"floor":"P1 (Ground)","spots":12,"status":"Nearly Full","color":"#EF4444"},{"floor":"P2 (Level 2)","spots":48,"status":"Spots Available","color":"#10B981"},{"floor":"P3 (Rooftop)","spots":88,"status":"Wide Open","color":"#10B981"}],"accentColor":"#10B981","theme":"dark"};
  const merged = { ...defaultValues, ...props };
  const { title, totalAvailable, floors, accentColor, theme } = merged;


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
          <div style={{ fontSize: '11px', color: '#94A3B8' }}>Ultrasonic Space Detection</div>
        </div>
        <div style={{ fontSize: '18px', fontWeight: 900, color: '#10B981' }}>{totalAvailable} SPOTS</div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
        {floors.map((f: any, idx: number) => (
          <div key={idx} style={{
            background: theme === 'dark' ? '#1E293B' : '#FFFFFF',
            borderRadius: '8px', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
          }}>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 700 }}>{f.floor}</div>
              <div style={{ fontSize: '10px', color: f.color }}>{f.status}</div>
            </div>
            <div style={{ fontSize: '20px', fontWeight: 900, color: f.color }}>{f.spots}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
