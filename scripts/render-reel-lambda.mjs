import {getRenderProgress, renderMediaOnLambda} from '@remotion/lambda/client';
import {readFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {loadEnvLocal} from './load-env-local.mjs';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
loadEnvLocal(rootDir);
const outputDir = path.join(rootDir, 'public', 'renders');
const planInputPath = process.env.REEL_PLAN
  ? path.resolve(rootDir, process.env.REEL_PLAN)
  : path.join(outputDir, 'reel-plan.json');

const region = process.env.REMOTION_AWS_REGION || process.env.AWS_REGION || 'ap-south-1';
const functionName = required('REMOTION_LAMBDA_FUNCTION_NAME');
const serveUrl = required('REMOTION_LAMBDA_SERVE_URL');
const compositionId = process.env.REMOTION_LAMBDA_COMPOSITION_ID || 'VIDEO-EXPLAINER';
const privacy = process.env.REMOTION_LAMBDA_PRIVACY || 'private';
const deleteAfter = process.env.REMOTION_LAMBDA_DELETE_AFTER || '3-days';
const concurrency = readNumber('REMOTION_LAMBDA_CONCURRENCY', 6);
const useFramesPerLambda = process.env.REMOTION_LAMBDA_USE_FRAMES_PER_LAMBDA !== 'false';
const framesPerLambda = useFramesPerLambda
  ? readNumber('REMOTION_LAMBDA_FRAMES_PER_LAMBDA', 300)
  : null;

const inputProps = await readInputProps();
applyEnvOverrides(inputProps);
validateLambdaMedia(inputProps);

const outName = process.env.REEL_LAMBDA_OUT_NAME || `renders/final/${Date.now()}-${safeName(inputProps.topicTitle || 'itnavideo-reel')}.mp4`;

process.stdout.write(`Starting cloud render in ${region}...\n`);
const render = await renderMediaOnLambda({
  region,
  functionName,
  serveUrl,
  composition: compositionId,
  inputProps,
  codec: 'h264',
  audioCodec: 'aac',
  privacy,
  deleteAfter,
  outName,
  overwrite: true,
  concurrency: framesPerLambda ? undefined : concurrency,
  framesPerLambda: framesPerLambda || undefined,
  logLevel: 'info',
  maxRetries: 1,
  downloadBehavior: {type: 'download', fileName: path.basename(outName)},
  isProduction: true,
});

process.stdout.write(`Render id: ${render.renderId}\n`);
process.stdout.write(`Bucket: ${render.bucketName}\n`);
process.stdout.write(`S3 key: ${outName}\n`);

await pollProgress({region, functionName, bucketName: render.bucketName, renderId: render.renderId});

async function pollProgress({region, functionName, bucketName, renderId}) {
  while (true) {
    const progress = await getRenderProgress({
      region,
      functionName,
      bucketName,
      renderId,
      logLevel: 'info',
    });

    if (progress.errors?.length) {
      const message = progress.errors.map((error) => error.message || JSON.stringify(error)).join('\n');
      throw new Error(message);
    }

    const percent = Math.round((progress.overallProgress || 0) * 100);
    process.stdout.write(`\rCloud render ${percent}% | workers ${progress.lambdasInvoked || 0}`);

    if (progress.done) {
      process.stdout.write('\nCloud render complete.\n');
      if (progress.outputFile) process.stdout.write(`Output: ${progress.outputFile}\n`);
      if (progress.costs?.estimatedDisplayCost) process.stdout.write(`Estimated render cost: ${progress.costs.estimatedDisplayCost}\n`);
      return;
    }

    await wait(3000);
  }
}

async function readInputProps() {
  try {
    const rawPlan = await readFile(planInputPath, 'utf8');
    const plan = JSON.parse(rawPlan.replace(/^\uFEFF/, ''));
    const renderProps = plan?.plan?.renderProps || plan?.renderProps || plan;
    if (renderProps?.overlayTimeline?.length) {
      process.stdout.write(`Using planner input ${path.relative(rootDir, planInputPath)}\n`);
      return {
        ...renderProps,
        brand: renderProps.brand || 'itnavideo',
        templateName: 'VIDEO_EXPLAINER',
        design: renderProps.design || 'imageCollage',
      };
    }
  } catch {
    // Fall through to the explicit error below.
  }

  throw new Error(
    `No Video Explainer render plan found at ${path.relative(rootDir, planInputPath)}. Set REEL_PLAN to a JSON file with renderProps.overlayTimeline.`,
  );
}

function applyEnvOverrides(inputProps) {
  if (process.env.REEL_MEDIA_SRC) {
    inputProps.mediaSrc = process.env.REEL_MEDIA_SRC;
    inputProps.mediaType = process.env.REEL_MEDIA_TYPE || 'video';
    if (inputProps.mediaType === 'video' && !process.env.REEL_MEDIA_FIT) {
      inputProps.mediaFit = 'videoExplainer';
    }
  }
  if (process.env.REEL_MEDIA_FIT) inputProps.mediaFit = process.env.REEL_MEDIA_FIT;
  if (process.env.REEL_DESIGN) inputProps.design = process.env.REEL_DESIGN;
  if (!inputProps.design) inputProps.design = 'imageCollage';
  if (process.env.REEL_TOPIC_TITLE) inputProps.topicTitle = process.env.REEL_TOPIC_TITLE;
}

function validateLambdaMedia(inputProps) {
  if (!inputProps.mediaSrc) return;
  if (String(inputProps.mediaSrc).startsWith('/')) {
    throw new Error(
      'Cloud renders cannot use local /public media paths. Upload the input to temporary secure storage and pass an HTTPS or signed URL in REEL_MEDIA_SRC.',
    );
  }
}

function required(key) {
  const value = process.env[key];
  if (!value) throw new Error(`Missing ${key}. Run npm run reel:lambda:deploy and put the printed value in .env.local.`);
  return value;
}

function readNumber(key, fallback) {
  const value = Number(process.env[key]);
  return Number.isFinite(value) && value > 0 ? value : fallback;
}

function safeName(value) {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 64) || 'itnavideo-reel';
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
