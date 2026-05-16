import type { VoiceoverAnalysis } from './voiceAnalysis';
import type { VideoScriptPlan } from './scriptPlanner';
import { generateGeminiJson, hasGeminiApiKey } from './gemini';
import { MULTILINGUAL_VIDEO_RULE } from './multilingualRules';

type SubtitleStyleName = 'alex_hormozi' | 'iman_gadzhi' | 'cinematic' | 'reels' | 'modern' | 'minimal';
type SubtitleAnimation = 'pop' | 'bounce' | 'slide_up' | 'fade' | 'scale' | 'karaoke_fill';

type SubtitleWord = {
  text: string;
  start: number;
  end: number;
  highlight: boolean;
  emphasis: 'normal' | 'strong' | 'keyword';
};

type SubtitleCue = {
  id: string;
  start: number;
  end: number;
  text: string;
  words: SubtitleWord[];
  activeWordIndexes: number[];
  lineBreak: 'single' | 'two_line';
  sceneId?: string;
  animation: SubtitleAnimation;
  position: {
    x: 'center';
    y: 'lower_safe' | 'middle' | 'upper_safe';
  };
};

export type SubtitlePlan = {
  style: SubtitleStyleName;
  mode: 'captions' | 'word_highlight' | 'karaoke' | 'animated';
  safeZone: {
    platform: 'reels_tiktok_shorts';
    verticalPaddingPercent: number;
    horizontalPaddingPercent: number;
  };
  preset: {
    fontFamily: string;
    fontWeight: number;
    fontSize: number;
    textTransform: 'uppercase' | 'sentence';
    textColor: string;
    highlightColor: string;
    strokeColor: string;
    strokeWidth: number;
    backgroundColor: string | null;
    shadow: string;
    maxWordsPerCue: number;
  };
  cues: SubtitleCue[];
  renderHints: {
    useKaraokeMask: boolean;
    animatePerWord: boolean;
    burnInRecommended: boolean;
  };
};

const KEYWORD_MIN_LENGTH = 4;

export function generateSubtitlePlan(
  analysis: VoiceoverAnalysis,
  scriptPlan?: VideoScriptPlan,
  requestedStyle?: string,
): SubtitlePlan {
  const style = normalizeStyle(requestedStyle);
  const preset = getPreset(style);
  const cues = buildSubtitleCues(analysis, scriptPlan, preset.maxWordsPerCue, style);

  return {
    style,
    mode: getMode(style),
    safeZone: {
      platform: 'reels_tiktok_shorts',
      verticalPaddingPercent: 18,
      horizontalPaddingPercent: 8,
    },
    preset,
    cues,
    renderHints: {
      useKaraokeMask: style === 'alex_hormozi' || style === 'reels',
      animatePerWord: style !== 'minimal',
      burnInRecommended: true,
    },
  };
}

export async function translateSubtitlePlanToEnglish(plan: SubtitlePlan, analysis: VoiceoverAnalysis): Promise<SubtitlePlan> {
  if (!shouldTranslateSubtitlesToEnglish(analysis) || !hasGeminiApiKey()) {
    return plan;
  }

  const result = await generateGeminiJson(
    `Translate these short video subtitle cues into natural English for Reels/Shorts only because English subtitle translation was explicitly enabled. ${MULTILINGUAL_VIDEO_RULE} Keep the same cue IDs and return concise subtitle text. Do not add explanations.`,
    {
      sourceLanguage: analysis.language,
      transcript: analysis.transcript,
      cues: plan.cues.map((cue) => ({
        id: cue.id,
        text: cue.text,
      })),
      requiredJsonShape: {
        cues: [
          {
            id: 'subtitle_1',
            text: 'English subtitle text',
          },
        ],
      },
    },
    { temperature: 0.15 },
  );

  const translations = new Map(
    (Array.isArray(result?.cues) ? result.cues : [])
      .map((item) => item as Record<string, unknown>)
      .filter((item) => typeof item.id === 'string' && typeof item.text === 'string')
      .map((item) => [item.id as string, item.text as string]),
  );

  if (!translations.size) return plan;

  return {
    ...plan,
    cues: plan.cues.map((cue) => {
      const translatedText = translations.get(cue.id);
      if (!translatedText) return cue;
      const words = translatedText.split(/\s+/).filter(Boolean);
      const duration = Math.max(0.1, cue.end - cue.start);
      const wordDuration = duration / Math.max(words.length, 1);

      return {
        ...cue,
        text: formatCueText(words, plan.style),
        words: words.map((word, index) => ({
          text: word,
          start: roundTime(cue.start + index * wordDuration),
          end: roundTime(index === words.length - 1 ? cue.end : cue.start + (index + 1) * wordDuration),
          highlight: cue.words[index]?.highlight || false,
          emphasis: cue.words[index]?.emphasis || 'normal',
        })),
        activeWordIndexes: words.map((_, index) => index),
        lineBreak: words.length > 4 ? 'two_line' : 'single',
      };
    }),
  };
}

function shouldTranslateSubtitlesToEnglish(analysis: VoiceoverAnalysis) {
  const forceEnglish = String(process.env.FORCE_ENGLISH_SUBTITLES || process.env.TRANSLATE_SUBTITLES_TO_ENGLISH || '').toLowerCase();
  if (forceEnglish !== 'true' && forceEnglish !== '1') return false;
  return !analysis.language.code.toLowerCase().startsWith('en');
}

function buildSubtitleCues(
  analysis: VoiceoverAnalysis,
  scriptPlan: VideoScriptPlan | undefined,
  maxWordsPerCue: number,
  style: SubtitleStyleName,
): SubtitleCue[] {
  if (!analysis.words.length) {
    return analysis.sentences.map((sentence) => buildCueFromSentence(sentence, analysis, scriptPlan, style));
  }

  const keywordSet = new Set(analysis.keywords.map((keyword) => normalizeToken(keyword)));
  const chunks = chunkWords(analysis.words, maxWordsPerCue);

  return chunks.map((words, index) => {
    const start = words[0].start;
    const end = words[words.length - 1].end;
    const sceneId = findSceneId(scriptPlan, start, end);
    const subtitleWords = words.map((word) => {
      const token = normalizeToken(word.word);
      const highlight = keywordSet.has(token) || isStrongWord(token, analysis.emotion.primary);

      return {
        text: word.word,
        start: word.start,
        end: word.end,
        highlight,
        emphasis: highlight ? (keywordSet.has(token) ? 'keyword' : 'strong') : 'normal',
      } satisfies SubtitleWord;
    });

    return {
      id: `subtitle_${index + 1}`,
      start,
      end,
      text: formatCueText(subtitleWords.map((word) => word.text), style),
      words: subtitleWords,
      activeWordIndexes: subtitleWords.map((_, wordIndex) => wordIndex),
      lineBreak: subtitleWords.length > 4 ? 'two_line' : 'single',
      sceneId,
      animation: getCueAnimation(style, index),
      position: {
        x: 'center',
        y: style === 'cinematic' ? 'middle' : 'lower_safe',
      },
    };
  });
}

function buildCueFromSentence(
  sentence: VoiceoverAnalysis['sentences'][number],
  analysis: VoiceoverAnalysis,
  scriptPlan: VideoScriptPlan | undefined,
  style: SubtitleStyleName,
): SubtitleCue {
  const words = sentence.text.split(/\s+/).filter(Boolean);
  const keywordSet = new Set(analysis.keywords.map((keyword) => normalizeToken(keyword)));

  return {
    id: `subtitle_${sentence.index + 1}`,
    start: sentence.start || 0,
    end: sentence.end || (sentence.start || 0) + Math.max(1.5, words.length * 0.35),
    text: formatCueText(words, style),
    words: words.map((word, index) => {
      const start = (sentence.start || 0) + index * 0.35;
      const token = normalizeToken(word);
      const highlight = keywordSet.has(token) || isStrongWord(token, analysis.emotion.primary);

      return {
        text: word,
        start,
        end: start + 0.32,
        highlight,
        emphasis: highlight ? (keywordSet.has(token) ? 'keyword' : 'strong') : 'normal',
      };
    }),
    activeWordIndexes: words.map((_, index) => index),
    lineBreak: words.length > 4 ? 'two_line' : 'single',
    sceneId: findSceneId(scriptPlan, sentence.start || 0, sentence.end || 0),
    animation: getCueAnimation(style, sentence.index),
    position: {
      x: 'center',
      y: style === 'cinematic' ? 'middle' : 'lower_safe',
    },
  };
}

function chunkWords(words: VoiceoverAnalysis['words'], maxWordsPerCue: number) {
  const chunks: VoiceoverAnalysis['words'][] = [];
  let current: VoiceoverAnalysis['words'] = [];

  words.forEach((word, index) => {
    const previous = words[index - 1];
    const pauseBeforeWord = previous ? word.start - previous.end : 0;
    const shouldBreak = current.length >= maxWordsPerCue || pauseBeforeWord >= 0.65 || /[.!?]$/.test(previous?.word || '');

    if (current.length && shouldBreak) {
      chunks.push(current);
      current = [];
    }

    current.push(word);
  });

  if (current.length) {
    chunks.push(current);
  }

  return chunks;
}

function getPreset(style: SubtitleStyleName): SubtitlePlan['preset'] {
  const presets: Record<SubtitleStyleName, SubtitlePlan['preset']> = {
    alex_hormozi: {
      fontFamily: 'Anton, Impact, Arial Black, sans-serif',
      fontWeight: 900,
      fontSize: 82,
      textTransform: 'uppercase',
      textColor: '#ffffff',
      highlightColor: '#facc15',
      strokeColor: '#000000',
      strokeWidth: 10,
      backgroundColor: '#000000',
      shadow: '0 8px 0 #000000',
      maxWordsPerCue: 3,
    },
    iman_gadzhi: {
      fontFamily: 'Inter, Geist, sans-serif',
      fontWeight: 800,
      fontSize: 64,
      textTransform: 'sentence',
      textColor: '#f8fafc',
      highlightColor: '#d4af37',
      strokeColor: '#050505',
      strokeWidth: 6,
      backgroundColor: 'rgba(0,0,0,0.42)',
      shadow: '0 18px 40px rgba(0,0,0,0.65)',
      maxWordsPerCue: 5,
    },
    cinematic: {
      fontFamily: 'Cinzel, Georgia, serif',
      fontWeight: 700,
      fontSize: 58,
      textTransform: 'sentence',
      textColor: '#f5f5f4',
      highlightColor: '#f59e0b',
      strokeColor: '#111111',
      strokeWidth: 4,
      backgroundColor: null,
      shadow: '0 20px 60px rgba(0,0,0,0.8)',
      maxWordsPerCue: 7,
    },
    reels: {
      fontFamily: 'Inter, Geist, sans-serif',
      fontWeight: 900,
      fontSize: 72,
      textTransform: 'uppercase',
      textColor: '#ffffff',
      highlightColor: '#22d3ee',
      strokeColor: '#000000',
      strokeWidth: 8,
      backgroundColor: 'rgba(0,0,0,0.55)',
      shadow: '0 10px 30px rgba(0,0,0,0.5)',
      maxWordsPerCue: 4,
    },
    modern: {
      fontFamily: 'Geist, Inter, sans-serif',
      fontWeight: 800,
      fontSize: 62,
      textTransform: 'sentence',
      textColor: '#ffffff',
      highlightColor: '#a78bfa',
      strokeColor: '#000000',
      strokeWidth: 5,
      backgroundColor: 'rgba(0,0,0,0.36)',
      shadow: '0 12px 36px rgba(0,0,0,0.55)',
      maxWordsPerCue: 6,
    },
    minimal: {
      fontFamily: 'Geist, Inter, sans-serif',
      fontWeight: 650,
      fontSize: 54,
      textTransform: 'sentence',
      textColor: '#f4f4f5',
      highlightColor: '#ffffff',
      strokeColor: '#000000',
      strokeWidth: 2,
      backgroundColor: null,
      shadow: '0 8px 24px rgba(0,0,0,0.4)',
      maxWordsPerCue: 8,
    },
  };

  return presets[style];
}

function normalizeStyle(style?: string): SubtitleStyleName {
  const normalized = (style || 'modern').toLowerCase().replace(/\s+/g, '_');
  const aliases: Record<string, SubtitleStyleName> = {
    hormozi: 'alex_hormozi',
    alex_hormozi: 'alex_hormozi',
    alex: 'alex_hormozi',
    iman: 'iman_gadzhi',
    iman_gadzhi: 'iman_gadzhi',
    cinematic: 'cinematic',
    reels: 'reels',
    reel: 'reels',
    reels_style: 'reels',
    modern: 'modern',
    minimal: 'minimal',
  };

  return aliases[normalized] || 'modern';
}

function getMode(style: SubtitleStyleName): SubtitlePlan['mode'] {
  if (style === 'alex_hormozi' || style === 'reels') return 'karaoke';
  if (style === 'iman_gadzhi') return 'word_highlight';
  if (style === 'cinematic') return 'animated';
  return 'captions';
}

function getCueAnimation(style: SubtitleStyleName, index: number): SubtitleAnimation {
  if (style === 'alex_hormozi') return index % 2 === 0 ? 'pop' : 'bounce';
  if (style === 'reels') return 'karaoke_fill';
  if (style === 'iman_gadzhi') return 'scale';
  if (style === 'cinematic') return 'fade';
  return 'slide_up';
}

function formatCueText(words: string[], style: SubtitleStyleName) {
  const text = words.join(' ');
  return style === 'alex_hormozi' || style === 'reels' ? text.toUpperCase() : text;
}

function findSceneId(scriptPlan: VideoScriptPlan | undefined, start: number, end: number) {
  const scene = scriptPlan?.scenes.find((item) => start < item.end && end > item.start);
  return scene?.id;
}

function isStrongWord(token: string, emotion: string) {
  if (token.length < KEYWORD_MIN_LENGTH) {
    return false;
  }

  const emotionalWords = new Set([
    'hard',
    'silent',
    'success',
    'dream',
    'money',
    'power',
    'pain',
    'change',
    'focus',
    'win',
    'build',
    'create',
    'never',
  ]);

  return emotionalWords.has(token) || (emotion === 'motivation' && token.length >= 7);
}

function normalizeToken(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '').trim();
}

function roundTime(value: number) {
  return Math.round(value * 1000) / 1000;
}

