import {spawn} from 'node:child_process';
import {existsSync} from 'node:fs';
import {mkdtemp, readFile, rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {normalizeTranscriptForPlanner} from './hinglishTranscript';
import type {ReelTranscriptSegment, ReelWord} from './reelPlanner';

export type GroqTranscriptionResult = {
  transcript: string;
  words?: ReelWord[];
  segments?: ReelTranscriptSegment[];
  durationSeconds?: number;
  languageHint?: 'english' | 'hinglish';
  model: string;
  warning?: string;
  rawTranscript?: string;
};

const GROQ_TRANSCRIPTION_URL = 'https://api.groq.com/openai/v1/audio/transcriptions';
const GROQ_TRANSLATION_URL = 'https://api.groq.com/openai/v1/audio/translations';
const OPENAI_TRANSCRIPTION_URL = 'https://api.openai.com/v1/audio/transcriptions';
const OPENAI_TRANSLATION_URL = 'https://api.openai.com/v1/audio/translations';
const DEFAULT_GROQ_TRANSCRIPTION_MODEL = 'whisper-large-v3-turbo';
const DEFAULT_OPENAI_TRANSCRIPTION_MODEL = 'whisper-1';
const MAX_TRANSCRIPTION_DOWNLOAD_BYTES = 1024 * 1024 * 120;
const DEFAULT_TRANSCRIPTION_MAX_SECONDS = 60;
const GROQ_TRANSCRIPTION_PROMPT = [
  'Transcribe and translate speech into clean natural English only for a short reel.',
  'If the speaker uses Hindi, Urdu, or Hinglish, translate the meaning into English instead of romanizing it.',
  'Keep official names, numbers, dates, documents, and keywords in standard English.',
  'Use canonical terms such as RBI, Reserve Bank of India, PAN Card, Aadhaar, Salary, Benefits, Documents, Apply, Download.',
  'Do not use Devanagari, Urdu, Arabic script, Roman Hinglish, phonetic spellings, or broken transliteration.',
  'Return only the spoken transcript in English, no timestamps or scene notes.',
].join(' ');
const DEFAULT_TRANSCRIPTION_PROMPT = [
  'Transcribe and translate the spoken audio as a clean short-form video script in English only.',
  'If the source speech is Hindi, Urdu, or Hinglish, translate the meaning into natural English for captions, timeline planning, and asset search.',
  'Do not output Devanagari, Urdu, Arabic script, Roman Hinglish, phonetic spellings, or broken transliteration.',
  'Preserve speaker meaning, names, numbers, and official keywords in standard English.',
  'Use natural punctuation and sentence breaks so a timeline planner can split HOOK (0-5 sec), BODY (5-40 sec), and CTA (40-50 sec) clearly.',
  'Reference style: Government Job vs Private Job. Hook should be one curiosity/stat question; body should be short paragraphs with facts and examples; CTA should be a clear final question or comment prompt.',
  'For English speech, keep clean English. For non-English speech, translate to clean English.',
  'Do not add scene directions, timestamps, headings, or timeline JSON; return only the spoken transcript.',
  'Examples of canonical terms: PAN Card, Aadhaar, Apply, Documents, Exam Date, RBI, Reserve Bank of India.',
].join(' ');

export async function transcribeMediaUrlWithGroq({
  mediaUrl,
  fileName,
  contentType,
  skipMediaPreparation,
}: {
  mediaUrl: string;
  fileName: string;
  contentType?: string;
  skipMediaPreparation?: boolean;
}): Promise<GroqTranscriptionResult> {
  const apiKey = cleanEnvValue(process.env.GROQ_API_KEY);
  if (!apiKey) throw new Error('Missing GROQ_API_KEY.');

  const model = cleanEnvValue(process.env.GROQ_TRANSCRIPTION_MODEL) || DEFAULT_GROQ_TRANSCRIPTION_MODEL;
  const responseFormat = cleanEnvValue(process.env.GROQ_TRANSCRIPTION_RESPONSE_FORMAT) || 'verbose_json';
  const translateToEnglish = shouldTranslateTranscriptionToEnglish();
  const media = skipMediaPreparation
    ? await fetchMediaBlob(mediaUrl, contentType)
    : await prepareTranscriptionMedia({mediaUrl, fileName, contentType});

  const form = new FormData();
  form.append('file', media.blob, safeFileName(fileName, media.contentType));
  form.append('model', model);
  form.append('response_format', responseFormat);
  form.append('temperature', '0');
  appendTranscriptionGuidance(form, 'GROQ', translateToEnglish);

  if (responseFormat === 'verbose_json') {
    form.append('timestamp_granularities[]', 'segment');
    form.append('timestamp_granularities[]', 'word');
  }

  const response = await fetch(translateToEnglish ? GROQ_TRANSLATION_URL : GROQ_TRANSCRIPTION_URL, {
    method: 'POST',
    headers: {Authorization: `Bearer ${apiKey}`},
    body: form,
  });

  if (!response.ok) {
    throw new Error(`Groq ${translateToEnglish ? 'translation' : 'transcription'} failed: ${response.status} ${await response.text()}`);
  }

  return normalizeGroqTranscription(await response.json(), model);
}

export async function transcribeMediaUrlWithOpenAI({
  mediaUrl,
  fileName,
  contentType,
  skipMediaPreparation,
}: {
  mediaUrl: string;
  fileName: string;
  contentType?: string;
  skipMediaPreparation?: boolean;
}): Promise<GroqTranscriptionResult> {
  const apiKey = cleanEnvValue(process.env.OPENAI_API_KEY);
  if (!apiKey) throw new Error('Missing OPENAI_API_KEY.');

  const model = cleanEnvValue(process.env.OPENAI_TRANSCRIPTION_MODEL) || DEFAULT_OPENAI_TRANSCRIPTION_MODEL;
  const translateToEnglish = shouldTranslateTranscriptionToEnglish();
  const media = skipMediaPreparation
    ? await fetchMediaBlob(mediaUrl, contentType)
    : await prepareTranscriptionMedia({mediaUrl, fileName, contentType});

  const form = new FormData();
  form.append('file', media.blob, safeFileName(fileName, media.contentType));
  form.append('model', model);
  form.append('response_format', 'verbose_json');
  form.append('temperature', '0');
  appendTranscriptionGuidance(form, 'OPENAI', translateToEnglish);

  const response = await fetch(translateToEnglish ? OPENAI_TRANSLATION_URL : OPENAI_TRANSCRIPTION_URL, {
    method: 'POST',
    headers: {Authorization: `Bearer ${apiKey}`},
    body: form,
  });

  if (!response.ok) {
    throw new Error(`OpenAI ${translateToEnglish ? 'translation' : 'transcription'} failed: ${response.status} ${await response.text()}`);
  }

  return normalizeGroqTranscription(await response.json(), model);
}

async function prepareTranscriptionMedia({
  mediaUrl,
  fileName,
  contentType,
}: {
  mediaUrl: string;
  fileName: string;
  contentType?: string;
}) {
  const maxSeconds = readTranscriptionMaxSeconds();
  const shouldTrim = maxSeconds > 0 && (contentType?.startsWith('video/') || contentType?.startsWith('audio/'));
  if (!shouldTrim) return fetchMediaBlob(mediaUrl, contentType);

  try {
    const clipped = await extractTranscriptionAudioClip({mediaUrl, fileName, maxSeconds});
    if (clipped.blob.size > 0) return clipped;
  } catch {
    // If FFmpeg is unavailable in the runtime, keep the render path working.
  }

  return fetchMediaBlob(mediaUrl, contentType);
}

async function extractTranscriptionAudioClip({
  mediaUrl,
  fileName,
  maxSeconds,
}: {
  mediaUrl: string;
  fileName: string;
  maxSeconds: number;
}) {
  const ffmpegPath = findFfmpegPath();
  if (!ffmpegPath) throw new Error('FFmpeg is unavailable for transcription clipping.');

  const workDir = await mkdtemp(path.join(tmpdir(), 'itnavideo-transcription-'));
  const outputPath = path.join(workDir, `${path.basename(fileName, path.extname(fileName)).replace(/[^a-z0-9-]+/gi, '-').slice(0, 60) || 'clip'}-first-${maxSeconds}s.mp3`);

  try {
    await runFfmpeg(ffmpegPath, [
      '-y',
      '-i',
      mediaUrl,
      '-t',
      String(maxSeconds),
      '-vn',
      '-map',
      '0:a:0?',
      '-ac',
      '1',
      '-ar',
      '16000',
      '-b:a',
      '64k',
      '-f',
      'mp3',
      outputPath,
    ]);
    const bytes = await readFile(outputPath);
    return {
      blob: new Blob([bytes], {type: 'audio/mpeg'}),
      contentType: 'audio/mpeg',
      clippedSeconds: maxSeconds,
    };
  } finally {
    await rm(workDir, {recursive: true, force: true});
  }
}

async function fetchMediaBlob(mediaUrl: string, fallbackContentType?: string) {
  const response = await fetch(mediaUrl);
  if (!response.ok) {
    throw new Error(`Could not read uploaded media for transcription: ${response.status}`);
  }

  const contentLength = Number(response.headers.get('content-length') || 0);
  if (contentLength > MAX_TRANSCRIPTION_DOWNLOAD_BYTES) {
    throw new Error('Uploaded media is too large for direct beta transcription. Use a shorter clip or server-side trimming.');
  }

  const blob = await response.blob();
  if (blob.size > MAX_TRANSCRIPTION_DOWNLOAD_BYTES) {
    throw new Error('Uploaded media is too large for direct beta transcription. Use a shorter clip or server-side trimming.');
  }

  return {
    blob: blob.type ? blob : new Blob([blob], {type: fallbackContentType || 'application/octet-stream'}),
    contentType: blob.type || fallbackContentType,
  };
}

function normalizeGroqTranscription(payload: unknown, model: string): GroqTranscriptionResult {
  if (!isRecord(payload)) {
    return {transcript: '', model, warning: 'Groq returned an unreadable transcription payload.'};
  }

  const transcript = String(payload.text || '').trim();
  const words = normalizeWords(payload.words);
  const segments = normalizeSegments(payload.segments);
  const durationSeconds = readDuration(payload);
  const normalized = normalizeTranscriptForPlanner({transcript, words, segments});
  const cleanTranscript = normalized.transcript || transcript;

  return {
    transcript: cleanTranscript,
    words: normalized.words?.length ? normalized.words : words,
    segments: normalized.segments?.length ? normalized.segments : segments,
    durationSeconds,
    languageHint: shouldTranslateTranscriptionToEnglish() ? 'english' : normalized.languageHint,
    model,
    warning: cleanTranscript ? undefined : 'Groq returned an empty transcript.',
    rawTranscript: cleanTranscript === transcript ? undefined : transcript,
  };
}

function appendTranscriptionGuidance(form: FormData, provider: 'GROQ' | 'OPENAI', translateToEnglish: boolean) {
  const prompt = cleanEnvValue(
    process.env[`${provider}_TRANSCRIPTION_PROMPT`] ||
    process.env.TRANSCRIPTION_PROMPT,
  ) || (provider === 'GROQ' ? GROQ_TRANSCRIPTION_PROMPT : DEFAULT_TRANSCRIPTION_PROMPT);
  const language = cleanEnvValue(
    process.env[`${provider}_TRANSCRIPTION_LANGUAGE`] ||
    process.env.TRANSCRIPTION_LANGUAGE,
  );

  if (prompt) form.append('prompt', prompt);
  if (!translateToEnglish && language && language.toLowerCase() !== 'auto') form.append('language', language);
}

function shouldTranslateTranscriptionToEnglish() {
  const task = cleanEnvValue(process.env.TRANSCRIPTION_TASK || 'transcribe').toLowerCase();
  return !['transcribe', 'source', 'source-language'].includes(task);
}

function normalizeWords(value: unknown): ReelWord[] | undefined {
  if (!Array.isArray(value)) return undefined;
  const words = value
    .map((item) => {
      if (!isRecord(item)) return null;
      const word = String(item.word || '').trim();
      const start = Number(item.start);
      const end = Number(item.end);
      if (!word || !Number.isFinite(start) || !Number.isFinite(end) || end <= start) return null;
      return {word, start, end};
    })
    .filter((item): item is ReelWord => Boolean(item));
  return words.length ? words : undefined;
}

function normalizeSegments(value: unknown): ReelTranscriptSegment[] | undefined {
  if (!Array.isArray(value)) return undefined;
  const segments = value
    .map((item) => {
      if (!isRecord(item)) return null;
      const text = String(item.text || '').trim();
      const start = Number(item.start);
      const end = Number(item.end);
      const id = typeof item.id === 'string' || typeof item.id === 'number' ? item.id : undefined;
      if (!text || !Number.isFinite(start) || !Number.isFinite(end) || end <= start) return null;
      const segment: ReelTranscriptSegment = {start, end, text};
      if (id !== undefined) segment.id = id;
      return segment;
    })
    .filter((item): item is ReelTranscriptSegment => item !== null);
  return segments.length ? segments : undefined;
}

function readDuration(payload: Record<string, unknown>) {
  const duration = Number(payload.duration);
  if (Number.isFinite(duration) && duration > 0) return duration;
  const segments = Array.isArray(payload.segments) ? payload.segments : [];
  const lastSegment = segments.at(-1);
  if (isRecord(lastSegment)) {
    const end = Number(lastSegment.end);
    if (Number.isFinite(end) && end > 0) return end;
  }
  return undefined;
}

function readTranscriptionMaxSeconds() {
  const value = Number(
    cleanEnvValue(process.env.TRANSCRIPTION_MAX_SECONDS) ||
    cleanEnvValue(process.env.GROQ_TRANSCRIPTION_MAX_SECONDS) ||
    DEFAULT_TRANSCRIPTION_MAX_SECONDS,
  );
  if (!Number.isFinite(value) || value <= 0) return 0;
  return Math.max(1, Math.min(600, Math.round(value)));
}

function findFfmpegPath() {
  const configured = cleanEnvValue(process.env.FFMPEG_PATH);
  if (configured && existsSync(configured)) return configured;
  const system = findSystemFfmpeg();
  if (system) return system;

  const extension = process.platform === 'win32' ? '.exe' : '';
  const packages = [
    'compositor-win32-x64-msvc',
    'compositor-linux-x64-gnu',
    'compositor-linux-x64-musl',
    'compositor-linux-arm64-gnu',
    'compositor-darwin-x64',
    'compositor-darwin-arm64',
  ];
  for (const packageName of packages) {
    const candidate = path.join(process.cwd(), 'node_modules', '@remotion', packageName, `ffmpeg${extension}`);
    if (existsSync(candidate)) return candidate;
    const linuxCandidate = path.join(process.cwd(), 'node_modules', '@remotion', packageName, 'ffmpeg');
    if (existsSync(linuxCandidate)) return linuxCandidate;
  }
  return '';
}

function findSystemFfmpeg() {
  const commandName = process.platform === 'win32' ? 'ffmpeg.exe' : 'ffmpeg';
  for (const directory of String(process.env.PATH || '').split(path.delimiter)) {
    if (!directory) continue;
    const candidate = path.join(directory, commandName);
    if (existsSync(candidate)) return candidate;
  }
  return '';
}

function runFfmpeg(command: string, args: string[]) {
  return new Promise<void>((resolve, reject) => {
    const child = spawn(command, args, {stdio: ['ignore', 'ignore', 'pipe']});
    let stderr = '';

    child.stderr.on('data', (chunk) => {
      stderr += chunk.toString();
    });

    child.on('error', reject);
    child.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`${path.basename(command)} exited with code ${code}: ${stderr}`));
      }
    });
  });
}

function safeFileName(fileName: string, contentType?: string) {
  const cleanName = fileName.replace(/[^\w.\-() ]/g, '').trim();
  if (cleanName && /\.[a-z0-9]+$/i.test(cleanName)) return cleanName;
  if (contentType?.includes('mp4')) return `${cleanName || 'media'}.mp4`;
  if (contentType?.includes('webm')) return `${cleanName || 'media'}.webm`;
  if (contentType?.includes('mpeg')) return `${cleanName || 'media'}.mp3`;
  if (contentType?.includes('wav')) return `${cleanName || 'media'}.wav`;
  return `${cleanName || 'media'}.mp3`;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === 'object' && !Array.isArray(value));
}

function cleanEnvValue(value?: string) {
  return String(value || '')
    .replace(/^\uFEFF/, '')
    .trim()
    .replace(/^['"]|['"]$/g, '')
    .replace(/^\uFEFF/, '');
}
