import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface GoogleDocsCollaborationProps {
  documentTitle?: string;
  activeCollaborator1?: string;
  activeCollaborator2?: string;
  themeColor?: string;
}

export const GoogleDocsCollaboration: React.FC<GoogleDocsCollaborationProps> = (props) => {
  const {
    documentTitle = "Engineering System Architecture RFC.gdoc",
    activeCollaborator1 = "Sarah Connor",
    activeCollaborator2 = "Marcus Vance",
    themeColor = "#1A73E8",
  } = props;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame, fps, config: { damping: 14 } });
  const cursorBlink = Math.sin(frame * 0.2) > 0;

  return (
    <div style={{
      width: '100%',
      height: '100%',
      backgroundColor: '#f8f9fa',
      color: '#202124',
      padding: '24px',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'Roboto, Segoe UI, sans-serif',
      opacity: entrance,
      transform: `translateY(${(1 - entrance) * 20}px)`,
    }}>
      {/* Top Docs App Bar */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        padding: '12px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        marginBottom: '16px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '28px', height: '36px', backgroundColor: '#1A73E8', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 900, fontSize: '18px' }}>📄</div>
          <div>
            <div style={{ fontSize: '15px', fontWeight: 700 }}>{documentTitle}</div>
            <div style={{ fontSize: '11px', color: '#5f6368' }}>File • Edit • View • Insert • Format • Tools</div>
          </div>
        </div>

        {/* Live Collaborator Avatars */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#ea4335', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '12px', border: '2px solid #fff' }}>SC</div>
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#34a853', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '12px', border: '2px solid #fff' }}>MV</div>
          <button style={{ backgroundColor: '#1a73e8', color: '#fff', border: 'none', borderRadius: '18px', padding: '6px 16px', fontSize: '12px', fontWeight: 700 }}>🔒 Share</button>
        </div>
      </div>

      {/* Editor Page Surface */}
      <div style={{
        flex: 1,
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        padding: '36px 48px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
      }}>
        <h1 style={{ fontSize: '24px', fontWeight: 800, margin: '0 0 16px 0', color: '#1a73e8' }}>
          RFC 402: Remotion Video Rendering Architecture
        </h1>

        <p style={{ fontSize: '14px', lineHeight: '1.8', color: '#3c4043', margin: 0 }}>
          This proposal mandates the implementation of distributed Chromium rendering across AWS Lambda clusters. By offloading video encoding jobs to serverless containers, local dev hardware remains completely insulated from heavy compute thrashing.
        </p>

        {/* Collaborator Colored Cursor Tag */}
        <div style={{
          position: 'absolute',
          top: '160px',
          left: '320px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
        }}>
          <div style={{ backgroundColor: '#34a853', color: '#fff', fontSize: '10px', fontWeight: 700, padding: '2px 6px', borderRadius: '4px' }}>
            {activeCollaborator2}
          </div>
          <div style={{ width: '2px', height: '18px', backgroundColor: '#34a853' }} />
        </div>
      </div>
    </div>
  );
};
