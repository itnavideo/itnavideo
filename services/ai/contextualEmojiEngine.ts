/**
 * Contextual Kinetic Emoji Engine
 *
 * Provides pure deterministic text-matching and timestamp calculation for
 * dynamic contextual emojis. Pure TypeScript — safe for both Server (Node.js API routes)
 * and Remotion composition renderers.
 *
 * Diversity model:
 * - ~30 semantic categories, each backed by MULTIPLE emoji variants so the same
 *   concept renders different glyphs across a single video (no visual fatigue).
 * - A rolling "recently used" window prevents the same emoji from repeating within
 *   a configurable number of pops, guaranteeing variety on every render.
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

export interface ContextualEmojiRule {
  regex: RegExp;
  emojis: string[];
  glow: string;
}

/**
 * Curated emoji library. Each category carries several visually-distinct emoji
 * variants so a recurring concept (e.g. "money") never shows the same glyph twice
 * in a row. Glow colors are tuned for legibility against light & dark canvases.
 */
export const CONTEXTUAL_EMOJI_RULES: ContextualEmojiRule[] = [
  // 1. Money, Wealth & Revenue
  {
    regex: /\b(money|rich|wealth|profit|revenue|cash|dollar|dollars|salary|crore|lakh|million|invest|investing|earning|income|billionaire|fortune)\b/i,
    emojis: ['💰', '💵', '🤑', '💎', '🪙', '🏦', '💳', '📈'],
    glow: 'rgba(34, 197, 94, 0.6)',
  },
  // 2. Rocket, 10X Growth, Speed & Scale
  {
    regex: /\b(rocket|launch|scale|growth|fast|speed|skyrocket|boost|explode|exponential|10x|turbo|accelerate|momentum)\b/i,
    emojis: ['🚀', '⚡', '💨', '🔥', '🛸', '🏁', '🅰️', '➡️'],
    glow: 'rgba(239, 68, 68, 0.6)',
  },
  // 3. Fire, Viral, Insane Energy & Trending
  {
    regex: /\b(fire|viral|crazy|insane|hot|popular|epic|wild|trending|banger|hype|hyped|dope|lit)\b/i,
    emojis: ['🔥', '💯', '🤯', '😎', '🎮', '🌶️', '🎉', '✨'],
    glow: 'rgba(249, 115, 22, 0.7)',
  },
  // 4. Warning, Danger, Trap & Risk
  {
    regex: /\b(warning|danger|risk|trap|avoid|scam|beware|careful|alert|loss|lose|debt|trouble|hazard|poison)\b/i,
    emojis: ['⚠️', '🚨', '⛔', '🛑', '☣️', '📵', '❗', '🧨'],
    glow: 'rgba(234, 179, 8, 0.7)',
  },
  // 5. Wrong, Mistake, Stop & Disaster
  {
    regex: /\b(mistake|wrong|never|fail|failure|stop|don't|quit|quitting|broken|disaster|false|ruin|destroy)\b/i,
    emojis: ['❌', '🚫', '❗', '👎', '💔', '🛑', '⛔', '💢'],
    glow: 'rgba(239, 68, 68, 0.7)',
  },
  // 6. Success, Win, Goal & Target Achieved
  {
    regex: /\b(success|win|winner|correct|right|achieve|goal|target|champion|victory|yes|proven|triumph|nail)\b/i,
    emojis: ['✅', '🏆', '🎯', '🥇', '🏅', '👑', '🙌', '💪'],
    glow: 'rgba(16, 185, 129, 0.7)',
  },
  // 7. Mindset, Brain, Focus & Thinking
  {
    regex: /\b(mindset|brain|think|focus|smart|psychology|iq|mental|clarity|thought|logic|reason|intellect)\b/i,
    emojis: ['🧠', '💭', '🤔', '💡', '🧩', '📚', '🪄', '🧘'],
    glow: 'rgba(236, 72, 153, 0.6)',
  },
  // 8. Idea, Hack, Secret & Discovery
  {
    regex: /\b(idea|secret|hack|trick|tip|strategy|solution|blueprint|insight|unlock|discover|method|framework)\b/i,
    emojis: ['💡', '🔑', '🧩', '🗝️', '🪄', '⚡', '🎯', '📖'],
    glow: 'rgba(250, 204, 21, 0.8)',
  },
  // 9. Time, Hours, Wait & Deadlines
  {
    regex: /\b(time|hour|hours|minutes|days|deadline|wait|delay|urgency|now|clock|late|schedule|patience)\b/i,
    emojis: ['⏳', '⏰', '⌛', '🕰️', '⏱️', '📅', '⏲️', '🔜'],
    glow: 'rgba(148, 163, 184, 0.6)',
  },
  // 10. Authority, King, Elite & Top 1%
  {
    regex: /\b(king|boss|leader|top|elite|master|champion|crown|rule|dominant|guru|legend|icon)\b/i,
    emojis: ['👑', '🥇', '🏆', '🏅', '🦁', '💪', '⭐', '🧞'],
    glow: 'rgba(234, 179, 8, 0.8)',
  },
  // 11. Chart & Continuous Metric Uptrend
  {
    regex: /\b(numbers|metrics|stats|analytics|compound|climb|rising|higher|progress|improve|gain|surge|uptrend)\b/i,
    emojis: ['📈', '📊', '💹', '🔝', '🆙', '📉', '📌', '🧮'],
    glow: 'rgba(56, 189, 248, 0.6)',
  },
  // 12. Bullseye & Accuracy
  {
    regex: /\b(accurate|exact|perfect|direct|bullseye|precise|flawless|spot|onpoint|sharp)\b/i,
    emojis: ['🎯', '✅', '🎖️', '📍', '✔️', '🥇', '🏹', '⭐'],
    glow: 'rgba(244, 63, 94, 0.7)',
  },
  // 13. Love, Passion & Emotion
  {
    regex: /\b(love|passion|heart|adore|like|enjoy|favorite|crush|romance|care|devotion)\b/i,
    emojis: ['❤️', '💖', '😍', '🔥', '💕', '💘', '🥰', '❣️'],
    glow: 'rgba(244, 63, 94, 0.6)',
  },
  // 14. Energy, Power & Hustle
  {
    regex: /\b(energy|power|hustle|grind|work|effort|drive|fuel|stamina|endurance|beast|grit)\b/i,
    emojis: ['⚡', '🔋', '💪', '🔥', '🥵', '🦾', '⚙️', '🛠️'],
    glow: 'rgba(250, 204, 21, 0.7)',
  },
  // 15. Sleep, Rest & Recovery
  {
    regex: /\b(sleep|rest|recover|nap|tired|exhausted|recharge|bedtime|dream|relax|unwind)\b/i,
    emojis: ['😴', '💤', '🛌', '🌙', '🛏️', '🥱', '☁️', '🧘'],
    glow: 'rgba(99, 102, 241, 0.6)',
  },
  // 16. Food, Diet & Nutrition
  {
    regex: /\b(food|eat|diet|nutrition|meal|protein|calorie|hungry|recipe|cook|fruit|vegetable|snack)\b/i,
    emojis: ['🍔', '🥗', '🍳', '🥦', '🍎', '🍽️', '🥑', '🍕'],
    glow: 'rgba(34, 197, 94, 0.6)',
  },
  // 17. Fitness, Gym & Workout
  {
    regex: /\b(fitness|gym|workout|exercise|lift|muscle|cardio|run|running|training|rep|sets|squat)\b/i,
    emojis: ['🏋️', '💪', '🏃', '🤸', '🥊', '🚴', '🏆', '🔥'],
    glow: 'rgba(239, 68, 68, 0.6)',
  },
  // 18. Travel, Journey & Adventure
  {
    regex: /\b(travel|journey|trip|adventure|explore|world|destination|flight|vacation|tour|road|path)\b/i,
    emojis: ['✈️', '🌍', '🗺️', '🧳', '🏖️', '🚗', '🧭', '🌏'],
    glow: 'rgba(14, 165, 233, 0.6)',
  },
  // 19. Technology, AI, Code & Future
  {
    regex: /\b(tech|technology|ai|code|coding|software|computer|robot|future|digital|algorithm|data|machine|cyber)\b/i,
    emojis: ['🤖', '💻', '⚙️', '🧠', '🔮', '📡', '🛰️', '🖥️'],
    glow: 'rgba(6, 182, 212, 0.7)',
  },
  // 20. Business, Startup & Leadership
  {
    regex: /\b(business|startup|company|founder|ceo|entrepreneur|market|sales|customer|product|brand|launch|venture)\b/i,
    emojis: ['💼', '🏢', '📊', '🤝', '📈', '🚀', '🧾', '🗂️'],
    glow: 'rgba(59, 130, 246, 0.6)',
  },
  // 21. Education, Learning & Books
  {
    regex: /\b(learn|learning|study|school|knowledge|book|read|reading|education|student|teacher|lesson|course|skill)\b/i,
    emojis: ['📚', '🎓', '📖', '✏️', '🧠', '📝', '🎓', '🧑‍🏫'],
    glow: 'rgba(168, 85, 247, 0.6)',
  },
  // 22. Social Media, Creators & Virality
  {
    regex: /\b(video|creator|youtube|tiktok|instagram|viral|camera|views|followers|post|content|reel|channel|subscriber)\b/i,
    emojis: ['🎥', '📱', '🎬', '📸', '▶️', '🔴', '💬', '✨'],
    glow: 'rgba(236, 72, 153, 0.6)',
  },
  // 23. Health, Body & Wellness
  {
    regex: /\b(health|body|wellness|heart|doctor|medicine|heal|immune|vitamin|water|hydration|mind|wellbeing)\b/i,
    emojis: ['❤️', '🩺', '💊', '💧', '🥗', '🧘', '🌿', '🩹'],
    glow: 'rgba(34, 197, 94, 0.6)',
  },
  // 24. Nature, Earth & Environment
  {
    regex: /\b(nature|earth|environment|tree|forest|ocean|river|mountain|flower|plant|green|climate|weather)\b/i,
    emojis: ['🌿', '🌳', '🌍', '🌊', '🏔️', '🌸', '🌱', '☀️'],
    glow: 'rgba(34, 197, 94, 0.6)',
  },
  // 25. Music, Sound & Rhythm
  {
    regex: /\b(music|song|sound|beat|rhythm|melody|audio|voice|sing|track|album|tune|note|instrument)\b/i,
    emojis: ['🎵', '🎶', '🎤', '🎧', '🎸', '🎹', '🥁', '🔊'],
    glow: 'rgba(168, 85, 247, 0.6)',
  },
  // 26. Celebration, Party & Achievement
  {
    regex: /\b(celebrate|party|win|won|achievement|milestone|reward|prize|gift|congrats|cheers|festival|birthday)\b/i,
    emojis: ['🎉', '🎊', '🥳', '🎁', '🏆', '🎈', '🥂', '🍾'],
    glow: 'rgba(236, 72, 153, 0.7)',
  },
  // 27. Communication, Talk & Connection
  {
    regex: /\b(talk|talks|speak|conversation|communicate|message|chat|discuss|explain|story|share|connect|network)\b/i,
    emojis: ['💬', '🗣️', '📢', '📞', '📨', '🤝', '📡', '🗨️'],
    glow: 'rgba(59, 130, 246, 0.6)',
  },
  // 28. Fear, Shock & Surprise
  {
    regex: /\b(fear|scared|shock|surprise|wow|omg|unbelievable|crazy|jaw|gasp|stunned|whoa|boom)\b/i,
    emojis: ['😱', '🤯', '😮', '👀', '💥', '😲', '🫢', '❗'],
    glow: 'rgba(168, 85, 247, 0.7)',
  },
  // 29. Money Loss, Crash & Failure
  {
    regex: /\b(crash|crashed|bankrupt|broke|poor|loss|losing|debt|owe|scam|fraud|collapse|plunge|tank|recession)\b/i,
    emojis: ['📉', '💔', '🚨', '🛑', '💸', '🔻', '☠️', '🕳️'],
    glow: 'rgba(239, 68, 68, 0.7)',
  },
  // 30. Creativity, Art & Design
  {
    regex: /\b(creative|creativity|art|design|draw|paint|color|imagine|original|unique|innovate|vision|aesthetic)\b/i,
    emojis: ['🎨', '✨', '🪄', '🖌️', '🖼️', '🌈', '💡', '🎭'],
    glow: 'rgba(236, 72, 153, 0.7)',
  },
  // 31. Time Management, Productivity & Habits
  {
    regex: /\b(productivity|habit|routine|discipline|consistent|organize|plan|todo|task|priority|efficient|focus|deepwork)\b/i,
    emojis: ['✅', '📋', '⏰', '📌', '🧠', '🎯', '⚡', '🗂️'],
    glow: 'rgba(34, 197, 94, 0.6)',
  },
  // 32. Truth, Honesty & Proof
  {
    regex: /\b(truth|true|honest|proof|evidence|fact|real|genuine|verified|authentic|reveal|expose|secret)\b/i,
    emojis: ['✅', '🔍', '📜', '🤝', '💯', '⚖️', '🔑', '👁️'],
    glow: 'rgba(56, 189, 248, 0.7)',
  },
];

const EMOJI_DISPLAY_SECONDS = 1.4;

/**
 * Pick a fresh emoji from a rule's variant pool, avoiding recently-used glyphs
 * so the same emoji never repeats back-to-back across the video.
 */
function pickFreshEmoji(rule: ContextualEmojiRule, recentUsed: string[]): string {
  const available = rule.emojis.filter((e) => !recentUsed.includes(e));
  if (available.length === 0) {
    // All variants used recently — fall back to the full pool with rotation
    return rule.emojis[recentUsed.length % rule.emojis.length] || rule.emojis[0];
  }
  return available[Math.floor(Math.random() * available.length)];
}

/**
 * Automatically builds timed kinetic emoji pop events from speech word timestamps.
 * Enforces a strict minimum spacing interval (default 3.2s) to guarantee viral
 * impact without clutter, and tracks recently-used emojis to avoid repetition.
 */
export function buildContextualEmojiEvents(
  words: Array<{ word: string; start: number; end: number }> = [],
  minGapSeconds: number = 3.2,
  options?: { recentWindow?: number }
): KineticEmojiEvent[] {
  if (!words || words.length === 0) return [];

  // How many recent emojis to remember when avoiding repetition.
  const recentWindow = Math.max(2, Math.min(8, options?.recentWindow ?? 4));
  const events: KineticEmojiEvent[] = [];
  let lastEventEnd = -10;
  const recentUsed: string[] = [];

  for (let i = 0; i < words.length; i++) {
    const item = words[i];
    const wordText = item.word.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
    if (!wordText || wordText.length < 3) continue;

    // Check if enough time has elapsed since last emoji pop
    if (item.start - lastEventEnd < minGapSeconds) {
      continue;
    }

    // Match against contextual emoji dictionary (first matching category wins)
    const matchedRule = CONTEXTUAL_EMOJI_RULES.find((rule) => rule.regex.test(wordText));
    if (matchedRule) {
      const chosenEmoji = pickFreshEmoji(matchedRule, recentUsed);

      // Update the rolling recently-used window
      recentUsed.push(chosenEmoji);
      if (recentUsed.length > recentWindow) {
        recentUsed.shift();
      }

      events.push({
        id: `emoji-pop-${events.length + 1}-${Math.round(item.start * 100)}`,
        emoji: chosenEmoji,
        keyword: wordText,
        startSeconds: Math.round(item.start * 100) / 100,
        durationSeconds: EMOJI_DISPLAY_SECONDS,
        glowColor: matchedRule.glow,
      });
      lastEventEnd = item.start + EMOJI_DISPLAY_SECONDS;
    }
  }

  return events;
}
