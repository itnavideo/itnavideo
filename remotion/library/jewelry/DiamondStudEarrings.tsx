import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';

export interface DiamondStudEarringsProps {
  title?: string;
  [key: string]: any;
}

export const DiamondStudEarrings: React.FC<DiamondStudEarringsProps> = (props) => {
  const frame = useCurrentFrame();
  const defaultValues = {"title":"Round Brilliant Diamond Studs","totalWeight":"2.00 TCW (1.00 ct each)","metal":"Platinum 950","closure":"Screw-Back Locking Post","colorClarity":"E Color / VS1 Clarity","accentColor":"#38BDF8","theme":"dark"};
  const merged = { ...defaultValues, ...props };
  const { title, totalWeight, metal, closure, colorClarity, accentColor, theme } = merged;


  const glint = Math.sin(frame / 8) * 0.2 + 0.8;
  return (
    <div style={{
      width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
      background: theme === 'dark' ? '#0A0E17' : '#F8FAFC',
      color: theme === 'dark' ? '#F8FAFC' : '#0F172A',
      padding: '24px', boxSizing: 'border-box', fontFamily: 'Inter, system-ui, sans-serif'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <div style={{ fontSize: '18px', fontWeight: 800 }}>{title}</div>
          <div style={{ fontSize: '11px', color: '#38BDF8' }}>{colorClarity} • {metal}</div>
        </div>
        <div style={{ fontSize: '16px', fontWeight: 900, color: '#38BDF8' }}>{totalWeight}</div>
      </div>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '48px' }}>
        {[1, 2].map((s) => (
          <div key={s} style={{
            width: '64px', height: '64px', borderRadius: '50%',
            background: 'radial-gradient(circle, #FFFFFF 20%, #38BDF8 60%, #0284C7 100%)',
            boxShadow: '0 0 24px rgba(56, 189, 248, 0.8)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            opacity: glint
          }}>
            <span style={{ fontSize: '20px' }}>✦</span>
          </div>
        ))}
      </div>
      <div style={{ fontSize: '11px', color: '#94A3B8', textAlign: 'center' }}>
        Secure {closure}
      </div>
    </div>
  );
};
