import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const outputDir = path.join(process.cwd(), 'public', 'caption-tests', 'png', 'phase4');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// 10 Upgraded Presets
const upgradedPresets = [
  { id: 'glitch-rgb', motion: true },
  { id: '3d-extrude', motion: false },
  { id: 'news-ticker', motion: true },
  { id: 'karaoke', motion: true },
  { id: 'neon-pulse', motion: true },
  { id: 'typewriter', motion: true },
  { id: 'mrbeast-shorts-impact', motion: false },
  { id: 'hormozi-viral-pop', motion: false },
  { id: 'comic-pop', motion: false },
  { id: 'outline-only', motion: false },
];

console.log(`Rendering Phase 4 upgraded Remotion PNGs for ${upgradedPresets.length} presets...`);

upgradedPresets.forEach(({ id, motion }) => {
  const inputProps = JSON.stringify({
    captions: [
      {
        start: 0,
        end: 3,
        text: 'This is how you GROW your business, fast!',
        words: [
          { word: 'This', start: 0, end: 0.3 },
          { word: 'is', start: 0.3, end: 0.6 },
          { word: 'how', start: 0.6, end: 0.9 },
          { word: 'you', start: 0.9, end: 1.2 },
          { word: 'GROW', start: 1.2, end: 1.8 },
          { word: 'your', start: 1.8, end: 2.1 },
          { word: 'business,', start: 2.1, end: 2.6 },
          { word: 'fast!', start: 2.6, end: 3.0 },
        ],
      },
    ],
    subtitleStyle: id,
  });

  const propsFilePath = path.join(outputDir, `${id}-props.json`);
  fs.writeFileSync(propsFilePath, inputProps, 'utf-8');

  // Main after PNG (frame 45 - active word on GROW)
  const afterPath = path.join(outputDir, `${id}-after.png`);
  console.log(`Rendering Phase 4 AFTER PNG: ${id} -> ${afterPath}`);
  const cmd = `npx remotion still remotion/index.tsx AUTO-CAPTION-GENERATOR "${afterPath}" --frame=45 --props="${propsFilePath.replace(/\\/g, '/')}" --overwrite`;
  execSync(cmd, { stdio: 'inherit' });

  // For animated styles, render 3 frames (f15, f45, f75) to prove motion
  if (motion) {
    [15, 45, 75].forEach((frameNum) => {
      const framePath = path.join(outputDir, `${id}-after-f${frameNum}.png`);
      console.log(`Rendering Phase 4 Motion Frame f${frameNum}: ${id} -> ${framePath}`);
      const motionCmd = `npx remotion still remotion/index.tsx AUTO-CAPTION-GENERATOR "${framePath}" --frame=${frameNum} --props="${propsFilePath.replace(/\\/g, '/')}" --overwrite`;
      execSync(motionCmd, { stdio: 'inherit' });
    });
  }

  if (fs.existsSync(propsFilePath)) {
    fs.unlinkSync(propsFilePath);
  }
});

console.log(`Successfully completed rendering all Phase 4 PNGs to ${outputDir}`);
