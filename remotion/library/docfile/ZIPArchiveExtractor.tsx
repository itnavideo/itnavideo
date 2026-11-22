import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface ZIPArchiveExtractorProps {
  archiveName?: string;
  filesCount?: number;
  compressedSizeMb?: number;
  uncompressedSizeMb?: number;
}

export const ZIPArchiveExtractor: React.FC<ZIPArchiveExtractorProps> = (props) => {
  const {
    archiveName = "production_remotion_library.tar.gz",
    filesCount = 1162,
    compressedSizeMb = 42.8,
    uncompressedSizeMb = 184.2,
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
        <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700 }}>Archive File Compression</h3>
        <span style={{ fontSize: '11px', color: '#f59e0b' }}>76.8% Space Saved</span>
      </div>

      <div style={{
        backgroundColor: '#1e293b',
        borderRadius: '8px',
        padding: '20px',
        border: '1px solid #334155',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '32px' }}>🗜️</span>
          <div>
            <div style={{ fontSize: '14px', fontWeight: 700 }}>{archiveName}</div>
            <div style={{ fontSize: '11px', color: '#94a3b8' }}>{filesCount.toLocaleString()} Compressed Source Files</div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-around', textAlign: 'center' }}>
          <div>
            <div style={{ fontSize: '20px', fontWeight: 800, color: '#ef4444' }}>{uncompressedSizeMb} MB</div>
            <div style={{ fontSize: '10px', color: '#94a3b8' }}>Uncompressed Size</div>
          </div>
          <span style={{ fontSize: '20px' }}>➔</span>
          <div>
            <div style={{ fontSize: '20px', fontWeight: 800, color: '#4ade80' }}>{compressedSizeMb} MB</div>
            <div style={{ fontSize: '10px', color: '#94a3b8' }}>Gzip Archive Size</div>
          </div>
        </div>

        <div style={{ fontSize: '11px', color: '#cbd5e1', textAlign: 'center' }}>
          DEFLATE Algorithm • CRC-32 Checksum Verified Clean
        </div>
      </div>
    </div>
  );
};
