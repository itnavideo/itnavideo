import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface WordWordCountStatsProps {
  words?: number;
  charactersNoSpaces?: number;
  charactersWithSpaces?: number;
  paragraphs?: number;
  lines?: number;
  readingTimeMin?: number;
}

export const WordWordCountStats: React.FC<WordWordCountStatsProps> = (props) => {
  const {
    words = 4250,
    charactersNoSpaces = 23410,
    charactersWithSpaces = 27860,
    paragraphs = 64,
    lines = 382,
    readingTimeMin = 17,
  } = props;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const countAnim = spring({ frame, fps, config: { damping: 12 } });
  const displayWords = Math.floor((words || 4250) * Math.min(1, countAnim));

  return (
    <div style={{
      width: '100%',
      height: '100%',
      backgroundColor: '#0c1322',
      color: '#f8fafc',
      padding: '24px',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      fontFamily: 'Segoe UI, sans-serif',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #334155', paddingBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '18px' }}>📊</span>
          <span style={{ fontSize: '15px', fontWeight: 700 }}>Document Word Count & Statistics</span>
        </div>
        <span style={{ fontSize: '11px', color: '#38bdf8' }}>Word Status Bar Metric</span>
      </div>

      {/* Main Big Metric */}
      <div style={{
        backgroundColor: '#1e293b',
        borderRadius: '8px',
        padding: '20px',
        border: '1px solid #334155',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '36px', fontWeight: 800, color: '#38bdf8' }}>{displayWords.toLocaleString()}</div>
          <div style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase' }}>Total Words</div>
        </div>
        <div style={{ width: '1px', height: '48px', backgroundColor: '#334155' }} />
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '36px', fontWeight: 800, color: '#4ade80' }}>~{readingTimeMin} min</div>
          <div style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase' }}>Reading Time</div>
        </div>
      </div>

      {/* Granular Breakdown Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', flex: 1 }}>
        <div style={{ backgroundColor: '#1e293b', padding: '12px 16px', borderRadius: '6px', display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '12px', color: '#cbd5e1' }}>Characters (no spaces)</span>
          <span style={{ fontSize: '12px', fontWeight: 700, color: '#f8fafc' }}>{charactersNoSpaces.toLocaleString()}</span>
        </div>
        <div style={{ backgroundColor: '#1e293b', padding: '12px 16px', borderRadius: '6px', display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '12px', color: '#cbd5e1' }}>Characters (with spaces)</span>
          <span style={{ fontSize: '12px', fontWeight: 700, color: '#f8fafc' }}>{charactersWithSpaces.toLocaleString()}</span>
        </div>
        <div style={{ backgroundColor: '#1e293b', padding: '12px 16px', borderRadius: '6px', display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '12px', color: '#cbd5e1' }}>Paragraphs</span>
          <span style={{ fontSize: '12px', fontWeight: 700, color: '#f8fafc' }}>{paragraphs}</span>
        </div>
        <div style={{ backgroundColor: '#1e293b', padding: '12px 16px', borderRadius: '6px', display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '12px', color: '#cbd5e1' }}>Lines</span>
          <span style={{ fontSize: '12px', fontWeight: 700, color: '#f8fafc' }}>{lines}</span>
        </div>
      </div>
    </div>
  );
};
