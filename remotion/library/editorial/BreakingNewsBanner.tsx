import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';

export interface BreakingNewsBannerProps {
  headline?: string;
  tickerText?: string;
  location?: string;
  liveBadge?: boolean;
  accentColor?: string;
  delay?: number;
}

/**
 * BreakingNewsBanner — Broadcast news lower-third banner.
 * Features flashing red "BREAKING NEWS" badge, live broadcast clock,
 * primary headline card, and bottom news bulletin crawl.
 */
export function BreakingNewsBanner({
  headline = 'GLOBAL MARKETS SURGE FOLLOWING BREAKTHROUGH IN QUANTUM COMPUTING',
  tickerText = 'NASDAQ +3.4% • DOW JONES +420 PTS • TECH SECTOR LEADS HISTORIC RALLY • OIL PRICES STABILIZE AT $72/BARREL',
  location = 'NEW YORK',
  liveBadge = true,
  accentColor = '#ef4444',
  delay = 0,
}: BreakingNewsBannerProps) {
  const frame = useCurrentFrame();

  const adjustedFrame = Math.max(0, frame - delay);

  // Flashing live beacon
  const flash = Math.sin(adjustedFrame * 0.15) > 0;

  // Marquee scroll for ticker
  const tickerOffset = (adjustedFrame * 2) % 1200;

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.8)',
      }}
    >
      {/* Top Banner Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'stretch',
          backgroundColor: '#09090b',
          borderTop: `3px solid ${accentColor}`,
        }}
      >
        {/* Red Breaking News Pill */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            backgroundColor: accentColor,
            padding: '10px 20px',
            color: '#fff',
            fontWeight: 900,
            fontSize: 14,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            flexShrink: 0,
          }}
        >
          {liveBadge && (
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: '#fff',
                opacity: flash ? 1 : 0.3,
              }}
            />
          )}
          <span>BREAKING NEWS</span>
        </div>

        {/* Location Tag */}
        {location && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#18181b',
              padding: '0 16px',
              color: '#38bdf8',
              fontSize: 12,
              fontWeight: 800,
              letterSpacing: '0.06em',
              borderRight: '1px solid rgba(255, 255, 255, 0.1)',
              flexShrink: 0,
            }}
          >
            {location}
          </div>
        )}

        {/* Main Headline */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            padding: '0 20px',
            color: '#fff',
            fontSize: 15,
            fontWeight: 800,
            letterSpacing: '-0.01em',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {headline}
        </div>
      </div>

      {/* Bottom Crawling Ticker */}
      <div
        style={{
          height: 28,
          backgroundColor: '#18181b',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 40,
            transform: `translateX(-${tickerOffset}px)`,
            whiteSpace: 'nowrap',
            color: '#d4d4d8',
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: '0.04em',
            fontFamily: 'sans-serif',
          }}
        >
          <span>{tickerText}</span>
          <span>{tickerText}</span>
          <span>{tickerText}</span>
        </div>
      </div>
    </div>
  );
}
