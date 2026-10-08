/**
 * Three-Stage Typography Pipeline
 *
 * Stage 1: Semantic Parsing (The Copywriter)
 *   LLM tags each phrase by Function + Emotional Weight
 *
 * Stage 2: Design Strategy (The Art Director)
 *   Assigns a Typography Package based on video type/mood
 *
 * Stage 3: Kinetic Engine (The Motion Designer)
 *   Assigns motion intent that matches speech cadence + visual rhythm
 */

import { GoogleGenAI } from '@google/genai';
import {
  analyzeVisualHeatmap,
  calculateContentAwarePosition,
  detectAdaptiveContext,
  type SubjectPosition,
} from '../../lib/typography/anchorLogic';
import {
  buildKineticSync,
  detectMotivation,
  detectWordReactions,
  type MotionMotivation,
  type KineticSyncConfig,
  type WordReaction,
} from '../../lib/motion/kineticSync';
import { DEFAULT_FPS } from '../../remotion/constants';

// ── Stage 1: Semantic Parsing Types ───────────────────────────────────────────

export type TextFunction =
  | 'headline'
  | 'key_statistic'
  | 'emphasis'
  | 'speaker_name'
  | 'call_to_action'
  | 'question'
  | 'quote'
  | 'transition_phrase'
  | 'narration';

export type EmotionalWeight =
  | 'serious'
  | 'energetic'
  | 'urgent'
  | 'inspirational'
  | 'humorous'
  | 'authoritative'
  | 'calm'
  | 'dramatic'
  | 'neutral';

export type ParsedPhrase = {
  text: string;
  startTime: number;
  endTime: number;
  startWord: number;
  endWord: number;
  function: TextFunction;
  emotionalWeight: EmotionalWeight;
  importance: number; // 0–1, how much visual prominence this phrase deserves
};

// ── Stage 2: Design Strategy Types ────────────────────────────────────────────

export type TypographyPackageId =
  | 'documentary_elegant'
  | 'business_geometric'
  | 'creator_bold'
  | 'editorial_classic'
  | 'tech_minimal'
  | 'education_friendly';

export type TypographyPackage = {
  id: TypographyPackageId;
  label: string;
  primaryFont: string;
  secondaryFont: string;
  headlineWeight: number;
  headlineTracking: number;
  headlineCase: 'none' | 'uppercase' | 'capitalize';
  bodyWeight: number;
  bodyTracking: number;
  labelWeight: number;
  labelTracking: number;
  labelCase: 'uppercase' | 'capitalize';
  colorScheme: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
  };
  decorStyle: 'underline' | 'highlight' | 'box' | 'glow' | 'outline' | 'none';
};

// ── Stage 3: Kinetic Engine Types ─────────────────────────────────────────────

export type MotionIntent =
  | 'punch_in'       // Fast, impactful entry for emphasis words
  | 'typewriter'     // Character-by-character reveal synced to speech pace
  | 'slide_reveal'   // Smooth horizontal reveal following reading direction
  | 'scale_breathe'  // Gentle scale pulse matching speech rhythm
  | 'drop_settle'    // Gravity drop with spring settle
  | 'split_assemble' // Words split apart then assemble
  | 'fade_cascade'   // Words fade in one after another
  | 'static_hold'    // No motion — clean display for readability
  | 'exit_dissolve'; // Gentle fade out synced to phrase end

export type KineticText = ParsedPhrase & {
  package: TypographyPackageId;
  motionIntent: MotionIntent;
  motivation: MotionMotivation;
  wordSyncEvents: WordReaction[];
  entryDurationFrames: number;
  holdDurationFrames: number;
  exitDurationFrames: number;
  fontSize: number;
  fontWeight: number;
  letterSpacing: number;
  textTransform: 'none' | 'uppercase' | 'capitalize';
  opacity: number;
  color: string;
  accentColor: string;
  decorStyle: string;
  zIndex: number;
  positionY: 'top' | 'center' | 'bottom';
  adaptiveContext: string;
  anchor: {
    x: number;
    y: number;
    alignment: 'left' | 'center' | 'right';
    verticalAlign: 'top' | 'center' | 'bottom';
    maxWidth: number;
    region: string;
  };
};

// ── Stage 1: Semantic Parsing ─────────────────────────────────────────────────

export type SemanticParserInput = {
  transcript: string;
  words: Array<{ word: string; start: number; end: number }>;
  captions: Array<{ start: number; end: number; text: string }>;
  topicTitle?: string;
};

export async function parseSemanticText(input: SemanticParserInput): Promise<ParsedPhrase[]> {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY;
  if (apiKey && input.captions.length >= 2) {
    try {
      const result = await callGeminiCopywriter(input, apiKey);
      if (result.length >= 2) return result;
    } catch (error) {
      console.error('[TYPOGRAPHY_PIPELINE] Gemini semantic parsing failed:', error instanceof Error ? error.message : error);
    }
  }
  return buildFallbackParsing(input);
}

async function callGeminiCopywriter(input: SemanticParserInput, apiKey: string): Promise<ParsedPhrase[]> {
  const ai = new GoogleGenAI({ apiKey });

  const captionLines = input.captions.slice(0, 30).map((c, i) =>
    `[${i}] ${c.start.toFixed(1)}s–${c.end.toFixed(1)}s: "${c.text}"`
  ).join('\n');

  const prompt = [
    'You are a professional video copywriter. Analyze this transcript and tag each caption phrase.',
    '',
    `TOPIC: "${input.topicTitle || 'Video'}"`,
    '',
    'CAPTIONS:',
    captionLines,
    '',
    'For EACH caption, determine:',
    '1. function: one of "headline", "key_statistic", "emphasis", "speaker_name", "call_to_action", "question", "quote", "transition_phrase", "narration"',
    '2. emotionalWeight: one of "serious", "energetic", "urgent", "inspirational", "humorous", "authoritative", "calm", "dramatic", "neutral"',
    '3. importance: 0-1 float (how much visual prominence this phrase deserves)',
    '',
    'RULES:',
    '- Opening phrases are typically "headline" with high importance (0.8-1.0)',
    '- Numbers/statistics should be "key_statistic" with importance 0.7-0.9',
    '- Questions get "question" with importance 0.6-0.8',
    '- Final phrases are often "call_to_action" with importance 0.8-1.0',
    '- Most middle phrases are "narration" or "emphasis" with importance 0.3-0.6',
    '- Only 15-25% of phrases should have importance > 0.7',
    '',
    'OUTPUT: JSON array only. No markdown. Match the caption indices exactly.',
    '[{"index":0,"function":"headline","emotionalWeight":"energetic","importance":0.9}]',
  ].join('\n');

  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    config: { temperature: 0.3, maxOutputTokens: 2000 },
  });

  const text = (response.text || '').trim().replace(/^```(?:json)?\s*/, '').replace(/\s*```$/, '');
  const parsed = JSON.parse(text);

  if (!Array.isArray(parsed)) throw new Error('Invalid response format');

  const FUNCTIONS: TextFunction[] = ['headline', 'key_statistic', 'emphasis', 'speaker_name', 'call_to_action', 'question', 'quote', 'transition_phrase', 'narration'];
  const EMOTIONS: EmotionalWeight[] = ['serious', 'energetic', 'urgent', 'inspirational', 'humorous', 'authoritative', 'calm', 'dramatic', 'neutral'];

  return parsed
    .filter((item: Record<string, unknown>) => typeof item.index === 'number' && item.index < input.captions.length)
    .map((item: Record<string, unknown>) => {
      const idx = Number(item.index);
      const caption = input.captions[idx];
      // Find word indices
      const startWord = input.words.findIndex((w) => w.start >= caption.start - 0.1);
      const endWord = input.words.findIndex((w) => w.end >= caption.end - 0.1);
      return {
        text: caption.text,
        startTime: caption.start,
        endTime: caption.end,
        startWord: Math.max(0, startWord),
        endWord: Math.max(startWord, endWord >= 0 ? endWord : input.words.length - 1),
        function: FUNCTIONS.includes(item.function as TextFunction) ? item.function as TextFunction : 'narration',
        emotionalWeight: EMOTIONS.includes(item.emotionalWeight as EmotionalWeight) ? item.emotionalWeight as EmotionalWeight : 'neutral',
        importance: typeof item.importance === 'number' ? Math.min(1, Math.max(0, item.importance)) : 0.5,
      };
    });
}

function buildFallbackParsing(input: SemanticParserInput): ParsedPhrase[] {
  const { captions, words } = input;
  return captions.map((caption, i) => {
    const progress = captions.length > 1 ? i / (captions.length - 1) : 0.5;
    const text = caption.text.toLowerCase();

    let fn: TextFunction = 'narration';
    let emotion: EmotionalWeight = 'neutral';
    let importance = 0.4;

    // First caption → headline
    if (i === 0) { fn = 'headline'; emotion = 'energetic'; importance = 0.9; }
    // Last caption → CTA
    else if (i === captions.length - 1) { fn = 'call_to_action'; emotion = 'energetic'; importance = 0.85; }
    // Questions
    else if (text.includes('?')) { fn = 'question'; emotion = 'dramatic'; importance = 0.7; }
    // Numbers/statistics
    else if (/\d+%|\$\d|₹\d|\d+[xX]|\d+ (million|billion|crore|lakh)/.test(text)) { fn = 'key_statistic'; emotion = 'authoritative'; importance = 0.8; }
    // Emphasis indicators
    else if (/\b(important|key|critical|secret|rule|remember|never|always)\b/i.test(text)) { fn = 'emphasis'; emotion = 'serious'; importance = 0.7; }
    // Mid-section narration
    else { importance = 0.3 + progress * 0.2; }

    const startWord = words.findIndex((w) => w.start >= caption.start - 0.1);
    const endWord = words.findIndex((w) => w.end >= caption.end - 0.1);

    return {
      text: caption.text,
      startTime: caption.start,
      endTime: caption.end,
      startWord: Math.max(0, startWord),
      endWord: Math.max(startWord, endWord >= 0 ? endWord : words.length - 1),
      function: fn,
      emotionalWeight: emotion,
      importance,
    };
  });
}

// ── Stage 2: Design Strategy ──────────────────────────────────────────────────

const TYPOGRAPHY_PACKAGES: Record<TypographyPackageId, TypographyPackage> = {
  documentary_elegant: {
    id: 'documentary_elegant',
    label: 'Documentary Elegant',
    primaryFont: 'Playfair Display, serif',
    secondaryFont: 'Inter, sans-serif',
    headlineWeight: 700,
    headlineTracking: -0.02,
    headlineCase: 'none',
    bodyWeight: 400,
    bodyTracking: 0.01,
    labelWeight: 500,
    labelTracking: 0.14,
    labelCase: 'uppercase',
    colorScheme: { primary: '#F8FAFC', secondary: '#94A3B8', accent: '#D4AF37', background: 'rgba(0,0,0,0.6)' },
    decorStyle: 'underline',
  },
  business_geometric: {
    id: 'business_geometric',
    label: 'Business Geometric',
    primaryFont: 'Inter, sans-serif',
    secondaryFont: 'Inter, sans-serif',
    headlineWeight: 800,
    headlineTracking: -0.03,
    headlineCase: 'none',
    bodyWeight: 500,
    bodyTracking: 0,
    labelWeight: 600,
    labelTracking: 0.12,
    labelCase: 'uppercase',
    colorScheme: { primary: '#FFFFFF', secondary: '#CBD5E1', accent: '#22D3EE', background: 'rgba(15,23,42,0.75)' },
    decorStyle: 'box',
  },
  creator_bold: {
    id: 'creator_bold',
    label: 'Creator Bold',
    primaryFont: 'Inter, sans-serif',
    secondaryFont: 'Inter, sans-serif',
    headlineWeight: 900,
    headlineTracking: -0.04,
    headlineCase: 'uppercase',
    bodyWeight: 700,
    bodyTracking: 0,
    labelWeight: 800,
    labelTracking: 0.08,
    labelCase: 'uppercase',
    colorScheme: { primary: '#FFFFFF', secondary: '#E2E8F0', accent: '#F59E0B', background: 'rgba(0,0,0,0.5)' },
    decorStyle: 'highlight',
  },
  editorial_classic: {
    id: 'editorial_classic',
    label: 'Editorial Classic',
    primaryFont: 'Playfair Display, serif',
    secondaryFont: 'Inter, sans-serif',
    headlineWeight: 700,
    headlineTracking: -0.01,
    headlineCase: 'capitalize',
    bodyWeight: 400,
    bodyTracking: 0.02,
    labelWeight: 500,
    labelTracking: 0.16,
    labelCase: 'uppercase',
    colorScheme: { primary: '#FAFAF9', secondary: '#A8A29E', accent: '#EF4444', background: 'rgba(28,25,23,0.7)' },
    decorStyle: 'none',
  },
  tech_minimal: {
    id: 'tech_minimal',
    label: 'Tech Minimal',
    primaryFont: 'JetBrains Mono, monospace',
    secondaryFont: 'Inter, sans-serif',
    headlineWeight: 700,
    headlineTracking: -0.02,
    headlineCase: 'none',
    bodyWeight: 400,
    bodyTracking: 0.01,
    labelWeight: 500,
    labelTracking: 0.1,
    labelCase: 'uppercase',
    colorScheme: { primary: '#E2E8F0', secondary: '#64748B', accent: '#10B981', background: 'rgba(2,6,23,0.8)' },
    decorStyle: 'glow',
  },
  education_friendly: {
    id: 'education_friendly',
    label: 'Education Friendly',
    primaryFont: 'Inter, sans-serif',
    secondaryFont: 'Inter, sans-serif',
    headlineWeight: 800,
    headlineTracking: -0.01,
    headlineCase: 'none',
    bodyWeight: 500,
    bodyTracking: 0.01,
    labelWeight: 600,
    labelTracking: 0.1,
    labelCase: 'capitalize',
    colorScheme: { primary: '#FFFFFF', secondary: '#D1D5DB', accent: '#8B5CF6', background: 'rgba(30,20,60,0.65)' },
    decorStyle: 'highlight',
  },
};

export function selectTypographyPackage(context: {
  topicTitle?: string;
  transcript?: string;
  videoType?: string;
  mood?: string;
}): TypographyPackage {
  const text = [context.topicTitle, context.transcript, context.videoType, context.mood].filter(Boolean).join(' ').toLowerCase();

  // Documentary signals
  if (/documentary|history|story|narrative|journey|legacy|tradition/.test(text)) return TYPOGRAPHY_PACKAGES.documentary_elegant;
  // Tech signals
  if (/tech|code|developer|programming|api|software|startup|saas|app/.test(text)) return TYPOGRAPHY_PACKAGES.tech_minimal;
  // Business/finance signals
  if (/business|finance|investment|money|bank|corporate|roi|revenue|profit|startup/.test(text)) return TYPOGRAPHY_PACKAGES.business_geometric;
  // Education signals
  if (/education|learn|student|teacher|course|tutorial|explain|class|school|exam/.test(text)) return TYPOGRAPHY_PACKAGES.education_friendly;
  // Editorial/news
  if (/news|editorial|opinion|analysis|report|investigation/.test(text)) return TYPOGRAPHY_PACKAGES.editorial_classic;

  // Default: creator bold (works for most short-form content)
  return TYPOGRAPHY_PACKAGES.creator_bold;
}

export { TYPOGRAPHY_PACKAGES };

// ── Stage 3: Kinetic Engine ───────────────────────────────────────────────────

const FUNCTION_MOTION_MAP: Record<TextFunction, MotionIntent[]> = {
  headline: ['punch_in', 'drop_settle', 'scale_breathe'],
  key_statistic: ['punch_in', 'scale_breathe', 'slide_reveal'],
  emphasis: ['punch_in', 'drop_settle', 'split_assemble'],
  speaker_name: ['fade_cascade', 'slide_reveal', 'static_hold'],
  call_to_action: ['punch_in', 'scale_breathe', 'drop_settle'],
  question: ['typewriter', 'slide_reveal', 'fade_cascade'],
  quote: ['fade_cascade', 'typewriter', 'static_hold'],
  transition_phrase: ['slide_reveal', 'fade_cascade', 'static_hold'],
  narration: ['static_hold', 'fade_cascade', 'slide_reveal'],
};

const EMOTION_MOTION_BIAS: Record<EmotionalWeight, MotionIntent[]> = {
  energetic: ['punch_in', 'drop_settle', 'split_assemble'],
  urgent: ['punch_in', 'scale_breathe'],
  dramatic: ['drop_settle', 'scale_breathe', 'punch_in'],
  serious: ['static_hold', 'fade_cascade', 'slide_reveal'],
  inspirational: ['scale_breathe', 'fade_cascade', 'slide_reveal'],
  authoritative: ['static_hold', 'slide_reveal', 'punch_in'],
  calm: ['fade_cascade', 'static_hold', 'typewriter'],
  humorous: ['drop_settle', 'split_assemble', 'punch_in'],
  neutral: ['static_hold', 'fade_cascade', 'slide_reveal'],
};

function selectMotionIntent(phrase: ParsedPhrase): MotionIntent {
  const functionOptions = FUNCTION_MOTION_MAP[phrase.function] || FUNCTION_MOTION_MAP.narration;
  const emotionOptions = EMOTION_MOTION_BIAS[phrase.emotionalWeight] || EMOTION_MOTION_BIAS.neutral;

  // Find intersection: motions that satisfy both function and emotion
  const intersection = functionOptions.filter((m) => emotionOptions.includes(m));
  if (intersection.length) return intersection[Math.floor(Math.random() * intersection.length)];

  // High importance → first (most dramatic) option from function list
  if (phrase.importance > 0.7) return functionOptions[0];

  // Default: last (most subtle) option
  return functionOptions[functionOptions.length - 1];
}

function getTextSizeForFunction(fn: TextFunction, importance: number): number {
  const BASE_SIZES: Record<TextFunction, number> = {
    headline: 68,
    key_statistic: 60,
    emphasis: 52,
    call_to_action: 56,
    question: 48,
    quote: 44,
    speaker_name: 32,
    transition_phrase: 36,
    narration: 28,
  };
  const base = BASE_SIZES[fn] || 28;
  // Scale by importance (high importance → larger)
  return Math.round(base * (0.85 + importance * 0.3));
}

function getPositionForFunction(fn: TextFunction): 'top' | 'center' | 'bottom' {
  if (fn === 'headline' || fn === 'speaker_name') return 'top';
  if (fn === 'call_to_action') return 'bottom';
  return 'center';
}

// ── Full Pipeline ─────────────────────────────────────────────────────────────

export type TypographyPipelineInput = {
  transcript: string;
  words: Array<{ word: string; start: number; end: number }>;
  captions: Array<{ start: number; end: number; text: string }>;
  topicTitle?: string;
  videoType?: string;
  fps?: number;
  subjects?: SubjectPosition[];
};

export type TypographyPipelineResult = {
  phrases: KineticText[];
  package: TypographyPackage;
  source: 'gemini' | 'fallback';
};

export async function runTypographyPipeline(input: TypographyPipelineInput): Promise<TypographyPipelineResult> {
  const fps = input.fps || DEFAULT_FPS;

  // Stage 1: Semantic Parsing
  const parsed = await parseSemanticText({
    transcript: input.transcript,
    words: input.words,
    captions: input.captions,
    topicTitle: input.topicTitle,
  });
  const source = parsed.length > 0 && parsed[0].function !== 'narration' ? 'gemini' as const : 'fallback' as const;

  // Stage 2: Design Strategy
  const pkg = selectTypographyPackage({
    topicTitle: input.topicTitle,
    transcript: input.transcript,
    videoType: input.videoType,
  });

  // Content-aware positioning: analyze visual heatmap
  // For now use default subjects (empty = text gets full canvas); future: Gemini Vision provides subjects
  const subjects: SubjectPosition[] = input.subjects || [];
  const heatmap = analyzeVisualHeatmap(subjects, 1080, 1920);

  // Stage 3: Kinetic Engine + Anchor Logic
  const phrases: KineticText[] = parsed.map((phrase, i) => {
    const motionIntent = selectMotionIntent(phrase);
    const duration = phrase.endTime - phrase.startTime;
    const entryFrames = motionIntent === 'static_hold' ? 4 : motionIntent === 'typewriter' ? Math.round(duration * fps * 0.6) : Math.round(Math.min(14, duration * fps * 0.3));
    const exitFrames = Math.round(Math.min(8, duration * fps * 0.15));
    const holdFrames = Math.max(4, Math.round(duration * fps) - entryFrames - exitFrames);

    const isHighImportance = phrase.importance > 0.65;
    const fontSize = getTextSizeForFunction(phrase.function, phrase.importance);
    const fontWeight = isHighImportance ? pkg.headlineWeight : pkg.bodyWeight;
    const letterSpacing = isHighImportance ? pkg.headlineTracking : pkg.bodyTracking;
    const textTransform = isHighImportance ? pkg.headlineCase : 'none';

    // Content-aware anchor positioning
    const adaptiveContext = detectAdaptiveContext(phrase.function, phrase.importance);
    const position = calculateContentAwarePosition(heatmap, adaptiveContext, phrase.importance);

    // Motivated motion detection (motion justified by message)
    const motivation = detectMotivation(phrase.text, phrase.emotionalWeight);

    // Word-level sync events for kinetic reaction
    const phraseWords = input.words.slice(phrase.startWord, phrase.endWord + 1);
    const emphasisWords = phrase.function === 'narration' ? [] : phraseWords.filter((w) => w.word.length >= 5).slice(0, 2).map((w) => w.word);
    const wordSyncEvents = detectWordReactions(phraseWords, emphasisWords, fps);

    return {
      ...phrase,
      package: pkg.id,
      motionIntent,
      motivation,
      wordSyncEvents,
      entryDurationFrames: entryFrames,
      holdDurationFrames: holdFrames,
      exitDurationFrames: exitFrames,
      fontSize,
      fontWeight,
      letterSpacing,
      textTransform: textTransform as 'none' | 'uppercase' | 'capitalize',
      opacity: 0.7 + phrase.importance * 0.3,
      color: isHighImportance ? pkg.colorScheme.primary : pkg.colorScheme.secondary,
      accentColor: pkg.colorScheme.accent,
      decorStyle: isHighImportance ? pkg.decorStyle : 'none',
      zIndex: Math.round(10 + phrase.importance * 10),
      positionY: getPositionForFunction(phrase.function),
      adaptiveContext,
      anchor: {
        x: position.x,
        y: position.y,
        alignment: position.alignment,
        verticalAlign: position.verticalAlign,
        maxWidth: position.maxWidth,
        region: position.region,
      },
    };
  });

  return { phrases, package: pkg, source };
}
