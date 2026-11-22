import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface MarkdownDocumentPreviewProps {
  fileName?: string;
  themeColor?: string;
}

export const MarkdownDocumentPreview: React.FC<MarkdownDocumentPreviewProps> = (props) => {
  const {
    fileName = "AGENTS.md",
    themeColor = "#7C3AED",
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
        <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700 }}>Markdown Live Split Preview</h3>
        <span style={{ backgroundColor: themeColor, color: '#fff', fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '4px' }}>
          {fileName}
        </span>
      </div>

      <div style={{ display: 'flex', gap: '14px', flex: 1 }}>
        {/* Left: Raw Markdown Code */}
        <div style={{ flex: 1, backgroundColor: '#1e293b', borderRadius: '8px', padding: '16px', fontFamily: 'Consolas, monospace', fontSize: '12px', lineHeight: '1.7', color: '#cbd5e1', border: '1px solid #334155' }}>
          <span style={{ color: '#7b83eb' }}># Master Agent Rules</span><br />
          &gt; Zero Local Heavy Compute<br /><br />
          * Rule 6: 4GB RAM Safeguards<br />
          * Rule 7: Zero Unprompted Git Push<br />
          * Rule 8: 100% Unique Components
        </div>

        {/* Right: Rendered HTML Canvas */}
        <div style={{ flex: 1, backgroundColor: '#ffffff', color: '#1e293b', borderRadius: '8px', padding: '16px', fontSize: '12px', lineHeight: '1.7', boxShadow: '0 4px 16px rgba(0,0,0,0.2)' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 800, margin: '0 0 8px 0', color: '#7c3aed' }}>Master Agent Rules</h2>
          <blockquote style={{ borderLeft: '3px solid #7c3aed', margin: '0 0 8px 0', paddingLeft: '8px', color: '#64748b' }}>
            Zero Local Heavy Compute
          </blockquote>
          <ul style={{ margin: 0, paddingLeft: '18px' }}>
            <li>Rule 6: 4GB RAM Safeguards</li>
            <li>Rule 7: Zero Unprompted Git Push</li>
            <li>Rule 8: 100% Unique Components</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
