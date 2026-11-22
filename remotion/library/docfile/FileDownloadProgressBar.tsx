import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface FileDownloadProgressBarProps {
  fileName?: string;
  downloadSpeed?: string;
  downloadPct?: number;
}

export const FileDownloadProgressBar: React.FC<FileDownloadProgressBarProps> = (props) => {
  const {
    fileName = "Remotion_Video_Assets_1080p.zip",
    downloadSpeed = "52.4 MB/s",
    downloadPct = 84,
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
        <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700 }}>High-Speed CDN Asset Ingestion</h3>
        <span style={{ fontSize: '11px', color: '#38bdf8' }}>{downloadSpeed}</span>
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
        <div>
          <div style={{ fontSize: '14px', fontWeight: 700 }}>{fileName}</div>
          <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>Transferred from Cloudinary CDN edge node</div>
        </div>

        <div>
          <div style={{ width: '100%', height: '10px', backgroundColor: '#0f172a', borderRadius: '5px', overflow: 'hidden' }}>
            <div style={{ width: `${downloadPct}%`, height: '100%', backgroundColor: '#38bdf8' }} />
          </div>
        </div>

        <div style={{ fontSize: '10px', color: '#4ade80' }}>Integrity Check: SHA-256 match confirmed</div>
      </div>
    </div>
  );
};
