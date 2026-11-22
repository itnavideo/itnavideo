import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface TooltipProps {
  text?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  theme?: 'dark' | 'light';
  delayFrames?: number;
  style?: React.CSSProperties;
}

export const Tooltip: React.FC<TooltipProps> = ({
  text = 'High-Retention Visual Cut (3s Interval)',
  position = 'top',
  theme = 'dark',
  delayFrames = 5,
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const isDark = theme === 'dark';
  const bgColor = isDark ? '#0F172A' : '#FFFFFF';
  const textColor = isDark ? '#F8FAFC' : '#0F172A';
  const borderColor = isDark ? '#334155' : '#E2E8F0';

  const tipSpring = spring({
    frame: Math.max(0, frame - delayFrames),
    fps,
    config: { damping: 14, stiffness: 100 },
  });

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '8px 14px',
        backgroundColor: bgColor,
        border: `1px solid ${borderColor}`,
        borderRadius: '10px',
        boxShadow: isDark ? '0 8px 24px rgba(0,0,0,0.5)' : '0 4px 16px rgba(0,0,0,0.1)',
        fontSize: '12px',
        fontWeight: 700,
        color: textColor,
        whiteSpace: 'nowrap',
        fontFamily: 'Inter, system-ui, sans-serif',
        transform: `scale(${tipSpring})`,
        opacity: tipSpring,
        ...style,
      }}
    >
      {text}
    </div>
  );
};
