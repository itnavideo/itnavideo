/**
 * Repeatable End-to-End Regression Fixture for the 16:9 Faceless Video Pipeline
 * Run via: npx esbuild scripts/test-faceless-pipeline-regression.ts --bundle --platform=node --format=cjs --outfile=scripts/.tmp-regression.cjs --tsconfig=tsconfig.json && node scripts/.tmp-regression.cjs
 */

import assert from 'node:assert/strict';
import { splitLongSegmentsByWordTimestamps } from '@/services/ai/transcriptAlignment';
import { buildDeterministicSentenceTimeline } from '@/services/ai/sentenceTimelineBuilder';
import { searchS3AssetCatalog } from '@/services/ai/assetCatalogMatcher';
import { matchComponentForScene } from '@/services/ai/componentMatcher';
import { auditAndSelfHealVideoBlueprint, assertPreRenderQualityGate } from '@/services/ai/preRenderQualityAudit';

const SAMPLE_DURATION = 51.28;
const SAMPLE_TRANSCRIPT =
  "Imagine running a restaurant where you don't have to spend thousands of dollars hiring delivery drivers. That's exactly where DoorDash Drive comes in. DoorDash Drive helps restaurants save money by providing access to DoorDash's delivery network for orders placed directly through their own websites, apps, or other channels. Instead of hiring full-time drivers, paying salaries, managing vehicles, and handling delivery operations, restaurants can simply request a delivery whenever they receive an order. This means fewer staffing expenses, lower operational overhead, and no need to maintain an in-house delivery fleet. And here's the biggest advantage. Restaurants can focus their resources on preparing great food and growing their business instead of managing deliveries. DoorDash Drive helps businesses simplify delivery operations and potentially save on the costs of running their own delivery team.";

const SAMPLE_WORDS = SAMPLE_TRANSCRIPT.split(/\s+/).map((word, idx, arr) => {
  const step = SAMPLE_DURATION / arr.length;
  return {
    word,
    start: Number((idx * step).toFixed(3)),
    end: Number(((idx + 1) * step).toFixed(3)),
  };
});

// 1. Verify long segment splitting
const splitSegments = splitLongSegmentsByWordTimestamps(
  [{ start: 0, end: 28.38, text: SAMPLE_TRANSCRIPT }],
  SAMPLE_WORDS,
  8.5
);
assert.ok(splitSegments.length >= 4, `Expected >= 4 split segments, got ${splitSegments.length}`);

// 2. Verify short lead-in merging (< 2.5s)
const timeline = buildDeterministicSentenceTimeline(
  [
    { start: 0, end: 5.2, text: 'Imagine running a restaurant without hiring delivery drivers.' },
    { start: 5.2, end: 6.5, text: "And here's the biggest advantage." },
    { start: 6.5, end: 13.0, text: 'Restaurants can focus on great food instead of deliveries.' },
  ],
  { minDurationSeconds: 2.5, maxDurationSeconds: 18 }
);
assert.equal(timeline.length, 2, 'Short 1.3s lead-in sentence should merge into the following scene');
assert.ok(timeline[1].duration >= 2.5, 'Merged scene duration should be >= 2.5s');

// 3. Verify asset catalog excludes .html & /database-svgs/ on restaurant scripts
const assets = searchS3AssetCatalog(SAMPLE_TRANSCRIPT, { maxResults: 30 });
for (const a of assets) {
  assert.ok(!/\.html?$/i.test(a.url), `Unexpected .html asset returned: ${a.url}`);
  assert.ok(!a.url.includes('/database-svgs/'), `Unexpected database SVG returned: ${a.url}`);
}

// 4. Verify EmailDelayDelivery false-positive is blocked
const comp = matchComponentForScene('restaurants can simply request a delivery whenever they receive an order', 'ON-DEMAND DELIVERY', 4.2);
assert.ok(!comp || comp.componentId !== 'email-delay-delivery', 'EmailDelayDelivery must not match restaurant delivery');

// 5. Verify Pre-Render Quality Gate catches timing gaps & passes healed scenes
const { healedScenes, healedBrollUrls } = auditAndSelfHealVideoBlueprint({
  scenes: timeline.map((t, idx) => ({
    sceneNumber: idx + 1,
    sceneType: idx === 0 ? 'hook' : 'main_point',
    layoutType: idx === 0 ? 'hook' : 'card_concept',
    duration: t.duration,
    heading: idx === 0 ? 'ZERO DRIVER OVERHEAD' : 'FOCUS ON GREAT FOOD',
    supportingText: 'Save delivery costs without an in-house fleet.',
    narrationSegment: { text: t.text, startSeconds: t.start, endSeconds: t.end },
    background: 'solid-white',
    fontHierarchy: { headingFont: 'Lora', bodyFont: 'Lora' },
    animation: 'slow_zoom_in',
    SFX: 'whoosh',
    transition: 'cut',
  })),
  durationSeconds: 13.0,
  backgroundTheme: 'solid-white',
  aspectRatio: '16:9',
  videoType: 'facelessVideo',
  brollUrls: {},
  sfxEvents: [],
});

const gate = assertPreRenderQualityGate({ healedScenes, healedBrollUrls, durationSeconds: 13.0, fps: 30 });
assert.equal(gate.passed, true, `Quality gate failed: ${gate.violations.join('; ')}`);
console.log('ALL FACELESS PIPELINE REGRESSION CHECKS PASSED ✅', {
  splitSegments: splitSegments.length,
  mergedTimelineScenes: timeline.length,
  s3AssetsMatched: assets.length,
  gatePassed: gate.passed,
});

