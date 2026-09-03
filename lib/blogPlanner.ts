export type StrategicArticlePlan = {
  targetSearchQuery: string;
  userProblem: string;
  featureSolution: string;
  targetDashboardUrl: string;
  relevantVideoExample: {
    title: string;
    url?: string;
  };
  ctaButtonText: string;
};

export function planStrategicArticle(title: string, dashboardType: string = 'auto-caption-reel'): StrategicArticlePlan {
  const typeMap: Record<string, Partial<StrategicArticlePlan>> = {
    'auto-caption-reel': {
      featureSolution: 'Auto-detect word timestamps and render 3D dynamic kinetic subtitles',
      relevantVideoExample: { title: 'Viral Fitness & Talking Reel with Auto Captions' },
      ctaButtonText: 'Generate Captions with 1 Click',
    },
    'typography-video': {
      featureSolution: '3D kinetic typography popups synced to keywords and volume peaks',
      relevantVideoExample: { title: 'High-Impact Luxury Typography Reel' },
      ctaButtonText: 'Create Kinetic Typography Video',
    },
    'compare-explainer': {
      featureSolution: 'Left vs right comparison with automatic sticker narrator',
      relevantVideoExample: { title: 'IIT vs ITI Educational Comparison' },
      ctaButtonText: 'Make Compare Explainer Video',
    },
    'whiteboard-video': {
      featureSolution: 'AI sketch whiteboard animations synced to speech narration',
      relevantVideoExample: { title: 'Corporate Finance Whiteboard Breakdown' },
      ctaButtonText: 'Render Whiteboard Video',
    },
  };

  const defaults = typeMap[dashboardType] || {
    featureSolution: 'AI-assisted automatic video generation and cloud rendering',
    relevantVideoExample: { title: 'Social Media Creator Showcase Reel' },
    ctaButtonText: 'Create Free AI Video',
  };

  return {
    targetSearchQuery: title.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim(),
    userProblem: 'Manual video editing and caption timing takes 2-4 hours per video.',
    featureSolution: defaults.featureSolution || 'AI-assisted video workflow',
    targetDashboardUrl: `/dashboard?videoType=${dashboardType}`,
    relevantVideoExample: defaults.relevantVideoExample || { title: 'Creator Video' },
    ctaButtonText: defaults.ctaButtonText || 'Create Free AI Video',
  };
}
