import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const outputDir = path.join(process.cwd(), 'public', 'caption-tests', 'video');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// 7 target presets for MP4 video rendering
const targetPresets = [
  'glitch-rgb',
  'karaoke',
  'neon-pulse',
  'typewriter',
  'mrbeast-shorts-impact',
  'hormozi-viral-pop',
  'comic-pop',
];

console.log(`Rendering 5-second 9:16 MP4 videos for ${targetPresets.length} presets...`);

targetPresets.forEach((presetId) => {
  const outputPath = path.join(outputDir, `${presetId}.mp4`);
  console.log(`Rendering 5s MP4 video: ${presetId} -> ${outputPath}`);

  const inputProps = JSON.stringify({
    durationSeconds: 5,
    captionStyle: presetId,
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
    subtitleStyle: presetId,
  });

  const propsFilePath = path.join(outputDir, `${presetId}-props.json`);
  fs.writeFileSync(propsFilePath, inputProps, 'utf-8');

  try {
    const cmd = `npx remotion render remotion/index.tsx AUTO-CAPTION-GENERATOR "${outputPath}" --props="${propsFilePath.replace(/\\/g, '/')}" --overwrite`;
    execSync(cmd, { stdio: 'inherit' });
  } catch (err) {
    console.error(`Error rendering MP4 for ${presetId}:`, err);
  }

  if (fs.existsSync(propsFilePath)) {
    fs.unlinkSync(propsFilePath);
  }
});

console.log(`Successfully completed rendering 7 MP4 videos to ${outputDir}`);
