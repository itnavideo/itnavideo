import React from 'react';

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
