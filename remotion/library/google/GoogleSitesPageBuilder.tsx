import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface GoogleSitesPageBuilderProps {
  siteTitle?: string;
}

export const GoogleSitesPageBuilder: React.FC<GoogleSitesPageBuilderProps> = (props) => {
  const {
    siteTitle = "Itnavideo Internal Knowledge Base",
  } = props;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame, fps, config: { damping: 14 } });

  return (
    <div style={{
      width: '100%',
      height: '100%',
      backgroundColor: '#ffffff',
      color: '#202124',
      padding: '24px',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'Roboto, Segoe UI, sans-serif',
      opacity: entrance,
    }}>
      <div style={{ backgroundColor: '#1a73e8', color: '#fff', padding: '16px 20px', borderRadius: '6px' }}>
        <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>{siteTitle}</h2>
        <span style={{ fontSize: '11px', opacity: 0.9 }}>Intranet Portal for Engineering & Creative Teams</span>
      </div>
      <div style={{ flex: 1, marginTop: '16px', border: '1px dashed #dadce0', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#5f6368', fontSize: '13px' }}>
        Drag and drop Drive widgets, Calendar feeds, and YouTube explainer reels.
      </div>
    </div>
  );
};
