import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { DynamicLibraryHost } from './DynamicLibraryHost';
import { REMOTION_COMPONENT_REGISTRY } from '../library/registry';

export interface LibraryComponentExplorerProps {
  componentId?: string;
  paletteTheme?: 'dark' | 'light';
  scale?: number;
  cinematic?: boolean;
}

export const LibraryComponentExplorer: React.FC<LibraryComponentExplorerProps> = ({
  componentId = 'barchart-classic',
  paletteTheme = 'light',
  scale = 1.0,
  cinematic = false,
}) => {
  const frame = useCurrentFrame();
  const isDark = paletteTheme === 'dark';

  const meta = REMOTION_COMPONENT_REGISTRY.find(
    (c) => c.id.toLowerCase() === componentId.toLowerCase() || c.name.toLowerCase() === componentId.toLowerCase()
  ) || REMOTION_COMPONENT_REGISTRY[0];

  const effectiveId = meta?.id || componentId;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: isDark ? '#090D16' : '#FFFFFF',
        color: isDark ? '#FFFFFF' : '#0F172A',
        fontFamily: 'system-ui, sans-serif',
        overflow: 'hidden',
      }}
    >
      {/* Subtle Studio Radial Background Glow */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: isDark
            ? 'radial-gradient(circle at 50% 50%, rgba(234, 88, 12, 0.08) 0%, rgba(9, 13, 22, 1) 75%)'
            : '#FFFFFF',
          pointerEvents: 'none',
        }}
      />

      {/* Top Header Bar: Component Metadata */}
      <div
        style={{
          position: 'absolute',
          top: 36,
          left: 48,
          right: 48,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          zIndex: 50,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div
            style={{
              padding: '6px 14px',
              borderRadius: 8,
              backgroundColor: '#EA580C',
              color: '#FFFFFF',
              fontSize: 13,
              fontWeight: 900,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
            }}
          >
            {meta?.category || 'COMPONENT'}
          </div>
          <div>
            <h2
              style={{
                margin: 0,
                fontSize: 22,
                fontWeight: 800,
                color: isDark ? '#FFFFFF' : '#0F172A',
                letterSpacing: '-0.02em',
              }}
            >
              {meta?.name || effectiveId}
            </h2>
            <p
              style={{
                margin: '2px 0 0 0',
                fontSize: 13,
                color: isDark ? '#94A3B8' : '#64748B',
                maxWidth: 720,
              }}
            >
              {meta?.description || 'Broadcast-grade Remotion motion graphics component'}
            </p>
          </div>
        </div>

        {/* Component ID Badge */}
        <div
          style={{
            padding: '6px 16px',
            borderRadius: 9999,
            backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)',
            border: isDark ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid rgba(0, 0, 0, 0.1)',
            fontSize: 13,
            fontFamily: 'monospace',
            color: '#EA580C',
            fontWeight: 700,
          }}
        >
          id: &quot;{effectiveId}&quot;
        </div>
      </div>

      {/* Center Stage: The Live Component */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10,
        }}
      >
        <DynamicLibraryHost
          componentId={effectiveId}
          sceneFrame={frame}
          sceneDurationFrames={180}
          scale={scale}
          cinematic={cinematic}
          fullScreen={true}
          palette={{ isDark }}
        />
      </div>

      {/* Bottom Footer Info */}
      <div
        style={{
          position: 'absolute',
          bottom: 28,
          left: 48,
          right: 48,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          zIndex: 50,
          fontSize: 12,
          color: isDark ? '#64748B' : '#94A3B8',
        }}
      >
        <div>
          Tags:{' '}
          <span style={{ color: isDark ? '#CBD5E1' : '#475569' }}>
            {meta?.tags ? meta.tags.slice(0, 6).join(' • ') : 'motion graphics, remotion'}
          </span>
        </div>
        <div>Total Library Assets: 1,292 Components</div>
      </div>
    </AbsoluteFill>
  );
};

export default LibraryComponentExplorer;

