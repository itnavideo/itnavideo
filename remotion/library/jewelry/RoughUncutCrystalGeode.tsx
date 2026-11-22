import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';

export interface RoughUncutCrystalGeodeProps {
  title?: string;
  [key: string]: any;
}

export const RoughUncutCrystalGeode: React.FC<RoughUncutCrystalGeodeProps> = (props) => {
  const frame = useCurrentFrame();
  const defaultValues = {"title":"Natural Rough Crystal Geode","mineral":"Royal Purple Amethyst with Quartz Matrix","weightCarats":"348.5 ct","origin":"Rio Grande do Sul, Brazil","estimatedYield":"42% Gem-Quality Facet Cut","accentColor":"#8B5CF6","theme":"dark"};
  const merged = { ...defaultValues, ...props };
  const { title, mineral, weightCarats, origin, estimatedYield, accentColor, theme } = merged;


  const shimmer = Math.sin(frame / 10) * 0.15 + 0.85;
  return (
    <div style={{
      width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
      background: theme === 'dark' ? '#110D1D' : '#FAF5FF',
      color: theme === 'dark' ? '#F5F3FF' : '#2E1065',
      padding: '24px', boxSizing: 'border-box', fontFamily: 'Inter, system-ui, sans-serif'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <div style={{ fontSize: '18px', fontWeight: 800 }}>{title}</div>
          <div style={{ fontSize: '11px', color: '#8B5CF6' }}>{mineral}</div>
        </div>
        <span style={{ fontSize: '11px', background: '#8B5CF622', color: '#8B5CF6', padding: '4px 10px', borderRadius: '6px', fontWeight: 700 }}>Uncut Specimen</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', flex: 1 }}>
        <div style={{
          background: theme === 'dark' ? '#1E1633' : '#FFFFFF',
          borderRadius: '12px', border: '1px solid #8B5CF644',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', position: 'relative'
        }}>
          <div style={{ fontSize: '48px', opacity: shimmer }}>🔮</div>
          <div style={{ fontSize: '11px', color: '#C084FC', fontWeight: 600, marginTop: '8px' }}>Internal Geode Crystal Cavity</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '10px' }}>
          <div style={{ background: theme === 'dark' ? '#1E1633' : '#FFFFFF', padding: '10px 14px', borderRadius: '8px' }}>
            <div style={{ fontSize: '10px', color: '#94A3B8' }}>Specimen Weight</div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: '#C084FC' }}>{weightCarats}</div>
          </div>
          <div style={{ background: theme === 'dark' ? '#1E1633' : '#FFFFFF', padding: '10px 14px', borderRadius: '8px' }}>
            <div style={{ fontSize: '10px', color: '#94A3B8' }}>Origin / Extraction</div>
            <div style={{ fontSize: '13px', fontWeight: 700 }}>{origin}</div>
          </div>
          <div style={{ background: theme === 'dark' ? '#1E1633' : '#FFFFFF', padding: '10px 14px', borderRadius: '8px' }}>
            <div style={{ fontSize: '10px', color: '#94A3B8' }}>Estimated Facet Yield</div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#10B981' }}>{estimatedYield}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
