import fs from 'fs';
import path from 'path';
import { TYPOGRAPHY_STYLES } from '../lib/typography/typographyStylesData';

const FLAGSHIP_STYLES = [
  { id: 'depth-behind-subject', name: 'Depth Behind Subject', category: 'depth', accentColor: '#FF6D00', tag: 'Flagship · Matting Mask' },
  { id: 'luxury-gold-serif', name: 'Luxury Gold Serif', category: 'minimal', accentColor: '#FFD700', tag: 'Flagship · 24K Gold Foil' },
  { id: 'big-small-mix', name: 'Big-Small Contrast Mix', category: 'kinetic', accentColor: '#38BDF8', tag: 'Flagship · Fluid Type Scale' },
  { id: 'parallax-layers', name: 'Multi-Layer Parallax', category: 'depth', accentColor: '#E040FB', tag: 'Flagship · Parallax Planes' },
  { id: 'mask-reveal-slab', name: 'Mask Reveal Slab', category: 'kinetic', accentColor: '#10B981', tag: 'Flagship · Mask Reveal' },
  { id: 'camera-push-stack', name: 'Camera Push Stack', category: 'kinetic', accentColor: '#FF3D00', tag: 'Flagship · Camera Impulse' },
  { id: 'chrome-3d-extrude', name: 'Chrome 3D Extrude', category: 'depth', accentColor: '#94A3B8', tag: 'Flagship · Metallic Extrude' },
  { id: 'editorial-split-serif', name: 'Editorial Split Serif', category: 'minimal', accentColor: '#F59E0B', tag: 'Flagship · Editorial High-Fashion' },
];

const existingIds = new Set(TYPOGRAPHY_STYLES.map((s) => s.id));
const updatedStyles = [...TYPOGRAPHY_STYLES];

FLAGSHIP_STYLES.forEach((f) => {
  if (!existingIds.has(f.id)) {
    updatedStyles.push({
      id: f.id as any,
      name: f.name,
      tag: f.tag,
      category: f.category as any,
      description: `Flagship ${f.name} style with advanced kinetic typography layering and fluid motion`,
      videoSrc: '',
      posterSrc: '',
      accentColor: f.accentColor,
      tags: ['Flagship', f.name],
      transcriptText: 'Hello, world! This is how you GROW your business, fast.',
      duration: 5,
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
    });
  }
});

const content = `import type { TypographyStyleId } from './types';

export type TypographyStyle = {
  id: string;
  name: string;
  tag: string;
  category: 'kinetic' | 'depth' | 'minimal' | 'real-estate';
  description: string;
  videoSrc: string;
  posterSrc: string;
  accentColor: string;
  tags: string[];
  transcriptText: string;
  duration: number;
  words: Array<{ word: string; start: number; end: number }>;
};

export const TYPOGRAPHY_STYLES: TypographyStyle[] = ${JSON.stringify(updatedStyles, null, 2)};
`;

fs.writeFileSync(path.join(process.cwd(), 'lib', 'typography', 'typographyStylesData.ts'), content, 'utf-8');
console.log(`✅ typographyStylesData.ts updated! Total styles now: ${updatedStyles.length}`);
