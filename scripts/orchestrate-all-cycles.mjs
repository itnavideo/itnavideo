// scripts/orchestrate-all-cycles.mjs
import { execSync } from 'node:child_process';
import fs from 'node:fs';

const AUDIO_SHORT = 'https://res.cloudinary.com/dhouh9idx/video/upload/v1792260303/1_w4wthb.mp3';
const AUDIO_LONG = 'https://res.cloudinary.com/dhouh9idx/video/upload/v1792260458/koyal-speech_ciclnq.wav';

const SUITE = [
  // === 1. BOOK SUMMARY (4 Cycles) ===
  { mode: 'bookSummary', label: 'Book Summary Cycle 1', script: 'scripts/run-book-summary-cycle.mjs', audio: AUDIO_SHORT, title: 'The Psychology of Money', author: 'Morgan Housel' },
  { mode: 'bookSummary', label: 'Book Summary Cycle 2', script: 'scripts/run-book-summary-cycle.mjs', audio: AUDIO_SHORT, title: 'Rich Dad Poor Dad', author: 'Robert Kiyosaki' },
  { mode: 'bookSummary', label: 'Book Summary Cycle 3', script: 'scripts/run-book-summary-cycle.mjs', audio: AUDIO_LONG, title: "Can't Hurt Me", author: 'David Goggins' },
  { mode: 'bookSummary', label: 'Book Summary Cycle 4', script: 'scripts/run-book-summary-cycle.mjs', audio: AUDIO_LONG, title: 'Atomic Habits', author: 'James Clear' },

  // === 2. IMAGE TO VIDEO AI (4 Cycles) ===
  { mode: 'imageToVideoAi', label: 'Image to Video AI Cycle 1', script: 'scripts/run-image-to-video-cycle.mjs', audio: AUDIO_SHORT, title: 'The Path to Financial Wealth' },
  { mode: 'imageToVideoAi', label: 'Image to Video AI Cycle 2', script: 'scripts/run-image-to-video-cycle.mjs', audio: AUDIO_SHORT, title: 'Mastering the Compounding Effect' },
  { mode: 'imageToVideoAi', label: 'Image to Video AI Cycle 3', script: 'scripts/run-image-to-video-cycle.mjs', audio: AUDIO_LONG, title: 'The Unbreakable Will' },
  { mode: 'imageToVideoAi', label: 'Image to Video AI Cycle 4', script: 'scripts/run-image-to-video-cycle.mjs', audio: AUDIO_LONG, title: 'From Adversity to Victory' },

  // === 3. AUTO CAPTION REEL (4 Cycles) ===
  { mode: 'autoCaption', label: 'Auto Caption Reel Cycle 1', script: 'scripts/run-autocaption-cycle.mjs', audio: AUDIO_SHORT, title: 'Daily Discipline Over Motivation' },
  { mode: 'autoCaption', label: 'Auto Caption Reel Cycle 2', script: 'scripts/run-autocaption-cycle.mjs', audio: AUDIO_SHORT, title: 'The Silent Grind' },
  { mode: 'autoCaption', label: 'Auto Caption Reel Cycle 3', audio: AUDIO_LONG, script: 'scripts/run-autocaption-cycle.mjs', title: 'Why Giving Up Is Never An Option' },
  { mode: 'autoCaption', label: 'Auto Caption Reel Cycle 4', audio: AUDIO_LONG, script: 'scripts/run-autocaption-cycle.mjs', title: 'Mastering Emotional Resilience' },

  // === 4. KINETIC TYPOGRAPHY (4 Cycles) ===
  { mode: 'typographyVideo', label: 'Typography Video Cycle 1', script: 'scripts/run-typography-cycle.mjs', audio: AUDIO_SHORT, title: 'The Compounding Effect' },
  { mode: 'typographyVideo', label: 'Typography Video Cycle 2', script: 'scripts/run-typography-cycle.mjs', audio: AUDIO_SHORT, title: 'Wealth Is What You Do Not See' },
  { mode: 'typographyVideo', label: 'Typography Video Cycle 3', script: 'scripts/run-typography-cycle.mjs', audio: AUDIO_LONG, title: 'Conquer The Resistance' },
  { mode: 'typographyVideo', label: 'Typography Video Cycle 4', script: 'scripts/run-typography-cycle.mjs', audio: AUDIO_LONG, title: 'Relentless Execution' },

  // === 5. COMPARE EXPLAINER (4 Cycles) ===
  { mode: 'compare', label: 'Compare Explainer Cycle 1', script: 'scripts/run-compare-cycle.mjs', audio: AUDIO_SHORT, title: 'Saving vs Investing' },
  { mode: 'compare', label: 'Compare Explainer Cycle 2', script: 'scripts/run-compare-cycle.mjs', audio: AUDIO_SHORT, title: 'Assets vs Liabilities' },
  { mode: 'compare', label: 'Compare Explainer Cycle 3', script: 'scripts/run-compare-cycle.mjs', audio: AUDIO_LONG, title: 'Giving Up vs Perseverance' },
  { mode: 'compare', label: 'Compare Explainer Cycle 4', script: 'scripts/run-compare-cycle.mjs', audio: AUDIO_LONG, title: 'Fear vs Relentless Focus' },

  // === 6. WHITEBOARD VIDEO (4 Cycles) ===
  { mode: 'whiteboardVideo', label: 'Whiteboard Video Cycle 1', script: 'scripts/run-whiteboard-cycle.mjs', audio: AUDIO_SHORT, title: 'The Compounding Interest Engine' },
  { mode: 'whiteboardVideo', label: 'Whiteboard Video Cycle 2', script: 'scripts/run-whiteboard-cycle.mjs', audio: AUDIO_SHORT, title: '3 Rules of Financial Freedom' },
  { mode: 'whiteboardVideo', label: 'Whiteboard Video Cycle 3', script: 'scripts/run-whiteboard-cycle.mjs', audio: AUDIO_LONG, title: 'Building Mental Toughness' },
  { mode: 'whiteboardVideo', label: 'Whiteboard Video Cycle 4', script: 'scripts/run-whiteboard-cycle.mjs', audio: AUDIO_LONG, title: 'The Psychology of Daily Execution' },
];

console.log('================================================================');
console.log(`🚀 [ORCHESTRATOR] STARTING FULL SUITE: ${SUITE.length} CYCLES`);
console.log('================================================================');

const results = [];

for (let i = 0; i < SUITE.length; i++) {
  const item = SUITE[i];
  console.log(`\n================================================================`);
  console.log(`▶️ [CYCLE ${i + 1}/${SUITE.length}] ${item.label.toUpperCase()}`);
  console.log(`   Mode: ${item.mode} | Title: "${item.title}"`);
  console.log(`   Audio: ${item.audio}`);
  console.log(`================================================================`);

  const startTime = Date.now();
  let status = 'SUCCESS';
  let errorMsg = null;

  try {
    const authorArg = item.author ? ` "${item.author}"` : '';
    const cmd = `node ${item.script} "${item.audio}" "${item.title}"${authorArg}`;
    execSync(cmd, { stdio: 'inherit' });
  } catch (err) {
    status = 'FAILED';
    errorMsg = err.message;
    console.error(`❌ [CYCLE ${i + 1}] FAILED:`, err.message);
  }

  const durationSec = Math.round((Date.now() - startTime) / 1000);
  results.push({
    index: i + 1,
    mode: item.mode,
    label: item.label,
    title: item.title,
    audio: item.audio,
    status,
    durationSec,
    errorMsg,
  });

  fs.writeFileSync('scripts/benchmark-results.json', JSON.stringify(results, null, 2));
  console.log(`📊 Progress saved to scripts/benchmark-results.json (${results.length}/${SUITE.length} done)`);
}

console.log('\n================================================================');
console.log('🎉 [ORCHESTRATOR] MASTER EXECUTION FINISHED');
console.log('================================================================');
console.table(results.map(r => ({ Mode: r.mode, Label: r.label, Status: r.status, Duration: `${r.durationSec}s` })));
