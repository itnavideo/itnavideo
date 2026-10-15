import fs from 'node:fs';
import path from 'node:path';
import { validateAndAlignTranscript } from '../services/ai/transcriptAlignment.ts';
import { cancelJob, isJobCancelled } from '../lib/jobs/cancellationRegistry.ts';
import { smartMatchUploadedImagesToScenes } from '../services/ai/smartMediaMatcher.ts';
import { buildDeterministicSceneBlueprint } from '../services/ai/aiScenePlanner.ts';

const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';
const CYAN = '\x1b[36m';

console.log(`${BOLD}${CYAN}======================================================================`);
console.log(`      ITNAVIDEO — Faceless Video Workflow & Quality Test Suite`);
console.log(`======================================================================${RESET}\n`);

let passedCount = 0;
let failedCount = 0;

function assert(description, condition, details = '') {
  if (condition) {
    passedCount++;
    console.log(`  [${GREEN}PASS${RESET}] ${description}`);
  } else {
    failedCount++;
    console.log(`  [${RED}FAIL${RESET}] ${description}`);
    if (details) console.log(`         ↳ ${RED}${details}${RESET}`);
  }
}

// ── TEST 1: Unmodified Transcript Alignment ──
console.log(`\n${BOLD}1. Transcript Alignment & Boundary Validation:${RESET}`);
const sampleOriginal = "Welcome to this complete guide on artificial intelligence and automated video creation.";
const sampleSegments = [
  { start: 0.0, end: 3.2, text: "Welcome to this complete guide on artificial intelligence" },
  { start: 3.3, end: 6.0, text: "and automated video creation." },
];

const res1 = validateAndAlignTranscript(sampleSegments, sampleOriginal, 6.0);
assert("Unmodified transcript is valid", res1.isValid);
assert("Unmodified transcript reports isEdited: false", !res1.isEdited);
assert("All words have valid timestamps within segment bounds", 
  res1.repairedSegments[0].words.every(w => w.start >= 0.0 && w.end <= 3.25)
);

// ── TEST 2: Edited Transcript with Warning & Alignment ──
console.log(`\n${BOLD}2. Edited Transcript Detection & Safe Realignment:${RESET}`);
const editedSegments = [
  { start: 0.0, end: 3.2, text: "Welcome to this ultimate YouTube breakdown on generative AI tools" },
  { start: 3.3, end: 6.0, text: "and automated video creation." },
];

const res2 = validateAndAlignTranscript(editedSegments, sampleOriginal, 6.0);
assert("Edited transcript is marked as edited", res2.isEdited);
assert("Warning is generated informing user of original audio preservation", 
  res2.warnings.length > 0 && res2.warnings.some(w => w.includes("Original voiceover audio") || w.includes("audio is preserved") || w.includes("Spoken narration audio"))
);
assert("Edited words are safely aligned within sentence duration", 
  res2.repairedSegments[0].words.length === 10 && res2.repairedSegments[0].words[9].end <= 3.25
);

// ── TEST 3: Semantic Asset Matching (No Forced Irrelevant Images) ──
console.log(`\n${BOLD}3. Semantic Asset Matching & Irrelevant Image Suppression:${RESET}`);
const mockScenes = [
  {
    sceneNumber: 1,
    heading: "FINANCIAL GROWTH",
    supportingText: "Quarterly revenue climbed drastically.",
    narrationSegment: { text: "Quarterly revenue climbed drastically.", startSeconds: 0, endSeconds: 4 },
  },
  {
    sceneNumber: 2,
    heading: "MEDIEVAL HISTORY",
    supportingText: "Ancient castles and knights in armor.",
    narrationSegment: { text: "Ancient castles and knights in armor.", startSeconds: 4, endSeconds: 8 },
  },
];

// Candidates: 1 image relevant to finance, 1 image about food/pizza (completely irrelevant to medieval history)
const candidates = [
  { key: "img_0", fileName: "finance_revenue_chart.png", url: "https://cloud.com/finance.png" },
  { key: "img_1", fileName: "delicious_pizza_slice.jpg", url: "https://cloud.com/pizza.jpg" },
];

const mappedMatches = smartMatchUploadedImagesToScenes(mockScenes, candidates);
assert("Finance image matched to scene 1 (revenue)", mappedMatches[1] === "https://cloud.com/finance.png");
assert("Pizza image is NOT forced into scene 2 (medieval history)", mappedMatches[2] === undefined);

// ── TEST 4: Intelligent Scene Transition Engine ──
console.log(`\n${BOLD}4. Intelligent Scene Transitions (Cut, Dissolve, Slide, Zoom, Fade to Black):${RESET}`);
const multiBeatTranscript = [
  { start: 0, end: 4, text: "Here is the biggest secret you never knew about video editing." },
  { start: 4, end: 8, text: "Let us examine three key strategies for high retention channels." },
  { start: 8, end: 12, text: "First is clean pacing, second is sound design, third is visual variety." },
  { start: 12, end: 16, text: "In conclusion, follow these steps to scale your YouTube audience." },
];

const blueprint = buildDeterministicSceneBlueprint(multiBeatTranscript, {
  title: "Testing Transitions",
});

const hookScene = blueprint.scenes.find(s => s.sceneType === "hook" || s.sceneNumber === 1);
const conclusionScene = blueprint.scenes.find(s => s.sceneType === "next_point" || s.sceneNumber === blueprint.scenes.length);

assert("Hook scene uses dramatic zoom transition", hookScene?.transition === "zoom");
assert("Conclusion scene uses fade_to_black transition", conclusionScene?.transition === "fade_to_black");
assert("Every scene has an approved editorial transition", 
  blueprint.scenes.every(s => ["cut", "dissolve", "crossfade", "slide", "zoom", "fade_to_black"].includes(s.transition))
);

// ── TEST 5: Job Cancellation Persistence Registry ──
console.log(`\n${BOLD}5. Reliable Cancellation Registry & Refresh Persistence:${RESET}`);
const testRenderId = `test-render-${Date.now()}`;
assert("Non-cancelled job returns false", !isJobCancelled(testRenderId));
cancelJob(testRenderId);
assert("Cancelled job returns true immediately", isJobCancelled(testRenderId));

// ── SUMMARY REPORT ──
console.log(`\n${BOLD}======================================================================`);
console.log(`  Tests Passed: ${GREEN}${passedCount}${RESET} / ${passedCount + failedCount}`);
if (failedCount > 0) {
  console.log(`  Tests Failed: ${RED}${failedCount}${RESET}`);
}
console.log(`======================================================================${RESET}\n`);

if (failedCount > 0) process.exit(1);
