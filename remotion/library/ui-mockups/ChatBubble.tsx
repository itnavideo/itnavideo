import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
  time?: string;
}

export interface ChatBubbleProps {
  messages?: ChatMessage[];
  theme?: 'dark' | 'light';
  delayFrames?: number;
  style?: React.CSSProperties;
}

const DEFAULT_MESSAGES: ChatMessage[] = [
  { sender: 'user', text: 'Create a 60s viral explainer on why 9:16 shorts retain more attention.', time: '10:42 AM' },
  { sender: 'ai', text: 'Done! Extracted 5 hook chapters with karaoke kinetic glow and AWS Lambda 30fps render.', time: '10:43 AM' },
];

export const ChatBubble: React.FC<ChatBubbleProps> = ({
  messages = DEFAULT_MESSAGES,
  theme = 'dark',
  delayFrames = 5,
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const isDark = theme === 'dark';
  const textColor = isDark ? '#F8FAFC' : '#0F172A';
  const textMuted = isDark ? '#94A3B8' : '#64748B';

  const items = messages && messages.length > 0 ? messages : DEFAULT_MESSAGES;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        maxWidth: '420px',
        fontFamily: 'Inter, system-ui, sans-serif',
        ...style,
      }}
    >
      {items.map((msg, idx) => {
        const isUser = msg.sender === 'user';
        const msgSpring = spring({
          frame: Math.max(0, frame - delayFrames - idx * 6),
          fps,
          config: { damping: 14, stiffness: 95 },
        });

        return (
          <div
            key={idx}
            style={{
              alignSelf: isUser ? 'flex-end' : 'flex-start',
              backgroundColor: isUser ? '#0066FF' : isDark ? '#1E293B' : '#F1F5F9',
              color: isUser ? '#FFFFFF' : textColor,
              padding: '12px 18px',
              borderRadius: isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
              boxShadow: '0 4px 16px rgba(0,0,0,0.18)',
              fontSize: '13px',
              lineHeight: 1.4,
              maxWidth: '85%',
              transform: `scale(${msgSpring}) translateY(${(1 - msgSpring) * 15}px)`,
              opacity: msgSpring,
            }}
          >
            <div>{msg.text}</div>
            {msg.time && (
              <div
                style={{
                  fontSize: '10px',
                  opacity: 0.7,
                  textAlign: 'right',
                  marginTop: '4px',
                }}
              >
                {msg.time}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
