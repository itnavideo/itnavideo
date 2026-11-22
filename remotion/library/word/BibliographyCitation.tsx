import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface BibliographyCitationProps {
  citationStyle?: string;
  sourceType?: string;
  author?: string;
  year?: number;
  publicationTitle?: string;
}

export const BibliographyCitation: React.FC<BibliographyCitationProps> = (props) => {
  const {
    citationStyle = "APA 7th Edition",
    sourceType = "Journal Article",
    author = "Nakamoto, S., & Szabo, N.",
    year = 2024,
    publicationTitle = "Decentralized Consensus Protocols in Zero-Trust Environments",
  } = props;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame, fps, config: { damping: 14 } });

  return (
    <div style={{
      width: '100%',
      height: '100%',
      backgroundColor: '#090d16',
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
        <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700 }}>Manage Sources & Citations</h3>
        <span style={{ fontSize: '11px', backgroundColor: '#2563eb', color: '#fff', padding: '3px 8px', borderRadius: '4px', fontWeight: 600 }}>
          Style: {citationStyle}
        </span>
      </div>

      {/* Formatted References List */}
      <div style={{
        backgroundColor: '#ffffff',
        color: '#1e293b',
        borderRadius: '8px',
        padding: '28px',
        boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}>
        <div style={{ fontSize: '18px', fontWeight: 800, textAlign: 'center', color: '#0f172a' }}>References</div>
        
        {/* Hanging Indent Entry */}
        <div style={{
          paddingLeft: '24px',
          textIndent: '-24px',
          fontSize: '13px',
          lineHeight: '1.8',
          color: '#334155',
        }}>
          {author} ({year}). {publicationTitle}. <em>Journal of Distributed Computing Systems</em>, 42(3), 115-132. https://doi.org/10.1016/j.jdcs.2024.08
        </div>

        {/* In-Text Citation Badge */}
        <div style={{
          marginTop: 'auto',
          backgroundColor: '#f1f5f9',
          borderRadius: '6px',
          padding: '12px 16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <span style={{ fontSize: '12px', color: '#64748b' }}>In-text Citation Preview:</span>
          <span style={{ fontSize: '13px', fontWeight: 700, color: '#2563eb' }}>({author.split(',')[0]}, {year})</span>
        </div>
      </div>
    </div>
  );
};
