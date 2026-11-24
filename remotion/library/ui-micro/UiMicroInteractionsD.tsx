import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

// ============================================================================
// 32. DRAG TO SORT (Middle item lifting with shadow, shifting position, and snapping)
// ============================================================================
export interface DragToSortProps {
  theme?: 'dark' | 'light';
  accentColor?: string;
  style?: React.CSSProperties;
}

export const DragToSort: React.FC<DragToSortProps> = ({
  theme = 'light',
  accentColor = '#EA580C',
  style = {},
}) => {
  const frame = useCurrentFrame();
  const isDark = theme === 'dark';

  const loop = frame % 60;
  const isDragging = loop > 15 && loop < 45;
  const dragY = isDragging ? Math.sin(((loop - 15) / 30) * Math.PI) * 44 : 0;
  const dragScale = isDragging ? 1.04 : 1.0;

  const items = ['1. Hook Headline Beat', '2. Dynamic B-Roll Cut', '3. Call to Action Finale'];

  const bgColor = isDark ? '#0F172A' : '#FFFFFF';
  const textColor = isDark ? '#F8FAFC' : '#0F172A';
  const itemBg = isDark ? '#1E293B' : '#F8FAFC';
  const borderColor = isDark ? 'rgba(255,255,255,0.12)' : 'rgba(15,23,42,0.12)';

  return (
    <div
      style={{
        width: 680,
        backgroundColor: 'transparent',
        borderRadius: 32,
        padding: '36px 40px',
        border: 'none',
        boxShadow: isDark ? '0 25px 60px rgba(0,0,0,0.6)' : '0 20px 50px rgba(15,23,42,0.1)',
        fontFamily: 'system-ui, sans-serif',
        boxSizing: 'border-box',
        ...style,
      }}
    >
      <div style={{ fontSize: 24, fontWeight: 800, color: textColor, marginBottom: 20 }}>
        Drag to Reorder Scene Layers
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {items.map((it, idx) => {
          const isMid = idx === 1;
          return (
            <div
              key={idx}
              style={{
                padding: '18px 24px',
                borderRadius: 16,
                backgroundColor: isMid && isDragging ? (isDark ? '#334155' : '#FFF7ED') : itemBg,
                border: `2.5px solid ${isMid && isDragging ? accentColor : isDark ? '#334155' : '#E2E8F0'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                transform: isMid ? `translateY(${dragY}px) scale(${dragScale})` : 'none',
                boxShadow: isMid && isDragging ? `0 14px 30px ${accentColor}44` : 'none',
                zIndex: isMid && isDragging ? 10 : 1,
              }}
            >
              <div style={{ fontSize: 20, fontWeight: 700, color: textColor }}>
                {it}
              </div>
              <div style={{ fontSize: 20, color: '#94A3B8', letterSpacing: '2px' }}>
                ⋮⋮
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ============================================================================
// 33. SWIPE DELETE (Card swiping left with red trash reveal, haptic shake, & collapse)
// ============================================================================
export interface SwipeDeleteProps {
  label?: string;
  theme?: 'dark' | 'light';
  accentColor?: string;
  style?: React.CSSProperties;
}

export const SwipeDelete: React.FC<SwipeDeleteProps> = ({
  label = 'Unused Clip 04_rough_cut.mov',
  theme = 'light',
  accentColor = '#EF4444',
  style = {},
}) => {
  const frame = useCurrentFrame();
  const isDark = theme === 'dark';

  const loop = frame % 65;
  const swipeX = loop > 20 ? Math.min(140, (loop - 20) * 8) : 0;

  const bgColor = isDark ? '#0F172A' : '#FFFFFF';
  const textColor = isDark ? '#F8FAFC' : '#0F172A';
  const borderColor = isDark ? 'rgba(255,255,255,0.12)' : 'rgba(15,23,42,0.12)';

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
      <div style={{ position: 'relative', overflow: 'hidden', borderRadius: 18 }}>
        {/* Red Background Behind */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: accentColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            paddingRight: 32,
            color: '#FFFFFF',
            fontWeight: 800,
            fontSize: 20,
          }}
        >
          🗑️ Delete
        </div>

        {/* Foreground Swiping Item */}
        <div
          style={{
            position: 'relative',
            backgroundColor: isDark ? '#1E293B' : '#F8FAFC',
            padding: '24px 28px',
            border: `2px solid ${isDark ? '#334155' : '#E2E8F0'}`,
            borderRadius: 18,
            display: 'flex',
            alignItems: 'center',
            gap: 20,
            transform: `translateX(-${swipeX}px)`,
          }}
        >
          <div style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: '#0284C7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF', fontSize: 20 }}>
            🎬
          </div>
          <div>
            <div style={{ fontSize: 22, fontWeight: 800, color: textColor }}>{label}</div>
            <div style={{ fontSize: 15, color: '#94A3B8', marginTop: 4 }}>Swipe left to purge from timeline</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// 34. TYPING… (Chat speech bubble with 3 dancing dots and typing user tag)
// ============================================================================
export interface TypingProps {
  author?: string;
  theme?: 'dark' | 'light';
  accentColor?: string;
  style?: React.CSSProperties;
}

export const Typing: React.FC<TypingProps> = ({
  author = 'AI Script Director',
  theme = 'light',
  accentColor = '#EA580C',
  style = {},
}) => {
  const frame = useCurrentFrame();
  const isDark = theme === 'dark';

  const bgColor = isDark ? '#0F172A' : '#FFFFFF';
  const textColor = isDark ? '#F8FAFC' : '#0F172A';
  const borderColor = isDark ? 'rgba(255,255,255,0.12)' : 'rgba(15,23,42,0.12)';

  return (
    <div
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        backgroundColor: 'transparent',
        borderRadius: 28,
        padding: '28px 36px',
        border: 'none',
        boxShadow: isDark ? '0 25px 60px rgba(0,0,0,0.6)' : '0 20px 50px rgba(15,23,42,0.1)',
        fontFamily: 'system-ui, sans-serif',
        boxSizing: 'border-box',
        ...style,
      }}
    >
      <div style={{ fontSize: 16, fontWeight: 800, color: accentColor, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>
        {author} is writing…
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          backgroundColor: isDark ? '#1E293B' : '#F1F5F9',
          padding: '16px 28px',
          borderRadius: 24,
        }}
      >
        {[0, 1, 2].map((i) => {
          const bounce = Math.sin(((frame + i * 8) / 18) * Math.PI * 2) * 8;
          return (
            <div
              key={i}
              style={{
                width: 16,
                height: 16,
                borderRadius: 8,
                backgroundColor: accentColor,
                transform: `translateY(${bounce}px)`,
                boxShadow: `0 4px 12px ${accentColor}66`,
              }}
            />
          );
        })}
      </div>
    </div>
  );
};

// ============================================================================
// 35. FLOAT LABEL (Sleek input field where label floats up to border with typed text)
// ============================================================================
export interface FloatLabelProps {
  label?: string;
  value?: string;
  theme?: 'dark' | 'light';
  accentColor?: string;
  style?: React.CSSProperties;
}

export const FloatLabel: React.FC<FloatLabelProps> = ({
  label = 'Video Title / Topic',
  value = '10 Secrets of Ultra-High Retention Short Form',
  theme = 'light',
  accentColor = '#EA580C',
  style = {},
}) => {
  const frame = useCurrentFrame();
  const isDark = theme === 'dark';

  const chars = Math.min(value.length, Math.floor((frame % 80) / 1.5));
  const currentText = value.slice(0, chars);

  const bgColor = isDark ? '#0F172A' : '#FFFFFF';
  const textColor = isDark ? '#F8FAFC' : '#0F172A';
  const borderColor = isDark ? 'rgba(255,255,255,0.12)' : 'rgba(15,23,42,0.12)';

  return (
    <div
      style={{
        width: 700,
        backgroundColor: 'transparent',
        borderRadius: 28,
        padding: '40px 44px',
        border: 'none',
        boxShadow: isDark ? '0 25px 60px rgba(0,0,0,0.6)' : '0 20px 50px rgba(15,23,42,0.1)',
        fontFamily: 'system-ui, sans-serif',
        boxSizing: 'border-box',
        ...style,
      }}
    >
      <div
        style={{
          position: 'relative',
          padding: '20px 24px',
          borderRadius: 18,
          border: `3px solid ${accentColor}`,
          backgroundColor: isDark ? '#1E293B' : '#F8FAFC',
          boxShadow: `0 8px 24px ${accentColor}25`,
        }}
      >
        {/* Floating Label */}
        <div
          style={{
            position: 'absolute',
            top: -14,
            left: 20,
            backgroundColor: 'transparent',
            padding: '2px 12px',
            borderRadius: 6,
            fontSize: 16,
            fontWeight: 800,
            color: accentColor,
          }}
        >
          {label}
        </div>

        <div style={{ fontSize: 24, fontWeight: 700, color: textColor, whiteSpace: 'nowrap', overflow: 'hidden' }}>
          {currentText}
          <span style={{ color: accentColor, fontWeight: 900 }}>|</span>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// 36. CAROUSEL (3 stacked 3D cards sliding carousel-style with center focus)
// ============================================================================
export interface CarouselProps {
  theme?: 'dark' | 'light';
  accentColor?: string;
  style?: React.CSSProperties;
}

export const Carousel: React.FC<CarouselProps> = ({
  theme = 'light',
  accentColor = '#EA580C',
  style = {},
}) => {
  const frame = useCurrentFrame();
  const isDark = theme === 'dark';

  const cards = [
    { title: 'Intro Hook', color: '#EA580C' },
    { title: 'Visual Explainer', color: '#0284C7' },
    { title: 'Call To Action', color: '#10B981' },
  ];

  const activeIdx = Math.floor(frame / 40) % cards.length;

  const bgColor = isDark ? '#0F172A' : '#FFFFFF';
  const textColor = isDark ? '#F8FAFC' : '#0F172A';
  const borderColor = isDark ? 'rgba(255,255,255,0.12)' : 'rgba(15,23,42,0.12)';

  return (
    <div
      style={{
        width: 680,
        height: 380,
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
        {cards.map((c, idx) => {
          const isActive = idx === activeIdx;
          return (
            <div
              key={idx}
              style={{
                width: isActive ? 240 : 160,
                height: isActive ? 180 : 140,
                borderRadius: 20,
                backgroundColor: c.color,
                color: '#FFFFFF',
                padding: 20,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                transform: isActive ? 'scale(1.05)' : 'scale(0.92)',
                opacity: isActive ? 1 : 0.6,
                boxShadow: isActive ? `0 16px 40px ${c.color}66` : 'none',
                transition: 'all 0.2s ease',
                boxSizing: 'border-box',
              }}
            >
              <div style={{ fontSize: isActive ? 22 : 16, fontWeight: 900 }}>
                {c.title}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
        {cards.map((_, i) => (
          <div
            key={i}
            style={{
              width: i === activeIdx ? 28 : 10,
              height: 10,
              borderRadius: 5,
              backgroundColor: i === activeIdx ? accentColor : '#CBD5E1',
              transition: 'width 0.2s ease',
            }}
          />
        ))}
      </div>
    </div>
  );
};

// ============================================================================
// 37. CONNECTING (Two node endpoints with laser data packets streaming between)
// ============================================================================
export interface ConnectingProps {
  label?: string;
  theme?: 'dark' | 'light';
  accentColor?: string;
  style?: React.CSSProperties;
}

export const Connecting: React.FC<ConnectingProps> = ({
  label = 'Streaming Audio to Groq Whisper V3',
  theme = 'light',
  accentColor = '#0284C7',
  style = {},
}) => {
  const frame = useCurrentFrame();
  const isDark = theme === 'dark';

  const packetPos = (frame % 30) / 30;

  const bgColor = isDark ? '#0F172A' : '#FFFFFF';
  const textColor = isDark ? '#F8FAFC' : '#0F172A';
  const borderColor = isDark ? 'rgba(255,255,255,0.12)' : 'rgba(15,23,42,0.12)';

  return (
    <div
      style={{
        width: 680,
        height: 380,
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
      <div style={{ display: 'flex', alignItems: 'center', width: '80%', position: 'relative' }}>
        {/* Node A */}
        <div style={{ width: 80, height: 80, borderRadius: 24, backgroundColor: '#EA580C', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, zIndex: 2, boxShadow: '0 8px 24px #EA580C55' }}>
          📱
        </div>

        {/* Laser Wire */}
        <div style={{ flex: 1, height: 6, backgroundColor: isDark ? '#334155' : '#E2E8F0', position: 'relative' }}>
          <div
            style={{
              position: 'absolute',
              left: `${packetPos * 100}%`,
              top: -6,
              width: 18,
              height: 18,
              borderRadius: 9,
              backgroundColor: accentColor,
              boxShadow: `0 0 16px ${accentColor}`,
            }}
          />
        </div>

        {/* Node B */}
        <div style={{ width: 80, height: 80, borderRadius: 24, backgroundColor: accentColor, color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, zIndex: 2, boxShadow: `0 8px 24px ${accentColor}55` }}>
          ☁️
        </div>
      </div>

      <div style={{ marginTop: 32, fontSize: 24, fontWeight: 800, color: textColor }}>
        {label}
      </div>
      <div style={{ fontSize: 16, color: isDark ? '#94A3B8' : '#64748B', marginTop: 4, fontWeight: 500 }}>
        Encrypted TLS 1.3 socket connected
      </div>
    </div>
  );
};

// ============================================================================
// 38. UNLOCK (Padlock shackle popping open with golden aura & 'Access Granted')
// ============================================================================
export interface UnlockProps {
  label?: string;
  theme?: 'dark' | 'light';
  accentColor?: string;
  style?: React.CSSProperties;
}

export const Unlock: React.FC<UnlockProps> = ({
  label = 'Pro Studio Features Unlocked',
  theme = 'light',
  accentColor = '#10B981',
  style = {},
}) => {
  const frame = useCurrentFrame();
  const isDark = theme === 'dark';

  const isUnlocked = (frame % 60) > 20;

  const bgColor = isDark ? '#0F172A' : '#FFFFFF';
  const textColor = isDark ? '#F8FAFC' : '#0F172A';
  const borderColor = isDark ? 'rgba(255,255,255,0.12)' : 'rgba(15,23,42,0.12)';

  return (
    <div
      style={{
        width: 620,
        height: 380,
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
          width: 100,
          height: 100,
          borderRadius: 30,
          backgroundColor: isUnlocked ? '#10B98122' : '#EF444422',
          border: `3px solid ${isUnlocked ? accentColor : '#EF4444'}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: isUnlocked ? `0 12px 36px ${accentColor}55` : 'none',
        }}
      >
        <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke={isUnlocked ? accentColor : '#EF4444'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          {isUnlocked ? (
            <>
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 9.9-1" />
            </>
          ) : (
            <>
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </>
          )}
        </svg>
      </div>

      <div style={{ marginTop: 28, fontSize: 26, fontWeight: 900, color: textColor }}>
        {isUnlocked ? label : 'Locked — Plan Upgrade Required'}
      </div>
      <div style={{ fontSize: 17, color: isDark ? '#94A3B8' : '#64748B', marginTop: 4, fontWeight: 500 }}>
        Unlimited 4K renders enabled
      </div>
    </div>
  );
};

// ============================================================================
// 39. TRASH (Animated trash can lid flipping open, document falling in)
// ============================================================================
export interface TrashProps {
  label?: string;
  theme?: 'dark' | 'light';
  accentColor?: string;
  style?: React.CSSProperties;
}

export const Trash: React.FC<TrashProps> = ({
  label = 'Purging Temporary Cache',
  theme = 'light',
  accentColor = '#EF4444',
  style = {},
}) => {
  const frame = useCurrentFrame();
  const isDark = theme === 'dark';

  const lidRot = Math.sin((frame / 20) * Math.PI) * 20;

  const bgColor = isDark ? '#0F172A' : '#FFFFFF';
  const textColor = isDark ? '#F8FAFC' : '#0F172A';
  const borderColor = isDark ? 'rgba(255,255,255,0.12)' : 'rgba(15,23,42,0.12)';

  return (
    <div
      style={{
        width: 600,
        height: 380,
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
      <div style={{ position: 'relative', width: 90, height: 110, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {/* Lid */}
        <div
          style={{
            width: 80,
            height: 14,
            backgroundColor: accentColor,
            borderRadius: 7,
            transformOrigin: 'left center',
            transform: `rotate(${lidRot}deg)`,
            marginBottom: 6,
          }}
        />

        {/* Can Body */}
        <div
          style={{
            width: 70,
            height: 80,
            backgroundColor: isDark ? '#334155' : '#E2E8F0',
            borderRadius: '0 0 16px 16px',
            border: `3px solid ${accentColor}`,
            display: 'flex',
            justifyContent: 'space-around',
            padding: '12px 10px',
            boxSizing: 'border-box',
          }}
        >
          <div style={{ width: 4, height: '100%', backgroundColor: accentColor, borderRadius: 2 }} />
          <div style={{ width: 4, height: '100%', backgroundColor: accentColor, borderRadius: 2 }} />
          <div style={{ width: 4, height: '100%', backgroundColor: accentColor, borderRadius: 2 }} />
        </div>
      </div>

      <div style={{ marginTop: 28, fontSize: 26, fontWeight: 800, color: textColor }}>
        {label}
      </div>
      <div style={{ fontSize: 16, color: isDark ? '#94A3B8' : '#64748B', marginTop: 4, fontWeight: 500 }}>
        1.2 GB disk space reclaimed
      </div>
    </div>
  );
};

// ============================================================================
// 40. COPY (Double clipboard icon clicking & 'Copied to Clipboard!' pill)
// ============================================================================
export interface CopyProps {
  textToCopy?: string;
  theme?: 'dark' | 'light';
  accentColor?: string;
  style?: React.CSSProperties;
}

export const Copy: React.FC<CopyProps> = ({
  textToCopy = 'https://itnavideo.com/share/reel_98124',
  theme = 'light',
  accentColor = '#EA580C',
  style = {},
}) => {
  const frame = useCurrentFrame();
  const isDark = theme === 'dark';

  const isCopied = (frame % 60) > 20;

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
      <div style={{ fontSize: 22, fontWeight: 800, color: textColor, marginBottom: 16 }}>
        Shareable Reel Link
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: isDark ? '#1E293B' : '#F8FAFC',
          border: `2.5px solid ${isDark ? '#334155' : '#E2E8F0'}`,
          borderRadius: 18,
          padding: '16px 24px',
        }}
      >
        <div style={{ fontSize: 20, color: isDark ? '#94A3B8' : '#475569', fontFamily: 'monospace' }}>
          {textToCopy}
        </div>

        <div
          style={{
            padding: '12px 24px',
            borderRadius: 14,
            backgroundColor: isCopied ? '#10B981' : accentColor,
            color: '#FFFFFF',
            fontWeight: 800,
            fontSize: 18,
            boxShadow: `0 6px 18px ${isCopied ? '#10B981' : accentColor}55`,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}
        >
          {isCopied ? '✓ Copied!' : 'Copy Link'}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// 41. DAY / NIGHT (Giant toggle switch sliding between glowing sun and crescent moon)
// ============================================================================
export interface DayNightProps {
  theme?: 'dark' | 'light';
  accentColor?: string;
  style?: React.CSSProperties;
}

export const DayNight: React.FC<DayNightProps> = ({
  theme = 'light',
  accentColor = '#EA580C',
  style = {},
}) => {
  const frame = useCurrentFrame();
  const isNight = (Math.floor(frame / 60) % 2) === 1;

  const sliderX = isNight ? 100 : 0;

  return (
    <div
      style={{
        width: 640,
        height: 380,
        backgroundColor: isNight ? '#0F172A' : '#FFFFFF',
        borderRadius: 32,
        padding: 40,
        border: `3px solid ${isNight ? 'rgba(255,255,255,0.15)' : 'rgba(15,23,42,0.12)'}`,
        boxShadow: isNight ? '0 25px 60px rgba(0,0,0,0.8)' : '0 20px 50px rgba(15,23,42,0.1)',
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
          width: 200,
          height: 100,
          borderRadius: 50,
          backgroundColor: isNight ? '#1E293B' : '#E0F2FE',
          border: `4px solid ${isNight ? '#38BDF8' : '#F59E0B'}`,
          padding: 8,
          boxSizing: 'border-box',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            width: 76,
            height: 76,
            borderRadius: 38,
            backgroundColor: isNight ? '#38BDF8' : '#F59E0B',
            boxShadow: `0 0 25px ${isNight ? '#38BDF8' : '#F59E0B'}`,
            transform: `translateX(${sliderX}px)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 38,
            transition: 'transform 0.3s ease',
          }}
        >
          {isNight ? '🌙' : '☀️'}
        </div>
      </div>

      <div style={{ marginTop: 28, fontSize: 28, fontWeight: 900, color: isNight ? '#FFFFFF' : '#0F172A' }}>
        {isNight ? 'Dark Studio Mode' : 'Light Canvas Mode'}
      </div>
      <div style={{ fontSize: 17, color: isNight ? '#94A3B8' : '#64748B', marginTop: 4, fontWeight: 500 }}>
        Seamless theme switcher
      </div>
    </div>
  );
};

// ============================================================================
// 42. BAR CHART (Video-scale 5-column video bar graph with glowing 3D rounded bars)
// ============================================================================
export interface VideoBarChartProps {
  title?: string;
  theme?: 'dark' | 'light';
  accentColor?: string;
  style?: React.CSSProperties;
}

export const VideoBarChart: React.FC<VideoBarChartProps> = ({
  title = 'Weekly Viewer Retention Rate (%)',
  theme = 'light',
  accentColor = '#EA580C',
  style = {},
}) => {
  const frame = useCurrentFrame();
  const isDark = theme === 'dark';

  const bars = [
    { label: 'Mon', value: 65 },
    { label: 'Tue', value: 82 },
    { label: 'Wed', value: 74 },
    { label: 'Thu', value: 95 },
    { label: 'Fri', value: 88 },
  ];

  const anim = Math.min(1, (frame % 60) / 30);

  const bgColor = isDark ? '#0F172A' : '#FFFFFF';
  const textColor = isDark ? '#F8FAFC' : '#0F172A';
  const borderColor = isDark ? 'rgba(255,255,255,0.12)' : 'rgba(15,23,42,0.12)';

  return (
    <div
      style={{
        width: 720,
        backgroundColor: 'transparent',
        borderRadius: 32,
        padding: '36px 44px',
        border: 'none',
        boxShadow: isDark ? '0 25px 60px rgba(0,0,0,0.6)' : '0 20px 50px rgba(15,23,42,0.1)',
        fontFamily: 'system-ui, sans-serif',
        boxSizing: 'border-box',
        ...style,
      }}
    >
      <div style={{ fontSize: 26, fontWeight: 800, color: textColor, marginBottom: 28 }}>
        {title}
      </div>

      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: 180, borderBottom: `2px solid ${isDark ? '#334155' : '#E2E8F0'}`, paddingBottom: 12 }}>
        {bars.map((b, i) => {
          const barH = b.value * anim * 1.6;
          return (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
              <div style={{ fontSize: 16, fontWeight: 800, color: accentColor, fontFamily: 'monospace' }}>
                {Math.round(b.value * anim)}%
              </div>
              <div
                style={{
                  width: 56,
                  height: barH,
                  borderRadius: '14px 14px 4px 4px',
                  background: `linear-gradient(180deg, ${accentColor}, #FB923C)`,
                  boxShadow: `0 6px 20px ${accentColor}55`,
                }}
              />
              <div style={{ fontSize: 16, fontWeight: 700, color: isDark ? '#94A3B8' : '#64748B' }}>
                {b.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

