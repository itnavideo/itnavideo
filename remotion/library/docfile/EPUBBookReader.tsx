import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface EPUBBookReaderProps {
  bookTitle?: string;
  chapterNumber?: number;
  progressPct?: number;
}

export const EPUBBookReader: React.FC<EPUBBookReaderProps> = (props) => {
  const {
    bookTitle = "Architecting Serverless Media Pipelines",
    chapterNumber = 7,
    progressPct = 48,
  } = props;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame, fps, config: { damping: 14 } });

  return (
    <div style={{
      width: '100%',
      height: '100%',
      backgroundColor: '#fbf0d9',
      color: '#332b1d',
      padding: '24px',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'Georgia, serif',
      opacity: entrance,
    }}>
      <div style={{ borderBottom: '1px solid #e6d3af', paddingBottom: '8px', display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontStyle: 'italic' }}>
        <span>{bookTitle}</span>
        <span>Chapter {chapterNumber}</span>
      </div>

      <div style={{ flex: 1, padding: '24px 0', fontSize: '14px', lineHeight: '1.9', textAlign: 'justify' }}>
        The fundamental prerequisite of horizontally scalable media systems lies in the total decoupling of state from compute execution workers. When transcoding video chunks, serverless functions handle discrete time slices with deterministic reproducibility.
      </div>

      <div style={{ borderTop: '1px solid #e6d3af', paddingTop: '8px', display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
        <span>Reading Progress: {progressPct}%</span>
        <span>Page 142 of 296</span>
      </div>
    </div>
  );
};
