import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface FootnoteEndnoteVisualizerProps {
  footnoteId?: number;
  bodyCitation?: string;
  footnoteDetail?: string;
  numberingFormat?: string;
}

export const FootnoteEndnoteVisualizer: React.FC<FootnoteEndnoteVisualizerProps> = (props) => {
  const {
    footnoteId = 1,
    bodyCitation = "quantum cryptography protocols applied across transatlantic fiber trunks",
    footnoteDetail = "National Institute of Standards and Technology (NIST) Special Publication 800-208, Post-Quantum Digital Signature Schemes (2024).",
    numberingFormat = "1, 2, 3...",
  } = props;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const anim = spring({ frame, fps, config: { damping: 14 } });
  const highlightGlow = (Math.sin(frame * 0.15) + 1) * 0.5;

  return (
    <div style={{
      width: '100%',
      height: '100%',
      backgroundColor: '#0f172a',
      padding: '24px',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'Segoe UI, sans-serif',
      opacity: anim,
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        flex: 1,
        borderRadius: '8px',
        padding: '32px',
        color: '#1e293b',
        boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}>
        {/* Body Text with Superscript Callout */}
        <div>
          <div style={{ fontSize: '16px', fontWeight: 700, marginBottom: '12px', color: '#0f172a' }}>
            Section 6.4: Cryptographic Key Distribution
          </div>
          <p style={{ fontSize: '13px', lineHeight: '1.9', color: '#334155', margin: 0 }}>
            Recent telemetry logs corroborate that implementing {bodyCitation}
            <sup style={{
              color: '#2563eb',
              fontWeight: 800,
              fontSize: '11px',
              backgroundColor: `rgba(37, 99, 235, ${0.15 + highlightGlow * 0.2})`,
              padding: '2px 4px',
              borderRadius: '3px',
              cursor: 'pointer',
            }}>
              [{footnoteId}]
            </sup>{' '}
            substantially mitigated eavesdropping vulnerabilities during high-frequency transaction cycles.
          </p>
        </div>

        {/* Separator Line & Footnote Area */}
        <div>
          <div style={{ width: '120px', height: '1.5px', backgroundColor: '#94a3b8', marginBottom: '10px' }} />
          <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#2563eb' }}>{footnoteId}.</span>
            <p style={{ fontSize: '11px', lineHeight: '1.6', color: '#64748b', margin: 0 }}>
              {footnoteDetail}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
