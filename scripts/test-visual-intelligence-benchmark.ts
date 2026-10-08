import fs from 'fs';
import path from 'path';
import {
  generateVisualSceneIntents,
  retrieveCandidatesForSubBeat,
  rerankCandidatesWithGemini,
  planVisualIntelligenceTimeline,
  VisualSubBeat,
} from '../services/ai/visualPlanner';
import { readEnrichedStockAssets } from '../services/ai/assetPicker';

export type ClassificationResult =
  | 'EXCELLENT_MATCH'
  | 'GOOD_MATCH'
  | 'WEAK_MATCH'
  | 'NO_SUITABLE_ASSET'
  | 'WRONG_MATCH';

export interface BenchmarkTestCase {
  id: number;
  name: string;
  inputScript: string;
  expectedConcept: string;
  requiredKeywords: string[];
  forbiddenDisqualifiers: string[];
}

export const BENCHMARK_TEST_CASES: BenchmarkTestCase[] = [
  {
    id: 1,
    name: 'Very Little Money',
    inputScript: 'He struggled because he had very little money.',
    expectedConcept: 'financial_hardship',
    requiredKeywords: ['wallet', 'coin', 'empty', 'broke', 'budget', 'poverty', 'hardship'],
    forbiddenDisqualifiers: ['wealth', 'rich', 'luxury', 'cash_piles', 'millionaire'],
  },
  {
    id: 2,
    name: 'Huge Wealth',
    inputScript: 'He built a massive real estate empire and became a billionaire.',
    expectedConcept: 'wealth_abundance',
    requiredKeywords: ['estate', 'property', 'empire', 'wealth', 'billionaire', 'mansion', 'building'],
    forbiddenDisqualifiers: ['poverty', 'empty_wallet', 'broke', 'debt'],
  },
  {
    id: 3,
    name: 'Poor Family',
    inputScript: 'The family lived in a tiny, worn-down apartment.',
    expectedConcept: 'poverty_struggle',
    requiredKeywords: ['apartment', 'decay', 'poverty', 'family', 'budget', 'small'],
    forbiddenDisqualifiers: ['mansion', 'luxury_penthouse', 'wealth'],
  },
  {
    id: 4,
    name: 'Rich Businessman',
    inputScript: 'The CEO arrived in a private jet for the global summit.',
    expectedConcept: 'executive_wealth',
    requiredKeywords: ['ceo', 'jet', 'executive', 'summit', 'businessman', 'aviation'],
    forbiddenDisqualifiers: ['warehouse_worker', 'poverty', 'broke'],
  },
  {
    id: 5,
    name: 'Financial Hardship',
    inputScript: 'Unpaid bills stacked up on the kitchen counter.',
    expectedConcept: 'financial_hardship',
    requiredKeywords: ['bill', 'unpaid', 'debt', 'calculator', 'budget', 'hardship'],
    forbiddenDisqualifiers: ['wealth', 'profit_chart', 'luxury'],
  },
  {
    id: 6,
    name: 'Luxury Lifestyle',
    inputScript: 'She spent weekends sailing on private yachts.',
    expectedConcept: 'luxury_leisure',
    requiredKeywords: ['yacht', 'sailing', 'luxury', 'boat', 'ocean', 'leisure'],
    forbiddenDisqualifiers: ['budget_bus', 'poverty', 'broke'],
  },
  {
    id: 7,
    name: 'Fear / Anxiety',
    inputScript: 'He panicked as the market crashed overnight.',
    expectedConcept: 'market_crisis',
    requiredKeywords: ['crash', 'market', 'stock', 'decline', 'panic', 'chart'],
    forbiddenDisqualifiers: ['party_celebration', 'joyful_laughter'],
  },
  {
    id: 8,
    name: 'Happiness',
    inputScript: "They celebrated their team's historic victory.",
    expectedConcept: 'celebration_victory',
    requiredKeywords: ['celebration', 'victory', 'cheer', 'winning', 'team', 'happy'],
    forbiddenDisqualifiers: ['solitary_crying', 'funeral', 'depression'],
  },
  {
    id: 9,
    name: 'Loneliness',
    inputScript: 'He sat alone in the quiet diner late at night.',
    expectedConcept: 'solitude_night',
    requiredKeywords: ['diner', 'night', 'alone', 'solitude', 'quiet'],
    forbiddenDisqualifiers: ['crowded_stadium', 'bustling_festival'],
  },
  {
    id: 10,
    name: 'Crowded City',
    inputScript: 'Thousands of commuters flooded the subway station.',
    expectedConcept: 'dense_urban_commute',
    requiredKeywords: ['subway', 'commuter', 'crowd', 'station', 'city', 'transit'],
    forbiddenDisqualifiers: ['empty_desert', 'deserted_field'],
  },
  {
    id: 11,
    name: 'Empty City',
    inputScript: 'The streets were completely deserted at dawn.',
    expectedConcept: 'empty_street_dawn',
    requiredKeywords: ['street', 'empty', 'deserted', 'dawn', 'quiet', 'city'],
    forbiddenDisqualifiers: ['traffic_jam', 'crowded_sidewalk'],
  },
  {
    id: 12,
    name: 'Growth',
    inputScript: 'Her small startup revenue doubled every quarter.',
    expectedConcept: 'business_growth',
    requiredKeywords: ['growth', 'revenue', 'chart', 'analytics', 'startup', 'strategy'],
    forbiddenDisqualifiers: ['bankruptcy', 'falling_chart'],
  },
  {
    id: 13,
    name: 'Decline',
    inputScript: 'The ancient empire slowly collapsed over centuries.',
    expectedConcept: 'decline_ruins',
    requiredKeywords: ['empire', 'ruins', 'collapse', 'ancient', 'decline'],
    forbiddenDisqualifiers: ['futuristic_skyscraper', 'boom'],
  },
  {
    id: 14,
    name: 'Small Amount',
    inputScript: 'She saved a few spare coins in a glass jar.',
    expectedConcept: 'small_savings',
    requiredKeywords: ['coin', 'jar', 'savings', 'wallet', 'small', 'budget'],
    forbiddenDisqualifiers: ['bank_vault', 'gold_reserve', 'cash_stacks'],
  },
  {
    id: 15,
    name: 'Large Amount',
    inputScript: 'The bank stored millions in secured vaults.',
    expectedConcept: 'cash_reserve',
    requiredKeywords: ['vault', 'bank', 'cash', 'reserve', 'hundred', 'dollars'],
    forbiddenDisqualifiers: ['empty_wallet', 'single_coin', 'broke'],
  },
  {
    id: 16,
    name: 'Before / After',
    inputScript: 'From a humble garage setup to a global tech giant.',
    expectedConcept: 'garage_to_giant',
    requiredKeywords: ['garage', 'tech', 'city', 'trading', 'growth', 'modern'],
    forbiddenDisqualifiers: [],
  },
  {
    id: 17,
    name: 'Specific Context',
    inputScript: 'The researcher inspected bacteria under a microscope.',
    expectedConcept: 'science_lab',
    requiredKeywords: ['microscope', 'bacteria', 'lab', 'researcher', 'science'],
    forbiddenDisqualifiers: ['coffee_shop', 'beach_resort'],
  },
];

export async function runVisualIntelligenceBenchmark() {
  console.log('================================================================');
  console.log('STRICT VISUAL INTELLIGENCE BENCHMARK (17 CONTEXTUAL TEST CASES)');
  console.log('================================================================\n');

  const enrichedStock = readEnrichedStockAssets();
  const resultsSummary: any[] = [];

  let trueVisualMatchPassCount = 0;
  let wrongMatchCount = 0;
  let noSuitableAssetCount = 0;
  let weakMatchCount = 0;

  for (const testCase of BENCHMARK_TEST_CASES) {
    console.log(`[TEST ${testCase.id}/17] ${testCase.name}`);
    console.log(`Input Script: "${testCase.inputScript}"`);

    // Run full pipeline via planVisualIntelligenceTimeline
    const scenes = await planVisualIntelligenceTimeline({
      words: [{ word: testCase.inputScript, start: 0, end: 3.5 }],
      totalDuration: 3.5,
      uploadedImages: [],
      userPrompt: testCase.inputScript,
    });

    const scene = scenes[0];
    const isTypography = scene?.sceneType === 'typography' || !scene?.imageUrl;
    const selectedTitle = isTypography ? 'Typography Insight' : scene.title || 'Visual Asset';
    const selectedUrl = isTypography ? 'NONE' : scene.imageUrl;

    let classification: ClassificationResult = 'NO_SUITABLE_ASSET';
    let isTrueVisualPass = false;
    let failureReason = '';

    if (isTypography) {
      classification = 'NO_SUITABLE_ASSET';
      noSuitableAssetCount++;
      console.log(`Selected Output: 🔤 [TYPOGRAPHY FALLBACK] "${selectedTitle}"`);
      console.log(`Reasoning: No stock asset matched required concept "${testCase.expectedConcept}". Deliberate fallback triggered.`);
    } else {
      const titleLower = selectedTitle.toLowerCase();

      // Check if selected image title/tags genuinely contain any required keywords or context
      const matchesRequiredKeyword = testCase.requiredKeywords.some((kw) => titleLower.includes(kw.toLowerCase()));

      let matchesForbidden = false;
      for (const forbidden of testCase.forbiddenDisqualifiers) {
        if (titleLower.includes(forbidden.toLowerCase().replace(/_/g, ' '))) {
          matchesForbidden = true;
          break;
        }
      }

      if (matchesForbidden || !matchesRequiredKeyword) {
        classification = 'WRONG_MATCH';
        wrongMatchCount++;
        failureReason = `Asset "${selectedTitle}" is semantically unrelated to required concept "${testCase.expectedConcept}".`;
        console.log(`Selected Output: 🖼️ [IMAGE] "${selectedTitle}"`);
        console.log(`Classification: ❌ WRONG_MATCH (${failureReason})`);
      } else {
        classification = 'GOOD_MATCH';
        isTrueVisualPass = true;
        trueVisualMatchPassCount++;
        console.log(`Selected Output: 🖼️ [IMAGE] "${selectedTitle}"`);
        console.log(`Classification: ✅ GOOD_MATCH (Genuinely matches "${testCase.expectedConcept}")`);
      }
    }

    console.log(`Overall Classification: ${classification}\n`);

    resultsSummary.push({
      testId: testCase.id,
      name: testCase.name,
      inputScript: testCase.inputScript,
      expectedConcept: testCase.expectedConcept,
      selectedTitle,
      selectedUrl,
      classification,
      isTrueVisualPass,
      failureReason,
    });
  }

  // Save detailed report artifact
  const reportPath = path.join(process.cwd(), 'benchmark_results_report.json');
  fs.writeFileSync(reportPath, JSON.stringify(resultsSummary, null, 2));

  console.log('================================================================');
  console.log('STRICT VISUAL INTELLIGENCE BENCHMARK SUMMARY');
  console.log('================================================================');
  console.log(`True Visual-Match Pass Count  : ${trueVisualMatchPassCount}`);
  console.log(`Wrong-Match Count (FAILS)     : ${wrongMatchCount}`);
  console.log(`No-Suitable-Asset Count       : ${noSuitableAssetCount} (Deliberate Typography Fallbacks)`);
  console.log('================================================================\n');

  return resultsSummary;
}

if (require.main === module) {
  runVisualIntelligenceBenchmark();
}
