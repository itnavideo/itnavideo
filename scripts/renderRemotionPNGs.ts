import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { CAPTION_PRESET_CONFIGS } from '../remotion/captions/registry/captionPresets';

const outputDir = path.join(process.cwd(), 'public', 'caption-tests', 'png');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Filter KEEP presets only (not deprecated)
const keepPresets = Object.entries(CAPTION_PRESET_CONFIGS).filter(
  ([_, config]) => !config.deprecated
);

console.log(`Rendering REAL Remotion 9:16 PNG stills for ${keepPresets.length} KEEP presets...`);

keepPresets.forEach(([presetId, config]) => {
  const outputPath = path.join(outputDir, `${presetId}.png`);
  console.log(`Rendering PNG for preset: ${presetId} -> ${outputPath}`);
  
  // Props payload passed to Remotion renderStill via props JSON
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
    subtitleStyle: presetId,
  });

  try {
    const propsFilePath = path.join(outputDir, `${presetId}-props.json`);
    fs.writeFileSync(propsFilePath, inputProps, 'utf-8');

    const cmd = `npx remotion still remotion/index.tsx AUTO-CAPTION-GENERATOR "${outputPath}" --frame=45 --props="${propsFilePath.replace(/\\/g, '/')}" --overwrite`;
    execSync(cmd, { stdio: 'inherit' });

    if (fs.existsSync(propsFilePath)) {
      fs.unlinkSync(propsFilePath);
    }
  } catch (err) {
    console.error(`Error rendering ${presetId}:`, err);
  }
});

console.log(`Successfully completed rendering ${keepPresets.length} PNGs to ${outputDir}`);
