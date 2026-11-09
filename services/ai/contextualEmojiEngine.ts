/**
 * Contextual Kinetic Emoji Engine
 * 
 * Provides pure deterministic text-matching and timestamp calculation for
 * dynamic contextual emojis. Pure TypeScript — safe for both Server (Node.js API routes)
 * and Remotion composition renderers.
 */

export interface KineticEmojiEvent {
  id: string;
  emoji: string;
  keyword: string;
  startSeconds: number;
  durationSeconds?: number;
  position?: 'above-caption' | 'top-right' | 'top-left' | 'center';
  glowColor?: string;
}

export const CONTEXTUAL_EMOJI_RULES: Array<{
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
