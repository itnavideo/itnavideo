import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';

export interface GemstoneMohsHardnessScaleProps {
  title?: string;
  [key: string]: any;
}

export const GemstoneMohsHardnessScale: React.FC<GemstoneMohsHardnessScaleProps> = (props) => {
  const frame = useCurrentFrame();
  const defaultValues = {"title":"Mohs Mineral Hardness Scale","minerals":[{"name":"Diamond","hardness":10,"color":"#38BDF8","family":"Pure Carbon"},{"name":"Ruby & Sapphire","hardness":9,"color":"#EF4444","family":"Corundum"},{"name":"Topaz","hardness":8,"color":"#F59E0B","family":"Silicate"},{"name":"Emerald","hardness":7.5,"color":"#10B981","family":"Beryl"},{"name":"Quartz / Amethyst","hardness":7,"color":"#8B5CF6","family":"Silicon Dioxide"}],"accentColor":"#38BDF8","theme":"dark"};
  const {
    title = defaultValues.title,
    accentColor = defaultValues.accentColor || '#38BDF8',
    theme = defaultValues.theme || 'dark',
    ...rest
  } = props;
  
  const merged = { ...defaultValues, ...rest, title, accentColor, theme };
  const { title, minerals, accentColor, theme } = merged;


  return (
    <div style={{
      width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
      background: theme === 'dark' ? '#090D16' : '#F0F9FF',
      color: theme === 'dark' ? '#F0F9FF' : '#0C4A6E',
      padding: '24px', boxSizing: 'border-box', fontFamily: 'Inter, system-ui, sans-serif'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <div style={{ fontSize: '18px', fontWeight: 800 }}>{title}</div>
          <div style={{ fontSize: '11px', color: '#38BDF8' }}>Resistance to Scratching & Surface Abrasion</div>
        </div>
        <span style={{ fontSize: '11px', background: '#38BDF822', color: '#38BDF8', padding: '4px 10px', borderRadius: '6px', fontWeight: 700 }}>1 to 10 Mohs</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
        {minerals.map((m: any, idx: number) => (
          <div key={idx} style={{
            background: theme === 'dark' ? '#111827' : '#FFFFFF',
            borderRadius: '8px', padding: '10px 14px', borderLeft: `4px solid ${m.color}`,
            display: 'flex', justifyContent: 'space-between', alignItems: 'center'
          }}>
            <div>
              <span style={{ fontSize: '13px', fontWeight: 700 }}>{m.name}</span>
              <span style={{ fontSize: '10px', color: '#64748B', marginLeft: '8px' }}>({m.family})</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '80px', height: '6px', background: theme === 'dark' ? '#1F2937' : '#E2E8F0', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: `${(m.hardness / 10) * 100}%`, height: '100%', background: m.color }} />
              </div>
              <span style={{ fontSize: '13px', fontWeight: 900, color: m.color, width: '32px', textAlign: 'right' }}>{m.hardness}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
