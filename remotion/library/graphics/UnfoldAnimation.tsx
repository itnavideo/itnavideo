import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface UnfoldAnimationProps {
  headline?: string;
  leftPanelText?: string;
  centerPanelText?: string;
  rightPanelText?: string;
  accentColor?: string;
  delay?: number;
  width?: number | string;
  height?: number;
}

/**
 * UnfoldAnimation — 3D tri-fold brochure/map unfolding visualizer.
 * Flaps unfold outward from center reveal revealing wide-format panoramic narrative cards.
 */
export function UnfoldAnimation({
  headline = 'UNFOLDING THE STRATEGIC BLUEPRINT',
  leftPanelText = 'Input: Raw Script',
  centerPanelText = 'Core: AI Direction & Engine',
  rightPanelText = 'Output: Studio Reel',
  accentColor = '#f59e0b',
  delay = 0,
  width = 500,
  height = 300,
}: UnfoldAnimationProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = Math.max(0, frame - delay);

  const intro = spring({
    frame: t,
    fps,
    config: { damping: 14, stiffness: 85 },
  });

  const unfoldSpr = spring({
    frame: Math.max(0, t - 10),
    fps,
    config: { damping: 14, stiffness: 70 },
  });

  const leftAngle = interpolate(unfoldSpr, [0, 1], [-90, 0]);
  const rightAngle = interpolate(unfoldSpr, [0, 1], [90, 0]);

  return (
    <div
      style={{
        width,
        height,
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '24px 20px',
        boxSizing: 'border-box',
        background: '#09090b',
        borderRadius: 24,
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 20px 40px rgba(0,0,0,0.8)',
        opacity: intro,
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      {/* Title */}
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 10, fontWeight: 800, color: accentColor, letterSpacing: '0.12em' }}>
          MULTI-PANE EXPANSION
        </div>
        <div style={{ fontSize: 18, fontWeight: 900, color: '#ffffff', marginTop: 2 }}>
          {headline}
        </div>
      </div>

      {/* Tri-Fold 3D Stage */}
      <div
        style={{
          display: 'flex',
          perspective: 800,
          height: 140,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Left Flap */}
        <div
          style={{
            width: 120,
            height: 130,
            borderRadius: '12px 0 0 12px',
            background: 'linear-gradient(135deg, #18181b, #27272a)',
            border: '1.5px solid rgba(255,255,255,0.15)',
            transformOrigin: 'right center',
            transform: `rotateY(${leftAngle}deg)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 10,
            textAlign: 'center',
            fontSize: 11,
            fontWeight: 700,
            color: '#e2e8f0',
            boxShadow: '0 8px 16px rgba(0,0,0,0.6)',
          }}
        >
          {leftPanelText}
        </div>

        {/* Center Panel */}
        <div
          style={{
            width: 140,
            height: 140,
            background: `linear-gradient(135deg, ${accentColor}33, #18181b)`,
            border: `2px solid ${accentColor}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 12,
            textAlign: 'center',
            fontSize: 12,
            fontWeight: 800,
            color: '#ffffff',
            boxShadow: `0 0 20px ${accentColor}44`,
            zIndex: 2,
          }}
        >
          {centerPanelText}
        </div>

        {/* Right Flap */}
        <div
          style={{
            width: 120,
            height: 130,
            borderRadius: '0 12px 12px 0',
            background: 'linear-gradient(135deg, #27272a, #18181b)',
            border: '1.5px solid rgba(255,255,255,0.15)',
            transformOrigin: 'left center',
            transform: `rotateY(${rightAngle}deg)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 10,
            textAlign: 'center',
            fontSize: 11,
            fontWeight: 700,
            color: '#e2e8f0',
            boxShadow: '0 8px 16px rgba(0,0,0,0.6)',
          }}
        >
          {rightPanelText}
        </div>
      </div>

      {/* Footer */}
      <div style={{ textAlign: 'center', fontSize: 10, color: '#64748b' }}>
        PANORAMIC HORIZONTAL SPREAD
      </div>
    </div>
  );
}
