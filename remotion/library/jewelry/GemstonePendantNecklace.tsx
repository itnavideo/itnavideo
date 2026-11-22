import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';

export interface GemstonePendantNecklaceProps {
  title?: string;
  [key: string]: any;
}

export const GemstonePendantNecklace: React.FC<GemstonePendantNecklaceProps> = (props) => {
  const frame = useCurrentFrame();
  const defaultValues = {"title":"Royal Ceylon Sapphire Pendant","caratWeight":"4.20 ct Center Sapphire","haloDiamonds":"0.45 ctw Pavé Surround","chain":"18K White Gold 1.2mm Cable Chain","accentColor":"#3B82F6","theme":"dark"};
  const {
    title = defaultValues.title,
    accentColor = defaultValues.accentColor || '#38BDF8',
    theme = defaultValues.theme || 'dark',
    ...rest
  } = props;
  
  const merged = { ...defaultValues, ...rest, title, accentColor, theme };
  const { title, caratWeight, haloDiamonds, chain, accentColor, theme } = merged;


  const glint = Math.sin(frame / 10) * 4;
  return (
    <div style={{
      width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
      background: theme === 'dark' ? '#090D18' : '#EFF6FF',
      color: theme === 'dark' ? '#EFF6FF' : '#1E3A8A',
      padding: '24px', boxSizing: 'border-box', fontFamily: 'Inter, system-ui, sans-serif'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <div style={{ fontSize: '18px', fontWeight: 800 }}>{title}</div>
          <div style={{ fontSize: '11px', color: '#3B82F6' }}>{chain}</div>
        </div>
        <div style={{ fontSize: '16px', fontWeight: 900, color: '#3B82F6' }}>{caratWeight}</div>
      </div>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ width: '40px', height: '20px', borderBottom: '2px solid #94A3B8', borderRadius: '0 0 20px 20px' }} />
          <div style={{
            width: '54px', height: '54px', borderRadius: '12px',
            background: 'radial-gradient(circle, #2563EB, #1D4ED8 60%, #1E3A8A 100%)',
            border: '4px solid #FFFFFF',
            boxShadow: '0 0 24px rgba(37, 99, 235, 0.8)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#FFF', fontSize: '18px', fontWeight: 900
          }}>
            ✦
          </div>
        </div>
      </div>
      <div style={{ fontSize: '11px', color: '#94A3B8', textAlign: 'center' }}>
        Surrounded by {haloDiamonds}
      </div>
    </div>
  );
};
