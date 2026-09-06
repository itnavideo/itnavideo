import {spawn, execFile} from 'node:child_process';
import {existsSync, copyFileSync, chmodSync} from 'node:fs';
import {mkdtemp, readFile, rm, writeFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {promisify} from 'node:util';
import {createRequire} from 'node:module';

const nodeRequire = createRequire(import.meta.url);
const execFileAsync = promisify(execFile);

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

  const safeSeconds = Math.max(1, Math.min(1200, Math.round(maxSeconds)));
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

function prepareExecutable(sourcePath: string, binaryName: string): string {
  if (process.platform === 'win32') return sourcePath;
  try {
    const tmpBinary = path.join(tmpdir(), `itnavideo-${binaryName}`);
    if (existsSync(tmpBinary)) {
      try {
        chmodSync(tmpBinary, 0o755);
        return tmpBinary;
      } catch {}
    }
    copyFileSync(sourcePath, tmpBinary);
    chmodSync(tmpBinary, 0o755);
    return tmpBinary;
  } catch (err) {
    try {
      chmodSync(sourcePath, 0o755);
    } catch {}
    return sourcePath;
  }
}

export function findFfmpegPath(): string {
  // 1. Explicit environment variable
  const configured = cleanEnvValue(process.env.FFMPEG_PATH);
  if (configured && existsSync(configured)) return prepareExecutable(configured, 'ffmpeg');

  const extension = process.platform === 'win32' ? '.exe' : '';
  const binaryName = `ffmpeg${extension}`;

  // 2. System PATH
  const system = findSystemBinary(binaryName);
  if (system) return system;

  // 3. ffmpeg-static require
  try {
    const ffmpegStatic = nodeRequire('ffmpeg-static');
    const staticPath = typeof ffmpegStatic === 'string' ? ffmpegStatic : ffmpegStatic?.default;
    if (staticPath && existsSync(staticPath)) return prepareExecutable(staticPath, 'ffmpeg');
  } catch {}

  // 4. ffmpeg-static package directory resolution via nodeRequire.resolve
  try {
    const pkgJson = nodeRequire.resolve('ffmpeg-static/package.json');
    const candidate = path.join(path.dirname(pkgJson), binaryName);
    if (existsSync(candidate)) return prepareExecutable(candidate, 'ffmpeg');
  } catch {}

  // 5. Direct search in common node_modules roots
  const compositorPackages = [
    'compositor-win32-x64-msvc',
    'compositor-linux-x64-gnu',
    'compositor-linux-x64-musl',
    'compositor-linux-arm64-gnu',
    'compositor-darwin-x64',
    'compositor-darwin-arm64',
  ];

  const searchRoots = [
    process.cwd(),
    path.join(process.cwd(), '.next', 'standalone'),
    path.join(process.cwd(), '.next', 'server'),
    '/var/task',
    '/var/task/.next/standalone',
  ];

  for (const root of searchRoots) {
    const candidate = path.join(root, 'node_modules', 'ffmpeg-static', binaryName);
    if (existsSync(candidate)) return prepareExecutable(candidate, 'ffmpeg');

    for (const pkgName of compositorPackages) {
      const compositorCandidate = path.join(root, 'node_modules', '@remotion', pkgName, binaryName);
      if (existsSync(compositorCandidate)) return prepareExecutable(compositorCandidate, 'ffmpeg');
    }
  }

  // 6. Common platform fallback paths
  if (process.platform === 'win32') {
    const commonWinPaths = [
      'C:\\ffmpeg\\bin\\ffmpeg.exe',
      'C:\\Program Files\\ffmpeg\\bin\\ffmpeg.exe',
      'C:\\ProgramData\\chocolatey\\bin\\ffmpeg.exe',
    ];
    for (const p of commonWinPaths) {
      if (existsSync(p)) return p;
    }
  } else {
    const commonUnixPaths = [
      '/tmp/itnavideo-ffmpeg',
      '/usr/bin/ffmpeg',
      '/usr/local/bin/ffmpeg',
      '/opt/homebrew/bin/ffmpeg',
      '/var/task/node_modules/ffmpeg-static/ffmpeg',
    ];
    for (const p of commonUnixPaths) {
      if (existsSync(p)) return prepareExecutable(p, 'ffmpeg');
    }
  }

  console.warn('[findFfmpegPath] No FFmpeg binary could be found on system or node_modules.');
  return '';
}

export function findFfprobePath(): string {
  const configured = cleanEnvValue(process.env.FFPROBE_PATH);
  if (configured && existsSync(configured)) return prepareExecutable(configured, 'ffprobe');

  const binaryName = process.platform === 'win32' ? 'ffprobe.exe' : 'ffprobe';

  // 1. System PATH
  const system = findSystemBinary(binaryName);
  if (system) return system;

  // 2. ffprobe-static
  try {
    const ffprobeStatic = nodeRequire('ffprobe-static');
    const staticPath = typeof ffprobeStatic?.path === 'string' ? ffprobeStatic.path : ffprobeStatic;
    if (staticPath && existsSync(staticPath)) return prepareExecutable(staticPath, 'ffprobe');
  } catch {}

  // 3. Search in common roots
  const compositorPackages = [
    'compositor-win32-x64-msvc',
    'compositor-linux-x64-gnu',
    'compositor-linux-x64-musl',
    'compositor-linux-arm64-gnu',
    'compositor-darwin-x64',
    'compositor-darwin-arm64',
  ];

  const searchRoots = [
    process.cwd(),
    path.join(process.cwd(), '.next', 'standalone'),
    path.join(process.cwd(), '.next', 'server'),
    '/var/task',
    '/var/task/.next/standalone',
  ];

  for (const root of searchRoots) {
    const candidate = path.join(root, 'node_modules', 'ffprobe-static', binaryName);
    if (existsSync(candidate)) return prepareExecutable(candidate, 'ffprobe');

    for (const pkgName of compositorPackages) {
      const compositorCandidate = path.join(root, 'node_modules', '@remotion', pkgName, binaryName);
      if (existsSync(compositorCandidate)) return prepareExecutable(compositorCandidate, 'ffprobe');
    }
  }

  // 4. Common platform fallback paths
  if (process.platform === 'win32') {
    const commonWinPaths = [
      'C:\\ffmpeg\\bin\\ffprobe.exe',
      'C:\\Program Files\\ffmpeg\\bin\\ffprobe.exe',
      'C:\\ProgramData\\chocolatey\\bin\\ffprobe.exe',
    ];
    for (const p of commonWinPaths) {
      if (existsSync(p)) return p;
    }
  } else {
    const commonUnixPaths = [
      '/tmp/itnavideo-ffprobe',
      '/usr/bin/ffprobe',
      '/usr/local/bin/ffprobe',
      '/opt/homebrew/bin/ffprobe',
    ];
    for (const p of commonUnixPaths) {
      if (existsSync(p)) return prepareExecutable(p, 'ffprobe');
    }
  }

  return 'ffprobe';
}

export async function probeAudioDuration(filePath: string): Promise<number> {
  try {
    const ffprobePath = findFfprobePath();
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

function findSystemBinary(commandName: string): string {
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
