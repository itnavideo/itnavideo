import {readFile, writeFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath, pathToFileURL} from 'node:url';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const transcriptPath = process.env.TRANSCRIPT_JSON
  ? path.resolve(rootDir, process.env.TRANSCRIPT_JSON)
  : path.join(rootDir, 'public', 'renders', 'transcripts', 'demo-audio.transcript.json');
const outputPath = process.env.REEL_PLAN_OUTPUT
  ? path.resolve(rootDir, process.env.REEL_PLAN_OUTPUT)
  : path.join(rootDir, 'public', 'renders', 'plans', 'local-planner-output.json');
const template = process.env.REEL_TEMPLATE || 'HANDWRITTEN_NOTES';
const topicTitle = process.env.REEL_TOPIC_TITLE || '';

await loadEnvFile(path.join(rootDir, '.env.local'));
const transcript = JSON.parse(await readFile(transcriptPath, 'utf8'));
const {createReelPlan} = await import(pathToFileURL(path.join(rootDir, 'services', 'ai', 'reelPlanner.ts')).href);

const plan = await createReelPlan({
  transcript: String(transcript.text || '').trim(),
  words: normalizeWords(transcript.words),
  timestampSegments: normalizeSegments(transcript.segments),
  topicTitle,
  topic: topicTitle,
  durationSeconds: Number(transcript.duration) || undefined,
  mediaType: 'audio',
  languageHint: 'english',
  template,
  visualMode: template === 'HANDWRITTEN_NOTES' ? 'notes' : 'videoExplainer',
  dryRun: process.env.REEL_DRY_RUN === '1',
  constraints: ['Local planner test must use transcript-derived text only.'],
});

await writeFile(outputPath, `${JSON.stringify(plan, null, 2)}\n`);
process.stdout.write(`Created ${path.relative(rootDir, outputPath)}\n`);
process.stdout.write(`Template: ${plan.templateName}\n`);
process.stdout.write(`Overlays: ${plan.renderProps.overlayTimeline.length}\n`);
process.stdout.write(`Transcript: ${plan.diagnostics?.steps?.[0]?.detail || 'complete'}\n`);

function normalizeSegments(value) {
  return Array.isArray(value)
    ? value
        .map((segment) => ({
          start: Number(segment.start) || 0,
          end: Number(segment.end) || 0,
          text: String(segment.text || '').trim(),
        }))
        .filter((segment) => segment.end > segment.start && segment.text)
    : undefined;
}

function normalizeWords(value) {
  return Array.isArray(value)
    ? value
        .map((word) => ({
          word: String(word.word || '').trim(),
          start: Number(word.start) || 0,
          end: Number(word.end) || 0,
        }))
        .filter((word) => word.end > word.start && word.word)
    : undefined;
}

async function loadEnvFile(envPath) {
  try {
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
  } catch {
    // env file is optional for dry-run tests.
  }
}
