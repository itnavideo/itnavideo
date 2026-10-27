import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { resolveTheme, ThemeMode } from './themeTokens';

// ─── 1. SOCIAL POST MOCKUP ─────────────────────────────────────────────────────

export interface SocialPostMockupProps {
  /** Real verified quote or post text from script */
  postText: string;
  /** Author name / speaker label (optional) */
  authorName?: string;
  /** Handle (optional, e.g. "@founder") */
  authorHandle?: string;
  /** Explicit verification boolean (defaults to false; strictly no fabricated verification badges) */
  isVerified?: boolean;
  /** Optional avatar image URL */
  avatarUrl?: string;
  /** Platform styling hint: 'twitter' | 'linkedin' | 'neutral' */
  platform?: 'twitter' | 'linkedin' | 'neutral';
  theme?: ThemeMode;
  canvasBgColor?: string;
  delayFrames?: number;
  width?: number | string;
  style?: React.CSSProperties;
  className?: string;
}

/**
 * Social Post Card.
 * Strict Truthfulness: NEVER fabricates fake follower counts, impression stats, or verified badges.
 */
export const SocialPostMockup: React.FC<SocialPostMockupProps> = ({
  postText,
  authorName = 'Key Insight',
  authorHandle,
  isVerified = false,
  avatarUrl,
  platform = 'neutral',
  theme = 'auto',
  canvasBgColor,
  delayFrames = 0,
  width = 540,
  style = {},
  className = '',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (!postText || postText.trim().length === 0) {
    return null;
  }

  const entrance = spring({
    frame: Math.max(0, frame - delayFrames),
    fps,
    config: { damping: 14, stiffness: 110 },
  });

  const palette = resolveTheme(theme, canvasBgColor);
  const translateY = interpolate(entrance, [0, 1], [25, 0]);

  return (
    <div
      className={className}
      style={{
        width,
        maxWidth: '100%',
        backgroundColor: palette.surface,
        border: `1px solid ${palette.border}`,
        borderRadius: '18px',
        padding: '24px 28px',
        boxShadow: palette.shadow,
        opacity: entrance,
        transform: `translateY(${translateY}px)`,
        ...style,
      }}
    >
      {/* Post Author Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt=""
            style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover' }}
          />
        ) : (
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              backgroundColor: palette.badgeBg,
              border: `1.5px solid ${palette.accent}`,
              color: palette.accent,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '16px',
              fontWeight: 800,
            }}
          >
            {authorName.slice(0, 1).toUpperCase()}
          </div>
        )}

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '15px', fontWeight: 700, color: palette.textPrimary }}>
              {authorName}
            </span>
            {isVerified && (
              <svg width="16" height="16" viewBox="0 0 24 24" fill={platform === 'twitter' ? '#1D9BF0' : palette.accent}>
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            )}
          </div>
          {authorHandle && (
            <div style={{ fontSize: '13px', color: palette.textMuted }}>
              {authorHandle}
            </div>
          )}
        </div>
      </div>

      {/* Post Body Text */}
      <p
        style={{
          fontSize: '16px',
          fontWeight: 500,
          color: palette.textPrimary,
          lineHeight: 1.5,
          margin: 0,
        }}
      >
        {postText}
      </p>
    </div>
  );
};

// ─── 2. CHAT CONVERSATION ──────────────────────────────────────────────────────

export interface ChatMessageItem {
  sender: 'left' | 'right';
  text: string;
}

export interface ChatConversationProps {
  /** Array of messages (must be explicitly supplied; no fabricated dialogue) */
  messages: ChatMessageItem[];
  theme?: ThemeMode;
  canvasBgColor?: string;
  delayFrames?: number;
  width?: number | string;
  style?: React.CSSProperties;
  className?: string;
}

/**
 * Chat Conversation Mockup with alternating bubbles.
 * Strict Truthfulness: Requires explicit caller-provided dialogue.
 */
export const ChatConversation: React.FC<ChatConversationProps> = ({
  messages,
  theme = 'auto',
  canvasBgColor,
  delayFrames = 0,
  width = 460,
  style = {},
  className = '',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return null;
  }

  const palette = resolveTheme(theme, canvasBgColor);

  return (
    <div
      className={className}
      style={{
        width,
        maxWidth: '100%',
        backgroundColor: palette.surface,
        border: `1px solid ${palette.border}`,
        borderRadius: '20px',
        padding: '24px 20px',
        boxShadow: palette.shadow,
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        ...style,
      }}
    >
      {messages.map((msg, idx) => {
        const msgDelay = delayFrames + idx * 8;
        const msgSpring = spring({
          frame: Math.max(0, frame - msgDelay),
          fps,
          config: { damping: 13, stiffness: 120 },
        });

        const scale = interpolate(msgSpring, [0, 1], [0.85, 1]);
        const isRight = msg.sender === 'right';

        return (
          <div
            key={idx}
            style={{
              display: 'flex',
              justifyContent: isRight ? 'flex-end' : 'flex-start',
              opacity: msgSpring,
              transform: `scale(${scale})`,
            }}
          >
            <div
              style={{
                maxWidth: '78%',
                padding: '12px 18px',
                borderRadius: isRight ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                backgroundColor: isRight ? palette.accent : palette.surfaceSubtle,
                color: isRight ? '#FFFFFF' : palette.textPrimary,
                border: isRight ? 'none' : `1px solid ${palette.border}`,
                fontSize: '14.5px',
                lineHeight: 1.45,
                fontWeight: 500,
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              }}
            >
              {msg.text}
            </div>
          </div>
        );
      })}
    </div>
  );
};
