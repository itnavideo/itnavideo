import fs from 'fs';

// 2. Patch services/ai/premiumStylePlanner.ts
let planner = fs.readFileSync('services/ai/premiumStylePlanner.ts', 'utf8');
const isCrlf = planner.includes('\r\n');
const nl = isCrlf ? '\r\n' : '\n';

planner = planner.replace(
  /const SFX_PATHS: Record<PremiumSoundCueType, string> = \{[\s\S]*?\};/m,
  `const S3_SFX_BASE = 'https://remotionlambda-useast1-2zq6twaok1.s3.us-east-1.amazonaws.com/assets/reusable/sound-effects';${nl}${nl}const SFX_PATHS: Record<PremiumSoundCueType, string> = {${nl}  'soft-click': \`\${S3_SFX_BASE}/soft-click.wav\`,${nl}  'soft-pop': \`\${S3_SFX_BASE}/pop-soft.wav\`,${nl}  whoosh: \`\${S3_SFX_BASE}/whoosh-short.wav\`,${nl}  swipe: \`\${S3_SFX_BASE}/swipe-right.wav\`,${nl}  ding: \`\${S3_SFX_BASE}/success-chime.wav\`,${nl}  cash: \`\${S3_SFX_BASE}/cash-register.wav\`,${nl}  typing: \`\${S3_SFX_BASE}/typing-fast.wav\`,${nl}  paper: \`\${S3_SFX_BASE}/page-flip.wav\`,${nl}  warning: \`\${S3_SFX_BASE}/warning-beep.wav\`,${nl}  rise: \`\${S3_SFX_BASE}/transition-sweep.wav\`,${nl}};`
);
fs.writeFileSync('services/ai/premiumStylePlanner.ts', planner);
console.log('Patched services/ai/premiumStylePlanner.ts');

// 3. Patch remotion/components/PremiumAudioLayer.tsx
let audioLayer = fs.readFileSync('remotion/components/PremiumAudioLayer.tsx', 'utf8');
const layerIsCrlf = audioLayer.includes('\r\n');
const lnl = layerIsCrlf ? '\r\n' : '\n';

audioLayer = audioLayer.replace(
  /const SFX_PATHS: Record<PremiumSoundCueType, string> = \{[\s\S]*?\};/m,
  `const S3_SFX_BASE = 'https://remotionlambda-useast1-2zq6twaok1.s3.us-east-1.amazonaws.com/assets/reusable/sound-effects';${lnl}${lnl}const SFX_PATHS: Record<PremiumSoundCueType, string> = {${lnl}  'soft-click': \`\${S3_SFX_BASE}/soft-click.wav\`,${lnl}  'soft-pop': \`\${S3_SFX_BASE}/pop-soft.wav\`,${lnl}  'pop-medium': \`\${S3_SFX_BASE}/pop-medium.wav\`,${lnl}  'pop-strong': \`\${S3_SFX_BASE}/pop-strong.wav\`,${lnl}  whoosh: \`\${S3_SFX_BASE}/whoosh-short.wav\`,${lnl}  'air-rush': \`\${S3_SFX_BASE}/air-rush.wav\`,${lnl}  swipe: \`\${S3_SFX_BASE}/swipe-right.wav\`,${lnl}  ding: \`\${S3_SFX_BASE}/success-chime.wav\`,${lnl}  cash: \`\${S3_SFX_BASE}/cash-register.wav\`,${lnl}  'coin-drop': \`\${S3_SFX_BASE}/coin-drop.wav\`,${lnl}  typing: \`\${S3_SFX_BASE}/typing-fast.wav\`,${lnl}  paper: \`\${S3_SFX_BASE}/page-flip.wav\`,${lnl}  'page-flip': \`\${S3_SFX_BASE}/page-flip.wav\`,${lnl}  warning: \`\${S3_SFX_BASE}/warning-beep.wav\`,${lnl}  rise: \`\${S3_SFX_BASE}/transition-sweep.wav\`,${lnl}  'hit-soft': \`\${S3_SFX_BASE}/hit-soft.wav\`,${lnl}  'hit-medium': \`\${S3_SFX_BASE}/hit-medium.wav\`,${lnl}  'hit-strong': \`\${S3_SFX_BASE}/hit-strong.wav\`,${lnl}  'bass-drop': \`\${S3_SFX_BASE}/bass-drop.wav\`,${lnl}  'cinematic-boom': \`\${S3_SFX_BASE}/cinematic-boom.wav\`,${lnl}  'data-pulse': \`\${S3_SFX_BASE}/pop-soft.wav\`,${lnl}  'data-scan': \`\${S3_SFX_BASE}/soft-click.wav\`,${lnl}  'digital-beep': \`\${S3_SFX_BASE}/warning-beep.wav\`,${lnl}  chime: \`\${S3_SFX_BASE}/success-chime.wav\`,${lnl}};`
);

audioLayer = audioLayer.replace(
  /const resolveAudioSrc = \(src\?: string\) => \{[\s\S]*?return '';\s*\};/m,
  `const resolveAudioSrc = (src?: string) => {${lnl}  if (!src) return '';${lnl}  if (src.includes('storage.googleapis.com/itnavideo-media-assets')) {${lnl}    const filename = src.split('/').pop()?.split('?')[0] || '';${lnl}    const cleanName = filename.replace(/_[a-z0-9]+\\.(wav|mp3)$/i, '.$1');${lnl}    return \`\${S3_SFX_BASE}/\${cleanName}\`;${lnl}  }${lnl}  if (/^(https?:|data:|blob:)/i.test(src)) return src;${lnl}  return '';${lnl}};`
);

fs.writeFileSync('remotion/components/PremiumAudioLayer.tsx', audioLayer);
console.log('Patched remotion/components/PremiumAudioLayer.tsx');
