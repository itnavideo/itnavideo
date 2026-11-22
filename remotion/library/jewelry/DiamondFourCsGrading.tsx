import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';

export interface DiamondFourCsGradingProps {
  title?: string;
  [key: string]: any;
}

export const DiamondFourCsGrading: React.FC<DiamondFourCsGradingProps> = (props) => {
  const frame = useCurrentFrame();
  const defaultValues = {"title":"GIA Diamond 4Cs Certification","carat":"1.54 ct","cut":"Excellent","color":"F (Colorless)","clarity":"VVS1","reportNumber":"GIA-221849012","accentColor":"#38BDF8","theme":"dark"};
  const {
    title = defaultValues.title,
    accentColor = defaultValues.accentColor || '#38BDF8',
    theme = defaultValues.theme || 'dark',
    ...rest
  } = props;
  
  const merged = { ...defaultValues, ...rest, title, accentColor, theme };
  const { title, carat, cut, color, clarity, reportNumber, accentColor, theme } = merged;


  const sparkle = Math.sin(frame / 6) * 0.3 + 0.7;
  return (
    <div style={{
      width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
      background: theme === 'dark' ? '#090D14' : '#F8FAFC',
      color: theme === 'dark' ? '#F1F5F9' : '#0F172A',
      padding: '24px', boxSizing: 'border-box', fontFamily: 'Cinzel, Georgia, serif'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid ' + (theme === 'dark' ? '#1E293B' : '#E2E8F0'), paddingBottom: '12px' }}>
        <div>
          <div style={{ fontSize: '18px', fontWeight: 700, letterSpacing: '1px' }}>{title}</div>
          <div style={{ fontSize: '11px', color: '#94A3B8', fontFamily: 'sans-serif' }}>Report #{reportNumber} • Natural Mined Diamond</div>
        </div>
        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#38BDF822', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: '16px', opacity: sparkle }}>💎</span>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', flex: 1, fontFamily: 'sans-serif' }}>
        <div style={{ background: theme === 'dark' ? '#111827' : '#FFFFFF', borderRadius: '10px', padding: '14px', border: '1px solid ' + (theme === 'dark' ? '#1F2937' : '#E2E8F0'), textAlign: 'center' }}>
          <div style={{ fontSize: '10px', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '1px' }}>1. CARAT</div>
          <div style={{ fontSize: '20px', fontWeight: 800, color: '#38BDF8', margin: '8px 0' }}>{carat}</div>
          <div style={{ fontSize: '10px', color: '#64748B' }}>7.42 x 7.46 mm</div>
        </div>
        <div style={{ background: theme === 'dark' ? '#111827' : '#FFFFFF', borderRadius: '10px', padding: '14px', border: '1px solid ' + (theme === 'dark' ? '#1F2937' : '#E2E8F0'), textAlign: 'center' }}>
          <div style={{ fontSize: '10px', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '1px' }}>2. CUT</div>
          <div style={{ fontSize: '18px', fontWeight: 800, color: '#10B981', margin: '8px 0' }}>{cut}</div>
          <div style={{ fontSize: '10px', color: '#64748B' }}>Ideal Symmetry</div>
        </div>
        <div style={{ background: theme === 'dark' ? '#111827' : '#FFFFFF', borderRadius: '10px', padding: '14px', border: '1px solid ' + (theme === 'dark' ? '#1F2937' : '#E2E8F0'), textAlign: 'center' }}>
          <div style={{ fontSize: '10px', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '1px' }}>3. COLOR</div>
          <div style={{ fontSize: '18px', fontWeight: 800, color: '#F59E0B', margin: '8px 0' }}>{color}</div>
          <div style={{ fontSize: '10px', color: '#64748B' }}>Top Wesselton</div>
        </div>
        <div style={{ background: theme === 'dark' ? '#111827' : '#FFFFFF', borderRadius: '10px', padding: '14px', border: '1px solid ' + (theme === 'dark' ? '#1F2937' : '#E2E8F0'), textAlign: 'center' }}>
          <div style={{ fontSize: '10px', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '1px' }}>4. CLARITY</div>
          <div style={{ fontSize: '18px', fontWeight: 800, color: '#A855F7', margin: '8px 0' }}>{clarity}</div>
          <div style={{ fontSize: '10px', color: '#64748B' }}>Eye Clean</div>
        </div>
      </div>
    </div>
  );
};
