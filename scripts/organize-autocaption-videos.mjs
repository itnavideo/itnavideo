import fs from 'fs';
import path from 'path';

const sourceDir = path.resolve('public/assets/reusable');
const targetDir = path.resolve('public/assets/reusable/autocaptionvideos');

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// Slugs corresponding to style preset names
const styleSlugs = [
  'creator-3',
  'crazy',
  'crazy-2',
  'spark',
  'gamer',
  'cursive',
  'discipline',
  'kinetic',
  'impact',
  'red-wipe',
  'punch',
  'cook',
  'master',
  'solo',
  'estate',
  'story',
  'hormozi-viral-pop',
  'mrbeast-shorts-impact',
  'submagic-glow',
  'ali-abdaal-clean-pill',
  'devane-luxury-serif',
  'cyber-lime-pill',
  'opus-inverted-box',
  'shorts-karaoke',
  'vox-documentary',
  'diary-of-a-ceo',
  'huberman-lab-lecture',
  'mrbeast-16-9-punch',
  'mkbhd-tech-studio',
  'kurzgesagt-explainer',
  'lex-fridman-minimalist',
  'bbc-netflix-closed-captions',
  'm3-tonal-pill',
  'm3-dynamic-chip',
  'm3-elevated-card'
];

const files = fs.readdirSync(sourceDir)
  .filter(file => file.endsWith('.mp4'))
  .sort();

console.log(`Found ${files.length} MP4 files in public/assets/reusable.`);

files.forEach((file, index) => {
  if (index < styleSlugs.length) {
    const slug = styleSlugs[index];
    const oldPath = path.join(sourceDir, file);
    const newFileName = `${slug}.mp4`;
    const newPath = path.join(targetDir, newFileName);

    fs.renameSync(oldPath, newPath);
    console.log(`✅ Moved & Renamed [${index + 1}/${files.length}]: ${file} -> autocaptionvideos/${newFileName}`);
  }
});

console.log(`\n🎉 All ${files.length} videos organized into public/assets/reusable/autocaptionvideos/ successfully!`);
