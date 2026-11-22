import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface FlashSaleCountdownProps {
  saleTitle?: string;
  hours?: number;
  minutes?: number;
  seconds?: number;
  claimedPercentage?: number;
  unitsLeft?: number;
  accentColor?: string;
  delay?: number;
  width?: number | string;
}

/**
 * FlashSaleCountdown — High-urgency promotional countdown banner.
 * Features 3 split-flap digital clock boxes (Hours, Minutes, Seconds),
 * and claimed quota inventory progress bar.
 */
export function FlashSaleCountdown({
  saleTitle = '⚡ FLASH SALE ENDS IN',
  hours = 2,
  minutes = 45,
  seconds = 18,
  claimedPercentage = 78,
  unitsLeft = 14,
  accentColor = '#ef4444',
  delay = 0,
  width = '100%',
}: FlashSaleCountdownProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const adjustedFrame = Math.max(0, frame - delay);

  // Entrance spring
  const entrySpr = spring({
    frame: adjustedFrame,
    fps,
    config: { damping: 14, stiffness: 95, mass: 0.8 },
  });

  const scale = interpolate(entrySpr, [0, 1], [0.92, 1]);
  const opacity = interpolate(entrySpr, [0, 1], [0, 1]);

  // Compute countdown seconds decremented by frame
  const totalSeconds = hours * 3600 + minutes * 60 + seconds;
  const elapsedSeconds = Math.floor(adjustedFrame / fps);
  const remainingSeconds = Math.max(0, totalSeconds - elapsedSeconds);

  const curH = String(Math.floor(remainingSeconds / 3600)).padStart(2, '0');
  const curM = String(Math.floor((remainingSeconds % 3600) / 60)).padStart(2, '0');
  const curS = String(remainingSeconds % 60).padStart(2, '0');

  return (
    <div
      style={{
        position: 'relative',
        width,
        backgroundColor: '#09090b',
        borderRadius: 16,
        border: '1px solid rgba(255, 255, 255, 0.12)',
        padding: '18px 24px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 14,
        boxShadow: '0 25px 50px rgba(0, 0, 0, 0.8)',
        transform: `scale(${scale})`,
        opacity,
      }}
    >
      {/* Title */}
      <span style={{ color: accentColor, fontSize: 13, fontWeight: 900, letterSpacing: '0.08em' }}>
        {saleTitle}
      </span>

      {/* 3 Split-Flap Clock Digits */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {/* Hours */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <div
            style={{
              padding: '8px 14px',
              borderRadius: 8,
              backgroundColor: '#18181b',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#fff',
              fontSize: 24,
              fontWeight: 900,
              fontFamily: 'monospace',
              boxShadow: 'inset 0 0 10px rgba(0,0,0,0.8)',
            }}
          >
            {curH}
          </div>
          <span style={{ color: '#71717a', fontSize: 9, fontWeight: 700 }}>HOURS</span>
        </div>

        <span style={{ color: '#fff', fontSize: 20, fontWeight: 900, marginTop: -14 }}>:</span>

        {/* Minutes */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <div
            style={{
              padding: '8px 14px',
              borderRadius: 8,
              backgroundColor: '#18181b',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#fff',
              fontSize: 24,
              fontWeight: 900,
              fontFamily: 'monospace',
              boxShadow: 'inset 0 0 10px rgba(0,0,0,0.8)',
            }}
          >
            {curM}
          </div>
          <span style={{ color: '#71717a', fontSize: 9, fontWeight: 700 }}>MINUTES</span>
        </div>

        <span style={{ color: '#fff', fontSize: 20, fontWeight: 900, marginTop: -14 }}>:</span>

        {/* Seconds */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <div
            style={{
              padding: '8px 14px',
              borderRadius: 8,
              backgroundColor: '#18181b',
              border: `1px solid ${accentColor}80`,
              color: accentColor,
              fontSize: 24,
              fontWeight: 900,
              fontFamily: 'monospace',
              boxShadow: `0 0 12px ${accentColor}40, inset 0 0 10px rgba(0,0,0,0.8)`,
            }}
          >
            {curS}
          </div>
          <span style={{ color: '#71717a', fontSize: 9, fontWeight: 700 }}>SECONDS</span>
        </div>
      </div>

      {/* Stock Remaining Progress Bar */}
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, fontWeight: 700 }}>
          <span style={{ color: '#d4d4d8' }}>{claimedPercentage}% Claimed</span>
          <span style={{ color: '#f59e0b' }}>Only {unitsLeft} Left</span>
        </div>
        <div
          style={{
            width: '100%',
            height: 6,
            borderRadius: 3,
            backgroundColor: '#18181b',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: `${claimedPercentage}%`,
              height: '100%',
              backgroundColor: accentColor,
              boxShadow: `0 0 10px ${accentColor}`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
