import React from 'react';
import { OffthreadVideo, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface VideoPlayerProps {
  src?: string;
  poster?: string;
  title?: string;
  durationText?: string;
  showControls?: boolean;
  aspectRatio?: '16:9' | '9:16' | '4:3' | 'auto';
  borderRadius?: number;
  borderColor?: string;
  borderWidth?: number;
  shadow?: boolean;
  volume?: number;
  muted?: boolean;
  playbackRate?: number;
  width?: string | number;
  height?: string | number;
  delay?: number;
}

/**
 * VideoPlayer — Programmatic video player component for Remotion.
 * Wraps Remotion's OffthreadVideo with a sleek SaaS UI player chrome,
 * scrub progress bar, play status badge, and duration timecode.
 */
export function VideoPlayer({
  src = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  poster,
  title,
  durationText = '01:30',
  showControls = true,
  aspectRatio = '16:9',
  borderRadius = 16,
  borderColor = 'rgba(255, 255, 255, 0.15)',
  borderWidth = 1,
  shadow = true,
  volume = 1,
  muted = false,
  playbackRate = 1,
  width = '100%',
  height = 'auto',
  delay = 0,
}: VideoPlayerProps) {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const adjustedFrame = Math.max(0, frame - delay);

  const entrySpr = spring({
    frame: adjustedFrame,
    fps,
    config: { damping: 14, stiffness: 100, mass: 0.8 },
  });

  const scale = interpolate(entrySpr, [0, 1], [0.95, 1]);
  const opacity = interpolate(entrySpr, [0, 1], [0, 1]);

  // Video progress bar interpolation
  const progressRatio = Math.min(1, Math.max(0, adjustedFrame / (durationInFrames || 90)));
  const progressPercent = `${(progressRatio * 100).toFixed(1)}%`;

  // Calculate current elapsed time string (MM:SS)
  const elapsedSec = Math.floor(adjustedFrame / fps);
  const elapsedMins = Math.floor(elapsedSec / 60);
  const remainingSec = elapsedSec % 60;
  const timecode = `${String(elapsedMins).padStart(2, '0')}:${String(remainingSec).padStart(2, '0')}`;

  const ratioPadding =
    aspectRatio === '16:9'
      ? '56.25%'
      : aspectRatio === '9:16'
        ? '177.77%'
        : aspectRatio === '4:3'
          ? '75%'
          : undefined;

  return (
    <div
      style={{
        position: 'relative',
        width,
        height: ratioPadding ? 0 : height,
        paddingBottom: ratioPadding,
        borderRadius,
        border: `${borderWidth}px solid ${borderColor}`,
        boxShadow: shadow
          ? '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 40px rgba(0, 0, 0, 0.5)'
          : 'none',
        overflow: 'hidden',
        backgroundColor: '#09090b',
        transform: `scale(${scale})`,
        opacity,
      }}
    >
      <div
        style={{
          position: ratioPadding ? 'absolute' : 'relative',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
        }}
      >
        <OffthreadVideo
          src={src}
          volume={muted ? 0 : volume}
          playbackRate={playbackRate}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
          }}
        />

        {showControls && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: 16,
              background:
                'linear-gradient(to bottom, rgba(9, 9, 11, 0.6) 0%, transparent 25%, transparent 70%, rgba(9, 9, 11, 0.85) 100%)',
              pointerEvents: 'none',
            }}
          >
            {/* Top Bar: Title & HD Badge */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              {title ? (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '4px 12px',
                    borderRadius: 8,
                    backgroundColor: 'rgba(9, 9, 11, 0.6)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#f4f4f5',
                    fontSize: 13,
                    fontWeight: 600,
                  }}
                >
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      backgroundColor: '#10b981',
                    }}
                  />
                  <span>{title}</span>
                </div>
              ) : (
                <div />
              )}

              <span
                style={{
                  padding: '2px 8px',
                  borderRadius: 6,
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(6px)',
                  color: '#e4e4e7',
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: '0.05em',
                }}
              >
                1080p 60fps
              </span>
            </div>

            {/* Bottom Bar: Progress Bar & Controls */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {/* Scrub line */}
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  height: 4,
                  borderRadius: 2,
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    bottom: 0,
                    width: progressPercent,
                    backgroundColor: '#10b981',
                    boxShadow: '0 0 10px #10b981',
                  }}
                />
              </div>

              {/* Timecode & status indicator */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: 12,
                  color: '#a1a1aa',
                  fontWeight: 500,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="#10b981">
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                  <span>
                    {timecode} / {durationText}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 11, color: '#71717a' }}>HQ Audio</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export { VideoPlayer as Video };
