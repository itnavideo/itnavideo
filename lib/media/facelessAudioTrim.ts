import { spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import type { Readable } from 'node:stream';
import { createRequire } from 'node:module';
import { createReadUrl, uploadTemporaryMediaObject } from '@/lib/aws/mediaStorage';

const require = createRequire(import.meta.url);

export function resolveFfmpegBinary(): string | null {
  try {
    const mod = require('ffmpeg-static');
    const resolved = typeof mod === 'string' ? mod : mod?.default;
    if (resolved && fs.existsSync(resolved)) {
      return resolved;
    }
  } catch {
    // Fall back to system ffmpeg in PATH (installed in Cloud Run Alpine image)
  }
  return 'ffmpeg';
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
  if (!ffmpegBin) {
    throw new Error('FFmpeg binary is not available on this server.');
  }

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

