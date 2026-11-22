import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface MagnifyingGlassProps {
  headline?: string;
  inspectionClue?: string;
  revealedDetail?: string;
  accentColor?: string;
  delay?: number;
  width?: number | string;
  height?: number;
}

/**
 * MagnifyingGlass — Forensic inspection & scrutiny storytelling graphic.
 * Glides an optical lens with crosshairs over fine print to uncover the critical detail.
 */
export function MagnifyingGlass({
  headline = 'INSPECTING THE HIDDEN DETAIL',
  inspectionClue = 'Standard Editing Contract Fine Print',
  revealedDetail = '★ 95% of creator time wasted on subtitle keyframes',
  accentColor = '#f59e0b',
  delay = 0,
  width = 460,
  height = 340,
}: MagnifyingGlassProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = Math.max(0, frame - delay);

  const intro = spring({
    frame: t,
    fps,
    config: { damping: 14, stiffness: 85 },
  });

  const loupeMoveX = Math.sin(t * 0.05) * 35;

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
          DEEP FORENSIC SCRUTINY
        </div>
        <div style={{ fontSize: 18, fontWeight: 900, color: '#ffffff', marginTop: 2 }}>
          {headline}
        </div>
      </div>

      {/* Main Inspection Stage */}
      <div
        style={{
          position: 'relative',
          width: '90%',
          height: 150,
          borderRadius: 14,
          background: '#18181b',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 16,
          boxSizing: 'border-box',
          overflow: 'hidden',
        }}
      >
        <div style={{ fontSize: 11, color: '#64748b' }}>
          {inspectionClue}
        </div>

        {/* Revealed Forensic Truth */}
        <div
          style={{
            marginTop: 12,
            padding: '8px 16px',
            borderRadius: 8,
            background: `${accentColor}18`,
            border: `1.5px solid ${accentColor}`,
            fontSize: 12,
            fontWeight: 800,
            color: '#ffffff',
            boxShadow: `0 0 16px ${accentColor}33`,
            zIndex: 2,
          }}
        >
          {revealedDetail}
        </div>

        {/* Moving Magnifying Glass Loupe Ring */}
        <div
          style={{
            position: 'absolute',
            width: 70,
            height: 70,
            borderRadius: '50%',
            border: `3px solid ${accentColor}`,
            boxShadow: `0 0 20px ${accentColor}66, inset 0 0 15px rgba(255,255,255,0.2)`,
            transform: `translateX(${loupeMoveX}px)`,
            pointerEvents: 'none',
            zIndex: 3,
          }}
        />
      </div>

      {/* Footer */}
      <div style={{ textAlign: 'center', fontSize: 10, color: '#64748b' }}>
        THE TRUTH BECOMES OBVIOUS UNDER SCRUTINY
      </div>
    </div>
  );
}
