import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';

export interface SterlingSilverHallmarkProps {
  title?: string;
  [key: string]: any;
}

export const SterlingSilverHallmark: React.FC<SterlingSilverHallmarkProps> = (props) => {
  const frame = useCurrentFrame();
  const defaultValues = {"title":"925 Sterling Silver Hallmark","alloyRatio":"92.5% Pure Silver + 7.5% Copper","assayOffice":"London Assay Office (Leopard Head)","stampMark":"925","weightGrams":"42.8g","finish":"Rhodium Anti-Tarnish Plated","accentColor":"#94A3B8","theme":"dark"};
  const {
    title = defaultValues.title,
    accentColor = defaultValues.accentColor || '#38BDF8',
    theme = defaultValues.theme || 'dark',
    ...rest
  } = props;
  
  const merged = { ...defaultValues, ...rest, title, accentColor, theme };
  const { title, alloyRatio, assayOffice, stampMark, weightGrams, finish, accentColor, theme } = merged;


  return (
    <div style={{
      width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
      background: theme === 'dark' ? '#0F172A' : '#F8FAFC',
      color: theme === 'dark' ? '#F8FAFC' : '#0F172A',
      padding: '24px', boxSizing: 'border-box', fontFamily: 'Inter, system-ui, sans-serif'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <div style={{ fontSize: '18px', fontWeight: 800 }}>{title}</div>
          <div style={{ fontSize: '11px', color: '#94A3B8' }}>{alloyRatio}</div>
        </div>
        <div style={{ width: '48px', height: '32px', borderRadius: '16px', border: '2px solid #CBD5E1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: '#CBD5E1', fontSize: '14px', letterSpacing: '1px' }}>
          {stampMark}
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', flex: 1 }}>
        <div style={{ background: theme === 'dark' ? '#1E293B' : '#FFFFFF', borderRadius: '10px', padding: '16px', border: '1px solid #475569', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ fontSize: '11px', color: '#94A3B8' }}>Assay Verification</div>
          <div style={{ fontSize: '14px', fontWeight: 700, marginTop: '6px' }}>{assayOffice}</div>
          <div style={{ fontSize: '11px', color: '#38BDF8', marginTop: '6px' }}>✓ Tested XRF Spectrometry</div>
        </div>
        <div style={{ background: theme === 'dark' ? '#1E293B' : '#FFFFFF', borderRadius: '10px', padding: '16px', border: '1px solid #475569', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ fontSize: '11px', color: '#94A3B8' }}>Weight & Treatment</div>
          <div style={{ fontSize: '20px', fontWeight: 800, color: '#E2E8F0', marginTop: '4px' }}>{weightGrams}</div>
          <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '4px' }}>{finish}</div>
        </div>
      </div>
    </div>
  );
};
