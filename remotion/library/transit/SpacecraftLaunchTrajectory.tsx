import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';

export interface SpacecraftLaunchTrajectoryProps {
  title?: string;
  [key: string]: any;
}

export const SpacecraftLaunchTrajectory: React.FC<SpacecraftLaunchTrajectoryProps> = (props) => {
  const frame = useCurrentFrame();
  const defaultValues = {"title":"Orbital Launch Telemetry","mission":"Artemis Heavy Orbital Insertion","velocityKmh":"28,450 km/h","altitudeKm":"185 km","stage":"Stage 2 Burn Active","downrangeDistance":"420 km","accentColor":"#F59E0B","theme":"dark"};
  const merged = { ...defaultValues, ...props };
  const { title, mission, velocityKmh, altitudeKm, stage, downrangeDistance, accentColor, theme } = merged;


  return (
    <div style={{
      width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
      background: '#040711', color: '#F8FAFC',
      padding: '24px', boxSizing: 'border-box', fontFamily: 'monospace'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <div style={{ fontSize: '18px', fontWeight: 900, color: '#F59E0B' }}>{title}</div>
          <div style={{ fontSize: '11px', color: '#94A3B8' }}>{mission}</div>
        </div>
        <span style={{ fontSize: '11px', background: '#F59E0B22', color: '#F59E0B', padding: '4px 10px', borderRadius: '6px', fontWeight: 700 }}>{stage}</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', flex: 1 }}>
        <div style={{ background: '#0D1424', borderRadius: '8px', padding: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ fontSize: '11px', color: '#94A3B8' }}>ORBITAL VELOCITY</div>
          <div style={{ fontSize: '26px', fontWeight: 900, color: '#F59E0B', marginTop: '6px' }}>{velocityKmh}</div>
          <div style={{ fontSize: '10px', color: '#64748B', marginTop: '4px' }}>Mach 23.2 Hypersonic</div>
        </div>
        <div style={{ background: '#0D1424', borderRadius: '8px', padding: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ fontSize: '11px', color: '#94A3B8' }}>APOGEE ALTITUDE</div>
          <div style={{ fontSize: '26px', fontWeight: 900, color: '#38BDF8', marginTop: '6px' }}>{altitudeKm}</div>
          <div style={{ fontSize: '10px', color: '#64748B', marginTop: '4px' }}>Downrange: {downrangeDistance}</div>
        </div>
      </div>
    </div>
  );
};
