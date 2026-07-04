/**
 * Audio silence trimmer for Custom AI Reel voiceover cleanup.
 *
 * Uses FFmpeg silenceremove filter to cut pauses longer than threshold.
 * Conservative settings: only removes gaps > 0.5s to keep natural speech rhythm.
 */
import {spawn} from 'node:child_process';
import {existsSync} from 'node:fs';
import {mkdtemp, readFile, rm, writeFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';

export type TrimmedAudioResult = {
  bytes: Uint8Array;
  contentType: 'audio/mpeg';
  fileName: string;
  originalDurationSeconds: number;
  trimmedDurationSeconds: number;
  bytesSize: number;
};

/**
 * Download audio from URL, trim silences > silenceThresholdSeconds, return cleaned MP3 bytes.
 * If FFmpeg is unavailable or trimming fails, returns null (caller uses original audio).
 */
export async function trimAudioSilences({
  audioUrl,
  fileName,
  silenceThresholdSeconds = 0.5,
  noiseFloorDb = -40,
  maxDurationSeconds = 60,
}: {
  audioUrl: string;
  fileName: string;
  silenceThresholdSeconds?: number;
  noiseFloorDb?: number;
  maxDurationSeconds?: number;
}): Promise<TrimmedAudioResult | null> {
  const ffmpegPath = findFfmpegPath();
  if (!ffmpegPath) {
    console.warn('[audioSilenceTrimmer] FFmpeg not found, skipping silence trim');
    return null;
  }

  const workDir = await mkdtemp(path.join(tmpdir(), 'itnavideo-silence-trim-'));
  const stem = path.basename(fileName, path.extname(fileName)).replace(/[^a-z0-9-]+/gi, '-').slice(0, 40) || 'audio';
  const ext = path.extname(fileName).toLowerCase() || '.mp3';
  const inputPath = path.join(workDir, `${stem}-input${ext}`);
  const trimmedPath = path.join(workDir, `${stem}-trimmed.mp3`);
  const finalPath = path.join(workDir, `${stem}-final.mp3`);

  try {
    // Download audio
    const response = await fetch(audioUrl);
    if (!response.ok) throw new Error(`Download failed: HTTP ${response.status}`);
    const audioBytes = Buffer.from(await response.arrayBuffer());
    await writeFile(inputPath, audioBytes);

    // Step 1: Probe original duration
    const originalDurationSeconds = await probeDuration(ffmpegPath, inputPath);

    // Step 2: Remove silences using silenceremove filter
    // stop_periods=-1 means process entire file (not just leading/trailing)
    // stop_duration = threshold in seconds
    // stop_threshold = noise floor in dB
    await runFfmpeg(ffmpegPath, [
      '-y',
      '-i', inputPath,
      '-af', [
        // Remove leading silence
        `silenceremove=start_periods=1:start_duration=0.1:start_threshold=${noiseFloorDb}dB`,
        // Remove internal and trailing silences longer than threshold
        `silenceremove=stop_periods=-1:stop_duration=${silenceThresholdSeconds}:stop_threshold=${noiseFloorDb}dB`,
      ].join(','),
      '-ac', '2',
      '-ar', '44100',
      '-b:a', '128k',
      '-f', 'mp3',
      trimmedPath,
    ]);

    // Step 3: Cap at maxDurationSeconds
    await runFfmpeg(ffmpegPath, [
      '-y',
      '-i', trimmedPath,
      '-t', String(maxDurationSeconds),
      '-c:a', 'copy',
      finalPath,
    ]);

    const trimmedDurationSeconds = await probeDuration(ffmpegPath, finalPath);
    const bytes = await readFile(finalPath);

    console.log(`[audioSilenceTrimmer] original=${originalDurationSeconds.toFixed(1)}s trimmed=${trimmedDurationSeconds.toFixed(1)}s`);

    return {
      bytes,
      contentType: 'audio/mpeg',
      fileName: `${stem}-cleaned.mp3`,
      originalDurationSeconds,
      trimmedDurationSeconds,
      bytesSize: bytes.byteLength,
    };
  } catch (error) {
    console.error('[audioSilenceTrimmer] failed:', error instanceof Error ? error.message : error);
    return null;
  } finally {
    await rm(workDir, {recursive: true, force: true}).catch(() => {});
  }
}

async function probeDuration(ffmpegPath: string, filePath: string): Promise<number> {
  const ffprobePath = ffmpegPath.replace(/ffmpeg(\.exe)?$/i, 'ffprobe$1');
  const cmd = existsSync(ffprobePath) ? ffprobePath : ffmpegPath;
  const args = existsSync(ffprobePath)
    ? ['-v', 'quiet', '-print_format', 'json', '-show_streams', filePath]
    : ['-i', filePath, '-hide_banner'];

  return new Promise<number>((resolve) => {
    let output = '';
    const child = spawn(cmd, args, {stdio: ['ignore', 'pipe', 'pipe']});
    child.stdout.on('data', (d: Buffer) => { output += d.toString(); });
    child.stderr.on('data', (d: Buffer) => { output += d.toString(); });
    child.on('close', () => {
      // Try JSON duration from ffprobe
      try {
        const json = JSON.parse(output);
        const dur = Number(json?.streams?.[0]?.duration || json?.format?.duration || 0);
        if (dur > 0) return resolve(dur);
      } catch {}
      // Fallback: parse from ffmpeg stderr "Duration: HH:MM:SS.ms"
      const m = output.match(/Duration:\s*(\d+):(\d+):([\d.]+)/);
      if (m) {
        const sec = Number(m[1]) * 3600 + Number(m[2]) * 60 + Number(m[3]);
        return resolve(sec);
      }
      resolve(0);
    });
  });
}

function runFfmpeg(command: string, args: string[]): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {stdio: ['ignore', 'ignore', 'pipe']});
    let stderr = '';
    child.stderr.on('data', (chunk: Buffer) => { stderr += chunk.toString(); });
    child.on('error', reject);
    child.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`ffmpeg exited ${code}: ${stderr.slice(-400)}`));
    });
  });
}

function findFfmpegPath(): string {
  const configured = String(process.env.FFMPEG_PATH || '').trim().replace(/^['"]|['"]$/g, '');
  if (configured && existsSync(configured)) return configured;

  const commandName = process.platform === 'win32' ? 'ffmpeg.exe' : 'ffmpeg';
  for (const dir of String(process.env.PATH || '').split(path.delimiter)) {
    if (!dir) continue;
    const candidate = path.join(dir, commandName);
    if (existsSync(candidate)) return candidate;
  }

  const ext = process.platform === 'win32' ? '.exe' : '';
  for (const pkg of [
    'compositor-win32-x64-msvc',
    'compositor-linux-x64-gnu',
    'compositor-linux-x64-musl',
    'compositor-linux-arm64-gnu',
    'compositor-darwin-x64',
    'compositor-darwin-arm64',
  ]) {
    const c = path.join(process.cwd(), 'node_modules', '@remotion', pkg, `ffmpeg${ext}`);
    if (existsSync(c)) return c;
  }

  return '';
}
