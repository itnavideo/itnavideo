import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';

export interface MetroSubwayLineMapProps {
  title?: string;
  [key: string]: any;
}

export const MetroSubwayLineMap: React.FC<MetroSubwayLineMapProps> = (props) => {
  const frame = useCurrentFrame();
  const defaultValues = {"title":"Metropolitan Rapid Transit","lineName":"Blue Line (Express Service)","currentStation":"Grand Central Terminal","nextStation":"Times Square — 42nd St","stations":[{"name":"Financial District","passed":true},{"name":"Canal St","passed":true},{"name":"Union Square","passed":true},{"name":"Grand Central","current":true},{"name":"Times Square","next":true},{"name":"Columbus Circle","queued":true}],"accentColor":"#3B82F6","theme":"dark"};
  const {
    title = defaultValues.title,
    accentColor = defaultValues.accentColor || '#38BDF8',
    theme = defaultValues.theme || 'dark',
    ...rest
  } = props;
  
  const merged = { ...defaultValues, ...rest, title, accentColor, theme };
  const { title, lineName, currentStation, nextStation, stations, accentColor, theme } = merged;


  return (
    <div style={{
      width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
      background: theme === 'dark' ? '#090D16' : '#F8FAFC',
      color: theme === 'dark' ? '#F8FAFC' : '#0F172A',
      padding: '24px', boxSizing: 'border-box', fontFamily: 'Inter, system-ui, sans-serif'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <div style={{ fontSize: '18px', fontWeight: 800 }}>{title}</div>
          <div style={{ fontSize: '11px', color: '#3B82F6', fontWeight: 700 }}>{lineName}</div>
        </div>
        <div style={{ fontSize: '11px', background: '#3B82F622', color: '#3B82F6', padding: '4px 10px', borderRadius: '6px', fontWeight: 700 }}>
          Next: {nextStation}
        </div>
      </div>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
        <div style={{ position: 'absolute', left: '20px', right: '20px', height: '6px', background: '#3B82F6', borderRadius: '3px', zIndex: 0 }} />
        {stations.map((s: any, idx: number) => {
          const isCurr = s.current;
          return (
            <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1 }}>
              <div style={{
                width: isCurr ? '24px' : '16px', height: isCurr ? '24px' : '16px', borderRadius: '50%',
                background: isCurr ? '#FFF' : s.passed ? '#3B82F6' : '#64748B',
                border: isCurr ? '4px solid #3B82F6' : '3px solid #FFF',
                boxShadow: isCurr ? '0 0 16px #3B82F6' : 'none'
              }} />
              <span style={{ fontSize: '10px', marginTop: '8px', fontWeight: isCurr ? 800 : 500, color: isCurr ? '#3B82F6' : '#94A3B8', textAlign: 'center', width: '70px' }}>
                {s.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
