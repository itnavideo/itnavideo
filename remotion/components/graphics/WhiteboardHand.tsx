import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface WhiteboardHandProps {
  /** Target X coordinate on the canvas for the marker pen tip */
  targetX?: number;
  /** Target Y coordinate on the canvas for the marker pen tip */
  targetY?: number;
  /** Whether the hand is currently in active drawing / writing motion */
  isDrawing?: boolean;
  /** Hand scale factor (default 1.0 for standard 1080x1920 portrait canvas) */
  scale?: number;
  /** Opacity override */
  opacity?: number;
  /** Custom style overrides */
  style?: React.CSSProperties;
}

/**
 * WhiteboardHand — Photorealistic / Authentic Hand holding a Marker Pen.
 * 
 * The marker tip is calibrated exactly at (0, 0) relative to its local coordinates,
 * so whenever you place the hand at (targetX, targetY), the pen nib touches the exact
 * pixel being drawn or written.
 */
export const WhiteboardHand: React.FC<WhiteboardHandProps> = ({
  targetX = 920,
  targetY = 1750,
  isDrawing = false,
  scale = 1.0,
  opacity = 1.0,
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Subtle natural drawing vibration / stroke oscillation when actively writing
  const vibrationX = isDrawing ? Math.sin(frame * 1.8) * 4.5 + Math.cos(frame * 3.1) * 2 : 0;
  const vibrationY = isDrawing ? Math.cos(frame * 1.9) * 3.5 + Math.sin(frame * 2.7) * 1.8 : 0;

  // Gentle hand angle tilt when writing vs resting
  const tiltDeg = isDrawing ? -6 + Math.sin(frame * 1.5) * 2 : -2;

  const currentX = targetX + vibrationX;
  const currentY = targetY + vibrationY;

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        pointerEvents: 'none',
        zIndex: 900,
        opacity,
        transform: `translate(${currentX}px, ${currentY}px) scale(${scale})`,
        transition: 'transform 0.12s cubic-bezier(0.2, 0.8, 0.4, 1)',
        willChange: 'transform',
        ...style,
      }}
    >
      {/* 
        Hand illustration with marker pen.
        The marker nib (contact point with whiteboard) is at (0, 0).
        The rest of the pen and hand extends down and to the right (+X, +Y).
      */}
      <svg
        width="480"
        height="560"
        viewBox="0 0 320 380"
        style={{
          overflow: 'visible',
          transform: `rotate(${tiltDeg}deg)`,
          transformOrigin: '0px 0px',
          filter: 'drop-shadow(12px 18px 18px rgba(15, 23, 42, 0.22))',
        }}
      >
        <defs>
          {/* Skin Gradient for Realistic Hand */}
          <linearGradient id="wbSkinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F9C5A8" />
            <stop offset="45%" stopColor="#EAA888" />
            <stop offset="85%" stopColor="#D98A68" />
            <stop offset="100%" stopColor="#BF7352" />
          </linearGradient>

          {/* Marker Barrel Gradient */}
          <linearGradient id="wbMarkerGrad" x1="0%" y1="0%" x2="100%" y2="80%">
            <stop offset="0%" stopColor="#1E293B" />
            <stop offset="35%" stopColor="#334155" />
            <stop offset="70%" stopColor="#0F172A" />
            <stop offset="100%" stopColor="#020617" />
          </linearGradient>

          {/* Marker Tip Highlight */}
          <linearGradient id="wbTipGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0F172A" />
            <stop offset="100%" stopColor="#000000" />
          </linearGradient>
        </defs>

        {/* 1. Marker Pen Tip (Nib touching at 0, 0) */}
        <path
          d="M 0 0 L 10 16 L 2 20 Z"
          fill="url(#wbTipGrad)"
          stroke="#000000"
          strokeWidth="1"
        />

        {/* 2. Marker Chisel / Cone Collar */}
        <polygon
          points="2,20 10,16 26,42 16,48"
          fill="#475569"
          stroke="#1E293B"
          strokeWidth="1.5"
        />

        {/* 3. Marker Cylindrical Body extending into the hand grip */}
        <polygon
          points="16,48 26,42 78,124 64,134"
          fill="url(#wbMarkerGrad)"
          stroke="#0F172A"
          strokeWidth="1.8"
        />

        {/* 4. Forefinger / Index Finger wrapping the pen collar */}
        <path
          d="M 22 45 C 28 36 44 42 48 54 C 54 68 52 82 46 94 C 40 106 32 110 24 100 C 18 90 18 78 20 62 Z"
          fill="url(#wbSkinGrad)"
          stroke="#8A4A30"
          strokeWidth="2.5"
        />

        {/* Index Finger Crease lines & Nail */}
        <path d="M 26 50 Q 32 54 36 52" stroke="#B86548" strokeWidth="1.8" fill="none" />
        <path d="M 28 66 Q 36 70 40 68" stroke="#B86548" strokeWidth="1.8" fill="none" />
        <ellipse cx="26" cy="46" rx="4" ry="5" fill="#FFE5D8" opacity="0.65" />

        {/* 5. Thumb securely pressing the marker against the index finger */}
        <path
          d="M 44 80 C 48 70 65 72 72 85 C 80 100 82 120 74 135 C 66 148 52 146 44 132 C 38 120 38 98 44 80 Z"
          fill="url(#wbSkinGrad)"
          stroke="#8A4A30"
          strokeWidth="2.5"
        />
        {/* Thumb Nail & Crease */}
        <ellipse cx="50" cy="85" rx="5" ry="6" fill="#FFE5D8" opacity="0.6" />
        <path d="M 52 105 Q 64 110 68 106" stroke="#B86548" strokeWidth="1.8" fill="none" />

        {/* 6. Middle, Ring, and Little Fingers curled underneath */}
        <path
          d="M 50 94 C 62 90 74 96 82 108 C 88 120 86 134 78 144 C 70 154 58 152 52 142 Z"
          fill="url(#wbSkinGrad)"
          stroke="#8A4A30"
          strokeWidth="2.5"
        />
        <path
          d="M 64 122 C 76 120 88 128 94 140 C 98 152 94 164 86 172 C 78 180 66 178 60 166 Z"
          fill="url(#wbSkinGrad)"
          stroke="#8A4A30"
          strokeWidth="2.5"
        />

        {/* 7. Main Palm & Wrist Mass extending toward the bottom-right corner */}
        <path
          d="M 54 138 C 70 152 92 158 114 168 C 146 182 186 206 218 240 C 248 274 274 316 298 360 L 220 380 C 190 320 160 270 120 220 C 85 180 60 160 48 145 Z"
          fill="url(#wbSkinGrad)"
          stroke="#8A4A30"
          strokeWidth="2.5"
        />

        {/* Wrist Fold / Natural Shading */}
        <path d="M 120 200 Q 145 220 160 215" stroke="#B86548" strokeWidth="2.2" fill="none" opacity="0.8" />
        <path d="M 150 235 Q 180 260 200 250" stroke="#B86548" strokeWidth="2.2" fill="none" opacity="0.8" />
      </svg>
    </div>
  );
};
