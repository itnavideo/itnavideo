import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface FileMetadataInspectorProps {
  fileName?: string;
  fileSizeBytes?: string;
  mimeType?: string;
}

export const FileMetadataInspector: React.FC<FileMetadataInspectorProps> = (props) => {
  const {
    fileName = "itnavideo_promo_reel_1080p.mp4",
    fileSizeBytes = "142,850,294 Bytes (136.2 MB)",
    mimeType = "video/mp4; codecs=\"avc1.640028, mp4a.40.2\"",
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
      gap: '14px',
      fontFamily: 'Segoe UI, sans-serif',
      opacity: entrance,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700 }}>File Metadata Inspector</h3>
        <span style={{ fontSize: '11px', color: '#38bdf8' }}>POSIX File Info</span>
      </div>

      <div style={{
        backgroundColor: '#1e293b',
        borderRadius: '8px',
        padding: '16px',
        border: '1px solid #334155',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        fontSize: '12px',
      }}>
        <div>
          <div style={{ fontSize: '14px', fontWeight: 700, color: '#f8fafc' }}>{fileName}</div>
          <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>{fileSizeBytes}</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', color: '#cbd5e1' }}>
          <div><strong>MIME:</strong> <code>{mimeType}</code></div>
          <div><strong>Permissions:</strong> <code>-rw-r--r-- (0644)</code></div>
          <div><strong>Storage Bucket:</strong> <code>s3://itnavideo-media-assets/renders/</code></div>
        </div>
      </div>
    </div>
  );
};
