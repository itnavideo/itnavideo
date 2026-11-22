import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';

export interface ChandelierEarringsDangleProps {
  title?: string;
  [key: string]: any;
}

export const ChandelierEarringsDangle: React.FC<ChandelierEarringsDangleProps> = (props) => {
  const frame = useCurrentFrame();
  const defaultValues = {"title":"Emerald Chandelier Earrings","gemstone":"Zambian Emerald & Diamonds","dropLength":"62 mm","totalWeight":"18.4 ctw","metal":"18K White Gold","accentColor":"#10B981","theme":"dark"};
  const {
    title = defaultValues.title,
    accentColor = defaultValues.accentColor || '#38BDF8',
    theme = defaultValues.theme || 'dark',
    ...rest
  } = props;
  
  const merged = { ...defaultValues, ...rest, title, accentColor, theme };
  const { title, gemstone, dropLength, totalWeight, metal, accentColor, theme } = merged;


  const swing = Math.sin(frame / 12) * 5;
  return (
    <div style={{
      width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
      background: theme === 'dark' ? '#04160E' : '#ECFDF5',
      color: theme === 'dark' ? '#ECFDF5' : '#064E3B',
      padding: '24px', boxSizing: 'border-box', fontFamily: 'Inter, system-ui, sans-serif'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <div style={{ fontSize: '18px', fontWeight: 800 }}>{title}</div>
          <div style={{ fontSize: '11px', color: '#10B981' }}>{gemstone} • {metal}</div>
        </div>
        <div style={{ fontSize: '16px', fontWeight: 900, color: '#10B981' }}>{totalWeight}</div>
      </div>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '32px' }}>
        {[1, 2].map((i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', transform: `rotate(${swing * (i === 1 ? 1 : -1)}deg)`, transformOrigin: 'top center' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#FFF', border: '2px solid #10B981' }} />
            <div style={{ width: '2px', height: '16px', background: '#94A3B8' }} />
            <div style={{ width: '24px', height: '18px', borderRadius: '4px', background: '#10B981', boxShadow: '0 0 12px #10B98188' }} />
            <div style={{ width: '2px', height: '14px', background: '#94A3B8' }} />
            <div style={{ width: '32px', height: '24px', borderRadius: '50%', background: '#10B981', boxShadow: '0 0 16px #10B981AA' }} />
          </div>
        ))}
      </div>
    </div>
  );
};
