import { existsSync } from 'node:fs';
import { readFile, rename, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const CLOUDINARY_FOLDER = process.env.AUTOCAPTION_CLOUDINARY_FOLDER || 'itnavideo-assets/autocaptionvideos';
const TRANSCRIPTS_PATH = path.resolve(__dirname, '../lib/cloudinary/autocaption-transcripts.json');
const GROQ_URL = 'https://api.groq.com/openai/v1/audio/transcriptions';
const GROQ_MODEL = process.env.GROQ_TRANSCRIPTION_MODEL || 'whisper-large-v3-turbo';
const GROQ_MIN_REQUEST_INTERVAL_MS = Math.max(3200, Number(process.env.GROQ_MIN_REQUEST_INTERVAL_MS) || 3500);
let lastGroqRequestAt = 0;

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;
const groqApiKey = process.env.GROQ_API_KEY;

if (!cloudName || !apiKey || !apiSecret || !groqApiKey) {
  throw new Error('Missing Cloudinary or Groq credentials in .env.local.');
}

cloudinary.config({ cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret, secure: true });

async function listPreviewVideos() {
  const assets = [];
  let cursor;

  do {
    let query = cloudinary.search
      .expression(`resource_type:video AND asset_folder="${CLOUDINARY_FOLDER}"`)
      .max_results(100);
    if (cursor) query = query.next_cursor(cursor);

    const page = await query.execute();
    assets.push(...page.resources);
    cursor = page.next_cursor;
  } while (cursor);

  return assets;
}

function toAudioUrl(publicId) {
  return cloudinary.url(`${publicId}.mp3`, {
    resource_type: 'video',
    secure: true,
    transformation: [
      { audio_frequency: '16000' },
      { audio_codec: 'mp3', bit_rate: '32k' },
    ],
  });
}

function normalizeWords(value) {
  if (!Array.isArray(value)) return [];
  return value
    .map((word) => ({
      word: String(word?.word || '').trim(),
      start: Number(word?.start),
      end: Number(word?.end),
    }))
    .filter((word) => word.word && Number.isFinite(word.start) && Number.isFinite(word.end) && word.end > word.start);
}

function normalizeSegments(value) {
  if (!Array.isArray(value)) return [];
  return value
    .map((segment) => ({
      start: Number(segment?.start),
      end: Number(segment?.end),
      text: String(segment?.text || '').trim(),
    }))
    .filter((segment) => segment.text && Number.isFinite(segment.start) && Number.isFinite(segment.end) && segment.end > segment.start);
}

function deriveWordsFromSegments(segments) {
  return segments.flatMap((segment) => {
    const tokens = segment.text.split(/\s+/).filter(Boolean);
    const tokenDuration = (segment.end - segment.start) / Math.max(tokens.length, 1);
    return tokens.map((word, index) => ({
      word,
      start: segment.start + tokenDuration * index,
      end: segment.start + tokenDuration * (index + 1),
    }));
  });
}

function wait(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

async function waitForGroqSlot() {
  const remaining = GROQ_MIN_REQUEST_INTERVAL_MS - (Date.now() - lastGroqRequestAt);
  if (lastGroqRequestAt && remaining > 0) await wait(remaining);
  lastGroqRequestAt = Date.now();
}

async function transcribeAsset(asset) {
  const filename = `${path.posix.basename(asset.public_id)}.mp4`;
  const audioUrl = toAudioUrl(asset.public_id);
  const audioResponse = await fetch(audioUrl);
  if (!audioResponse.ok) {
    throw new Error(`Cloudinary audio delivery failed with ${audioResponse.status}`);
  }

  const audioBytes = await audioResponse.arrayBuffer();
  if (!audioBytes.byteLength) throw new Error('Cloudinary returned empty audio.');
  if (audioBytes.byteLength > 24 * 1024 * 1024) throw new Error('Audio exceeds Groq 24MB upload limit.');

  const form = new FormData();
  form.append('file', new Blob([audioBytes], { type: 'audio/mpeg' }), filename.replace(/\.mp4$/i, '.mp3'));
  form.append('model', GROQ_MODEL);
  form.append('response_format', 'verbose_json');
  form.append('temperature', '0');
  form.append('timestamp_granularities[]', 'segment');
  form.append('timestamp_granularities[]', 'word');
  form.append('prompt', 'Transcribe the audio exactly. Return clean English, or Roman Hinglish for Hindi or Hinglish speech. Do not invent or omit words.');

  await waitForGroqSlot();
  const response = await fetch(GROQ_URL, {
    method: 'POST',
    headers: { Authorization: `Bearer ${groqApiKey}` },
    body: form,
  });
  if (!response.ok) {
    const detail = await response.text();
    const error = new Error(`Groq transcription failed with ${response.status}: ${detail.slice(0, 400)}`);
    const retryAfterSeconds = Number(response.headers.get('retry-after')) || Number(detail.match(/try again in (\d+)s/i)?.[1]);
    error.retryAfterMs = retryAfterSeconds ? retryAfterSeconds * 1000 : 0;
    throw error;
  }

  const result = await response.json();
  const transcript = String(result.text || '').trim();
  const segments = normalizeSegments(result.segments);
  const words = normalizeWords(result.words);
  if (!transcript) throw new Error('Groq returned an empty transcript.');

  return {
    status: 'complete',
    publicId: asset.public_id,
    filename,
    transcript,
    words: words.length ? words : deriveWordsFromSegments(segments),
    segments,
    durationSeconds: Number.isFinite(Number(result.duration)) ? Number(result.duration) : asset.duration,
    model: GROQ_MODEL,
    transcribedAt: new Date().toISOString(),
  };
}

async function persistCatalog(catalog) {
  const temporaryPath = `${TRANSCRIPTS_PATH}.tmp`;
  await writeFile(temporaryPath, `${JSON.stringify(catalog, null, 2)}\n`, 'utf8');
  await rename(temporaryPath, TRANSCRIPTS_PATH);
}

async function main() {
  const assets = await listPreviewVideos();
  if (!assets.length) throw new Error(`No Cloudinary videos found in ${CLOUDINARY_FOLDER}.`);

  const catalog = existsSync(TRANSCRIPTS_PATH)
    ? JSON.parse(await readFile(TRANSCRIPTS_PATH, 'utf8'))
    : {};
  const retryFailed = process.argv.includes('--retry-failed');
  const pendingAssets = assets.filter((asset) => {
    const filename = `${path.posix.basename(asset.public_id)}.mp4`;
    const saved = catalog[filename];
    return !saved || (retryFailed && saved.status === 'failed');
  });

  console.log(`Cloudinary videos found: ${assets.length}`);
  console.log(`Already transcribed and saved: ${assets.length - pendingAssets.length}`);
  console.log(`Remaining one-time transcriptions: ${pendingAssets.length}`);

  if (process.argv.includes('--dry-run')) return;

  let failures = 0;
  for (let index = 0; index < pendingAssets.length; index += 1) {
    const asset = pendingAssets[index];
    const filename = `${path.posix.basename(asset.public_id)}.mp4`;
    let saved = false;
    let finalError;

    for (let attempt = 1; attempt <= 4 && !saved; attempt += 1) {
      try {
        catalog[filename] = await transcribeAsset(asset);
        await persistCatalog(catalog);
        console.log(`[${index + 1}/${pendingAssets.length}] Saved ${filename}`);
        saved = true;
      } catch (error) {
        finalError = error;
        const retryable = error.retryAfterMs || /fetch failed|failed with 5\d\d/i.test(error.message);
        if (!retryable || attempt === 4) break;
        const retryDelay = Math.max(error.retryAfterMs || 0, 3500 * attempt);
        console.warn(`[${index + 1}/${pendingAssets.length}] Retry ${attempt}/3 for ${filename} in ${Math.ceil(retryDelay / 1000)}s`);
        await wait(retryDelay);
      }
    }

    if (!saved) {
      failures += 1;
      const errorMessage = `${finalError?.message || 'Transcription failed'}${finalError?.cause?.code ? ` (${finalError.cause.code})` : ''}`;
      console.error(`[${index + 1}/${pendingAssets.length}] Failed ${filename}: ${errorMessage}`);
      catalog[filename] = {
        status: 'failed',
        publicId: asset.public_id,
        filename,
        transcript: '',
        words: [],
        segments: [],
        error: errorMessage,
        failedAt: new Date().toISOString(),
      };
      await persistCatalog(catalog);
    }
  }

  const completed = Object.values(catalog).filter((entry) => entry.status === 'complete').length;
  console.log(`Completed transcripts: ${completed}; failed attempts saved: ${failures}`);
  if (failures) process.exitCode = 1;
}

main().catch((error) => {
  console.error(`Auto Caption transcript batch failed: ${error.message}`);
  process.exitCode = 1;
});
