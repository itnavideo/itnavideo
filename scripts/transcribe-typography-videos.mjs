import { existsSync } from 'node:fs';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const CLOUDINARY_FOLDER = 'itnavideo-assets/typographyvideos';
const TRANSCRIPTS_PATH = path.resolve(__dirname, '../lib/cloudinary/typography-transcripts.json');
const GROQ_URL = 'https://api.groq.com/openai/v1/audio/transcriptions';
const GROQ_MODEL = process.env.GROQ_TRANSCRIPTION_MODEL || 'whisper-large-v3-turbo';
const GROQ_MIN_REQUEST_INTERVAL_MS = 3200;
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

async function rateLimitGroq() {
  const elapsed = Date.now() - lastGroqRequestAt;
  if (elapsed < GROQ_MIN_REQUEST_INTERVAL_MS) {
    await new Promise((resolve) => setTimeout(resolve, GROQ_MIN_REQUEST_INTERVAL_MS - elapsed));
  }
  lastGroqRequestAt = Date.now();
}

async function transcribeAudioUrl(audioUrl, filename) {
  const audioResponse = await fetch(audioUrl);
  if (!audioResponse.ok) {
    throw new Error(`Failed to fetch audio from Cloudinary (${audioResponse.status} ${audioResponse.statusText})`);
  }

  const audioBlob = await audioResponse.blob();
  const formData = new FormData();
  formData.append('file', audioBlob, `${filename}.mp3`);
  formData.append('model', GROQ_MODEL);
  formData.append('response_format', 'verbose_json');
  formData.append('timestamp_granularities[]', 'word');
  formData.append('timestamp_granularities[]', 'segment');
  formData.append('temperature', '0');

  let attempts = 0;
  while (attempts < 4) {
    attempts += 1;
    await rateLimitGroq();

    const res = await fetch(GROQ_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${groqApiKey}`,
      },
      body: formData,
    });

    if (res.ok) {
      const data = await res.json();
      return {
        text: String(data?.text || '').trim(),
        words: normalizeWords(data?.words),
        segments: normalizeSegments(data?.segments),
      };
    }

    if (res.status === 429 && attempts < 4) {
      console.warn(`    ⚠️ Rate limit hit. Waiting 5s before retry...`);
      await new Promise((r) => setTimeout(r, 5000));
      continue;
    }

    const errorText = await res.text().catch(() => '');
    throw new Error(`Groq API Error (${res.status}): ${errorText || res.statusText}`);
  }
}

async function main() {
  console.log('🔍 Listing Cloudinary typography videos...');
  const videos = await listPreviewVideos();
  console.log(`Found ${videos.length} videos in ${CLOUDINARY_FOLDER}.`);

  let registry = {};
  if (existsSync(TRANSCRIPTS_PATH)) {
    try {
      registry = JSON.parse(await readFile(TRANSCRIPTS_PATH, 'utf8'));
    } catch {
      registry = {};
    }
  }

  let index = 0;
  for (const video of videos) {
    index += 1;
    const publicId = video.public_id;
    const filename = path.basename(publicId);

    if (registry[filename]?.words?.length > 0) {
      console.log(`[${index}/${videos.length}] ⏭️  Already transcribed: ${filename}`);
      continue;
    }

    console.log(`[${index}/${videos.length}] 🎙️ Transcribing: ${filename}...`);
    const audioUrl = toAudioUrl(publicId);

    try {
      const result = await transcribeAudioUrl(audioUrl, filename);
      console.log(`  ✅ Done: "${result.text.slice(0, 50)}..." (${result.words.length} words)`);

      registry[filename] = {
        publicId,
        secureUrl: video.secure_url,
        posterUrl: video.secure_url.replace(/\.mp4$/i, '.jpg'),
        duration: video.duration,
        text: result.text,
        words: result.words,
        segments: result.segments,
        updatedAt: new Date().toISOString(),
      };

      await writeFile(TRANSCRIPTS_PATH, JSON.stringify(registry, null, 2), 'utf8');
    } catch (err) {
      console.error(`  ❌ Failed transcribing ${filename}:`, err.message);
    }
  }

  console.log(`\n🎉 All typography video transcripts saved to ${TRANSCRIPTS_PATH}!`);
}

main().catch(console.error);
