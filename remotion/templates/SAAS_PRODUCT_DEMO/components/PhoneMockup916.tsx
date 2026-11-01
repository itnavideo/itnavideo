import React from 'react';
import { interpolate, useCurrentFrame, OffthreadVideo, staticFile } from 'remotion';

export interface PhoneMockup916Props {
  width?: number;
  height?: number;
  scale?: number;
  activeStyleName?: string;
  videoSrc?: string;
  style?: React.CSSProperties;
}

const resolveAsset = (path: string) => {
  if (!path) return '';
  if (/^(https?:|data:|blob:)/i.test(path)) return path;
  try {
    return staticFile(path.replace(/^\/+/, ''));
  } catch {
    return path;
  }
};

export const PhoneMockup916: React.FC<PhoneMockup916Props> = ({
  width = 380,
  height = 760,
  scale = 1,
  activeStyleName = 'Hormozi Viral Pop',
  videoSrc = '/visuals/homepage/autocaption.mp4',
  style = {},
}) => {
  const frame = useCurrentFrame();
  const resolvedSrc = resolveAsset(videoSrc);

  return (
    <div
      style={{
        width,
        height,
        borderRadius: 44,
        border: '4px solid #27272A',
        backgroundColor: '#09090B',
        boxShadow: '0 30px 80px -15px rgba(0, 0, 0, 0.9), 0 0 50px -10px rgba(255, 87, 34, 0.25)',
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        transform: `scale(${scale})`,
        ...style,
      }}
    >
      {/* Top Dynamic Island Notch */}
      <div
        style={{
          position: 'absolute',
          top: 12,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 100,
          height: 22,
          backgroundColor: '#000000',
          borderRadius: 999,
          zIndex: 30,
        }}
      />

      {/* Real Video Background */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
        <OffthreadVideo
          src={resolvedSrc}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          startFrom={0}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.6) 80%, rgba(0,0,0,0.85) 100%)',
          }}
        />
      </div>

      {/* Kinetic Subtitles Overlay */}
      <div
        style={{
          position: 'absolute',
          bottom: 120,
          left: 20,
          right: 20,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          zIndex: 20,
        }}
      >
        <span
          style={{
            fontFamily: 'Montserrat, Impact, sans-serif',
            fontSize: 26,
            fontWeight: 900,
            color: '#FFFFFF',
            textTransform: 'uppercase',
            textShadow: '0 4px 14px rgba(0,0,0,0.9), 0 0 10px rgba(0,0,0,0.8)',
            letterSpacing: 1,
            lineHeight: 1.2,
          }}
        >
          Never risk capital on{' '}
          <span
            style={{
              backgroundColor: '#FACC15',
              color: '#000000',
              padding: '2px 8px',
              borderRadius: 6,
            }}
          >
            untested
          </span>{' '}
          assets.
        </span>

        {/* Active Style Badge Tag */}
        <div
          style={{
            marginTop: 18,
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            borderRadius: 999,
            padding: '4px 14px',
            fontSize: 11,
            fontWeight: 800,
            color: '#FFFFFF',
            backdropFilter: 'blur(10px)',
          }}
        >
          Style: {activeStyleName}
        </div>
      </div>
    </div>
  );
};
