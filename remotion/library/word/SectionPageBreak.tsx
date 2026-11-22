import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface SectionPageBreakProps {
  breakType?: string;
  sectionOneOrientation?: string;
  sectionTwoOrientation?: string;
}

export const SectionPageBreak: React.FC<SectionPageBreakProps> = (props) => {
  const {
    breakType = "Section Break (Next Page)",
    sectionOneOrientation = "Portrait (8.5 x 11 in)",
    sectionTwoOrientation = "Landscape (11 x 8.5 in)",
  } = props;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame, fps, config: { damping: 14 } });

  return (
    <div style={{
      width: '100%',
      height: '100%',
      backgroundColor: '#0c1322',
      color: '#f8fafc',
      padding: '24px',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      fontFamily: 'Segoe UI, sans-serif',
      opacity: entrance,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700 }}>Page & Section Break Visualizer</h3>
        <span style={{ fontSize: '11px', backgroundColor: '#ef4444', color: '#fff', padding: '3px 8px', borderRadius: '4px', fontWeight: 600 }}>
          {breakType}
        </span>
      </div>

      {/* Dual Page Mockup: Portrait into Landscape */}
      <div style={{ display: 'flex', gap: '20px', flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        {/* Page 1 (Section 1) */}
        <div style={{
          width: '160px',
          height: '220px',
          backgroundColor: '#ffffff',
          borderRadius: '4px',
          padding: '16px',
          color: '#1e293b',
          boxShadow: '0 4px 14px rgba(0,0,0,0.4)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}>
          <div>
            <div style={{ fontSize: '10px', fontWeight: 700, color: '#2563eb' }}>SECTION 1</div>
            <div style={{ fontSize: '9px', color: '#64748b' }}>{sectionOneOrientation}</div>
            <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ height: '4px', backgroundColor: '#cbd5e1', borderRadius: '2px', width: '100%' }} />
              <div style={{ height: '4px', backgroundColor: '#cbd5e1', borderRadius: '2px', width: '85%' }} />
              <div style={{ height: '4px', backgroundColor: '#cbd5e1', borderRadius: '2px', width: '90%' }} />
            </div>
          </div>
          <div style={{ fontSize: '8px', color: '#94a3b8', textAlign: 'center' }}>Page 1</div>
        </div>

        {/* Break Divider Arrow */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '20px' }}>⚡</span>
          <span style={{ fontSize: '9px', color: '#f87171', border: '1px dashed #ef4444', padding: '2px 6px', borderRadius: '2px' }}>
            Next Page Break
          </span>
        </div>

        {/* Page 2 (Section 2 - Landscape Table) */}
        <div style={{
          width: '220px',
          height: '160px',
          backgroundColor: '#ffffff',
          borderRadius: '4px',
          padding: '16px',
          color: '#1e293b',
          boxShadow: '0 4px 14px rgba(0,0,0,0.4)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}>
          <div>
            <div style={{ fontSize: '10px', fontWeight: 700, color: '#16a34a' }}>SECTION 2</div>
            <div style={{ fontSize: '9px', color: '#64748b' }}>{sectionTwoOrientation}</div>
            <div style={{ marginTop: '10px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '4px' }}>
              <div style={{ height: '14px', backgroundColor: '#e2e8f0', borderRadius: '2px' }} />
              <div style={{ height: '14px', backgroundColor: '#e2e8f0', borderRadius: '2px' }} />
              <div style={{ height: '14px', backgroundColor: '#e2e8f0', borderRadius: '2px' }} />
            </div>
          </div>
          <div style={{ fontSize: '8px', color: '#94a3b8', textAlign: 'center' }}>Page 2 (Wide Grid)</div>
        </div>
      </div>
    </div>
  );
};
