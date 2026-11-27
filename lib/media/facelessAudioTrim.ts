import { spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import type { Readable } from 'node:stream';
import { createRequire } from 'node:module';
import { createReadUrl, uploadTemporaryMediaObject } from '@/lib/aws/mediaStorage';

const require = createRequire(import.meta.url);

export function resolveFfmpegBinary(): string {
  try {
    const mod = require('ffmpeg-static');
    const resolved = typeof mod === 'string' ? mod : mod?.default;
    if (resolved && fs.existsSync(resolved)) {
      return resolved;
    }
  } catch {
    // Fall back to system ffmpeg in PATH
  }
  const winFallback = process.env.LOCALAPPDATA
    ? path.join(process.env.LOCALAPPDATA, 'Microsoft', 'WinGet', 'Links', 'ffmpeg.exe')
    : '';
  if (winFallback && fs.existsSync(winFallback)) {
    return winFallback;
  }
  return 'ffmpeg';
}

export function resolveYtDlpBinary(): string {
  const candidates = [
    process.env.YTDLP_PATH || '',
    '/usr/local/bin/yt-dlp',
    '/usr/bin/yt-dlp',
    process.env.LOCALAPPDATA
      ? path.join(process.env.LOCALAPPDATA, 'Microsoft', 'WinGet', 'Links', 'yt-dlp.exe')
      : '',
  ].filter(Boolean);

  for (const c of candidates) {
    if (fs.existsSync(c)) return c;
  }
  return 'yt-dlp';
}

function runProcess(
  bin: string,
  args: string[],
  timeoutMs = 180_000
): Promise<{ stdout: string; stderr: string }> {
  return new Promise((resolve, reject) => {
    const proc = spawn(bin, args, { stdio: ['ignore', 'pipe', 'pipe'] });
    let stdout = '';
    let stderr = '';
    const timer = setTimeout(() => {
      proc.kill('SIGKILL');
      reject(new Error(`${path.basename(bin)} timed out after ${Math.round(timeoutMs / 1000)}s`));
    }, timeoutMs);

    proc.stdout?.on('data', (chunk) => {
      stdout += chunk.toString();
    });
    proc.stderr?.on('data', (chunk) => {
      if (stderr.length < 8000) stderr += chunk.toString();
    });
    proc.on('error', (err) => {
      clearTimeout(timer);
      reject(err);
    });
    proc.on('close', (code) => {
      clearTimeout(timer);
      if (code === 0) {
        resolve({ stdout, stderr });
      } else {
        reject(new Error(`${path.basename(bin)} exited with ${code}: ${stderr.slice(-500)}`));
      }
    });
  });
}

export async function probeMediaDurationSeconds(inputUrl: string): Promise<number> {
  const ffmpegBin = resolveFfmpegBinary();
  try {
    const proc = spawn(ffmpegBin, ['-hide_banner', '-i', inputUrl], {
      stdio: ['ignore', 'ignore', 'pipe'],
    });
    let stderr = '';
    proc.stderr?.on('data', (chunk) => {
      if (stderr.length < 6000) stderr += chunk.toString();
    });
    await new Promise<void>((resolve) => {
      const t = setTimeout(() => {
        proc.kill('SIGKILL');
        resolve();
      }, 15_000);
      proc.on('close', () => {
        clearTimeout(t);
        resolve();
      });
      proc.on('error', () => {
        clearTimeout(t);
        resolve();
      });
    });
    const m = stderr.match(/Duration:\s*(\d+):(\d+):(\d+(?:\.\d+)?)/i);
    if (m) {
      return Math.round(Number(m[1]) * 3600 + Number(m[2]) * 60 + Number(m[3]));
    }
  } catch {
    // Best-effort probe
  }
  return 0;
}

export async function trimMediaToMp3AndUpload({
  inputUrl,
  inputStream,
  maxSeconds = 300,
  userId = 'guest_user',
  fileName = 'faceless-trimmed.mp3',
}: {
  inputUrl?: string;
  inputStream?: Readable;
  maxSeconds?: number;
  userId?: string;
  fileName?: string;
}): Promise<{ mediaKey: string; audioUrl: string }> {
  const ffmpegBin = resolveFfmpegBinary();
  const tmpOut = path.join(os.tmpdir(), `faceless-trim-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.mp3`);

  try {
    await new Promise<void>((resolve, reject) => {
      const args = inputUrl
        ? ['-y', '-i', inputUrl, '-t', String(maxSeconds), '-vn', '-acodec', 'libmp3lame', '-ab', '96k', '-ac', '1', '-ar', '44100', tmpOut]
        : ['-y', '-i', 'pipe:0', '-t', String(maxSeconds), '-vn', '-acodec', 'libmp3lame', '-ab', '96k', '-ac', '1', '-ar', '44100', tmpOut];

      const proc = spawn(ffmpegBin, args, {
        stdio: [inputStream ? 'pipe' : 'ignore', 'ignore', 'pipe'],
      });

      let stderr = '';
      proc.stderr?.on('data', (chunk) => {
        if (stderr.length < 4000) stderr += chunk.toString();
      });

      if (inputStream && proc.stdin) {
        inputStream.on('error', (err) => {
          proc.kill('SIGKILL');
          reject(err);
        });
        proc.stdin.on('error', () => {
          // Expected when FFmpeg stops reading at -t maxSeconds
        });
        inputStream.pipe(proc.stdin);
      }

      proc.on('error', (err) => reject(err));
      proc.on('close', (code) => {
        if (code === 0 && fs.existsSync(tmpOut) && fs.statSync(tmpOut).size > 0) {
          resolve();
        } else {
          reject(new Error(`FFmpeg trim failed (exit ${code}): ${stderr.slice(-400)}`));
        }
      });
    });

    const mp3Buffer = fs.readFileSync(tmpOut);
    const { key } = await uploadTemporaryMediaObject({
      body: new Uint8Array(mp3Buffer),
      contentType: 'audio/mpeg',
      fileName,
      mode: 'audio',
      userId,
      purpose: 'trimmed-5m',
    });
    const audioUrl = await createReadUrl(key);
    return { mediaKey: key, audioUrl };
  } finally {
    if (fs.existsSync(tmpOut)) {
      fs.unlinkSync(tmpOut);
    }
  }
}

export async function extractYoutubeFirstFiveMinutesToMp3({
  canonicalUrl,
  videoId,
  maxSeconds = 300,
  userId = 'guest_user',
}: {
  canonicalUrl: string;
  videoId: string;
  maxSeconds?: number;
  userId?: string;
}): Promise<{
  mediaKey: string;
  audioUrl: string;
  title: string;
  originalDurationSeconds: number;
  trimmedDurationSeconds: number;
  wasTrimmed: boolean;
}> {
  const ytdlpBin = resolveYtDlpBinary();
  const ffmpegBin = resolveFfmpegBinary();
  const ffmpegDir = path.isAbsolute(ffmpegBin) ? path.dirname(ffmpegBin) : undefined;

  // 1. Fetch metadata first (no video/audio download)
  const metaRes = await runProcess(
    ytdlpBin,
    ['--no-playlist', '--no-warnings', '--dump-single-json', canonicalUrl],
    45_000
  );
  const meta = JSON.parse(metaRes.stdout.trim());
  const title = String(meta?.title || `YouTube Video ${videoId}`).trim();
  const originalDurationSeconds = Math.round(Number(meta?.duration) || 0);
  const safeSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 40) || videoId;

  const endMin = Math.floor(maxSeconds / 60);
  const endSec = String(maxSeconds % 60).padStart(2, '0');
  const sectionRange = `*0:00-${endMin}:${endSec}`;

  const tmpPrefix = path.join(os.tmpdir(), `yt-5m-${videoId}-${Date.now()}`);
  const tmpOutTemplate = `${tmpPrefix}.%(ext)s`;
  const expectedMp3 = `${tmpPrefix}.mp3`;

  try {
    // 2. Download ONLY the first 5 minutes of audio and convert to mono MP3
    const dlArgs = [
      '--no-playlist',
      '--no-warnings',
      '-f',
      'bestaudio[ext=m4a]/bestaudio/best',
      '--download-sections',
      sectionRange,
      '-x',
      '--audio-format',
      'mp3',
      '--audio-quality',
      '4',
      '--postprocessor-args',
      `ffmpeg:-t ${maxSeconds} -ac 1 -ar 44100`,
      ...(ffmpegDir ? ['--ffmpeg-location', ffmpegDir] : []),
      '-o',
      tmpOutTemplate,
      canonicalUrl,
    ];

    try {
      await runProcess(ytdlpBin, dlArgs, 180_000);
    } catch (sectionErr) {
      // Fallback: grab direct audio stream URL and let FFmpeg trim at -t 300
      console.warn('[YOUTUBE_AUDIO] --download-sections failed, trying stream URL + FFmpeg trim:', sectionErr);
      const urlRes = await runProcess(
        ytdlpBin,
        ['--no-playlist', '--no-warnings', '-f', 'bestaudio/best', '-g', canonicalUrl],
        45_000
      );
      const streamUrl = urlRes.stdout.trim().split(/\r?\n/)[0]?.trim();
      if (!streamUrl) {
        throw sectionErr;
      }
      const trimmed = await trimMediaToMp3AndUpload({
        inputUrl: streamUrl,
        maxSeconds,
        userId,
        fileName: `yt-${safeSlug}-5m.mp3`,
      });
      const trimmedDurationSeconds =
        originalDurationSeconds > 0 ? Math.min(maxSeconds, originalDurationSeconds) : maxSeconds;
      return {
        ...trimmed,
        title,
        originalDurationSeconds,
        trimmedDurationSeconds,
        wasTrimmed: originalDurationSeconds > maxSeconds,
      };
    }

    if (!fs.existsSync(expectedMp3) || fs.statSync(expectedMp3).size === 0) {
      throw new Error('Extracted MP3 file was empty.');
    }

    const mp3Buffer = fs.readFileSync(expectedMp3);
    const { key } = await uploadTemporaryMediaObject({
      body: new Uint8Array(mp3Buffer),
      contentType: 'audio/mpeg',
      fileName: `yt-${safeSlug}-5m.mp3`,
      mode: 'audio',
      userId,
      purpose: 'trimmed-5m',
    });
    const audioUrl = await createReadUrl(key);
    const trimmedDurationSeconds =
      originalDurationSeconds > 0 ? Math.min(maxSeconds, originalDurationSeconds) : maxSeconds;

    return {
      mediaKey: key,
      audioUrl,
      title,
      originalDurationSeconds,
      trimmedDurationSeconds,
      wasTrimmed: originalDurationSeconds > maxSeconds,
    };
  } finally {
    if (fs.existsSync(expectedMp3)) {
      fs.unlinkSync(expectedMp3);
    }
  }
}
