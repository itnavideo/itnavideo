/**
 * ITNAVIDEO REMOTION COMPONENT LIBRARY REGISTRY
 * ============================================================================
 * Central searchable catalog, metadata index, and categorization system
 * for all Remotion video components across Itnavideo studios.
 */

export type ComponentCategory =
  | 'primitives'
  | 'charts'
  | 'diagrams'
  | 'timelines'
  | 'comparisons'
  | 'radial'
  | 'business'
  | 'network'
  | 'statistics'
  | 'ui-mockups'
  | 'motion'
  | 'media'
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

  // ── Animated Diagrams Suite ──
  {
    id: 'flowchart',
    name: 'Flowchart',
    category: 'diagrams',
    aspectRatio: 'both',
    description: 'Sequential decision-making flowchart with step nodes and animated connecting arrows.',
    tags: ['flowchart', 'process', 'decision', 'steps', 'workflow'],
  },
  {
    id: 'tree-diagram',
    name: 'TreeDiagram',
    category: 'diagrams',
    aspectRatio: 'both',
    description: 'Hierarchical branching tree structure with root, category nodes, and leaf badges.',
    tags: ['tree', 'hierarchy', 'branching', 'taxonomy', 'leaves'],
  },
  {
    id: 'org-chart',
    name: 'OrgChart',
    category: 'diagrams',
    aspectRatio: 'both',
    description: 'Organizational hierarchy structure showcasing leadership and departmental teams.',
    tags: ['org-chart', 'organization', 'leadership', 'team', 'hierarchy'],
  },
  {
    id: 'mind-map',
    name: 'MindMap',
    category: 'diagrams',
    aspectRatio: 'both',
    description: 'Radial organic mind map with curved branches radiating outwards from a central core idea.',
    tags: ['mind-map', 'brainstorm', 'core-idea', 'branches', 'radial'],
  },
  {
    id: 'network-diagram',
    name: 'NetworkDiagram',
    category: 'diagrams',
    aspectRatio: 'both',
    description: 'Decentralized mesh graph with interconnected service nodes and dashed communication links.',
    tags: ['network', 'mesh', 'nodes', 'graph', 'distributed'],
  },
  {
    id: 'cycle-diagram',
    name: 'CycleDiagram',
    category: 'diagrams',
    aspectRatio: 'both',
    description: 'Continuous circular flywheel loop with orbital step badges and center hub.',
    tags: ['cycle', 'flywheel', 'loop', 'circular', 'continuous'],
  },

  // ── Animated Timelines & Process Suite ──
  {
    id: 'timeline',
    name: 'Timeline',
    category: 'timelines',
    aspectRatio: 'both',
    description: 'Vertical or horizontal event timeline with continuous spine line and glowing markers.',
    tags: ['timeline', 'events', 'pacing', 'chronological', 'schedule'],
  },
  {
    id: 'process-steps',
    name: 'ProcessSteps',
    category: 'timelines',
    aspectRatio: 'both',
    description: 'Numbered operational step cards with status indicators (completed, active, upcoming).',
    tags: ['process', 'steps', 'workflow', 'checklist', 'status'],
  },
  {
    id: 'roadmap',
    name: 'Roadmap',
    category: 'timelines',
    aspectRatio: 'both',
    description: 'Product or strategic roadmap featuring quarterly phases and deliverables.',
    tags: ['roadmap', 'strategy', 'phases', 'quarters', 'releases'],
  },
  {
    id: 'milestone',
    name: 'Milestone',
    category: 'timelines',
    aspectRatio: 'both',
    description: 'Metric achievement celebration cards with bold numbers and celebratory icons.',
    tags: ['milestone', 'achievement', 'kpi', 'subscribers', 'records'],
  },
  {
    id: 'history-timeline',
    name: 'HistoryTimeline',
    category: 'timelines',
    aspectRatio: 'both',
    description: 'Historical evolution timeline with year badges and narrative documentary cards.',
    tags: ['history', 'evolution', 'documentary', 'biography', 'origin'],
  },

  // ── Animated Comparisons Suite ──
  {
    id: 'comparison-table',
    name: 'ComparisonTable',
    category: 'comparisons',
    aspectRatio: 'both',
    description: 'Feature matrix with checkmarks, crosses, and spotlight winner column.',
    tags: ['comparison', 'table', 'matrix', 'features', 'versus'],
  },
  {
    id: 'before-after',
    name: 'BeforeAfter',
    category: 'comparisons',
    aspectRatio: 'both',
    description: 'Old manual way (red) vs AI transformation (green) dual comparison cards.',
    tags: ['before-after', 'transformation', 'contrast', 'old-vs-new'],
  },
  {
    id: 'pros-cons',
    name: 'ProsCons',
    category: 'comparisons',
    aspectRatio: 'both',
    description: 'Objective trade-off analysis cards: green advantages vs red considerations.',
    tags: ['pros-cons', 'trade-offs', 'advantages', 'disadvantages'],
  },
  {
    id: 'splitscreen',
    name: 'Splitscreen',
    category: 'comparisons',
    aspectRatio: 'both',
    description: '50/50 dual side-by-side view with central glowing animated VS circle badge.',
    tags: ['split-screen', 'vs', 'versus', 'dual-panel', 'head-to-head'],
  },
  {
    id: 'ranking-list',
    name: 'RankingList',
    category: 'comparisons',
    aspectRatio: 'both',
    description: 'Ranked leaderboard stack with gold, silver, and bronze podium medal badges.',
    tags: ['ranking', 'leaderboard', 'top-tier', 'podium', 'medal'],
  },

  // ── Animated Radial Graphics Suite ──
  {
    id: 'radial-chart',
    name: 'RadialChart',
    category: 'radial',
    aspectRatio: 'both',
    description: 'Concentric multi-ring activity chart with progressive animated stroke arcs.',
    tags: ['radial', 'rings', 'activity', 'concentric', 'apple-watch'],
  },
  {
    id: 'circular-progress',
    name: 'CircularProgress',
    category: 'radial',
    aspectRatio: 'both',
    description: 'Circular percentage gauge meter with glowing stroke and center counter.',
    tags: ['circular-progress', 'gauge', 'meter', 'percentage', 'score'],
  },
  {
    id: 'donut-progress',
    name: 'DonutProgress',
    category: 'radial',
    aspectRatio: 'both',
    description: 'Multi-segment status donut with center goal text and quota allocation.',
    tags: ['donut-progress', 'quota', 'allocation', 'segments', 'goals'],
  },
  {
    id: 'radial-diagram',
    name: 'RadialDiagram',
    category: 'radial',
    aspectRatio: 'both',
    description: 'Hub and spoke radial architecture with central core and radiating capabilities.',
    tags: ['radial-diagram', 'spokes', 'hub-and-spoke', 'central-core'],
  },

  // ── Animated Business Graphics Suite ──
  {
    id: 'funnel-chart',
    name: 'FunnelChart',
    category: 'business',
    aspectRatio: 'both',
    description: 'Tapered audience conversion funnel with drop-off percentages and count tags.',
    tags: ['funnel', 'conversion', 'leads', 'sales', 'drop-off'],
  },
  {
    id: 'pyramid-chart',
    name: 'PyramidChart',
    category: 'business',
    aspectRatio: 'both',
    description: 'Hierarchical stacked pyramid tiers from broad foundation to apex monopoly.',
    tags: ['pyramid', 'hierarchy', 'maslow', 'levels', 'apex'],
  },
  {
    id: 'waterfall-chart',
    name: 'WaterfallChart',
    category: 'business',
    aspectRatio: 'both',
    description: 'Financial variance waterfall breakdown showing positive gains, expenses, and net profit.',
    tags: ['waterfall', 'financial', 'variance', 'revenue', 'profit'],
  },
  {
    id: 'gauge-chart',
    name: 'GaugeChart',
    category: 'business',
    aspectRatio: 'both',
    description: 'Half-circle speedometer gauge with color gradient zones and rotating indicator needle.',
    tags: ['gauge', 'speedometer', 'velocity', 'meter', 'tachometer'],
  },

  // ── Animated Network Graphics Suite ──
  {
    id: 'node-graph',
    name: 'NodeGraph',
    category: 'network',
    aspectRatio: 'both',
    description: 'Autonomous agent topological cluster graph with floating halo nodes and connecting links.',
    tags: ['node-graph', 'agents', 'topology', 'mesh', 'clusters'],
  },
  {
    id: 'connection-line',
    name: 'ConnectionLine',
    category: 'network',
    aspectRatio: 'both',
    description: 'Curved bezier, straight, or orthogonal animated connecting line with data packet pulse.',
    tags: ['connection-line', 'stream', 'bezier', 'flow', 'packets'],
  },
  {
    id: 'network-map',
    name: 'NetworkMap',
    category: 'network',
    aspectRatio: 'both',
    description: 'Global distributed server mesh map with coordinate dots, ping ripples, and latency badges.',
    tags: ['network-map', 'world-map', 'servers', 'latency', 'edge'],
  },
  {
    id: 'hierarchy-graph',
    name: 'HierarchyGraph',
    category: 'network',
    aspectRatio: 'both',
    description: 'Multi-tier directed acyclic graph (DAG) breakdown showing top-down system layers.',
    tags: ['hierarchy-graph', 'dag', 'tiers', 'layers', 'architecture'],
  },

  // ── Animated Statistics Suite ──
  {
    id: 'counter',
    name: 'Counter',
    category: 'statistics',
    aspectRatio: 'both',
    description: 'Giant animated numeric odometer counter with prefixes, suffixes, and spring physics.',
    tags: ['counter', 'odometer', 'numbers', 'revenue', 'subscribers'],
  },
  {
    id: 'percentage',
    name: 'Percentage',
    category: 'statistics',
    aspectRatio: 'both',
    description: 'Growth and decline percentage indicators with directional trending arrow icons.',
    tags: ['percentage', 'growth', 'trending', 'delta', 'increase'],
  },
  {
    id: 'kpi-widget',
    name: 'KPIWidget',
    category: 'statistics',
    aspectRatio: 'both',
    description: 'Executive metric card with top accent bar, delta indicator, and period benchmark.',
    tags: ['kpi', 'widget', 'executive', 'metric', 'benchmark'],
  },
  {
    id: 'progress-bar',
    name: 'ProgressBar',
    category: 'statistics',
    aspectRatio: 'both',
    description: 'Horizontal retention and quota progress meter with animated gradient fill.',
    tags: ['progress-bar', 'progress', 'quota', 'percentage', 'fill'],
  },
  {
    id: 'stat-card',
    name: 'StatCard',
    category: 'statistics',
    aspectRatio: 'both',
    description: 'Multi-metric glassmorphism statistics card with icon badge and secondary trending tag.',
    tags: ['stat-card', 'metrics', 'badge', 'card', 'trend'],
  },

  // ── Animated UI Mockups Suite ──
  {
    id: 'browser-window',
    name: 'BrowserWindow',
    category: 'ui-mockups',
    aspectRatio: 'both',
    description: 'macOS Chrome browser frame with traffic light controls, address bar, and canvas.',
    tags: ['browser', 'chrome', 'window', 'address-bar', 'macos'],
  },
  {
    id: 'mobile-mockup',
    name: 'MobileMockup',
    category: 'ui-mockups',
    aspectRatio: 'both',
    description: 'Smartphone device bezel with Dynamic Island notch, home bar, and 9:16 screen.',
    tags: ['mobile', 'iphone', 'smartphone', 'notch', 'mockup'],
  },
  {
    id: 'dashboard',
    name: 'Dashboard',
    category: 'ui-mockups',
    aspectRatio: 'both',
    description: 'SaaS analytics dashboard with multi-card metrics and live production badge.',
    tags: ['dashboard', 'saas', 'analytics', 'kpi', 'metrics'],
  },
  {
    id: 'code-editor',
    name: 'CodeEditor',
    category: 'ui-mockups',
    aspectRatio: 'both',
    description: 'Developer IDE window with file tabs, syntax highlighting, and line numbers.',
    tags: ['code-editor', 'ide', 'developer', 'syntax', 'typescript'],
  },
  {
    id: 'terminal',
    name: 'Terminal',
    category: 'ui-mockups',
    aspectRatio: 'both',
    description: 'Command line shell interface with prompt and staggered colored execution logs.',
    tags: ['terminal', 'bash', 'shell', 'cli', 'logs'],
  },
  {
    id: 'notification',
    name: 'Notification',
    category: 'ui-mockups',
    aspectRatio: 'both',
    description: 'Glassmorphism push notification toast with app icon, sender, and time badge.',
    tags: ['notification', 'toast', 'push', 'alert', 'pop-up'],
  },
  {
    id: 'chat-bubble',
    name: 'ChatBubble',
    category: 'ui-mockups',
    aspectRatio: 'both',
    description: 'Conversational chat bubbles (user prompt vs AI response) with timestamps.',
    tags: ['chat', 'bubble', 'imessage', 'whatsapp', 'conversation'],
  },
  {
    id: 'search-bar',
    name: 'SearchBar',
    category: 'ui-mockups',
    aspectRatio: 'both',
    description: 'Floating search bar pill with typewriter query animation and command shortcut.',
    tags: ['search-bar', 'typewriter', 'google', 'spotlight', 'query'],
  },
  {
    id: 'pricing-card',
    name: 'PricingCard',
    category: 'ui-mockups',
    aspectRatio: 'both',
    description: 'SaaS pricing tier card with popular badge, feature checklist, and CTA button.',
    tags: ['pricing', 'subscription', 'saas', 'tiers', 'plan'],
  },
  {
    id: 'login-form',
    name: 'LoginForm',
    category: 'ui-mockups',
    aspectRatio: 'both',
    description: 'Authentication login modal with email and password fields and submit button.',
    tags: ['login', 'auth', 'signin', 'modal', 'form'],
  },
  {
    id: 'cursor-point',
    name: 'CursorPoint',
    category: 'ui-mockups',
    aspectRatio: 'both',
    description: 'macOS pointer arrow cursor with animated movement, click ripple, and action tag.',
    tags: ['cursor', 'pointer', 'mouse', 'click', 'ripple'],
  },
  {
    id: 'tooltip',
    name: 'Tooltip',
    category: 'ui-mockups',
    aspectRatio: 'both',
    description: 'Contextual hover callout speech bubble with highlighted keyword tag.',
    tags: ['tooltip', 'callout', 'hover', 'badge', 'speech-bubble'],
  },

  // ── Animated Motion & VFX Suite ──
  {
    id: 'fade-transition',
    name: 'FadeTransition',
    category: 'motion',
    aspectRatio: 'both',
    description: 'Smooth opacity interpolation wrapper with customizable in/out durations and ease curves.',
    tags: ['fade', 'fade-in', 'fade-out', 'opacity', 'transition'],
  },
  {
    id: 'slide-transition',
    name: 'SlideTransition',
    category: 'motion',
    aspectRatio: 'both',
    description: 'Physics-based directional spring sliding wrapper (up, down, left, right) with overshoot damping.',
    tags: ['slide', 'slide-in', 'slide-out', 'spring', 'directional'],
  },
  {
    id: 'scale-transition',
    name: 'ScaleTransition',
    category: 'motion',
    aspectRatio: 'both',
    description: 'Elastic pop-in scaling transition with configurable bounce and spring stiffness.',
    tags: ['scale', 'scale-in', 'scale-out', 'pop', 'elastic'],
  },
  {
    id: 'rotate-animation',
    name: 'RotateAnimation',
    category: 'motion',
    aspectRatio: 'both',
    description: 'Continuous smooth spin rotation or spring settle rotation around customizable anchor points.',
    tags: ['rotate', 'spin', 'orientation', 'loop', 'angle'],
  },
  {
    id: 'spring-animation',
    name: 'SpringAnimation',
    category: 'motion',
    aspectRatio: 'both',
    description: 'Universal Remotion spring wrapper applying physics to translate, scale, and opacity simultaneously.',
    tags: ['spring', 'physics', 'damping', 'mass', 'stiffness'],
  },
  {
    id: 'stagger-animation',
    name: 'StaggerAnimation',
    category: 'motion',
    aspectRatio: 'both',
    description: 'Sequential cascade animation staggering arrays of child elements with millisecond delays.',
    tags: ['stagger', 'cascade', 'sequential', 'delay', 'batch'],
  },
  {
    id: 'reveal-animation',
    name: 'RevealAnimation',
    category: 'motion',
    aspectRatio: 'both',
    description: 'Cinematic curtain wipe reveal using progressive clip-path masks in any 4-way direction.',
    tags: ['reveal', 'curtain', 'wipe', 'clip-path', 'mask'],
  },
  {
    id: 'mask-reveal',
    name: 'MaskReveal',
    category: 'motion',
    aspectRatio: 'both',
    description: 'Advanced geometric mask reveals including circular iris zoom, diagonal wipe, and polygonal shapes.',
    tags: ['mask', 'iris', 'diagonal', 'circle', 'svg-mask'],
  },
  {
    id: 'typewriter',
    name: 'Typewriter',
    category: 'motion',
    aspectRatio: 'both',
    description: 'Word-by-word or character-by-character mechanical typewriter text reveal with blinking cursor.',
    tags: ['typewriter', 'typing', 'cursor', 'text-effect', 'characters'],
  },
  {
    id: 'word-highlight',
    name: 'WordHighlight',
    category: 'motion',
    aspectRatio: 'both',
    description: 'Organic fluorescent marker pen stroke highlight expanding behind key phrases.',
    tags: ['highlight', 'marker', 'callout', 'emphasis', 'text'],
  },
  {
    id: 'text-scramble',
    name: 'TextScramble',
    category: 'motion',
    aspectRatio: 'both',
    description: 'Matrix and cyberpunk style hacker decrypting glyph scramble resolving into final copy.',
    tags: ['scramble', 'matrix', 'decrypt', 'glitch', 'cyberpunk'],
  },
  {
    id: 'path-draw',
    name: 'PathDraw',
    category: 'motion',
    aspectRatio: 'both',
    description: 'Progressive SVG stroke outline drawing effect powered by strokeDasharray and strokeDashoffset.',
    tags: ['path-draw', 'svg-stroke', 'drawing', 'vector', 'line-art'],
  },
  {
    id: 'morph-animation',
    name: 'MorphAnimation',
    category: 'motion',
    aspectRatio: 'both',
    description: 'Smooth state morphing crossfade with synchronous scale, blur, and opacity interpolation.',
    tags: ['morph', 'state-change', 'crossfade', 'transform', 'interpolate'],
  },
  {
    id: 'parallax',
    name: 'Parallax',
    category: 'motion',
    aspectRatio: 'both',
    description: 'Multi-layer depth parallax wrapper simulating optical camera travel across foreground and background.',
    tags: ['parallax', 'depth', 'multi-layer', 'spatial', '3d-feel'],
  },
  {
    id: 'camera-zoom',
    name: 'CameraZoom',
    category: 'motion',
    aspectRatio: 'both',
    description: 'Ken Burns documentary continuous zoom or high-energy rapid punch-in pattern interrupt.',
    tags: ['camera-zoom', 'ken-burns', 'punch-in', 'pattern-interrupt', 'lens'],
  },
  {
    id: 'camera-pan',
    name: 'CameraPan',
    category: 'motion',
    aspectRatio: 'both',
    description: 'Cinematic horizontal and vertical camera panning drift across wide or tall canvases.',
    tags: ['camera-pan', 'camera-tilt', 'drift', 'travel', 'cinematic'],
  },

  // ── Media & Visual Suite ──
  {
    id: 'video-image',
    name: 'VideoImage',
    category: 'media',
    aspectRatio: 'both',
    description: 'High-retention video image showcase with Ken Burns zoom, glassmorphism border, and caption pill.',
    tags: ['image', 'ken-burns', 'photo', 'showcase', 'caption'],
  },
  {
    id: 'image-gallery',
    name: 'ImageGallery',
    category: 'media',
    aspectRatio: 'both',
    description: 'Multi-image grid, filmstrip, and staggered stack gallery with spring cascade entrance.',
    tags: ['image-gallery', 'grid', 'gallery', 'photos', 'filmstrip', 'stack'],
  },
  {
    id: 'video-player',
    name: 'VideoPlayer',
    category: 'media',
    aspectRatio: 'both',
    description: 'Programmatic video player wrapping OffthreadVideo with scrub progress bar, timecode, and bezel.',
    tags: ['video', 'player', 'offthread-video', 'playback', 'controls', 'scrubber'],
  },
  {
    id: 'background-video',
    name: 'BackgroundVideo',
    category: 'media',
    aspectRatio: 'both',
    description: 'Ambient looping video layer with dark vignette, blur, and color grading tint for subtitles.',
    tags: ['background-video', 'ambient', 'vignette', 'b-roll', 'color-grade'],
  },
  {
    id: 'audio-waveform',
    name: 'AudioWaveform',
    category: 'media',
    aspectRatio: 'both',
    description: 'Kinetic sound wave visualizer with harmonic oscillation bars and neon glow.',
    tags: ['audio-waveform', 'soundwave', 'audio', 'bars', 'voice'],
  },
  {
    id: 'spectrum-visualizer',
    name: 'SpectrumVisualizer',
    category: 'media',
    aspectRatio: 'both',
    description: 'Multi-band audio spectrum analyzer with linear frequency EQ and circular radial halo modes.',
    tags: ['spectrum', 'visualizer', 'frequency', 'equalizer', 'radial-audio'],
  },
  {
    id: 'avatar',
    name: 'Avatar',
    category: 'media',
    aspectRatio: 'both',
    description: 'Animated presenter avatar with reactive speaking soundwave rings, verified badge, and online status.',
    tags: ['avatar', 'presenter', 'speaker', 'creator', 'soundwave-ring'],
  },
  {
    id: 'map-pin',
    name: 'MapPin',
    category: 'media',
    aspectRatio: 'both',
    description: 'Vector map with latitude/longitude coordinate grid, bouncing location pin, and flight route line.',
    tags: ['map', 'location', 'pin', 'coordinates', 'flight-route'],
  },
  {
    id: 'screenshot',
    name: 'Screenshot',
    category: 'media',
    aspectRatio: 'both',
    description: 'SaaS screenshot showcase frame with 3D perspective tilt and spotlight magnifying zoom lens.',
    tags: ['screenshot', 'mockup', 'magnifying-lens', 'zoom-callout', 'perspective'],
  },
  {
    id: 'device-frame',
    name: 'DeviceFrame',
    category: 'media',
    aspectRatio: 'both',
    description: 'Photorealistic hardware frames for iPhone 16 Pro (Dynamic Island), MacBook Pro, iPad Pro & Apple Watch.',
    tags: ['device-frame', 'iphone-16', 'macbook', 'ipad', 'apple-watch', 'notch'],
  },
  {
    id: 'visual-background',
    name: 'VisualBackground',
    category: 'media',
    aspectRatio: 'both',
    description: 'Procedural video backdrop supporting mesh gradient orbs, blueprint grid, starfield, and spotlight.',
    tags: ['background', 'mesh-gradient', 'grid', 'starfield', 'spotlight'],
  },
  {
    id: 'texture',
    name: 'Texture',
    category: 'media',
    aspectRatio: 'both',
    description: 'Analog film grain, halftone dots, CRT retro scanlines, lens vignette, and paper fiber tactile depth.',
    tags: ['texture', 'film-grain', 'halftone', 'crt', 'scanlines', 'vignette', 'paper'],
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
