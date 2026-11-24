import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

// ============================================================================
// 1. TOGGLE (Video-scale animated iOS/Material switch with glowing track & haptic bounce)
// ============================================================================
export interface ToggleProps {
  label?: string;
  sublabel?: string;
  theme?: 'dark' | 'light';
  accentColor?: string;
  style?: React.CSSProperties;
}

export const Toggle: React.FC<ToggleProps> = ({
  label = 'Real-Time Sync',
  sublabel = 'Cloud video rendering & auto-captioning',
  theme = 'light',
  accentColor = '#EA580C',
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const isDark = theme === 'dark';

  const cycle = Math.floor(frame / 60);
  const cycleFrame = frame % 60;
  const isOn = cycle % 2 === 0;

  const toggleSpring = spring({
    frame: cycleFrame,
    fps,
    config: { damping: 14, stiffness: 180 },
  });

  const position = isOn ? toggleSpring : 1 - toggleSpring;

  const bgColor = isDark ? '#0F172A' : '#FFFFFF';
  const textColor = isDark ? '#F8FAFC' : '#0F172A';
  const subColor = isDark ? '#94A3B8' : '#64748B';
  const borderColor = isDark ? 'rgba(255,255,255,0.12)' : 'rgba(15,23,42,0.12)';

  return (
    <div
      style={{
        width: 680,
        backgroundColor: 'transparent',
        borderRadius: 28,
        padding: '32px 40px',
        border: 'none',
        boxShadow: isDark
          ? '0 25px 60px -15px rgba(0,0,0,0.6), 0 0 40px rgba(234,88,12,0.15)'
          : '0 25px 60px -15px rgba(15,23,42,0.1), 0 10px 25px rgba(0,0,0,0.05)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        boxSizing: 'border-box',
        ...style,
      }}
    >
      <div>
        <div style={{ fontSize: 32, fontWeight: 800, color: textColor, letterSpacing: '-0.02em', marginBottom: 8 }}>
          {label}
        </div>
        <div style={{ fontSize: 20, color: subColor, fontWeight: 500 }}>
          {sublabel}
        </div>
      </div>

      <div
        style={{
          width: 140,
          height: 76,
          borderRadius: 38,
          backgroundColor: position > 0.5 ? accentColor : isDark ? '#334155' : '#CBD5E1',
          padding: 8,
          display: 'flex',
          alignItems: 'center',
          boxSizing: 'border-box',
          position: 'relative',
          boxShadow: position > 0.5 ? `0 0 30px ${accentColor}88 inset, 0 8px 24px ${accentColor}44` : 'none',
          transition: 'background-color 0.2s ease',
        }}
      >
        <div
          style={{
            width: 60,
            height: 60,
            borderRadius: 30,
            backgroundColor: '#FFFFFF',
            boxShadow: '0 6px 18px rgba(0,0,0,0.25)',
            transform: `translateX(${position * (140 - 76)}px)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {position > 0.5 ? (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          ) : (
            <div style={{ width: 14, height: 14, borderRadius: 7, backgroundColor: '#94A3B8' }} />
          )}
        </div>
      </div>
    </div>
  );
};
export const MotionToggle = Toggle;

// ============================================================================
// 2. LIKE BURST (Giant heart with spring scale, particle confetti explosion & counter)
// ============================================================================
export interface LikeBurstProps {
  initialCount?: number;
  theme?: 'dark' | 'light';
  accentColor?: string;
  style?: React.CSSProperties;
}

export const LikeBurst: React.FC<LikeBurstProps> = ({
  initialCount = 84200,
  theme = 'light',
  accentColor = '#EF4444',
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const isDark = theme === 'dark';

  const loopFrame = frame % 75;
  const isPopped = loopFrame > 15;

  const popSpring = spring({
    frame: Math.max(0, loopFrame - 15),
    fps,
    config: { damping: 10, stiffness: 220 },
  });

  const heartScale = isPopped ? interpolate(popSpring, [0, 0.4, 1], [0.8, 1.4, 1.1]) : 1.0;
  const count = initialCount + (isPopped ? 1 : 0);

  const particles = Array.from({ length: 12 }).map((_, i) => {
    const angle = (i * 30 * Math.PI) / 180;
    const distance = isPopped ? interpolate(popSpring, [0, 1], [0, 140]) : 0;
    const opacity = isPopped ? interpolate(popSpring, [0, 0.7, 1], [1, 0.9, 0]) : 0;
    const size = isPopped ? interpolate(popSpring, [0, 1], [16, 6]) : 0;
    return {
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance,
      opacity,
      size,
      color: i % 2 === 0 ? accentColor : '#F59E0B',
    };
  });

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
        position: 'relative',
        boxSizing: 'border-box',
        ...style,
      }}
    >
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {particles.map((p, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: p.size,
              height: p.size,
              borderRadius: p.size / 2,
              backgroundColor: p.color,
              transform: `translate(${p.x}px, ${p.y}px)`,
              opacity: p.opacity,
            }}
          />
        ))}

        <div
          style={{
            transform: `scale(${heartScale})`,
            cursor: 'pointer',
            filter: isPopped ? `drop-shadow(0 12px 28px ${accentColor}66)` : 'none',
          }}
        >
          <svg width="120" height="120" viewBox="0 0 24 24" fill={isPopped ? accentColor : 'none'} stroke={accentColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </div>
      </div>

      <div style={{ marginTop: 28, fontSize: 36, fontWeight: 900, color: textColor, letterSpacing: '-0.02em' }}>
        {count.toLocaleString()} Likes
      </div>
      <div style={{ fontSize: 18, color: isDark ? '#94A3B8' : '#64748B', fontWeight: 600, marginTop: 4 }}>
        Double tap to inspire
      </div>
    </div>
  );
};

// ============================================================================
// 3. SPINNER (Thick multi-orbit glowing broadcast loader)
// ============================================================================
export interface SpinnerProps {
  label?: string;
  theme?: 'dark' | 'light';
  accentColor?: string;
  style?: React.CSSProperties;
}

export const Spinner: React.FC<SpinnerProps> = ({
  label = 'Processing Video Buffers...',
  theme = 'light',
  accentColor = '#EA580C',
  style = {},
}) => {
  const frame = useCurrentFrame();
  const isDark = theme === 'dark';

  const rot1 = (frame * 6) % 360;
  const rot2 = (-frame * 4) % 360;

  const bgColor = isDark ? '#0F172A' : '#FFFFFF';
  const textColor = isDark ? '#F8FAFC' : '#0F172A';
  const borderColor = isDark ? 'rgba(255,255,255,0.12)' : 'rgba(15,23,42,0.12)';

  return (
    <div
      style={{
        width: 580,
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
      <div style={{ position: 'relative', width: 140, height: 140, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div
          style={{
            position: 'absolute',
            width: 130,
            height: 130,
            borderRadius: '50%',
            border: `6px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(15,23,42,0.08)'}`,
            borderTopColor: accentColor,
            borderRightColor: accentColor,
            transform: `rotate(${rot1}deg)`,
            boxShadow: `0 0 25px ${accentColor}55`,
          }}
        />

        <div
          style={{
            position: 'absolute',
            width: 86,
            height: 86,
            borderRadius: '50%',
            border: `5px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(15,23,42,0.06)'}`,
            borderBottomColor: '#38BDF8',
            transform: `rotate(${rot2}deg)`,
          }}
        />

        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: '50%',
            backgroundColor: accentColor,
            boxShadow: `0 0 20px ${accentColor}`,
          }}
        />
      </div>

      <div style={{ marginTop: 32, fontSize: 24, fontWeight: 700, color: textColor, letterSpacing: '-0.01em' }}>
        {label}
      </div>
      <div style={{ fontSize: 16, color: isDark ? '#94A3B8' : '#64748B', marginTop: 6, fontWeight: 500 }}>
        Render thread running at 60 FPS
      </div>
    </div>
  );
};
export const VideoSpinner = Spinner;

// ============================================================================
// 4. PROGRESS BAR (Video-scale thick segmented progress bar with dynamic %)
// ============================================================================
export interface ProgressBarProps {
  title?: string;
  theme?: 'dark' | 'light';
  accentColor?: string;
  style?: React.CSSProperties;
}

export const UiProgressBar: React.FC<ProgressBarProps> = ({
  title = 'Transcribing Audio Track',
  theme = 'light',
  accentColor = '#EA580C',
  style = {},
}) => {
  const frame = useCurrentFrame();
  const isDark = theme === 'dark';

  const progress = Math.min(100, Math.round(((frame % 90) / 90) * 100));

  const bgColor = isDark ? '#0F172A' : '#FFFFFF';
  const textColor = isDark ? '#F8FAFC' : '#0F172A';
  const borderColor = isDark ? 'rgba(255,255,255,0.12)' : 'rgba(15,23,42,0.12)';

  return (
    <div
      style={{
        width: 720,
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div style={{ fontSize: 28, fontWeight: 800, color: textColor }}>
          {title}
        </div>
        <div style={{ fontSize: 32, fontWeight: 900, color: accentColor, fontFamily: 'monospace' }}>
          {progress}%
        </div>
      </div>

      <div
        style={{
          width: '100%',
          height: 28,
          backgroundColor: isDark ? '#1E293B' : '#E2E8F0',
          borderRadius: 14,
          overflow: 'hidden',
          padding: 4,
          boxSizing: 'border-box',
          position: 'relative',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${progress}%`,
            borderRadius: 10,
            background: `linear-gradient(90deg, ${accentColor}, #F97316)`,
            boxShadow: `0 0 20px ${accentColor}88`,
            transition: 'width 0.1s linear',
          }}
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16, fontSize: 16, color: isDark ? '#94A3B8' : '#64748B', fontWeight: 600 }}>
        <span>1,420 words detected</span>
        <span>ETA: ~12s remaining</span>
      </div>
    </div>
  );
};
export const MotionProgressBar = UiProgressBar;

// ============================================================================
// 5. CHECKBOX (Video-scale interactive checkmark with bounce & strikethrough text)
// ============================================================================
export interface CheckboxProps {
  label?: string;
  theme?: 'dark' | 'light';
  accentColor?: string;
  style?: React.CSSProperties;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  label = 'Color Grade & Subtitle Sync Complete',
  theme = 'light',
  accentColor = '#10B981',
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const isDark = theme === 'dark';

  const isChecked = (frame % 70) > 20;
  const checkSpring = spring({
    frame: Math.max(0, (frame % 70) - 20),
    fps,
    config: { damping: 12, stiffness: 200 },
  });

  const bgColor = isDark ? '#0F172A' : '#FFFFFF';
  const textColor = isDark ? '#F8FAFC' : '#0F172A';
  const borderColor = isDark ? 'rgba(255,255,255,0.12)' : 'rgba(15,23,42,0.12)';

  return (
    <div
      style={{
        width: 680,
        backgroundColor: 'transparent',
        borderRadius: 24,
        padding: '30px 36px',
        border: 'none',
        boxShadow: isDark ? '0 25px 60px rgba(0,0,0,0.6)' : '0 20px 50px rgba(15,23,42,0.1)',
        display: 'flex',
        alignItems: 'center',
        gap: 28,
        fontFamily: 'system-ui, sans-serif',
        boxSizing: 'border-box',
        ...style,
      }}
    >
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: 18,
          backgroundColor: isChecked ? accentColor : isDark ? '#1E293B' : '#F1F5F9',
          border: `3.5px solid ${isChecked ? accentColor : isDark ? '#475569' : '#CBD5E1'}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          boxShadow: isChecked ? `0 8px 25px ${accentColor}66` : 'none',
          transform: isChecked ? `scale(${interpolate(checkSpring, [0, 0.5, 1], [0.8, 1.2, 1])})` : 'scale(1)',
        }}
      >
        {isChecked && (
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
      </div>

      <div style={{ flex: 1 }}>
        <div
          style={{
            fontSize: 26,
            fontWeight: 800,
            color: isChecked && !isDark ? '#475569' : textColor,
            textDecoration: isChecked ? 'line-through' : 'none',
            opacity: isChecked ? 0.8 : 1,
          }}
        >
          {label}
        </div>
        <div style={{ fontSize: 17, color: isDark ? '#94A3B8' : '#64748B', marginTop: 4, fontWeight: 500 }}>
          {isChecked ? 'Export verified with 0 warnings' : 'Pending automated quality check'}
        </div>
      </div>
    </div>
  );
};
export const MotionCheckbox = Checkbox;

// ============================================================================
// 6. RADIO GROUP (Video-scale segmented audio format selector with sliding bubble)
// ============================================================================
export interface RadioGroupProps {
  title?: string;
  options?: string[];
  theme?: 'dark' | 'light';
  accentColor?: string;
  style?: React.CSSProperties;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  title = 'Select Render Format',
  options = ['16:9 YouTube', '9:16 Shorts', '1:1 Square'],
  theme = 'light',
  accentColor = '#EA580C',
  style = {},
}) => {
  const frame = useCurrentFrame();
  const isDark = theme === 'dark';

  const activeIndex = Math.floor(frame / 45) % options.length;

  const bgColor = isDark ? '#0F172A' : '#FFFFFF';
  const textColor = isDark ? '#F8FAFC' : '#0F172A';
  const borderColor = isDark ? 'rgba(255,255,255,0.12)' : 'rgba(15,23,42,0.12)';

  return (
    <div
      style={{
        width: 700,
        backgroundColor: 'transparent',
        borderRadius: 28,
        padding: '32px 38px',
        border: 'none',
        boxShadow: isDark ? '0 25px 60px rgba(0,0,0,0.6)' : '0 20px 50px rgba(15,23,42,0.1)',
        fontFamily: 'system-ui, sans-serif',
        boxSizing: 'border-box',
        ...style,
      }}
    >
      <div style={{ fontSize: 26, fontWeight: 800, color: textColor, marginBottom: 22 }}>
        {title}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {options.map((opt, idx) => {
          const selected = idx === activeIndex;
          return (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '18px 24px',
                borderRadius: 18,
                backgroundColor: selected ? (isDark ? '#1E293B' : '#FFF7ED') : (isDark ? 'transparent' : '#F8FAFC'),
                border: `2.5px solid ${selected ? accentColor : isDark ? '#334155' : '#E2E8F0'}`,
                boxShadow: selected ? `0 8px 24px ${accentColor}25` : 'none',
                gap: 20,
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  border: `3px solid ${selected ? accentColor : '#94A3B8'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {selected && (
                  <div
                    style={{
                      width: 16,
                      height: 16,
                      borderRadius: 8,
                      backgroundColor: accentColor,
                    }}
                  />
                )}
              </div>

              <div style={{ fontSize: 22, fontWeight: 700, color: selected ? (isDark ? '#FFFFFF' : '#9A3412') : textColor }}>
                {opt}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export const MotionRadioGroup = RadioGroup;

// ============================================================================
// 7. DOWNLOAD (Video-scale arrow dropping into tray with animated transfer bar)
// ============================================================================
export interface DownloadProps {
  fileName?: string;
  theme?: 'dark' | 'light';
  accentColor?: string;
  style?: React.CSSProperties;
}

export const Download: React.FC<DownloadProps> = ({
  fileName = 'itnavideo_4k_export.mp4',
  theme = 'light',
  accentColor = '#0284C7',
  style = {},
}) => {
  const frame = useCurrentFrame();
  const isDark = theme === 'dark';

  const loop = frame % 80;
  const arrowY = loop < 40 ? (loop / 40) * 16 : 0;
  const progress = Math.min(100, Math.round((loop / 60) * 100));

  const bgColor = isDark ? '#0F172A' : '#FFFFFF';
  const textColor = isDark ? '#F8FAFC' : '#0F172A';
  const borderColor = isDark ? 'rgba(255,255,255,0.12)' : 'rgba(15,23,42,0.12)';

  return (
    <div
      style={{
        width: 660,
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
      <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 24 }}>
        <div
          style={{
            width: 76,
            height: 76,
            borderRadius: 22,
            backgroundColor: isDark ? '#0369A122' : '#E0F2FE',
            border: `2px solid ${accentColor}55`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ transform: `translateY(${arrowY}px)` }}>
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
        </div>

        <div>
          <div style={{ fontSize: 26, fontWeight: 800, color: textColor }}>
            {fileName}
          </div>
          <div style={{ fontSize: 17, color: isDark ? '#94A3B8' : '#64748B', marginTop: 4, fontWeight: 500 }}>
            ProRes 422 • 142.8 MB • Fast Cloud CDN
          </div>
        </div>
      </div>

      <div style={{ width: '100%', height: 16, backgroundColor: isDark ? '#1E293B' : '#E2E8F0', borderRadius: 8, overflow: 'hidden' }}>
        <div style={{ width: `${progress}%`, height: '100%', backgroundColor: accentColor, borderRadius: 8 }} />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12, fontSize: 16, color: accentColor, fontWeight: 700 }}>
        <span>Downloading...</span>
        <span>{progress}%</span>
      </div>
    </div>
  );
};
export const DownloadAction = Download;

// ============================================================================
// 8. UPLOAD (Video-scale cloud upload with pulsing beams & transfer status)
// ============================================================================
export interface UploadProps {
  label?: string;
  theme?: 'dark' | 'light';
  accentColor?: string;
  style?: React.CSSProperties;
}

export const Upload: React.FC<UploadProps> = ({
  label = 'Uploading Source Audio Deck',
  theme = 'light',
  accentColor = '#7C3AED',
  style = {},
}) => {
  const frame = useCurrentFrame();
  const isDark = theme === 'dark';

  const bounce = Math.sin((frame / 30) * Math.PI * 2) * 8;

  const bgColor = isDark ? '#0F172A' : '#FFFFFF';
  const textColor = isDark ? '#F8FAFC' : '#0F172A';
  const borderColor = isDark ? 'rgba(255,255,255,0.12)' : 'rgba(15,23,42,0.12)';

  return (
    <div
      style={{
        width: 640,
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
          width: 110,
          height: 110,
          borderRadius: 32,
          backgroundColor: isDark ? '#4C1D9533' : '#F5F3FF',
          border: `3px solid ${accentColor}55`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: `0 12px 30px ${accentColor}33`,
          transform: `translateY(${bounce}px)`,
        }}
      >
        <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="16 16 12 12 8 16" />
          <line x1="12" y1="12" x2="12" y2="21" />
          <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
        </svg>
      </div>

      <div style={{ marginTop: 28, fontSize: 26, fontWeight: 800, color: textColor }}>
        {label}
      </div>
      <div style={{ fontSize: 17, color: isDark ? '#94A3B8' : '#64748B', marginTop: 6, fontWeight: 500 }}>
        Direct binary streaming to secure AWS S3 bucket
      </div>
    </div>
  );
};
export const UploadAction = Upload;

// ============================================================================
// 9. OPEN FOLDER (3D isometric animated folder opening with docs sliding out)
// ============================================================================
export interface OpenFolderProps {
  folderName?: string;
  fileCount?: number;
  theme?: 'dark' | 'light';
  accentColor?: string;
  style?: React.CSSProperties;
}

export const OpenFolder: React.FC<OpenFolderProps> = ({
  folderName = 'Video Assets & B-Roll',
  fileCount = 38,
  theme = 'light',
  accentColor = '#EA580C',
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const isDark = theme === 'dark';

  const folderSpring = spring({
    frame: frame % 60,
    fps,
    config: { damping: 14, stiffness: 140 },
  });

  const flapAngle = interpolate(folderSpring, [0, 1], [0, -32]);
  const docOffset = interpolate(folderSpring, [0, 1], [0, -42]);

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
      <div style={{ position: 'relative', width: 140, height: 110 }}>
        <div
          style={{
            position: 'absolute',
            left: 20,
            top: 15,
            width: 100,
            height: 70,
            backgroundColor: isDark ? '#334155' : '#F1F5F9',
            borderRadius: 10,
            border: '2px solid rgba(0,0,0,0.1)',
            transform: `translateY(${docOffset}px)`,
            boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
            padding: 8,
            boxSizing: 'border-box',
          }}
        >
          <div style={{ width: 40, height: 6, backgroundColor: accentColor, borderRadius: 3, marginBottom: 6 }} />
          <div style={{ width: 70, height: 4, backgroundColor: '#94A3B8', borderRadius: 2, marginBottom: 4 }} />
          <div style={{ width: 55, height: 4, backgroundColor: '#94A3B8', borderRadius: 2 }} />
        </div>

        <div
          style={{
            position: 'absolute',
            bottom: 0,
            width: 140,
            height: 90,
            backgroundColor: '#D97706',
            borderRadius: 16,
          }}
        />

        <div
          style={{
            position: 'absolute',
            bottom: 0,
            width: 140,
            height: 80,
            backgroundColor: '#F59E0B',
            borderRadius: '0 0 16px 16px',
            transformOrigin: 'bottom center',
            transform: `perspective(600px) rotateX(${flapAngle}deg)`,
            boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
          }}
        />
      </div>

      <div style={{ marginTop: 32, fontSize: 26, fontWeight: 800, color: textColor }}>
        {folderName}
      </div>
      <div style={{ fontSize: 17, color: isDark ? '#94A3B8' : '#64748B', marginTop: 4, fontWeight: 500 }}>
        {fileCount} high-res clips categorized
      </div>
    </div>
  );
};

// ============================================================================
// 10. DOC PREVIEW (Video-scale document sheet with animated page flip & stamp)
// ============================================================================
export interface DocPreviewProps {
  title?: string;
  subtitle?: string;
  theme?: 'dark' | 'light';
  accentColor?: string;
  style?: React.CSSProperties;
}

export const DocPreview: React.FC<DocPreviewProps> = ({
  title = 'AI Video Script Blueprint',
  subtitle = 'Retention optimized • 16:9 Landscape',
  theme = 'light',
  accentColor = '#EA580C',
  style = {},
}) => {
  const frame = useCurrentFrame();
  const isDark = theme === 'dark';

  const stampScale = Math.min(1, Math.max(0, (frame % 80 - 15) / 10));

  const bgColor = isDark ? '#0F172A' : '#FFFFFF';
  const textColor = isDark ? '#F8FAFC' : '#0F172A';
  const borderColor = isDark ? 'rgba(255,255,255,0.12)' : 'rgba(15,23,42,0.12)';

  return (
    <div
      style={{
        width: 600,
        backgroundColor: 'transparent',
        borderRadius: 28,
        padding: '36px 40px',
        border: 'none',
        boxShadow: isDark ? '0 25px 60px rgba(0,0,0,0.6)' : '0 20px 50px rgba(15,23,42,0.1)',
        fontFamily: 'system-ui, sans-serif',
        position: 'relative',
        boxSizing: 'border-box',
        ...style,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
        <div>
          <div style={{ fontSize: 26, fontWeight: 800, color: textColor }}>{title}</div>
          <div style={{ fontSize: 16, color: isDark ? '#94A3B8' : '#64748B', marginTop: 4, fontWeight: 500 }}>{subtitle}</div>
        </div>

        <div
          style={{
            border: `3px solid ${accentColor}`,
            color: accentColor,
            padding: '6px 14px',
            borderRadius: 10,
            fontSize: 14,
            fontWeight: 900,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            transform: `rotate(-8deg) scale(${stampScale})`,
            boxShadow: `0 4px 14px ${accentColor}33`,
          }}
        >
          APPROVED
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 24 }}>
        <div style={{ width: '92%', height: 10, backgroundColor: isDark ? '#334155' : '#E2E8F0', borderRadius: 5 }} />
        <div style={{ width: '84%', height: 10, backgroundColor: isDark ? '#334155' : '#E2E8F0', borderRadius: 5 }} />
        <div style={{ width: '70%', height: 10, backgroundColor: isDark ? '#334155' : '#E2E8F0', borderRadius: 5 }} />
      </div>
    </div>
  );
};
