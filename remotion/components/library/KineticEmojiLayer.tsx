import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface KineticEmojiEvent {
  id: string;
  emoji: string;
  keyword: string;
  startSeconds: number;
  durationSeconds?: number;
  position?: 'above-caption' | 'top-right' | 'top-left' | 'center';
  glowColor?: string;
}

export interface KineticEmojiLayerProps {
  events?: KineticEmojiEvent[];
  words?: Array<{ word: string; start: number; end: number }>;
  transcript?: string;
  enabled?: boolean;
  position?: 'above-caption' | 'top-right' | 'top-left' | 'center';
}

// ── Master Contextual Kinetic Emoji Dictionary (MrBeast & Hormozi Viral Archetypes) ──
const CONTEXTUAL_EMOJI_RULES: Array<{
  regex: RegExp;
  emoji: string;
  glow: string;
}> = [
    // 1. Money, Wealth & Revenue
    {
      regex: /\b(money|rich|wealth|profit|revenue|cash|dollar|dollars|salary|crore|lakh|million|invest|investing|earning|income)\b/i,
      emoji: '💰',
      glow: 'rgba(34, 197, 94, 0.6)',
    },
    // 2. Rocket, 10X Growth, Speed & Scale
    {
      regex: /\b(rocket|launch|scale|growth|fast|speed|skyrocket|boost|explode|exponential|10x|turbo)\b/i,
      emoji: '🚀',
      glow: 'rgba(239, 68, 68, 0.6)',
    },
    // 3. Fire, Viral, Insane Energy & Trending
    {
      regex: /\b(fire|viral|crazy|insane|hot|popular|epic|wild|trending|banger)\b/i,
      emoji: '🔥',
      glow: 'rgba(249, 115, 22, 0.7)',
    },
    // 4. Warning, Danger, Trap & Risk
    {
      regex: /\b(warning|danger|risk|trap|avoid|scam|beware|careful|alert|loss|lose|debt|trouble)\b/i,
      emoji: '⚠️',
      glow: 'rgba(234, 179, 8, 0.7)',
    },
    // 5. Wrong, Mistake, Stop & Disaster
    {
      regex: /\b(mistake|wrong|never|fail|failure|stop|don't|quit|quitting|broken|disaster|false)\b/i,
      emoji: '❌',
      glow: 'rgba(239, 68, 68, 0.7)',
    },
    // 6. Success, Win, Goal & Target Achieved
    {
      regex: /\b(success|win|winner|correct|right|achieve|goal|target|champion|victory|yes|proven)\b/i,
      emoji: '✅',
      glow: 'rgba(16, 185, 129, 0.7)',
    },
    // 7. Mindset, Brain, Focus & Thinking
    {
      regex: /\b(mindset|brain|think|focus|smart|psychology|iq|mental|clarity|thought)\b/i,
      emoji: '🧠',
      glow: 'rgba(236, 72, 153, 0.6)',
    },
    // 8. Idea, Hack, Secret & Discovery
    {
      regex: /\b(idea|secret|hack|trick|tip|strategy|solution|blueprint|insight|unlock)\b/i,
      emoji: '💡',
      glow: 'rgba(250, 204, 21, 0.8)',
    },
    // 9. Time, Hours, Wait & Deadlines
    {
      regex: /\b(time|hour|hours|minutes|days|deadline|wait|delay|urgency|now|clock|late)\b/i,
      emoji: '⏳',
      glow: 'rgba(148, 163, 184, 0.6)',
    },
    // 10. Authority, King, Elite & Top 1%
    {
      regex: /\b(king|boss|leader|top|elite|master|champion|crown|rule|dominant)\b/i,
      emoji: '👑',
      glow: 'rgba(234, 179, 8, 0.8)',
    },
    // 11. Chart & Continuous Metric Uptrend
    {
      regex: /\b(numbers|metrics|stats|analytics|compound|climb|rising|higher)\b/i,
      emoji: '📈',
      glow: 'rgba(56, 189, 248, 0.6)',
    },
    // 12. Bullseye & Accuracy
    {
      regex: /\b(accurate|exact|perfect|direct|bullseye|precise)\b/i,
      emoji: '🎯',
      glow: 'rgba(244, 63, 94, 0.7)',
    },
  ];

/**
 * Automatically builds timed kinetic emoji pop events from speech word timestamps.
 * Enforces a strict minimum spacing interval (3.0s - 3.5s) to guarantee viral impact without clutter.
 */
export function buildContextualEmojiEvents(
  words: Array<{ word: string; start: number; end: number }> = [],
  minGapSeconds: number = 3.2
): KineticEmojiEvent[] {
  if (!words || words.length === 0) return [];

  const events: KineticEmojiEvent[] = [];
  let lastEventEnd = -10;

  for (let i = 0; i < words.length; i++) {
    const item = words[i];
    const wordText = item.word.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
    if (!wordText || wordText.length < 3) continue;

    // Check if enough time has elapsed since last emoji pop
    if (item.start - lastEventEnd < minGapSeconds) {
      continue;
    }

    // Match against contextual emoji dictionary
    const matchedRule = CONTEXTUAL_EMOJI_RULES.find((rule) => rule.regex.test(wordText));
    if (matchedRule) {
      events.push({
        id: `emoji-pop-${events.length + 1}-${Math.round(item.start * 100)}`,
        emoji: matchedRule.emoji,
        keyword: wordText,
        startSeconds: Math.round(item.start * 100) / 100,
        durationSeconds: 1.4, // Standard 1.4s display window
        glowColor: matchedRule.glow,
      });
      lastEventEnd = item.start + 1.4;
    }
  }

  return events;
}

export const KineticEmojiLayer: React.FC<KineticEmojiLayerProps> = ({
  events = [],
  words = [],
  enabled = true,
  position = 'above-caption',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const currentTimeSec = frame / fps;

  // Auto-generate contextual emoji events if not explicitly passed
  const activeEvents = React.useMemo(() => {
    if (!enabled) return [];
    if (events && events.length > 0) return events;
    return buildContextualEmojiEvents(words);
  }, [events, words, enabled]);

  // Find emoji event currently in its display window
  const currentEvent = activeEvents.find((ev) => {
    const dur = ev.durationSeconds ?? 1.4;
    return currentTimeSec >= ev.startSeconds && currentTimeSec < ev.startSeconds + dur;
  });

  if (!currentEvent) return null;

  const startFrame = Math.round(currentEvent.startSeconds * fps);
  const totalDurationFrames = Math.round((currentEvent.durationSeconds ?? 1.4) * fps);
  const framesSinceStart = Math.max(0, frame - startFrame);

  // ── Kinetic Spring & Overshoot Animation (MrBeast Pop Curve) ──
  // Entrance: spring 0 -> 1.25 -> 1.0 (Frames 0 to 10)
  const enterSpring = spring({
    frame: framesSinceStart,
    fps,
    config: {
      damping: 8,
      stiffness: 240,
      mass: 0.6,
    },
  });

  // Exit: Scale down & fade out during final 8 frames
  const exitFrames = 8;
  const exitStartFrame = totalDurationFrames - exitFrames;
  const exitScale = interpolate(
    framesSinceStart,
    [exitStartFrame, totalDurationFrames],
    [1.0, 0.0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  const exitOpacity = interpolate(
    framesSinceStart,
    [exitStartFrame, totalDurationFrames],
    [1.0, 0.0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const finalScale = enterSpring * exitScale;

  // Kinetic Floating Wiggle (idle motion)
  const floatBob = Math.sin((framesSinceStart - 8) / 3.5) * 6;
  const wiggleRotate = Math.sin((framesSinceStart - 8) / 4) * 5;

  const glowColor = currentEvent.glowColor || 'rgba(255, 215, 0, 0.5)';

  // Positioning
  const effectivePosition = currentEvent.position || position;
  let posStyle: React.CSSProperties = {
    position: 'absolute',
    bottom: 330, // Directly above the subtitle strip, clear of bottom seek bar
    left: '50%',
    transform: `translateX(-50%) translateY(${floatBob}px) scale(${finalScale}) rotate(${wiggleRotate}deg)`,
    transformOrigin: 'center center',
  };

  if (effectivePosition === 'top-right') {
    posStyle = {
      position: 'absolute',
      top: 140,
      right: 110,
      transform: `translateY(${floatBob}px) scale(${finalScale}) rotate(${wiggleRotate}deg)`,
      transformOrigin: 'center center',
    };
  } else if (effectivePosition === 'top-left') {
    posStyle = {
      position: 'absolute',
      top: 140,
      left: 110,
      transform: `translateY(${floatBob}px) scale(${finalScale}) rotate(${wiggleRotate}deg)`,
      transformOrigin: 'center center',
    };
  } else if (effectivePosition === 'center') {
    posStyle = {
      position: 'absolute',
      top: '46%',
      left: '50%',
      transform: `translate(-50%, -50%) translateY(${floatBob}px) scale(${finalScale}) rotate(${wiggleRotate}deg)`,
      transformOrigin: 'center center',
    };
  }

  return (
    <div
      style={{
        ...posStyle,
        zIndex: 38,
        opacity: exitOpacity,
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          fontSize: '92px',
          lineHeight: 1,
          fontFamily: "'Apple Color Emoji', 'Segoe UI Emoji', 'Noto Color Emoji', sans-serif",
          filter: `drop-shadow(0 16px 32px rgba(0, 0, 0, 0.65)) drop-shadow(0 0 28px ${glowColor})`,
          userSelect: 'none',
        }}
      >
        {currentEvent.emoji}
      </div>
    </div>
  );
};

