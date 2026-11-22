import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface ForegroundExtractionProps {
  title?: string;
  segmentationMethod?: 'ai-neural' | 'chroma' | 'depth-matte';
  scanLineProgress?: number;
  primaryColor?: string;
  aspectRatio?: '16:9' | '9:16' | 'both';
}

export const ForegroundExtraction: React.FC<ForegroundExtractionProps> = ({
  title = 'Foreground Subject Extraction',
  segmentationMethod = 'ai-neural',
  scanLineProgress,
  primaryColor = '#8B5CF6',
  aspectRatio = 'both',
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const isVertical = aspectRatio === '9:16' || height > width;

  const anim = spring({ frame, fps, config: { damping: 14, stiffness: 85 } });
  const scanY = interpolate(frame % 80, [0, 80], [0, 100]);

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#09090b',
        color: '#ffffff',
        fontFamily: 'Inter, system-ui, sans-serif',
        padding: isVertical ? '32px 20px' : '40px 48px',
        boxSizing: 'border-box',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Title */}
      <div
        style={{
          textAlign: 'center',
          marginBottom: isVertical ? 20 : 28,
          opacity: anim,
          transform: `translateY(${interpolate(anim, [0, 1], [-15, 0])}px)`,
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '4px 14px',
            borderRadius: 9999,
            background: 'rgba(139, 92, 246, 0.15)',
            border: `1px solid ${primaryColor}40`,
            color: '#a78bfa',
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: 1.2,
            textTransform: 'uppercase',
            marginBottom: 8,
          }}
        >
          <span>☵ AI ROTOSCOPING</span>
          <span>•</span>
          <span>NEURAL SEGMENTATION</span>
        </div>
        <h2 style={{ margin: 0, fontSize: isVertical ? 24 : 32, fontWeight: 800 }}>{title}</h2>
      </div>

      {/* Roto Scanner Viewport */}
      <div
        style={{
          width: isVertical ? '90%' : '65%',
          height: isVertical ? 320 : 320,
          borderRadius: 20,
          border: '1px solid rgba(255, 255, 255, 0.15)',
          background: '#0a0a0d',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Checkerboard Pattern representing Transparent Alpha Cutout */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `
              linear-gradient(45deg, #18181b 25%, transparent 25%),
              linear-gradient(-45deg, #18181b 25%, transparent 25%),
              linear-gradient(45deg, transparent 75%, #18181b 75%),
              linear-gradient(-45deg, transparent 75%, #18181b 75%)
            `,
            backgroundSize: '20px 20px',
            backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
            opacity: 0.35,
          }}
        />

        {/* Extracted Subject Vector Contour */}
        <svg
          viewBox="0 0 240 300"
          style={{
            width: isVertical ? 200 : 220,
            height: isVertical ? 250 : 280,
            zIndex: 5,
          }}
        >
          {/* Glowing Contour Stroke */}
          <path
            d="M 60,300 C 60,220 70,180 90,160 C 80,140 80,100 120,60 C 160,100 160,140 150,160 C 170,180 180,220 180,300 Z"
            fill="rgba(139, 92, 246, 0.25)"
            stroke={primaryColor}
            strokeWidth="3"
            strokeDasharray="6 4"
          />
        </svg>

        {/* Laser Scanning Line */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: `${scanY}%`,
            height: 2,
            background: primaryColor,
            boxShadow: `0 0 12px ${primaryColor}`,
            zIndex: 10,
          }}
        />

        {/* HUD Info */}
        <div
          style={{
            position: 'absolute',
            top: 12,
            right: 14,
            zIndex: 15,
            background: 'rgba(0,0,0,0.7)',
            padding: '4px 10px',
            borderRadius: 6,
            fontSize: 11,
            fontFamily: 'monospace',
            color: '#c4b5fd',
          }}
        >
          CONFIDENCE: 99.4% | MASK: 0-255
        </div>
      </div>
    </div>
  );
};
