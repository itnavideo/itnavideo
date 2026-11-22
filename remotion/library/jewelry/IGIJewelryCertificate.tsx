import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';

export interface IGIJewelryCertificateProps {
  title?: string;
  [key: string]: any;
}

export const IGIJewelryCertificate: React.FC<IGIJewelryCertificateProps> = (props) => {
  const frame = useCurrentFrame();
  const defaultValues = {"title":"IGI Gemological Report","certId":"IGI-594201884","identification":"Natural Colombian Emerald","shapeCut":"Emerald Cut","weight":"3.15 ct","origin":"Muzo, Colombia","accentColor":"#10B981","theme":"dark"};
  const merged = { ...defaultValues, ...props };
  const { title, certId, identification, shapeCut, weight, origin, accentColor, theme } = merged;


  return (
    <div style={{
      width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
      background: theme === 'dark' ? '#04160E' : '#F0FDF4',
      color: theme === 'dark' ? '#ECFDF5' : '#064E3B',
      padding: '24px', boxSizing: 'border-box', fontFamily: 'Cinzel, Georgia, serif'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <div style={{ fontSize: '18px', fontWeight: 700 }}>{title}</div>
          <div style={{ fontSize: '11px', color: '#10B981', fontFamily: 'sans-serif' }}>Cert #{certId}</div>
        </div>
        <div style={{ width: '36px', height: '36px', border: '1px solid #10B981', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', fontWeight: 800, color: '#10B981', fontFamily: 'sans-serif' }}>
          QR SEAL
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', flex: 1, fontFamily: 'sans-serif' }}>
        <div style={{ background: theme === 'dark' ? '#0A2619' : '#FFFFFF', padding: '14px', borderRadius: '8px', border: '1px solid #10B98133' }}>
          <div style={{ fontSize: '10px', color: '#94A3B8' }}>Species & Variety</div>
          <div style={{ fontSize: '14px', fontWeight: 700, color: '#34D399', marginTop: '4px' }}>{identification}</div>
          <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '6px' }}>Provenance: {origin}</div>
        </div>
        <div style={{ background: theme === 'dark' ? '#0A2619' : '#FFFFFF', padding: '14px', borderRadius: '8px', border: '1px solid #10B98133' }}>
          <div style={{ fontSize: '10px', color: '#94A3B8' }}>Shape & Carat</div>
          <div style={{ fontSize: '18px', fontWeight: 800, color: '#34D399', marginTop: '4px' }}>{weight}</div>
          <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '4px' }}>{shapeCut}</div>
        </div>
      </div>
    </div>
  );
};
