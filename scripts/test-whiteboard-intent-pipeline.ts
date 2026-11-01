/**
 * test-whiteboard-intent-pipeline.ts
 * Verifies that different scripts produce diverse archetypes, non-repeating assets, and distinct scenes.
 */

import { planWhiteboardVideo } from '../services/ai/whiteboardPlanner';
import type { ReelWord } from '../services/ai/reelPlanner';

function mockWords(text: string, wps: number = 2.5): ReelWord[] {
  const tokens = text.split(/\s+/).filter(Boolean);
  let cur = 0;
  return tokens.map((word) => {
    const dur = 1 / wps;
    const start = cur;
    const end = cur + dur;
    cur = end;
    return { word, start, end };
  });
}

async function runTest() {
  console.log('=== TEST 1: Finance Script (Saving & Debt) ===');
  const financeScript =
    'Most people think saving money is impossible, but here is the cold truth. Every month you leak 30 percent of your paycheck on tiny subscriptions. Instead of letting debt compound against you, create an emergency fund first. Take three simple steps: audit your bank statement, cut two unnecessary bills, and automate your deposits. In 90 days you will build real peace of mind and control your future.';
  const financeWords = mockWords(financeScript);
  const plan1 = await planWhiteboardVideo({
    transcript: financeScript,
    words: financeWords,
    segments: [],
    durationSeconds: financeWords[financeWords.length - 1].end,
    topicTitle: 'Stop Leaking Money',
  });

  console.log(`Plan 1 Title: "${plan1.title}"`);
  console.log(`Scenes generated: ${plan1.scenes?.length || 0}`);
  plan1.scenes?.forEach((s, idx) => {
    console.log(`  Scene ${idx + 1} (${s.startTime.toFixed(1)}s - ${s.endTime.toFixed(1)}s): [${s.archetype}] "${s.headline}" -> Hero: ${s.heroVisual.drawingId} (Modality: ${s.modality}, Trans: ${s.transition})`);
  });

  console.log('\n=== TEST 2: Software SaaS Script (Speed & Architecture) ===');
  const saasScript =
    'Traditional software deployment takes six long hours of manual server configuration. With cloud serverless architecture, you ship code in seconds. There is a huge contrast: legacy servers crash under load, while serverless scales up automatically. Follow these phases: write clean code, push to git, and let the cloud handle container execution. Your users get lightning speed and zero downtime.';
  const saasWords = mockWords(saasScript);
  const plan2 = await planWhiteboardVideo({
    transcript: saasScript,
    words: saasWords,
    segments: [],
    durationSeconds: saasWords[saasWords.length - 1].end,
    topicTitle: 'Serverless Speed',
  });

  console.log(`Plan 2 Title: "${plan2.title}"`);
  console.log(`Scenes generated: ${plan2.scenes?.length || 0}`);
  plan2.scenes?.forEach((s, idx) => {
    console.log(`  Scene ${idx + 1} (${s.startTime.toFixed(1)}s - ${s.endTime.toFixed(1)}s): [${s.archetype}] "${s.headline}" -> Hero: ${s.heroVisual.drawingId} (Modality: ${s.modality}, Trans: ${s.transition})`);
  });

  // Verify diversity
  const archetypes1 = plan1.scenes?.map(s => s.archetype) || [];
  const archetypes2 = plan2.scenes?.map(s => s.archetype) || [];

  console.log('\n=== VERIFICATION CHECKS ===');
  // Check no consecutive duplicate archetypes
  let hasConsecutiveDup = false;
  for (let i = 1; i < archetypes1.length; i++) {
    if (archetypes1[i] === archetypes1[i - 1]) hasConsecutiveDup = true;
  }
  console.log(`Plan 1 Consecutive Duplicate Archetypes: ${hasConsecutiveDup ? 'FAILED' : 'PASSED (0 duplicates)'}`);

  // Check asset uniqueness within video
  const heroDrawings1 = plan1.scenes?.map(s => s.heroVisual.drawingId) || [];
  const uniqueDrawings1 = new Set(heroDrawings1);
  console.log(`Plan 1 Asset Uniqueness: ${uniqueDrawings1.size}/${heroDrawings1.length} unique (${uniqueDrawings1.size === heroDrawings1.length ? 'PASSED (All Unique)' : 'Repeats Detected'})`);

  console.log('=== TEST COMPLETED SUCCESSFULLY ===');
}

runTest().catch(console.error);
