import fs from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';

process.env.NODE_ENV = process.env.NODE_ENV || 'test';
process.env.RENDER_WORKSPACE_DIR = path.resolve('.sandbox/smoke/render-workspace');
process.env.DISABLE_RENDER_TELEMETRY = '1';
process.env.RENDER_TELEMETRY_WEBHOOK_URL = '';

const { renderVideoWithFFmpeg } = await import('../render-worker/ffmpegRenderer.mjs');
const { getVideoPipelineConfig } = await import('../render-worker/videoPipelineConfig.mjs');
const config = getVideoPipelineConfig();
const outputDir = path.resolve('.sandbox/smoke/final_output');
fs.mkdirSync(outputDir, { recursive: true });

const smokeCases = [
  {
    label: 'positional contract',
    outputPath: path.join(outputDir, 'video_pipeline_smoke_positional.mp4'),
    run: (data, outputPath) => renderVideoWithFFmpeg(data, outputPath),
  },
  {
    label: 'object contract',
    outputPath: path.join(outputDir, 'video_pipeline_smoke_object.mp4'),
    run: (data, outputPath) => renderVideoWithFFmpeg({ ...data, outputPath }),
  },
  {
    label: 'safe fallback contract',
    outputPath: path.join(outputDir, 'video_pipeline_smoke_fallback.mp4'),
    run: (data, outputPath) => renderVideoWithFFmpeg(data, outputPath, { forceSafeFallback: true }),
  },
  {
    label: 'low-memory contract',
    outputPath: path.join(outputDir, 'video_pipeline_smoke_low_memory.mp4'),
    run: (data, outputPath) => renderVideoWithFFmpeg(data, outputPath, { lowMemoryRender: true }),
  },
];

for (const smokeCase of smokeCases) {
  const data = buildSmokeRenderData(smokeCase.label);
  await smokeCase.run(data, smokeCase.outputPath);
  const stream = probeVideo(smokeCase.outputPath);

  if (Number(stream?.width) !== config.targetWidth || Number(stream?.height) !== config.targetHeight) {
    throw new Error(`${smokeCase.label} dimension mismatch. Expected ${config.targetWidth}x${config.targetHeight}, got ${stream?.width}x${stream?.height}.`);
  }

  console.log(`Video pipeline smoke OK: ${smokeCase.label} ${smokeCase.outputPath} ${stream.width}x${stream.height}`);
}

function buildSmokeRenderData(label) {
  return {
    timeline: {
      scenes: [{
        id: `smoke_${label.replace(/\W+/g, '_')}`,
        start: 0,
        end: 3,
        role: 'Smoke test',
        source: { type: 'text_card', url: null, query: label },
        textCard: {
          headline: 'Pipeline smoke test',
          body: `${label} verifies renderer contract, fallback safety, and export dimensions.`,
        },
      }],
      captions: [{ start: 0, end: 2.5, text: 'supercalifragilisticexpialidocious pipeline smoke test' }],
      metadata: { duration: 3, quality: config.qualityPreset },
    },
    voiceoverUrl: buildSilentWavDataUrl(3),
  };
}

function probeVideo(outputPath) {
  const ffprobePath = path.resolve('node_modules/ffprobe-static/bin/win32/x64/ffprobe.exe');
  const ffprobeCommand = fs.existsSync(ffprobePath) ? ffprobePath : 'ffprobe';
  const probe = spawnSync(ffprobeCommand, [
    '-v',
    'error',
    '-select_streams',
    'v:0',
    '-show_entries',
    'stream=width,height',
    '-of',
    'json',
    outputPath,
  ], { encoding: 'utf8' });

  if (probe.status !== 0) {
    throw new Error(probe.stderr || `ffprobe failed for ${outputPath}.`);
  }

  return JSON.parse(probe.stdout || '{}').streams?.[0];
}

function buildSilentWavDataUrl(durationSeconds) {
  const rate = 16000;
  const samples = rate * durationSeconds;
  const header = Buffer.alloc(44);
  header.write('RIFF', 0);
  header.writeUInt32LE(36 + samples * 2, 4);
  header.write('WAVEfmt ', 8);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20);
  header.writeUInt16LE(1, 22);
  header.writeUInt32LE(rate, 24);
  header.writeUInt32LE(rate * 2, 28);
  header.writeUInt16LE(2, 32);
  header.writeUInt16LE(16, 34);
  header.write('data', 36);
  header.writeUInt32LE(samples * 2, 40);
  return `data:audio/wav;base64,${Buffer.concat([header, Buffer.alloc(samples * 2)]).toString('base64')}`;
}
