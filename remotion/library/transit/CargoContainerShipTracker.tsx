import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';

export interface CargoContainerShipTrackerProps {
  title?: string;
  [key: string]: any;
}

export const CargoContainerShipTracker: React.FC<CargoContainerShipTrackerProps> = (props) => {
  const frame = useCurrentFrame();
  const defaultValues = {"title":"AIS Vessel Tracker — Ever Golden","mmsi":"235102940","speedKnots":"19.4 kts","courseDeg":"142° SE","destination":"Rotterdam Port (NLD)","capacityTEU":"20,124 TEU","draftDepth":"15.8 m","accentColor":"#0EA5E9","theme":"dark"};
  const {
    title = defaultValues.title,
    accentColor = defaultValues.accentColor || '#38BDF8',
    theme = defaultValues.theme || 'dark',
    ...rest
  } = props;
  
  const merged = { ...defaultValues, ...rest, title, accentColor, theme };
  const { title, mmsi, speedKnots, courseDeg, destination, capacityTEU, draftDepth, accentColor, theme } = merged;


  return (
    <div style={{
      width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
      background: theme === 'dark' ? '#08131D' : '#F0F9FF',
      color: theme === 'dark' ? '#F0F9FF' : '#0369A1',
      padding: '24px', boxSizing: 'border-box', fontFamily: 'Inter, system-ui, sans-serif'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <div style={{ fontSize: '18px', fontWeight: 800 }}>{title}</div>
          <div style={{ fontSize: '11px', color: '#38BDF8' }}>MMSI: {mmsi} • Ultra Large Container Vessel</div>
        </div>
        <span style={{ fontSize: '11px', background: '#0EA5E922', color: '#38BDF8', padding: '4px 10px', borderRadius: '6px', fontWeight: 700 }}>AIS Live</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', flex: 1 }}>
        <div style={{ background: theme === 'dark' ? '#0F2336' : '#FFFFFF', borderRadius: '8px', padding: '14px' }}>
          <div style={{ fontSize: '10px', color: '#94A3B8' }}>Nautical Speed</div>
          <div style={{ fontSize: '18px', fontWeight: 800, color: '#38BDF8', marginTop: '4px' }}>{speedKnots}</div>
          <div style={{ fontSize: '10px', color: '#64748B', marginTop: '2px' }}>Course: {courseDeg}</div>
        </div>
        <div style={{ background: theme === 'dark' ? '#0F2336' : '#FFFFFF', borderRadius: '8px', padding: '14px' }}>
          <div style={{ fontSize: '10px', color: '#94A3B8' }}>Cargo Capacity</div>
          <div style={{ fontSize: '18px', fontWeight: 800, color: '#10B981', marginTop: '4px' }}>{capacityTEU}</div>
          <div style={{ fontSize: '10px', color: '#64748B', marginTop: '2px' }}>Draft: {draftDepth}</div>
        </div>
        <div style={{ background: theme === 'dark' ? '#0F2336' : '#FFFFFF', borderRadius: '8px', padding: '14px' }}>
          <div style={{ fontSize: '10px', color: '#94A3B8' }}>Destination Port</div>
          <div style={{ fontSize: '16px', fontWeight: 800, color: '#F59E0B', marginTop: '4px' }}>{destination}</div>
          <div style={{ fontSize: '10px', color: '#64748B', marginTop: '2px' }}>ETA in 4 days</div>
        </div>
      </div>
    </div>
  );
};
