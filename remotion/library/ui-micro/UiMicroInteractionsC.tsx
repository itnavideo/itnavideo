import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

// ============================================================================
// 21. RIPPLE TAP (Expanding concentric shockwave rings with tactile click bounce)
// ============================================================================
export interface RippleTapProps {
  label?: string;
  theme?: 'dark' | 'light';
  accentColor?: string;
  style?: React.CSSProperties;
}

export const RippleTap: React.FC<RippleTapProps> = ({
  label = 'Instant Tap Interaction',
  theme = 'light',
  accentColor = '#EA580C',
  style = {},
}) => {
  const frame = useCurrentFrame();
  const isDark = theme === 'dark';

  const loop = frame % 50;
  const ripple1 = (loop / 50) * 160;
  const ripple2 = Math.max(0, ((loop - 15) / 50) * 160);
  const op1 = interpolate(loop, [0, 30, 50], [0.8, 0.4, 0]);
  const op2 = interpolate(loop, [15, 35, 50], [0.8, 0.4, 0]);

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
      <div style={{ position: 'relative', width: 180, height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {/* Shockwave Rings */}
        <div
          style={{
            position: 'absolute',
            width: ripple1 * 2,
            height: ripple1 * 2,
            borderRadius: '50%',
            border: `3px solid ${accentColor}`,
            opacity: op1,
          }}
        />
        {loop > 15 && (
          <div
            style={{
              position: 'absolute',
              width: ripple2 * 2,
              height: ripple2 * 2,
              borderRadius: '50%',
              border: `3px solid ${accentColor}`,
              opacity: op2,
            }}
          />
        )}

        {/* Center Tap Button */}
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: accentColor,
            boxShadow: `0 8px 30px ${accentColor}88`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transform: loop < 10 ? 'scale(0.88)' : 'scale(1)',
            transition: 'transform 0.1s ease',
          }}
        >
          <div style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: '#FFFFFF' }} />
        </div>
      </div>

      <div style={{ marginTop: 24, fontSize: 26, fontWeight: 800, color: textColor }}>
        {label}
      </div>
      <div style={{ fontSize: 16, color: isDark ? '#94A3B8' : '#64748B', marginTop: 4, fontWeight: 500 }}>
        Haptic wave feedback
      </div>
    </div>
  );
};

// ============================================================================
// 22. ACCORDION (Video-scale FAQ card expanding downward with chevron rotation)
// ============================================================================
export interface AccordionProps {
  question?: string;
  answer?: string;
  theme?: 'dark' | 'light';
  accentColor?: string;
  style?: React.CSSProperties;
}

export const Accordion: React.FC<AccordionProps> = ({
  question = 'How does Itnavideo render 4K video at 60 FPS in cloud?',
  answer = 'We shard your Remotion composition across parallel AWS Lambda Chromium workers, encoding frames simultaneously and merging them in under 90 seconds.',
  theme = 'light',
  accentColor = '#EA580C',
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const isDark = theme === 'dark';

  const isOpen = (Math.floor(frame / 60) % 2) === 1;
  const openSpring = spring({
    frame: frame % 60,
    fps,
    config: { damping: 14, stiffness: 160 },
  });

  const progress = isOpen ? openSpring : 1 - openSpring;
  const chevronRot = interpolate(progress, [0, 1], [0, 180]);
  const contentHeight = interpolate(progress, [0, 1], [0, 96]);

  const bgColor = isDark ? '#0F172A' : '#FFFFFF';
  const textColor = isDark ? '#F8FAFC' : '#0F172A';
  const borderColor = isDark ? 'rgba(255,255,255,0.12)' : 'rgba(15,23,42,0.12)';

  return (
    <div
      style={{
        width: 720,
        backgroundColor: 'transparent',
        borderRadius: 28,
        padding: '32px 38px',
        border: 'none',
        boxShadow: isDark ? '0 25px 60px rgba(0,0,0,0.6)' : '0 20px 50px rgba(15,23,42,0.1)',
        fontFamily: 'system-ui, sans-serif',
        boxSizing: 'border-box',
        overflow: 'hidden',
        ...style,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: 24, fontWeight: 800, color: textColor, paddingRight: 20 }}>
          {question}
        </div>
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 24,
            backgroundColor: isDark ? '#1E293B' : '#F1F5F9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transform: `rotate(${chevronRot}deg)`,
            flexShrink: 0,
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </div>

      <div style={{ height: contentHeight, overflow: 'hidden', opacity: progress }}>
        <div style={{ paddingTop: 20, fontSize: 18, lineHeight: 1.6, color: isDark ? '#94A3B8' : '#475569', fontWeight: 500 }}>
          {answer}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// 23. MODAL POP (Bold central dialog card popping in with spring scale & CTAs)
// ============================================================================
export interface ModalPopProps {
  title?: string;
  desc?: string;
  theme?: 'dark' | 'light';
  accentColor?: string;
  style?: React.CSSProperties;
}

export const ModalPop: React.FC<ModalPopProps> = ({
  title = 'Export Video Project?',
  desc = 'Your 1080p widescreen reel will be processed with ultra-sharp kinetic subtitles.',
  theme = 'light',
  accentColor = '#EA580C',
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const isDark = theme === 'dark';

  const popSpring = spring({
    frame: frame % 70,
    fps,
    config: { damping: 12, stiffness: 180 },
  });

  const bgColor = isDark ? '#0F172A' : '#FFFFFF';
  const textColor = isDark ? '#F8FAFC' : '#0F172A';
  const borderColor = isDark ? 'rgba(255,255,255,0.12)' : 'rgba(15,23,42,0.12)';

  return (
    <div
      style={{
        width: 660,
        backgroundColor: 'transparent',
        borderRadius: 32,
        padding: '40px 44px',
        border: 'none',
        boxShadow: isDark ? '0 30px 80px rgba(0,0,0,0.7)' : '0 25px 60px rgba(15,23,42,0.15)',
        transform: `scale(${popSpring})`,
        fontFamily: 'system-ui, sans-serif',
        textAlign: 'center',
        boxSizing: 'border-box',
        ...style,
      }}
    >
      <div
        style={{
          width: 80,
          height: 80,
          borderRadius: 24,
          backgroundColor: isDark ? '#7C2D1233' : '#FFEDD5',
          border: `2px solid ${accentColor}55`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 20px',
          fontSize: 36,
        }}
      >
        🚀
      </div>

      <div style={{ fontSize: 30, fontWeight: 900, color: textColor, letterSpacing: '-0.02em' }}>
        {title}
      </div>
      <div style={{ fontSize: 18, color: isDark ? '#94A3B8' : '#64748B', marginTop: 10, lineHeight: 1.5, fontWeight: 500 }}>
        {desc}
      </div>

      <div style={{ display: 'flex', gap: 16, marginTop: 32 }}>
        <div style={{ flex: 1, padding: '18px 0', borderRadius: 16, backgroundColor: isDark ? '#1E293B' : '#F1F5F9', color: isDark ? '#FFFFFF' : '#475569', fontWeight: 800, fontSize: 19 }}>
          Cancel
        </div>
        <div style={{ flex: 1, padding: '18px 0', borderRadius: 16, backgroundColor: accentColor, color: '#FFFFFF', fontWeight: 800, fontSize: 19, boxShadow: `0 8px 24px ${accentColor}66` }}>
          Confirm Render
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// 24. TOAST (High-contrast status toast popping in with status glow & check)
// ============================================================================
export interface ToastProps {
  message?: string;
  theme?: 'dark' | 'light';
  accentColor?: string;
  style?: React.CSSProperties;
}

export const Toast: React.FC<ToastProps> = ({
  message = 'Changes Saved Successfully to Cloud',
  theme = 'light',
  accentColor = '#10B981',
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const isDark = theme === 'dark';

  const toastSpring = spring({
    frame: frame % 60,
    fps,
    config: { damping: 14, stiffness: 200 },
  });

  const bgColor = isDark ? '#0F172A' : '#FFFFFF';
  const textColor = isDark ? '#F8FAFC' : '#0F172A';
  const borderColor = isDark ? 'rgba(255,255,255,0.12)' : 'rgba(15,23,42,0.12)';

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 20,
        backgroundColor: 'transparent',
        padding: '20px 32px',
        borderRadius: 24,
        border: 'none',
        boxShadow: isDark ? '0 20px 50px rgba(0,0,0,0.6)' : '0 15px 40px rgba(15,23,42,0.12)',
        transform: `translateY(${(1 - toastSpring) * 30}px) scale(${toastSpring})`,
        opacity: toastSpring,
        fontFamily: 'system-ui, sans-serif',
        boxSizing: 'border-box',
        ...style,
      }}
    >
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 22,
          backgroundColor: accentColor,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: `0 6px 18px ${accentColor}66`,
        }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>

      <div style={{ fontSize: 22, fontWeight: 800, color: textColor }}>
        {message}
      </div>
    </div>
  );
};

// ============================================================================
// 25. AVATAR STACK (Overlapping animated creator avatars expanding outwards)
// ============================================================================
export interface AvatarStackProps {
  label?: string;
  theme?: 'dark' | 'light';
  accentColor?: string;
  style?: React.CSSProperties;
}

export const AvatarStack: React.FC<AvatarStackProps> = ({
  label = 'Trusted by 10,000+ Viral Video Creators',
  theme = 'light',
  accentColor = '#EA580C',
  style = {},
}) => {
  const frame = useCurrentFrame();
  const isDark = theme === 'dark';

  const spread = Math.sin((frame / 40) * Math.PI * 2) * 12;

  const avatars = [
    { color: '#EA580C', emoji: '🧑‍💻' },
    { color: '#0284C7', emoji: '👩‍🎨' },
    { color: '#10B981', emoji: '🎬' },
    { color: '#7C3AED', emoji: '🎙️' },
  ];

  const bgColor = isDark ? '#0F172A' : '#FFFFFF';
  const textColor = isDark ? '#F8FAFC' : '#0F172A';
  const borderColor = isDark ? 'rgba(255,255,255,0.12)' : 'rgba(15,23,42,0.12)';

  return (
    <div
      style={{
        width: 680,
        backgroundColor: 'transparent',
        borderRadius: 28,
        padding: '36px 44px',
        border: 'none',
        boxShadow: isDark ? '0 25px 60px rgba(0,0,0,0.6)' : '0 20px 50px rgba(15,23,42,0.1)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        fontFamily: 'system-ui, sans-serif',
        boxSizing: 'border-box',
        ...style,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {avatars.map((av, idx) => (
          <div
            key={idx}
            style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              backgroundColor: av.color,
              border: '4px solid #FFFFFF',
              boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 36,
              marginLeft: idx === 0 ? 0 : -24 + (idx * spread) / 4,
              zIndex: 10 - idx,
            }}
          >
            {av.emoji}
          </div>
        ))}

        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: isDark ? '#334155' : '#F1F5F9',
            border: '4px solid #FFFFFF',
            boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 22,
            fontWeight: 900,
            color: isDark ? '#FFFFFF' : '#0F172A',
            marginLeft: -20,
            zIndex: 1,
          }}
        >
          +4k
        </div>
      </div>

      <div style={{ marginTop: 24, fontSize: 24, fontWeight: 800, color: textColor }}>
        {label}
      </div>
    </div>
  );
};

// ============================================================================
// 26. CHARGING (Giant battery cell filling up with glowing electric bolt)
// ============================================================================
export interface ChargingProps {
  theme?: 'dark' | 'light';
  accentColor?: string;
  style?: React.CSSProperties;
}

export const Charging: React.FC<ChargingProps> = ({
  theme = 'light',
  accentColor = '#10B981',
  style = {},
}) => {
  const frame = useCurrentFrame();
  const isDark = theme === 'dark';

  const charge = ((frame % 60) / 60) * 100;

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
      <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
        {/* Battery Container */}
        <div
          style={{
            width: 220,
            height: 110,
            borderRadius: 24,
            border: `5px solid ${isDark ? '#475569' : '#CBD5E1'}`,
            padding: 8,
            boxSizing: 'border-box',
            position: 'relative',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${charge}%`,
              backgroundColor: accentColor,
              borderRadius: 14,
              boxShadow: `0 0 25px ${accentColor}88`,
            }}
          />

          {/* Electric Bolt */}
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="44" height="44" viewBox="0 0 24 24" fill="#FFFFFF" stroke="#0F172A" strokeWidth="1.5">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
          </div>
        </div>

        {/* Battery Terminal Pin */}
        <div
          style={{
            width: 14,
            height: 44,
            backgroundColor: isDark ? '#475569' : '#CBD5E1',
            borderRadius: '0 8px 8px 0',
          }}
        />
      </div>

      <div style={{ marginTop: 28, fontSize: 32, fontWeight: 900, color: textColor, fontFamily: 'monospace' }}>
        {Math.round(charge)}% Fast Charged
      </div>
      <div style={{ fontSize: 17, color: isDark ? '#94A3B8' : '#64748B', marginTop: 4, fontWeight: 500 }}>
        High-throughput cloud pipeline active
      </div>
    </div>
  );
};

// ============================================================================
// 27. EQUALIZER (10 thick colorful dancing audio frequency bars with peak hold)
// ============================================================================
export interface EqualizerProps {
  label?: string;
  theme?: 'dark' | 'light';
  accentColor?: string;
  style?: React.CSSProperties;
}

export const Equalizer: React.FC<EqualizerProps> = ({
  label = 'AI Audio Mastering & Denoiser',
  theme = 'light',
  accentColor = '#EA580C',
  style = {},
}) => {
  const frame = useCurrentFrame();
  const isDark = theme === 'dark';

  const bars = [0.4, 0.7, 0.9, 0.6, 0.85, 0.5, 0.95, 0.75, 0.45, 0.65];

  const bgColor = isDark ? '#0F172A' : '#FFFFFF';
  const textColor = isDark ? '#F8FAFC' : '#0F172A';
  const borderColor = isDark ? 'rgba(255,255,255,0.12)' : 'rgba(15,23,42,0.12)';

  return (
    <div
      style={{
        width: 660,
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
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, height: 140 }}>
        {bars.map((b, i) => {
          const osc = Math.sin((frame / 12) + i * 0.8) * 0.5 + 0.5;
          const height = Math.max(20, osc * b * 130);
          return (
            <div
              key={i}
              style={{
                width: 22,
                height,
                borderRadius: 11,
                background: `linear-gradient(180deg, ${accentColor}, #F59E0B)`,
                boxShadow: `0 4px 16px ${accentColor}66`,
              }}
            />
          );
        })}
      </div>

      <div style={{ marginTop: 32, fontSize: 26, fontWeight: 800, color: textColor }}>
        {label}
      </div>
      <div style={{ fontSize: 16, color: isDark ? '#94A3B8' : '#64748B', marginTop: 4, fontWeight: 500 }}>
        48 kHz • 32-bit float broadcast fidelity
      </div>
    </div>
  );
};

// ============================================================================
// 28. PLAY / PAUSE (Giant morphing play triangle into dual pause bars)
// ============================================================================
export interface PlayPauseProps {
  label?: string;
  theme?: 'dark' | 'light';
  accentColor?: string;
  style?: React.CSSProperties;
}

export const PlayPause: React.FC<PlayPauseProps> = ({
  label = 'Live 1080p Stream',
  theme = 'light',
  accentColor = '#EA580C',
  style = {},
}) => {
  const frame = useCurrentFrame();
  const isDark = theme === 'dark';

  const isPlaying = (Math.floor(frame / 45) % 2) === 0;

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
      <div
        style={{
          width: 120,
          height: 120,
          borderRadius: 60,
          backgroundColor: accentColor,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: `0 14px 40px ${accentColor}77`,
        }}
      >
        {isPlaying ? (
          <svg width="52" height="52" viewBox="0 0 24 24" fill="#FFFFFF" style={{ marginLeft: 6 }}>
            <polygon points="5 3 19 12 5 21 5 3" />
          </svg>
        ) : (
          <svg width="52" height="52" viewBox="0 0 24 24" fill="#FFFFFF">
            <rect x="6" y="4" width="4" height="16" rx="2" />
            <rect x="14" y="4" width="4" height="16" rx="2" />
          </svg>
        )}
      </div>

      <div style={{ marginTop: 28, fontSize: 28, fontWeight: 800, color: textColor }}>
        {isPlaying ? 'Playing Scene' : 'Paused Preview'}
      </div>
      <div style={{ fontSize: 17, color: isDark ? '#94A3B8' : '#64748B', marginTop: 4, fontWeight: 500 }}>
        {label}
      </div>
    </div>
  );
};

// ============================================================================
// 29. STEPPER (Numbered circular milestone stepper with connecting laser track)
// ============================================================================
export interface StepperProps {
  steps?: string[];
  theme?: 'dark' | 'light';
  accentColor?: string;
  style?: React.CSSProperties;
}

export const Stepper: React.FC<StepperProps> = ({
  steps = ['Script', 'Audio', 'Visuals', 'Export'],
  theme = 'light',
  accentColor = '#EA580C',
  style = {},
}) => {
  const frame = useCurrentFrame();
  const isDark = theme === 'dark';

  const currentStep = Math.min(steps.length, Math.floor((frame % 80) / 20) + 1);

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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
        {/* Connecting Line */}
        <div
          style={{
            position: 'absolute',
            left: 30,
            right: 30,
            height: 6,
            backgroundColor: isDark ? '#334155' : '#E2E8F0',
            top: 28,
            zIndex: 1,
          }}
        />

        {steps.map((st, i) => {
          const num = i + 1;
          const isDone = num < currentStep;
          const isCurrent = num === currentStep;

          return (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 2 }}>
              <div
                style={{
                  width: 58,
                  height: 58,
                  borderRadius: 29,
                  backgroundColor: isDone || isCurrent ? accentColor : isDark ? '#1E293B' : '#F1F5F9',
                  border: `4px solid ${bgColor}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: isDone || isCurrent ? '#FFFFFF' : '#94A3B8',
                  fontWeight: 900,
                  fontSize: 22,
                  boxShadow: isCurrent ? `0 0 25px ${accentColor}` : 'none',
                }}
              >
                {isDone ? '✓' : num}
              </div>

              <div style={{ marginTop: 12, fontSize: 18, fontWeight: isCurrent ? 800 : 600, color: isCurrent ? accentColor : textColor }}>
                {st}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ============================================================================
// 30. PROGRESS RING (Giant circular SVG gauge with percentage value)
// ============================================================================
export interface ProgressRingProps {
  label?: string;
  theme?: 'dark' | 'light';
  accentColor?: string;
  style?: React.CSSProperties;
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
  label = 'AI Model Training',
  theme = 'light',
  accentColor = '#EA580C',
  style = {},
}) => {
  const frame = useCurrentFrame();
  const isDark = theme === 'dark';

  const progress = Math.min(100, Math.round(((frame % 70) / 70) * 100));
  const radius = 80;
  const stroke = 16;
  const circ = 2 * Math.PI * radius;
  const strokeDashoffset = circ - (progress / 100) * circ;

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
      <div style={{ position: 'relative', width: 190, height: 190, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width="190" height="190" style={{ transform: 'rotate(-90deg)' }}>
          <circle
            cx="95"
            cy="95"
            r={radius}
            stroke={isDark ? '#1E293B' : '#E2E8F0'}
            strokeWidth={stroke}
            fill="transparent"
          />
          <circle
            cx="95"
            cy="95"
            r={radius}
            stroke={accentColor}
            strokeWidth={stroke}
            fill="transparent"
            strokeDasharray={circ}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </svg>

        <div style={{ position: 'absolute', fontSize: 38, fontWeight: 900, color: textColor, fontFamily: 'monospace' }}>
          {progress}%
        </div>
      </div>

      <div style={{ marginTop: 24, fontSize: 24, fontWeight: 800, color: textColor }}>
        {label}
      </div>
    </div>
  );
};

// ============================================================================
// 31. CARD FLIP (3D dual-sided flip card rotating 180 degrees showing front & back)
// ============================================================================
export interface CardFlipProps {
  theme?: 'dark' | 'light';
  accentColor?: string;
  style?: React.CSSProperties;
}

export const CardFlip: React.FC<CardFlipProps> = ({
  theme = 'light',
  accentColor = '#EA580C',
  style = {},
}) => {
  const frame = useCurrentFrame();
  const isDark = theme === 'dark';

  const rotY = (frame * 2.5) % 360;
  const isBack = rotY > 90 && rotY < 270;

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
        perspective: 1000,
        boxSizing: 'border-box',
        ...style,
      }}
    >
      <div
        style={{
          width: 320,
          height: 190,
          borderRadius: 20,
          backgroundColor: isBack ? accentColor : (isDark ? '#1E293B' : '#FFF7ED'),
          border: `3px solid ${accentColor}`,
          boxShadow: '0 16px 40px rgba(0,0,0,0.2)',
          transform: `rotateY(${rotY}deg)`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: isBack ? '#FFFFFF' : textColor,
          padding: 24,
          boxSizing: 'border-box',
        }}
      >
        <div style={{ fontSize: 36, marginBottom: 8 }}>{isBack ? '⚡' : '💳'}</div>
        <div style={{ fontSize: 22, fontWeight: 900 }}>
          {isBack ? 'Ultra Cloud Node' : 'Pro Video License'}
        </div>
        <div style={{ fontSize: 14, opacity: 0.8, marginTop: 4 }}>
          {isBack ? '4K 60FPS • Priority Queue' : 'Lifetime Access Included'}
        </div>
      </div>

      <div style={{ marginTop: 24, fontSize: 18, color: isDark ? '#94A3B8' : '#64748B', fontWeight: 600 }}>
        3D Perspective Flip Card
      </div>
    </div>
  );
};

