import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface DecisionNodeProps {
  condition?: string;
  yesLabel?: string;
  noLabel?: string;
  activePath?: 'yes' | 'no' | 'evaluating';
  accentColor?: string;
  delay?: number;
  width?: number | string;
  height?: number;
}

/**
 * DecisionNode — Flowchart rhombus/diamond decision gateway.
 * Evaluates binary or multi-branch logical conditions with branching Yes/No paths.
 */
export function DecisionNode({
  condition = 'Is User Authenticated?',
  yesLabel = 'Yes → Grant Access',
  noLabel = 'No → Redirect Login',
  activePath = 'yes',
  accentColor = '#f59e0b',
  delay = 0,
  width = 180,
  height = 180,
}: DecisionNodeProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = Math.max(0, frame - delay);

  const intro = spring({
    frame: t,
    fps,
    config: { damping: 14, stiffness: 85 },
  });

  return (
    <div
      style={{
        width,
        height,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: intro,
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      {/* 45-degree Rotated Rhombus Diamond Box */}
      <div
        style={{
          width: 120,
          height: 120,
          transform: 'rotate(45deg)',
          background: 'linear-gradient(135deg, rgba(24,24,27,0.95), rgba(9,9,11,0.95))',
          border: `2px solid ${accentColor}`,
          boxShadow: `0 8px 24px rgba(0,0,0,0.8), 0 0 16px ${accentColor}33`,
          borderRadius: 8,
          position: 'absolute',
        }}
      />

      {/* Un-rotated Center Content */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          textAlign: 'center',
          padding: '0 16px',
        }}
      >
        <div style={{ fontSize: 9, fontWeight: 800, color: accentColor, letterSpacing: '0.1em' }}>
          DECISION
        </div>
        <div style={{ fontSize: 11, fontWeight: 800, color: '#ffffff', marginTop: 3, lineHeight: 1.25 }}>
          {condition}
        </div>
      </div>

      {/* Branch Labeled Output Tags */}
      <div
        style={{
          position: 'absolute',
          right: -10,
          top: '50%',
          transform: 'translate(100%, -50%)',
          fontSize: 9,
          fontWeight: 700,
          color: '#22c55e',
          background: 'rgba(34, 197, 94, 0.1)',
          border: '1px solid rgba(34, 197, 94, 0.3)',
          padding: '2px 6px',
          borderRadius: 4,
          whiteSpace: 'nowrap',
        }}
      >
        {yesLabel}
      </div>

      <div
        style={{
          position: 'absolute',
          bottom: -10,
          left: '50%',
          transform: 'translate(-50%, 100%)',
          fontSize: 9,
          fontWeight: 700,
          color: '#ef4444',
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          padding: '2px 6px',
          borderRadius: 4,
          whiteSpace: 'nowrap',
        }}
      >
        {noLabel}
      </div>
    </div>
  );
}
