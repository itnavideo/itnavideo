import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface SearchBarProps {
  placeholder?: string;
  queryText?: string;
  theme?: 'dark' | 'light';
  delayFrames?: number;
  width?: number | string;
  style?: React.CSSProperties;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = 'Search video templates, styles, or prompts...',
  queryText = 'AI Faceless Video Generator 16:9',
  theme = 'dark',
  delayFrames = 5,
  width = '100%',
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const isDark = theme === 'dark';
  const bgColor = 'transparent';
  const textColor = isDark ? '#F8FAFC' : '#0F172A';
  const textMuted = isDark ? '#94A3B8' : '#64748B';
  const borderColor = isDark ? '#334155' : '#E2E8F0';

  const barSpring = spring({
    frame: Math.max(0, frame - delayFrames),
    fps,
    config: { damping: 14, stiffness: 95 },
  });

  // Typewriter text animation
  const typeProgress = interpolate(frame - delayFrames - 8, [0, fps * 1.5], [0, queryText.length], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const currentChars = queryText.slice(0, Math.floor(typeProgress));

  return (
    <div
      style={{
        width,
        backgroundColor: 'transparent',
        border: 'none',
        borderRadius: '9999px',
        padding: '14px 24px',
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
        boxShadow: 'none',
        boxSizing: 'border-box',
        fontFamily: 'Inter, system-ui, sans-serif',
        transform: `scale(${barSpring}) translateY(${(1 - barSpring) * 15}px)`,
        opacity: barSpring,
        ...style,
      }}
    >
      <span style={{ fontSize: '18px', color: '#0066FF' }}>🔍</span>
      <div style={{ flex: 1, fontSize: '15px', color: currentChars ? textColor : textMuted, fontWeight: 500 }}>
        {currentChars || placeholder}
        <span style={{ color: '#0066FF', fontWeight: 900, animation: 'pulse 1s infinite' }}>|</span>
      </div>
      <span style={{ fontSize: '12px', fontWeight: 700, color: textMuted, padding: '2px 8px', backgroundColor: isDark ? '#0F172A' : '#F1F5F9', borderRadius: '6px' }}>
        ⌘K
      </span>
    </div>
  );
};
