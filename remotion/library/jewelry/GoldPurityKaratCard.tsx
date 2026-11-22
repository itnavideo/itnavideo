import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';

export interface GoldPurityKaratCardProps {
  title?: string;
  [key: string]: any;
}

export const GoldPurityKaratCard: React.FC<GoldPurityKaratCardProps> = (props) => {
  const frame = useCurrentFrame();
  const defaultValues = {"title":"Gold Karat Purity Standards","karats":[{"karat":"24K","purity":"99.9%","fineness":"999","use":"Bullion & Coins","color":"#F59E0B"},{"karat":"22K","purity":"91.6%","fineness":"916","use":"Traditional Jewelry","color":"#EAB308"},{"karat":"18K","purity":"75.0%","fineness":"750","use":"Diamond Jewelry","color":"#FBBF24"},{"karat":"14K","purity":"58.5%","fineness":"585","use":"Daily Wear Bands","color":"#FDE047"}],"hallmark":"BIS 916 Certified","accentColor":"#F59E0B","theme":"dark"};
  const merged = { ...defaultValues, ...props };
  const { title, karats, hallmark, accentColor, theme } = merged;


  return (
    <div style={{
      width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
      background: theme === 'dark' ? '#161105' : '#FFFBEB',
      color: theme === 'dark' ? '#FEF3C7' : '#78350F',
      padding: '24px', boxSizing: 'border-box', fontFamily: 'Inter, system-ui, sans-serif'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <div style={{ fontSize: '18px', fontWeight: 800 }}>{title}</div>
          <div style={{ fontSize: '11px', color: '#D97706' }}>Official Precious Metal Fineness Scales</div>
        </div>
        <span style={{ fontSize: '11px', background: '#F59E0B22', border: '1px solid #F59E0B', color: '#F59E0B', padding: '4px 10px', borderRadius: '6px', fontWeight: 700 }}>
          {hallmark}
        </span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', flex: 1 }}>
        {karats.map((k: any, idx: number) => (
          <div key={idx} style={{
            background: theme === 'dark' ? '#2A1F08' : '#FFFFFF',
            borderRadius: '10px', padding: '14px', border: '1px solid #F59E0B44',
            display: 'flex', flexDirection: 'column', justifyContent: 'space-between'
          }}>
            <div>
              <div style={{ fontSize: '24px', fontWeight: 900, color: k.color }}>{k.karat}</div>
              <div style={{ fontSize: '13px', fontWeight: 700, marginTop: '4px' }}>{k.purity} Gold</div>
              <div style={{ fontSize: '10px', color: '#B45309', marginTop: '2px' }}>Fineness: {k.fineness}</div>
            </div>
            <div style={{ fontSize: '10px', color: '#92400E', borderTop: '1px solid #F59E0B33', paddingTop: '6px' }}>
              {k.use}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
