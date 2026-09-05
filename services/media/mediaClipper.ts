import {spawn} from 'node:child_process';
import {existsSync} from 'node:fs';
import {mkdtemp, readFile, rm, writeFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';

export type PlanningMediaClip = {
  bytes: Uint8Array;
  contentType: string;
  fileName: string;
  mode: 'audio' | 'video';
  maxSeconds: number;
  transcriptionAudio?: {
    bytes: Uint8Array;
    contentType: 'audio/mpeg';
    fileName: string;
  };
};

export async function createPlanningMediaClip({
  mediaUrl,
  fileName,
  contentType,
  maxSeconds = 60,
}: {
  mediaUrl: string;
  fileName: string;
  contentType?: string;
  maxSeconds?: number;
}): Promise<PlanningMediaClip> {
  const mode = contentType?.startsWith('audio/') ? 'audio' as const : 'video' as const;
  const ffmpegPath = findFfmpegPath();
  if (!ffmpegPath) throw new Error('FFmpeg is unavailable for media clipping.');

  const safeSeconds = Math.max(1, Math.min(600, Math.round(maxSeconds)));
  const workDir = await mkdtemp(path.join(tmpdir(), 'itnavideo-planning-media-'));
  const stem = path.basename(fileName, path.extname(fileName)).replace(/[^a-z0-9-]+/gi, '-').slice(0, 60) || 'media';
  const inputPath = path.join(workDir, `${stem}-source${extensionFromContentType(contentType, mediaUrl, mode)}`);
  const outputPath = path.join(workDir, mode === 'audio' ? `${stem}-first-${safeSeconds}s.mp3` : `${stem}-first-${safeSeconds}s.mp4`);
  const audioPath = path.join(workDir, `${stem}-first-${safeSeconds}s-transcript.mp3`);

  try {
    await writeFile(inputPath, await readMediaInput(mediaUrl));
    await runFfmpeg(ffmpegPath, mode === 'audio'
      ? [
          '-y',
          '-i',
          inputPath,
          '-t',
          String(safeSeconds),
          '-vn',
          '-ac',
          '1',
          '-ar',
          '16000',
          '-b:a',
          '64k',
          '-f',
          'mp3',
          outputPath,
        ]
      : [
          '-y',
          '-i',
          inputPath,
          '-t',
          String(safeSeconds),
          '-map',
          '0:v:0?',
          '-map',
          '0:a:0?',
          '-c:v',
          'copy',
          '-c:a',
          'aac',
          '-b:a',
          '128k',
          '-movflags',
          '+faststart',
          '-shortest',
          outputPath,
        ]);
    if (mode === 'video') {
      await runFfmpeg(ffmpegPath, [
        '-y',
        '-i',
        outputPath,
        '-t',
        String(safeSeconds),
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
        audioPath,
      ]);
    }

    return {
      bytes: await readFile(outputPath),
      contentType: mode === 'audio' ? 'audio/mpeg' : 'video/mp4',
      fileName: path.basename(outputPath),
      mode,
      maxSeconds: safeSeconds,
      transcriptionAudio: mode === 'video'
        ? {
            bytes: await readFile(audioPath),
            contentType: 'audio/mpeg',
            fileName: path.basename(audioPath),
          }
        : undefined,
    };
  } finally {
    await rm(workDir, {recursive: true, force: true});
  }
}

export function findFfmpegPath() {
  const configured = cleanEnvValue(process.env.FFMPEG_PATH);
  if (configured && existsSync(configured)) return configured;

  const system = findSystemFfmpeg();
  if (system) return system;

  try {
    const ffmpegStatic = require('ffmpeg-static');
    if (ffmpegStatic && existsSync(ffmpegStatic)) return ffmpegStatic;
  } catch {}

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
    const unixCandidate = path.join(process.cwd(), 'node_modules', '@remotion', packageName, 'ffmpeg');
    if (existsSync(unixCandidate)) return unixCandidate;
  }

  return '';
}

export async function probeAudioDuration(filePath: string): Promise<number> {
  try {
    const ffprobeStatic = require('ffprobe-static');
    const ffprobePath = ffprobeStatic?.path || 'ffprobe';
    const { execFile } = require('node:child_process');
    const { promisify } = require('node:util');
    const execFileAsync = promisify(execFile);

    const { stdout } = await execFileAsync(ffprobePath, [
      '-v', 'error',
      '-show_entries', 'format=duration',
      '-of', 'default=noprint_wrappers=1:nokey=1',
      filePath,
    ]);
    const duration = parseFloat(String(stdout || '').trim());
    return !isNaN(duration) && duration > 0 ? duration : 0;
  } catch {
    return 0;
  }
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

export async function readMediaInput(mediaUrl: string) {
  if (/^https?:\/\//i.test(mediaUrl)) {
    const response = await fetch(mediaUrl);
    if (!response.ok) {
      throw new Error(`Could not download media for clipping. HTTP ${response.status}`);
    }
    return Buffer.from(await response.arrayBuffer());
  }

  if (/^file:\/\//i.test(mediaUrl)) {
    return readFile(new URL(mediaUrl));
  }

  return readFile(mediaUrl);
}

function extensionFromContentType(contentType: string | undefined, mediaUrl: string, mode: 'audio' | 'video') {
  const urlExt = path.extname(mediaUrl.split('?')[0] || '').toLowerCase();
  if (urlExt && urlExt.length <= 8) return urlExt;
  const type = String(contentType || '').toLowerCase();
  if (type.includes('quicktime')) return '.mov';
  if (type.includes('webm')) return '.webm';
  if (type.includes('mpeg') || type.includes('mp3')) return '.mp3';
  if (type.includes('wav')) return '.wav';
  if (type.includes('m4a') || type.includes('aac')) return '.m4a';
  return mode === 'audio' ? '.mp3' : '.mp4';
}

export function runFfmpeg(command: string, args: string[]) {
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

function cleanEnvValue(value?: string) {
  return String(value || '').trim().replace(/^['"]|['"]$/g, '');
}
