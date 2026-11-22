import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface PreCompositionProps {
  title?: string;
  preCompName?: string;
  trackCount?: number;
  durationFrames?: number;
  primaryColor?: string;
  aspectRatio?: '16:9' | '9:16' | 'both';
}

export const PreComposition: React.FC<PreCompositionProps> = ({
  title = 'Pre-Composition Container',
  preCompName = 'PreComp_Scene01_VFX',
  trackCount = 3,
  durationFrames = 180,
  primaryColor = '#10B981',
  aspectRatio = 'both',
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const isVertical = aspectRatio === '9:16' || height > width;

  const anim = spring({ frame, fps, config: { damping: 14, stiffness: 85 } });
  const playhead = interpolate(frame % 90, [0, 90], [0, 100]);

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
            background: 'rgba(16, 185, 129, 0.12)',
            border: `1px solid ${primaryColor}40`,
            color: primaryColor,
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: 1.2,
            textTransform: 'uppercase',
            marginBottom: 8,
          }}
        >
          <span>▣ TIMELINE ENCAPSULATION</span>
          <span>•</span>
          <span>PRE-COMP</span>
        </div>
        <h2 style={{ margin: 0, fontSize: isVertical ? 24 : 32, fontWeight: 800 }}>{title}</h2>
      </div>

      {/* Container Box representing Encapsulated Comp */}
      <div
        style={{
          width: isVertical ? '95%' : '75%',
          borderRadius: 16,
          border: `1px solid ${primaryColor}60`,
          background: '#121217',
          padding: 20,
          boxShadow: `0 15px 35px -10px ${primaryColor}20`,
        }}
      >
        {/* Pre-comp Header Strip */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            paddingBottom: 12,
            marginBottom: 14,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 16 }}>🎞️</span>
            <span style={{ fontSize: 14, fontWeight: 700, color: '#f4f4f5' }}>{preCompName}</span>
          </div>
          <span
            style={{
              padding: '3px 8px',
              borderRadius: 6,
              background: 'rgba(16, 185, 129, 0.2)',
              color: primaryColor,
              fontSize: 11,
              fontFamily: 'monospace',
            }}
          >
            {durationFrames} FRAMES ({durationFrames / 30}s)
          </span>
        </div>

        {/* Multi-track timeline preview */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, position: 'relative' }}>
          {/* Playhead Scrubber */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: `${playhead}%`,
              width: 2,
              background: '#ef4444',
              zIndex: 10,
              boxShadow: '0 0 6px #ef4444',
            }}
          />

          {Array.from({ length: trackCount }).map((_, idx) => (
            <div
              key={idx}
              style={{
                height: 38,
                borderRadius: 8,
                background: '#1c1c24',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                alignItems: 'center',
                padding: '0 12px',
                justifyContent: 'space-between',
              }}
            >
              <span style={{ fontSize: 11, color: '#a1a1aa' }}>Track 0{idx + 1}</span>
              <div
                style={{
                  width: `${60 + idx * 15}%`,
                  height: 18,
                  borderRadius: 4,
                  background: idx === 0 ? primaryColor : idx === 1 ? '#6366f1' : '#f59e0b',
                  opacity: 0.8,
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
