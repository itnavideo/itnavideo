import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface AdjustmentLayerProps {
  title?: string;
  contrast?: number;
  saturation?: number;
  brightness?: number;
  hueRotate?: number;
  showSplitPreview?: boolean;
  aspectRatio?: '16:9' | '9:16' | 'both';
}

export const AdjustmentLayer: React.FC<AdjustmentLayerProps> = ({
  title = 'Adjustment Layer (Master LUT)',
  contrast = 1.3,
  saturation = 1.4,
  brightness = 1.05,
  hueRotate = 15,
  showSplitPreview = true,
  aspectRatio = 'both',
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const isVertical = aspectRatio === '9:16' || height > width;

  const anim = spring({ frame, fps, config: { damping: 14, stiffness: 85 } });
  const splitX = interpolate(frame % 120, [0, 60, 120], [20, 80, 20]);

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
      {/* Header */}
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
            background: 'rgba(236, 72, 153, 0.12)',
            border: '1px solid rgba(236, 72, 153, 0.4)',
            color: '#ec4899',
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: 1.2,
            textTransform: 'uppercase',
            marginBottom: 8,
          }}
        >
          <span>✦ NON-DESTRUCTIVE FX</span>
          <span>•</span>
          <span>GLOBAL GRADE</span>
        </div>
        <h2 style={{ margin: 0, fontSize: isVertical ? 24 : 32, fontWeight: 800 }}>{title}</h2>
      </div>

      {/* Split Comparison Canvas */}
      <div
        style={{
          width: isVertical ? '95%' : '75%',
          height: isVertical ? 320 : 320,
          borderRadius: 18,
          border: '1px solid rgba(255, 255, 255, 0.15)',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)',
        }}
      >
        {/* Base Layer Footage Visual */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(45deg, #1e3a8a 0%, #4c1d95 50%, #831843 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: isVertical ? 40 : 54, fontWeight: 900, color: 'rgba(255,255,255,0.7)' }}>
              RAW FOOTAGE
            </div>
          </div>
        </div>

        {/* Adjustment Layer Applied (Filtered overlay via clip-path) */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(45deg, #1e3a8a 0%, #4c1d95 50%, #831843 100%)',
            filter: `contrast(${contrast}) saturate(${saturation}) brightness(${brightness}) hue-rotate(${hueRotate}deg)`,
            clipPath: showSplitPreview ? `inset(0 0 0 ${splitX}%)` : 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: isVertical ? 40 : 54, fontWeight: 900, color: '#ffffff' }}>
              GRADED MASTER
            </div>
          </div>
        </div>

        {/* Split Divider Line */}
        {showSplitPreview && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: `${splitX}%`,
              width: 3,
              background: '#ffffff',
              boxShadow: '0 0 10px rgba(255,255,255,0.8)',
              zIndex: 10,
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 28,
                height: 28,
                borderRadius: '50%',
                background: '#ffffff',
                color: '#09090b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 10,
                fontWeight: 900,
                boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
              }}
            >
              ⇄
            </div>
          </div>
        )}

        {/* Metadata HUD */}
        <div
          style={{
            position: 'absolute',
            bottom: 12,
            left: 14,
            zIndex: 15,
            background: 'rgba(0,0,0,0.7)',
            backdropFilter: 'blur(8px)',
            padding: '6px 12px',
            borderRadius: 8,
            fontSize: 11,
            fontFamily: 'monospace',
            color: '#f43f5e',
          }}
        >
          SAT: +{Math.round((saturation - 1) * 100)}% | CONTRAST: {contrast}x | HUE: +{hueRotate}°
        </div>
      </div>
    </div>
  );
};
