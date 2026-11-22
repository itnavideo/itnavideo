import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface DropCapParagraphProps {
  dropLetter?: string;
  linesToDrop?: number;
  fontFamily?: string;
  themeColor?: string;
}

export const DropCapParagraph: React.FC<DropCapParagraphProps> = (props) => {
  const {
    dropLetter = "O",
    linesToDrop = 3,
    fontFamily = "Georgia, serif",
    themeColor = "#2B579A",
  } = props;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const anim = spring({ frame, fps, config: { damping: 14 } });

  return (
    <div style={{
      width: '100%',
      height: '100%',
      backgroundColor: '#0c1322',
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
        padding: '36px',
        color: '#1e293b',
        boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
      }}>
        <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '14px' }}>
          Editorial Typography • Drop Cap ({linesToDrop} Lines)
        </div>

        {/* Paragraph with Drop Cap */}
        <div style={{ fontSize: '14px', lineHeight: '1.8', color: '#334155', textAlign: 'justify' }}>
          <span style={{
            float: 'left',
            fontSize: '64px',
            lineHeight: '0.8',
            paddingTop: '6px',
            paddingRight: '12px',
            paddingBottom: '4px',
            fontFamily: fontFamily,
            fontWeight: 800,
            color: themeColor,
          }}>
            {dropLetter}
          </span>
          ver the past decade, automated natural language generation and structured word processing have converged to transform corporate storytelling into high-retention visual assets. Organizations that adopt modern typographical standards report higher stakeholder comprehension and faster sign-off cycles across international compliance workflows.
        </div>
      </div>
    </div>
  );
};
