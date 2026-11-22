import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface TerminalProps {
  command?: string;
  outputLines?: string[];
  theme?: 'dark' | 'light';
  delayFrames?: number;
  width?: number | string;
  style?: React.CSSProperties;
}

const DEFAULT_OUTPUT = [
  '✔ Audio extracted in 0.12s',
  '✔ Groq Whisper speech-to-text: 184 words synchronized',
  '✔ AWS Lambda 30fps Chromium video cluster launched',
  '🚀 Render complete: 1080x1920 MP4 exported in 48.2s',
];

export const Terminal: React.FC<TerminalProps> = ({
  command = 'npm run render:cloud --composition=FACELESS_SHORTS',
  outputLines = DEFAULT_OUTPUT,
  theme = 'dark',
  delayFrames = 5,
  width = '100%',
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const termSpring = spring({
    frame: Math.max(0, frame - delayFrames),
    fps,
    config: { damping: 14, stiffness: 90 },
  });

  return (
    <div
      style={{
        width,
        backgroundColor: '#090D16',
        border: '1px solid #1E293B',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 20px 50px rgba(0,0,0,0.65)',
        boxSizing: 'border-box',
        fontFamily: 'JetBrains Mono, Menlo, Consolas, monospace',
        transform: `scale(${termSpring})`,
        opacity: termSpring,
        ...style,
      }}
    >
      {/* Top Bar */}
      <div
        style={{
          height: '36px',
          backgroundColor: '#0F172A',
          borderBottom: '1px solid #1E293B',
          display: 'flex',
          alignItems: 'center',
          padding: '0 14px',
          gap: '10px',
        }}
      >
        <div style={{ display: 'flex', gap: '6px' }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#EF4444' }} />
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#F59E0B' }} />
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#10B981' }} />
        </div>
        <span style={{ fontSize: '11px', color: '#64748B', marginLeft: 'auto' }}>bash (zsh)</span>
      </div>

      {/* Terminal Prompt */}
      <div style={{ padding: '16px 20px', fontSize: '13px', lineHeight: 1.7, color: '#F8FAFC' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#38BDF8' }}>
          <span style={{ color: '#10B981', fontWeight: 900 }}>❯</span>
          <span style={{ color: '#F8FAFC' }}>{command}</span>
        </div>

        {/* Output lines */}
        <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {outputLines.map((line, idx) => {
            const lineSpring = spring({
              frame: Math.max(0, frame - delayFrames - 10 - idx * 5),
              fps,
              config: { damping: 14, stiffness: 95 },
            });

            return (
              <div key={idx} style={{ opacity: lineSpring, color: line.includes('✔') ? '#10B981' : line.includes('🚀') ? '#F59E0B' : '#94A3B8' }}>
                {line}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
