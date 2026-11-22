import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';

export interface GoldBangleStackerProps {
  title?: string;
  [key: string]: any;
}

export const GoldBangleStacker: React.FC<GoldBangleStackerProps> = (props) => {
  const frame = useCurrentFrame();
  const defaultValues = {"title":"22K Kundan Gold Bangles","bangleCount":4,"totalWeightGrams":"68.4 g","craftsmanship":"Handcrafted Meenakari & Filigree","metal":"22K Solid Gold (916)","accentColor":"#EAB308","theme":"dark"};
  const {
    title = defaultValues.title,
    accentColor = defaultValues.accentColor || '#38BDF8',
    theme = defaultValues.theme || 'dark',
    ...rest
  } = props;
  
  const merged = { ...defaultValues, ...rest, title, accentColor, theme };
  const { title, bangleCount, totalWeightGrams, craftsmanship, metal, accentColor, theme } = merged;


  const floatBangles = Math.sin(frame / 8) * 4;
  return (
    <div style={{
      width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
      background: theme === 'dark' ? '#141004' : '#FEFCE8',
      color: theme === 'dark' ? '#FEF08A' : '#713F12',
      padding: '24px', boxSizing: 'border-box', fontFamily: 'Cinzel, Georgia, serif'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <div style={{ fontSize: '18px', fontWeight: 700 }}>{title}</div>
          <div style={{ fontSize: '11px', color: '#CA8A04', fontFamily: 'sans-serif' }}>{craftsmanship}</div>
        </div>
        <div style={{ fontSize: '18px', fontWeight: 900, color: '#EAB308', fontFamily: 'sans-serif' }}>{totalWeightGrams}</div>
      </div>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
        <div style={{ display: 'flex', gap: '14px', transform: `translateY(${floatBangles}px)` }}>
          {[1, 2, 3, 4].map((b) => (
            <div key={b} style={{
              width: '64px', height: '64px', borderRadius: '50%',
              border: '8px solid #EAB308', boxShadow: '0 4px 14px rgba(234, 179, 8, 0.4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1px dashed #CA8A04' }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
