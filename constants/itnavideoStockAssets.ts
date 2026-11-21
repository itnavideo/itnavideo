export interface ItnaVideoStockAsset {
  id: string;
  title: string;
  category: 'all' | 'business' | 'tech' | 'workspace' | 'lifestyle';
  categoryLabel: string;
  url: string;
  style?: 'realistic' | '2d' | '3d';
  positiveTags?: string[];
  negativeTags?: string[];
}

export const S3_REMOTION_BASE_URL = 'https://remotionlambda-useast1-2zq6twaok1.s3.us-east-1.amazonaws.com';

export function toAbsoluteS3AssetUrl(url?: string): string {
  if (!url || typeof url !== 'string') return '';
  const trimmed = url.trim();
  if (!trimmed) return '';
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('data:')) {
    return trimmed;
  }
  const cleanPath = trimmed.replace(/^\/+/, '');
  // Decode each segment first to normalise already-%20-encoded paths (e.g. from assets.json),
  // then re-encode cleanly — this prevents double-encoding (%20 → %2520) on 2D asset filenames
  // that contain spaces. Realistic paths have no spaces so were never affected.
  const encodedPath = cleanPath
    .split('/')
    .map((segment) => encodeURIComponent(decodeURIComponent(segment)))
    .join('/');
  return `${S3_REMOTION_BASE_URL}/${encodedPath}`;
}

export function getAssetStyle(url: string): 'realistic' | '2d' | '3d' {
  if (!url) return 'realistic';
  if (url.includes('/images/2d/') || url.includes('/2d/')) return '2d';
  if (url.includes('/images/3d/') || url.includes('/3d/')) return '3d';
  return 'realistic';
}

export const ITNAVIDEO_STOCK_CATEGORIES = [
  { id: 'all', label: 'All Curated' },
  { id: 'business', label: 'Finance & Wealth' },
  { id: 'tech', label: 'Tech & AI' },
  { id: 'workspace', label: 'Workspace & Mindset' },
  { id: 'lifestyle', label: 'Lifestyle & Career' },
] as const;

export const RAW_ITNAVIDEO_STOCK_ASSETS: ItnaVideoStockAsset[] = [
  // ── Call To Action & YouTube Growth Overlay ──
  {
    id: 'ultra-premium-subscribe-bell',
    title: 'Ultra-Premium YouTube Subscribe + Bell Animation',
    category: 'tech',
    categoryLabel: 'Tech & AI',
    url: 'assets/reusable/widgets/subscribe-bell-asset.html',
    style: '3d',
    positiveTags: ['subscribe', 'bell', 'notification', 'youtube', 'call to action', 'cta', 'outro', 'follow', 'channel'],
  },
  {
    id: 'ali-abdaal-ai-prompt-window',
    title: 'macOS AI Master Prompt Window',
    category: 'tech',
    categoryLabel: 'Tech & AI',
    url: 'assets/reusable/widgets/prompt-window.html',
    style: '2d',
    positiveTags: ['ai prompt', 'prompt window', 'chatgpt', 'claude', 'terminal', 'life coach', 'macos', 'prompting', 'productivity'],
  },
  {
    id: 'ali-abdaal-life-pillars-deck',
    title: '4 Life Pillars Architecture Deck (Health, Wealth, Relationships, Growth)',
    category: 'workspace',
    categoryLabel: 'Workspace & Mindset',
    url: 'assets/reusable/widgets/life-pillars.html',
    style: '2d',
    positiveTags: ['life pillars', 'health wealth', 'productivity', 'habits', 'lifeos', 'framework', 'superfocus', 'notion'],
  },
  {
    id: 'ali-abdaal-leverage-ladder',
    title: 'Career & Wealth Leverage Ladder (Employment to Scalable Equity)',
    category: 'business',
    categoryLabel: 'Finance & Wealth',
    url: 'assets/reusable/widgets/leverage-ladder.html',
    style: '2d',
    positiveTags: ['leverage ladder', 'salary ceiling', 'freelancing', 'agency', 'skills', 'selling skills', 'wealth creation', 'income growth', 'career'],
  },
  {
    id: 'ali-abdaal-problem-audit-card',
    title: 'High-Ticket Problem Audit Card (Client ROI vs Raw Labor)',
    category: 'business',
    categoryLabel: 'Finance & Wealth',
    url: 'assets/reusable/widgets/problem-audit.html',
    style: '2d',
    positiveTags: ['problem list', 'expensive problems', 'client roi', 'high ticket', 'pricing', 'selling solutions', 'service business'],
  },
  {
    id: 'ali-abdaal-business-trinity',
    title: 'The 3-P Business Engine (Person, Problem, Product)',
    category: 'business',
    categoryLabel: 'Finance & Wealth',
    url: 'assets/reusable/widgets/business-trinity.html',
    style: '2d',
    positiveTags: ['3 ps', 'business trinity', 'person problem product', 'entrepreneurship', 'business school', 'how to get rich', 'startup framework', 'niche'],
  },
  {
    id: 'ali-abdaal-tier-list-board',
    title: 'S/A/B/C/D Tier List Ranking Board (Apps, Software, Systems)',
    category: 'tech',
    categoryLabel: 'Tech & AI',
    url: 'assets/reusable/widgets/tier-list.html',
    style: '2d',
    positiveTags: ['tier list', 'ranking', 'worst to best', 's tier', 'a tier', 'productivity tools', 'software review', 'comparison'],
  },
  {
    id: 'ali-abdaal-gap-analysis',
    title: 'Point A to Point B Gap Analysis Card (Daniel Priestley Sales Model)',
    category: 'business',
    categoryLabel: 'Finance & Wealth',
    url: 'assets/reusable/widgets/gap-analysis.html',
    style: '2d',
    positiveTags: ['gap analysis', 'point a to point b', 'daniel priestley', 'sales training', 'solution bridge', 'cost of inaction', 'consulting'],
  },
  {
    id: 'ali-abdaal-five-year-horizon',
    title: '5-Year Life Horizon Architecture Card (Family, Health, Business)',
    category: 'workspace',
    categoryLabel: 'Workspace & Mindset',
    url: 'assets/reusable/widgets/five-year-horizon.html',
    style: '2d',
    positiveTags: ['5 year plan', 'life update', 'horizon', 'vision', 'fatherhood', 'health longevity', 'lifestyle business', 'superfocus'],
  },
  {
    id: 'ali-abdaal-motion-plate-showcase',
    title: 'Programmatic Remotion Motion Plate (SaaS & Feature Launch Card)',
    category: 'tech',
    categoryLabel: 'Tech & AI',
    url: 'assets/reusable/widgets/motion-plate.html',
    style: '2d',
    positiveTags: ['motion plate', 'remotion', 'automated editing', 'saas showcase', 'product launch', 'claude code', 'feature bullets'],
  },
  {
    id: 'ali-abdaal-life-seasons',
    title: 'Seasons of Life Focus Framework Card (Building, Recovery, Presence)',
    category: 'workspace',
    categoryLabel: 'Workspace & Mindset',
    url: 'assets/reusable/widgets/life-seasons.html',
    style: '2d',
    positiveTags: ['seasons of life', 'productivity advice', 'burnout recovery', 'hustle trap', 'focus priority', 'deep work', 'essentialism'],
  },
  {
    id: 'ali-abdaal-feynman-technique',
    title: 'The 4-Step Feynman Technique Framework (Accelerated Meta-Learning)',
    category: 'workspace',
    categoryLabel: 'Workspace & Mindset',
    url: 'assets/reusable/widgets/feynman-technique.html',
    style: '2d',
    positiveTags: ['feynman technique', 'meta learning', 'how to learn fast', 'active recall', 'spaced repetition', 'study skills', 'simplification'],
  },
  {
    id: 'ali-abdaal-knowledge-roi-ladder',
    title: 'The Knowledge ROI Ladder (Free Info vs Paid Mentorship vs Masterminds)',
    category: 'business',
    categoryLabel: 'Finance & Wealth',
    url: 'assets/reusable/widgets/knowledge-roi.html',
    style: '2d',
    positiveTags: ['knowledge roi', 'business advice', 'mentorship', 'mastermind', 'taki moore', 'consulting', 'proximity effect', 'coaching'],
  },
  {
    id: 'ali-abdaal-vision-action-matrix',
    title: '2x2 Ambition vs Action Matrix (Drifter, Dreamer, Hamster, Master)',
    category: 'workspace',
    categoryLabel: 'Workspace & Mindset',
    url: 'assets/reusable/widgets/vision-action-matrix.html',
    style: '2d',
    positiveTags: ['vision action matrix', 'ambitious but stuck', 'the dreamer', 'the master', 'gps framework', 'productivity matrix', 'unstick'],
  },
  {
    id: 'ali-abdaal-creator-iceberg',
    title: 'The Creator Business Iceberg (Surface YouTube vs Deep Engine)',
    category: 'business',
    categoryLabel: 'Finance & Wealth',
    url: 'assets/reusable/widgets/creator-iceberg.html',
    style: '2d',
    positiveTags: ['creator iceberg', 'what i actually do', 'behind the scenes', 'lifestyle business academy', 'superfocus', 'backend revenue', 'creator economy'],
  },
  {
    id: 'ali-abdaal-one-thousand-ladder',
    title: 'The 1K Income Ladder ($1 -> $10 -> $100 -> $1,000 Online)',
    category: 'business',
    categoryLabel: 'Finance & Wealth',
    url: 'assets/reusable/widgets/one-thousand-ladder.html',
    style: '2d',
    positiveTags: ['1k ladder', 'first 1000 online', 'pre sell', 'kickstarter method', 'price vs people', 'digital product', 'gumroad stripe'],
  },
  {
    id: 'ali-abdaal-anti-vision-framework',
    title: 'The Anti-Vision vs The Vision Framework (Inversion Method)',
    category: 'workspace',
    categoryLabel: 'Workspace & Mindset',
    url: 'assets/reusable/widgets/anti-vision.html',
    style: '2d',
    positiveTags: ['anti vision', 'what to do with your life', 'inversion principle', 'goals', 'ideal ordinary week', 'anti goals', 'lifestyle design'],
  },
  {
    id: 'ali-abdaal-ai-skills-trio',
    title: '3 Core Human Skills in the Age of AI (AI Workflows, Revenue Proximity, Personal Brand)',
    category: 'business',
    categoryLabel: 'Finance & Wealth',
    url: 'assets/reusable/widgets/ai-skills-trio.html',
    style: '2d',
    positiveTags: ['ai skills', 'skills in age of ai', 'revenue proximity', 'personal brand', 'the ai operator', 'distribution moat', 'sales skills', 'career moat', 'future proof'],
  },
  {
    id: 'ali-abdaal-side-hustle-runway',
    title: '4-Phase Side-Hustle Creator Runway ($98 to $835k Exit Blueprint)',
    category: 'business',
    categoryLabel: 'Finance & Wealth',
    url: 'assets/reusable/widgets/side-hustle-runway.html',
    style: '2d',
    positiveTags: ['side hustle', 'make money youtube', 'jeff su', 'quit day job', 'notion command center', 'let products come to you', 'runway', 'quit date', 'creator business'],
  },
  {
    id: 'ali-abdaal-index-investing-model',
    title: 'The Beginner Index Investing Model (Inflation Decay vs Compounding S&P 500 Basket)',
    category: 'business',
    categoryLabel: 'Finance & Wealth',
    url: 'assets/reusable/widgets/index-investing.html',
    style: '2d',
    positiveTags: ['investing', 'index funds', 'sp500', 'start with 0', 'inflation vs compounding', 'dca', 'passive investing', 'wealth building', 'stocks'],
  },
  {
    id: 'ali-abdaal-agentic-flywheel',
    title: 'The Agentic AI Coding Flywheel (Claude Code Terminal vs Passive Web Chat)',
    category: 'tech',
    categoryLabel: 'Tech & AI',
    url: 'assets/reusable/widgets/agentic-flywheel.html',
    style: '2d',
    positiveTags: ['claude code', 'agentic ai', 'coding agent', 'anthropic', 'flywheel', 'developer workflow', 'terminal', 'mcp servers', 'ai engineer'],
  },
  {
    id: 'ali-abdaal-life-systems-deck',
    title: 'The 5-Pillar Life Systems Architecture (Direction, Time, Health, Relationships, Finance)',
    category: 'workspace',
    categoryLabel: 'Workspace & Mindset',
    url: 'assets/reusable/widgets/life-systems.html',
    style: '2d',
    positiveTags: ['life systems', 'success is hard', 'never go to zero', 'systems beat motivation', 'habits', 'routines', 'life os', 'productivity framework'],
  },
  {
    id: 'superwall-conversion-funnel-psychology',
    title: 'The 500M Download Conversion Blueprint (Vanity Views vs Real Conversions, Main Character Rule)',
    category: 'business',
    categoryLabel: 'Finance & Wealth',
    url: 'assets/reusable/widgets/conversion-funnel.html',
    style: '2d',
    positiveTags: ['superwall', 'app downloads', 'paywall psychology', 'conversion rate', 'vanity metrics', 'content market fit', 'main character rule', 'onboarding funnel'],
  },
  {
    id: 'premium-asset-showcase-container',
    title: 'High-Perception User Asset Showcase (macOS Browser, Mobile App Mockup, 3D Perspective)',
    category: 'tech',
    categoryLabel: 'Tech & AI',
    url: 'assets/reusable/widgets/premium-asset-showcase.html',
    style: '2d',
    positiveTags: ['user asset', 'screenshot showcase', 'device mockup', 'browser frame', 'mobile mockup', 'screen recording', 'premium ecommerce', 'learn with shopify', 'ken burns'],
  },
  {
    id: 'sharran-financial-freedom-milestones',
    title: 'The 5 True Financial Freedom Milestones (Margin Gap, Multi-Bucket Distribution, Wealth Assets)',
    category: 'business',
    categoryLabel: 'Finance & Wealth',
    url: 'assets/reusable/widgets/financial-milestones.html',
    style: '2d',
    positiveTags: ['sharran srivatsaa', 'financial freedom', 'money milestones', 'multi bucket', 'cash management', 'wealth creation', 'lifestyle creep', 'passive cashflow'],
  },
  {
    id: 'zero-balance-bank-comparison-scorecard',
    title: 'Zero Balance Bank Account Comparison Scorecard (Interest Rates, Virtual Cards, Hidden Fees)',
    category: 'business',
    categoryLabel: 'Finance & Wealth',
    url: 'assets/reusable/widgets/bank-comparison.html',
    style: '2d',
    positiveTags: ['bank comparison', 'zero balance account', 'kotak 811', 'au small finance', 'jupiter', 'savings interest', 'debit card charges', 'video kyc', 'fintech review'],
  },
  {
    id: 'payday-salary-wealth-protocol',
    title: 'Salary Day 5-Step Wealth Protocol (Emergency Fund, Debt Clearance, Direct SIP, Gold ETF, Term Insurance)',
    category: 'business',
    categoryLabel: 'Finance & Wealth',
    url: 'assets/reusable/widgets/payday-salary-protocol.html',
    style: '2d',
    positiveTags: ['salary day', 'personal finance', 'emergency fund', 'direct mutual fund', 'sip', 'gold etf', 'term insurance', 'pay yourself first', 'hindi finance'],
  },
  {
    id: 'real-estate-vs-equity-matrix',
    title: 'Real Estate vs Mutual Funds Ground Reality Matrix (Liquidity Trap, Entry Size, Kabza Risk, CAGR)',
    category: 'business',
    categoryLabel: 'Finance & Wealth',
    url: 'assets/reusable/widgets/real-estate-vs-equity.html',
    style: '2d',
    positiveTags: ['real estate', 'zameen', 'land investing', 'mutual funds', 'liquidity', 'kabza risk', 'stamp duty', 'cagr returns', 'property disputes', 'xy axis education'],
  },
  {
    id: 'bekifaayati-loan-app-comparison-matrix',
    title: 'Best Instant Loan Apps Comparison Matrix (Navi, KreditBee, LazyPay, mPokket, APR Audit)',
    category: 'business',
    categoryLabel: 'Finance & Wealth',
    url: 'assets/reusable/widgets/loan-app-comparison.html',
    style: '2d',
    positiveTags: ['instant loan app', 'loan without income proof', 'personal loan', 'fast approval', 'navi loan', 'kreditbee', 'lazypay', 'mpokket', 'nbfc', 'rbi loan app', 'effective apr', 'bekifaayati'],
  },
  {
    id: 'rahul-malodia-fund-case-study-decision',
    title: 'Mutual Fund Case Study & SIP Decision Framework (Winner Era vs Headwinds, Inflow Trap)',
    category: 'business',
    categoryLabel: 'Finance & Wealth',
    url: 'assets/reusable/widgets/fund-case-study.html',
    style: '2d',
    positiveTags: ['mutual fund', 'parag parikh', 'flexi cap', 'sip decision', 'winner ya loser', 'rahul malodia', 'case study', 'downside protection', 'us tech stocks', 'inflow trap', 'value investing'],
  },
  {
    id: 'jio-ipo-valuation-review-matrix',
    title: 'Mega IPO Valuation & Review Scorecard (Reliance Jio ₹10 Lakh Cr, 53 Cr Users, Moat vs Capex)',
    category: 'business',
    categoryLabel: 'Finance & Wealth',
    url: 'assets/reusable/widgets/ipo-valuation-review.html',
    style: '2d',
    positiveTags: ['jio ipo', 'ipo review', 'valuation', 'reliance jio', '10 lakh crore', 'mukesh ambani', 'telecom duopoly', 'arpu hike', 'listing gains', 'long term investment', 'rahul malodia'],
  },
  {
    id: 'ambani-jio-disruption-playbook',
    title: '4-Stage Zero-Dollar Market Disruption Playbook (Mukesh Ambani Jio Masterstroke, Free Data Habit)',
    category: 'business',
    categoryLabel: 'Finance & Wealth',
    url: 'assets/reusable/widgets/disruption-playbook.html',
    style: '2d',
    positiveTags: ['jio case study', 'mukesh ambani', 'masterstroke', 'business strategy', 'disruption playbook', 'zero dollar marketing', 'jiophone', 'habit formation', 'unit economics', 'rahul malodia'],
  },
  {
    id: 'zee-subhash-chandra-debt-spiral',
    title: 'Corporate Debt & Share Pledging Death Spiral (Zee Entertainment & Essel Group, 42% to <4% Holding)',
    category: 'business',
    categoryLabel: 'Finance & Wealth',
    url: 'assets/reusable/widgets/debt-spiral.html',
    style: '2d',
    positiveTags: ['zee case study', 'subhash chandra', 'debt crisis', 'share pledging', 'alm mismatch', 'ilfs crisis', 'margin call', 'essel group', 'loss of control', 'rahul malodia'],
  },
  {
    id: 'sahar-yousef-chronotype-sleep-matrix',
    title: 'Circadian Biology & Chronotype Matrix (Dr. Sahar Yousef, 5 AM Scam, Sleep Debt)',
    category: 'workspace',
    categoryLabel: 'Workspace & Mindset',
    url: 'assets/reusable/widgets/chronotype-sleep-matrix.html',
    style: '2d',
    positiveTags: ['chronotypes', 'sahar yousef', 'sleep science', '5 am club', 'circadian rhythm', 'morning routine', 'sleep debt', 'lions bears wolves', 'productivity', 'neuroscience'],
  },
  {
    id: 'sahar-yousef-digital-ghost-psychology',
    title: 'The Psychology of the Digital Ghost (Non-Posters, Recovered Working Memory, Dopamine Immunity)',
    category: 'workspace',
    categoryLabel: 'Workspace & Mindset',
    url: 'assets/reusable/widgets/digital-ghost-psychology.html',
    style: '2d',
    positiveTags: ['digital ghost', 'never post social media', 'sahar yousef', 'psychology of non posters', 'ghost audience', 'dopamine casino', 'deep work', 'mental sovereignty', 'attention'],
  },
  {
    id: 'sahar-yousef-focus-restoration-protocol',
    title: 'Why You Cant Focus & 6 Science-Backed Fixes (Dr. Sahar Yousef, Grayscale, MITs, Focus Sprints)',
    category: 'workspace',
    categoryLabel: 'Workspace & Mindset',
    url: 'assets/reusable/widgets/neuro-focus-protocol.html',
    style: '2d',
    positiveTags: ['focus', 'cant focus anymore', 'sahar yousef', 'neuroscience', 'grayscale phone', 'phone parking lot', 'mits vs lits', 'single tasking', 'focus sprints', 'attention residue', 'screen bouncing'],
  },
  {
    id: 'sahar-yousef-anti-doomscroll-reset',
    title: 'Anti-Doomscroll Pattern Interrupt (Dr. Sahar Yousef, Physiological Sigh, DMN Recovery)',
    category: 'workspace',
    categoryLabel: 'Workspace & Mindset',
    url: 'assets/reusable/widgets/cognitive-pattern-interrupt.html',
    style: '2d',
    positiveTags: ['doomscrolling', 'pattern interrupt', 'sahar yousef', 'mental reset', 'burnout', 'physiological sigh', 'default mode network', 'digital pacifier', 'anxiety relief', 'neuroscience'],
  },
  {
    id: 'daniel-priestley-million-dollar-business-engine',
    title: 'Daniel Priestley 7-Figure Business Engine (LAPS Pipeline Velocity, 3-Tier Media Funnel, Allowable CAC)',
    category: 'business',
    categoryLabel: 'Finance & Wealth',
    url: 'assets/reusable/widgets/priestley-business-engine.html',
    style: '2d',
    positiveTags: ['daniel priestley', '1m business', 'million dollar business', 'laps', 'leads appointments presentations sales', 'oversubscribed', 'key person of influence', 'scoreapp', 'allowable cac', 'short form long form lead form', '3-tier funnel', 'weekly cadence'],
  },
  {
    id: 'daniel-priestley-microeconomics-pricing-power',
    title: 'Daniel Priestley Microeconomics & Pricing Power (Price Maker vs Price Taker, 5 Micro Laws, Steinmetz Principle)',
    category: 'business',
    categoryLabel: 'Finance & Wealth',
    url: 'assets/reusable/widgets/priestley-microeconomics.html',
    style: '2d',
    positiveTags: ['microeconomics', 'daniel priestley', 'price maker', 'price taker', 'pricing power', '5 laws of microeconomics', 'demand and supply', 'oversubscribed', 'steinmetz screw', 'value based pricing', 'sell utility not effort', 'campaigns'],
  },
  {
    id: 'daniel-priestley-business-exit-playbook',
    title: 'Daniel Priestley Business Exit Playbook (M&A Valuation, 24 Assets, 100-Day Sabbatical, Bidding War, Deal Pie)',
    category: 'business',
    categoryLabel: 'Finance & Wealth',
    url: 'assets/reusable/widgets/priestley-exit-playbook.html',
    style: '2d',
    positiveTags: ['exit playbook', 'daniel priestley', 'sell business', 'm&a', 'valuation multiplier', 'ebitda', '24 assets', '100 day sabbatical', 'bidding war', 'deal pie', 'walkaway power', 'batna', 'founder decoupling'],
  },
  {
    id: 'daniel-priestley-billionaire-leverage-playbook',
    title: 'Daniel Priestley Top 0.01% Billionaire Playbook (Luck Surface Area, Equity Currency, Beethoven Talent, Common Enemy)',
    category: 'business',
    categoryLabel: 'Finance & Wealth',
    url: 'assets/reusable/widgets/priestley-billionaire-playbook.html',
    style: '2d',
    positiveTags: ['top 0.01%', 'billionaire mindset', 'daniel priestley', 'luck surface area', 'invent your own currency', 'equity as money', 'recruit beethovens', 'create an enemy', 'asymmetric leverage', 'reverse engineered future'],
  },
  {
    id: 'daniel-priestley-seven-founder-habits',
    title: 'Daniel Priestley 7 Habits of $1M Founders (Perfect Repeatable Week, Early Team, 90-Day Retreat, Daily Lead Gen, Bookending)',
    category: 'business',
    categoryLabel: 'Finance & Wealth',
    url: 'assets/reusable/widgets/priestley-founder-habits.html',
    style: '2d',
    positiveTags: ['founder habits', 'daniel priestley', 'perfect repeatable week', 'enroll a team early', 'quarterly retreat', 'daily lead gen', 'bookend your week', 'intro workshop', 'environment dictates performance', 'operational rhythm', '1m business habits'],
  },
  {
    id: 'daniel-priestley-token-economics-human-moats',
    title: 'Daniel Priestley Token Economics & 4 Human Moats ($80 Knowledge Worker, Speed to Value, Trust, Curation, Liability)',
    category: 'business',
    categoryLabel: 'Finance & Wealth',
    url: 'assets/reusable/widgets/priestley-token-economics.html',
    style: '2d',
    positiveTags: ['token economics', 'daniel priestley', 'human moats', 'speed to value', 'ai knowledge worker', 'trust and intimacy', 'taste and curation', 'skin in the game', 'audience distribution', 'stop selling time', 'tractor parable'],
  },
  {
    id: 'jason-lee-interactive-mobile-animation-stack',
    title: 'Jason Lee Interactive Mobile Animation Stack (Claude Fable, Rive State Machine, Expo React Native, Gamification Mascot)',
    category: 'business',
    categoryLabel: 'Tech & AI',
    url: 'assets/reusable/widgets/jason-lee-animation-stack.html',
    style: '2d',
    positiveTags: ['jason lee', 'mobile app animation', 'rive', 'rive animation', 'fable', 'claude code', 'vibe coding', 'expo', 'react native', 'gamification mascot', 'duolingo effect', 'focuspup', 'state machine'],
  },
  {
    id: 'jason-lee-ai-model-benchmark-matrix',
    title: 'Jason Lee AI Model Benchmark Matrix (Claude Fable 5.2 vs Opus 5.5, Vibe Coding, UI Aesthetics vs State Reducers)',
    category: 'business',
    categoryLabel: 'Tech & AI',
    url: 'assets/reusable/widgets/jason-lee-ai-model-benchmark.html',
    style: '2d',
    positiveTags: ['jason lee', 'fable 5.2', 'opus 5.5', 'claude code', 'vibe coding', 'ai benchmark', 'saas redesign', 'canva clone', 'remotion motion graphics', 'hybrid router', 'nested sessions'],
  },
  {
    id: 'jason-lee-viral-micro-app-playbook',
    title: 'Jason Lee $100K/Mo Solo Founder Micro-App Playbook (GoTall, Cal AI, BePresent, Umax, Agapé, TikTok Loops)',
    category: 'business',
    categoryLabel: 'Tech & AI',
    url: 'assets/reusable/widgets/jason-lee-micro-apps.html',
    style: '2d',
    positiveTags: ['jason lee', 'micro apps', 'solo founder', '100k mrr', 'gotall', 'cal ai', 'bepresent', 'umax', 'agape', 'app store paywall', 'tiktok ugc loop', 'base44', 'vibe coding'],
  },
  {
    id: 'jason-lee-claude-desktop-ecosystem',
    title: 'Jason Lee Claude 2.0 Desktop Ecosystem (Nested Sessions, /rewind Checkpoint, iOS Simulator, MCP Connectors, Claude Motion)',
    category: 'business',
    categoryLabel: 'Tech & AI',
    url: 'assets/reusable/widgets/jason-lee-claude-desktop.html',
    style: '2d',
    positiveTags: ['jason lee', 'claude 2.0', 'claude desktop', 'nested sessions', 'rewind', 'claude motion', 'mcp connectors', 'ios simulator', 'auto continue', 'vibe coding 2.0', 'agentic architecture'],
  },
  {
    id: 'itnavideo-3d-svg-extrusion-showcase',
    title: 'Itnavideo 3D Extruded SVG & Kinetic Depth Showcase (Three.js Compatible, Beveled Edges, Specular Lighting, 3D Orbit)',
    category: 'business',
    categoryLabel: 'Tech & AI',
    url: 'assets/reusable/widgets/3d-svg-extrusion.html',
    style: '3d',
    positiveTags: ['3d svg', 'threejs', '3d extrusion', 'beveled lighting', '3d coin', '3d shield', '3d device', '3d motion graphics', 'isometric depth', 'specular sheen', 'webgl motion'],
  },

  // Low Money / Debt / Financial Constraints
  {
    id: 'empty-wallet-little-money',
    title: 'Empty Wallet with Few Coins',
    category: 'business',
    categoryLabel: 'Finance & Wealth',
    url: '/assets/reusable/images/2d/Doordash Driver very low earningst.png',
    positiveTags: [
      'little money', 'very little money', 'low money', 'empty wallet', 'broke',
      'poor', 'poverty', 'few coins', 'no money', 'low income', 'struggling',
      'tight budget', 'savings exhausted', 'scarcity', 'hard times', 'living paycheck'
    ],
    negativeTags: ['rich', 'wealth', 'millionaire', 'huge profit', 'abundance', 'luxury', 'cash pile']
  },
  {
    id: 'rising-debt-financial-stress',
    title: 'Rising Debt and Financial Stress',
    category: 'business',
    categoryLabel: 'Finance & Wealth',
    url: '/assets/reusable/images/2d/credit card debt.png',
    positiveTags: [
      'debt', 'rising debt', 'loans', 'credit card debt', 'interest rates',
      'owe money', 'financial burden', 'stress', 'crisis', 'bills piling up'
    ],
    negativeTags: ['wealth', 'rich', 'cash abundance', 'millionaire']
  },
  {
    id: 'erasing-debt-budget-relief',
    title: 'Erasing Debt and Financial Freedom',
    category: 'business',
    categoryLabel: 'Finance & Wealth',
    url: '/assets/reusable/images/2d/financial freedom.png',
    positiveTags: [
      'erase debt', 'pay off debt', 'debt relief', 'clearing loans', 'freedom',
      'budget solution', 'fix credit', 'eliminating debt', 'clean slate'
    ],
    negativeTags: ['luxury', 'millionaire', 'dollar pile']
  },
  {
    id: 'credit-cards-debt-spending',
    title: 'Credit Cards and Spending Habits',
    category: 'business',
    categoryLabel: 'Finance & Wealth',
    url: '/assets/reusable/images/2d/credit card debt.png',
    positiveTags: [
      'credit card', 'credit cards', 'swiping', 'spending', 'shopping expenses',
      'impulse buying', 'consumer debt', 'interest rate', 'banking'
    ],
    negativeTags: []
  },
  {
    id: 'monthly-budget-calculator',
    title: 'Monthly Budget Planning & Calculator',
    category: 'business',
    categoryLabel: 'Finance & Wealth',
    url: '/assets/reusable/images/2d/budgeting.png',
    positiveTags: [
      'budget', 'monthly budget', 'calculator', 'planning', 'track expenses',
      'managing money', 'financial discipline', 'accounting', 'cost cutting'
    ],
    negativeTags: ['millionaire', 'luxury', 'cash pile']
  },
  {
    id: 'salary-calculation-income-management',
    title: 'Salary Calculation and Income Management',
    category: 'business',
    categoryLabel: 'Finance & Wealth',
    url: '/assets/reusable/images/2d/how to make extra income.png',
    positiveTags: [
      'salary', 'paycheck', 'income', 'earnings', 'monthly salary',
      'compensation', 'wage', 'net income', 'income stream'
    ],
    negativeTags: []
  },
  {
    id: 'person-calculating-budget-laptop',
    title: 'Financial Analysis on Laptop',
    category: 'business',
    categoryLabel: 'Finance & Wealth',
    url: '/assets/reusable/images/2d/budgeting.png',
    positiveTags: [
      'calculating', 'financial numbers', 'spreadsheet', 'laptop analysis',
      'reviewing finances', 'financial review', 'math', 'taxes'
    ],
    negativeTags: []
  },
  {
    id: 'budgeting-money-taking-notes',
    title: 'Strategic Budgeting & Taking Notes',
    category: 'workspace',
    categoryLabel: 'Workspace & Mindset',
    url: '/assets/reusable/images/2d/young man saving money.png',
    positiveTags: [
      'budgeting notes', 'taking notes', 'money rules', 'financial habits',
      'planning ahead', 'goal setting', 'journaling finances', 'smart habits'
    ],
    negativeTags: []
  },

  // Wealth & Abundance
  {
    id: 'stack-of-hundred-dollar-bills',
    title: 'Stack of Hundred Dollar Bills',
    category: 'business',
    categoryLabel: 'Finance & Wealth',
    url: '/assets/reusable/images/2d/Doordash Delivery Driver Celebrates Earnings.png',
    positiveTags: [
      'hundred dollar bills', 'cash stack', 'money', 'rich', 'wealth',
      'large sums', 'profit', 'fortune', 'millionaire', 'big revenue',
      'financial abundance', 'cash flow', 'high net worth'
    ],
    negativeTags: ['little money', 'very little money', 'low money', 'empty wallet', 'broke', 'poor', 'poverty', 'few coins', 'debt']
  },
  {
    id: 'massive-dollar-pile-wealth',
    title: 'Massive Dollar Pile and Wealth',
    category: 'business',
    categoryLabel: 'Finance & Wealth',
    url: '/assets/reusable/images/2d/Doordash Delivery Driver Celebrates Earnings.png',
    positiveTags: [
      'massive money', 'huge cash', 'dollar pile', 'wealthy', 'billionaire',
      'excess money', 'enormous wealth', 'jackpot', 'massive profit'
    ],
    negativeTags: ['little money', 'very little money', 'low money', 'empty wallet', 'broke', 'poor', 'poverty', 'few coins', 'debt']
  },
  {
    id: 'gold-dollar-cash-stacks',
    title: 'Gold and Cash Wealth Stacks',
    category: 'business',
    categoryLabel: 'Finance & Wealth',
    url: '/assets/reusable/images/2d/Doordash Delivery Driver Celebrates Earnings.png',
    positiveTags: [
      'gold and cash', 'precious assets', 'wealth reserves', 'gold coins',
      'high value', 'luxury investment', 'solid assets', 'treasure'
    ],
    negativeTags: ['little money', 'very little money', 'low money', 'empty wallet', 'broke', 'poor', 'poverty', 'few coins', 'debt']
  },
  {
    id: 'one-hundred-dollar-bill-front',
    title: 'Close-up of Hundred Dollar Bill',
    category: 'business',
    categoryLabel: 'Finance & Wealth',
    url: '/assets/reusable/images/2d/Doordash Delivery Driver Celebrates Earnings.png',
    positiveTags: [
      'hundred dollar bill', 'us dollar', 'currency', 'cash', 'money value',
      'dollar banknote', 'federal reserve', 'legal tender'
    ],
    negativeTags: ['little money', 'very little money', 'poor', 'poverty', 'broke', 'empty wallet']
  },

  // Growth, Capital & Investing
  {
    id: 'hand-stacking-wealth-coins',
    title: 'Hand Stacking Wealth Coins',
    category: 'business',
    categoryLabel: 'Finance & Wealth',
    url: '/assets/reusable/images/2d/young man saving money.png',
    positiveTags: [
      'stacking coins', 'step by step', 'accumulating wealth', 'saving coins',
      'compound growth', 'building wealth', 'patience', 'incremental growth'
    ],
    negativeTags: ['overnight rich', 'massive pile']
  },
  {
    id: 'hands-cupping-growing-money-plant',
    title: 'Cupping Growing Money Plant',
    category: 'business',
    categoryLabel: 'Finance & Wealth',
    url: '/assets/reusable/images/2d/investing for beginners.png',
    positiveTags: [
      'growing money', 'money plant', 'investing early', 'nurturing wealth',
      'sustainable finance', 'growth mindset', 'financial seedling', 'long term investing'
    ],
    negativeTags: ['debt', 'broke', 'loss', 'poverty']
  },
  {
    id: 'investing-future-growth-money',
    title: 'Investing in Future Capital Growth',
    category: 'business',
    categoryLabel: 'Finance & Wealth',
    url: '/assets/reusable/images/2d/building an emergency fund.png',
    positiveTags: [
      'investing', 'future growth', 'capital gains', 'portfolio', 'roi',
      'wealth creation', 'investment strategy', 'returns'
    ],
    negativeTags: ['debt', 'loss', 'broke', 'poverty']
  },
  {
    id: 'income-growth-chart-drawing',
    title: 'Income Growth Chart and Analytics',
    category: 'business',
    categoryLabel: 'Finance & Wealth',
    url: '/assets/reusable/images/2d/financial freedom.png',
    positiveTags: [
      'growth chart', 'upward trend', 'increasing income', 'revenue growth',
      'exponential curve', 'analytics', 'rising profits', 'performance'
    ],
    negativeTags: ['loss', 'decline', 'crash']
  },
  {
    id: 'financial-planning-collaboration',
    title: 'Financial Planning & Strategy Collaboration',
    category: 'business',
    categoryLabel: 'Finance & Wealth',
    url: '/assets/reusable/images/2d/retirement planning.png',
    positiveTags: [
      'financial planning', 'advisor', 'consulting', 'collaboration', 'strategy meeting',
      'team discussion', 'wealth advisor', 'partnership'
    ],
    negativeTags: []
  },
  {
    id: 'real-estate-property-investment',
    title: 'Real Estate Property Investment',
    category: 'business',
    categoryLabel: 'Finance & Wealth',
    url: '/assets/reusable/images/2d/mortgage and home buying.png',
    positiveTags: [
      'real estate', 'property', 'housing investment', 'home buying',
      'land', 'mortgage', 'rental property', 'passive income real estate'
    ],
    negativeTags: []
  },
  {
    id: 'stock-market-analytics-dashboard',
    title: 'Stock Market Analytics Chart',
    category: 'business',
    categoryLabel: 'Finance & Wealth',
    url: '/assets/reusable/images/2d/investing for beginners.png',
    positiveTags: [
      'stock market', 'trading chart', 'candlestick', 'wall street',
      'shares', 'market index', 'nasdaq', 'crypto market'
    ],
    negativeTags: []
  },

  // Tech, AI & Software
  {
    id: 'ai-engineer-night-work',
    title: 'AI Engineer Deep Coding Session',
    category: 'tech',
    categoryLabel: 'Tech & AI',
    url: '/assets/reusable/images/2d/doordash driver working long hours.png',
    positiveTags: [
      'coding', 'software engineer', 'developer', 'night coding', 'programming',
      'hacker', 'deep work', 'building software', 'screens', 'technology'
    ],
    negativeTags: []
  },
  {
    id: 'stock-market-trading-city-laptop',
    title: 'High-Tech Trading & Modern City',
    category: 'tech',
    categoryLabel: 'Tech & AI',
    url: '/assets/reusable/images/2d/DoorDash Driver Signup on City Street.png',
    positiveTags: [
      'city trading', 'finance tech', 'fintech', 'skyline',
      'global finance', 'laptop trading', 'modern commerce'
    ],
    negativeTags: []
  },

  // Workspace & Mindset
  {
    id: 'entrepreneur-business-growth-strategy',
    title: 'Entrepreneur Business Growth Strategy',
    category: 'workspace',
    categoryLabel: 'Workspace & Mindset',
    url: '/assets/reusable/images/2d/financial freedom.png',
    positiveTags: [
      'entrepreneur', 'founder', 'business growth', 'startup',
      'scaling business', 'leadership', 'vision', 'executive'
    ],
    negativeTags: []
  },
  {
    id: 'develop-financial-skills-laptop',
    title: 'Developing Skills & Focused Work',
    category: 'workspace',
    categoryLabel: 'Workspace & Mindset',
    url: '/assets/reusable/images/2d/how to make extra income.png',
    positiveTags: [
      'developing skills', 'learning', 'education', 'study', 'upskilling',
      'focused work', 'career growth', 'self improvement'
    ],
    negativeTags: []
  },

  // Career & Lifestyle
  {
    id: 'creator-recording-reel',
    title: 'Creator Studio Recording Setup',
    category: 'lifestyle',
    categoryLabel: 'Career & Lifestyle',
    url: '/assets/reusable/images/2d/DoorDash Joining.png',
    positiveTags: [
      'content creator', 'youtube creator', 'camera', 'microphone',
      'influencer', 'recording', 'video production', 'podcast'
    ],
    negativeTags: []
  },
  {
    id: 'doctor-career-portrait',
    title: 'Healthcare & Medical Professional',
    category: 'lifestyle',
    categoryLabel: 'Career & Lifestyle',
    url: '/assets/reusable/images/2d/doordash driver back pain.png',
    positiveTags: [
      'doctor', 'medical', 'healthcare', 'hospital', 'health',
      'clinic', 'physician', 'medicine'
    ],
    negativeTags: []
  },
  {
    id: 'students-campus-walk',
    title: 'Higher Education & Campus Community',
    category: 'lifestyle',
    categoryLabel: 'Career & Lifestyle',
    url: '/assets/reusable/images/2d/DoorDash Joining.png',
    positiveTags: [
      'college', 'university', 'students', 'campus', 'degree',
      'education', 'friends', 'graduating'
    ],
    negativeTags: []
  },
  {
    id: 'daily-lifestyle-spending-expenses',
    title: 'Urban Lifestyle & Daily Living',
    category: 'lifestyle',
    categoryLabel: 'Career & Lifestyle',
    url: '/assets/reusable/images/2d/Sunset Doordash Delivery Success in the City.png',
    positiveTags: [
      'daily lifestyle', 'city life', 'living expenses', 'routine',
      'lifestyle', 'leisure', 'daily habits', 'modern living'
    ],
    negativeTags: []
  },
  {
    id: 'qissaverse-spiritual-story-engine',
    title: 'The Qissaverse Spiritual & Wisdom Storytelling Engine (9:16 Shorts)',
    category: 'lifestyle',
    categoryLabel: 'Storytelling & Wisdom',
    url: 'assets/reusable/widgets/qissaverse-spiritual-story-engine.html',
    style: '3d',
    positiveTags: [
      'qissaverse', 'spiritual', 'quran', 'wisdom', 'story', 'storytelling',
      'maryam', 'surah', 'history', 'islamic', 'divine', 'faith', 'motivation',
      'reflection', 'calm', 'emotional', 'reels', 'shorts'
    ],
    negativeTags: ['tech', 'gadget', 'coding', 'crypto']
  },
  {
    id: 'artisan-craft-polisher-engine',
    title: 'Artisan Craftsmanship & Meditative Wisdom Polisher Engine (9:16 Shorts)',
    category: 'lifestyle',
    categoryLabel: 'Artisan & Craftsmanship',
    url: 'assets/reusable/widgets/artisan-craft-polisher-engine.html',
    style: '3d',
    positiveTags: [
      'artisan', 'craft', 'leather', 'handmade', 'asmr', 'craftsmanship',
      'durood', 'dhikr', 'sabar', 'islamic', 'wisdom', 'stitching', 'making',
      'workshop', 'process', 'slow-living', 'calm', 'reels', 'shorts'
    ],
    negativeTags: ['finance', 'stock market', 'crypto', 'coding']
  },
  {
    id: 'paradox-debunk-split-engine',
    title: 'The Paradox Debunk & Logical Fallacy Split-Screen Engine (9:16 Shorts)',
    category: 'tech',
    categoryLabel: 'Debunk & Mental Models',
    url: 'assets/reusable/widgets/paradox-debunk-split-engine.html',
    style: '3d',
    positiveTags: [
      'paradox', 'debunk', 'omnipotence', 'logic', 'philosophy', 'atheist',
      'theist', 'daleel', 'deen', 'quran', 'baqarah', 'fallacy', 'rebuttal',
      'explanation', 'split-screen', 'reels', 'shorts'
    ],
    negativeTags: ['cooking', 'beauty', 'makeup', 'gaming']
  },
  {
    id: 'executive-minimalist-caption-engine',
    title: 'Dr. Rogachev Executive Minimalist Caption Engine (9:16 Shorts)',
    category: 'tech',
    categoryLabel: 'Typography & Subtitles',
    url: 'assets/reusable/widgets/executive-minimalist-caption-engine.html',
    style: '3d',
    positiveTags: [
      'rogachev', 'caption', 'subtitle', 'typography', 'executive', 'leadership',
      'corporate', 'minimalist', 'all-caps', 'grotesque', 'boardroom', 'retention',
      'business', 'management', 'reels', 'shorts'
    ],
    negativeTags: ['cartoon', 'playful', 'comic']
  },
  {
    id: 'saas-split-screen-reverse-engine',
    title: 'SaaS UI Animation & Presenter Split-Screen Engine (9:16 Shorts)',
    category: 'tech',
    categoryLabel: 'Tech & Screencasts',
    url: 'assets/reusable/widgets/saas-split-screen-reverse-engine.html',
    style: '3d',
    positiveTags: [
      'saas', 'screencast', 'stripe', 'claude', 'skill', 'reverse-engineer',
      'animation', 'ui', 'card', 'split-screen', 'tutorial', 'code', 'workflow',
      'vishnu', 'vishai', 'reels', 'shorts'
    ],
    negativeTags: ['cooking', 'beauty', 'fashion']
  },
  {
    id: 'founder-podcast-clip-engine',
    title: 'Executive Podcast & Founder Keynote Clip Engine (9:16 Shorts)',
    category: 'business',
    categoryLabel: 'Entrepreneurship & Mindset',
    url: 'assets/reusable/widgets/founder-podcast-clip-engine.html',
    style: '3d',
    positiveTags: [
      'podcast', 'founder', 'entrepreneur', 'interview', 'mahesh', 'dubai',
      'struggle', 'mindset', 'advice', 'clips', 'reels', 'shorts', 'tasc',
      'lower-third', 'curiosity-pill'
    ],
    negativeTags: ['gaming', 'comedy', 'prank']
  },
  {
    id: 'saas-product-promo-teaser-engine',
    title: 'SaaS Mac App Product Promo & Feature Spotlight Engine (9:16 Shorts)',
    category: 'tech',
    categoryLabel: 'Tech & Product Promos',
    url: 'assets/reusable/widgets/saas-product-promo-teaser-engine.html',
    style: '3d',
    positiveTags: [
      'promo', 'teaser', 'saas', 'wavren', 'mac', 'dictation', 'notes',
      'ai', 'voice', 'privacy', 'local-ai', 'clipboard', 'product-launch',
      'reels', 'shorts'
    ],
    negativeTags: ['gaming', 'prank', 'makeup']
  },
  {
    id: 'mini-mic-startup-funding-engine',
    title: 'Mini-Mic Startup VC Funding & Neon Voltage Engine (9:16 Shorts)',
    category: 'business',
    categoryLabel: 'Startups & Venture Capital',
    url: 'assets/reusable/widgets/mini-mic-startup-funding-engine.html',
    style: '3d',
    positiveTags: [
      'mini-mic', 'lavalier', 'vc', 'funding', 'preseed', 'angel', 'investor',
      'startup', 'hormozi', 'neon-lime', 'checks', 'ivelina', 'reels', 'shorts'
    ],
    negativeTags: ['gaming', 'cooking', 'makeup']
  },
  {
    id: 'editorial-dual-script-bio-engine',
    title: 'Aesthetic Warm Editorial Dual-Script & Bio Card Engine (9:16 Shorts)',
    category: 'lifestyle',
    categoryLabel: 'Mental Health & Parenting',
    url: 'assets/reusable/widgets/editorial-dual-script-bio-engine.html',
    style: '3d',
    positiveTags: [
      'editorial', 'serif', 'dual-script', 'italic', 'psychologist', 'parenting',
      'mental-health', 'priyanka', 'brainchuckle', 'warm-linen', 'credential-card',
      'reels', 'shorts'
    ],
    negativeTags: ['gaming', 'prank', 'crypto']
  },
  {
    id: 'scrapbook-paper-poster-engine',
    title: 'Aesthetic Scrapbook Paper Poster & Binder Clip Engine (9:16 Shorts)',
    category: 'lifestyle',
    categoryLabel: 'Health & Longevity',
    url: 'assets/reusable/widgets/scrapbook-paper-poster-engine.html',
    style: '3d',
    positiveTags: [
      'scrapbook', 'paper', 'binder-clip', 'matcha', 'longevity', 'wellness',
      'health', 'nutrition', 'antioxidants', 'aesthetic', 'josie', 'reels', 'shorts'
    ],
    negativeTags: ['tech', 'gadget', 'crypto', 'coding']
  },
  {
    id: 'payment-methods-carousel-engine',
    title: 'FinTech Payment Methods & Horizontal Card Carousel Engine (9:16 Shorts)',
    category: 'finance',
    categoryLabel: 'FinTech & Money Transfers',
    url: 'assets/reusable/widgets/payment-methods-carousel-engine.html',
    style: '3d',
    positiveTags: [
      'finance', 'payment', 'methods', 'upi', 'neft', 'imps', 'rtgs', 'nach',
      'emandate', 'cheque', 'dd', 'credit', 'debit', 'genzfinancer', 'carousel',
      'blueprint', 'reels', 'shorts'
    ],
    negativeTags: ['gaming', 'comedy', 'prank', 'makeup']
  },
  {
    id: 'tech-laptop-checklist-engine',
    title: 'Tech Laptop Buying Checklist & Spec Badge Engine (9:16 Shorts)',
    category: 'tech',
    categoryLabel: 'Hardware & Tech Reviews',
    url: 'assets/reusable/widgets/tech-laptop-checklist-engine.html',
    style: '3d',
    positiveTags: [
      'tech', 'laptop', 'hardware', 'specs', 'checklist', 'buying-guide',
      'processor', 'ssd', 'ram', 'gpu', 'tgp', 'yukti', 'techsavvyyukti',
      'reels', 'shorts'
    ],
    negativeTags: ['cooking', 'makeup', 'prank']
  },
  {
    id: 'startup-funding-grant-clip-engine',
    title: 'Middle East Startup Grant & Metric Callout Clip Engine (9:16 Shorts)',
    category: 'business',
    categoryLabel: 'Venture Capital & Government Grants',
    url: 'assets/reusable/widgets/startup-funding-grant-clip-engine.html',
    style: '3d',
    positiveTags: [
      'qatar', 'middle-east', 'startup', 'funding', 'grant', 'defensible',
      'qfc', 'venture-capital', 'investing', 'doha', 'reels', 'shorts', 'clips'
    ],
    negativeTags: ['gaming', 'comedy', 'prank', 'makeup']
  },
  {
    id: 'video-editing-timeline-split-engine',
    title: 'NLE Video Editing J-Cut & L-Cut Split Timeline Engine (9:16 Shorts)',
    category: 'tech',
    categoryLabel: 'Video Editing & Creative Tutorials',
    url: 'assets/reusable/widgets/video-editing-timeline-split-engine.html',
    style: '3d',
    positiveTags: [
      'editing', 'j-cut', 'l-cut', 'timeline', 'nle', 'premiere', 'audio',
      'waveform', 'taalcut', 'split-screen', 'tutorial', 'reels', 'shorts'
    ],
    negativeTags: ['gaming', 'comedy', 'prank', 'makeup']
  },
  {
    id: 'organic-saas-promo-card-engine',
    title: 'Organic Founder SaaS Promo & Pastel Serif Card Engine (9:16 Shorts)',
    category: 'tech',
    categoryLabel: 'SaaS & AI Assistant Promos',
    url: 'assets/reusable/widgets/organic-saas-promo-card-engine.html',
    style: '3d',
    positiveTags: [
      'saas', 'promo', 'ai', 'assistant', 'littlebird', 'meeting-notes',
      'memory', 'founder', 'aesthetic', 'pastel-pink', 'serif', 'reels', 'shorts'
    ],
    negativeTags: ['gaming', 'comedy', 'prank', 'makeup']
  },
  {
    id: 'steal-lighting-prompt-engine',
    title: 'AI Lighting Prompt Guide & Frosted Glass Hook Engine (9:16 Shorts)',
    category: 'tech',
    categoryLabel: 'AI Art & Cinematography Prompts',
    url: 'assets/reusable/widgets/steal-lighting-prompt-engine.html',
    style: '3d',
    positiveTags: [
      'ai', 'prompt', 'lighting', 'cinematography', 'camera-lights', 'midjourney',
      'flux', 'aivolvenews', 'frosted-glass', 'squiggle', 'reels', 'shorts'
    ],
    negativeTags: ['cooking', 'makeup', 'prank']
  },
  {
    id: 'rag-architecture-explainer-engine',
    title: 'ChatGPT & RAG Architecture 500-Page Stack Engine (9:16 Shorts)',
    category: 'tech',
    categoryLabel: 'System Design & AI Engineering',
    url: 'assets/reusable/widgets/rag-architecture-explainer-engine.html',
    style: '3d',
    positiveTags: [
      'chatgpt', 'rag', 'system-design', 'embeddings', 'vector-database',
      'chunking', 'devmonk', 'preetam', '500-pages', 'pdf', 'reels', 'shorts'
    ],
    negativeTags: ['cooking', 'makeup', 'prank']
  },
  {
    id: 'vault-luxury-serif-caption-engine',
    title: 'Luxury Editorial Swash Serif Caption Engine (9:16 Shorts)',
    category: 'lifestyle',
    categoryLabel: 'Luxury & Fashion Captions',
    url: 'assets/reusable/widgets/vault-luxury-serif-caption-engine.html',
    style: '3d',
    positiveTags: [
      'caption', 'typography', 'luxury', 'serif', 'italic', 'swash', 'vaultvisuals',
      'emilyemig', 'fashion', 'lifestyle', 'reels', 'shorts', 'subtitles'
    ],
    negativeTags: ['tech', 'gadget', 'coding']
  },
  {
    id: 'startup-mvp-validation-engine',
    title: 'Startup Idea Validation & Blue Lightbulb MVP Engine (9:16 Shorts)',
    category: 'business',
    categoryLabel: 'Startups & MVP Validation',
    url: 'assets/reusable/widgets/startup-mvp-validation-engine.html',
    style: '3d',
    positiveTags: [
      'startup', 'mvp', 'idea', 'validation', 'lightbulb', 'coding', 'landing-page',
      'wabsyin', 'customer-discovery', 'reels', 'shorts'
    ],
    negativeTags: ['gaming', 'cooking', 'makeup']
  },
  {
    id: 'real-estate-listing-turnaround-engine',
    title: 'Real Estate 240-Day Listing Turnaround & Playbook Engine (9:16 Shorts)',
    category: 'business',
    categoryLabel: 'Real Estate & High-Ticket Case Studies',
    url: 'assets/reusable/widgets/real-estate-listing-turnaround-engine.html',
    style: '3d',
    positiveTags: [
      'real-estate', 'realtor', 'turnaround', 'case-study', 'staging', 'emilynelson',
      'property', 'multiple-offers', 'reels', 'shorts'
    ],
    negativeTags: ['gaming', 'comedy', 'prank', 'makeup']
  },
  {
    id: 'life-career-triad-clip-engine',
    title: 'Life & Career Mastery Triad Engine (Learn ➔ Earn ➔ Return)',
    description: 'Executive 3-stage career progression framework with color-coded stage cards (Learn in Sky Blue, Earn in Amber Gold, Return in Emerald Green), speaker pill badge, and viral comment poll footer.',
    category: 'character',
    categoryLabel: 'Keynote & Podcast Wisdom Clips',
    url: 'assets/reusable/widgets/life-career-triad-clip-engine.html',
    style: 'modern',
    positiveTags: [
      'learn-earn-return', 'calli-wolff', 'the-becoming-room', 'triad', 'career-growth', 'mentorship',
      'keynote', 'podcast', 'wisdom', 'reels', 'shorts'
    ],
    negativeTags: ['gaming', 'prank', 'horror', 'crypto-scam']
  },
  {
    id: 'luxury-estate-tour-promo-engine',
    title: 'Luxury Real Estate Tour & Property Promo Engine ($1.8M Estate Showcase)',
    description: 'High-converting luxury home tour promotional reel engine featuring glowing emerald checkmark hook ("checks all your boxes"), top location & price capsule ($1.8M), rotating interior feature cards, and agent authority badge.',
    category: 'character',
    categoryLabel: 'Real Estate & Property Promos',
    url: 'assets/reusable/widgets/luxury-estate-tour-promo-engine.html',
    style: 'modern',
    positiveTags: [
      'luxury-real-estate', 'property-tour', 'kelsie-blevins', 'estate-showcase', 'checks-your-boxes',
      'realtor-promo', 'lake-norman', 'million-dollar-listing', 'reels', 'shorts'
    ],
    negativeTags: ['gaming', 'comedy', 'prank', 'crypto']
  },
  {
    id: 'radical-service-hero-gradient-engine',
    title: 'Radical Service & Hero Gradient Typography Engine (Why I Show Up Reel)',
    description: 'Kinetic creator polisher featuring giant extruded hero gradient keyword ("SOLVING" in violet-pink), radical client commitment deck, agent lower-third badge, and viral comment "DOOR" lead magnet trigger.',
    category: 'character',
    categoryLabel: 'Realtor & High-Commitment Service Polishers',
    url: 'assets/reusable/widgets/radical-service-hero-gradient-engine.html',
    style: 'modern',
    positiveTags: [
      'radical-service', 'hero-gradient', 'raelynn-hibbert', 'utah-real-estate', 'why-i-show-up',
      'comment-door', 'lead-magnet', 'kinetic-typography', 'reels', 'shorts'
    ],
    negativeTags: ['gaming', 'prank', 'horror', 'crypto']
  },
  {
    id: 'market-arbitrage-compare-engine',
    title: 'Market Arbitrage & Relocation Compare Engine ($1.18M City Face-Off)',
    description: 'High-retention side-by-side market comparison engine featuring metallic champagne + cursive hybrid hook ("THIS is what $1.18 million gets you"), split city spec cards (Vancouver/Toronto condo vs Calgary detached infill), and agent relocation CTA.',
    category: 'character',
    categoryLabel: 'Compare & Market Arbitrage Explainer',
    url: 'assets/reusable/widgets/market-arbitrage-compare-engine.html',
    style: 'modern',
    positiveTags: [
      'market-arbitrage', 'city-comparison', 'kelynn-mcmanus', 'calgary-real-estate', 'vancouver-toronto',
      'versus', 'relocation', 'same-budget', 'reels', 'shorts'
    ],
    negativeTags: ['gaming', 'comedy', 'prank', 'makeup']
  },
  {
    id: 'floating-palm-card-engine',
    title: 'Floating Palm Hologram & Property Showcase Engine ($399K Brick Ranch)',
    description: 'Viral creator polish engine featuring floating 3D aerial drone preview card anchored above presenter open palm, location & price capsule ($399K), rotating renovation highlight cards, and agent authority badge.',
    category: 'character',
    categoryLabel: 'Presenter Gestures & Hologram Overlays',
    url: 'assets/reusable/widgets/floating-palm-card-engine.html',
    style: 'modern',
    positiveTags: [
      'floating-palm-card', 'hologram', 'drone-preview', 'kelsie-blevins', 'brick-ranch', 'renovation',
      'realtor', 'single-level', '28k-likes', 'reels', 'shorts'
    ],
    negativeTags: ['gaming', 'prank', 'horror', 'crypto']
  },
  {
    id: 'neighborhood-lifestyle-promo-engine',
    title: 'Neighborhood Lifestyle & Community Spotlight Engine (The Market Common)',
    description: 'Coastal walkable community lifestyle promotional engine featuring top city & neighborhood capsule, 4-pillar lifestyle carousel (coffee/lake walks, boutique dining, live music, beach access), agent lower third, and relocation guide CTA.',
    category: 'character',
    categoryLabel: 'Neighborhood & Community Promos',
    url: 'assets/reusable/widgets/neighborhood-lifestyle-promo-engine.html',
    style: 'modern',
    positiveTags: [
      'neighborhood-spotlight', 'coastal-lifestyle', 'leslie-perkins', 'market-common', 'myrtle-beach',
      'walkable-community', 'relocation-guide', 'reels', 'shorts'
    ],
    negativeTags: ['gaming', 'comedy', 'prank', 'crypto']
  },
  {
    id: 'suburb-relocation-guide-engine',
    title: 'Suburb Relocation Guide & Commuter Haven Engine (Huntersville / Lake Norman)',
    description: 'High-converting regional suburb relocation guide engine featuring top-of-my-list town capsule, extruded magenta hero gradient subtitle hook ("without GIVING up Charlotte"), 4-pillar decision carousel, and relocation DM CTA.',
    category: 'character',
    categoryLabel: 'Suburb & Relocation Promos',
    url: 'assets/reusable/widgets/suburb-relocation-guide-engine.html',
    style: 'modern',
    positiveTags: [
      'suburb-relocation', 'top-of-my-list', 'hannah-herald', 'huntersville', 'lake-norman', 'charlotte',
      'commuter-haven', 'birkdale-village', 'reels', 'shorts'
    ],
    negativeTags: ['gaming', 'comedy', 'prank', 'makeup']
  },
  {
    id: 'buyer-mistakes-advisory-engine',
    title: 'Buyer Mistakes & Advisory Engine (3 These Mistakes Model)',
    description: 'High-impact buyer advisory polisher featuring giant dual-script number hook ("3 these mistakes" in bold serif & flowing cursive script), 3-part costly mistake cards, agent lower-third, and inbound "Message FIRST" lead magnet trigger.',
    category: 'character',
    categoryLabel: 'Advisor & Mistake Debunk Polishers',
    url: 'assets/reusable/widgets/buyer-mistakes-advisory-engine.html',
    style: 'modern',
    positiveTags: [
      'buyer-mistakes', 'first-time-buyer', 'kelynn-mcmanus', 'calgary-real-estate', 'dual-script-hook',
      'kitchen-talking-head', 'costly-traps', 'reels', 'shorts'
    ],
    negativeTags: ['gaming', 'comedy', 'prank', 'makeup']
  },
  {
    id: 'buyer-concessions-playbook-engine',
    title: 'Buyer Concessions & Tactical Negotiation Engine (45K Under Playbook)',
    description: 'High-impact buyer negotiation polisher featuring bold golden 3D hook ("My buyer 45K paid under"), 6-part tactical concession cards (closing costs, rate buydowns, inspection credits, home warranty), and agent lower-third.',
    category: 'character',
    categoryLabel: 'Negotiation & Concessions Polishers',
    url: 'assets/reusable/widgets/buyer-concessions-playbook-engine.html',
    style: 'modern',
    positiveTags: [
      'buyer-concessions', 'negotiation-strategy', 'raelynn-hibbert', '45k-under', 'closing-costs',
      'rate-buydown', 'penthouse-walking', 'reels', 'shorts'
    ],
    negativeTags: ['gaming', 'prank', 'horror', 'crypto']
  },
  {
    id: 'portfolio-reel-mosaic-engine',
    title: 'Floating Portfolio Reel Mosaic & Social Proof Stack (Homes by Breyan)',
    description: 'High-retention creator proof engine featuring 3 floating staggered video reel preview cards hovering in front of presenter ($14M sold, 5-star reviews, 14 days on market), big-text hook ("There are agents..."), and non-transactional life transition cards.',
    category: 'character',
    categoryLabel: 'Portfolio Mosaic & Social Proof Polishers',
    url: 'assets/reusable/widgets/portfolio-reel-mosaic-engine.html',
    style: 'modern',
    positiveTags: [
      'portfolio-mosaic', 'social-proof', 'breyan-lallas', 'homes-by-breyan', 'reel-cards',
      'floating-videos', 'non-transactional', 'client-results', 'reels', 'shorts'
    ],
    negativeTags: ['gaming', 'prank', 'horror', 'crypto']
  },
  {
    id: 'ultra-luxury-architectural-estate-engine',
    title: 'Ultra-Luxury Architectural Estate Showcase & POV Engine (Villa Alia Marbella)',
    description: 'High-society luxury real estate showcase featuring viral POV contribution teaser pill ("POV: when your contribution is €800K... and he handles the other €10M"), architectural center typography (Villa Alia, Studio MK27, 7 Bed | 8 Bath | 1,077 SqM, €10.8M), 4-tier luxury amenity badges, and agent lower-third.',
    category: 'character',
    categoryLabel: 'Luxury Architectural Estate Showcase',
    url: 'assets/reusable/widgets/ultra-luxury-architectural-estate-engine.html',
    style: 'modern',
    positiveTags: [
      'ultra-luxury', 'villa-alia', 'marbella', 'studio-mk27', 'marcio-kogan', 'rasa-bagdonaviciute',
      'architectural-showcase', 'pov-hook', 'real-estate-reels', 'luxury-estate', 'reels', 'shorts'
    ],
    negativeTags: ['gaming', 'prank', 'horror', 'crypto']
  }
];

export const ITNAVIDEO_STOCK_ASSETS: ItnaVideoStockAsset[] = RAW_ITNAVIDEO_STOCK_ASSETS.map((asset) => ({
  ...asset,
  style: asset.style || getAssetStyle(asset.url),
  url: toAbsoluteS3AssetUrl(asset.url),
}));
