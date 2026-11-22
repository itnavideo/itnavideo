import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface HeaderFooterEditorProps {
  headerTitle?: string;
  pageNumber?: number;
  totalPages?: number;
  confidentialText?: string;
}

export const HeaderFooterEditor: React.FC<HeaderFooterEditorProps> = (props) => {
  const {
    headerTitle = "CONFIDENTIAL CORPORATE STRATEGY REPORT",
    pageNumber = 14,
    totalPages = 42,
    confidentialText = "RESTRICTED DISTRIBUTION - INTERNAL USE ONLY",
  } = props;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const anim = spring({ frame, fps, config: { damping: 14 } });

  return (
    <div style={{
      width: '100%',
      height: '100%',
      backgroundColor: '#0f172a',
      padding: '24px',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'Segoe UI, sans-serif',
      opacity: anim,
    }}>
      {/* Editor Page Container */}
      <div style={{
        backgroundColor: '#ffffff',
        flex: 1,
        borderRadius: '8px',
        padding: '24px 36px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
        position: 'relative',
      }}>
        {/* Header Zone (Active Focus) */}
        <div style={{
          border: '2px dashed #2563eb',
          backgroundColor: 'rgba(37, 99, 235, 0.04)',
          borderRadius: '4px',
          padding: '12px 16px',
          position: 'relative',
        }}>
          <span style={{
            position: 'absolute',
            top: '-10px',
            left: '12px',
            backgroundColor: '#2563eb',
            color: '#fff',
            fontSize: '10px',
            fontWeight: 700,
            padding: '1px 6px',
            borderRadius: '2px',
          }}>HEADER (SECTION 2 - UNLINKED)</span>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#1e293b', letterSpacing: '0.5px' }}>{headerTitle}</span>
            <span style={{ fontSize: '10px', color: '#dc2626', fontWeight: 600 }}>{confidentialText}</span>
          </div>
          <div style={{ height: '1px', backgroundColor: '#cbd5e1', marginTop: '8px' }} />
        </div>

        {/* Dimmed Document Body */}
        <div style={{ padding: '24px 8px', color: '#94a3b8', fontSize: '13px', lineHeight: '1.8', opacity: 0.4 }}>
          [Document Body text is locked while Header and Footer Tools are activated. Double-click main canvas to return to normal editing mode.]
        </div>

        {/* Footer Zone (Active Focus) */}
        <div style={{
          border: '2px dashed #2563eb',
          backgroundColor: 'rgba(37, 99, 235, 0.04)',
          borderRadius: '4px',
          padding: '12px 16px',
          position: 'relative',
        }}>
          <span style={{
            position: 'absolute',
            top: '-10px',
            left: '12px',
            backgroundColor: '#2563eb',
            color: '#fff',
            fontSize: '10px',
            fontWeight: 700,
            padding: '1px 6px',
            borderRadius: '2px',
          }}>FOOTER</span>
          <div style={{ height: '1px', backgroundColor: '#cbd5e1', marginBottom: '8px' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '10px', color: '#64748b' }}>ISO 27001 Certified Documentation</span>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a' }}>Page {pageNumber} of {totalPages}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
