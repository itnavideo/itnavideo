// scripts/patch-planner.mjs
import fs from 'node:fs';

const filePath = 'services/ai/aiScenePlanner.ts';
let code = fs.readFileSync(filePath, 'utf8');

const regex = /\/\/\s*2\.\s*Enforce Anti-Repetition[\s\S]*?if\s*\(current\.layoutType === 'split_screen'\)\s*\{\s*current\.layoutType = 'full_bleed_visual';\s*\}\s*\}/;

const replacement = `// 2. Enforce Anti-Repetition (Rotate across diverse documentary layouts: Full Bleed, Split Screen, Card Concept)
  const DIVERSE_LAYOUT_CYCLE: VisualLayoutType[] = ['full_bleed_visual', 'split_screen', 'card_concept', 'full_bleed_visual', 'split_screen'];
  for (let i = 0; i < processedScenes.length; i++) {
    const current = processedScenes[i];
    const prev = i > 0 ? processedScenes[i - 1] : null;

    if (prev && current.layoutType === prev.layoutType) {
      const nextLayout = DIVERSE_LAYOUT_CYCLE[(i + 1) % DIVERSE_LAYOUT_CYCLE.length];
      current.layoutType = nextLayout !== prev.layoutType ? nextLayout : 'full_bleed_visual';
    }`;

if (regex.test(code)) {
  code = code.replace(regex, replacement);
  fs.writeFileSync(filePath, code, 'utf8');
  console.log('✅ Updated aiScenePlanner.ts anti-repetition cycle successfully!');
} else {
  console.error('❌ Regex match failed.');
}
