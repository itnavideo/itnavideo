export interface ItnaVideoStockAsset {
  id: string;
  title: string;
  category: 'all' | 'business' | 'tech' | 'workspace' | 'lifestyle';
  categoryLabel: string;
  url: string;
}

export const ITNAVIDEO_STOCK_CATEGORIES = [
  { id: 'all', label: 'All Curated' },
  { id: 'business', label: 'Finance & Wealth' },
  { id: 'tech', label: 'Tech & AI' },
  { id: 'workspace', label: 'Workspace' },
  { id: 'lifestyle', label: 'Lifestyle & Career' },
] as const;

export const ITNAVIDEO_STOCK_ASSETS: ItnaVideoStockAsset[] = [
  // Business & Finance
  {
    id: 'financial-planning',
    title: 'Financial Planning & Strategy',
    category: 'business',
    categoryLabel: 'Finance & Wealth',
    url: 'https://res.cloudinary.com/dhouh9idx/image/upload/v1788688244/financial_planning_collaboration_phdqrt.png',
  },
  {
    id: 'stacking-coins',
    title: 'Hand Stacking Wealth Coins',
    category: 'business',
    categoryLabel: 'Finance & Wealth',
    url: 'https://res.cloudinary.com/dhouh9idx/image/upload/v1788688239/hand_stacking_coins_wealth_blocks_jpzudc.png',
  },
  {
    id: 'money-growth-plant',
    title: 'Cupping Growing Money Plant',
    category: 'business',
    categoryLabel: 'Finance & Wealth',
    url: 'https://res.cloudinary.com/dhouh9idx/image/upload/v1788688238/hands_cupping_growing_money_plant_helfm6.png',
  },
  {
    id: 'hundred-dollar-stack',
    title: 'Stack of Hundred Dollar Bills',
    category: 'business',
    categoryLabel: 'Finance & Wealth',
    url: 'https://res.cloudinary.com/dhouh9idx/image/upload/v1788688238/stack_of_hundred_dollar_bills_zkatah.png',
  },
  {
    id: 'stock-market-analytics',
    title: 'Stock Market Analytics Chart',
    category: 'business',
    categoryLabel: 'Finance & Wealth',
    url: 'https://res.cloudinary.com/dhouh9idx/image/upload/v1788688236/stock_market_analytics_dashboard_p9o0i7.png',
  },
  {
    id: 'investing-future-growth',
    title: 'Investing Future Growth & Capital',
    category: 'business',
    categoryLabel: 'Finance & Wealth',
    url: 'https://res.cloudinary.com/dhouh9idx/image/upload/v1788688236/investing_future_growth_money_gxtl9p.png',
  },
  {
    id: 'real-estate-investment',
    title: 'Real Estate Property Investment',
    category: 'business',
    categoryLabel: 'Finance & Wealth',
    url: 'https://res.cloudinary.com/dhouh9idx/image/upload/v1788688216/real_estate_property_investment_dzjh83.png',
  },

  // Tech & AI
  {
    id: 'futuristic-ai-neural',
    title: 'Futuristic AI Neural Network',
    category: 'tech',
    categoryLabel: 'Tech & AI',
    url: 'https://res.cloudinary.com/dhouh9idx/image/upload/v1788688229/futuristic_ai_robot_neural_network_v6j5fk.png',
  },
  {
    id: 'ai-engineer-night',
    title: 'AI Engineer Deep Coding Session',
    category: 'tech',
    categoryLabel: 'Tech & AI',
    url: 'https://res.cloudinary.com/dhouh9idx/image/upload/v1788688210/ai-engineer-night-work_b5lwhf.png',
  },
  {
    id: 'innovation-gears',
    title: 'Innovation Gears & Ideas',
    category: 'tech',
    categoryLabel: 'Tech & AI',
    url: 'https://res.cloudinary.com/dhouh9idx/image/upload/v1788688234/creative_mindset_innovation_gears_h7qmzn.png',
  },
  {
    id: 'trading-city-laptop',
    title: 'High-Tech Trading & Modern City',
    category: 'tech',
    categoryLabel: 'Tech & AI',
    url: 'https://res.cloudinary.com/dhouh9idx/image/upload/v1788688214/stock_market_trading_city_laptop_vdidg4.png',
  },

  // Workspace & Mindset
  {
    id: 'modern-workspace-laptop',
    title: 'Modern Workspace Laptop & Coffee',
    category: 'workspace',
    categoryLabel: 'Workspace & Mindset',
    url: 'https://res.cloudinary.com/dhouh9idx/image/upload/v1788688223/modern_workspace_laptop_coffee_planning_o8nkmk.png',
  },
  {
    id: 'entrepreneur-strategy',
    title: 'Entrepreneur Business Growth Strategy',
    category: 'workspace',
    categoryLabel: 'Workspace & Mindset',
    url: 'https://res.cloudinary.com/dhouh9idx/image/upload/v1788688220/entrepreneur_business_growth_strategy_xadbj6.png',
  },
  {
    id: 'develop-skills-laptop',
    title: 'Developing Skills & Focused Work',
    category: 'workspace',
    categoryLabel: 'Workspace & Mindset',
    url: 'https://res.cloudinary.com/dhouh9idx/image/upload/v1788688237/develop_financial_skills_with_laptop_oy8gil.png',
  },
  {
    id: 'budgeting-notes',
    title: 'Strategic Planning & Goal Setting',
    category: 'workspace',
    categoryLabel: 'Workspace & Mindset',
    url: 'https://res.cloudinary.com/dhouh9idx/image/upload/v1788688238/budgeting_money_taking_notes_tg76bp.png',
  },

  // Career & Lifestyle
  {
    id: 'creator-recording-reel',
    title: 'Creator Studio Recording Setup',
    category: 'lifestyle',
    categoryLabel: 'Career & Lifestyle',
    url: 'https://res.cloudinary.com/dhouh9idx/image/upload/v1788688210/creator-recording-reel_wpgbdz.png',
  },
  {
    id: 'doctor-career-portrait',
    title: 'Healthcare & Medical Professional',
    category: 'lifestyle',
    categoryLabel: 'Career & Lifestyle',
    url: 'https://res.cloudinary.com/dhouh9idx/image/upload/v1788688211/doctor-career-portrait_yhfguf.png',
  },
  {
    id: 'students-campus-walk',
    title: 'Higher Education & Campus Community',
    category: 'lifestyle',
    categoryLabel: 'Career & Lifestyle',
    url: 'https://res.cloudinary.com/dhouh9idx/image/upload/v1788688211/students-campus-walk_hzgjfo.png',
  },
  {
    id: 'daily-lifestyle-spending',
    title: 'Urban Lifestyle & Daily Living',
    category: 'lifestyle',
    categoryLabel: 'Career & Lifestyle',
    url: 'https://res.cloudinary.com/dhouh9idx/image/upload/v1788688214/daily_lifestyle_spending_expenses_mbvhkn.png',
  },
];
