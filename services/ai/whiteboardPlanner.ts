/**
 * Deterministic Whiteboard Planner
 *
 * Converts the current Groq transcript into a capacity-safe whiteboard plan.
 * It intentionally uses no secondary AI provider: text, timing, and board
 * density are derived locally from the render window selected for this job.
 */

export type WhiteboardPoint = {
  text: string;
  startTime: number;
  endTime: number;
  markerColor: string;
  bulletType: 'number' | 'bullet' | 'check' | 'arrow' | 'star';
  isHighlight?: boolean;
  icon?: string;
};

export type WhiteboardPlan = {
  title: string;
  titleColor: string;
  points: WhiteboardPoint[];
  conclusion: string;
  conclusionTime: number;
  source: 'deterministic';
};

export type WhiteboardPlanInput = {
  transcript: string;
  segments: Array<{start: number; end: number; text: string}>;
  durationSeconds: number;
  topicTitle?: string;
  boardStyle?: string;
};

const COLORS = {
  title: '#1E3A5F',
  blue: '#2563EB',
  red: '#DC2626',
  green: '#16A34A',
};

const POINT_COLORS = [COLORS.blue, COLORS.green, COLORS.blue, COLORS.blue];
const ICON_ROTATION = ['arrow', 'checkmark', 'lightbulb'];
// A single board needs calm, readable pacing. Up to four concise beats stay
// readable; the renderer's board config caps this further per image safe-zone.
const MAX_BOARD_POINTS = 4;

function cleanText(value: string) {
  return String(value || '')
    .replace(/[\r\n]+/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/[“”]/g, '')
    .trim();
}

// Leading filler/discourse words (English + Roman Hinglish) that add no meaning to a
// board point. Stripped from the START of a segment so the point begins on substance.
const LEADING_FILLER = new Set([
  // english
  'so', 'and', 'but', 'well', 'okay', 'ok', 'now', 'basically', 'actually', 'literally',
  'like', 'just', 'you', 'know', 'i', 'mean', 'right', 'see', 'look', 'yeah', 'um', 'uh',
  'the', 'a', 'an', 'then', 'also', 'because', 'if', 'when', 'that', 'this', 'we', 'they',
  // roman hinglish
  'toh', 'to', 'aur', 'lekin', 'par', 'matlab', 'yaar', 'dekho', 'suno', 'haan', 'accha',
  'bas', 'phir', 'ab', 'jab', 'kyunki', 'agar', 'ye', 'yeh', 'wo', 'woh', 'hum', 'main', 'mai',
]);

function cleanWord(word: string): string {
  return word.toLowerCase().replace(/[^a-z0-9]/g, '');
}

/**
 * Extracts a concise, meaningful board point from a raw transcript segment.
 * Strips leading filler/discourse words so the point begins on substance
 * (e.g. "So basically the main thing" → "main thing"), then keeps the first
 * few content words within the character budget.
 */
function extractPoint(value: string, maxWords: number, maxChars: number) {
  const words = cleanText(value).split(/\s+/).filter(Boolean);
  // Drop leading filler, but never strip the whole line away.
  let start = 0;
  while (start < words.length - 1 && LEADING_FILLER.has(cleanWord(words[start]))) start += 1;
  const meaningful = words.slice(start);
  let result = meaningful.slice(0, maxWords).join(' ');
  if (result.length > maxChars) result = result.slice(0, maxChars).trimEnd();
  result = result.replace(/[,:;.!?]+$/, '').trim();
  return result || cleanText(value).slice(0, maxChars) || 'Key idea';
}

function shorten(value: string, maxWords: number, maxChars: number) {
  const words = cleanText(value).split(/\s+/).filter(Boolean);
  let result = words.slice(0, maxWords).join(' ');
  if (result.length > maxChars) result = result.slice(0, maxChars).trimEnd();
  return result.replace(/[,:;.!?]+$/, '') || 'Key idea';
}

function getBoardCapacity() {
  return MAX_BOARD_POINTS;
}

function buildTranscriptSegments(transcript: string, durationSeconds: number) {
  const sentences = cleanText(transcript)
    .split(/(?<=[.!?])\s+/)
    .map((text) => cleanText(text))
    .filter((text) => text.split(/\s+/).length >= 3);
  const step = Math.max(2.8, durationSeconds / Math.max(1, sentences.length + 1));

  return sentences.map((text, index) => ({
    text,
    start: (index + 1) * step,
    end: (index + 2) * step,
  }));
}

function selectSpacedSegments(
  segments: Array<{start: number; end: number; text: string}>,
  count: number,
) {
  if (segments.length <= count) return segments;

  const selected: Array<{start: number; end: number; text: string}> = [];
  for (let index = 0; index < count; index += 1) {
    const sourceIndex = Math.min(
      segments.length - 1,
      Math.max(0, Math.round(((index + 0.5) * segments.length) / count - 0.5)),
    );
    const candidate = segments[sourceIndex];
    if (!selected.some((item) => item.text === candidate.text)) selected.push(candidate);
  }
  return selected;
}

function inferBulletType(text: string): WhiteboardPoint['bulletType'] {
  // English + Roman Hinglish cues
  if (/\b(first|second|third|step|then|next|pehla|pehle|doosra|doosri|teesra|kadam|phir|agla)\b/i.test(text)) return 'number';
  if (/\b(avoid|never|risk|warning|mistake|bacho|bacha|mat|galti|khatra|nuksan|kabhi)\b/i.test(text)) return 'arrow';
  if (/\b(should|must|focus|remember|always|chahiye|zaroori|zaruri|dhyan|yaad|hamesha|karo)\b/i.test(text)) return 'check';
  return 'bullet';
}

function inferIcon(text: string, index: number) {
  if (/\b(idea|learn|think|understand|soch|socho|samajh|samjho|seekho|seekh|vichar)\b/i.test(text)) return 'lightbulb';
  if (/\b(result|win|success|important|jeet|kamyabi|safalta|natija|zaroori|mahatvapurn|badhiya)\b/i.test(text)) return 'star';
  if (/\b(check|focus|build|improve|banao|sudhaar|dhyan|karo|behtar)\b/i.test(text)) return 'checkmark';
  return ICON_ROTATION[index % ICON_ROTATION.length];
}

export async function planWhiteboardVideo(input: WhiteboardPlanInput): Promise<WhiteboardPlan> {
  const durationSeconds = Math.max(8, Number(input.durationSeconds) || 45);
  const capacity = getBoardCapacity();
  const sourceSegments = input.segments
    .map((segment) => ({
      start: Math.max(0, Number(segment.start) || 0),
      end: Math.max(0, Number(segment.end) || 0),
      text: cleanText(segment.text),
    }))
    .filter((segment) => segment.text.split(/\s+/).length >= 3);
  const candidates = sourceSegments.length > 0
    ? sourceSegments
    : buildTranscriptSegments(input.transcript, durationSeconds);
  const pointStart = 3.2;
  const conclusionWindow = 3.15;
  const availablePointTime = Math.max(2.6, durationSeconds - pointStart - conclusionWindow);
  const maxByTiming = Math.max(1, Math.floor(availablePointTime / 2.55));
  const pointCount = Math.min(capacity, candidates.length || 1, maxByTiming);
  const selected = selectSpacedSegments(candidates, pointCount);
  const title = shorten(input.topicTitle || candidates[0]?.text || input.transcript || 'Key Points', 3, 26);
  const pointInterval = availablePointTime / Math.max(1, selected.length);
  const conclusionTime = Math.min(
    durationSeconds - 2.8,
    Math.max(pointStart + selected.length * pointInterval + 0.1, durationSeconds - conclusionWindow),
  );

  const points = selected.map((segment, index) => {
    const startTime = pointStart + index * pointInterval;
    const endTime = Math.min(conclusionTime - 0.28, startTime + Math.max(2.35, pointInterval - 0.35));
    const isHighlight = index === Math.floor(selected.length / 2);
    const text = extractPoint(segment.text, 5, 34);

    return {
      text,
      startTime: Number(startTime.toFixed(2)),
      endTime: Number(Math.max(startTime + 0.8, endTime).toFixed(2)),
      markerColor: isHighlight ? COLORS.red : POINT_COLORS[index % POINT_COLORS.length],
      bulletType: inferBulletType(text),
      isHighlight,
      icon: inferIcon(text, index),
    };
  });


  const finalPointEnd = points.length ? points[points.length - 1].endTime : pointStart;
  const normalizedConclusionTime = Number(Math.min(
    durationSeconds - 0.8,
    Math.max(finalPointEnd + 0.5, conclusionTime),
  ).toFixed(2));

  // A short takeaway recap ties the board together. Derived locally from the
  // strongest (highlighted) point, or the title, so no extra AI call is needed.
  const conclusion = buildConclusion(points, title);

  return {
    title,
    titleColor: COLORS.title,
    points,
    conclusion,
    conclusionTime: normalizedConclusionTime,
    source: 'deterministic',
  };
}

/** Builds a short board takeaway from the highlighted point or the title. */
function buildConclusion(points: WhiteboardPoint[], title: string): string {
  if (!points.length) return '';
  const highlight = points.find((point) => point.isHighlight) || points[points.length - 1];
  const source = cleanText(highlight.text) || cleanText(title);
  if (!source) return '';
  const short = shorten(source, 4, 28);
  return short && short !== 'Key idea' ? short : '';
}
