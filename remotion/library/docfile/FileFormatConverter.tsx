import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface FileFormatConverterProps {
  sourceExt?: string;
  targetExt?: string;
  statusText?: string;
}

export const FileFormatConverter: React.FC<FileFormatConverterProps> = (props) => {
  const {
    sourceExt = ".DOCX",
    targetExt = ".PDF",
    statusText = "Vector typography & hyperlinks preserved cleanly",
  } = props;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame, fps, config: { damping: 14 } });

  return (
    <div style={{
      width: '100%',
      height: '100%',
      backgroundColor: '#0c101c',
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
        <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700 }}>Document Format Converter</h3>
        <span style={{ fontSize: '11px', color: '#38bdf8' }}>Lossless Pipeline</span>
      </div>

      <div style={{ display: 'flex', gap: '20px', flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ backgroundColor: '#2563eb', padding: '16px 24px', borderRadius: '8px', fontWeight: 800, fontSize: '18px' }}>
          {sourceExt}
        </div>
        <span style={{ fontSize: '24px' }}>➔</span>
        <div style={{ backgroundColor: '#dc2626', padding: '16px 24px', borderRadius: '8px', fontWeight: 800, fontSize: '18px' }}>
          {targetExt}
        </div>
      </div>

      <div style={{ fontSize: '11px', color: '#cbd5e1', textAlign: 'center' }}>{statusText}</div>
    </div>
  );
};
