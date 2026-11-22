/**
 * ITNAVIDEO REMOTION COMPONENT LIBRARY REGISTRY
 * ============================================================================
 * Central searchable catalog, metadata index, and categorization system
 * for all Remotion video components across Itnavideo studios.
 */

export type ComponentCategory =
  | 'primitives'
  | 'charts'
  | 'typography'
  | 'graphics'
  | 'infographics'
  | 'scenes'
  | 'motion-templates'
  | 'overlays'
  | 'storytelling-assets';

export type AspectRatioSupport = '16:9' | '9:16' | 'both';

export interface VideoComponentMeta {
  id: string;
  name: string;
  category: ComponentCategory;
  aspectRatio: AspectRatioSupport;
  description: string;
  tags: string[];
}

export const REMOTION_COMPONENT_REGISTRY: VideoComponentMeta[] = [
  // ── Primitives ──
  {
    id: 'scene-canvas',
    name: 'SceneCanvas',
    category: 'primitives',
    aspectRatio: 'both',
    description: 'Safe-zone canvas container with architectural dot grid and radial ambient glow.',
    tags: ['canvas', 'safe-zone', 'grid', 'ambient'],
  },
  {
    id: 'eyebrow-pill',
    name: 'EyebrowPill',
    category: 'primitives',
    aspectRatio: 'both',
    description: 'Pill badge for chapter tags, topic categories, and scene context.',
    tags: ['pill', 'badge', 'tag', 'eyebrow'],
  },
  {
    id: 'scene-header',
    name: 'SceneHeader',
    category: 'primitives',
    aspectRatio: 'both',
    description: 'Hero scene title, eyebrow kicker, and supporting body copy typography.',
    tags: ['title', 'heading', 'header', 'typography'],
  },
  {
    id: 'studio-card',
    name: 'StudioCard',
    category: 'primitives',
    aspectRatio: 'both',
    description: 'Elevated studio card container with accent top border and shadow.',
    tags: ['card', 'container', 'surface'],
  },
  {
    id: 'step-number-badge',
    name: 'StepNumberBadge',
    category: 'primitives',
    aspectRatio: 'both',
    description: 'Numbered badge for step-by-step guides, lists, and ranked sequences.',
    tags: ['step', 'number', 'badge', 'ranking'],
  },
  {
    id: 'background',
    name: 'Background',
    category: 'primitives',
    aspectRatio: 'both',
    description: 'Dynamic gradient and textured studio backdrop generator.',
    tags: ['background', 'gradient', 'mesh'],
  },

  // ── Animated Charts Suite ──
  {
    id: 'bar-chart',
    name: 'BarChart',
    category: 'charts',
    aspectRatio: 'both',
    description: 'Animated vertical columns or horizontal progressive bars with staggered spring growth.',
    tags: ['bar-chart', 'columns', 'histogram', 'metrics', 'growth'],
  },
  {
    id: 'line-chart',
    name: 'LineChart',
    category: 'charts',
    aspectRatio: 'both',
    description: 'Animated spline line chart with progressive stroke draw, glowing vertices, and peak badge.',
    tags: ['line-chart', 'spline', 'timeline', 'trajectory', 'trend'],
  },
  {
    id: 'pie-chart',
    name: 'PieChart',
    category: 'charts',
    aspectRatio: 'both',
    description: 'Proportional wedge pie chart with smooth sweep spring animation and percentage legend.',
    tags: ['pie-chart', 'proportions', 'slices', 'distribution'],
  },
  {
    id: 'donut-chart',
    name: 'DonutChart',
    category: 'charts',
    aspectRatio: 'both',
    description: 'Ring donut chart with center statistic callout (+84% ROI) and multi-channel breakdown.',
    tags: ['donut-chart', 'ring', 'roi', 'kpi', 'callout'],
  },
  {
    id: 'area-chart',
    name: 'AreaChart',
    category: 'charts',
    aspectRatio: 'both',
    description: 'Curved bezier spline with vertical translucent gradient fill and high-water mark pin.',
    tags: ['area-chart', 'gradient-area', 'reach', 'cumulative', 'growth'],
  },
  {
    id: 'radar-chart',
    name: 'RadarChart',
    category: 'charts',
    aspectRatio: 'both',
    description: 'Spiderweb polygonal radar chart for comparing multi-axis viral metrics vs niche averages.',
    tags: ['radar-chart', 'spider-chart', 'multi-axis', 'benchmark', 'comparison'],
  },

  // ── Graphics & Frames ──
  {
    id: 'adaptive-card',
    name: 'AdaptiveCard',
    category: 'graphics',
    aspectRatio: 'both',
    description: 'Responsive content card with glassmorphism, accent edges, and spring entry.',
    tags: ['card', 'glassmorphism', 'spring'],
  },
  {
    id: 'mockup-frames',
    name: 'MockupFrames',
    category: 'graphics',
    aspectRatio: 'both',
    description: 'Photorealistic iPhone, MacBook, and browser window frames for screenshots.',
    tags: ['device', 'iphone', 'macbook', 'mockup', 'frame'],
  },
  {
    id: 'handwriting-highlight',
    name: 'HandwritingHighlight',
    category: 'graphics',
    aspectRatio: 'both',
    description: 'Realistic marker pen underline, squiggly highlight, and circle annotation.',
    tags: ['marker', 'underline', 'highlight', 'handwriting', 'annotation'],
  },
  {
    id: 'dynamic-curved-arrow',
    name: 'DynamicCurvedArrow',
    category: 'graphics',
    aspectRatio: 'both',
    description: 'Curved vector arrow with progressive stroke reveal and organic wobble.',
    tags: ['arrow', 'pointer', 'curve', 'motion'],
  },
  {
    id: 'data-charts',
    name: 'DataCharts',
    category: 'graphics',
    aspectRatio: 'both',
    description: 'Animated vertical bar charts, line graphs, and donut metrics.',
    tags: ['chart', 'bar', 'graph', 'metrics', 'data'],
  },
  {
    id: 'storytelling-frames',
    name: 'StorytellingFrames',
    category: 'graphics',
    aspectRatio: 'both',
    description: 'Polaroid, scrapbook, and filmstrip image framing templates.',
    tags: ['polaroid', 'scrapbook', 'film', 'photo'],
  },
  {
    id: 'whiteboard-hand',
    name: 'WhiteboardHand',
    category: 'graphics',
    aspectRatio: '9:16',
    description: 'Real photorealistic human hand holding marker pen with exact tip physics.',
    tags: ['hand', 'marker', 'whiteboard', 'drawing'],
  },
  {
    id: 'whiteboard-flow-arrow',
    name: 'WhiteboardFlowArrow',
    category: 'graphics',
    aspectRatio: 'both',
    description: 'Hand-sketched flow arrow with progressive stroke reveal.',
    tags: ['whiteboard', 'arrow', 'sketch', 'flow'],
  },
  {
    id: 'whiteboard-2d-icon',
    name: 'Whiteboard2DIcon',
    category: 'graphics',
    aspectRatio: 'both',
    description: 'Drawn 2D stickman, money jar, growth chart, and lightbulb vector icons.',
    tags: ['whiteboard', 'icon', 'stickman', 'drawing'],
  },

  // ── Infographics ──
  {
    id: 'curved-roadmap-infographic',
    name: 'CurvedRoadmapInfographic',
    category: 'infographics',
    aspectRatio: 'both',
    description: 'S-curve chronological roadmap with sequential milestone node unlocks.',
    tags: ['roadmap', 'timeline', 'milestones', 'path'],
  },
  {
    id: 'circular-org-chart-infographic',
    name: 'CircularOrgChartInfographic',
    category: 'infographics',
    aspectRatio: 'both',
    description: 'Central hub with orbiting capability nodes and pulsing radar connections.',
    tags: ['circular', 'org-chart', 'ecosystem', 'orbit'],
  },
  {
    id: 'horizontal-shelves-infographic',
    name: 'HorizontalShelvesInfographic',
    category: 'infographics',
    aspectRatio: 'both',
    description: 'Multi-tier architectural shelf layout for feature breakdowns.',
    tags: ['shelves', 'tiers', 'levels', 'hierarchy'],
  },
  {
    id: 'scorecard-dashboard-infographic',
    name: 'ScorecardDashboardInfographic',
    category: 'infographics',
    aspectRatio: 'both',
    description: 'KPI metric scorecard with trending indicators and percentage badges.',
    tags: ['kpi', 'scorecard', 'metrics', 'dashboard'],
  },
  {
    id: 'table-of-contents-infographic',
    name: 'TableOfContentsInfographic',
    category: 'infographics',
    aspectRatio: 'both',
    description: 'Sequential chapter index with active chapter spotlight highlight.',
    tags: ['agenda', 'toc', 'chapters', 'index'],
  },

  // ── Scenes (23 Full Scene Layouts) ──
  {
    id: 'hook-scene',
    name: 'HookScene',
    category: 'scenes',
    aspectRatio: '9:16',
    description: 'High-impact hook opener with dynamic headline, b-roll backdrop, and pop-in typography.',
    tags: ['hook', 'intro', 'attention', 'shorts'],
  },
  {
    id: 'stat-scene',
    name: 'StatScene',
    category: 'scenes',
    aspectRatio: '9:16',
    description: 'Shocking statistic or KPI highlight with animated counter and context card.',
    tags: ['stat', 'counter', 'kpi', 'number'],
  },
  {
    id: 'quote-scene',
    name: 'QuoteScene',
    category: 'scenes',
    aspectRatio: '9:16',
    description: 'Influential quote card with author avatar, source, and elegant quotation marks.',
    tags: ['quote', 'author', 'testimonial'],
  },
  {
    id: 'workflow-scene',
    name: 'WorkflowScene',
    category: 'scenes',
    aspectRatio: '9:16',
    description: 'Step-by-step workflow pipeline with connecting glowing energy arrows.',
    tags: ['workflow', 'process', 'steps', 'pipeline'],
  },
  {
    id: 'roadmap-scene',
    name: 'RoadmapScene',
    category: 'scenes',
    aspectRatio: '9:16',
    description: 'Vertical progression journey with active phase badge and target goal.',
    tags: ['roadmap', 'journey', 'phases'],
  },
  {
    id: 'ecosystem-scene',
    name: 'EcosystemScene',
    category: 'scenes',
    aspectRatio: '9:16',
    description: 'Multi-service integration hub with orbiting tool badges.',
    tags: ['ecosystem', 'integrations', 'tools'],
  },
  {
    id: 'comparison-scene',
    name: 'ComparisonScene',
    category: 'scenes',
    aspectRatio: '9:16',
    description: 'Side-by-side or stacked Versus comparison cards with winning badge.',
    tags: ['versus', 'compare', 'contrast', 'vs'],
  },
  {
    id: 'milestone-ladder-scene',
    name: 'MilestoneLadderScene',
    category: 'scenes',
    aspectRatio: '9:16',
    description: 'Ascending value ladder showing progression from beginner to master.',
    tags: ['ladder', 'levels', 'tiers', 'progression'],
  },
  {
    id: 'calendar-grid-scene',
    name: 'CalendarGridScene',
    category: 'scenes',
    aspectRatio: '9:16',
    description: 'Monthly schedule / sprint calendar with highlighted release dates.',
    tags: ['calendar', 'dates', 'schedule'],
  },
  {
    id: 'prompt-window-scene',
    name: 'PromptWindowScene',
    category: 'scenes',
    aspectRatio: '9:16',
    description: 'AI chat prompt input terminal with typewriter cursor and generated output.',
    tags: ['ai', 'prompt', 'chatgpt', 'terminal'],
  },
  {
    id: 'screenshot-scene',
    name: 'ScreenshotScene',
    category: 'scenes',
    aspectRatio: '9:16',
    description: 'Clean device frame showcasing app UI with pan-down camera drift.',
    tags: ['screenshot', 'app', 'ui', 'camera'],
  },

  // ── Motion Graphics Templates ──
  {
    id: 'comparison-split-panel',
    name: 'ComparisonSplitPanel',
    category: 'motion-templates',
    aspectRatio: 'both',
    description: 'Split-screen dual comparison panel with custom color coding and bullet points.',
    tags: ['split-screen', 'comparison', 'dual-panel'],
  },
  {
    id: 'feature-highlights-grid',
    name: 'FeatureHighlightsGrid',
    category: 'motion-templates',
    aspectRatio: 'both',
    description: '2x2 or 3-column feature grid with staggered icon bounce animations.',
    tags: ['grid', 'features', 'benefits', 'cards'],
  },
  {
    id: 'process-flow-horizontal',
    name: 'ProcessFlowHorizontal',
    category: 'motion-templates',
    aspectRatio: '16:9',
    description: 'Horizontal step-by-step pipeline with sequential line progression.',
    tags: ['pipeline', 'horizontal', 'process', '16:9'],
  },
  {
    id: 'statistics-counter-bold',
    name: 'StatisticsCounterBold',
    category: 'motion-templates',
    aspectRatio: 'both',
    description: 'Giant typography metric with rolling numeric odometer animation.',
    tags: ['odometer', 'counter', 'bold', 'metrics'],
  },

  // ── Typography & Captions ──
  {
    id: 'caption-renderer',
    name: 'CaptionRenderer',
    category: 'typography',
    aspectRatio: '9:16',
    description: 'Master 9:16 vertical karaoke subtitle engine with 32 presets.',
    tags: ['karaoke', 'captions', 'subtitles', 'reels', 'shorts'],
  },
  {
    id: 'motion-caption-renderer',
    name: 'MotionCaptionRenderer',
    category: 'typography',
    aspectRatio: 'both',
    description: 'Deterministic word-by-word motion typography engine for 16:9 and 9:16.',
    tags: ['typography', 'kinetic', 'subtitles', 'word-level'],
  },
  {
    id: 'luxury-editorial-caption',
    name: 'LuxuryEditorialCaptionAsset',
    category: 'typography',
    aspectRatio: 'both',
    description: 'Editorial serif typography for sophisticated luxury brands and documentaries.',
    tags: ['serif', 'luxury', 'editorial', 'aesthetic'],
  },
  {
    id: 'executive-minimalist-caption',
    name: 'ExecutiveMinimalistCaptionAsset',
    category: 'typography',
    aspectRatio: 'both',
    description: 'Understated, clean typography for corporate, finance, and LinkedIn video content.',
    tags: ['minimalist', 'corporate', 'finance', 'executive'],
  },

  // ── Overlays, Timers & Camera ──
  {
    id: 'brand-watermark',
    name: 'BrandWatermark',
    category: 'overlays',
    aspectRatio: 'both',
    description: 'Official Itnavideo anti-crop brand watermark with security seal for free renders.',
    tags: ['watermark', 'branding', 'security', 'free-tier'],
  },
  {
    id: 'universal-progress-bar',
    name: 'UniversalProgressBar',
    category: 'overlays',
    aspectRatio: 'both',
    description: 'Top/bottom video retention progress bar with accent gradient glow.',
    tags: ['progress-bar', 'retention', 'timer', 'scrubber'],
  },
  {
    id: 'subscribe-bell-asset',
    name: 'SubscribeBellAsset',
    category: 'overlays',
    aspectRatio: 'both',
    description: 'Animated YouTube Subscribe button with clicking mouse cursor and ringing bell.',
    tags: ['youtube', 'subscribe', 'bell', 'cta', 'social'],
  },
  {
    id: 'universal-lower-third',
    name: 'UniversalLowerThird',
    category: 'overlays',
    aspectRatio: '16:9',
    description: 'Broadcast-style speaker nameplate, title, and social handle banner.',
    tags: ['lower-third', 'nameplate', 'speaker', 'broadcast'],
  },
  {
    id: 'premium-visual-treatment',
    name: 'PremiumVisualTreatment',
    category: 'overlays',
    aspectRatio: 'both',
    description: 'Cinematic color grading, film grain texture, vignette, and ambient dust particles.',
    tags: ['color-grade', 'grain', 'vignette', 'cinematic'],
  },
  {
    id: 'virtual-camera-layer',
    name: 'VirtualCameraLayer',
    category: 'overlays',
    aspectRatio: 'both',
    description: 'Ken Burns slow push-in, subtle breathing drift, and dynamic camera punch-in.',
    tags: ['camera', 'ken-burns', 'punch-in', 'motion'],
  },
];

/**
 * Registry Helper Functions
 */

export function getComponentsByCategory(category: ComponentCategory): VideoComponentMeta[] {
  return REMOTION_COMPONENT_REGISTRY.filter((c) => c.category === category);
}

export function getComponentsByAspectRatio(aspectRatio: '16:9' | '9:16'): VideoComponentMeta[] {
  return REMOTION_COMPONENT_REGISTRY.filter(
    (c) => c.aspectRatio === aspectRatio || c.aspectRatio === 'both'
  );
}

export function searchComponents(query: string): VideoComponentMeta[] {
  const q = query.toLowerCase().trim();
  if (!q) return REMOTION_COMPONENT_REGISTRY;
  return REMOTION_COMPONENT_REGISTRY.filter(
    (c) =>
      c.name.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q) ||
      c.tags.some((t) => t.toLowerCase().includes(q))
  );
}
