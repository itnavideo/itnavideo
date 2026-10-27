import type { TypographyStyleId } from './types';

export type TypographyCategory = 'all' | 'kinetic' | 'depth' | 'minimal' | 'real-estate';
export type TypographyWordTimestamp = { word: string; start: number; end: number };

export type TypographyStyle = {
  id: string;
  name: string;
  tag: string;
  category: TypographyCategory;
  description: string;
  videoSrc: string;
  posterSrc: string;
  accentColor: string;
  tags: string[];
  transcriptText: string;
  duration: number;
  words: TypographyWordTimestamp[];
};

export const TYPOGRAPHY_STYLES: TypographyStyle[] = [
  { id: 'vox-giant-stagger', name: 'Vox Typography Stagger', tag: 'High-Impact Vox', category: 'kinetic', description: 'Staggered multi-line slam with orange tape highlights', videoSrc: '', posterSrc: '', accentColor: '#FF6D00', tags: ['Vox', 'Stagger'], transcriptText: 'Hello, world! This is how you GROW your business, fast.', duration: 5, words: [] },
  { id: 'depth-behind-subject', name: 'Depth Behind Subject', tag: 'Flagship Matting Mask', category: 'depth', description: 'Subject segmentation matting mask overlay with text behind subject', videoSrc: '', posterSrc: '', accentColor: '#FF6D00', tags: ['Flagship', 'Subject'], transcriptText: 'Hello, world! This is how you GROW your business, fast.', duration: 5, words: [] },
  { id: 'luxury-gold-serif', name: 'Luxury Gold Serif', tag: 'Flagship 24K Gold Foil', category: 'minimal', description: '24K gold foil specular sweep with Cormorant Playfair serif', videoSrc: '', posterSrc: '', accentColor: '#FFD700', tags: ['Flagship', 'Gold'], transcriptText: 'Hello, world! This is how you GROW your business, fast.', duration: 5, words: [] },
  { id: 'big-small-mix', name: 'Big-Small Contrast Mix', tag: 'Flagship Fluid Type Scale', category: 'kinetic', description: '5x hero word contrast scale mix with serif + heavy sans', videoSrc: '', posterSrc: '', accentColor: '#38BDF8', tags: ['Flagship', 'Contrast'], transcriptText: 'Hello, world! This is how you GROW your business, fast.', duration: 5, words: [] },
  { id: 'parallax-layers', name: 'Multi-Layer Parallax', tag: 'Flagship Parallax Planes', category: 'depth', description: '3-tier depth parallax camera planes with blurred background text', videoSrc: '', posterSrc: '', accentColor: '#E040FB', tags: ['Flagship', 'Parallax'], transcriptText: 'Hello, world! This is how you GROW your business, fast.', duration: 5, words: [] },
  { id: 'mask-reveal-slab', name: 'Mask Reveal Slab', tag: 'Flagship Mask Reveal', category: 'kinetic', description: 'Dynamic mask clip reveal with heavy slab typography', videoSrc: '', posterSrc: '', accentColor: '#10B981', tags: ['Flagship', 'Mask'], transcriptText: 'Hello, world! This is how you GROW your business, fast.', duration: 5, words: [] },
  { id: 'camera-push-stack', name: 'Camera Push Stack', tag: 'Flagship Camera Impulse', category: 'kinetic', description: '3D camera push and pan impulse on stacked typography rows', videoSrc: '', posterSrc: '', accentColor: '#FF3D00', tags: ['Flagship', 'Camera'], transcriptText: 'Hello, world! This is how you GROW your business, fast.', duration: 5, words: [] },
  { id: 'chrome-3d-extrude', name: 'Chrome 3D Extrude', tag: 'Flagship Metallic Extrude', category: 'depth', description: 'Stacked multi-layer 3D metallic chrome extrude shadow', videoSrc: '', posterSrc: '', accentColor: '#94A3B8', tags: ['Flagship', 'Chrome'], transcriptText: 'Hello, world! This is how you GROW your business, fast.', duration: 5, words: [] }
];

export function getTypographyStyle(styleId: string): TypographyStyle | undefined {
  return TYPOGRAPHY_STYLES.find((s) => s.id === styleId) || TYPOGRAPHY_STYLES[0];
}
