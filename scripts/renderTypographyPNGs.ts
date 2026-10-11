import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { execSync } from 'child_process';
import { TYPOGRAPHY_STYLES } from '../lib/typography/typographyStylesData';

const outputDir = path.join(process.cwd(), 'public', 'caption-tests', 'typography');
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

console.log(`Rendering frame 45 PNG stills for all ${TYPOGRAPHY_STYLES.length} Kinetic Typography styles...\n`);

const results: Array<{ id: string; name: string; pngPath: string; sha256: string }> = [];

TYPOGRAPHY_STYLES.forEach((style, index) => {
  const presetId = style.id;
  const pngPath = path.join(outputDir, `${presetId}.png`);
  const propsFilePath = path.join(outputDir, `${presetId}-props.json`).replace(/\\/g, '/');

  const inputProps = JSON.stringify({
    durationSeconds: 5,
    captionStyle: presetId,
    subtitleStyle: presetId,
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
  });

  fs.writeFileSync(propsFilePath, inputProps, 'utf-8');

  const cmd = `npx remotion still remotion/index.tsx AUTO-CAPTION-GENERATOR "${pngPath.replace(/\\/g, '/')}" --frame=45 --props="${propsFilePath}" --overwrite`;

  try {
    execSync(cmd, { stdio: 'pipe' });
  } catch (err: any) {
    console.error(`  ❌ Error rendering PNG for ${presetId}:`, err.message);
  }

  if (fs.existsSync(propsFilePath)) fs.unlinkSync(propsFilePath);

  let sha256 = 'FILE_NOT_FOUND';
  if (fs.existsSync(pngPath)) {
    const fileBuffer = fs.readFileSync(pngPath);
    sha256 = crypto.createHash('sha256').update(fileBuffer).digest('hex');
  }

  results.push({ id: presetId, name: style.name, pngPath, sha256 });
  console.log(`[${index + 1}/${TYPOGRAPHY_STYLES.length}] ${presetId.padEnd(30)} | SHA256: ${sha256.slice(0, 16)}...`);
});

console.log('\n==================================================');
console.log('KINETIC TYPOGRAPHY PNG STILLS SHA256 REPORT');
console.log('==================================================');

results.forEach((r) => {
  console.log(`${r.id.padEnd(32)} | ${r.sha256}`);
});
