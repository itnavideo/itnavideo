/**
 * Typography Video Planner
 *
 * Analyzes transcript and picks the most important keywords/phrases to
 * display as large, premium text overlays synced to speech.
 *
 * This template targets a premium/corporate/luxury audience (real estate,
 * high-end business, personal brand, coaching) — so the planner favors
 * confident, punchy statement fragments over generic filler words.
 *
 * Rules:
 * - Pick 1 keyword every ~3-6 seconds (breathable, not spammy)
 * - Prefer: numbers, money amounts, power/emphasis words, short declarative phrases
 * - Each keyword stays 2-3.5 seconds on screen
 * - Alternate emphasis levels (headline vs supporting) for visual rhythm
 * - Position: top for stats/numbers, center for single power words, bottom-mid for phrases
 */

type KeywordHit = {
  word: string;
  start: number;
  end: number;
  color: string;
  size: 'huge' | 'large' | 'medium';
  position: 'top' | 'center' | 'bottom-mid';
  emphasis?: 'headline' | 'support';
};

type TypographyPlanInput = {
  transcript: string;
  words: Array<{ word: string; start: number; end: number }>;
  segments: Array<{ start: number; end: number; text: string }>;
  durationSeconds: number;
};

type TypographyPlan = {
  keywords: KeywordHit[];
  source: 'deterministic';
};

// ── Colors (semi-transparent, style-agnostic — actual color is applied by the template) ──

const COLORS = [
  'rgba(248, 250, 252, 0.85)',
  'rgba(203, 213, 225, 0.75)',
  'rgba(248, 250, 252, 0.85)',
  'rgba(203, 213, 225, 0.75)',
];

// ── Keyword detection patterns ─────────────────────────────────────────────────

const MONEY_PATTERN = /\$[\d,]+\.?\d*\s*[kmbt]?(?:illion|ousand)?|\d+\s*(?:crore|lakh|million|billion|thousand|rupees|dollars|rs|₹)/i;
const NUMBER_PATTERN = /\b\d[\d,.]*%?\b/;

// Stop words excluded when picking meaningful phrase fragments.
// Includes English + common Roman Hinglish fillers/particles so Hinglish content
// (a core audience) doesn't produce keyword overlays full of "hai / ka / ki / toh".
const STOP_WORDS = /^(the|and|for|but|with|that|this|from|have|are|was|were|been|will|can|its|not|our|your|you|what|how|who|to|of|in|on|a|an|is|it|be|as|at|so|if|or|we|i|do|did|does|just|out|up|when|then|than|there|their|they|them|about|hai|hain|tha|thi|the|ka|ki|ke|ko|kaa|kii|se|me|mein|par|pe|aur|toh|to|ye|yeh|wo|woh|ho|hoga|hogi|kya|kyun|kaise|jab|tab|ab|bhi|hi|na|nahi|nahin|ek|do|ki|jo|jaise|liye|apne|apni|mera|meri|tera|teri|uska|uski|iska|iski|hum|tum|main|mai)$/i;

// Power/emphasis vocabulary tuned for premium, corporate, real-estate, motivational,
// and finance content — the audience this template is built for.
const POWER_WORDS = new Set([
  // outcome / results
  'sold', 'earned', 'made', 'lost', 'spent', 'invested', 'grew', 'dropped', 'closed', 'delivered',
  'million', 'billion', 'crore', 'lakh', 'thousand', 'profit', 'loss', 'revenue', 'roi', 'equity',
  // absolutes / emphasis
  'never', 'always', 'every', 'only', 'first', 'last', 'best', 'worst', 'nobody', 'everyone',
  // premium / luxury
  'luxury', 'premium', 'exclusive', 'elite', 'legacy', 'iconic', 'signature', 'prestige',
  'penthouse', 'skyline', 'oceanfront', 'estate', 'portfolio',
  // truth / insight
  'secret', 'truth', 'real', 'fake', 'actually', 'literally', 'exactly', 'roughly',
  // mindset / motivational
  'discipline', 'freedom', 'consistency', 'growth', 'mindset', 'vision', 'purpose', 'leverage',
  'network', 'wealth', 'success', 'failure', 'risk', 'reward', 'patience', 'focus',
  // action verbs
  'stop', 'start', 'quit', 'build', 'destroy', 'create', 'scale', 'launch', 'commit',
  // finance
  'free', 'paid', 'expensive', 'cheap', 'rich', 'poor', 'win', 'lose', 'fail', 'success',
  // ── Roman Hinglish power words (core audience) ──
  // money / results
  'paisa', 'paise', 'kamai', 'kamaya', 'kamao', 'munafa', 'nuksan', 'bacha', 'bachao',
  'crorepati', 'ameer', 'garib', 'daulat', 'dhan', 'salary', 'income',
  // effort / mindset
  'mehnat', 'sapna', 'sapne', 'safalta', 'kamyabi', 'kamyab', 'asafal', 'jeet', 'haar',
  'himmat', 'josh', 'junoon', 'lagan', 'anushasan', 'sabar', 'vishwas', 'soch', 'badlav',
  // emphasis / absolutes
  'kabhi', 'hamesha', 'sabse', 'bilkul', 'zaroori', 'zaruri', 'asli', 'nakli', 'sach', 'jhooth',
  'sirf', 'pehla', 'aakhri', 'behtareen', 'sabka',
  // action
  'shuru', 'karo', 'seekho', 'banao', 'badlo', 'jeeto', 'socho', 'samjho', 'dekho',
  // premium
  'shandaar', 'behtareen', 'mahal', 'luxury', 'khaas',
]);

// ── Main planner ──────────────────────────────────────────────────────────────

export function planTypographyVideo(input: TypographyPlanInput): TypographyPlan {
  const { words, segments, durationSeconds } = input;
  if (!words.length && !segments.length) return { keywords: [], source: 'deterministic' };

  const keywords: KeywordHit[] = [];
  let colorIndex = 0;
  const MIN_GAP = 2.4; // breathable pacing — premium feel, not a spam wall of text
  let lastKeywordEnd = 0;

  for (const seg of segments) {
    if (seg.start < lastKeywordEnd + MIN_GAP) continue;
    if (seg.start >= durationSeconds - 1) break;

    const segWords = seg.text.trim().split(/\s+/).filter(Boolean);
    if (segWords.length < 1) continue;

    let displayText = '';
    let size: KeywordHit['size'] = 'large';
    let position: KeywordHit['position'] = 'center';
    let emphasis: KeywordHit['emphasis'] = 'support';

    const moneyMatch = seg.text.match(MONEY_PATTERN);
    const powerHits = segWords.filter((w) => POWER_WORDS.has(cleanWord(w)));

    if (moneyMatch) {
      displayText = shortenMoney(moneyMatch[0]);
      size = 'huge';
      position = 'top';
      emphasis = 'headline';
    } else if (NUMBER_PATTERN.test(seg.text)) {
      const numMatch = seg.text.match(/(\d[\d,.]*%?\s*\w+)/);
      displayText = numMatch ? numMatch[1].trim() : segWords.slice(0, 2).join(' ');
      size = 'huge';
      position = 'top';
      emphasis = 'headline';
    } else if (powerHits.length > 0) {
      // Build a short punchy phrase anchored on the power word (up to 3 words)
      const anchorIndex = segWords.findIndex((w) => cleanWord(w) === cleanWord(powerHits[0]));
      const start = Math.max(0, anchorIndex - 1);
      displayText = segWords.slice(start, start + 3).filter((w) => !STOP_WORDS.test(w)).join(' ') || powerHits[0];
      size = powerHits.length > 1 || displayText.split(' ').length === 1 ? 'huge' : 'large';
      position = 'center';
      emphasis = 'headline';
    } else {
      const meaningful = segWords.filter((w) => w.length >= 3 && !STOP_WORDS.test(w));
      if (meaningful.length >= 3) {
        displayText = meaningful.slice(0, 3).join(' ');
      } else if (meaningful.length >= 2) {
        displayText = meaningful.slice(0, 2).join(' ');
      } else if (segWords.length >= 2) {
        displayText = segWords.slice(0, 3).join(' ');
      } else {
        displayText = segWords[0];
      }
      size = displayText.split(' ').length >= 3 ? 'medium' : 'large';
      position = 'bottom-mid';
      emphasis = 'support';
    }

    if (!displayText || displayText.length < 2) continue;

    // Hold text for 2.2-3.2 seconds — long enough to read comfortably, short enough to feel dynamic
    const holdDuration = Math.max(2.2, Math.min(3.2, (seg.end - seg.start) * 0.9));
    keywords.push({
      word: cleanDisplayText(displayText),
      start: seg.start,
      end: Math.min(seg.start + holdDuration, durationSeconds - 0.3),
      color: COLORS[colorIndex % COLORS.length],
      size,
      position,
      emphasis,
    });
    colorIndex++;
    lastKeywordEnd = seg.start + holdDuration;
  }

  // Gentle fill: ensure at least one keyword every ~5 seconds without overcrowding the screen
  const targetCount = Math.max(4, Math.ceil(durationSeconds / 5));
  if (keywords.length < targetCount && words.length > 0) {
    const spacing = durationSeconds / (targetCount + 1);
    for (let t = 2; t < durationSeconds - 1.5; t += spacing) {
      if (keywords.length >= targetCount) break;
      if (keywords.some((k) => Math.abs(k.start - t) < MIN_GAP)) continue;

      const nearIdx = words.findIndex((w) => w.start >= t - 0.5);
      if (nearIdx >= 0 && nearIdx + 1 < words.length) {
        const phraseWords = words.slice(nearIdx, nearIdx + Math.min(3, words.length - nearIdx))
          .filter((w) => !STOP_WORDS.test(w.word));
        const phrase = phraseWords.map((w) => w.word).join(' ');
        if (phrase.length >= 3) {
          keywords.push({
            word: cleanDisplayText(phrase),
            start: phraseWords[0].start,
            end: Math.min(phraseWords[0].start + 2.6, durationSeconds - 0.3),
            color: COLORS[colorIndex % COLORS.length],
            size: 'large',
            position: 'center',
            emphasis: 'support',
          });
          colorIndex++;
        }
      }
    }
  }

  keywords.sort((a, b) => a.start - b.start);

  return {
    keywords,
    source: 'deterministic',
  };
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function cleanWord(word: string): string {
  return word.toLowerCase().replace(/[^a-z0-9]/g, '');
}

function cleanDisplayText(text: string): string {
  return text.replace(/[,.;:!?]+$/g, '').trim().slice(0, 26);
}

function shortenMoney(text: string): string {
  const m = text.match(/(\d[\d,.]*)\s*(million|billion|crore|lakh|thousand)/i);
  if (m) {
    const num = m[1];
    const unit = m[2].toLowerCase();
    const short = unit === 'million' ? 'M' : unit === 'billion' ? 'B' : unit === 'crore' ? 'Cr' : unit === 'lakh' ? 'L' : 'K';
    return `$${num} ${short}`;
  }
  if (text.startsWith('$')) return text;
  return text;
}
