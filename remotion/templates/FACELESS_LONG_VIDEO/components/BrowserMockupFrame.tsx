import React from 'react';
import { Loop, interpolate, OffthreadVideo, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';

export interface BrowserMockupFrameProps {
  src: string;
  type?: 'image' | 'screenshot' | 'video';
  urlAddress?: string;
  title?: string;
  zoomEffect?: 'ken-burns' | 'pan-down' | 'browser-scroll' | 'static';
  style?: React.CSSProperties;
}

const resolveMediaSrc = (src?: string) => {
  if (!src) return '';
  return /^(https?:|data:|blob:)/i.test(src) ? src : staticFile(src.replace(/^\/+/, ''));
};

const isVideo = (src?: string) => {
  if (!src) return false;
  return /\.(mp4|webm|mov|m4v)(\?.*)?$/i.test(src) || src.includes('video');
};

export function BrowserMockupFrame({
  src,
  type = 'screenshot',
  urlAddress = 'https://www.itnavideo.com/dashboard',
  title = 'ANALYTICS & VISUAL BREAKDOWN',
  zoomEffect = 'browser-scroll',
  style,
}: BrowserMockupFrameProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const resolvedSrc = resolveMediaSrc(src);
  const isVid = type === 'video' || isVideo(src);

  // Smooth Vox/Johnny Harris style Pan & Scan / Ken Burns calculation
  const scale = zoomEffect === 'ken-burns'
    ? interpolate(frame, [0, 150], [1.0, 1.12], { extrapolateRight: 'clamp' })
    : interpolate(frame, [0, 150], [1.0, 1.05], { extrapolateRight: 'clamp' });

  const translateY = zoomEffect === 'browser-scroll' || zoomEffect === 'pan-down'
    ? interpolate(frame, [0, 150], [0, -60], { extrapolateRight: 'clamp' })
    : 0;

  return (
    <div
      style={{
        borderRadius: '24px',
        overflow: 'hidden',
        border: '1px solid rgba(255, 255, 255, 0.14)',
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        boxShadow: '0 25px 60px -12px rgba(0, 0, 0, 0.85), 0 0 35px rgba(56, 189, 248, 0.12)',
        backdropFilter: 'blur(20px)',
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        position: 'relative',
        ...style,
      }}
    >
      {/* ── Clean Cinematic Media Viewport with Ken Burns / Motion ── */}
      <div
        style={{
          width: '100%',
          height: '100%',
          overflow: 'hidden',
          position: 'relative',
          backgroundColor: '#020617',
          borderRadius: '24px',
        }}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            transform: `scale(${scale}) translateY(${translateY}px)`,
            transformOrigin: 'center center',
            transition: 'transform 0.1s ease-out',
          }}
        >
          {resolvedSrc ? (
            isVid ? (
              <Loop durationInFrames={120}>
                <OffthreadVideo
                  src={resolvedSrc}
                  volume={0}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </Loop>
            ) : (
              <img
                src={resolvedSrc}
                alt={title || 'Visual Card'}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            )
          ) : (
            /* Clean Minimalist Fallback Graphic */
            <div
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #0F172A 0%, #1E1B4B 100%)',
                color: '#38BDF8',
                padding: '32px',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '40px', marginBottom: '14px' }}>📊</div>
              {title && (
                <div style={{ fontSize: '20px', fontWeight: 800, color: '#FFFFFF' }}>
                  {title}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

