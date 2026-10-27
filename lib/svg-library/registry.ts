import React from 'react';
import { AnimatedArrow } from './SvgAnimatedArrow';
import { AnimatedCircle } from './SvgAnimatedCircle';
import { AnimatedHighlight } from './SvgAnimatedHighlight';
import { AnimatedSvgPath } from './AnimatedSvgPath';
import { AnimatedLucideIcon } from './AnimatedLucideIcon';
import { SVG_DATA_LIBRARY } from './assetData';
import * as MegaData from './data'; // The generated 500 assets

// Expand the category type to match the 15 categories + custom ones
export type SvgCategory = 
  | 'arrows' | 'shapes' | 'highlights' | 'diagrams' | 'infographics'
  | 'general' | 'business' | 'finance' | 'technology' | 'education'
  | 'health' | 'people' | 'marketing' | 'geography' | 'nature'
  | 'transport' | 'conceptual' | 'all';

export interface SvgAssetDef {
  id: string;
  name: string;
  category: SvgCategory;
  component: React.FC<any>;
  defaultProps?: any;
  keywords: string[];
}

// 1. Hand-coded custom components with specialized logic
const customAssets: SvgAssetDef[] = [
  {
    id: 'custom-arrow-straight-right',
    name: 'Straight Right Arrow (Custom)',
    category: 'arrows',
    component: AnimatedArrow,
    keywords: ['arrow', 'pointer', 'right', 'straight']
  },
  {
    id: 'custom-circle-outline',
    name: 'Animated Circle Outline (Custom)',
    category: 'shapes',
    component: AnimatedCircle,
    keywords: ['circle', 'round', 'outline', 'shape']
  },
  {
    id: 'custom-highlight-swoosh',
    name: 'Swoosh Highlight (Custom)',
    category: 'highlights',
    component: AnimatedHighlight,
    keywords: ['highlight', 'swoosh', 'underline', 'marker']
  }
];

// 2. Data-driven original SVG assets (paths)
const generatedPathAssets: SvgAssetDef[] = (SVG_DATA_LIBRARY || [])
  .filter(data => data && typeof data === 'object' && data.id)
  .map(data => ({
  id: data.id,
  name: data.name,
  category: data.category as SvgCategory,
  component: AnimatedSvgPath,
  defaultProps: {
    paths: data.paths || [],
    viewBox: data.viewBox || '0 0 100 100',
  },
  keywords: data.keywords || [],
}));

// 3. Mega Catalog (500 Lucide-based Assets)
const allMegaData = Object.values(MegaData).flat() as Array<{
  id: string;
  name: string;
  category: SvgCategory;
  keywords: string[];
  lucideComponent: string;
}>;

const megaAssets: SvgAssetDef[] = (allMegaData || [])
  .filter(data => data && typeof data === 'object' && data.id)
  .map(data => ({
  id: data.id,
  name: data.name,
  category: data.category,
  component: AnimatedLucideIcon,
  defaultProps: {
    iconName: data.lucideComponent
  },
  keywords: data.keywords || []
}));

export const SVG_ASSET_REGISTRY: SvgAssetDef[] = [
  ...customAssets, 
  ...generatedPathAssets,
  ...megaAssets
];
