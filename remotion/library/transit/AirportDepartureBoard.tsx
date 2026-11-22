import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';

export interface AirportDepartureBoardProps {
  title?: string;
  [key: string]: any;
}

export const AirportDepartureBoard: React.FC<AirportDepartureBoardProps> = (props) => {
  const frame = useCurrentFrame();
  const defaultValues = {"title":"INTERNATIONAL DEPARTURES","terminal":"Terminal 3 Concourse B","flights":[{"time":"14:20","flight":"AF 023","dest":"PARIS CDG","gate":"B12","status":"BOARDING","color":"#10B981"},{"time":"14:35","flight":"LH 401","dest":"FRANKFURT","gate":"B18","status":"ON TIME","color":"#38BDF8"},{"time":"14:50","flight":"EK 202","dest":"DUBAI DXB","gate":"B24","status":"DELAYED","color":"#EF4444"},{"time":"15:10","flight":"SQ 025","dest":"SINGAPORE","gate":"B08","status":"GATE OPEN","color":"#F59E0B"}],"accentColor":"#F59E0B","theme":"dark"};
  const {
    title = defaultValues.title,
    accentColor = defaultValues.accentColor || '#38BDF8',
    theme = defaultValues.theme || 'dark',
    ...rest
  } = props;
  
  const merged = { ...defaultValues, ...rest, title, accentColor, theme };
  const { title, terminal, flights, accentColor, theme } = merged;


  const blink = Math.floor(frame / 12) % 2 === 0;
  return (
    <div style={{
      width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
      background: '#0F1115', color: '#F1F5F9',
      padding: '24px', boxSizing: 'border-box', fontFamily: 'monospace'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', borderBottom: '2px solid #F59E0B', paddingBottom: '8px' }}>
        <div style={{ fontSize: '18px', fontWeight: 900, color: '#F59E0B', letterSpacing: '2px' }}>{title}</div>
        <div style={{ fontSize: '11px', color: '#94A3B8' }}>{terminal}</div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '60px 80px 1fr 60px 100px', fontSize: '11px', color: '#64748B', fontWeight: 700 }}>
          <span>TIME</span><span>FLIGHT</span><span>DESTINATION</span><span>GATE</span><span style={{ textAlign: 'right' }}>STATUS</span>
        </div>
        {flights.map((f: any, idx: number) => (
          <div key={idx} style={{
            display: 'grid', gridTemplateColumns: '60px 80px 1fr 60px 100px', alignItems: 'center',
            background: '#1A1D24', padding: '8px 10px', borderRadius: '4px', fontSize: '13px', fontWeight: 700
          }}>
            <span style={{ color: '#F59E0B' }}>{f.time}</span>
            <span style={{ color: '#E2E8F0' }}>{f.flight}</span>
            <span style={{ color: '#F8FAFC' }}>{f.dest}</span>
            <span style={{ color: '#F59E0B' }}>{f.gate}</span>
            <span style={{ textAlign: 'right', color: f.color, opacity: f.status === 'BOARDING' && !blink ? 0.4 : 1 }}>
              {f.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
