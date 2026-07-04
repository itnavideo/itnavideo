import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import {mkdir} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const entryPoint = path.join(rootDir, 'remotion', 'index.tsx');
const outputDir = path.join(rootDir, 'public', 'renders');

await mkdir(outputDir, {recursive: true});

const serveUrl = await bundle({
  entryPoint,
  webpackOverride: (config) => config,
});

const variants = [
  {
    name: '16x9',
    mediaSrc: '/renders/long-promo-test-16x9.mp4',
    mediaAspect: '16:9',
    title: 'Complete Guide to YouTube Growth in 2026',
  },
  {
    name: '9x16',
    mediaSrc: '/renders/long-promo-test-9x16.mp4',
    mediaAspect: '9:16',
    title: 'New Reel Clip from the Full Episode',
  },
  {
    name: '4x5',
    mediaSrc: '/renders/long-promo-test-4x5.mp4',
    mediaAspect: '4:5',
    title: 'Course Lesson Preview for Creators',
  },
  {
    name: 'square',
    mediaSrc: '/renders/long-promo-test-square.mp4',
    mediaAspect: 'square',
    title: 'Podcast Highlight Worth Watching',
  },
];

for (const variant of variants) {
  const inputProps = {
    compositionId: 'LONG-VIDEO-PROMO',
    thumbnailSrc: '/preview/Long Video Promo.png',
    mediaSrc: variant.mediaSrc,
    mediaAspect: variant.mediaAspect,
    title: variant.title,
    videoDuration: '04:00',
    durationSeconds: 8,
    sourceDurationSeconds: 8,
    sourceAudioVolume: 0,
    accentColor: '#93C5FD',
  };

  const composition = await selectComposition({
    serveUrl,
    id: 'LONG-VIDEO-PROMO',
    inputProps,
  });

  const output = path.join(outputDir, `long-promo-${variant.name}-after.png`);
  await renderStill({
    composition,
    serveUrl,
    inputProps,
    output,
    frame: 45,
  });
  process.stdout.write(`Rendered ${path.relative(rootDir, output)}\n`);
}
