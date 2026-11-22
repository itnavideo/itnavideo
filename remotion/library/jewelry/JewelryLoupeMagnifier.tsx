import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';

export interface JewelryLoupeMagnifierProps {
  title?: string;
  [key: string]: any;
}

export const JewelryLoupeMagnifier: React.FC<JewelryLoupeMagnifierProps> = (props) => {
  const frame = useCurrentFrame();
  const defaultValues = {"title":"10x Triplet Loupe Inspection","magnification":"10X Achromatic / Aplanatic","inclusionType":"Feather & Pinpoint Inclusions","clarityVerdict":"VS2 Grade Verified","accentColor":"#38BDF8","theme":"dark"};
  const merged = { ...defaultValues, ...props };
  const { title, magnification, inclusionType, clarityVerdict, accentColor, theme } = merged;


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
          <div style={{ fontSize: '11px', color: '#38BDF8' }}>{magnification}</div>
        </div>
        <span style={{ fontSize: '11px', background: '#10B98122', color: '#10B981', padding: '4px 10px', borderRadius: '6px', fontWeight: 700 }}>
          {clarityVerdict}
        </span>
      </div>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{
          width: '140px', height: '140px', borderRadius: '50%',
          border: '8px solid #475569', background: theme === 'dark' ? '#0F172A' : '#FFFFFF',
          position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 0 20px rgba(0,0,0,0.5)'
        }}>
          <div style={{ width: '100%', height: '1px', background: '#38BDF844', position: 'absolute' }} />
          <div style={{ height: '100%', width: '1px', background: '#38BDF844', position: 'absolute' }} />
          <div style={{ fontSize: '28px' }}>💎</div>
        </div>
      </div>
      <div style={{ fontSize: '11px', color: '#94A3B8', textAlign: 'center' }}>
        Observed Features: {inclusionType}
      </div>
    </div>
  );
};
