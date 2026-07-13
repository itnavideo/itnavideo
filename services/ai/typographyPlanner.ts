/**
 * Typography Video Planner
 *
 * Analyzes transcript and picks important keywords/numbers/phrases
 * to display as big bold text overlays synced to speech.
 *
 * Rules:
 * - Pick 1 keyword every 4-8 seconds (not too many, not too few)
 * - Prefer: numbers, money amounts, strong verbs, key nouns
 * - Each keyword stays 2-3.5 seconds on screen
 * - Alternate colors and sizes for variety
 * - Position: top for numbers, center for single words, bottom-mid for phrases
 */

type KeywordHit = {
  word: string;
  start: number;
  end: number;
  color: string;
  size: 'huge' | 'large' | 'medium';
  position: 'top' | 'center' | 'bottom-mid';
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

// ── Colors (semi-transparent, like the reference video) ───────────────────────

const COLORS = [
  'rgba(148, 163, 184, 0.7)',   // slate silver
  'rgba(248, 250, 252, 0.8)',   // bright white
  'rgba(148, 163, 184, 0.7)',   // slate
  'rgba(96, 165, 250, 0.65)',   // blue
  'rgba(248, 250, 252, 0.8)',   // white
  'rgba(167, 139, 250, 0.6)',   // purple
];

// ── Keywords detection patterns ───────────────────────────────────────────────

const MONEY_PATTERN = /\$[\d,]+\.?\d*\s*[kmbt]?(?:illion|ousand)?|\d+\s*(?:crore|lakh|million|billion|thousand|rupees|dollars|rs|₹)/i;
const NUMBER_PATTERN = /\b\d[\d,.]*%?\b/;
const STRONG_WORDS = new Set([
  'sold', 'earned', 'made', 'lost', 'spent', 'invested', 'grew', 'dropped',
  'million', 'billion', 'crore', 'lakh', 'thousand',
  'never', 'always', 'every', 'only', 'first', 'last', 'best', 'worst',
  'secret', 'trick', 'hack', 'mistake', 'truth', 'lie', 'real', 'fake',
  'free', 'paid', 'expensive', 'cheap', 'rich', 'poor',
  'win', 'lose', 'fail', 'success', 'profit', 'loss',
  'stop', 'start', 'quit', 'build', 'destroy', 'create',
  'roughly', 'exactly', 'literally', 'actually', 'basically',
]);

// ── Main planner ──────────────────────────────────────────────────────────────

export function planTypographyVideo(input: TypographyPlanInput): TypographyPlan {
  const { words, segments, durationSeconds } = input;
  if (!words.length && !segments.length) return { keywords: [], source: 'deterministic' };

  const keywords: KeywordHit[] = [];
  let colorIndex = 0;
  const MIN_GAP = 2.0; // minimum 2 seconds between keywords (tighter = more keywords)
  let lastKeywordEnd = 0;

  // Strategy: pick 2-3 word phrases from every segment
  // This ensures keywords appear throughout the full video, not just where "strong" words are
  for (const seg of segments) {
    if (seg.start < lastKeywordEnd + MIN_GAP) continue;
    if (seg.start >= durationSeconds - 1) break;

    const segWords = seg.text.trim().split(/\s+/);
    if (segWords.length < 2) continue;

    // Pick 2-3 important words from this segment
    let displayText = '';
    let size: KeywordHit['size'] = 'large';
    let position: KeywordHit['position'] = 'center';

    // Check for money/numbers first
    const moneyMatch = seg.text.match(MONEY_PATTERN);
    if (moneyMatch) {
      displayText = shortenMoney(moneyMatch[0]);
      size = 'huge';
      position = 'top';
    } else if (NUMBER_PATTERN.test(seg.text)) {
      // Number with context: take number + next word
      const numMatch = seg.text.match(/(\d[\d,.]*%?\s*\w+)/);
      displayText = numMatch ? numMatch[1].trim() : segWords.slice(0, 2).join(' ');
      size = 'huge';
      position = 'top';
    } else {
      // Pick 2-3 most meaningful words from the segment
      const meaningful = segWords.filter(w => w.length >= 3 && !/^(the|and|for|but|with|that|this|from|have|are|was|were|been|will|can|its|not|our|your)$/i.test(w));
      if (meaningful.length >= 3) {
        displayText = meaningful.slice(0, 3).join(' ');
      } else if (meaningful.length >= 2) {
        displayText = meaningful.slice(0, 2).join(' ');
      } else if (segWords.length >= 2) {
        displayText = segWords.slice(0, 3).join(' ');
      } else {
        displayText = segWords[0];
      }
      size = displayText.length > 15 ? 'medium' : 'large';
      position = 'center';
    }

    if (!displayText || displayText.length < 3) continue;

    const holdDuration = Math.min(3.0, (seg.end - seg.start) * 0.8);
    keywords.push({
      word: displayText.slice(0, 25),
      start: seg.start,
      end: Math.min(seg.start + holdDuration, durationSeconds - 0.5),
      color: COLORS[colorIndex % COLORS.length],
      size,
      position,
    });
    colorIndex++;
    lastKeywordEnd = seg.start + holdDuration;
  }

  // If still too few keywords (less than 1 per 5 seconds), fill gaps from word-level data
  const targetCount = Math.max(4, Math.floor(durationSeconds / 4));
  if (keywords.length < targetCount && words.length > 0) {
    const spacing = durationSeconds / targetCount;
    for (let t = 2; t < durationSeconds - 2; t += spacing) {
      if (keywords.length >= targetCount) break;
      if (keywords.some(k => Math.abs(k.start - t) < MIN_GAP)) continue;

      // Find 2-3 consecutive words near this time
      const nearIdx = words.findIndex(w => w.start >= t);
      if (nearIdx >= 0 && nearIdx + 1 < words.length) {
        const phrase = words.slice(nearIdx, nearIdx + 3).map(w => w.word).join(' ');
        if (phrase.length >= 4) {
          keywords.push({
            word: phrase.slice(0, 22),
            start: words[nearIdx].start,
            end: Math.min(words[nearIdx].start + 2.5, durationSeconds - 0.5),
            color: COLORS[colorIndex % COLORS.length],
            size: 'large',
            position: 'center',
          });
          colorIndex++;
        }
      }
    }
  }

  // Sort by time
  keywords.sort((a, b) => a.start - b.start);

  return {
    keywords,
    source: 'deterministic',
  };
}

// ── Helper: shorten money text ────────────────────────────────────────────────

function shortenMoney(text: string): string {
  // "17 million" → "$17 M", "23 million" → "$23 M"
  const m = text.match(/(\d[\d,.]*)\s*(million|billion|crore|lakh|thousand)/i);
  if (m) {
    const num = m[1];
    const unit = m[2].toLowerCase();
    const short = unit === 'million' ? 'M' : unit === 'billion' ? 'B' : unit === 'crore' ? 'Cr' : unit === 'lakh' ? 'L' : 'K';
    return `$${num} ${short}`;
  }
  // Already has $ sign
  if (text.startsWith('$')) return text;
  return text;
}
