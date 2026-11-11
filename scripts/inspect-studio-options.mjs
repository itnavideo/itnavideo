import fs from 'fs';

const files = [
  'components/dashboard/autocaption/AutoCaptionDualTabStudio.tsx',
  'components/dashboard/AiVideoGeneratorStudio.tsx',
  'components/dashboard/AiVideoPolisherStudio.tsx',
  'components/dashboard/AiShortsPolisherStudio.tsx',
  'components/dashboard/FacelessVideoStudio.tsx',
  'components/dashboard/FacelessShortsStudio.tsx',
  'components/dashboard/BookSummaryStudio.tsx',
  'components/dashboard/ImageToVideoStudio.tsx',
  'components/dashboard/YoutubeSubtitlesStudio.tsx',
  'components/dashboard/WhiteboardStudio.tsx',
  'components/dashboard/CompareExplainerStudio.tsx',
  'components/dashboard/LongVideoClipsStudio.tsx',
  'components/dashboard/LongVideoPromoStudio.tsx',
  'components/dashboard/SplitScreenExplainerStudio.tsx',
  'components/dashboard/AudioCleanStudio.tsx',
];

files.forEach(f => {
  if (!fs.existsSync(f)) {
    console.log(`MISSING: ${f}`);
    return;
  }
  const content = fs.readFileSync(f, 'utf8');
  console.log(`=== ${f} ===`);
  // Look for exported arrays of options, presets, or styles
  const matches = content.match(/export const [A-Z0-9_]+ = \[[\s\S]*?\];/g) || [];
  matches.forEach(m => {
    const name = m.split(' = ')[0].replace('export const ', '');
    const count = (m.match(/\{/g) || []).length;
    console.log(`  Constant array: ${name} (${count} items)`);
  });
  // Check for common label patterns
  const labels = [];
  const labelMatches = content.matchAll(/label:\s*["'`]([^"'`]+)["'`]/g);
  for (const lm of labelMatches) {
    if (labels.length < 5) labels.push(lm[1]);
  }
  if (labels.length > 0) {
    console.log(`  Sample labels: ${labels.join(' | ')}`);
  }
});
