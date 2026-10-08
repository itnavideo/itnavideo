export type SemanticVisualAssetType =
  | 'broll'
  | 'chart'
  | 'metric_card'
  | 'typography_backdrop'
  | 'ui_mockup';

export type MotionAnimationPreset =
  | 'slow_zoom_in'
  | 'slow_zoom_out'
  | 'pan_right'
  | 'scale_pop'
  | 'number_count_up';

export interface SemanticAssetPlan {
  visualIntent: string;
  visualAssetType: SemanticVisualAssetType;
  brollSearchQuery: string;
  avoidKeywords?: string[];
  motion: MotionAnimationPreset;
  highlightedWords: string[];
  suggestedHeading: string;
  suggestedSupportingText: string;
}

export interface VisualSceneDirectorOutput {
  visualDescription: string;
  searchKeywords: string[];
  avoidKeywords: string[];
}

/**
 * Lightweight Visual Scene Director that translates sentence beats into
 * structured visual intents, positive search keywords, and negative avoid keywords.
 */
export async function planVisualSceneIntentWithLLM(sentenceBeat: string): Promise<VisualSceneDirectorOutput> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey) {
    try {
      const prompt = `Analyze this video script line and generate a concise visual scene director intent for video editing stock asset matching.
Script line: "${sentenceBeat}"

Return JSON strictly in this format:
{
  "visualDescription": "short description of the ideal visual scene",
  "searchKeywords": ["3-5 high-relevance search keywords/phrases"],
  "avoidKeywords": ["3-5 negative keywords to explicitly avoid/disqualify"]
}`;

      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: 'application/json' },
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        const parsed = JSON.parse(rawText);
        if (parsed.searchKeywords && parsed.avoidKeywords) {
          return {
            visualDescription: parsed.visualDescription || sentenceBeat,
            searchKeywords: parsed.searchKeywords,
            avoidKeywords: parsed.avoidKeywords,
          };
        }
      }
    } catch (err) {
      console.warn('[VISUAL_DIRECTOR_LLM] Gemini call failed, falling back to deterministic planner:', err);
    }
  }

  // Fallback to deterministic semantic analysis
  const plan = planVisualAssetsForSentence(sentenceBeat);
  return {
    visualDescription: plan.visualIntent,
    searchKeywords: plan.brollSearchQuery.split(/\s+/).filter((w) => w.length > 2),
    avoidKeywords: plan.avoidKeywords || [],
  };
}

/**
 * Deterministic semantic visual asset planner that matches spoken transcript context
 * to exact visual representations, motions, and search queries.
 */
export function planVisualAssetsForSentence(text: string): SemanticAssetPlan {
  const cleanText = text.trim();
  const lower = cleanText.toLowerCase();

  // Keyword extraction for emphasis (words >= 4 letters)
  const words = cleanText.split(/\s+/).map((w) => w.replace(/[^\w]/g, ''));
  const highlightedWords = words.filter((w) => w.length >= 4).slice(0, 3);
  const heading = words.slice(0, 5).join(' ').toUpperCase() || 'KEY INSIGHT';

  const conciseSupportingText = cleanText.split(/\s+/).slice(0, 10).join(' ') + (cleanText.split(/\s+/).length > 10 ? '...' : '');

  // 0. Poverty / Zero Money / Debt / Financial Struggle (Must run BEFORE general money/success)
  const isPovertyOrZeroMoney =
    /\b(zero|no|low|little|without|lack of|out of|empty|broke|poverty|debt|struggling|lost)\b.*\b(money|cash|funds|income|rupees|dollars|savings|earnings)\b/i.test(lower) ||
    /\b(poverty|broke|empty wallet|credit card debt|living paycheck|low earnings|financial crisis|debt|loans|zero money|no money)\b/i.test(lower);

  if (isPovertyOrZeroMoney) {
    return {
      visualIntent: 'Financial struggle, empty wallet, low money or debt burden',
      visualAssetType: 'broll',
      brollSearchQuery: 'empty wallet low money debt broke poverty',
      avoidKeywords: ['wealth', 'rich', 'cash pile', 'luxury', 'millionaire', 'stacks', 'abundance', 'bundle of money'],
      motion: 'slow_zoom_in',
      highlightedWords,
      suggestedHeading: heading,
      suggestedSupportingText: conciseSupportingText,
    };
  }

  // 1. Wealth / Lottery / High Income / Abundance
  const isWealthOrLottery =
    /\b(won|made|millions|billionaire|millionaire|rich|wealth|abundance|jackpot|profit|revenue|gold|cash pile|stacks of cash|lottery)\b/i.test(lower) ||
    (/\b(money|income|revenue|scale|growth)\b/i.test(lower) && !/\b(no|zero|low|lost|lack|without)\b/i.test(lower));

  if (isWealthOrLottery) {
    return {
      visualIntent: 'Wealth accumulation, high revenue, cash abundance or financial freedom',
      visualAssetType: 'metric_card',
      brollSearchQuery: 'wealth rich cash pile financial freedom millions',
      avoidKeywords: ['poverty', 'broke', 'empty wallet', 'debt', 'struggling', 'low money'],
      motion: 'scale_pop',
      highlightedWords,
      suggestedHeading: heading,
      suggestedSupportingText: conciseSupportingText,
    };
  }

  // 2. Metric / Analytics / CTR / Growth Detection
  if (
    lower.includes('ctr') ||
    lower.includes('views') ||
    lower.includes('analytics') ||
    lower.includes('percent') ||
    lower.includes('%') ||
    lower.includes('growth') ||
    lower.includes('subscribers')
  ) {
    return {
      visualIntent: 'Analytics dashboard metric visualization with count up growth',
      visualAssetType: 'chart',
      brollSearchQuery: 'youtube analytics dashboard metrics',
      motion: 'number_count_up',
      highlightedWords,
      suggestedHeading: heading,
      suggestedSupportingText: conciseSupportingText,
    };
  }

  // 3. Creator struggle / Quitting / Failing
  if (
    lower.includes('quit') ||
    lower.includes('stop') ||
    lower.includes('fail') ||
    lower.includes('give up') ||
    lower.includes('mistake') ||
    lower.includes('problem')
  ) {
    return {
      visualIntent: 'Creator experiencing creative burnout or looking at declining metrics',
      visualAssetType: 'broll',
      brollSearchQuery: 'stressed creator desk laptop night',
      avoidKeywords: ['success', 'celebration', 'trophy', 'party'],
      motion: 'slow_zoom_in',
      highlightedWords,
      suggestedHeading: heading,
      suggestedSupportingText: conciseSupportingText,
    };
  }

  // 4. UI / Software / Technical Workflow
  if (
    lower.includes('software') ||
    lower.includes('tool') ||
    lower.includes('app') ||
    lower.includes('dashboard') ||
    lower.includes('website')
  ) {
    return {
      visualIntent: 'Clean modern software dashboard interface highlight',
      visualAssetType: 'ui_mockup',
      brollSearchQuery: 'modern app interface dashboard screen',
      motion: 'pan_right',
      highlightedWords,
      suggestedHeading: heading,
      suggestedSupportingText: conciseSupportingText,
    };
  }

  // Default Cinematic Statement
  return {
    visualIntent: `Cinematic visualization of: ${heading}`,
    visualAssetType: 'broll',
    brollSearchQuery: `${words.slice(0, 3).join(' ')} cinematic studio`,
    motion: 'slow_zoom_out',
    highlightedWords,
    suggestedHeading: heading,
    suggestedSupportingText: conciseSupportingText,
  };
}

