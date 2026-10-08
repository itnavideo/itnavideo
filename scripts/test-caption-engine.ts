// scripts/test-caption-engine.ts
// Comprehensive Automated Test Suite & Quality Gate for Motion Caption Engine

import { createTranscriptDocument, alignEditedTranscript } from '../lib/captions/transcriptAlignment';
import { segmentTranscriptIntoPhrases } from '../lib/captions/phraseSegmenter';
import { analyzePhraseWords, classifyPhraseType, calculateSpeechSpeed } from '../lib/captions/semanticEmphasis';
import { buildResponsiveLayout } from '../lib/captions/layoutEngine';
import { getMotionConfig } from '../lib/captions/motionEngine';
import { STYLE_SYSTEMS, resolveStyleSystem } from '../lib/captions/styleSystems';
import { planCaptionEvents } from '../lib/captions/eventPlanner';
import type { TranscriptWordItem } from '../lib/captions/types';

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition: boolean, testName: string, detail?: string) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✓ PASS: ${testName}`);
  } else {
    failedTests++;
    console.error(`  ✗ FAIL: ${testName}`);
    if (detail) console.error(`    Detail: ${detail}`);
  }
}

async function runTestSuite() {
  console.log('\n============================================================');
  console.log('🧪 MOTION CAPTION ENGINE: AUTOMATED QUALITY GATE & BENCHMARK');
  console.log('============================================================\n');

  // ── TEST SUITE 1: Transcript Alignment & Timestamp Preservation ──────────
  console.log('--- 1. Transcript Alignment & Timestamp Preservation ---');
  
  const initialRaw = 'welcome to teh itna video reel system';
  const initialWords: TranscriptWordItem[] = [
    { id: 'w1', word: 'welcome', start: 0.0, end: 0.4 },
    { id: 'w2', word: 'to', start: 0.45, end: 0.6 },
    { id: 'w3', word: 'teh', start: 0.65, end: 0.9 },
    { id: 'w4', word: 'itna', start: 1.0, end: 1.3 },
    { id: 'w5', word: 'video', start: 1.35, end: 1.7 },
    { id: 'w6', word: 'reel', start: 1.75, end: 2.1 },
    { id: 'w7', word: 'system', start: 2.15, end: 2.6 },
  ];

  const doc = createTranscriptDocument(initialRaw, initialWords, 3.0, 'en');
  assert(doc.version === 'v1-ai', 'Initial document has version v1-ai');
  assert(doc.words.length === 7, 'Initial document has 7 words');

  // User edits: fixes "teh" -> "the", "itna video" -> "ItnaVideo", and adds "super"
  const editedText = 'Welcome to the ItnaVideo super reel system!';
  const expectedWordCount = editedText.trim().split(/\s+/).length; // 7 words
  const alignedDoc = alignEditedTranscript(doc, editedText);

  assert(alignedDoc.version === 'v2-user', 'Aligned document bumped to version v2-user');
  assert(alignedDoc.words.length === expectedWordCount, `Aligned document matches edited word count (${expectedWordCount} words)`);

  // Verify timestamp preservation
  const firstWord = alignedDoc.words[0];
  assert(firstWord.word === 'Welcome' && firstWord.start === 0.0 && firstWord.end === 0.4,
    'Preserves exact timestamps on capitalized word ("Welcome" -> 0.0s..0.4s)');

  const fixedWord = alignedDoc.words[2];
  assert(fixedWord.word === 'the' && fixedWord.start === 0.65 && fixedWord.end === 0.9,
    'Preserves exact timestamps on typo correction ("teh" -> "the" at 0.65s..0.9s)');

  const brandWord = alignedDoc.words[3];
  assert(brandWord.word === 'ItnaVideo' && brandWord.start >= 1.0 && brandWord.end <= 1.7,
    'Preserves timestamp window on merged brand correction ("ItnaVideo")');

  const insertedWord = alignedDoc.words[4];
  assert(insertedWord.isInserted === true && insertedWord.start >= 1.0 && insertedWord.end <= 2.1,
    'Smoothly interpolates timestamps for newly inserted word ("super")');

  // ── TEST SUITE 2: Semantic Clause & Cadence Segmentation ─────────────────
  console.log('\n--- 2. Semantic Clause & Cadence Segmentation ---');

  const longTranscriptWords: TranscriptWordItem[] = [
    { id: '1', word: 'Most', start: 0.0, end: 0.3 },
    { id: '2', word: 'creators', start: 0.35, end: 0.7 },
    { id: '3', word: 'fail', start: 0.75, end: 1.1 },
    { id: '4', word: 'because', start: 1.15, end: 1.4 },
    { id: '5', word: 'their', start: 1.45, end: 1.6 },
    { id: '6', word: 'captions', start: 1.65, end: 2.0 },
    { id: '7', word: 'are', start: 2.05, end: 2.2 },
    { id: '8', word: 'boring.', start: 2.25, end: 2.7 },
    { id: '9', word: 'Turn', start: 3.2, end: 3.5 }, // Pause 0.5s after "boring."
    { id: '10', word: 'every', start: 3.55, end: 3.8 },
    { id: '11', word: 'word', start: 3.85, end: 4.1 },
    { id: '12', word: 'into', start: 4.15, end: 4.3 },
    { id: '13', word: 'pure', start: 4.35, end: 4.6 },
    { id: '14', word: 'gold!', start: 4.65, end: 5.0 },
  ];

  const phrases = segmentTranscriptIntoPhrases(longTranscriptWords, {
    minWordsPerPhrase: 2,
    maxWordsPerPhrase: 4,
    pauseThresholdSeconds: 0.35,
  });

  assert(phrases.length >= 3, `Segments 14 words into coherent clause phrases (got ${phrases.length})`);
  
  // Verify no dangling articles / prepositions at line ends
  const hasDanglingPreposition = phrases.some(p => {
    const last = p.words[p.words.length - 1].word.toLowerCase();
    return ['the', 'a', 'an', 'in', 'on', 'at', 'because', 'into'].includes(last) && p.words.length === 1;
  });
  assert(!hasDanglingPreposition, 'Zero isolated preposition orphan cards');

  // ── TEST SUITE 3: Semantic Emphasis & NLP Classifier ─────────────────────
  console.log('\n--- 3. Semantic Emphasis & NLP Classifier ---');

  const samplePhrase = phrases[0];
  const phraseType = classifyPhraseType(samplePhrase, 0, phrases.length);
  const speechSpeed = calculateSpeechSpeed(samplePhrase.duration, samplePhrase.text.length);
  const { words: scoredWords } = analyzePhraseWords(samplePhrase, phraseType);

  const heroWord = scoredWords.find(w => w.role === 'hero');
  assert(heroWord !== undefined, `Identifies hero word in phrase (Hero: "${heroWord?.word}")`);
  assert(scoredWords.some(w => w.emphasisScore > 0.6), 'Assigns high emphasis scores to high-impact keywords');

  // ── TEST SUITE 4: 10 Style Design Systems Benchmark ──────────────────────
  console.log('\n--- 4. 10 Style Design Systems Benchmark ($49+ Standard) ---');

  const requiredStyles = [
    'dynamic-punch',
    'studio-clean',
    'karaoke-pro',
    'neon-kinetic',
    'dubai-gold',
    'paper-collage',
    'prism-pro',
    'minimal-editorial',
    'marker-highlight',
    'liquid-chrome',
  ];

  for (const styleId of requiredStyles) {
    const preset = STYLE_SYSTEMS[styleId];
    assert(preset !== undefined, `Style System "${styleId}" is registered`);
    assert(preset.defaultTypography.heroWeight >= 600, `Style "${styleId}" has professional hero weight (>=600)`);
    assert(preset.defaultMotion.stiffness >= 100, `Style "${styleId}" has responsive spring physics`);
    assert(preset.defaultLayout.maxLineWidthPx >= 700, `Style "${styleId}" defines title-safe width`);
  }

  // ── TEST SUITE 5: Full End-to-End Caption Plan Generation ────────────────
  console.log('\n--- 5. Full End-to-End Caption Event Planning ---');

  const events = planCaptionEvents(alignedDoc, {
    styleName: 'dynamic-punch',
    canvasWidth: 1080,
    canvasHeight: 1920,
    anchorPosition: 'bottom-center',
  });

  assert(events.length > 0, `Generates structured CaptionEvent stream (${events.length} events)`);
  assert(events[0].motion.family === 'kinetic-slam', 'Applies dynamic-punch kinetic-slam motion family');
  assert(events[0].layout.verticalOffsetPct === 74, 'Positions captions in standard lower third safe zone');
  assert(events[0].words.length > 0, 'Populates word-level animation timestamps');

  // ── TEST SUITE 6: Generic Caption Regression Blocker ─────────────────────
  console.log('\n--- 6. Generic Caption Regression Blocker ---');

  const isGeneric = events.every(e => e.motion.stiffness === 0 && e.typography.heroSizePx === e.typography.leadSizePx);
  assert(!isGeneric, 'Quality Gate: Output is NOT a flat/generic subtitle');

  // ── FINAL SUMMARY ────────────────────────────────────────────────────────
  console.log('\n============================================================');
  console.log(`🏁 TEST RESULTS: ${passedTests}/${totalTests} PASSED (${((passedTests / totalTests) * 100).toFixed(1)}%)`);
  if (failedTests === 0) {
    console.log('🎉 ALL QUALITY GATES PASSED! Production Ready ($49+ Tier).');
  } else {
    console.error(`⚠️ ${failedTests} TESTS FAILED!`);
  }
  console.log('============================================================\n');

  if (failedTests > 0) {
    process.exit(1);
  }
}

runTestSuite().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
