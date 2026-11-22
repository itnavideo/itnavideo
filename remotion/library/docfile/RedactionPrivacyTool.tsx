import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface RedactionPrivacyToolProps {
  scrubbedFieldsCount?: number;
}

export const RedactionPrivacyTool: React.FC<RedactionPrivacyToolProps> = (props) => {
  const {
    scrubbedFieldsCount = 4,
  } = props;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame, fps, config: { damping: 14 } });

  return (
    <div style={{
      width: '100%',
      height: '100%',
      backgroundColor: '#0c101c',
      padding: '24px',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'Segoe UI, sans-serif',
      opacity: entrance,
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        padding: '24px',
        color: '#1e293b',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
      }}>
        <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '8px', display: 'flex', justifyContent: 'space-between' }}>
          <strong style={{ fontSize: '14px' }}>CONFIDENTIAL AUDIT TRANSCRIPT</strong>
          <span style={{ backgroundColor: '#000', color: '#fff', fontSize: '10px', padding: '2px 6px', borderRadius: '2px', fontWeight: 800 }}>PERMANENTLY REDACTED</span>
        </div>

        <div style={{ fontSize: '13px', lineHeight: '2' }}>
          Patient SSN: <span style={{ backgroundColor: '#000', color: '#000', userSelect: 'none' }}>XXX-XX-8492</span><br />
          Credit Card: <span style={{ backgroundColor: '#000', color: '#000', userSelect: 'none' }}>4111-XXXX-XXXX-9912</span><br />
          Home Address: <span style={{ backgroundColor: '#000', color: '#000', userSelect: 'none' }}>1428 Elm Street, Boston MA</span>
        </div>

        <div style={{ fontSize: '10px', color: '#64748b' }}>
          Underlying metadata layers sanitised to prevent byte-level extraction.
        </div>
      </div>
    </div>
  );
};
