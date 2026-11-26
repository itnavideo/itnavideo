import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface CodeEditorProps {
  fileName?: string;
  codeSnippet?: string[];
  language?: string;
  theme?: 'dark' | 'light';
  delayFrames?: number;
  width?: number | string;
  style?: React.CSSProperties;
}

const DEFAULT_CODE = [
  'import { RemotionCloud, GroqWhisper } from "@itnavideo/core";',
  '',
  'export const renderViralShort = async (voiceAudioUrl: string) => {',
  '  const { words } = await GroqWhisper.transcribe(voiceAudioUrl);',
  '  return await RemotionCloud.render({',
  '    composition: "AUTO_CAPTION_GENERATOR",',
  '    fps: 30,',
  '    durationInFrames: words.length * 8,',
  '    props: { words, style: "neon-glow" },',
  '  });',
  '};',
];

export const CodeEditor: React.FC<CodeEditorProps> = ({
  fileName = 'videoPipeline.ts',
  codeSnippet = DEFAULT_CODE,
  language = 'TypeScript',
  theme = 'dark',
  delayFrames = 5,
  width = '100%',
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const isDark = theme === 'dark';
  const bgColor = 'transparent';
  const headerBg = isDark ? '#161B22' : '#F6F8FA';
  const textColor = isDark ? '#E6EDF3' : '#1F2328';
  const textMuted = isDark ? '#7D8590' : '#656D76';
  const borderColor = isDark ? '#30363D' : '#D0D7DE';

  const editorSpring = spring({
    frame: Math.max(0, frame - delayFrames),
    fps,
    config: { damping: 14, stiffness: 90 },
  });

  return (
    <div
      style={{
        width,
        backgroundColor: 'transparent',
        border: 'none',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: 'none',
        boxSizing: 'border-box',
        fontFamily: 'JetBrains Mono, Menlo, Consolas, monospace',
        transform: `scale(${editorSpring})`,
        opacity: editorSpring,
        ...style,
      }}
    >
      {/* Tab Header */}
      <div
        style={{
          height: '38px',
          backgroundColor: headerBg,
          borderBottom: `1px solid ${borderColor}`,
          display: 'flex',
          alignItems: 'center',
          padding: '0 14px',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', gap: '6px' }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#EF4444' }} />
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#F59E0B' }} />
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#10B981' }} />
        </div>
        <div style={{ fontSize: '12px', fontWeight: 600, color: textColor, padding: '4px 10px', backgroundColor: 'transparent', borderRadius: '6px 6px 0 0' }}>
          {fileName}
        </div>
      </div>

      {/* Code Lines */}
      <div style={{ padding: '16px 20px', fontSize: '13px', lineHeight: 1.6, overflowX: 'auto' }}>
        {codeSnippet.map((line, idx) => {
          const lineSpring = spring({
            frame: Math.max(0, frame - delayFrames - idx * 2),
            fps,
            config: { damping: 14, stiffness: 100 },
          });

          return (
            <div key={idx} style={{ display: 'flex', gap: '16px', opacity: lineSpring }}>
              <span style={{ color: textMuted, width: '24px', textAlign: 'right', userSelect: 'none', flexShrink: 0 }}>
                {idx + 1}
              </span>
              <span style={{ color: line.includes('import') ? '#F43F5E' : line.includes('const') ? '#3B82F6' : textColor }}>
                {line}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
