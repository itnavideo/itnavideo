import React from 'react';
import { AbsoluteFill, Composition } from 'remotion';
import { MOTION_GRAPHICS_REGISTRY } from '../registry';

// Sample data for the preview
const processFlowData = {
  title: 'How It Works',
  subtitle: 'Simple 3-step process',
  steps: [
    { id: '1', title: 'Upload', description: 'Provide your script' },
    { id: '2', title: 'Process', description: 'AI does the magic' },
    { id: '3', title: 'Download', description: 'Get your video' }
  ]
};

const statsData = {
  title: 'Our Impact',
  stats: [
    { id: '1', value: 50, suffix: 'K+', label: 'Users' },
    { id: '2', value: 99, suffix: '%', label: 'Satisfaction' },
    { id: '3', value: 2, suffix: 'M+', label: 'Videos Created' }
  ]
};

const comparisonData = {
  title: 'Why Choose Us?',
  leftTitle: 'Us',
  rightTitle: 'Them',
  leftItems: [
    { id: '1', feature: 'Fast rendering', isPositive: true },
    { id: '2', feature: 'High quality', isPositive: true }
  ],
  rightItems: [
    { id: '3', feature: 'Slow process', isPositive: false },
    { id: '4', feature: 'Low resolution', isPositive: false }
  ]
};

const textImageData = {
  title: 'Create Stunning Videos',
  description: 'Turn your ideas into professional videos in minutes with our AI-powered engine.',
  imageSrc: '' // Will use placeholder
};

export const LibraryPreview: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', width: '100%', height: '100%' }}>
        <div style={{ width: '50%', height: '50%', transform: 'scale(0.5)', transformOrigin: 'top left' }}>
          {React.createElement(MOTION_GRAPHICS_REGISTRY['process-flow-horizontal-minimal'].component, processFlowData)}
        </div>
        <div style={{ width: '50%', height: '50%', transform: 'scale(0.5)', transformOrigin: 'top left', left: '50%', position: 'absolute' }}>
          {React.createElement(MOTION_GRAPHICS_REGISTRY['statistics-counter-bold'].component, statsData)}
        </div>
        <div style={{ width: '50%', height: '50%', transform: 'scale(0.5)', transformOrigin: 'top left', top: '50%', position: 'absolute' }}>
          {React.createElement(MOTION_GRAPHICS_REGISTRY['comparison-split-panel'].component, comparisonData)}
        </div>
        <div style={{ width: '50%', height: '50%', transform: 'scale(0.5)', transformOrigin: 'top left', top: '50%', left: '50%', position: 'absolute' }}>
          {React.createElement(MOTION_GRAPHICS_REGISTRY['text-image-split'].component, textImageData)}
        </div>
      </div>
    </AbsoluteFill>
  );
};
