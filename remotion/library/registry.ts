/**
 * ITNAVIDEO REMOTION COMPONENT LIBRARY REGISTRY
 * ============================================================================
 * Central searchable catalog, metadata index, and categorization system
 * for all Remotion video components across Itnavideo studios.
 */

export type ComponentCategory =
  | 'jewelry-gems'
  | 'google-ecosystem'
  | 'workflow-productivity'
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
  | 'svg'
  | '3d-isometric'
  | 'scientific'
  | 'finance'
  | 'geography'
  | 'editorial'
  | 'mathematics'
  | 'engineering'
  | 'ecommerce'
  | 'vfx'
  | 'documentary'
  | 'presentation'
  | 'technology'
  | 'transportation'
  | 'psychology'
  | 'typography'
  | 'graphics'
  | 'infographics'
  | 'scenes'
  | 'motion-templates'
  | 'overlays'
  | 'compositing'
  | 'camera'
  | 'environment'
  | 'character'
  | 'storytelling-assets'
  | 'editing'
  | 'color'
  | 'advanced-vfx'
  | 'spreadsheet'
  | 'word'
  | 'outlook'
  | 'teams'
  | 'access'
  | 'power-bi'
  | 'google-workspace'
  | 'document-file';

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
  {
    id: 'node-graph',
    name: 'NodeGraph',
    category: 'network',
    aspectRatio: 'both',
    description: 'Autonomous agent topological cluster graph with floating halo nodes and connecting links.',
    tags: ['node-graph', 'agents', 'topology', 'mesh', 'clusters'],
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
    id: 'stat-card',
    name: 'StatCard',
    category: 'statistics',
    aspectRatio: 'both',
    description: 'Multi-metric glassmorphism statistics card with icon badge and secondary trending tag.',
    tags: ['stat-card', 'metrics', 'badge', 'card', 'trend'],
  },
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
    id: 'isometric-building',
    name: 'IsometricBuilding',
    category: '3d-isometric',
    aspectRatio: 'both',
    description: 'Multi-floor architectural isometric skyscraper / server rack with glowing windows and rooftop beacon.',
    tags: ['isometric', 'building', 'skyscraper', 'server-rack', 'architecture'],
  },
  {
    id: 'three-d-globe',
    name: 'ThreeDGlobe',
    category: '3d-isometric',
    aspectRatio: 'both',
    description: '3D rotating planetary wireframe globe with atmosphere halo, coordinate grid, and location markers.',
    tags: ['3d', 'globe', 'earth', 'world', 'atmosphere', 'locations'],
  },
  {
    id: 'three-d-device',
    name: 'ThreeDDevice',
    category: '3d-isometric',
    aspectRatio: 'both',
    description: '3D spatial device floating in real CSS perspective (iPhone, laptop) with specular glare and screen area.',
    tags: ['3d', 'device', 'phone', 'laptop', 'perspective', 'floating'],
  },
  {
    id: 'molecule-model',
    name: 'MoleculeModel',
    category: 'scientific',
    aspectRatio: 'both',
    description: '3D chemical molecular bond structure with atom spheres, covalent sticks, and continuous rotation.',
    tags: ['chemistry', 'molecule', 'atoms', 'bonds', 'science', 'stem'],
  },
  {
    id: 'atom-diagram',
    name: 'AtomDiagram',
    category: 'scientific',
    aspectRatio: 'both',
    description: 'Rutherford-Bohr atom model with multi-plane elliptical orbital rings and high-velocity electrons.',
    tags: ['physics', 'atom', 'bohr', 'electrons', 'nucleus', 'science'],
  },
  {
    id: 'dna-structure',
    name: 'DNAStructure',
    category: 'scientific',
    aspectRatio: 'both',
    description: '3D animated double helix with twisting nucleotide base pairs (A-T, C-G) and sequence readout.',
    tags: ['biology', 'dna', 'genetics', 'double-helix', 'nucleotides', 'stem'],
  },
  {
    id: 'human-anatomy',
    name: 'HumanAnatomy',
    category: 'scientific',
    aspectRatio: 'both',
    description: 'Medical human anatomy silhouette with pulsating cardiac rhythm, laser scan beam, and biometric tags.',
    tags: ['medicine', 'anatomy', 'biology', 'human-body', 'heart-rate', 'biometrics'],
  },
  {
    id: 'physics-diagram',
    name: 'PhysicsDiagram',
    category: 'scientific',
    aspectRatio: 'both',
    description: 'Mechanics and physics diagram generator: free-body force vectors, harmonic pendulum, and projectiles.',
    tags: ['physics', 'mechanics', 'forces', 'free-body', 'pendulum', 'vectors'],
  },
  {
    id: 'cell-diagram',
    name: 'CellDiagram',
    category: 'scientific',
    aspectRatio: 'both',
    description: 'Eukaryotic animal cell cross-section model with labeled organelles, lipid membrane, and floating cytoplasm.',
    tags: ['biology', 'cell', 'organelles', 'nucleus', 'mitochondria', 'stem'],
  },
  {
    id: 'circuit-diagram',
    name: 'CircuitDiagram',
    category: 'scientific',
    aspectRatio: 'both',
    description: 'Electrical engineering schematic with DC voltage source, load resistor, and animated current packets.',
    tags: ['electronics', 'circuit', 'schematic', 'ohms-law', 'engineering', 'stem'],
  },
  {
    id: 'stock-ticker',
    name: 'StockTicker',
    category: 'finance',
    aspectRatio: 'both',
    description: 'Continuous horizontal stock and crypto ticker tape with live price deltas and market status.',
    tags: ['finance', 'stocks', 'crypto', 'ticker', 'marquee', 'tape'],
  },
  {
    id: 'candlestick-chart',
    name: 'CandlestickChart',
    category: 'finance',
    aspectRatio: 'both',
    description: 'Financial candlestick chart with green/red wicks, MA-20 moving average line, and volume bars.',
    tags: ['finance', 'candlestick', 'trading', 'chart', 'stocks', 'crypto', 'volume'],
  },
  {
    id: 'trading-dashboard',
    name: 'TradingDashboard',
    category: 'finance',
    aspectRatio: 'both',
    description: 'High-frequency trading terminal UI with live order book, unrealized PnL, leverage, and buy/sell buttons.',
    tags: ['finance', 'trading', 'terminal', 'order-book', 'pnl', 'leverage'],
  },
  {
    id: 'portfolio-chart',
    name: 'PortfolioChart',
    category: 'finance',
    aspectRatio: 'both',
    description: 'Total net worth counter with multi-color SVG asset allocation donut ring and category breakdown.',
    tags: ['finance', 'portfolio', 'net-worth', 'wealth', 'asset-allocation', 'donut'],
  },
  {
    id: 'financial-report',
    name: 'FinancialReport',
    category: 'finance',
    aspectRatio: 'both',
    description: 'Executive quarterly earnings report card with revenue, EBITDA, net margin, and YoY growth benchmark.',
    tags: ['finance', 'earnings', 'revenue', 'ebitda', 'report', 'margin'],
  },
  {
    id: 'crypto-card',
    name: 'CryptoCard',
    category: 'finance',
    aspectRatio: 'both',
    description: 'Cryptocurrency token showcase card with live price, 24h change pill, mini vector sparkline, and market cap.',
    tags: ['crypto', 'bitcoin', 'token', 'sparkline', 'card', 'market-cap'],
  },
  {
    id: 'world-map',
    name: 'WorldMap',
    category: 'geography',
    aspectRatio: 'both',
    description: 'Global continental projection with active edge hub pings, flight cables, and network statistics.',
    tags: ['geography', 'world-map', 'globe', 'continents', 'pings', 'global'],
  },
  {
    id: 'country-map',
    name: 'CountryMap',
    category: 'geography',
    aspectRatio: 'both',
    description: 'Regional country spotlight map with administrative boundary outline, capital pin, and GDP stats.',
    tags: ['geography', 'country', 'nation', 'map', 'capital', 'demographics'],
  },
  {
    id: 'route-map',
    name: 'RouteMap',
    category: 'geography',
    aspectRatio: 'both',
    description: 'Great-circle flight and logistics route tracker with animated aircraft icon, distance, and waypoints.',
    tags: ['geography', 'flight', 'route', 'travel', 'transit', 'waypoints'],
  },
  {
    id: 'territory-map',
    name: 'TerritoryMap',
    category: 'geography',
    aspectRatio: 'both',
    description: 'Sales and operations territory coverage zones with market share percentages and regional HQs.',
    tags: ['geography', 'territory', 'market-share', 'zones', 'regions', 'sales'],
  },
  {
    id: 'newspaper',
    name: 'Newspaper',
    category: 'editorial',
    aspectRatio: 'both',
    description: 'Broadsheet print layout with masthead, serif drop-cap, photo frame, and animated marker highlight.',
    tags: ['editorial', 'newspaper', 'print', 'masthead', 'journalism', 'highlight'],
  },
  {
    id: 'magazine-layout',
    name: 'MagazineLayout',
    category: 'editorial',
    aspectRatio: 'both',
    description: 'High-fashion editorial magazine spread with full-bleed hero photo, serif typography, and pull quotes.',
    tags: ['editorial', 'magazine', 'fashion', 'spread', 'pull-quote', 'layout'],
  },
  {
    id: 'article-cards',
    name: 'ArticleCards',
    category: 'editorial',
    aspectRatio: 'both',
    description: 'Modern publication article cards with reading time pill, author avatar, thumbnail, and claps.',
    tags: ['editorial', 'articles', 'cards', 'medium', 'substack', 'reading-time'],
  },
  {
    id: 'quote-layout',
    name: 'QuoteLayout',
    category: 'editorial',
    aspectRatio: 'both',
    description: 'Dramatic pull quote composition with giant decorative serif quotation marks and author portrait avatar.',
    tags: ['editorial', 'quote', 'pull-quote', 'author', 'citation', 'wisdom'],
  },
  {
    id: 'headline-animation',
    name: 'HeadlineAnimation',
    category: 'editorial',
    aspectRatio: 'both',
    description: 'Kinetic typography headline presenter with staggered word reveals, marker highlight, and impact styling.',
    tags: ['editorial', 'headline', 'kinetic-typography', 'highlight', 'impact', 'title'],
  },
  {
    id: 'breaking-news-banner',
    name: 'BreakingNewsBanner',
    category: 'editorial',
    aspectRatio: 'both',
    description: 'Broadcast news lower-third banner with flashing live badge, location tag, and crawling ticker.',
    tags: ['editorial', 'breaking-news', 'broadcast', 'lower-third', 'news-ticker', 'crawler'],
  },
  {
    id: 'math-equation',
    name: 'MathEquation',
    category: 'mathematics',
    aspectRatio: 'both',
    description: 'Mathematical formula presenter with LaTeX typography, derivation stages, and focus boxes.',
    tags: ['math', 'equation', 'formula', 'latex', 'algebra', 'derivation'],
  },
  {
    id: 'graph-plotter',
    name: 'GraphPlotter',
    category: 'mathematics',
    aspectRatio: 'both',
    description: '2D Cartesian coordinate function graph plotter (sine, x², eˣ) with animated curve trace.',
    tags: ['math', 'graph', 'plotter', 'function', 'cartesian', 'calculus'],
  },
  {
    id: 'math-proof',
    name: 'MathProof',
    category: 'mathematics',
    aspectRatio: 'both',
    description: 'Formal theorem proof presenter with numbered deduction rows, justification lemmas, and Q.E.D.',
    tags: ['math', 'proof', 'theorem', 'deduction', 'qed', 'logic'],
  },
  {
    id: 'venn-diagram',
    name: 'VennDiagram',
    category: 'mathematics',
    aspectRatio: 'both',
    description: 'Set theory Venn diagram with intersecting shaded circles, labels, and cardinality counts.',
    tags: ['math', 'venn-diagram', 'sets', 'intersection', 'union', 'logic'],
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
