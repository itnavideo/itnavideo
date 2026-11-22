import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';

export interface SolitaireRingShowcaseProps {
  title?: string;
  [key: string]: any;
}

export const SolitaireRingShowcase: React.FC<SolitaireRingShowcaseProps> = (props) => {
  const frame = useCurrentFrame();
  const defaultValues = {"title":"Platinum Solitaire Diamond Ring","diamondShape":"Round Brilliant Cut","centerStoneWeight":"2.01 ct","bandMetal":"Platinum 950 (PT950)","settingType":"6-Prong Tiffany Knife-Edge","accentColor":"#38BDF8","theme":"dark"};
  const merged = { ...defaultValues, ...props };
  const { title, diamondShape, centerStoneWeight, bandMetal, settingType, accentColor, theme } = merged;


  const glint = (frame % 45) * 8;
  return (
    <div style={{
      width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
      background: theme === 'dark' ? '#0A0E17' : '#F8FAFC',
      color: theme === 'dark' ? '#F8FAFC' : '#0F172A',
      padding: '24px', boxSizing: 'border-box', fontFamily: 'Cinzel, Georgia, serif'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <div style={{ fontSize: '18px', fontWeight: 700 }}>{title}</div>
          <div style={{ fontSize: '11px', color: '#38BDF8', fontFamily: 'sans-serif' }}>{settingType}</div>
        </div>
        <span style={{ fontSize: '11px', background: '#38BDF822', color: '#38BDF8', padding: '4px 10px', borderRadius: '6px', fontWeight: 700, fontFamily: 'sans-serif' }}>Bridal Haute Joaillerie</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', flex: 1, fontFamily: 'sans-serif' }}>
        <div style={{
          background: theme === 'dark' ? '#131A29' : '#FFFFFF',
          borderRadius: '12px', border: '1px solid #1E293B',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column'
        }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', border: '6px solid #CBD5E1', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
            <div style={{ position: 'absolute', top: '-14px', width: '22px', height: '22px', background: '#38BDF8', transform: 'rotate(45deg)', borderRadius: '3px', boxShadow: '0 0 16px #38BDF8' }} />
          </div>
          <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '16px' }}>{diamondShape}</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '10px' }}>
          <div style={{ background: theme === 'dark' ? '#131A29' : '#FFFFFF', padding: '12px 14px', borderRadius: '8px' }}>
            <div style={{ fontSize: '10px', color: '#94A3B8' }}>Center Solitaire</div>
            <div style={{ fontSize: '20px', fontWeight: 800, color: '#38BDF8' }}>{centerStoneWeight}</div>
          </div>
          <div style={{ background: theme === 'dark' ? '#131A29' : '#FFFFFF', padding: '12px 14px', borderRadius: '8px' }}>
            <div style={{ fontSize: '10px', color: '#94A3B8' }}>Metal Composition</div>
            <div style={{ fontSize: '14px', fontWeight: 700 }}>{bandMetal}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
