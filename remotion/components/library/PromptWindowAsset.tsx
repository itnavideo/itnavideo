import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface PromptWindowAssetProps {
  sceneFrame?: number;
  title?: string;
  promptText?: string;
  badgeText?: string;
  isDark?: boolean;
  scale?: number;
  width?: number | string;
  startDelayFrames?: number;
}

/**
 * PromptWindowAsset
 * Reusable macOS / Notion-styled AI Prompt Window.
 * Learned from Ali Abdaal's signature "One AI Prompt" productivity masterclass.
 * Features:
 * - macOS window bar with traffic light buttons (red, amber, green)
 * - AI Model chip (e.g. "Claude 3.7 / GPT-4o Life Coach")
 * - Simulated typing / spring reveal with blinking cursor
 * - Frosted glass card with subtle shadow & metallic border
 */
export const PromptWindowAsset: React.FC<PromptWindowAssetProps> = ({
  sceneFrame,
  title = 'AI Life-Architecture Prompt',
  promptText = 'Act as an executive life coach. Analyze my core goals across Health, Wealth, Relationships, and Growth. Identify areas of misalignment and build a weekly blueprint.',
  badgeText = 'AI MASTER PROMPT',
  isDark = false,
  scale = 1.0,
  width = '640px',
  startDelayFrames = 6,
}) => {
  const currentFrame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const activeFrame = (sceneFrame !== undefined ? sceneFrame : currentFrame) - startDelayFrames;
  const frame = Math.max(0, activeFrame);

  // Entrance spring
  const windowSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 110 },
  });

  // Typing character reveal
  const typingChars = Math.min(
    promptText.length,
    Math.floor(interpolate(frame, [8, 55], [0, promptText.length], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }))
  );
  const visibleText = promptText.slice(0, typingChars);

  // Blinking cursor
  const showCursor = Math.floor(frame / 12) % 2 === 0;

  const cardBg = isDark ? 'rgba(15, 23, 42, 0.94)' : '#FFFFFF';
  const cardBorder = isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(30, 41, 59, 0.10)';
  const textPrimary = isDark ? '#F8FAFC' : '#141414';
  const headerBg = isDark ? 'rgba(255, 255, 255, 0.04)' : '#F8FAFC';

  return (
    <div
      style={{
        transform: `scale(${windowSpring * scale}) translateY(${(1 - windowSpring) * 24}px)`,
        opacity: windowSpring,
        width,
        maxWidth: '100%',
        borderRadius: '20px',
        backgroundColor: cardBg,
        border: `1.5px solid ${cardBorder}`,
        boxShadow: isDark
          ? '0 24px 50px rgba(0,0,0,0.6), 0 2px 10px rgba(0,0,0,0.4)'
          : '0 24px 50px rgba(180, 160, 140, 0.20), 0 2px 10px rgba(30, 41, 59, 0.04)',
        overflow: 'hidden',
        boxSizing: 'border-box',
        position: 'relative',
      }}
    >
      {/* ── macOS Window Header Bar ── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '14px 20px',
          backgroundColor: headerBg,
          borderBottom: `1px solid ${cardBorder}`,
        }}
      >
        {/* Traffic Light Dots */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '11px', height: '11px', borderRadius: '50%', backgroundColor: '#FF5F56' }} />
          <div style={{ width: '11px', height: '11px', borderRadius: '50%', backgroundColor: '#FFBD2E' }} />
          <div style={{ width: '11px', height: '11px', borderRadius: '50%', backgroundColor: '#27C93F' }} />
        </div>

        {/* Window Title */}
        <span
          style={{
            fontSize: '12px',
            fontFamily: 'Inter, system-ui, sans-serif',
            fontWeight: 650,
            color: isDark ? '#94A3B8' : '#64748B',
            letterSpacing: '0.02em',
          }}
        >
          {title}
        </span>

        {/* Badge */}
        <span
          style={{
            fontSize: '10px',
            fontWeight: 700,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: '#D97706',
            backgroundColor: isDark ? 'rgba(217, 119, 6, 0.16)' : '#FEF3C7',
            padding: '3px 8px',
            borderRadius: '6px',
          }}
        >
          {badgeText}
        </span>
      </div>

      {/* ── Prompt Content Stage ── */}
      <div style={{ padding: '24px 28px' }}>
        <p
          style={{
            margin: 0,
            fontSize: '17px',
            fontFamily: 'Lora, "Playfair Display", Georgia, serif',
            fontWeight: 500,
            lineHeight: 1.6,
            color: textPrimary,
          }}
        >
          {visibleText}
          <span
            style={{
              display: 'inline-block',
              width: '2px',
              height: '19px',
              backgroundColor: '#EA580C',
              marginLeft: '4px',
              verticalAlign: 'text-bottom',
              opacity: showCursor ? 1 : 0,
              transition: 'opacity 0.1s ease',
            }}
          />
        </p>

        {/* Bottom Utility Row */}
        <div
          style={{
            marginTop: '20px',
            paddingTop: '14px',
            borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(30,41,59,0.06)'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span
            style={{
              fontSize: '11px',
              fontWeight: 600,
              color: isDark ? '#64748B' : '#94A3B8',
              fontFamily: 'Inter, system-ui, sans-serif',
            }}
          >
            Press Enter to Execute • Claude 3.7 LifeOS
          </span>

          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '11px',
              fontWeight: 650,
              color: '#059669',
              backgroundColor: isDark ? 'rgba(5, 150, 105, 0.14)' : '#ECFDF5',
              padding: '3px 10px',
              borderRadius: '999px',
            }}
          >
            ✓ READY TO RUN
          </span>
        </div>
      </div>
    </div>
  );
};

export default PromptWindowAsset;
