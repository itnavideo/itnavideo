import fs from 'fs';
import path from 'path';

const ALL_KINETIC_STYLES = [
  'vox-giant-stagger',
  'kinetic-marquee-diagonal',
  'multi-line-block-slam',
  'headliner',
  'action',
  'boxing-punch-heavy',
  'bold-ticker-news',
  'the-difference',
  'hormozi-bold',
  'viral-redline',
  'apple-keynote-punch',
  'editorial-magazine-manifesto',
  'minimal-swiss-clean',
  'cursive',
  'chalk',
  'podcast-quote-card',
  'floodlight',
  'storyline',
  'blue-muse',
  'split-color-invert',
  'glitch-cyber-rave',
  'isometric-3d-flythrough',
  'retro-synthwave',
  'glow-gradient-pill',
  'cinematic-trailer',
  'gold-centre',
  'stat-numbers',
  'architectural-blueprint',
  'dubai-gold',
  'luxury-listing-stats',
  'luxury-monogram',
  'realtor-punch-quotes',
  'platinum-penthouse',
  'architectural-tour',
  // 8 Flagship Styles
  'depth-behind-subject',
  'luxury-gold-serif',
  'big-small-mix',
  'parallax-layers',
  'mask-reveal-slab',
  'camera-push-stack',
  'chrome-3d-extrude',
  'editorial-split-serif',
];

console.log(`Generating complete styleRegistry.ts for all ${ALL_KINETIC_STYLES.length} kinetic typography styles...`);

const blueprintEntries = ALL_KINETIC_STYLES.map((id) => {
  const isGold = id.includes('gold') || id.includes('monogram') || id.includes('penthouse') || id.includes('luxury');
  const isCyber = id.includes('cyber') || id.includes('glitch') || id.includes('hud') || id.includes('synthwave');
  const isSerif = id.includes('serif') || id.includes('editorial') || id.includes('vogue') || id.includes('manifesto');
  const is3D = id.includes('3d') || id.includes('isometric') || id.includes('extrude') || id.includes('chrome');

  const heroFont = isSerif ? 'Playfair Display, Georgia, serif' : is3D ? 'Impact, Arial Black, sans-serif' : 'Montserrat, sans-serif';
  const leadFont = isCyber ? 'Space Grotesk, monospace' : 'Inter, sans-serif';
  const accent = isGold ? '#FFD700' : isCyber ? '#00E5FF' : is3D ? '#FF6D00' : '#22C55E';

  return `  '${id}': {
    id: '${id}',
    name: '${id.replace(/-/g, ' ').toUpperCase()}',
    typography: {
      heroFont: '${heroFont}',
      leadFont: '${leadFont}',
      heroSizePx: 96,
      leadSizePx: 48,
      heroWeight: 900,
      leadWeight: 700,
      letterSpacingEm: 0.04,
      textTransform: 'uppercase',
      lineHeight: 1.1,
    },
    colorScheme: {
      primary: '#FFFFFF',
      secondary: '#E2E8F0',
      accent: '${accent}',
      background: '#070B14',
    },
    animationPreset: 'bounce',
  },`;
}).join('\n');

const fileContent = `import type { TypographyStyleId, AdvancedStyleBlueprint } from './types';

export const ADVANCED_STYLE_BLUEPRINTS: Record<string, AdvancedStyleBlueprint> = {
${blueprintEntries}
};

export function getAdvancedStyleBlueprint(styleId?: string): AdvancedStyleBlueprint | null {
  if (!styleId) return ADVANCED_STYLE_BLUEPRINTS['vox-giant-stagger'];
  const targetId = styleId.toLowerCase().trim();
  const found = ADVANCED_STYLE_BLUEPRINTS[targetId];

  if (!found && process.env.NODE_ENV !== 'production') {
    throw new Error(\`[KINETIC ENGINE] Missing blueprint for style: "\${styleId}". Falling back is strictly forbidden.\`);
  }

  return found || ADVANCED_STYLE_BLUEPRINTS['vox-giant-stagger'] || null;
}
`;

fs.writeFileSync(path.join(process.cwd(), 'lib', 'typography', 'styleRegistry.ts'), fileContent, 'utf-8');
console.log('✅ styleRegistry.ts successfully updated with 42 explicit blueprints!');
