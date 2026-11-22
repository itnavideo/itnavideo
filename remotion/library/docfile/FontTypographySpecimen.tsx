import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface FontTypographySpecimenProps {
  fontFamilyName?: string;
  weightsCount?: number;
}

export const FontTypographySpecimen: React.FC<FontTypographySpecimenProps> = (props) => {
  const {
    fontFamilyName = "Inter Display / Geist Mono",
    weightsCount = 9,
  } = props;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame, fps, config: { damping: 14 } });

  return (
    <div style={{
      width: '100%',
      height: '100%',
      backgroundColor: '#ffffff',
      color: '#1e293b',
      padding: '24px',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'Segoe UI, sans-serif',
      opacity: entrance,
    }}>
      <div style={{ borderBottom: '2px solid #0f172a', paddingBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>{fontFamilyName}</h2>
        <span style={{ fontSize: '11px', color: '#64748b' }}>{weightsCount} Font Weights</span>
      </div>

      <div style={{ flex: 1, padding: '24px 0', display: 'flex', flexDirection: 'column', justifyContent: 'space-around' }}>
        <div style={{ fontSize: '28px', fontWeight: 900 }}>The quick brown fox jumps over the lazy dog.</div>
        <div style={{ fontSize: '18px', fontWeight: 600 }}>ABCDEFGHIJKLMNOPQRSTUVWXYZ 0123456789</div>
        <div style={{ fontSize: '12px', color: '#64748b' }}>Modern geometric sans-serif tuned for 4K video subtitles.</div>
      </div>
    </div>
  );
};
