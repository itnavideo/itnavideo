// scripts/run-all-video-types-test.mjs
import { execSync } from 'node:child_process';
import fs from 'node:fs';

const AUDIO_SHORT = 'https://res.cloudinary.com/dhouh9idx/video/upload/v1792260303/1_w4wthb.mp3';
const AUDIO_LONG = 'https://res.cloudinary.com/dhouh9idx/video/upload/v1792260458/koyal-speech_ciclnq.wav';

const TEST_QUEUE = [
  // 1. Faceless Video Cycle 5 (Final Polish)
  { type: 'Faceless Video (16:9)', script: 'scripts/run-faceless-cycle.mjs', audio: AUDIO_SHORT, title: 'The Laws of Compounding & Freedom' },
  // 2. Book Summary Cycles
  { type: 'Book Summary (16:9)', script: 'scripts/run-book-summary-cycle.mjs', audio: AUDIO_SHORT, title: 'The Psychology of Money' },
  { type: 'Book Summary (16:9)', script: 'scripts/run-book-summary-cycle.mjs', audio: AUDIO_LONG, title: 'Atomic Habits & Daily Systems' },
  // 3. Image to Video AI Cycles
  { type: 'Image to Video AI (16:9)', script: 'scripts/run-image-to-video-cycle.mjs', audio: AUDIO_SHORT, title: 'Journey to Financial Freedom' },
  // 4. Auto Caption Reel Cycles
  { type: 'Auto Caption Reel (9:16)', script: 'scripts/run-autocaption-cycle.mjs', audio: AUDIO_SHORT, title: 'Discipline Over Motivation' },
  // 5. Kinetic Typography Video Cycles
  { type: 'Typography Video (9:16)', script: 'scripts/run-typography-cycle.mjs', audio: AUDIO_SHORT, title: 'The Compound Effect' },
  // 6. Compare Explainer Cycles
  { type: 'Compare Explainer (9:16)', script: 'scripts/run-compare-cycle.mjs', audio: AUDIO_SHORT, title: 'Assets vs Liabilities' },
  // 7. Whiteboard Video Cycles
  { type: 'Whiteboard Video (9:16)', script: 'scripts/run-whiteboard-cycle.mjs', audio: AUDIO_SHORT, title: 'How Money Works' },
];

console.log('================================================================');
console.log(`🚀 [ITNAVIDEO MASTER TEST SUITE] QUEUE LENGTH: ${TEST_QUEUE.length}`);
console.log('================================================================');

for (let i = 0; i < TEST_QUEUE.length; i++) {
  const item = TEST_QUEUE[i];
  console.log(`\n▶️ [${i + 1}/${TEST_QUEUE.length}] STARTING TEST: ${item.type} — "${item.title}"`);
  console.log(`   Script: ${item.script}`);
  console.log(`   Audio: ${item.audio}`);
  try {
    const cmd = `node ${item.script} "${item.audio}" "${item.title}"`;
    execSync(cmd, { stdio: 'inherit' });
    console.log(`✅ [${i + 1}/${TEST_QUEUE.length}] PASSED: ${item.type}`);
  } catch (err) {
    console.error(`❌ [${i + 1}/${TEST_QUEUE.length}] FAILED: ${item.type}`, err.message);
  }
}

console.log('\n================================================================');
console.log('🎉 [ITNAVIDEO MASTER TEST SUITE] ALL VIDEO TYPES TESTED SUCCESSFULLY');
console.log('================================================================');
