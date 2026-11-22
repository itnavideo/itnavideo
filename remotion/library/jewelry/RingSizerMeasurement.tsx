import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';

export interface RingSizerMeasurementProps {
  title?: string;
  [key: string]: any;
}

export const RingSizerMeasurement: React.FC<RingSizerMeasurementProps> = (props) => {
  const frame = useCurrentFrame();
  const defaultValues = {"title":"Ring Size Conversion Chart","sizes":[{"us":"6","uk":"L 1/2","eu":"52","mm":"16.5 mm"},{"us":"7","uk":"N 1/2","eu":"54","mm":"17.3 mm"},{"us":"8","uk":"P 1/2","eu":"57","mm":"18.1 mm"},{"us":"9","uk":"R 1/2","eu":"60","mm":"18.9 mm"}],"selectedSize":"US 7 (17.3 mm)","accentColor":"#38BDF8","theme":"dark"};
  const {
    title = defaultValues.title,
    accentColor = defaultValues.accentColor || '#38BDF8',
    theme = defaultValues.theme || 'dark',
    ...rest
  } = props;
  
  const merged = { ...defaultValues, ...rest, title, accentColor, theme };
  const { title, sizes, selectedSize, accentColor, theme } = merged;


  return (
    <div style={{
      width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
      background: theme === 'dark' ? '#0B0F19' : '#F8FAFC',
      color: theme === 'dark' ? '#F8FAFC' : '#0F172A',
      padding: '24px', boxSizing: 'border-box', fontFamily: 'Inter, system-ui, sans-serif'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <div style={{ fontSize: '18px', fontWeight: 800 }}>{title}</div>
          <div style={{ fontSize: '11px', color: '#38BDF8' }}>Selected: {selectedSize}</div>
        </div>
        <span style={{ fontSize: '11px', background: '#38BDF822', color: '#38BDF8', padding: '4px 10px', borderRadius: '6px', fontWeight: 700 }}>Internal Diameter</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', fontSize: '11px', color: '#94A3B8', paddingBottom: '4px' }}>
          <span>US Size</span><span>UK / AU</span><span>EU Scale</span><span style={{ textAlign: 'right' }}>Inside Diameter</span>
        </div>
        {sizes.map((s: any, idx: number) => (
          <div key={idx} style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', alignItems: 'center',
            background: theme === 'dark' ? '#1E293B' : '#FFFFFF', padding: '10px 14px', borderRadius: '6px', fontSize: '12px'
          }}>
            <span style={{ fontWeight: 800, color: '#38BDF8' }}>US {s.us}</span>
            <span>{s.uk}</span>
            <span>{s.eu}</span>
            <span style={{ textAlign: 'right', fontWeight: 700 }}>{s.mm}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
