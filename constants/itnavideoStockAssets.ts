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
  }
];

export const ITNAVIDEO_STOCK_ASSETS: ItnaVideoStockAsset[] = RAW_ITNAVIDEO_STOCK_ASSETS.map((asset) => ({
  ...asset,
  style: asset.style || getAssetStyle(asset.url),
  url: toAbsoluteS3AssetUrl(asset.url),
}));
