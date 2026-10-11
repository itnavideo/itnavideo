import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { execSync } from 'child_process';
import { CAPTION_PRESET_CONFIGS } from '../remotion/captions/registry/captionPresets';

const videoOutputDir = path.join(process.cwd(), 'public', 'caption-tests', 'video');
const pngOutputDir = path.join(process.cwd(), 'public', 'caption-tests', 'png');

if (!fs.existsSync(videoOutputDir)) fs.mkdirSync(videoOutputDir, { recursive: true });
if (!fs.existsSync(pngOutputDir)) fs.mkdirSync(pngOutputDir, { recursive: true });

const presetIds = Object.keys(CAPTION_PRESET_CONFIGS);

console.log(`Starting Master Re-Render Pass for ${presetIds.length} KEEP presets...`);
console.log(`Presets to render: ${presetIds.join(', ')}\n`);

const sampleCaptions = [
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
];

const renderedResults: Array<{ id: string; mp4Path: string; pngPath: string; sha256: string }> = [];

presetIds.forEach((presetId, index) => {
  console.log(`\n[${index + 1}/${presetIds.length}] Processing preset: "${presetId}"`);

  const inputProps = JSON.stringify({
    durationSeconds: 5,
    captionStyle: presetId,
    subtitleStyle: presetId,
    captions: sampleCaptions,
  });

  const propsFilePath = path.join(videoOutputDir, `${presetId}-props.json`).replace(/\\/g, '/');
  fs.writeFileSync(propsFilePath, inputProps, 'utf-8');

  const mp4Path = path.join(videoOutputDir, `${presetId}.mp4`);
  const pngPath = path.join(pngOutputDir, `${presetId}.png`);

  console.log(`  -> Rendering MP4 (150 frames @ 30 FPS)...`);
  const mp4Cmd = `npx remotion render remotion/index.tsx AUTO-CAPTION-GENERATOR "${mp4Path.replace(/\\/g, '/')}" --frames=0-149 --props="${propsFilePath}" --overwrite`;
  try {
    execSync(mp4Cmd, { stdio: 'pipe' });
  } catch (err: any) {
    console.error(`  ❌ Error rendering MP4 for ${presetId}:`, err.message);
  }

  console.log(`  -> Rendering PNG Still (frame 45)...`);
  const pngCmd = `npx remotion still remotion/index.tsx AUTO-CAPTION-GENERATOR "${pngPath.replace(/\\/g, '/')}" --frame=45 --props="${propsFilePath}" --overwrite`;
  try {
    execSync(pngCmd, { stdio: 'pipe' });
  } catch (err: any) {
    console.error(`  ❌ Error rendering PNG for ${presetId}:`, err.message);
  }

  // Cleanup props JSON file
  if (fs.existsSync(propsFilePath)) fs.unlinkSync(propsFilePath);

  // Compute SHA256 of MP4
  let sha256 = 'FILE_NOT_FOUND';
  if (fs.existsSync(mp4Path)) {
    const fileBuffer = fs.readFileSync(mp4Path);
    sha256 = crypto.createHash('sha256').update(fileBuffer).digest('hex');
  }

  renderedResults.push({
    id: presetId,
    mp4Path,
    pngPath,
    sha256,
  });

  console.log(`  ✅ Preset "${presetId}" done | SHA256: ${sha256.slice(0, 16)}...`);
});

console.log('\n==================================================');
console.log('MASTER RE-RENDER SUMMARY & SHA256 HASHES');
console.log('==================================================');

const hashMap = new Map<string, string[]>();

renderedResults.forEach((res) => {
  console.log(`${res.id.padEnd(25)} | SHA256: ${res.sha256}`);
  if (res.sha256 !== 'FILE_NOT_FOUND') {
    const existing = hashMap.get(res.sha256) || [];
    existing.push(res.id);
    hashMap.set(res.sha256, existing);
  }
});

console.log('\n==================================================');
console.log('DUPLICATE HASH BUG CHECK');
console.log('==================================================');

let hasDuplicates = false;
hashMap.forEach((ids, hash) => {
  if (ids.length > 1) {
    hasDuplicates = true;
    console.error(`🚨 BUG DETECTED! SHA256 ${hash} matched across multiple presets: ${ids.join(', ')}`);
  }
});

if (!hasDuplicates) {
  console.log('🎉 SUCCESS: All rendered MP4 files have unique SHA256 hashes! Zero duplicate renders.');
}
