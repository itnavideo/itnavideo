import type { SvgCategory } from './types';

export interface SvgDataDef {
  id: string;
  name: string;
  category: SvgCategory;
  keywords: string[];
  viewBox: string;
  paths: {
    d: string;
    length: number;
    colorKey?: 'primary' | 'accent' | 'highlight' | 'white';
    strokeWidth?: number;
  }[];
}

export const SVG_DATA_LIBRARY: SvgDataDef[] = [
  {
    id: 'arrow-curved',
    name: 'Curved Arrow',
    category: 'arrows',
    keywords: ['arrow', 'curve', 'point', 'direction'],
    viewBox: '0 0 100 100',
    paths: [
      { d: 'M10,80 Q50,20 90,50', length: 120, colorKey: 'primary', strokeWidth: 6 },
      { d: 'M70,30 L90,50 L75,70', length: 60, colorKey: 'primary', strokeWidth: 6 }
    ]
  },
  {
    id: 'arrow-loop',
    name: 'Loop Arrow',
    category: 'arrows',
    keywords: ['arrow', 'loop', 'return', 'back'],
    viewBox: '0 0 100 100',
    paths: [
      { d: 'M80,50 C80,20 20,20 20,50 C20,80 80,80 80,50', length: 250, colorKey: 'primary', strokeWidth: 5 },
      { d: 'M65,40 L80,50 L95,40', length: 40, colorKey: 'primary', strokeWidth: 5 }
    ]
  },
  {
    id: 'shape-check',
    name: 'Checkmark',
    category: 'shapes',
    keywords: ['check', 'tick', 'yes', 'correct', 'success'],
    viewBox: '0 0 100 100',
    paths: [
      { d: 'M20,50 L40,70 L80,30', length: 100, colorKey: 'accent', strokeWidth: 8 }
    ]
  },
  {
    id: 'shape-cross',
    name: 'Cross / X',
    category: 'shapes',
    keywords: ['cross', 'x', 'no', 'wrong', 'error'],
    viewBox: '0 0 100 100',
    paths: [
      { d: 'M25,25 L75,75', length: 75, colorKey: 'primary', strokeWidth: 8 },
      { d: 'M75,25 L25,75', length: 75, colorKey: 'primary', strokeWidth: 8 }
    ]
  },
  {
    id: 'highlight-circle',
    name: 'Sloppy Circle',
    category: 'highlights',
    keywords: ['circle', 'sloppy', 'draw', 'highlight'],
    viewBox: '0 0 100 100',
    paths: [
      { d: 'M50,10 C80,10 95,35 90,65 C85,90 40,95 20,75 C0,55 10,20 40,15 C55,10 70,15 75,25', length: 300, colorKey: 'highlight', strokeWidth: 6 }
    ]
  },
  {
    id: 'infographic-chart-up',
    name: 'Upward Chart',
    category: 'infographics',
    keywords: ['chart', 'graph', 'up', 'growth', 'business'],
    viewBox: '0 0 100 100',
    paths: [
      { d: 'M10,90 L90,90', length: 80, colorKey: 'primary', strokeWidth: 4 },
      { d: 'M10,90 L10,10', length: 80, colorKey: 'primary', strokeWidth: 4 },
      { d: 'M20,70 L40,50 L60,60 L85,20', length: 120, colorKey: 'accent', strokeWidth: 6 },
      { d: 'M70,20 L85,20 L85,35', length: 40, colorKey: 'accent', strokeWidth: 6 }
    ]
  },
  {
    id: 'speech-bubble',
    name: 'Speech Bubble',
    category: 'diagrams',
    keywords: ['speech', 'bubble', 'talk', 'chat', 'message'],
    viewBox: '0 0 100 100',
    paths: [
      { d: 'M15,25 C15,15 25,10 50,10 C75,10 85,15 85,25 L85,60 C85,70 75,75 50,75 L30,75 L15,90 L15,70 C15,70 15,60 15,60 Z', length: 300, colorKey: 'primary', strokeWidth: 5 },
      { d: 'M35,35 L65,35', length: 30, colorKey: 'primary', strokeWidth: 4 },
      { d: 'M35,50 L55,50', length: 20, colorKey: 'primary', strokeWidth: 4 }
    ]
  },
  {
    id: 'diagram-flow-nodes',
    name: 'Flow Nodes',
    category: 'diagrams',
    keywords: ['flow', 'nodes', 'network', 'connection', 'diagram'],
    viewBox: '0 0 100 100',
    paths: [
      { d: 'M20,50 L40,30 L80,30', length: 100, colorKey: 'primary', strokeWidth: 3 },
      { d: 'M20,50 L40,70 L80,70', length: 100, colorKey: 'primary', strokeWidth: 3 },
      { d: 'M20,50 A5,5 0 1,1 19.9,50', length: 35, colorKey: 'accent', strokeWidth: 8 },
      { d: 'M80,30 A5,5 0 1,1 79.9,30', length: 35, colorKey: 'highlight', strokeWidth: 8 },
      { d: 'M80,70 A5,5 0 1,1 79.9,70', length: 35, colorKey: 'highlight', strokeWidth: 8 }
    ]
  },
  {
    id: 'highlight-underline-zigzag',
    name: 'Zigzag Underline',
    category: 'highlights',
    keywords: ['underline', 'zigzag', 'highlight', 'squiggle'],
    viewBox: '0 0 100 100',
    paths: [
      { d: 'M10,50 L20,30 L35,70 L50,30 L65,70 L80,30 L90,50', length: 250, colorKey: 'highlight', strokeWidth: 8 }
    ]
  },
  {
    id: 'shape-star',
    name: 'Star',
    category: 'shapes',
    keywords: ['star', 'favorite', 'rating', 'shape'],
    viewBox: '0 0 100 100',
    paths: [
      { d: 'M50,10 L60,40 L90,40 L65,60 L75,90 L50,70 L25,90 L35,60 L10,40 L40,40 Z', length: 300, colorKey: 'accent', strokeWidth: 5 }
    ]
  }
];
