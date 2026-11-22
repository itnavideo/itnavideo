import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';

export interface DiamondTennisBraceletProps {
  title?: string;
  [key: string]: any;
}

export const DiamondTennisBracelet: React.FC<DiamondTennisBraceletProps> = (props) => {
  const frame = useCurrentFrame();
  const defaultValues = {"title":"Classic Diamond Tennis Bracelet","totalCaratWeight":"5.00 ctw","diamondCount":"58 Round Brilliants","metal":"14K Yellow Gold","clasp":"Double Figure-8 Safety Lock","accentColor":"#F59E0B","theme":"dark"};
  const {
    title = defaultValues.title,
    accentColor = defaultValues.accentColor || '#38BDF8',
    theme = defaultValues.theme || 'dark',
    ...rest
  } = props;
  
  const merged = { ...defaultValues, ...rest, title, accentColor, theme };
  const { title, totalCaratWeight, diamondCount, metal, clasp, accentColor, theme } = merged;


  return (
    <div style={{
      width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
      background: theme === 'dark' ? '#140E04' : '#FFFDF7',
      color: theme === 'dark' ? '#FEF3C7' : '#78350F',
      padding: '24px', boxSizing: 'border-box', fontFamily: 'Inter, system-ui, sans-serif'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <div style={{ fontSize: '18px', fontWeight: 800 }}>{title}</div>
          <div style={{ fontSize: '11px', color: '#F59E0B' }}>{metal} • {clasp}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '20px', fontWeight: 900, color: '#F59E0B' }}>{totalCaratWeight}</div>
          <div style={{ fontSize: '10px', color: '#B45309' }}>{diamondCount}</div>
        </div>
      </div>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', width: '90%', overflow: 'hidden' }}>
          {Array.from({ length: 18 }).map((_, i) => (
            <div key={i} style={{
              width: '14px', height: '14px', borderRadius: '50%',
              background: '#FFF', border: '2px solid #F59E0B',
              boxShadow: '0 0 6px rgba(245, 158, 11, 0.6)'
            }} />
          ))}
          <div style={{ width: '22px', height: '14px', borderRadius: '4px', background: '#F59E0B', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '8px', color: '#000', fontWeight: 800 }}>
            🔒
          </div>
        </div>
      </div>
    </div>
  );
};
