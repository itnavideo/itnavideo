import { CAPTION_PRESET_CONFIGS } from '../remotion/captions/registry/captionPresets';

console.log('--- PRESET SIMILARITY GROUPING ANALYSIS ---');

interface PresetGroup {
  key: string;
  font: string;
  highlight: string;
  container: string;
  presets: string[];
}

const groupsMap = new Map<string, string[]>();

Object.values(CAPTION_PRESET_CONFIGS).forEach((c) => {
  const primaryFont = c.fontFamily.split(',')[0].trim();
  const highlight = c.highlightColor.toUpperCase();
  const container = c.showBackground ? (c.backgroundColor ? c.backgroundColor : 'bg-card') : 'no-bg';
  const groupKey = `${primaryFont} | ${highlight} | ${container}`;

  const existing = groupsMap.get(groupKey) || [];
  existing.push(c.id);
  groupsMap.set(groupKey, existing);
});

console.log('\nNear-Identical Preset Groups (Same Font + Same Highlight + Same Container):\n');

let groupIndex = 1;
groupsMap.forEach((ids, groupKey) => {
  if (ids.length > 1) {
    console.log(`Group ${groupIndex++} [${groupKey}]:`);
    console.log(`  - Presets: ${ids.join(', ')}`);
  }
});

console.log('\n--- ALL REGISTERED PRESETS SUMMARY ---');
console.log(`Total Presets: ${Object.keys(CAPTION_PRESET_CONFIGS).length}`);
