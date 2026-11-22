import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface YouTubePlayerFrameProps {
  videoTitle?: string;
  channelName?: string;
  currentTime?: string;
  totalTime?: string;
  progressPercent?: number;
  accentColor?: string;
  delay?: number;
  width?: number | string;
  height?: number;
}

/**
 * YouTubePlayerFrame — Authentic 16:9 desktop YouTube video player interface frame.
 * Scrub bar with chapter ticks, play/pause controls, timecode display, HD gear, and fullscreen icon.
 */
export function YouTubePlayerFrame({
  videoTitle = 'Building Remotion Video Automations at Scale',
  channelName = 'Itnavideo Engineering',
  currentTime = '04:28',
  totalTime = '14:50',
  progressPercent = 35,
  accentColor = '#ef4444',
  delay = 0,
  width = 640,
  height = 360,
}: YouTubePlayerFrameProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = Math.max(0, frame - delay);

  const intro = spring({
    frame: t,
    fps,
    config: { damping: 14, stiffness: 85 },
  });

  return (
    <div
      style={{
        width,
        height,
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '16px 20px',
        boxSizing: 'border-box',
        borderRadius: 20,
        border: '1px solid rgba(255, 255, 255, 0.15)',
        background: 'linear-gradient(180deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.1) 40%, rgba(0,0,0,0.9) 100%)',
        boxShadow: '0 24px 48px rgba(0,0,0,0.9)',
        overflow: 'hidden',
        opacity: intro,
        fontFamily: 'Roboto, Inter, system-ui, sans-serif',
      }}
    >
      {/* Top Header: Title & Share */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#ffffff', textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}>
            {videoTitle}
          </div>
          <div style={{ fontSize: 12, color: '#cbd5e1', marginTop: 2 }}>
            {channelName}
          </div>
        </div>

        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2">
          <circle cx="18" cy="5" r="3" />
          <circle cx="6" cy="12" r="3" />
          <circle cx="18" cy="19" r="3" />
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
        </svg>
      </div>

      {/* Center Play Button Overlay */}
      <div style={{ alignSelf: 'center' }}>
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: '50%',
            background: 'rgba(0, 0, 0, 0.6)',
            border: '2px solid rgba(255, 255, 255, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="#ffffff" style={{ marginLeft: 3 }}>
            <polygon points="5 3 19 12 5 21 5 3" />
          </svg>
        </div>
      </div>

      {/* Bottom Controls Bar */}
      <div>
        {/* Scrubber Progress Bar */}
        <div
          style={{
            width: '100%',
            height: 4,
            background: 'rgba(255, 255, 255, 0.25)',
            borderRadius: 2,
            position: 'relative',
            marginBottom: 10,
          }}
        >
          {/* Buffered / Loaded Bar */}
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              height: '100%',
              width: `${Math.min(100, progressPercent + 25)}%`,
              background: 'rgba(255, 255, 255, 0.4)',
              borderRadius: 2,
            }}
          />
          {/* Played Progress Bar */}
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              height: '100%',
              width: `${progressPercent}%`,
              background: accentColor,
              borderRadius: 2,
            }}
          />
          {/* Scrubber Dot */}
          <div
            style={{
              position: 'absolute',
              left: `${progressPercent}%`,
              top: '50%',
              transform: 'translate(-50%, -50%)',
              width: 12,
              height: 12,
              borderRadius: '50%',
              background: accentColor,
              boxShadow: `0 0 8px ${accentColor}`,
            }}
          />
        </div>

        {/* Buttons Row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {/* Left Controls: Play, Volume, Timecode */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#ffffff">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
            </svg>
            <span style={{ fontSize: 12, color: '#ffffff', fontWeight: 500 }}>
              {currentTime} / {totalTime}
            </span>
          </div>

          {/* Right Controls: Subtitles, Gear, Fullscreen */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <span style={{ fontSize: 10, fontWeight: 800, padding: '2px 4px', border: '1px solid #ffffff', borderRadius: 3, color: '#ffffff' }}>
              CC
            </span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2">
              <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
