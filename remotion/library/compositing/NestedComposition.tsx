import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface NestedCompositionProps {
  title?: string;
  hierarchyLevels?: string[];
  activeLevelIndex?: number;
  primaryColor?: string;
  aspectRatio?: '16:9' | '9:16' | 'both';
}

export const NestedComposition: React.FC<NestedCompositionProps> = ({
  title = 'Nested Composition Architecture',
  hierarchyLevels = ['Master Comp (4K)', 'Scene 03: Explainer', 'Sub-Comp: Vector Graphics', 'Asset: Character Rig'],
  activeLevelIndex = 1,
  primaryColor = '#6366F1',
  aspectRatio = 'both',
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const isVertical = aspectRatio === '9:16' || height > width;

  const anim = spring({ frame, fps, config: { damping: 14, stiffness: 85 } });

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
            background: 'rgba(99, 102, 241, 0.15)',
            border: `1px solid ${primaryColor}40`,
            color: primaryColor,
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: 1.2,
            textTransform: 'uppercase',
            marginBottom: 8,
          }}
        >
          <span>❖ RECURSIVE HIERARCHY</span>
          <span>•</span>
          <span>NESTED COMPS</span>
        </div>
        <h2 style={{ margin: 0, fontSize: isVertical ? 24 : 32, fontWeight: 800 }}>{title}</h2>
      </div>

      {/* Breadcrumb Hierarchy Tree */}
      <div
        style={{
          width: isVertical ? '95%' : '80%',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}
      >
        {hierarchyLevels.map((level, idx) => {
          const isActive = idx === activeLevelIndex;
          const indent = idx * (isVertical ? 16 : 28);
          const levelDelay = idx * 6;
          const levelAnim = spring({
            frame: frame - levelDelay,
            fps,
            config: { damping: 15, stiffness: 90 },
          });

          return (
            <div
              key={idx}
              style={{
                marginLeft: indent,
                padding: '12px 18px',
                borderRadius: 12,
                background: isActive ? 'rgba(99, 102, 241, 0.15)' : '#141418',
                border: isActive ? `1px solid ${primaryColor}` : '1px solid rgba(255, 255, 255, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                transform: `translateX(${interpolate(levelAnim, [0, 1], [-30, 0])}px)`,
                opacity: levelAnim,
                boxShadow: isActive ? `0 10px 25px -5px ${primaryColor}40` : 'none',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 16 }}>{idx === 0 ? '📁' : idx === 1 ? '🎬' : idx === 2 ? '🎨' : '⚙️'}</span>
                <span style={{ fontSize: 14, fontWeight: isActive ? 800 : 500, color: isActive ? '#ffffff' : '#a1a1aa' }}>
                  {level}
                </span>
              </div>
              <span
                style={{
                  fontSize: 11,
                  fontFamily: 'monospace',
                  color: isActive ? primaryColor : '#71717a',
                }}
              >
                LEVEL {idx}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
