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
  const { words, durationSeconds } = input;
  if (!words.length) return { keywords: [], source: 'deterministic' };

  const keywords: KeywordHit[] = [];
  let lastKeywordEnd = 0;
  const MIN_GAP = 3.5; // minimum seconds between keywords
  let colorIndex = 0;

  for (let i = 0; i < words.length; i++) {
    const w = words[i];
    if (w.start < lastKeywordEnd + MIN_GAP) continue;
    if (w.start >= durationSeconds - 2) break;

    const wordText = w.word.trim();
    const lowerWord = wordText.toLowerCase().replace(/[.,!?;:'"]/g, '');

    // Check if this word is "important"
    let isImportant = false;
    let displayText = wordText;
    let size: KeywordHit['size'] = 'large';
    let position: KeywordHit['position'] = 'center';

    // Check for money/numbers (combine with next words if needed)
    const contextText = words.slice(i, Math.min(i + 4, words.length)).map(x => x.word).join(' ');

    const moneyMatch = contextText.match(MONEY_PATTERN);
    if (moneyMatch && contextText.indexOf(moneyMatch[0]) === 0) {
      isImportant = true;
      displayText = moneyMatch[0].replace(/\s+/g, ' ').trim();
      // Shorten: "17 million" → "$17 M"
      displayText = shortenMoney(displayText);
      size = 'huge';
      position = 'top';
      // Extend end time to cover all words in the match
      const matchWordCount = moneyMatch[0].split(/\s+/).length;
      const endWord = words[Math.min(i + matchWordCount - 1, words.length - 1)];
      keywords.push({
        word: displayText,
        start: w.start,
        end: Math.max(endWord.end, w.start + 2.5),
        color: COLORS[colorIndex % COLORS.length],
        size,
        position,
      });
      colorIndex++;
      lastKeywordEnd = Math.max(endWord.end, w.start + 2.5);
      continue;
    }

    // Check for standalone numbers
    if (NUMBER_PATTERN.test(wordText)) {
      isImportant = true;
      size = 'huge';
      position = 'top';
      displayText = wordText;
    }

    // Check for strong words
    if (!isImportant && STRONG_WORDS.has(lowerWord) && lowerWord.length >= 4) {
      isImportant = true;
      size = lowerWord.length <= 6 ? 'huge' : 'large';
      position = 'center';
      displayText = lowerWord;
    }

    // Check for ALL CAPS words in original
    if (!isImportant && wordText === wordText.toUpperCase() && wordText.length >= 3 && /[A-Z]/.test(wordText)) {
      isImportant = true;
      size = 'large';
      position = 'center';
      displayText = wordText;
    }

    if (isImportant) {
      const holdDuration = size === 'huge' ? 3.0 : size === 'large' ? 2.5 : 2.0;
      keywords.push({
        word: displayText,
        start: w.start,
        end: Math.min(w.start + holdDuration, durationSeconds - 1),
        color: COLORS[colorIndex % COLORS.length],
        size,
        position,
      });
      colorIndex++;
      lastKeywordEnd = w.start + holdDuration;
    }
  }

  // If too few keywords found (< 3 for a 30s+ video), add some from segments
  if (keywords.length < 3 && durationSeconds > 15) {
    const existingTimes = new Set(keywords.map(k => Math.floor(k.start)));
    const spacing = durationSeconds / 6;

    for (let t = 4; t < durationSeconds - 4; t += spacing) {
      if (keywords.length >= 8) break;
      if (existingTimes.has(Math.floor(t))) continue;

      // Find the word closest to this time
      const nearWord = words.find(w => w.start >= t && w.start < t + 2 && w.word.length >= 4);
      if (nearWord) {
        keywords.push({
          word: nearWord.word.toLowerCase(),
          start: nearWord.start,
          end: nearWord.start + 2.5,
          color: COLORS[colorIndex % COLORS.length],
          size: 'large',
          position: 'center',
        });
        colorIndex++;
        existingTimes.add(Math.floor(nearWord.start));
      }
    }
  }

  // Sort by time
  keywords.sort((a, b) => a.start - b.start);

  // Cap at reasonable number (1 per 5 seconds average)
  const maxKeywords = Math.ceil(durationSeconds / 5);
  return {
    keywords: keywords.slice(0, maxKeywords),
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
