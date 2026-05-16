import { generateGeminiAudioJson, generateGeminiJson, hasGeminiApiKey } from './gemini';
import { MULTILINGUAL_VIDEO_RULE } from './multilingualRules';

export type TranscriptionWord = {
  word: string;
  start: number;
  end: number;
};

export type TranscriptionSegment = {
  id?: number;
  start: number;
  end: number;
  text: string;
};

export type VerboseTranscription = {
  text: string;
  language?: string;
  duration?: number;
  words?: TranscriptionWord[];
  segments?: TranscriptionSegment[];
};

type VoiceEmotion =
  | 'motivation'
  | 'sad'
  | 'energetic'
  | 'luxury'
  | 'cinematic'
  | 'normal'
  | 'informational';

type Pause = {
  start: number;
  end: number;
  duration: number;
  afterWord: string;
};

type SentenceSegment = {
  index: number;
  text: string;
  start: number | null;
  end: number | null;
  wordCount: number;
};

export type VoiceoverAnalysis = {
  transcript: string;
  language: {
    code: string;
    label: string;
  };
  emotion: {
    primary: VoiceEmotion;
    confidence: number;
    secondary: VoiceEmotion[];
    reasoning: string;
  };
  speakingSpeed: {
    wordsPerMinute: number;
    label: 'slow' | 'normal' | 'fast' | 'very_fast';
    wordCount: number;
    durationSeconds: number;
  };
  pauses: {
    count: number;
    totalPauseSeconds: number;
    averagePauseSeconds: number;
    items: Pause[];
  };
  keywords: string[];
  topics: string[];
  topicSummary: string;
  sentences: SentenceSegment[];
  segments: TranscriptionSegment[];
  words: TranscriptionWord[];
};

const OPENAI_BASE_URL = 'https://api.openai.com/v1';
const GROQ_BASE_URL = 'https://api.groq.com/openai/v1';
const ALLOWED_EMOTIONS: VoiceEmotion[] = [
  'motivation',
  'sad',
  'energetic',
  'luxury',
  'cinematic',
  'normal',
  'informational',
];

export async function analyzeVoiceover(voiceoverUrl: string): Promise<VoiceoverAnalysis> {
  if (!voiceoverUrl) {
    throw new Error('voiceoverUrl is required');
  }

  const transcription = await transcribeAudio(voiceoverUrl);
  const words = normalizeWords(transcription.words);
  const segments = normalizeSegments(transcription.segments);
  const durationSeconds = getDurationSeconds(transcription, words, segments);
  const wordCount = words.length || countWords(transcription.text);
  const speakingSpeed = getSpeakingSpeed(wordCount, durationSeconds);
  const pauses = getPauses(words);
  const sentences = getSentenceSegments(transcription.text, words, segments);
  const textAnalysis = await analyzeTranscriptText({
    transcript: transcription.text,
    languageCode: transcription.language || 'unknown',
    speakingSpeed,
    pauses,
    sentences,
  });

  return {
    transcript: transcription.text,
    language: {
      code: transcription.language || textAnalysis.languageCode || 'unknown',
      label: textAnalysis.languageLabel || transcription.language || 'Unknown',
    },
    emotion: {
      primary: textAnalysis.primaryEmotion,
      confidence: clampNumber(textAnalysis.emotionConfidence, 0, 1),
      secondary: textAnalysis.secondaryEmotions,
      reasoning: textAnalysis.emotionReasoning,
    },
    speakingSpeed,
    pauses: {
      count: pauses.length,
      totalPauseSeconds: round(pauses.reduce((sum, pause) => sum + pause.duration, 0)),
      averagePauseSeconds: round(pauses.length ? pauses.reduce((sum, pause) => sum + pause.duration, 0) / pauses.length : 0),
      items: pauses,
    },
    keywords: textAnalysis.keywords,
    topics: textAnalysis.topics,
    topicSummary: textAnalysis.topicSummary,
    sentences,
    segments,
    words,
  };
}

export async function transcribeUploadedAudio(audioBlob: Blob, filename: string): Promise<VerboseTranscription> {
  if (process.env.GROQ_API_KEY) {
    try {
      return await transcribeAudioWithGroq(audioBlob, filename);
    } catch (error) {
      console.warn('Groq transcription failed, falling back:', error);
    }
  }

  if (process.env.OPENAI_API_KEY) {
    return transcribeAudioWithOpenAi(audioBlob, filename);
  }

  throw new Error('No upload transcription provider is configured. Set GROQ_API_KEY or OPENAI_API_KEY.');
}

export function transcriptionToSrt(transcription: VerboseTranscription): string {
  const segments = normalizeSegments(transcription.segments);

  if (segments.length) {
    return segments
      .map((segment, index) => {
        const start = formatSrtTimestamp(segment.start);
        const end = formatSrtTimestamp(segment.end > segment.start ? segment.end : segment.start + 1.5);

        return `${index + 1}\n${start} --> ${end}\n${segment.text}`;
      })
      .join('\n\n');
  }

  const words = normalizeWords(transcription.words);

  if (words.length) {
    return chunkWords(words, 8)
      .map((chunk, index) => {
        const start = formatSrtTimestamp(chunk[0].start);
        const end = formatSrtTimestamp(chunk[chunk.length - 1].end);
        const text = chunk.map((word) => word.word).join(' ');

        return `${index + 1}\n${start} --> ${end}\n${text}`;
      })
      .join('\n\n');
  }

  const text = transcription.text.trim();
  return text ? `1\n00:00:00,000 --> 00:00:03,000\n${text}` : '';
}

async function transcribeAudio(voiceoverUrl: string): Promise<VerboseTranscription> {
  const audioResponse = await fetchWithTimeout(voiceoverUrl, {}, getVoiceoverFetchTimeoutMs());

  if (!audioResponse.ok) {
    throw new Error(`Unable to download voiceover audio: ${audioResponse.status}`);
  }

  const audioBlob = await audioResponse.blob();
  const filename = getAudioFilename(voiceoverUrl, audioResponse.headers.get('content-type'));

  if (process.env.GROQ_API_KEY || process.env.OPENAI_API_KEY) {
    return transcribeUploadedAudio(audioBlob, filename);
  }

  if (hasGeminiApiKey()) {
    const geminiTranscription = await transcribeAudioWithGemini(voiceoverUrl);
    if (geminiTranscription) return geminiTranscription;
  }

  throw new Error('No transcription provider is configured. Set GROQ_API_KEY or OPENAI_API_KEY.');
}

async function transcribeAudioWithGroq(audioBlob: Blob, filename: string): Promise<VerboseTranscription> {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    throw new Error('GROQ_API_KEY is not configured');
  }

  const formData = new FormData();

  formData.append('file', audioBlob, filename);
  formData.append('model', process.env.GROQ_TRANSCRIBE_MODEL || 'whisper-large-v3-turbo');
  formData.append('response_format', 'verbose_json');
  formData.append('timestamp_granularities[]', 'word');
  formData.append('timestamp_granularities[]', 'segment');

  const response = await fetchWithTimeout(
    `${GROQ_BASE_URL}/audio/transcriptions`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      body: formData,
    },
    getGroqTranscriptionTimeoutMs(),
  );

  if (!response.ok) {
    throw new Error(`Groq transcription failed: ${response.status} ${await response.text()}`);
  }

  return response.json() as Promise<VerboseTranscription>;
}

async function transcribeAudioWithOpenAi(audioBlob: Blob, filename: string): Promise<VerboseTranscription> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not configured');
  }

  const formData = new FormData();

  formData.append('file', audioBlob, filename);
  formData.append('model', process.env.OPENAI_TRANSCRIBE_MODEL || 'whisper-1');
  formData.append('response_format', 'verbose_json');
  formData.append('timestamp_granularities[]', 'word');
  formData.append('timestamp_granularities[]', 'segment');

  const response = await fetchWithTimeout(
    `${OPENAI_BASE_URL}/audio/transcriptions`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      body: formData,
    },
    getOpenAiTranscriptionTimeoutMs(),
  );

  if (!response.ok) {
    throw new Error(`OpenAI transcription failed: ${response.status} ${await response.text()}`);
  }

  return response.json() as Promise<VerboseTranscription>;
}

async function transcribeAudioWithGemini(voiceoverUrl: string): Promise<VerboseTranscription | null> {
  const result = await generateGeminiAudioJson(
    voiceoverUrl,
    `Transcribe this voiceover for a video editing pipeline. ${MULTILINGUAL_VIDEO_RULE}
Return JSON with this exact shape:
{
  "text": "full transcript",
  "language": "short language code like en, hi, hi-Latn, ur, hinglish, mixed, unknown",
  "duration": number,
  "segments": [
    { "start": number, "end": number, "text": "segment text" }
  ],
  "words": [
    { "word": "word", "start": number, "end": number }
  ]
}
If exact word timestamps are not available, return an empty words array and make segment timestamps approximate.`,
    { temperature: 0.05 },
  );

  if (!result) return null;

  return {
    text: repairMojibake(asString(result.text)),
    language: asString(result.language) || 'unknown',
    duration: typeof result.duration === 'number' ? result.duration : undefined,
    segments: normalizeGeminiSegments(result.segments),
    words: normalizeGeminiWords(result.words),
  };
}

async function analyzeTranscriptText(input: {
  transcript: string;
  languageCode: string;
  speakingSpeed: VoiceoverAnalysis['speakingSpeed'];
  pauses: Pause[];
  sentences: SentenceSegment[];
}) {
  if (hasGeminiApiKey()) {
    const geminiAnalysis = await analyzeTranscriptTextWithGemini(input);
    if (geminiAnalysis) return geminiAnalysis;
  }

  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not configured');
  }

  const response = await fetch(`${OPENAI_BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: process.env.OPENAI_TEXT_MODEL || 'gpt-4o-mini',
      temperature: 0.2,
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content:
            `You analyze creator voiceover transcripts for an AI video rendering pipeline. ${MULTILINGUAL_VIDEO_RULE} Return only valid JSON. Pick emotions only from: motivation, sad, energetic, luxury, cinematic, normal, informational.`,
        },
        {
          role: 'user',
          content: JSON.stringify({
            task: 'Analyze this voiceover for video generation.',
            requiredJsonShape: {
              languageCode: 'ISO-like language code, such as en, hi, hi-Latn, ur, hinglish, mixed, unknown',
              languageLabel: 'Human readable language name, such as English, Hindi, Hinglish, Urdu, or Mixed',
              primaryEmotion: ALLOWED_EMOTIONS,
              emotionConfidence: 'number from 0 to 1',
              secondaryEmotions: 'array of 0 to 3 allowed emotions',
              emotionReasoning: 'short reason based on transcript, speed, and pauses',
              keywords: '8 to 16 important keywords or phrases',
              topics: '1 to 5 topic labels',
              topicSummary: 'one sentence topic summary',
            },
            transcript: input.transcript,
            languageCodeFromTranscription: input.languageCode,
            deliveryMetrics: {
              speakingSpeed: input.speakingSpeed,
              pauseCount: input.pauses.length,
              longestPauses: input.pauses.slice(0, 8),
            },
            sentencePreview: input.sentences.slice(0, 20).map((sentence) => sentence.text),
          }),
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI text analysis failed: ${response.status} ${await response.text()}`);
  }

  const completion = await response.json();
  const rawContent = completion?.choices?.[0]?.message?.content;
  const parsed = safeJsonParse(rawContent || '{}');

  return normalizeTextAnalysis(parsed, input.languageCode, input.transcript);
}

async function analyzeTranscriptTextWithGemini(input: {
  transcript: string;
  languageCode: string;
  speakingSpeed: VoiceoverAnalysis['speakingSpeed'];
  pauses: Pause[];
  sentences: SentenceSegment[];
}) {
  const result = await generateGeminiJson(
    `Analyze this creator voiceover for an AI video rendering pipeline. ${MULTILINGUAL_VIDEO_RULE} Pick emotions only from: motivation, sad, energetic, luxury, cinematic, normal, informational.`,
    {
      requiredJsonShape: {
        languageCode: 'ISO-like language code, such as en, hi, hi-Latn, ur, hinglish, mixed, unknown',
        languageLabel: 'Human readable language name, such as English, Hindi, Hinglish, Urdu, or Mixed',
        primaryEmotion: ALLOWED_EMOTIONS,
        emotionConfidence: 'number from 0 to 1',
        secondaryEmotions: 'array of 0 to 3 allowed emotions',
        emotionReasoning: 'short reason based on transcript, speed, and pauses',
        keywords: '8 to 16 important keywords or phrases',
        topics: '1 to 5 topic labels',
        topicSummary: 'one sentence topic summary',
      },
      transcript: input.transcript,
      languageCodeFromTranscription: input.languageCode,
      deliveryMetrics: {
        speakingSpeed: input.speakingSpeed,
        pauseCount: input.pauses.length,
        longestPauses: input.pauses.slice(0, 8),
      },
      sentencePreview: input.sentences.slice(0, 20).map((sentence) => sentence.text),
    },
    { temperature: 0.2 },
  );

  return result ? normalizeTextAnalysis(result, input.languageCode, input.transcript) : null;
}

function normalizeWords(words?: TranscriptionWord[]): TranscriptionWord[] {
  return (words || [])
    .filter((word) => typeof word.word === 'string' && Number.isFinite(word.start) && Number.isFinite(word.end))
    .map((word) => ({
      word: word.word.trim(),
      start: round(word.start),
      end: round(word.end),
    }));
}

function normalizeSegments(segments?: TranscriptionSegment[]): TranscriptionSegment[] {
  return (segments || [])
    .filter((segment) => typeof segment.text === 'string')
    .map((segment) => ({
      id: segment.id,
      start: round(Number(segment.start) || 0),
      end: round(Number(segment.end) || 0),
      text: segment.text.trim(),
    }));
}

function normalizeGeminiSegments(value: unknown): TranscriptionSegment[] {
  if (!Array.isArray(value)) return [];

  return value
    .map((segment) => segment as Record<string, unknown>)
    .filter((segment) => typeof segment.text === 'string')
    .map((segment) => ({
      start: round(parseTimestampValue(segment.start ?? segment.startTime ?? segment.start_time) ?? 0),
      end: round(parseTimestampValue(segment.end ?? segment.endTime ?? segment.end_time) ?? 0),
      text: repairMojibake(String(segment.text).trim()),
    }))
    .filter((segment) => segment.end > segment.start || segment.text);
}

function normalizeGeminiWords(value: unknown): TranscriptionWord[] {
  if (!Array.isArray(value)) return [];

  return value
    .map((word) => word as Record<string, unknown>)
    .map((word) => {
      const text = word.word ?? word.text;
      const start = parseTimestampValue(word.start ?? word.startTime ?? word.start_time);
      const end = parseTimestampValue(word.end ?? word.endTime ?? word.end_time);

      return {
        word: typeof text === 'string' ? repairMojibake(text.trim()) : '',
        start: start === null ? Number.NaN : round(start),
        end: end === null ? Number.NaN : round(end),
      };
    })
    .filter((word) => word.word && Number.isFinite(word.start) && Number.isFinite(word.end) && word.end > word.start);
}

function parseTimestampValue(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value !== 'string') return null;

  const trimmed = value.trim();
  if (!trimmed) return null;

  const numeric = Number(trimmed);
  if (Number.isFinite(numeric)) return numeric;

  const parts = trimmed.split(':').map(Number);
  if (parts.length === 3 && parts.every(Number.isFinite)) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  }
  if (parts.length === 2 && parts.every(Number.isFinite)) {
    return parts[0] * 60 + parts[1];
  }

  return null;
}

function repairMojibake(value: string) {
  if (!/[ÃÂà][\u0080-\u00ff]/.test(value)) return value;

  try {
    return Buffer.from(value, 'latin1').toString('utf8');
  } catch {
    return value;
  }
}

function getDurationSeconds(transcription: VerboseTranscription, words: TranscriptionWord[], segments: TranscriptionSegment[]) {
  if (Number.isFinite(transcription.duration)) {
    return round(transcription.duration || 0);
  }

  const lastWord = words[words.length - 1];
  const lastSegment = segments[segments.length - 1];

  return round(lastWord?.end || lastSegment?.end || 0);
}

function getSpeakingSpeed(wordCount: number, durationSeconds: number): VoiceoverAnalysis['speakingSpeed'] {
  const wordsPerMinute = durationSeconds > 0 ? Math.round((wordCount / durationSeconds) * 60) : 0;

  return {
    wordsPerMinute,
    label: wordsPerMinute < 110 ? 'slow' : wordsPerMinute < 165 ? 'normal' : wordsPerMinute < 210 ? 'fast' : 'very_fast',
    wordCount,
    durationSeconds,
  };
}

function getPauses(words: TranscriptionWord[]) {
  const pauses: Pause[] = [];

  for (let index = 1; index < words.length; index += 1) {
    const previous = words[index - 1];
    const current = words[index];
    const duration = round(current.start - previous.end);

    if (duration >= 0.45) {
      pauses.push({
        start: previous.end,
        end: current.start,
        duration,
        afterWord: previous.word,
      });
    }
  }

  return pauses.sort((a, b) => b.duration - a.duration);
}

function getSentenceSegments(text: string, words: TranscriptionWord[], segments: TranscriptionSegment[]): SentenceSegment[] {
  if (!text.trim()) {
    return [];
  }

  const sentenceTexts = text
    .replace(/\s+/g, ' ')
    .match(/[^.!?।؟]+[.!?।؟]+|[^.!?।؟]+$/g)
    ?.map((sentence) => sentence.trim())
    .filter(Boolean);

  if (!sentenceTexts?.length) {
    return segments.map((segment, index) => ({
      index,
      text: segment.text,
      start: segment.start,
      end: segment.end,
      wordCount: countWords(segment.text),
    }));
  }

  let wordCursor = 0;

  return sentenceTexts.map((sentence, index) => {
    const sentenceWordCount = countWords(sentence);
    const sentenceWords = words.slice(wordCursor, wordCursor + sentenceWordCount);
    wordCursor += sentenceWordCount;

    return {
      index,
      text: sentence,
      start: sentenceWords[0]?.start ?? null,
      end: sentenceWords[sentenceWords.length - 1]?.end ?? null,
      wordCount: sentenceWordCount,
    };
  });
}

function normalizeTextAnalysis(parsed: Record<string, unknown>, languageCode: string, transcript: string) {
  const primaryEmotion = normalizeEmotion(parsed.primaryEmotion);
  const secondaryEmotions = Array.isArray(parsed.secondaryEmotions)
    ? parsed.secondaryEmotions.map((emotion) => normalizeEmotion(emotion)).filter((emotion) => emotion !== primaryEmotion).slice(0, 3)
    : [];

  return {
    languageCode: asString(parsed.languageCode) || languageCode || 'unknown',
    languageLabel: asString(parsed.languageLabel) || languageCode || 'Unknown',
    primaryEmotion,
    emotionConfidence: typeof parsed.emotionConfidence === 'number' ? parsed.emotionConfidence : 0.5,
    secondaryEmotions,
    emotionReasoning: asString(parsed.emotionReasoning) || 'Inferred from transcript content and delivery metrics.',
    keywords: normalizeStringArray(parsed.keywords, extractFallbackKeywords(transcript)),
    topics: normalizeStringArray(parsed.topics, ['General']),
    topicSummary: asString(parsed.topicSummary) || transcript.slice(0, 180),
  };
}

function normalizeEmotion(value: unknown): VoiceEmotion {
  const normalized = asString(value).toLowerCase() as VoiceEmotion;
  return ALLOWED_EMOTIONS.includes(normalized) ? normalized : 'normal';
}

function normalizeStringArray(value: unknown, fallback: string[]) {
  if (!Array.isArray(value)) {
    return fallback;
  }

  const items = value.map((item) => asString(item).trim()).filter(Boolean);
  return items.length ? Array.from(new Set(items)).slice(0, 16) : fallback;
}

function extractFallbackKeywords(text: string) {
  const stopWords = new Set([
    'the',
    'and',
    'you',
    'your',
    'that',
    'this',
    'with',
    'for',
    'are',
    'hai',
    'hain',
    'aur',
    'mein',
    'main',
    'mera',
    'meri',
    'کو',
    'اور',
    'میں',
    'ہے',
    'ہیں',
    'का',
    'की',
    'के',
    'और',
    'में',
    'है',
    'हैं',
  ]);
  const frequency = new Map<string, number>();

  text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .split(/\s+/)
    .filter((word) => Array.from(word).length > 2 && !stopWords.has(word))
    .forEach((word) => frequency.set(word, (frequency.get(word) || 0) + 1));

  return [...frequency.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 12)
    .map(([word]) => word);
}

function getAudioFilename(url: string, contentType: string | null) {
  const extensionFromType = contentType?.split('/')[1]?.split(';')[0];
  const pathname = safeUrl(url)?.pathname || '';
  const filename = pathname.split('/').pop();

  if (filename && /\.[a-z0-9]+$/i.test(filename)) {
    return filename;
  }

  return `voiceover.${extensionFromType || 'mp3'}`;
}

function safeUrl(url: string) {
  try {
    return new URL(url);
  } catch {
    return null;
  }
}

async function fetchWithTimeout(url: string, init: RequestInit, timeoutMs: number) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } catch (error: any) {
    if (error?.name === 'AbortError') {
      throw new Error(`Voice analysis request timed out after ${Math.round(timeoutMs / 1000)} seconds`);
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

function getVoiceoverFetchTimeoutMs() {
  return Number(process.env.VOICEOVER_FETCH_TIMEOUT_MS || 20_000);
}

function getOpenAiTranscriptionTimeoutMs() {
  return Number(process.env.OPENAI_TRANSCRIPTION_TIMEOUT_MS || 30_000);
}

function getGroqTranscriptionTimeoutMs() {
  return Number(process.env.GROQ_TRANSCRIPTION_TIMEOUT_MS || 30_000);
}

function countWords(text: string) {
  return text.trim() ? text.trim().split(/\s+/).length : 0;
}

function chunkWords(words: TranscriptionWord[], maxWordsPerCue: number) {
  const chunks: TranscriptionWord[][] = [];
  let current: TranscriptionWord[] = [];

  words.forEach((word, index) => {
    const previous = words[index - 1];
    const hasPause = previous ? word.start - previous.end > 0.65 : false;

    if (current.length && (current.length >= maxWordsPerCue || hasPause)) {
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

function formatSrtTimestamp(seconds: number) {
  const totalMilliseconds = Math.max(0, Math.round((Number.isFinite(seconds) ? seconds : 0) * 1000));
  const milliseconds = totalMilliseconds % 1000;
  const totalSeconds = Math.floor(totalMilliseconds / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const remainingSeconds = totalSeconds % 60;

  return `${padTime(hours)}:${padTime(minutes)}:${padTime(remainingSeconds)},${String(milliseconds).padStart(3, '0')}`;
}

function padTime(value: number) {
  return String(value).padStart(2, '0');
}

function safeJsonParse(value: string): Record<string, unknown> {
  try {
    return JSON.parse(value) as Record<string, unknown>;
  } catch {
    return {};
  }
}

function asString(value: unknown) {
  return typeof value === 'string' ? value : '';
}

function clampNumber(value: number, min: number, max: number) {
  if (!Number.isFinite(value)) {
    return min;
  }

  return Math.min(max, Math.max(min, value));
}

function round(value: number) {
  return Math.round(value * 1000) / 1000;
}

