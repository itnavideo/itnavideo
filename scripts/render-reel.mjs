import {bundle} from '@remotion/bundler';
import {renderMedia, renderStill, selectComposition} from '@remotion/renderer';
import {mkdir, readFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const entryPoint = path.join(rootDir, 'remotion', 'index.tsx');
const outputDir = path.join(rootDir, 'public', 'renders');
const outputLocation = process.env.REEL_OUTPUT
  ? path.resolve(rootDir, process.env.REEL_OUTPUT)
  : path.join(outputDir, 'sample-reel.mp4');
const planInputPath = process.env.REEL_PLAN
  ? path.resolve(rootDir, process.env.REEL_PLAN)
  : path.join(outputDir, 'reel-plan.json');
const thumbnailOutputLocation = process.env.REEL_THUMBNAIL_OUTPUT
  ? path.resolve(rootDir, process.env.REEL_THUMBNAIL_OUTPUT)
  : '';
const renderVariants = (process.env.REEL_VARIANTS || '')
  .split(',')
  .map((variant) => variant.trim())
  .filter(Boolean);

await mkdir(outputDir, {recursive: true});

const inputProps = await readInputProps();
if (process.env.REEL_MEDIA_SRC) {
  inputProps.mediaSrc = process.env.REEL_MEDIA_SRC;
  inputProps.mediaType = process.env.REEL_MEDIA_TYPE || 'video';
  if (inputProps.mediaType === 'video' && !process.env.REEL_MEDIA_FIT) {
    inputProps.mediaFit = 'videoExplainer';
  }
}
if (process.env.REEL_MEDIA_FIT) {
  inputProps.mediaFit = process.env.REEL_MEDIA_FIT;
}
if (process.env.REEL_DESIGN) {
  inputProps.design = process.env.REEL_DESIGN;
}
if (process.env.REEL_TOPIC_TITLE) {
  inputProps.topicTitle = process.env.REEL_TOPIC_TITLE;
}
if (process.env.REEL_SOURCE_AUDIO_VOLUME) {
  inputProps.sourceAudioVolume = Number(process.env.REEL_SOURCE_AUDIO_VOLUME);
}
if (process.env.REEL_BACKGROUND_MUSIC_VOLUME) {
  inputProps.backgroundMusicVolume = Number(process.env.REEL_BACKGROUND_MUSIC_VOLUME);
}

const serveUrl = await bundle({
  entryPoint,
  webpackOverride: (config) => config,
});

if (renderVariants.length) {
  for (const variant of renderVariants) {
    const variantProps = {...inputProps, design: variant};
    const variantComposition = await selectComposition({
      serveUrl,
      id: variantProps.compositionId || 'VIDEO-EXPLAINER',
      inputProps: variantProps,
    });
    const parsed = path.parse(outputLocation);
    const variantOutput = path.join(parsed.dir, `${parsed.name}-${variant}${parsed.ext}`);
    await renderReel({composition: variantComposition, inputProps: variantProps, outputLocation: variantOutput, serveUrl});
  }
} else {
  const composition = await selectComposition({
    serveUrl,
    id: inputProps.compositionId || 'VIDEO-EXPLAINER',
    inputProps,
  });
  await renderReel({composition, inputProps, outputLocation, serveUrl});

  if (thumbnailOutputLocation) {
    await renderStill({
      composition,
      serveUrl,
      inputProps,
      output: thumbnailOutputLocation,
      frame: Math.min(30, Math.max(0, composition.durationInFrames - 1)),
    });
    process.stdout.write(`Rendered thumbnail ${path.relative(rootDir, thumbnailOutputLocation)}\n`);
  }
}

async function renderReel({composition, inputProps, outputLocation, serveUrl}) {
  await renderMedia({
    composition,
    serveUrl,
    codec: 'h264',
    outputLocation,
    inputProps,
    concurrency: '50%',
    overwrite: true,
    logLevel: 'info',
    onProgress: ({progress}) => {
      process.stdout.write(`\rRendering ${Math.round(progress * 100)}%`);
    },
  });

  process.stdout.write(`\nRendered ${path.relative(rootDir, outputLocation)}\n`);
}

async function readInputProps() {
  try {
    const rawPlan = await readFile(planInputPath, 'utf8');
    const plan = JSON.parse(rawPlan.replace(/^\uFEFF/, ''));
    const renderProps = plan?.plan?.renderProps || plan?.renderProps || plan;
    if (renderProps?.scenes?.length || renderProps?.overlayTimeline?.length) {
      process.stdout.write(`Using planner input ${path.relative(rootDir, planInputPath)}\n`);
      return {
        ...renderProps,
        brand: renderProps.brand || 'itnavideo',
        templateName: renderProps.templateName || 'VIDEO_SIMPLE_EXPLAINER',
      };
    }
  } catch {
    // No local plan file yet; keep the sample render path simple.
  }

  throw new Error(
    `No render plan found at ${path.relative(rootDir, planInputPath)}. Set REEL_PLAN to a real plan JSON before rendering.`,
  );
}
