import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface VirtualCameraProps {
  title?: string;
  focalLength?: number;
  aperture?: string;
  iso?: number;
  shutterSpeed?: string;
  primaryColor?: string;
  aspectRatio?: '16:9' | '9:16' | 'both';
}

export const VirtualCamera: React.FC<VirtualCameraProps> = ({
  title = 'Virtual Cinema Camera',
  focalLength = 35,
  aperture = 'f/1.8',
  iso = 800,
  shutterSpeed = '1/50',
  primaryColor = '#10B981',
  aspectRatio = 'both',
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const isVertical = aspectRatio === '9:16' || height > width;

  const anim = spring({ frame, fps, config: { damping: 14, stiffness: 85 } });
  const timecodeSec = Math.floor(frame / fps);
  const timecodeFrames = frame % fps;
  const tcStr = `00:01:${timecodeSec.toString().padStart(2, '0')}:${timecodeFrames.toString().padStart(2, '0')}`;

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#050508',
        color: '#ffffff',
        fontFamily: 'Inter, system-ui, sans-serif',
        padding: isVertical ? '28px 16px' : '36px 32px',
        boxSizing: 'border-box',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Title */}
      <div
        style={{
          textAlign: 'center',
          marginBottom: isVertical ? 16 : 22,
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
            background: 'rgba(16, 185, 129, 0.15)',
            border: `1px solid ${primaryColor}40`,
            color: primaryColor,
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: 1.2,
            textTransform: 'uppercase',
            marginBottom: 6,
          }}
        >
          <span>◉ ARRI SENSOR VIEWPORT</span>
          <span>•</span>
          <span>{focalLength}MM CINEMA PRIME</span>
        </div>
        <h2 style={{ margin: 0, fontSize: isVertical ? 24 : 32, fontWeight: 800 }}>{title}</h2>
      </div>

      {/* Camera Viewfinder OSD Frame */}
      <div
        style={{
          width: isVertical ? '92%' : '75%',
          height: isVertical ? 360 : 340,
          borderRadius: 20,
          border: '1px solid rgba(255, 255, 255, 0.2)',
          background: '#090a0f',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.85)',
        }}
      >
        {/* Background Scene Simulator */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(ellipse at 50% 50%, #1e1b4b 0%, #09090b 80%)',
          }}
        />

        {/* Rule of Thirds Grid Lines */}
        <div
          style={{
            position: 'absolute',
            inset: '10%',
            border: '1px dashed rgba(255, 255, 255, 0.15)',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gridTemplateRows: '1fr 1fr 1fr',
            pointerEvents: 'none',
          }}
        >
          <div style={{ borderRight: '1px dashed rgba(255,255,255,0.1)', borderBottom: '1px dashed rgba(255,255,255,0.1)' }} />
          <div style={{ borderRight: '1px dashed rgba(255,255,255,0.1)', borderBottom: '1px dashed rgba(255,255,255,0.1)' }} />
          <div style={{ borderBottom: '1px dashed rgba(255,255,255,0.1)' }} />
          <div style={{ borderRight: '1px dashed rgba(255,255,255,0.1)', borderBottom: '1px dashed rgba(255,255,255,0.1)' }} />
          <div style={{ borderRight: '1px dashed rgba(255,255,255,0.1)', borderBottom: '1px dashed rgba(255,255,255,0.1)' }} />
          <div style={{ borderBottom: '1px dashed rgba(255,255,255,0.1)' }} />
        </div>

        {/* Center Crosshair Reticle */}
        <div
          style={{
            position: 'absolute',
            width: 32,
            height: 32,
            border: '1px solid rgba(255, 255, 255, 0.5)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div style={{ width: 8, height: 1, background: primaryColor }} />
          <div style={{ width: 1, height: 8, background: primaryColor, position: 'absolute' }} />
        </div>

        {/* OSD Top Bar (REC, Timecode, Battery) */}
        <div
          style={{
            position: 'absolute',
            top: 14,
            left: 18,
            right: 18,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontFamily: 'monospace',
            fontSize: 12,
            color: '#e4e4e7',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: '#ef4444',
                boxShadow: frame % 30 < 15 ? '0 0 8px #ef4444' : 'none',
              }}
            />
            <span style={{ fontWeight: 800, color: '#ef4444' }}>REC</span>
            <span>RAW 4K</span>
          </div>
          <div style={{ color: primaryColor, fontWeight: 700 }}>TC: {tcStr}</div>
          <div>BAT: 94%</div>
        </div>

        {/* OSD Bottom Bar (Shutter, Aperture, ISO, WB) */}
        <div
          style={{
            position: 'absolute',
            bottom: 14,
            left: 18,
            right: 18,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontFamily: 'monospace',
            fontSize: 12,
            color: '#a1a1aa',
          }}
        >
          <span>LENS: {focalLength}mm</span>
          <span style={{ color: '#ffffff', fontWeight: 700 }}>IRIS: {aperture}</span>
          <span>SHT: {shutterSpeed}</span>
          <span style={{ color: '#f59e0b' }}>ISO: {iso}</span>
          <span>5600K</span>
        </div>
      </div>
    </div>
  );
};
