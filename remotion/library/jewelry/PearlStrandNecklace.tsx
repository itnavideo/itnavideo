import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';

export interface PearlStrandNecklaceProps {
  title?: string;
  [key: string]: any;
}

export const PearlStrandNecklace: React.FC<PearlStrandNecklaceProps> = (props) => {
  const frame = useCurrentFrame();
  const defaultValues = {"title":"South Sea Cultured Pearl Strand","pearlSize":"10.0 - 13.5 mm Graduated","pearlGrade":"AAA Luster (Flawless Nacre)","claspMetal":"18K Yellow Gold Ball Clasp","strandLength":"18 inches (Princess Length)","accentColor":"#F59E0B","theme":"dark"};
  const {
    title = defaultValues.title,
    accentColor = defaultValues.accentColor || '#38BDF8',
    theme = defaultValues.theme || 'dark',
    ...rest
  } = props;
  
  const merged = { ...defaultValues, ...rest, title, accentColor, theme };
  const { title, pearlSize, pearlGrade, claspMetal, strandLength, accentColor, theme } = merged;


  return (
    <div style={{
      width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
      background: theme === 'dark' ? '#0F1218' : '#FAF8F5',
      color: theme === 'dark' ? '#F8FAFC' : '#1E293B',
      padding: '24px', boxSizing: 'border-box', fontFamily: 'Cinzel, Georgia, serif'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <div style={{ fontSize: '18px', fontWeight: 700 }}>{title}</div>
          <div style={{ fontSize: '11px', color: '#94A3B8', fontFamily: 'sans-serif' }}>{pearlGrade}</div>
        </div>
        <span style={{ fontSize: '11px', background: '#F59E0B22', color: '#F59E0B', padding: '4px 10px', borderRadius: '6px', fontWeight: 700, fontFamily: 'sans-serif' }}>
          {strandLength}
        </span>
      </div>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {[16, 20, 24, 28, 34, 40, 34, 28, 24, 20, 16].map((size, idx) => (
            <div key={idx} style={{
              width: `${size}px`, height: `${size}px`, borderRadius: '50%',
              background: 'radial-gradient(circle at 35% 35%, #FFFFFF, #E2E8F0 60%, #CBD5E1 100%)',
              boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
            }} />
          ))}
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#64748B', fontFamily: 'sans-serif' }}>
        <span>Graduated Size: {pearlSize}</span>
        <span>Clasp: {claspMetal}</span>
      </div>
    </div>
  );
};
