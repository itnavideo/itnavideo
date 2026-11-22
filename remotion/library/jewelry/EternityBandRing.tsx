import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';

export interface EternityBandRingProps {
  title?: string;
  [key: string]: any;
}

export const EternityBandRing: React.FC<EternityBandRingProps> = (props) => {
  const frame = useCurrentFrame();
  const defaultValues = {"title":"Full Eternity Diamond Band","stonesCount":"24 Diamonds","totalCaratWeight":"3.60 TCW","metal":"18K White Gold","setting":"Shared French Prong Pavé","accentColor":"#38BDF8","theme":"dark"};
  const merged = { ...defaultValues, ...props };
  const { title, stonesCount, totalCaratWeight, metal, setting, accentColor, theme } = merged;


  return (
    <div style={{
      width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
      background: theme === 'dark' ? '#0B0F19' : '#F1F5F9',
      color: theme === 'dark' ? '#F8FAFC' : '#0F172A',
      padding: '24px', boxSizing: 'border-box', fontFamily: 'Inter, system-ui, sans-serif'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <div style={{ fontSize: '18px', fontWeight: 800 }}>{title}</div>
          <div style={{ fontSize: '11px', color: '#38BDF8' }}>{metal} • {setting}</div>
        </div>
        <div style={{ fontSize: '18px', fontWeight: 900, color: '#38BDF8' }}>{totalCaratWeight}</div>
      </div>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          {Array.from({ length: 12 }).map((_, idx) => (
            <div key={idx} style={{
              width: '18px', height: '18px', borderRadius: '50%',
              background: '#38BDF8', boxShadow: '0 0 10px #38BDF888',
              opacity: 0.5 + ((idx + Math.floor(frame / 4)) % 5) * 0.12
            }} />
          ))}
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#94A3B8' }}>
        <span>Continuous 360° Stone Setting</span>
        <span>{stonesCount}</span>
      </div>
    </div>
  );
};
