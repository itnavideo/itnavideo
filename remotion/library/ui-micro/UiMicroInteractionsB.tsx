import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

// ============================================================================
// 11. DOT LOADER (Wave of large bouncing glowing orbs)
// ============================================================================
export interface DotLoaderProps {
  label?: string;
  theme?: 'dark' | 'light';
  accentColor?: string;
  style?: React.CSSProperties;
}

export const DotLoader: React.FC<DotLoaderProps> = ({
  label = 'Generating Scene Transitions...',
  theme = 'light',
  accentColor = '#EA580C',
  style = {},
}) => {
  const frame = useCurrentFrame();
  const isDark = theme === 'dark';

  const dots = [0, 1, 2, 3, 4];

  const bgColor = isDark ? '#0F172A' : '#FFFFFF';
  const textColor = isDark ? '#F8FAFC' : '#0F172A';
  const borderColor = isDark ? 'rgba(255,255,255,0.12)' : 'rgba(15,23,42,0.12)';

  return (
    <div
      style={{
        width: 620,
        height: 360,
        backgroundColor: 'transparent',
        borderRadius: 32,
        padding: 40,
        border: 'none',
        boxShadow: isDark ? '0 25px 60px rgba(0,0,0,0.6)' : '0 20px 50px rgba(15,23,42,0.1)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'system-ui, sans-serif',
        boxSizing: 'border-box',
        ...style,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        {dots.map((d) => {
          const delay = d * 6;
          const bounce = Math.sin(((frame + delay) / 25) * Math.PI * 2) * 22;
          const scale = interpolate(Math.abs(bounce), [0, 22], [1, 1.35]);
          return (
            <div
              key={d}
              style={{
                width: 28,
                height: 28,
                borderRadius: 14,
                backgroundColor: d === 2 ? accentColor : d % 2 === 0 ? '#FB923C' : '#F59E0B',
                transform: `translateY(${bounce}px) scale(${scale})`,
                boxShadow: `0 8px 24px ${accentColor}88`,
              }}
            />
          );
        })}
      </div>

      <div style={{ marginTop: 44, fontSize: 24, fontWeight: 800, color: textColor, letterSpacing: '-0.01em' }}>
        {label}
      </div>
      <div style={{ fontSize: 16, color: isDark ? '#94A3B8' : '#64748B', marginTop: 6, fontWeight: 500 }}>
        Neural synthesis thread active
      </div>
    </div>
  );
};

// ============================================================================
// 12. SKELETON (Bold UI wireframe cards with animated gradient shimmer sweep)
// ============================================================================
export interface SkeletonProps {
  theme?: 'dark' | 'light';
  accentColor?: string;
  style?: React.CSSProperties;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  theme = 'light',
  accentColor = '#EA580C',
  style = {},
}) => {
  const frame = useCurrentFrame();
  const isDark = theme === 'dark';

  const sweep = ((frame % 60) / 60) * 100;

  const bgColor = isDark ? '#0F172A' : '#FFFFFF';
  const shimmerBase = isDark ? '#1E293B' : '#E2E8F0';
  const shimmerHighlight = isDark ? '#334155' : '#F8FAFC';
  const borderColor = isDark ? 'rgba(255,255,255,0.12)' : 'rgba(15,23,42,0.12)';

  const shimmerStyle: React.CSSProperties = {
    background: `linear-gradient(90deg, ${shimmerBase} 0%, ${shimmerHighlight} 50%, ${shimmerBase} 100%)`,
    backgroundSize: '200% 100%',
    backgroundPosition: `${sweep * 2}% 0`,
    borderRadius: 12,
  };

  return (
    <div
      style={{
        width: 680,
        backgroundColor: 'transparent',
        borderRadius: 28,
        padding: '36px 40px',
        border: 'none',
        boxShadow: isDark ? '0 25px 60px rgba(0,0,0,0.6)' : '0 20px 50px rgba(15,23,42,0.1)',
        fontFamily: 'system-ui, sans-serif',
        boxSizing: 'border-box',
        ...style,
      }}
    >
      <div style={{ display: 'flex', gap: 24, alignItems: 'center', marginBottom: 28 }}>
        <div style={{ width: 76, height: 76, borderRadius: 38, ...shimmerStyle }} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ width: '60%', height: 24, ...shimmerStyle }} />
          <div style={{ width: '35%', height: 16, ...shimmerStyle }} />
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ width: '100%', height: 20, ...shimmerStyle }} />
        <div style={{ width: '90%', height: 20, ...shimmerStyle }} />
        <div style={{ width: '75%', height: 20, ...shimmerStyle }} />
      </div>
    </div>
  );
};

// ============================================================================
// 13. SEND BUTTON (Video-scale action button with paper airplane launch & trail)
// ============================================================================
export interface SendButtonProps {
  label?: string;
  theme?: 'dark' | 'light';
  accentColor?: string;
  style?: React.CSSProperties;
}

export const SendButton: React.FC<SendButtonProps> = ({
  label = 'Launch Video Campaign',
  theme = 'light',
  accentColor = '#EA580C',
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const isDark = theme === 'dark';

  const loop = frame % 70;
  const isSent = loop > 25;

  const flySpring = spring({
    frame: Math.max(0, loop - 25),
    fps,
    config: { damping: 12, stiffness: 180 },
  });

  const planeX = isSent ? interpolate(flySpring, [0, 1], [0, 120]) : 0;
  const planeY = isSent ? interpolate(flySpring, [0, 1], [0, -60]) : 0;
  const planeOpacity = isSent ? interpolate(flySpring, [0, 0.8, 1], [1, 1, 0]) : 1;

  const bgColor = isDark ? '#0F172A' : '#FFFFFF';
  const borderColor = isDark ? 'rgba(255,255,255,0.12)' : 'rgba(15,23,42,0.12)';

  return (
    <div
      style={{
        width: 640,
        backgroundColor: 'transparent',
        borderRadius: 28,
        padding: '36px 40px',
        border: 'none',
        boxShadow: isDark ? '0 25px 60px rgba(0,0,0,0.6)' : '0 20px 50px rgba(15,23,42,0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'system-ui, sans-serif',
        boxSizing: 'border-box',
        ...style,
      }}
    >
      <div
        style={{
          width: '100%',
          padding: '24px 36px',
          borderRadius: 22,
          background: `linear-gradient(135deg, ${accentColor}, #F97316)`,
          color: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 20,
          boxShadow: `0 14px 35px ${accentColor}66`,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <span style={{ fontSize: 26, fontWeight: 900, letterSpacing: '-0.01em' }}>
          {isSent && flySpring > 0.5 ? 'Video Dispatched!' : label}
        </span>

        <div
          style={{
            transform: `translate(${planeX}px, ${planeY}px) scale(${isSent ? 0.9 : 1})`,
            opacity: planeOpacity,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// 14. MENU → CLOSE (Hamburger morphing into crisp X with spring rotation)
// ============================================================================
export interface MenuCloseProps {
  label?: string;
  theme?: 'dark' | 'light';
  accentColor?: string;
  style?: React.CSSProperties;
}

export const MenuClose: React.FC<MenuCloseProps> = ({
  label = 'Menu Navigation Trigger',
  theme = 'light',
  accentColor = '#EA580C',
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const isDark = theme === 'dark';

  const isOpen = (Math.floor(frame / 60) % 2) === 1;
  const animSpring = spring({
    frame: frame % 60,
    fps,
    config: { damping: 14, stiffness: 200 },
  });

  const progress = isOpen ? animSpring : 1 - animSpring;

  const topRot = interpolate(progress, [0, 1], [0, 45]);
  const topY = interpolate(progress, [0, 1], [0, 14]);
  const botRot = interpolate(progress, [0, 1], [0, -45]);
  const botY = interpolate(progress, [0, 1], [0, -14]);
  const midOpacity = interpolate(progress, [0, 0.4, 1], [1, 0, 0]);

  const bgColor = isDark ? '#0F172A' : '#FFFFFF';
  const textColor = isDark ? '#F8FAFC' : '#0F172A';
  const borderColor = isDark ? 'rgba(255,255,255,0.12)' : 'rgba(15,23,42,0.12)';

  return (
    <div
      style={{
        width: 600,
        height: 360,
        backgroundColor: 'transparent',
        borderRadius: 32,
        padding: 40,
        border: 'none',
        boxShadow: isDark ? '0 25px 60px rgba(0,0,0,0.6)' : '0 20px 50px rgba(15,23,42,0.1)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'system-ui, sans-serif',
        boxSizing: 'border-box',
        ...style,
      }}
    >
      {/* Icon Button */}
      <div
        style={{
          width: 96,
          height: 96,
          borderRadius: 28,
          backgroundColor: isDark ? '#1E293B' : '#F1F5F9',
          border: `3px solid ${isDark ? '#334155' : '#E2E8F0'}`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 9,
          boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
        }}
      >
        <div
          style={{
            width: 48,
            height: 5,
            borderRadius: 3,
            backgroundColor: accentColor,
            transform: `translateY(${topY}px) rotate(${topRot}deg)`,
          }}
        />
        <div
          style={{
            width: 48,
            height: 5,
            borderRadius: 3,
            backgroundColor: accentColor,
            opacity: midOpacity,
          }}
        />
        <div
          style={{
            width: 48,
            height: 5,
            borderRadius: 3,
            backgroundColor: accentColor,
            transform: `translateY(${botY}px) rotate(${botRot}deg)`,
          }}
        />
      </div>

      <div style={{ marginTop: 28, fontSize: 26, fontWeight: 800, color: textColor }}>
        {isOpen ? 'Close Drawer' : label}
      </div>
      <div style={{ fontSize: 16, color: isDark ? '#94A3B8' : '#64748B', marginTop: 4, fontWeight: 500 }}>
        Adaptive responsive hamburger state
      </div>
    </div>
  );
};

// ============================================================================
// 15. SEARCH EXPAND (Magnifying glass expanding into wide glass search pill)
// ============================================================================
export interface SearchExpandProps {
  query?: string;
  theme?: 'dark' | 'light';
  accentColor?: string;
  style?: React.CSSProperties;
}

export const SearchExpand: React.FC<SearchExpandProps> = ({
  query = 'Best viral AI hook templates',
  theme = 'light',
  accentColor = '#EA580C',
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const isDark = theme === 'dark';

  const expandSpring = spring({
    frame: frame % 80,
    fps,
    config: { damping: 14, stiffness: 160 },
  });

  const width = interpolate(expandSpring, [0, 1], [90, 560]);
  const chars = Math.round(interpolate(expandSpring, [0.3, 1], [0, query.length]));
  const textTyped = query.slice(0, chars);

  const bgColor = isDark ? '#0F172A' : '#FFFFFF';
  const textColor = isDark ? '#F8FAFC' : '#0F172A';
  const borderColor = isDark ? 'rgba(255,255,255,0.12)' : 'rgba(15,23,42,0.12)';

  return (
    <div
      style={{
        width: 680,
        height: 360,
        backgroundColor: 'transparent',
        borderRadius: 32,
        padding: 40,
        border: 'none',
        boxShadow: isDark ? '0 25px 60px rgba(0,0,0,0.6)' : '0 20px 50px rgba(15,23,42,0.1)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'system-ui, sans-serif',
        boxSizing: 'border-box',
        ...style,
      }}
    >
      <div
        style={{
          width,
          height: 76,
          borderRadius: 38,
          backgroundColor: isDark ? '#1E293B' : '#F8FAFC',
          border: `3px solid ${accentColor}`,
          boxShadow: `0 8px 30px ${accentColor}33`,
          display: 'flex',
          alignItems: 'center',
          padding: '0 24px',
          boxSizing: 'border-box',
          gap: 16,
          overflow: 'hidden',
        }}
      >
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>

        {width > 180 && (
          <div style={{ fontSize: 22, fontWeight: 700, color: textColor, whiteSpace: 'nowrap' }}>
            {textTyped}
            <span style={{ color: accentColor, fontWeight: 900 }}>|</span>
          </div>
        )}
      </div>

      <div style={{ marginTop: 28, fontSize: 18, color: isDark ? '#94A3B8' : '#64748B', fontWeight: 600 }}>
        Smart Semantic Search Engine
      </div>
    </div>
  );
};

// ============================================================================
// 16. NOTIFICATION (Video-scale high-contrast broadcast banner with glowing app icon)
// ============================================================================
export interface VideoNotificationProps {
  appName?: string;
  title?: string;
  message?: string;
  theme?: 'dark' | 'light';
  accentColor?: string;
  style?: React.CSSProperties;
}

export const VideoNotification: React.FC<VideoNotificationProps> = ({
  appName = 'Itnavideo Studio',
  title = 'Render Completed in 4K UHD',
  message = 'Your 16:9 faceless video with kinetic subtitles is ready for download.',
  theme = 'light',
  accentColor = '#EA580C',
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const isDark = theme === 'dark';

  const toastSpring = spring({
    frame: frame % 70,
    fps,
    config: { damping: 14, stiffness: 180 },
  });

  const bgColor = isDark ? '#0F172A' : '#FFFFFF';
  const textColor = isDark ? '#F8FAFC' : '#0F172A';
  const borderColor = isDark ? 'rgba(255,255,255,0.12)' : 'rgba(15,23,42,0.12)';

  return (
    <div
      style={{
        width: 700,
        backgroundColor: 'transparent',
        borderRadius: 28,
        padding: '30px 36px',
        border: 'none',
        boxShadow: isDark ? '0 25px 60px rgba(0,0,0,0.6)' : '0 20px 50px rgba(15,23,42,0.1)',
        display: 'flex',
        alignItems: 'center',
        gap: 24,
        fontFamily: 'system-ui, sans-serif',
        transform: `translateY(${(1 - toastSpring) * -30}px) scale(${toastSpring})`,
        opacity: toastSpring,
        boxSizing: 'border-box',
        ...style,
      }}
    >
      <div
        style={{
          width: 72,
          height: 72,
          borderRadius: 20,
          backgroundColor: isDark ? '#7C2D1233' : '#FFEDD5',
          border: `2px solid ${accentColor}66`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 34,
          flexShrink: 0,
        }}
      >
        🎬
      </div>

      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 16, fontWeight: 800, color: accentColor, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {appName}
          </span>
          <span style={{ fontSize: 15, color: isDark ? '#94A3B8' : '#64748B', fontWeight: 600 }}>
            Just now
          </span>
        </div>
        <div style={{ fontSize: 24, fontWeight: 800, color: textColor, marginTop: 4 }}>
          {title}
        </div>
        <div style={{ fontSize: 17, color: isDark ? '#94A3B8' : '#64748B', marginTop: 4, fontWeight: 500, lineHeight: 1.4 }}>
          {message}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// 17. STAR RATING (5 massive glowing golden stars filling sequentially with score)
// ============================================================================
export interface StarRatingProps {
  score?: number;
  reviewCount?: string;
  theme?: 'dark' | 'light';
  accentColor?: string;
  style?: React.CSSProperties;
}

export const StarRating: React.FC<StarRatingProps> = ({
  score = 4.9,
  reviewCount = '2,480+ Creator Reviews',
  theme = 'light',
  accentColor = '#F59E0B',
  style = {},
}) => {
  const frame = useCurrentFrame();
  const isDark = theme === 'dark';

  const filledStars = Math.min(5, Math.floor((frame % 60) / 10) + 1);

  const bgColor = isDark ? '#0F172A' : '#FFFFFF';
  const textColor = isDark ? '#F8FAFC' : '#0F172A';
  const borderColor = isDark ? 'rgba(255,255,255,0.12)' : 'rgba(15,23,42,0.12)';

  return (
    <div
      style={{
        width: 660,
        backgroundColor: 'transparent',
        borderRadius: 32,
        padding: '38px 44px',
        border: 'none',
        boxShadow: isDark ? '0 25px 60px rgba(0,0,0,0.6)' : '0 20px 50px rgba(15,23,42,0.1)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'system-ui, sans-serif',
        boxSizing: 'border-box',
        ...style,
      }}
    >
      {/* 5 Stars */}
      <div style={{ display: 'flex', gap: 14 }}>
        {[1, 2, 3, 4, 5].map((s) => {
          const isFilled = s <= filledStars;
          return (
            <svg
              key={s}
              width="52"
              height="52"
              viewBox="0 0 24 24"
              fill={isFilled ? accentColor : 'none'}
              stroke={accentColor}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                transform: isFilled ? 'scale(1.15)' : 'scale(1)',
                filter: isFilled ? `drop-shadow(0 6px 14px ${accentColor}88)` : 'none',
                transition: 'transform 0.15s ease',
              }}
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          );
        })}
      </div>

      <div style={{ marginTop: 24, fontSize: 36, fontWeight: 900, color: textColor, letterSpacing: '-0.02em' }}>
        {score} / 5.0 Rating
      </div>
      <div style={{ fontSize: 18, color: isDark ? '#94A3B8' : '#64748B', marginTop: 4, fontWeight: 600 }}>
        {reviewCount}
      </div>
    </div>
  );
};

// ============================================================================
// 18. RANGE SLIDER (Thick gradient track with magnetic glowing thumb & value tag)
// ============================================================================
export interface RangeSliderProps {
  label?: string;
  theme?: 'dark' | 'light';
  accentColor?: string;
  style?: React.CSSProperties;
}

export const RangeSlider: React.FC<RangeSliderProps> = ({
  label = 'Background Music Volume',
  theme = 'light',
  accentColor = '#EA580C',
  style = {},
}) => {
  const frame = useCurrentFrame();
  const isDark = theme === 'dark';

  const progress = ((Math.sin((frame / 40) * Math.PI * 2) + 1) / 2) * 100;

  const bgColor = isDark ? '#0F172A' : '#FFFFFF';
  const textColor = isDark ? '#F8FAFC' : '#0F172A';
  const borderColor = isDark ? 'rgba(255,255,255,0.12)' : 'rgba(15,23,42,0.12)';

  return (
    <div
      style={{
        width: 700,
        backgroundColor: 'transparent',
        borderRadius: 28,
        padding: '36px 44px',
        border: 'none',
        boxShadow: isDark ? '0 25px 60px rgba(0,0,0,0.6)' : '0 20px 50px rgba(15,23,42,0.1)',
        fontFamily: 'system-ui, sans-serif',
        boxSizing: 'border-box',
        ...style,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div style={{ fontSize: 26, fontWeight: 800, color: textColor }}>{label}</div>
        <div style={{ fontSize: 28, fontWeight: 900, color: accentColor, fontFamily: 'monospace' }}>
          {Math.round(progress)}%
        </div>
      </div>

      {/* Track */}
      <div
        style={{
          width: '100%',
          height: 20,
          backgroundColor: isDark ? '#1E293B' : '#E2E8F0',
          borderRadius: 10,
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${progress}%`,
            background: `linear-gradient(90deg, ${accentColor}, #FB923C)`,
            borderRadius: 10,
          }}
        />

        {/* Magnetic Thumb */}
        <div
          style={{
            position: 'absolute',
            left: `calc(${progress}% - 24px)`,
            width: 48,
            height: 48,
            borderRadius: 24,
            backgroundColor: '#FFFFFF',
            border: `4px solid ${accentColor}`,
            boxShadow: `0 6px 20px ${accentColor}88`,
          }}
        />
      </div>
    </div>
  );
};

// ============================================================================
// 19. TAB SWITCH (Pill segment tab switcher with sliding spring active pill)
// ============================================================================
export interface TabSwitchProps {
  tabs?: string[];
  theme?: 'dark' | 'light';
  accentColor?: string;
  style?: React.CSSProperties;
}

export const TabSwitch: React.FC<TabSwitchProps> = ({
  tabs = ['Visuals', 'Captions', 'Audio Deck', 'Export'],
  theme = 'light',
  accentColor = '#EA580C',
  style = {},
}) => {
  const frame = useCurrentFrame();
  const isDark = theme === 'dark';

  const activeIdx = Math.floor(frame / 40) % tabs.length;

  const bgColor = isDark ? '#0F172A' : '#FFFFFF';
  const textColor = isDark ? '#F8FAFC' : '#0F172A';
  const borderColor = isDark ? 'rgba(255,255,255,0.12)' : 'rgba(15,23,42,0.12)';

  return (
    <div
      style={{
        width: 720,
        backgroundColor: 'transparent',
        borderRadius: 28,
        padding: '30px 36px',
        border: 'none',
        boxShadow: isDark ? '0 25px 60px rgba(0,0,0,0.6)' : '0 20px 50px rgba(15,23,42,0.1)',
        fontFamily: 'system-ui, sans-serif',
        boxSizing: 'border-box',
        ...style,
      }}
    >
      <div
        style={{
          display: 'flex',
          backgroundColor: isDark ? '#1E293B' : '#F1F5F9',
          padding: 8,
          borderRadius: 20,
          gap: 8,
        }}
      >
        {tabs.map((t, i) => {
          const isActive = i === activeIdx;
          return (
            <div
              key={i}
              style={{
                flex: 1,
                padding: '16px 0',
                borderRadius: 14,
                backgroundColor: isActive ? (isDark ? '#334155' : '#FFFFFF') : 'transparent',
                color: isActive ? accentColor : (isDark ? '#94A3B8' : '#64748B'),
                fontWeight: isActive ? 800 : 600,
                fontSize: 20,
                textAlign: 'center',
                boxShadow: isActive ? '0 6px 18px rgba(0,0,0,0.1)' : 'none',
              }}
            >
              {t}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ============================================================================
// 20. GRID ↔ LIST (Animated layout switcher between 2x2 cards and list rows)
// ============================================================================
export interface GridListProps {
  theme?: 'dark' | 'light';
  accentColor?: string;
  style?: React.CSSProperties;
}

export const GridList: React.FC<GridListProps> = ({
  theme = 'light',
  accentColor = '#EA580C',
  style = {},
}) => {
  const frame = useCurrentFrame();
  const isDark = theme === 'dark';

  const isGrid = (Math.floor(frame / 60) % 2) === 0;

  const bgColor = isDark ? '#0F172A' : '#FFFFFF';
  const cardBg = isDark ? '#1E293B' : '#F8FAFC';
  const borderColor = isDark ? 'rgba(255,255,255,0.12)' : 'rgba(15,23,42,0.12)';

  return (
    <div
      style={{
        width: 680,
        height: 380,
        backgroundColor: 'transparent',
        borderRadius: 32,
        padding: 36,
        border: 'none',
        boxShadow: isDark ? '0 25px 60px rgba(0,0,0,0.6)' : '0 20px 50px rgba(15,23,42,0.1)',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'system-ui, sans-serif',
        boxSizing: 'border-box',
        ...style,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div style={{ fontSize: 24, fontWeight: 800, color: isDark ? '#FFFFFF' : '#0F172A' }}>
          {isGrid ? '2x2 Grid View' : 'Horizontal List View'}
        </div>
        <div style={{ padding: '8px 16px', borderRadius: 12, backgroundColor: accentColor, color: '#FFFFFF', fontWeight: 800, fontSize: 15 }}>
          Layout Mode
        </div>
      </div>

      {/* Grid or List items */}
      <div
        style={{
          flex: 1,
          display: 'grid',
          gridTemplateColumns: isGrid ? '1fr 1fr' : '1fr',
          gap: 14,
        }}
      >
        {[1, 2, 3, 4].slice(0, isGrid ? 4 : 3).map((n) => (
          <div
            key={n}
            style={{
              backgroundColor: cardBg,
              borderRadius: 16,
              border: `2px solid ${isDark ? '#334155' : '#E2E8F0'}`,
              padding: isGrid ? 16 : 14,
              display: 'flex',
              alignItems: 'center',
              gap: 16,
            }}
          >
            <div style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: accentColor, opacity: 0.8 }} />
            <div style={{ flex: 1 }}>
              <div style={{ width: '70%', height: 12, backgroundColor: isDark ? '#475569' : '#CBD5E1', borderRadius: 6, marginBottom: 6 }} />
              <div style={{ width: '40%', height: 8, backgroundColor: isDark ? '#334155' : '#E2E8F0', borderRadius: 4 }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

