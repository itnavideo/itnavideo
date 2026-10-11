import fs from 'fs';
import path from 'path';
import { CAPTION_PRESET_CONFIGS } from '../remotion/captions/registry/captionPresets';

const outputDir = path.join(process.cwd(), 'public', 'caption-tests');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const sampleWords = [
  { word: 'This', active: false },
  { word: 'is', active: false },
  { word: 'how', active: false },
  { word: 'you', active: false },
  { word: 'GROW', active: true },
  { word: 'your', active: false },
  { word: 'business,', active: false },
  { word: 'fast!', active: false },
];

console.log(`Generating visual test HTML snapshots for ${Object.keys(CAPTION_PRESET_CONFIGS).length} presets...`);

Object.entries(CAPTION_PRESET_CONFIGS).forEach(([presetId, config]) => {
  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=900, height=1600, initial-scale=1.0" />
  <title>Caption Test - ${config.name}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&family=Montserrat:wght@700;800;900&family=Poppins:wght@700;800;900&family=Plus+Jakarta+Sans:wght@700;800&family=Space+Grotesk:wght@700&family=Orbitron:wght@800;900&display=swap');
    body {
      margin: 0;
      padding: 0;
      width: 1080px;
      height: 1920px;
      background: #090D16;
      background-image: radial-gradient(circle at 50% 50%, #1E293B 0%, #090D16 100%);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-family: ${config.fontFamily};
      box-sizing: border-box;
      overflow: hidden;
    }
    .badge-card {
      display: inline-flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: center;
      gap: 12px 18px;
      max-width: 920px;
      background-color: ${config.showBackground ? (config.backgroundColor || 'rgba(0,0,0,0.65)') : 'transparent'};
      border-radius: ${config.borderRadius ? `${config.borderRadius}px` : '16px'};
      padding: ${config.showBackground ? (config.padding || '16px 32px') : '0'};
      border: ${config.border || 'none'};
      box-shadow: ${config.showBackground ? '0 10px 30px rgba(0,0,0,0.5)' : 'none'};
      text-align: center;
    }
    .word {
      display: inline-block;
      font-size: ${config.fontSizePx * 1.1}px;
      font-weight: ${config.fontWeight};
      color: ${config.textColor};
      text-transform: ${config.textTransform || 'none'};
      -webkit-text-stroke: ${config.textStroke || 'none'};
      paint-order: stroke fill;
      text-shadow: ${config.textShadow || '0 2px 10px rgba(0,0,0,0.8)'};
      transition: all 0.1s ease;
    }
    .word.active {
      color: ${config.highlightColor};
      font-weight: 900;
      transform: scale(${config.activeScaleMultiplier || 1.15});
      text-shadow: 0 0 20px ${config.highlightColor}88, 0 4px 14px rgba(0,0,0,0.9);
    }
    .info-footer {
      position: absolute;
      bottom: 60px;
      color: #94A3B8;
      font-family: 'Inter', sans-serif;
      font-size: 24px;
      font-weight: 600;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="badge-card">
    ${sampleWords
      .map(
        (w) =>
          `<span class="word ${w.active ? 'active' : ''}">${w.word}</span>`
      )
      .join('\n    ')}
  </div>
  <div class="info-footer">
    Preset: <strong>${config.id}</strong> (${config.name}) | Font: ${config.fontFamily}
  </div>
</body>
</html>`;

  const fileName = `${presetId}.html`;
  fs.writeFileSync(path.join(outputDir, fileName), htmlContent, 'utf-8');
});

console.log(`Saved HTML snapshots to ${outputDir}`);
