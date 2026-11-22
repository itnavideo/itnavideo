import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface PDFDocumentReaderProps {
  documentTitle?: string;
  currentPage?: number;
  totalPages?: number;
  zoomLevel?: number;
  themeColor?: string;
}

export const PDFDocumentReader: React.FC<PDFDocumentReaderProps> = (props) => {
  const {
    documentTitle = "Master_Architecture_Specification_v4.pdf",
    currentPage = 12,
    totalPages = 84,
    zoomLevel = 100,
    themeColor = "#DC2626",
  } = props;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame, fps, config: { damping: 14 } });

  return (
    <div style={{
      width: '100%',
      height: '100%',
      backgroundColor: '#1e293b',
      color: '#f8fafc',
      padding: '24px',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'Segoe UI, system-ui, sans-serif',
      opacity: entrance,
      transform: `translateY(${(1 - entrance) * 20}px)`,
    }}>
      {/* PDF Acrobat Top Bar */}
      <div style={{
        backgroundColor: '#0f172a',
        borderRadius: '8px 8px 0 0',
        padding: '10px 18px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid #334155',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '24px', height: '24px', backgroundColor: themeColor, borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '13px', color: '#fff' }}>PDF</div>
          <span style={{ fontSize: '13px', fontWeight: 600 }}>{documentTitle}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '12px', color: '#cbd5e1' }}>
          <span>Page {currentPage} / {totalPages}</span>
          <span>Zoom: {zoomLevel}%</span>
        </div>
      </div>

      {/* Reader White Page Canvas */}
      <div style={{
        flex: 1,
        backgroundColor: '#ffffff',
        borderRadius: '0 0 8px 8px',
        padding: '36px',
        color: '#1e293b',
        boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}>
        <div>
          <div style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
            Section 12: High-Performance Video Rendering Pipeline
          </div>
          <p style={{ fontSize: '13px', lineHeight: '1.8', color: '#334155', margin: 0 }}>
            Programmatic video compositions rendered via Remotion AWS Lambda clusters execute parallel frame dispatching across Chromium headless nodes. This architecture ensures render workloads finish under two minutes while maintaining strict zero-error reliability.
          </p>
        </div>

        <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#94a3b8' }}>
          <span>Adobe PDF Compliant • PDF/A-2b Standard</span>
          <span>Document Hash: SHA-256 Verified</span>
        </div>
      </div>
    </div>
  );
};
