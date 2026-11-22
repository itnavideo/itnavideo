import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';

export interface AutonomousLidarVisionProps {
  title?: string;
  [key: string]: any;
}

export const AutonomousLidarVision: React.FC<AutonomousLidarVisionProps> = (props) => {
  const frame = useCurrentFrame();
  const defaultValues = {"title":"Autonomous Vehicle Perception","system":"LIDAR + Camera Sensor Fusion","detectedObjects":"3 Vehicles, 2 Pedestrians","confidence":"99.4%","driveMode":"Full Self-Driving Active","accentColor":"#38BDF8","theme":"dark"};
  const {
    title = defaultValues.title,
    accentColor = defaultValues.accentColor || '#38BDF8',
    theme = defaultValues.theme || 'dark',
    ...rest
  } = props;
  
  const merged = { ...defaultValues, ...rest, title, accentColor, theme };
  const { title, system, detectedObjects, confidence, driveMode, accentColor, theme } = merged;


  return (
    <div style={{
      width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
      background: '#040810', color: '#F0F9FF',
      padding: '24px', boxSizing: 'border-box', fontFamily: 'monospace'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
        <div>
          <div style={{ fontSize: '18px', fontWeight: 900, color: '#38BDF8' }}>{title}</div>
          <div style={{ fontSize: '11px', color: '#94A3B8' }}>{system}</div>
        </div>
        <span style={{ fontSize: '11px', background: '#38BDF822', color: '#38BDF8', padding: '4px 10px', borderRadius: '6px', fontWeight: 700 }}>{driveMode}</span>
      </div>
      <div style={{ flex: 1, border: '1px dashed #38BDF844', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
        <div style={{ width: '40px', height: '60px', border: '2px solid #38BDF8', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#38BDF8', fontSize: '10px' }}>
          EGO
        </div>
        <div style={{ position: 'absolute', top: '20px', left: '40px', border: '1px solid #10B981', padding: '2px 6px', fontSize: '9px', color: '#10B981' }}>
          PED 1 [3.2m]
        </div>
        <div style={{ position: 'absolute', top: '15px', right: '40px', border: '1px solid #F59E0B', padding: '2px 6px', fontSize: '9px', color: '#F59E0B' }}>
          CAR 1 [8.5m]
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', fontSize: '10px', color: '#64748B' }}>
        <span>Tracked: {detectedObjects}</span>
        <span>Neural Confidence: {confidence}</span>
      </div>
    </div>
  );
};
