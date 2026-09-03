import React from 'react';
import { interpolate, OffthreadVideo, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';

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
        borderRadius: '20px',
        overflow: 'hidden',
        border: '1px solid rgba(56, 189, 248, 0.35)',
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 30px rgba(56, 189, 248, 0.2)',
        backdropFilter: 'blur(16px)',
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        position: 'relative',
        ...style,
      }}
    >
      {/* ── macOS Style Browser Title Bar ── */}
      <div
        style={{
          height: '42px',
          backgroundColor: 'rgba(2, 6, 23, 0.9)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 16px',
          zIndex: 10,
        }}
      >
        {/* Window Control Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '11px', height: '11px', borderRadius: '50%', backgroundColor: '#EF4444' }} />
          <div style={{ width: '11px', height: '11px', borderRadius: '50%', backgroundColor: '#F59E0B' }} />
          <div style={{ width: '11px', height: '11px', borderRadius: '50%', backgroundColor: '#10B981' }} />
        </div>

        {/* Address Bar */}
        <div
          style={{
            flex: 1,
            maxWidth: '450px',
            margin: '0 16px',
            height: '24px',
            backgroundColor: 'rgba(30, 41, 59, 0.8)',
            borderRadius: '6px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0 12px',
          }}
        >
          <span style={{ fontSize: '10px', color: '#10B981', marginRight: '6px' }}>🔒</span>
          <span style={{ fontSize: '11px', fontFamily: 'monospace', color: '#94A3B8', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
            {urlAddress}
          </span>
        </div>

        {/* Title Tag */}
        <span style={{ fontSize: '10px', fontWeight: 800, letterSpacing: '0.1em', color: '#38BDF8', textTransform: 'uppercase' }}>
          {title}
        </span>
      </div>

      {/* ── Media Content Viewport with Ken Burns / Scroll Motion ── */}
      <div
        style={{
          flex: 1,
          overflow: 'hidden',
          position: 'relative',
          backgroundColor: '#020617',
        }}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            transform: `scale(${scale}) translateY(${translateY}px)`,
            transformOrigin: 'top center',
            transition: 'transform 0.1s ease-out',
          }}
        >
          {resolvedSrc ? (
            isVid ? (
              <OffthreadVideo
                src={resolvedSrc}
                volume={0}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <img
                src={resolvedSrc}
                alt={title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            )
          ) : (
            /* Fallback Graphic */
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
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>📊</div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: '#FFFFFF', marginBottom: '6px' }}>
                {title}
              </div>
              <div style={{ fontSize: '12px', color: '#94A3B8' }}>
                {urlAddress}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

