import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface GoogleCloudSearchEnterpriseProps {
  searchQuery?: string;
}

export const GoogleCloudSearchEnterprise: React.FC<GoogleCloudSearchEnterpriseProps> = (props) => {
  const {
    searchQuery = "Remotion rendering quota AWS Lambda",
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
      gap: '14px',
      fontFamily: 'Roboto, Segoe UI, sans-serif',
      opacity: entrance,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: '#f1f3f4', padding: '10px 16px', borderRadius: '24px' }}>
        <span>🔍</span>
        <span style={{ fontSize: '13px' }}>{searchQuery}</span>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ padding: '8px 12px', borderBottom: '1px solid #dadce0' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#1a73e8' }}>📄 RFC 402: Remotion Video Rendering Architecture.gdoc</div>
          <div style={{ fontSize: '11px', color: '#5f6368' }}>Google Docs • Last edited yesterday by Sarah Connor</div>
        </div>
        <div style={{ padding: '8px 12px', borderBottom: '1px solid #dadce0' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#1a73e8' }}>田 Q4_Cloud_Rendering_Costs.gsheet</div>
          <div style={{ fontSize: '11px', color: '#5f6368' }}>Google Sheets • Shared with Engineering Group</div>
        </div>
      </div>
    </div>
  );
};
