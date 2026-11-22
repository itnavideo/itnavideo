import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';

export interface HarborFerryScheduleProps {
  title?: string;
  [key: string]: any;
}

export const HarborFerrySchedule: React.FC<HarborFerryScheduleProps> = (props) => {
  const frame = useCurrentFrame();
  const defaultValues = {"title":"Harbor Ferry Pier 11","route":"Downtown Manhattan ↔ Staten Island","nextDeparture":"14:30 (In 8 mins)","vessel":"MV Spirit of New York","capacity":"450 Passengers / 60 Cars","crossingTime":"22 Minutes","accentColor":"#0284C7","theme":"dark"};
  const {
    title = defaultValues.title,
    accentColor = defaultValues.accentColor || '#38BDF8',
    theme = defaultValues.theme || 'dark',
    ...rest
  } = props;
  
  const merged = { ...defaultValues, ...rest, title, accentColor, theme };
  const { title, route, nextDeparture, vessel, capacity, crossingTime, accentColor, theme } = merged;


  return (
    <div style={{
      width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
      background: theme === 'dark' ? '#091522' : '#F0F9FF',
      color: theme === 'dark' ? '#F0F9FF' : '#0369A1',
      padding: '24px', boxSizing: 'border-box', fontFamily: 'Inter, system-ui, sans-serif'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <div style={{ fontSize: '18px', fontWeight: 800 }}>{title}</div>
          <div style={{ fontSize: '11px', color: '#38BDF8' }}>{route}</div>
        </div>
        <span style={{ fontSize: '11px', background: '#0284C722', color: '#38BDF8', padding: '4px 10px', borderRadius: '6px', fontWeight: 700 }}>Scheduled</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', flex: 1 }}>
        <div style={{ background: theme === 'dark' ? '#0F263E' : '#FFFFFF', padding: '14px', borderRadius: '8px' }}>
          <div style={{ fontSize: '10px', color: '#94A3B8' }}>Next Departure</div>
          <div style={{ fontSize: '18px', fontWeight: 800, color: '#38BDF8', marginTop: '4px' }}>{nextDeparture}</div>
          <div style={{ fontSize: '10px', color: '#64748B', marginTop: '2px' }}>{vessel}</div>
        </div>
        <div style={{ background: theme === 'dark' ? '#0F263E' : '#FFFFFF', padding: '14px', borderRadius: '8px' }}>
          <div style={{ fontSize: '10px', color: '#94A3B8' }}>Crossing Duration</div>
          <div style={{ fontSize: '18px', fontWeight: 800, color: '#10B981', marginTop: '4px' }}>{crossingTime}</div>
          <div style={{ fontSize: '10px', color: '#64748B', marginTop: '2px' }}>Capacity: {capacity}</div>
        </div>
      </div>
    </div>
  );
};
