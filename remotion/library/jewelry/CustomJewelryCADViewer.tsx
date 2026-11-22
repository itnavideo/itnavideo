import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';

export interface CustomJewelryCADViewerProps {
  title?: string;
  [key: string]: any;
}

export const CustomJewelryCADViewer: React.FC<CustomJewelryCADViewerProps> = (props) => {
  const frame = useCurrentFrame();
  const defaultValues = {"title":"Custom Ring CAD Modeling","software":"RhinoJewel 3D / MatrixGold","prongTolerance":"0.85 mm Clasp Height","castWeight":"5.4 g 18K Yellow Gold","meshDensity":"128K Polygonal Faces","accentColor":"#38BDF8","theme":"dark"};
  const {
    title = defaultValues.title,
    accentColor = defaultValues.accentColor || '#38BDF8',
    theme = defaultValues.theme || 'dark',
    ...rest
  } = props;
  
  const merged = { ...defaultValues, ...rest, title, accentColor, theme };
  const { title, software, prongTolerance, castWeight, meshDensity, accentColor, theme } = merged;


  const rot = (frame * 1.5) % 360;
  return (
    <div style={{
      width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
      background: theme === 'dark' ? '#080E18' : '#F0F9FF',
      color: theme === 'dark' ? '#F0F9FF' : '#0C4A6E',
      padding: '24px', boxSizing: 'border-box', fontFamily: 'Inter, system-ui, sans-serif'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <div style={{ fontSize: '18px', fontWeight: 800 }}>{title}</div>
          <div style={{ fontSize: '11px', color: '#38BDF8' }}>{software}</div>
        </div>
        <span style={{ fontSize: '11px', background: '#38BDF822', color: '#38BDF8', padding: '4px 10px', borderRadius: '6px', fontWeight: 700 }}>CAD Wireframe</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', flex: 1 }}>
        <div style={{
          background: theme === 'dark' ? '#0F172A' : '#FFFFFF',
          borderRadius: '10px', border: '1px solid #38BDF844',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div style={{ width: '70px', height: '70px', border: '2px dashed #38BDF8', transform: `rotate(${rot}deg)`, borderRadius: '8px' }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '8px' }}>
          <div style={{ background: theme === 'dark' ? '#0F172A' : '#FFFFFF', padding: '10px 12px', borderRadius: '6px' }}>
            <div style={{ fontSize: '10px', color: '#94A3B8' }}>Prong Precision</div>
            <div style={{ fontSize: '13px', fontWeight: 700 }}>{prongTolerance}</div>
          </div>
          <div style={{ background: theme === 'dark' ? '#0F172A' : '#FFFFFF', padding: '10px 12px', borderRadius: '6px' }}>
            <div style={{ fontSize: '10px', color: '#94A3B8' }}>Est. Cast Weight</div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#F59E0B' }}>{castWeight}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
