import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';

export interface FlightRadarTrackerProps {
  title?: string;
  [key: string]: any;
}

export const FlightRadarTracker: React.FC<FlightRadarTrackerProps> = (props) => {
  const frame = useCurrentFrame();
  const defaultValues = {"title":"Flight BA 178 Tracking","origin":"JFK (New York)","destination":"LHR (London Heathrow)","altitude":"38,000 ft","groundSpeed":"520 kts (963 km/h)","aircraft":"Boeing 777-300ER","flightStatus":"En Route • On Time","eta":"06:45 GMT","accentColor":"#38BDF8","theme":"dark"};
  const merged = { ...defaultValues, ...props };
  const { title, origin, destination, altitude, groundSpeed, aircraft, flightStatus, eta, accentColor, theme } = merged;


  const planePos = interpolate(frame, [0, 30], [20, 80], { extrapolateRight: 'clamp' });
  return (
    <div style={{
      width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
      background: theme === 'dark' ? '#090E17' : '#F0F9FF',
      color: theme === 'dark' ? '#F0F9FF' : '#0C4A6E',
      padding: '24px', boxSizing: 'border-box', fontFamily: 'Inter, system-ui, sans-serif'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <div style={{ fontSize: '18px', fontWeight: 800 }}>{title}</div>
          <div style={{ fontSize: '11px', color: '#38BDF8' }}>{aircraft} • {flightStatus}</div>
        </div>
        <span style={{ fontSize: '11px', background: '#10B98122', color: '#10B981', padding: '4px 10px', borderRadius: '6px', fontWeight: 700 }}>ETA {eta}</span>
      </div>
      <div style={{ position: 'relative', height: '60px', display: 'flex', alignItems: 'center', margin: '10px 0' }}>
        <div style={{ position: 'absolute', left: '10%', right: '10%', height: '3px', background: theme === 'dark' ? '#1E293B' : '#BAE6FD' }} />
        <div style={{ position: 'absolute', left: `${planePos}%`, transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <span style={{ fontSize: '20px', transform: 'rotate(90deg)' }}>✈️</span>
        </div>
        <div style={{ position: 'absolute', left: '10%', top: '34px', fontSize: '12px', fontWeight: 800 }}>{origin}</div>
        <div style={{ position: 'absolute', right: '10%', top: '34px', fontSize: '12px', fontWeight: 800 }}>{destination}</div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: 'auto' }}>
        <div style={{ background: theme === 'dark' ? '#111A29' : '#FFFFFF', padding: '10px 14px', borderRadius: '8px', border: '1px solid ' + (theme === 'dark' ? '#1E293B' : '#E0F2FE') }}>
          <div style={{ fontSize: '10px', color: '#94A3B8' }}>Cruise Altitude</div>
          <div style={{ fontSize: '16px', fontWeight: 800, color: '#38BDF8' }}>{altitude}</div>
        </div>
        <div style={{ background: theme === 'dark' ? '#111A29' : '#FFFFFF', padding: '10px 14px', borderRadius: '8px', border: '1px solid ' + (theme === 'dark' ? '#1E293B' : '#E0F2FE') }}>
          <div style={{ fontSize: '10px', color: '#94A3B8' }}>Ground Speed</div>
          <div style={{ fontSize: '16px', fontWeight: 800, color: '#10B981' }}>{groundSpeed}</div>
        </div>
      </div>
    </div>
  );
};
