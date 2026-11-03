import React from 'react';
import { Img, staticFile, useCurrentFrame } from 'remotion';

export interface WhiteboardHandProps {
  /** Target X coordinate on the 1080x1920 canvas for the marker pen tip */
  targetX?: number;
  /** Target Y coordinate on the 1080x1920 canvas for the marker pen tip */
  targetY?: number;
  /** Whether the hand is currently actively drawing */
  isDrawing?: boolean;
  /** Scale factor for the hand (default: 1.25 for standard vertical shorts) */
  scale?: number;
  /** Opacity */
  opacity?: number;
  /** Optional custom styling */
  style?: React.CSSProperties;
}

/**
 * WhiteboardHand — Real Photorealistic Human Hand Holding Marker Pen.
 * 
 * Sourced directly from production AWS S3 media asset:
 * https://itnavideo-media-assets.s3.ap-south-1.amazonaws.com/assets/real-hand-marker.png
 * 
 * Exact marker tip coordinates: x = 290, y = 149 (28.32% from left, 9.70% from top).
 * Strictly a REAL HAND PNG — NEVER an SVG hand.
 */
const AWS_REAL_HAND_PNG = 'https://itnavideo-media-assets.s3.ap-south-1.amazonaws.com/assets/real-hand-marker.png';

export const WhiteboardHand: React.FC<WhiteboardHandProps> = ({
  targetX = 540,
  targetY = 960,
  isDrawing = true,
  scale = 1.25,
  opacity = 1.0,
  style = {},
}) => {
  const frame = useCurrentFrame();

  // Base rendered dimensions for natural hand size on 1080x1920 canvas
  const handWidth = 560 * scale;
  const handHeight = 840 * scale; // 1:1.5 aspect ratio matching 1024x1536

  // Exact tip offsets so pen nib touches (targetX, targetY) with zero shivering
  const tipOffsetX = handWidth * 0.2832;
  const tipOffsetY = handHeight * 0.0970;

  const posX = targetX - tipOffsetX;
  const posY = targetY - tipOffsetY;
  const tiltDeg = -2; // Steady, natural fixed writing angle (no shivering)

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: handWidth,
        height: handHeight,
        transform: `translate(${posX}px, ${posY}px) rotate(${tiltDeg}deg)`,
        transformOrigin: `${tipOffsetX}px ${tipOffsetY}px`,
        pointerEvents: 'none',
        zIndex: 999,
        opacity,
        filter: 'drop-shadow(14px 22px 24px rgba(15, 23, 42, 0.24))',
        ...style,
      }}
    >
      <Img
        src={AWS_REAL_HAND_PNG}
        onError={(e) => {
          // Safe fallback to local staticFile if offline
          try {
            (e.currentTarget as any).src = staticFile('assets/real-hand-marker.png');
          } catch {}
        }}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          display: 'block',
        }}
      />
    </div>
  );
};
