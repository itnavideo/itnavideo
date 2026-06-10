import {spawn} from 'node:child_process';
import {mkdir, readFile, writeFile} from 'node:fs/promises';
import {existsSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const bundledFfmpegPath = path.join(
  rootDir,
  'node_modules',
  '@remotion',
  'compositor-win32-x64-msvc',
  'ffmpeg.exe',
);
const inputArg = process.argv[2];

if (!inputArg) {
  throw new Error('Usage: node scripts/transcribe-video-explainer.mjs public/media/video.mp4');
}

await loadEnvFile(path.join(rootDir, '.env.local'));

const ffmpegPath = process.env.FFMPEG_PATH || findSystemFfmpeg() || bundledFfmpegPath;
const inputPath = path.resolve(rootDir, inputArg);
const stem = path.basename(inputPath, path.extname(inputPath)).replace(/[^a-z0-9-]+/gi, '-').toLowerCase();
const outputDir = path.join(rootDir, 'public', 'renders', 'transcripts');
const audioPath = path.join(outputDir, `${stem}.mp3`);
const jsonPath = path.join(outputDir, `${stem}.transcript.json`);
const textPath = path.join(outputDir, `${stem}.transcript.txt`);
const cleanTranscriptAudio = process.env.CLEAN_TRANSCRIPT_AUDIO !== '0';
const fullCleanupFilter =
  process.env.AUDIO_CLEANUP_FILTER ||
  'highpass=f=80,lowpass=f=12000,afftdn=nf=-25,loudnorm=I=-16:TP=-1.5:LRA=11';
const fallbackCleanupFilter =
  process.env.AUDIO_CLEANUP_FALLBACK_FILTER ||
  'loudnorm=I=-16:TP=-1.5:LRA=11';
const transcriptionTask = (process.env.TRANSCRIPTION_TASK || 'translate').toLowerCase();
const translateToEnglish = !['transcribe', 'source', 'source-language'].includes(transcriptionTask);
const transcriptionPrompt =
  process.env.TRANSCRIPTION_PROMPT ||
  [
    'Transcribe and translate the spoken audio into clean natural English only.',
    'If the speaker uses Hindi, Urdu, or Hinglish, translate the meaning into English instead of romanizing it.',
    'Keep official names and terms in standard English, such as RBI, Reserve Bank of India, PAN Card, Aadhaar, Salary, Benefits, Documents, Apply, Download.',
    'Do not output Devanagari, Urdu, Arabic script, Roman Hinglish, phonetic spellings, scene notes, headings, or timeline JSON.',
    'Return only the spoken transcript text in English.',
  ].join(' ');

await mkdir(outputDir, {recursive: true});

if (!existsSync(inputPath)) {
  throw new Error(`Input video not found: ${inputPath}`);
}

await extractAudio(inputPath, audioPath);
const transcript = await transcribeAudio(audioPath);

await writeFile(jsonPath, `${JSON.stringify(transcript, null, 2)}\n`);
await writeFile(textPath, `${(transcript.text || '').trim()}\n`);

process.stdout.write(`Audio: ${path.relative(rootDir, audioPath)}\n`);
process.stdout.write(`FFmpeg: ${ffmpegPath}\n`);
process.stdout.write(`Transcript JSON: ${path.relative(rootDir, jsonPath)}\n`);
process.stdout.write(`Transcript TXT: ${path.relative(rootDir, textPath)}\n`);

async function extractAudio(source, target) {
  const baseArgs = [
    '-y',
    '-i',
    source,
    '-vn',
  ];
  const outputArgs = [
    '-ac',
    '1',
    '-ar',
    '16000',
    '-b:a',
    '64k',
    target,
  ];

  if (!cleanTranscriptAudio) {
    await run(ffmpegPath, [...baseArgs, ...outputArgs]);
    return;
  }

  try {
    await run(ffmpegPath, [...baseArgs, '-af', fullCleanupFilter, ...outputArgs]);
    process.stdout.write(`Transcript audio cleanup: ${fullCleanupFilter}\n`);
  } catch (error) {
    process.stderr.write(`Full transcript audio cleanup unavailable, using fallback: ${error.message}\n`);
    await run(ffmpegPath, [...baseArgs, '-af', fallbackCleanupFilter, ...outputArgs]);
    process.stdout.write(`Transcript audio cleanup: ${fallbackCleanupFilter}\n`);
  }
}

async function transcribeAudio(audioFile) {
  const provider = (process.env.PREFERRED_TRANSCRIPTION_PROVIDER || 'groq').toLowerCase();
  if (provider === 'openai') {
    return transcribeWithOpenAI(audioFile);
  }

  try {
    return await transcribeWithGroq(audioFile);
  } catch (error) {
    if (process.env.OPENAI_API_KEY) {
      process.stderr.write(`Groq transcription failed, trying OpenAI fallback: ${error.message}\n`);
      return transcribeWithOpenAI(audioFile);
    }
    throw error;
  }
}

async function transcribeWithGroq(audioFile) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error('Missing GROQ_API_KEY in .env.local');
  const endpoint = translateToEnglish
    ? 'https://api.groq.com/openai/v1/audio/translations'
    : 'https://api.groq.com/openai/v1/audio/transcriptions';

  const form = new FormData();
  form.append('file', await fileBlob(audioFile), path.basename(audioFile));
  form.append('model', process.env.GROQ_TRANSCRIPTION_MODEL || 'whisper-large-v3-turbo');
  form.append('response_format', process.env.GROQ_TRANSCRIPTION_RESPONSE_FORMAT || 'verbose_json');
  form.append('temperature', '0');
  appendTranscriptionGuidance(form, 'GROQ');

  const response = await fetch(endpoint, {
    body: form,
    headers: {Authorization: `Bearer ${apiKey}`},
    method: 'POST',
  });

  if (!response.ok) {
    throw new Error(`Groq transcription failed: ${response.status} ${await response.text()}`);
  }

  return response.json();
}

async function transcribeWithOpenAI(audioFile) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error('Missing OPENAI_API_KEY in .env.local');
  const endpoint = translateToEnglish
    ? 'https://api.openai.com/v1/audio/translations'
    : 'https://api.openai.com/v1/audio/transcriptions';

  const form = new FormData();
  form.append('file', await fileBlob(audioFile), path.basename(audioFile));
  form.append('model', 'whisper-1');
  form.append('response_format', 'verbose_json');
  form.append('temperature', '0');
  appendTranscriptionGuidance(form, 'OPENAI');

  const response = await fetch(endpoint, {
    body: form,
    headers: {Authorization: `Bearer ${apiKey}`},
    method: 'POST',
  });

  if (!response.ok) {
    throw new Error(`OpenAI transcription failed: ${response.status} ${await response.text()}`);
  }

  return response.json();
}

function appendTranscriptionGuidance(form, provider) {
  const prompt = process.env[`${provider}_TRANSCRIPTION_PROMPT`] || transcriptionPrompt;
  const language = process.env[`${provider}_TRANSCRIPTION_LANGUAGE`] || process.env.TRANSCRIPTION_LANGUAGE || '';
  if (prompt) form.append('prompt', prompt);
  if (!translateToEnglish && language && language.toLowerCase() !== 'auto') form.append('language', language);
}

async function fileBlob(filePath) {
  const bytes = await readFile(filePath);
  return new Blob([bytes], {type: 'audio/mpeg'});
}

function run(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {stdio: ['ignore', 'pipe', 'pipe']});
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

function findSystemFfmpeg() {
  const pathValue = process.env.PATH || '';
  const commandName = process.platform === 'win32' ? 'ffmpeg.exe' : 'ffmpeg';
  for (const directory of pathValue.split(path.delimiter)) {
    if (!directory) continue;
    const candidate = path.join(directory, commandName);
    if (existsSync(candidate)) return candidate;
  }
  return '';
}

async function loadEnvFile(envPath) {
  if (!existsSync(envPath)) return;
  const env = await readFile(envPath, 'utf8');
  for (const line of env.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const separator = trimmed.indexOf('=');
    if (separator === -1) continue;
    const key = trimmed.slice(0, separator).trim();
    const value = trimmed.slice(separator + 1).trim().replace(/^["']|["']$/g, '');
    if (!process.env[key]) process.env[key] = value;
  }
}
