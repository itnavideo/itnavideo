import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface GoogleJamboardCanvasProps {
  jamTitle?: string;
}

export const GoogleJamboardCanvas: React.FC<GoogleJamboardCanvasProps> = (props) => {
  const {
    jamTitle = "Interactive UI Architecture Jam",
  } = props;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame, fps, config: { damping: 14 } });

  return (
    <div style={{
      width: '100%',
      height: '100%',
      backgroundColor: '#f8f9fa',
      padding: '24px',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'Roboto, Segoe UI, sans-serif',
      opacity: entrance,
    }}>
      <div style={{ backgroundColor: '#ffffff', borderRadius: '8px', padding: '24px', flex: 1, boxShadow: '0 2px 10px rgba(0,0,0,0.08)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div style={{ borderBottom: '1px solid #e0e0e0', paddingBottom: '10px', fontSize: '14px', fontWeight: 700, color: '#ff7043' }}>
          🖌️ Google Jamboard • {jamTitle}
        </div>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
          <div style={{ width: '120px', height: '100px', backgroundColor: '#80d8ff', padding: '10px', borderRadius: '4px', fontSize: '11px' }}>
            Next.js App Router Hybrid SSR
          </div>
          <div style={{ width: '120px', height: '100px', backgroundColor: '#ffd180', padding: '10px', borderRadius: '4px', fontSize: '11px' }}>
            Supabase RLS Data APIs
          </div>
        </div>
        <div style={{ fontSize: '10px', color: '#9aa0a6', textAlign: 'center' }}>Frame 1 / 4</div>
      </div>
    </div>
  );
};
