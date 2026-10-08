import fs from 'node:fs';
import crypto from 'node:crypto';

async function getGcsAccessToken() {
  const credPath = 'gcp-credentials.json';
  const key = JSON.parse(fs.readFileSync(credPath, 'utf8'));
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: 'RS256', typ: 'JWT' };
  const payload = {
    iss: key.client_email,
    sub: key.client_email,
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600,
    scope: 'https://www.googleapis.com/auth/cloud-platform',
  };
  const toBase64Url = (obj) => Buffer.from(JSON.stringify(obj)).toString('base64url');
  const unsignedToken = `${toBase64Url(header)}.${toBase64Url(payload)}`;
  const sign = crypto.createSign('RSA-SHA256');
  sign.update(unsignedToken);
  const jwt = `${unsignedToken}.${sign.sign(key.private_key, 'base64url')}`;
  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  });
  const data = await tokenRes.json();
  return data.access_token;
}

// Curated stock assets map: Cloudinary URL -> clean GCS filename & metadata
const STOCK_ASSETS_MAP = [
  // Low money / Debt / Budget constraints
  {
    cloudinaryId: 'empty_wallet_few_coins_asuep3',
    gcsFileName: 'empty_wallet_little_money.png',
    title: 'Empty Wallet with Few Coins',
    category: 'business',
    categoryLabel: 'Finance & Wealth',
    positiveTags: [
      'little money', 'very little money', 'low money', 'empty wallet', 'broke',
      'poor', 'poverty', 'few coins', 'no money', 'low income', 'struggling',
      'tight budget', 'savings exhausted', 'scarcity', 'hard times', 'living paycheck'
    ],
    negativeTags: ['rich', 'wealth', 'millionaire', 'huge profit', 'abundance', 'luxury']
  },
  {
    cloudinaryId: 'rising_debt_arrow_blocks_ekhazf',
    gcsFileName: 'rising_debt_financial_stress.png',
    title: 'Rising Debt and Financial Stress',
    category: 'business',
    categoryLabel: 'Finance & Wealth',
    positiveTags: [
      'debt', 'rising debt', 'loans', 'credit card debt', 'interest rates',
      'owe money', 'financial burden', 'stress', 'crisis', 'bills piling up'
    ],
    negativeTags: ['wealth', 'rich', 'cash abundance', 'millionaire']
  },
  {
    cloudinaryId: 'erasing_debt_pencil_eraser_ekbrwm',
    gcsFileName: 'erasing_debt_budget_relief.png',
    title: 'Erasing Debt and Financial Freedom',
    category: 'business',
    categoryLabel: 'Finance & Wealth',
    positiveTags: [
      'erase debt', 'pay off debt', 'debt relief', 'clearing loans', 'freedom',
      'budget solution', 'fix credit', 'eliminating debt', 'clean slate'
    ],
    negativeTags: ['luxury', 'millionaire', 'dollar pile']
  },
  {
    cloudinaryId: 'multiple_credit_cards_on_wood_plrn0z',
    gcsFileName: 'credit_cards_debt_spending.png',
    title: 'Credit Cards and Spending Habits',
    category: 'business',
    categoryLabel: 'Finance & Wealth',
    positiveTags: [
      'credit card', 'credit cards', 'swiping', 'spending', 'shopping expenses',
      'impulse buying', 'consumer debt', 'interest rate', 'banking'
    ],
    negativeTags: []
  },
  {
    cloudinaryId: 'monthly_budget_calculator_pen_yjobwf',
    gcsFileName: 'monthly_budget_calculator.png',
    title: 'Monthly Budget Planning & Calculator',
    category: 'business',
    categoryLabel: 'Finance & Wealth',
    positiveTags: [
      'budget', 'monthly budget', 'calculator', 'planning', 'track expenses',
      'managing money', 'financial discipline', 'accounting', 'cost cutting'
    ],
    negativeTags: ['millionaire', 'luxury', 'cash pile']
  },
  {
    cloudinaryId: 'salary_calculation_income_management_szmluz',
    gcsFileName: 'salary_calculation_income_management.png',
    title: 'Salary Calculation and Income Management',
    category: 'business',
    categoryLabel: 'Finance & Wealth',
    positiveTags: [
      'salary', 'paycheck', 'income', 'earnings', 'monthly salary',
      'compensation', 'wage', 'net income', 'income stream'
    ],
    negativeTags: []
  },
  {
    cloudinaryId: 'person_calculating_typing_laptop_npimij',
    gcsFileName: 'person_calculating_budget_laptop.png',
    title: 'Financial Analysis on Laptop',
    category: 'business',
    categoryLabel: 'Finance & Wealth',
    positiveTags: [
      'calculating', 'financial numbers', 'spreadsheet', 'laptop analysis',
      'reviewing finances', 'financial review', 'math', 'taxes'
    ],
    negativeTags: []
  },
  {
    cloudinaryId: 'budgeting_money_taking_notes_tg76bp',
    gcsFileName: 'budgeting_money_taking_notes.png',
    title: 'Strategic Budgeting & Taking Notes',
    category: 'workspace',
    categoryLabel: 'Workspace & Mindset',
    positiveTags: [
      'budgeting notes', 'taking notes', 'money rules', 'financial habits',
      'planning ahead', 'goal setting', 'journaling finances', 'smart habits'
    ],
    negativeTags: []
  },

  // Wealth & Abundance (Positive / High Net Worth)
  {
    cloudinaryId: 'stack_of_hundred_dollar_bills_zkatah',
    gcsFileName: 'stack_of_hundred_dollar_bills.png',
    title: 'Stack of Hundred Dollar Bills',
    category: 'business',
    categoryLabel: 'Finance & Wealth',
    positiveTags: [
      'hundred dollar bills', 'cash stack', 'money', 'rich', 'wealth',
      'large sums', 'profit', 'fortune', 'millionaire', 'big revenue',
      'financial abundance', 'cash flow', 'high net worth'
    ],
    negativeTags: ['little money', 'very little money', 'low money', 'empty wallet', 'broke', 'poor', 'poverty', 'few coins', 'debt']
  },
  {
    cloudinaryId: 'massive_dollar_pile_fcijho',
    gcsFileName: 'massive_dollar_pile_wealth.png',
    title: 'Massive Dollar Pile and Wealth',
    category: 'business',
    categoryLabel: 'Finance & Wealth',
    positiveTags: [
      'massive money', 'huge cash', 'dollar pile', 'wealthy', 'billionaire',
      'excess money', 'enormous wealth', 'jackpot', 'massive profit'
    ],
    negativeTags: ['little money', 'very little money', 'low money', 'empty wallet', 'broke', 'poor', 'poverty', 'few coins', 'debt']
  },
  {
    cloudinaryId: 'gold_dollar_cash_stacks_pytbf4',
    gcsFileName: 'gold_dollar_cash_stacks.png',
    title: 'Gold and Cash Wealth Stacks',
    category: 'business',
    categoryLabel: 'Finance & Wealth',
    positiveTags: [
      'gold and cash', 'precious assets', 'wealth reserves', 'gold coins',
      'high value', 'luxury investment', 'solid assets', 'treasure'
    ],
    negativeTags: ['little money', 'very little money', 'low money', 'empty wallet', 'broke', 'poor', 'poverty', 'few coins', 'debt']
  },
  {
    cloudinaryId: 'one_hundred_dollar_bill_front_fw0z1p',
    gcsFileName: 'one_hundred_dollar_bill_front.png',
    title: 'Close-up of Hundred Dollar Bill',
    category: 'business',
    categoryLabel: 'Finance & Wealth',
    positiveTags: [
      'hundred dollar bill', 'us dollar', 'currency', 'cash', 'money value',
      'dollar banknote', 'federal reserve', 'legal tender'
    ],
    negativeTags: ['little money', 'very little money', 'poor', 'poverty', 'broke', 'empty wallet']
  },

  // Growth, Investing & Stacking
  {
    cloudinaryId: 'hand_stacking_coins_wealth_blocks_jpzudc',
    gcsFileName: 'hand_stacking_wealth_coins.png',
    title: 'Hand Stacking Wealth Coins',
    category: 'business',
    categoryLabel: 'Finance & Wealth',
    positiveTags: [
      'stacking coins', 'step by step', 'accumulating wealth', 'saving coins',
      'compound growth', 'building wealth', 'patience', 'incremental growth'
    ],
    negativeTags: ['overnight rich', 'massive pile']
  },
  {
    cloudinaryId: 'hands_cupping_growing_money_plant_helfm6',
    gcsFileName: 'hands_cupping_growing_money_plant.png',
    title: 'Cupping Growing Money Plant',
    category: 'business',
    categoryLabel: 'Finance & Wealth',
    positiveTags: [
      'growing money', 'money plant', 'investing early', 'nurturing wealth',
      'sustainable finance', 'growth mindset', 'financial seedling', 'long term investing'
    ],
    negativeTags: ['debt', 'broke', 'loss', 'poverty']
  },
  {
    cloudinaryId: 'investing_future_growth_money_gxtl9p',
    gcsFileName: 'investing_future_growth_money.png',
    title: 'Investing in Future Capital Growth',
    category: 'business',
    categoryLabel: 'Finance & Wealth',
    positiveTags: [
      'investing', 'future growth', 'capital gains', 'portfolio', 'roi',
      'wealth creation', 'investment strategy', 'returns'
    ],
    negativeTags: ['debt', 'loss', 'broke', 'poverty']
  },
  {
    cloudinaryId: 'income_growth_chart_drawing_qqrsmg',
    gcsFileName: 'income_growth_chart_drawing.png',
    title: 'Income Growth Chart and Analytics',
    category: 'business',
    categoryLabel: 'Finance & Wealth',
    positiveTags: [
      'growth chart', 'upward trend', 'increasing income', 'revenue growth',
      'exponential curve', 'analytics', 'rising profits', 'performance'
    ],
    negativeTags: ['loss', 'decline', 'crash']
  },
  {
    cloudinaryId: 'financial_planning_collaboration_phdqrt',
    gcsFileName: 'financial_planning_collaboration.png',
    title: 'Financial Planning & Strategy Collaboration',
    category: 'business',
    categoryLabel: 'Finance & Wealth',
    positiveTags: [
      'financial planning', 'advisor', 'consulting', 'collaboration', 'strategy meeting',
      'team discussion', 'wealth advisor', 'partnership'
    ],
    negativeTags: []
  },
  {
    cloudinaryId: 'real_estate_property_investment_dzjh83',
    gcsFileName: 'real_estate_property_investment.png',
    title: 'Real Estate Property Investment',
    category: 'business',
    categoryLabel: 'Finance & Wealth',
    positiveTags: [
      'real estate', 'property', 'housing investment', 'home buying',
      'land', 'mortgage', 'rental property', 'passive income real estate'
    ],
    negativeTags: []
  },
  {
    cloudinaryId: 'stock_market_analytics_dashboard_p9o0i7',
    gcsFileName: 'stock_market_analytics_dashboard.png',
    title: 'Stock Market Analytics Chart',
    category: 'business',
    categoryLabel: 'Finance & Wealth',
    positiveTags: [
      'stock market', 'trading chart', 'candlestick', 'wall street',
      'shares', 'market index', 'nasdaq', 'crypto market'
    ],
    negativeTags: []
  },

  // Tech, AI & Coding
  {
    cloudinaryId: 'futuristic_ai_robot_neural_network_v6j5fk',
    gcsFileName: 'futuristic_ai_neural_network.png',
    title: 'Futuristic AI Neural Network',
    category: 'tech',
    categoryLabel: 'Tech & AI',
    positiveTags: [
      'ai', 'artificial intelligence', 'neural network', 'deep learning',
      'future tech', 'machine learning', 'algorithm', 'cyber', 'robotics'
    ],
    negativeTags: ['finance', 'cash bills', 'coins']
  },
  {
    cloudinaryId: 'ai-engineer-night-work_b5lwhf',
    gcsFileName: 'ai_engineer_night_work.png',
    title: 'AI Engineer Deep Coding Session',
    category: 'tech',
    categoryLabel: 'Tech & AI',
    positiveTags: [
      'coding', 'software engineer', 'developer', 'night coding', 'programming',
      'hacker', 'deep work', 'building software', 'screens'
    ],
    negativeTags: []
  },
  {
    cloudinaryId: 'creative_mindset_innovation_gears_h7qmzn',
    gcsFileName: 'creative_mindset_innovation_gears.png',
    title: 'Innovation Gears & Creative Ideas',
    category: 'tech',
    categoryLabel: 'Tech & AI',
    positiveTags: [
      'innovation', 'creativity', 'ideas', 'gears', 'brain power',
      'solutions', 'thinking outside box', 'invention', 'strategy'
    ],
    negativeTags: []
  },
  {
    cloudinaryId: 'stock_market_trading_city_laptop_vdidg4',
    gcsFileName: 'stock_market_trading_city_laptop.png',
    title: 'High-Tech Trading & Modern City',
    category: 'tech',
    categoryLabel: 'Tech & AI',
    positiveTags: [
      'city trading', 'finance tech', 'fintech', 'skyline',
      'global finance', 'laptop trading', 'modern commerce'
    ],
    negativeTags: []
  },

  // Workspace & Career
  {
    cloudinaryId: 'modern_workspace_laptop_coffee_planning_o8nkmk',
    gcsFileName: 'modern_workspace_laptop_coffee.png',
    title: 'Modern Workspace Laptop & Coffee',
    category: 'workspace',
    categoryLabel: 'Workspace & Mindset',
    positiveTags: [
      'workspace', 'desk setup', 'laptop', 'coffee', 'remote work',
      'productivity', 'home office', 'clean desk', 'freelance'
    ],
    negativeTags: []
  },
  {
    cloudinaryId: 'entrepreneur_business_growth_strategy_xadbj6',
    gcsFileName: 'entrepreneur_business_growth_strategy.png',
    title: 'Entrepreneur Business Growth Strategy',
    category: 'workspace',
    categoryLabel: 'Workspace & Mindset',
    positiveTags: [
      'entrepreneur', 'founder', 'business growth', 'startup',
      'scaling business', 'leadership', 'vision', 'executive'
    ],
    negativeTags: []
  },
  {
    cloudinaryId: 'develop_financial_skills_with_laptop_oy8gil',
    gcsFileName: 'develop_financial_skills_laptop.png',
    title: 'Developing Skills & Focused Work',
    category: 'workspace',
    categoryLabel: 'Workspace & Mindset',
    positiveTags: [
      'developing skills', 'learning', 'education', 'study', 'upskilling',
      'focused work', 'career growth', 'self improvement'
    ],
    negativeTags: []
  },
  {
    cloudinaryId: 'creator-recording-reel_wpgbdz',
    gcsFileName: 'creator_recording_reel.png',
    title: 'Creator Studio Recording Setup',
    category: 'lifestyle',
    categoryLabel: 'Career & Lifestyle',
    positiveTags: [
      'content creator', 'youtube creator', 'camera', 'microphone',
      'influencer', 'recording', 'video production', 'podcast'
    ],
    negativeTags: []
  },
  {
    cloudinaryId: 'doctor-career-portrait_yhfguf',
    gcsFileName: 'doctor_career_portrait.png',
    title: 'Healthcare & Medical Professional',
    category: 'lifestyle',
    categoryLabel: 'Career & Lifestyle',
    positiveTags: [
      'doctor', 'medical', 'healthcare', 'hospital', 'health',
      'clinic', 'physician', 'medicine'
    ],
    negativeTags: []
  },
  {
    cloudinaryId: 'students-campus-walk_hzgjfo.png',
    cloudinaryId: 'students-campus-walk_hzgjfo',
    gcsFileName: 'students_campus_walk.png',
    title: 'Higher Education & Campus Community',
    category: 'lifestyle',
    categoryLabel: 'Career & Lifestyle',
    positiveTags: [
      'college', 'university', 'students', 'campus', 'degree',
      'education', 'friends', 'graduating'
    ],
    negativeTags: []
  },
  {
    cloudinaryId: 'daily_lifestyle_spending_expenses_mbvhkn',
    gcsFileName: 'daily_lifestyle_spending_expenses.png',
    title: 'Urban Lifestyle & Daily Living',
    category: 'lifestyle',
    categoryLabel: 'Career & Lifestyle',
    positiveTags: [
      'daily lifestyle', 'city life', 'living expenses', 'routine',
      'lifestyle', 'leisure', 'daily habits', 'modern living'
    ],
    negativeTags: []
  }
];

async function transferAssets() {
  console.log('Connecting to Google Cloud Storage...');
  const token = await getGcsAccessToken();
  console.log('Token acquired. Starting asset transfer...');

  const cloudName = 'dhouh9idx';
  const apiKey = '972395946869552';
  const apiSecret = 'wSwqFlvlj0DhvMA5yEXyjlt8uMo';
  const auth = Buffer.from(`${apiKey}:${apiSecret}`).toString('base64');

  const gcsAssetsOutput = [];
  const transferredCloudinaryIds = [];

  for (const item of STOCK_ASSETS_MAP) {
    const cloudinaryUrl = `https://res.cloudinary.com/${cloudName}/image/upload/${item.cloudinaryId}.png`;
    console.log(`Downloading: ${item.cloudinaryId}...`);

    let imgRes = await fetch(cloudinaryUrl);
    if (!imgRes.ok) {
      // try without extension or find from scratch json
      console.warn(`Could not fetch ${cloudinaryUrl} (status ${imgRes.status}), skipping`);
      continue;
    }
    const arrayBuffer = await imgRes.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const gcsPath = `stock-assets/images/${item.gcsFileName}`;
    const uploadUrl = `https://storage.googleapis.com/upload/storage/v1/b/itnavideo-media-assets/o?uploadType=media&name=${encodeURIComponent(gcsPath)}`;

    console.log(`Uploading to GCS: ${gcsPath} (${buffer.length} bytes)...`);
    const uploadRes = await fetch(uploadUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'image/png',
      },
      body: buffer,
    });

    if (uploadRes.status === 200 || uploadRes.status === 201) {
      console.log(`✅ Uploaded ${item.gcsFileName}`);
      const publicUrl = `https://storage.googleapis.com/itnavideo-media-assets/${gcsPath}`;
      gcsAssetsOutput.push({
        id: item.gcsFileName.replace('.png', '').replace(/_/g, '-'),
        title: item.title,
        category: item.category,
        categoryLabel: item.categoryLabel,
        url: publicUrl,
        positiveTags: item.positiveTags,
        negativeTags: item.negativeTags,
      });
      transferredCloudinaryIds.push(item.cloudinaryId);
    } else {
      console.error(`❌ Failed to upload ${item.gcsFileName}:`, uploadRes.status, await uploadRes.text());
    }
  }

  console.log(`\n🎉 Successfully transferred ${gcsAssetsOutput.length} stock images to Google Cloud Storage!`);
  fs.writeFileSync('scratch/gcs_stock_assets.json', JSON.stringify(gcsAssetsOutput, null, 2));

  // Now delete the transferred stock images from Cloudinary
  console.log(`\nDeleting transferred assets from Cloudinary to eliminate duplication...`);
  for (const publicId of transferredCloudinaryIds) {
    try {
      const delRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/resources/image/upload?public_ids[]=${encodeURIComponent(publicId)}`, {
        method: 'DELETE',
        headers: { Authorization: `Basic ${auth}` },
      });
      const delData = await delRes.json();
      console.log(`Deleted Cloudinary asset ${publicId}:`, delData.deleted?.[publicId] || 'ok');
    } catch (e) {
      console.warn(`Could not delete Cloudinary asset ${publicId}:`, e.message);
    }
  }
}

transferAssets().catch(console.error);
