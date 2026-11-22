import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';

export interface PreciousMetalSpotPriceProps {
  title?: string;
  [key: string]: any;
}

export const PreciousMetalSpotPrice: React.FC<PreciousMetalSpotPriceProps> = (props) => {
  const frame = useCurrentFrame();
  const defaultValues = {"title":"Global Precious Metals Ticker","metals":[{"code":"XAU (Gold)","price":"$2,748.20","change":"+1.42%","color":"#F59E0B"},{"code":"XAG (Silver)","price":"$31.85","change":"+2.15%","color":"#94A3B8"},{"code":"XPT (Platinum)","price":"$986.50","change":"+0.85%","color":"#38BDF8"}],"unit":"USD per Troy Ounce (oz)","accentColor":"#F59E0B","theme":"dark"};
  const {
    title = defaultValues.title,
    accentColor = defaultValues.accentColor || '#38BDF8',
    theme = defaultValues.theme || 'dark',
    ...rest
  } = props;
  
  const merged = { ...defaultValues, ...rest, title, accentColor, theme };
  const { title, metals, unit, accentColor, theme } = merged;


  return (
    <div style={{
      width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
      background: theme === 'dark' ? '#141005' : '#FFFDF5',
      color: theme === 'dark' ? '#FEF3C7' : '#78350F',
      padding: '24px', boxSizing: 'border-box', fontFamily: 'Inter, system-ui, sans-serif'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <div style={{ fontSize: '18px', fontWeight: 800 }}>{title}</div>
          <div style={{ fontSize: '11px', color: '#D97706' }}>LBMA / COMEX Market Feeds • {unit}</div>
        </div>
        <span style={{ fontSize: '11px', background: '#10B98122', color: '#10B981', padding: '4px 10px', borderRadius: '6px', fontWeight: 700 }}>Market Open</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', flex: 1 }}>
        {metals.map((m: any, idx: number) => (
          <div key={idx} style={{
            background: theme === 'dark' ? '#241B08' : '#FFFFFF',
            borderRadius: '10px', padding: '16px', border: '1px solid #F59E0B44',
            display: 'flex', flexDirection: 'column', justifyContent: 'space-between'
          }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: m.color }}>{m.code}</div>
            <div style={{ fontSize: '22px', fontWeight: 900, margin: '8px 0' }}>{m.price}</div>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#10B981' }}>{m.change}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
