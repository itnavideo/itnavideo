import {spawn} from 'node:child_process';
import {mkdir, readFile} from 'node:fs/promises';
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
const outputArg = process.argv[3];
const maxPreprocessSeconds = Number(process.env.PREPROCESS_MEDIA_MAX_SECONDS || 60);
const fullCleanupFilter =
  process.env.AUDIO_CLEANUP_FILTER ||
  'highpass=f=80,lowpass=f=12000,afftdn=nf=-25,loudnorm=I=-16:TP=-1.5:LRA=11';
const fallbackCleanupFilter =
  process.env.AUDIO_CLEANUP_FALLBACK_FILTER ||
  'loudnorm=I=-16:TP=-1.5:LRA=11';

if (!inputArg) {
  throw new Error('Usage: node scripts/preprocess-media-audio.mjs public/media/input.mp4 [public/renders/input-clean.mp4]');
}

await loadEnvFile(path.join(rootDir, '.env.local'));

const ffmpegPath = process.env.FFMPEG_PATH || findSystemFfmpeg() || bundledFfmpegPath;
const inputPath = path.resolve(rootDir, inputArg);
const inputExtension = path.extname(inputPath).toLowerCase();
const inputStem = path.basename(inputPath, inputExtension).replace(/[^a-z0-9-]+/gi, '-').toLowerCase();
const outputPath = outputArg
  ? path.resolve(rootDir, outputArg)
  : path.join(
      rootDir,
      'public',
      'renders',
      'cleaned',
      `${inputStem}-clean${isVideo(inputExtension) ? '.mp4' : '.mp3'}`,
    );

if (!existsSync(inputPath)) {
  throw new Error(`Input not found: ${inputPath}`);
}

await mkdir(path.dirname(outputPath), {recursive: true});

try {
  await cleanMedia(inputPath, outputPath, fullCleanupFilter);
  process.stdout.write(`Cleaned media: ${path.relative(rootDir, outputPath)}\n`);
  process.stdout.write(`FFmpeg: ${ffmpegPath}\n`);
  process.stdout.write(`Audio filter: ${fullCleanupFilter}\n`);
} catch (error) {
  process.stderr.write(`Full audio cleanup unavailable, using safe fallback: ${error.message}\n`);
  await cleanMedia(inputPath, outputPath, fallbackCleanupFilter);
  process.stdout.write(`Cleaned media: ${path.relative(rootDir, outputPath)}\n`);
  process.stdout.write(`FFmpeg: ${ffmpegPath}\n`);
  process.stdout.write(`Audio filter: ${fallbackCleanupFilter}\n`);
}

async function cleanMedia(source, target, audioFilter) {
  const extension = path.extname(target).toLowerCase();
  const trimArgs = Number.isFinite(maxPreprocessSeconds) && maxPreprocessSeconds > 0
    ? ['-t', String(maxPreprocessSeconds)]
    : [];
  if (isVideo(extension)) {
    await run(ffmpegPath, [
      '-y',
      '-i',
      source,
      ...trimArgs,
      '-map',
      '0:v:0?',
      '-map',
      '0:a:0?',
      '-c:v',
      'copy',
      '-af',
      audioFilter,
      '-c:a',
      'aac',
      '-b:a',
      '160k',
      '-shortest',
      target,
    ]);
    return;
  }

  await run(ffmpegPath, [
    '-y',
    '-i',
    source,
    ...trimArgs,
    '-vn',
    '-af',
    audioFilter,
    '-ac',
    '1',
    '-ar',
    '44100',
    '-b:a',
    '128k',
    target,
  ]);
}

function isVideo(extension) {
  return ['.mp4', '.mov', '.m4v', '.webm', '.avi', '.mkv'].includes(extension);
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
