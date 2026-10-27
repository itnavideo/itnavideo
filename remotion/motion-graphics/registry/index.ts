import { FeatureHighlightsGrid } from '../templates/FeatureHighlightsGrid';
import { ProcessFlowHorizontal } from '../templates/ProcessFlowHorizontal';
import { StatisticsCounterBold } from '../templates/StatisticsCounterBold';
import { ComparisonSplitPanel } from '../templates/ComparisonSplitPanel';
import { TextImageSplit } from '../templates/TextImageSplit';

export type TemplateCategory = 
  | 'process-flow'
  | 'feature-highlights'
  | 'statistics'
  | 'comparison'
  | 'vertical-steps'
  | 'circular-process'
  | 'text-image'
  | 'feature-cards';

export interface MotionTemplateRegistryEntry {
  id: string;
  name: string;
  category: TemplateCategory;
  component: React.FC<any>;
  description: string;
}

export const MOTION_GRAPHICS_REGISTRY: Record<string, MotionTemplateRegistryEntry> = {
  'process-flow-horizontal-minimal': {
    id: 'process-flow-horizontal-minimal',
    name: 'Minimal Horizontal Flow',
    category: 'process-flow',
    component: ProcessFlowHorizontal,
    description: 'A horizontal process flow with animated lines and nodes.'
  },
  'feature-highlights-grid': {
    id: 'feature-highlights-grid',
    name: 'Feature Highlights Grid',
    category: 'feature-highlights',
    component: FeatureHighlightsGrid,
    description: 'Grid layout for highlighting multiple features.'
  },
  'statistics-counter-bold': {
    id: 'statistics-counter-bold',
    name: 'Bold Statistics Counter',
    category: 'statistics',
    component: StatisticsCounterBold,
    description: 'Animated bold number counters with labels.'
  },
  'comparison-split-panel': {
    id: 'comparison-split-panel',
    name: 'Split Panel Comparison',
    category: 'comparison',
    component: ComparisonSplitPanel,
    description: 'A side-by-side comparison with checkmarks and crosses.'
  },
  'text-image-split': {
    id: 'text-image-split',
    name: 'Text + Image Split Layout',
    category: 'text-image',
    component: TextImageSplit,
    description: 'Text on the left, an animated image panel on the right.'
  },
  // Placeholder registrations for remaining to fulfill architecture scope.
  'vertical-steps-glowing': {
    id: 'vertical-steps-glowing',
    name: 'Vertical Glowing Steps',
    category: 'vertical-steps',
    component: ProcessFlowHorizontal, // Uses flow as fallback for now
    description: 'Vertical steps progression.'
  },
  'circular-process-nodes': {
    id: 'circular-process-nodes',
    name: 'Circular Process Nodes',
    category: 'circular-process',
    component: ProcessFlowHorizontal, // Uses flow as fallback for now
    description: 'Circular nodes progression.'
  },
  'feature-cards-glassmorphic': {
    id: 'feature-cards-glassmorphic',
    name: 'Glassmorphic Feature Cards',
    category: 'feature-cards',
    component: FeatureHighlightsGrid, // Uses grid as fallback for now
    description: 'Glassmorphic cards layout.'
  }
};

export const getTemplatesByCategory = (category: TemplateCategory) => {
  return Object.values(MOTION_GRAPHICS_REGISTRY).filter(t => t.category === category);
};
