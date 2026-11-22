import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';

export interface JewelryBoxVelvetDisplayProps {
  title?: string;
  [key: string]: any;
}

export const JewelryBoxVelvetDisplay: React.FC<JewelryBoxVelvetDisplayProps> = (props) => {
  const frame = useCurrentFrame();
  const defaultValues = {"title":"Velvet Presentation Box","velvetColor":"Midnight Navy Blue","interior":"Champagne Silk Satin Lining","itemPresented":"3.02 ct Solitaire Diamond Ring","spotlight":"Warm LED Illuminator Active","accentColor":"#F59E0B","theme":"dark"};
  const merged = { ...defaultValues, ...props };
  const { title, velvetColor, interior, itemPresented, spotlight, accentColor, theme } = merged;


  const light = Math.sin(frame / 10) * 0.1 + 0.9;
  return (
    <div style={{
      width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
      background: theme === 'dark' ? '#080C14' : '#F1F5F9',
      color: theme === 'dark' ? '#F8FAFC' : '#0F172A',
      padding: '24px', boxSizing: 'border-box', fontFamily: 'Cinzel, Georgia, serif'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <div style={{ fontSize: '18px', fontWeight: 700 }}>{title}</div>
          <div style={{ fontSize: '11px', color: '#F59E0B', fontFamily: 'sans-serif' }}>{interior}</div>
        </div>
        <span style={{ fontSize: '11px', background: '#F59E0B22', color: '#F59E0B', padding: '4px 10px', borderRadius: '6px', fontWeight: 700, fontFamily: 'sans-serif' }}>
          {spotlight}
        </span>
      </div>
      <div style={{
        flex: 1, background: '#0F172A', borderRadius: '16px', border: '3px solid #1E293B',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        position: 'relative', boxShadow: 'inset 0 0 30px rgba(0,0,0,0.8)'
      }}>
        <div style={{ position: 'absolute', top: '10px', width: '20px', height: '6px', background: '#FEF08A', borderRadius: '3px', boxShadow: `0 0 16px #FEF08A`, opacity: light }} />
        <div style={{ fontSize: '42px', marginTop: '10px' }}>💍</div>
        <div style={{ fontSize: '13px', color: '#E2E8F0', fontFamily: 'sans-serif', fontWeight: 700, marginTop: '12px' }}>
          {itemPresented}
        </div>
      </div>
    </div>
  );
};
