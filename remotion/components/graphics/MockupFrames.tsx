import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface PromptWindowFrameProps {
  promptText?: string;
  commandTag?: string;
  accentColor?: string;
  theme?: 'light' | 'dark' | 'auto';
  style?: React.CSSProperties;
}

/**
 * macOS-style prompt/command window with traffic lights
 */
export function PromptWindowFrame({
  promptText = 'Create a viral faceless video with high-retention hooks...',
  commandTag = 'Claude 3.7 Sonnet',
  accentColor = '#FF5722',
  theme = 'dark',
  style = {},
}: PromptWindowFrameProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const popSpring = spring({
    frame,
    fps,
    config: { damping: 13, stiffness: 120 },
  });

  const floatY = Math.sin((frame / fps) * 2.2) * 5;
  const currentScale = interpolate(popSpring, [0, 1], [0.85, 1]);
  const currentOpacity = interpolate(popSpring, [0, 0.5, 1], [0, 0.9, 1]);

  // Typing effect
  const typedLength = Math.min(
    promptText.length,
    Math.floor(interpolate(frame, [10, 70], [0, promptText.length], { extrapolateRight: 'clamp' }))
  );
  const displayedText = promptText.slice(0, typedLength);
  const showCursor = frame % 16 < 8;

  const isLight = theme === 'light';
  const bgColor = isLight ? '#FFFFFF' : 'rgba(10, 14, 26, 0.94)';
  const borderColor = isLight ? 'rgba(0, 0, 0, 0.1)' : `${accentColor}55`;
  const textColor = isLight ? '#0F172A' : '#FFFFFF';
  const shadow = isLight
    ? '0 20px 40px rgba(0, 0, 0, 0.08)'
    : `0 24px 60px rgba(0, 0, 0, 0.8), 0 0 35px ${accentColor}25`;

  return (
    <div
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        width: '580px',
        backgroundColor: bgColor,
        borderRadius: '16px',
        border: `2px solid ${borderColor}`,
        boxShadow: shadow,
        overflow: 'hidden',
        transform: `scale(${currentScale}) translateY(${floatY}px)`,
        opacity: currentOpacity,
        backdropFilter: 'blur(16px)',
        ...style,
      }}
    >
      {/* Title Bar with Traffic Lights */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 18px',
          borderBottom: isLight ? '1px solid rgba(0,0,0,0.06)' : '1px solid rgba(255, 255, 255, 0.08)',
          backgroundColor: isLight ? '#F8FAFC' : 'rgba(255, 255, 255, 0.03)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#EF4444' }} />
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#F59E0B' }} />
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#10B981' }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span
            style={{
              fontSize: '11px',
              fontWeight: 700,
              color: accentColor,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              backgroundColor: isLight ? 'rgba(234, 88, 12, 0.08)' : `${accentColor}18`,
              padding: '2px 8px',
              borderRadius: '9999px',
              border: `1px solid ${accentColor}44`,
            }}
          >
            {commandTag}
          </span>
        </div>
      </div>

      {/* Terminal / Prompt Content */}
      <div style={{ padding: '20px 22px', fontSize: '15px', color: textColor, lineHeight: 1.6, minHeight: '80px' }}>
        <span style={{ color: accentColor, fontWeight: 700, marginRight: '8px' }}>&gt;</span>
        <span>{displayedText}</span>
        {showCursor && (
          <span
            style={{
              display: 'inline-block',
              width: '2px',
              height: '16px',
              backgroundColor: accentColor,
              marginLeft: '4px',
              verticalAlign: 'middle',
            }}
          />
        )}
      </div>
    </div>
  );
}

export interface TypingSearchBarProps {
  title?: string;
  accentColor?: string;
  theme?: 'light' | 'dark' | 'auto';
  style?: React.CSSProperties;
}

/**
 * YouTube / Google-style search bar with animated typing
 */
export function TypingSearchBar({
  title = 'how to get 100k views fast',
  accentColor = '#FF5722',
  theme = 'dark',
  style = {},
}: TypingSearchBarProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const popSpring = spring({
    frame,
    fps,
    config: { damping: 13, stiffness: 120 },
  });

  const floatY = Math.sin((frame / fps) * 2.2) * 5;
  const currentScale = interpolate(popSpring, [0, 1], [0.82, 1]);
  const currentOpacity = interpolate(popSpring, [0, 0.5, 1], [0, 0.9, 1]);

  const searchWords = title;
  const typedLength = Math.min(
    searchWords.length,
    Math.floor(interpolate(frame, [8, 55], [0, searchWords.length], { extrapolateRight: 'clamp' }))
  );
  const currentSearchText = searchWords.slice(0, typedLength);
  const showCursor = frame % 16 < 8;

  const isLight = theme === 'light';
  const bgColor = isLight ? '#FFFFFF' : 'rgba(15, 23, 42, 0.95)';
  const textColor = isLight ? '#0F172A' : '#FFFFFF';
  const borderColor = isLight ? 'rgba(0,0,0,0.12)' : 'rgba(255, 255, 255, 0.15)';

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '14px',
        padding: '16px 28px',
        borderRadius: '9999px',
        backgroundColor: bgColor,
        border: `2px solid ${borderColor}`,
        boxShadow: isLight
          ? '0 16px 36px rgba(0,0,0,0.08)'
          : `0 20px 50px rgba(0, 0, 0, 0.7), 0 0 30px ${accentColor}22`,
        transform: `scale(${currentScale}) translateY(${floatY}px)`,
        opacity: currentOpacity,
        minWidth: '520px',
        maxWidth: '720px',
        ...style,
      }}
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
      <div style={{ fontSize: '18px', fontWeight: 600, color: textColor, flex: 1, letterSpacing: '-0.01em' }}>
        <span>{currentSearchText}</span>
        {showCursor && (
          <span style={{ display: 'inline-block', width: '2px', height: '18px', backgroundColor: accentColor, marginLeft: '3px', verticalAlign: 'middle' }} />
        )}
      </div>
      <div style={{ fontSize: '12px', fontWeight: 700, color: isLight ? '#64748B' : '#94A3B8', backgroundColor: isLight ? '#F1F5F9' : 'rgba(255, 255, 255, 0.08)', padding: '4px 10px', borderRadius: '8px' }}>
        Search
      </div>
    </div>
  );
}

export interface RevenueToastAlertProps {
  amount?: string;
  source?: string;
  style?: React.CSSProperties;
}

/**
 * Stripe / Gumroad-style revenue notification pill
 */
export function RevenueToastAlert({
  amount = '+$1,450.00',
  source = 'New payment from Stripe',
  style = {},
}: RevenueToastAlertProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const popSpring = spring({
    frame,
    fps,
    config: { damping: 13, stiffness: 120 },
  });

  const floatY = Math.sin((frame / fps) * 2.2) * 6;
  const currentScale = interpolate(popSpring, [0, 1], [0.82, 1]);

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '16px',
        padding: '14px 24px',
        borderRadius: '9999px',
        backgroundColor: 'rgba(10, 14, 26, 0.94)',
        border: '2px solid rgba(16, 185, 129, 0.4)',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.85), 0 0 30px rgba(16, 185, 129, 0.25)',
        transform: `scale(${currentScale}) translateY(${floatY}px)`,
        ...style,
      }}
    >
      <div style={{ width: '38px', height: '38px', borderRadius: '50%', backgroundColor: 'rgba(16, 185, 129, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(16, 185, 129, 0.5)' }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
      <div>
        <div style={{ fontSize: '16px', fontWeight: 800, color: '#10B981', letterSpacing: '-0.02em' }}>
          {amount}
        </div>
        <div style={{ fontSize: '12px', fontWeight: 500, color: '#94A3B8' }}>
          {source}
        </div>
      </div>
    </div>
  );
}

export interface DecodingCardMockupProps {
  type?: 'thumbnail_mockup' | 'white_sticker_cutout' | 'search_bar' | 'ebook_mockup' | 'stripe_toast' | 'ai_prompt_box';
  imageSrc?: string;
  title?: string;
  channelName?: string;
  viewCount?: string;
  duration?: string;
  tiltAngle?: number;
  highlightWord?: string;
  accentColor?: string;
  fontFamily?: string;
  style?: React.CSSProperties;
}

/**
 * Universal Mockup Component (100% compatible with DecodingCardMockup)
 */
export function DecodingCardMockup({
  type = 'thumbnail_mockup',
  imageSrc,
  title = 'How to Build a Cash Cow Channel in 2026',
  channelName = 'Decoding Niche',
  viewCount = '1.4M views • 2 weeks ago',
  duration = '14:28',
  tiltAngle = -3.5,
  highlightWord,
  accentColor = '#FF5722',
  fontFamily = 'Montserrat, Inter, system-ui, sans-serif',
  style = {},
}: DecodingCardMockupProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const popSpring = spring({
    frame,
    fps,
    config: { damping: 13, stiffness: 120 },
  });

  const floatY = Math.sin((frame / fps) * 2.2) * 6;
  const floatRot = Math.cos((frame / fps) * 1.8) * 0.8;
  const currentScale = interpolate(popSpring, [0, 1], [0.82, 1]);
  const currentOpacity = interpolate(popSpring, [0, 0.5, 1], [0, 0.9, 1]);

  if (type === 'stripe_toast') {
    return <RevenueToastAlert amount="+$1,450.00" source="New payment from Stripe" style={style} />;
  }

  if (type === 'search_bar') {
    return <TypingSearchBar title={title} accentColor={accentColor} style={style} />;
  }

  if (type === 'ai_prompt_box') {
    return <PromptWindowFrame promptText={title} accentColor={accentColor} style={style} />;
  }

  // Fallback to classic thumbnail card mockup
  return (
    <div
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        width: '440px',
        backgroundColor: '#0F172A',
        borderRadius: '16px',
        overflow: 'hidden',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.8)',
        transform: `scale(${currentScale}) translateY(${floatY}px) rotate(${tiltAngle + floatRot}deg)`,
        opacity: currentOpacity,
        fontFamily,
        ...style,
      }}
    >
      <div style={{ position: 'relative', width: '100%', height: '230px', backgroundColor: '#1E293B' }}>
        {imageSrc ? (
          <img src={imageSrc} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748B', fontSize: '14px' }}>
            Video Thumbnail
          </div>
        )}
        <div style={{ position: 'absolute', bottom: '10px', right: '10px', backgroundColor: 'rgba(0,0,0,0.85)', padding: '2px 6px', borderRadius: '4px', fontSize: '11px', fontWeight: 700, color: '#FFFFFF' }}>
          {duration}
        </div>
      </div>
      <div style={{ padding: '14px 16px', display: 'flex', gap: '12px' }}>
        <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: accentColor, color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '14px', flexShrink: 0 }}>
          {channelName.slice(0, 1).toUpperCase()}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: '15px', fontWeight: 700, color: '#FFFFFF', lineHeight: 1.3, marginBottom: '4px' }}>
            {title}
          </div>
          <div style={{ fontSize: '12px', color: '#94A3B8', fontWeight: 500 }}>
            {channelName} • {viewCount}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DecodingCardMockup;
