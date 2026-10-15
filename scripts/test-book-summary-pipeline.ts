import path from 'node:path';
import fs from 'node:fs';
import { loadEnvLocal } from './load-env-local.mjs';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { transcribeMediaUrlWithGroq } from '../services/ai/groqTranscription';
import { buildLocalBookSummaryPlan, validateAndRepairBookSummaryPlan, type BookSummaryPlanRequest } from '../services/ai/bookSummaryPlanner';
import { VIDEO_TYPE_REGISTRY } from '../services/ai/reelPlanner';
import { calculateRenderCreditUnits } from '../lib/billing/creditPricing';

const rootDir = process.cwd();
loadEnvLocal(rootDir);

const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';
const CYAN = '\x1b[36m';
const BOLD = '\x1b[1m';
const RESET = '\x1b[0m';

console.log(`${BOLD}${CYAN}======================================================================`);
console.log(`      ITNAVIDEO — BOOK SUMMARY 16:9 PIPELINE END-TO-END TEST`);
console.log(`  Audio: 1.mp3 | Format: 16:9 Widescreen | Limit: 10 Min | Rule 4.1 Billing`);
console.log(`======================================================================${RESET}\n`);

const region = process.env.AWS_REGION || process.env.REMOTION_AWS_REGION || 'us-east-1';
const bucketName = process.env.AWS_S3_BUCKET_NAME || process.env.REMOTION_LAMBDA_BUCKET_NAME || 'remotionlambda-useast1-2zq6twaok1';

const s3 = new S3Client({
  region,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || process.env.REMOTION_AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || process.env.REMOTION_AWS_SECRET_ACCESS_KEY || '',
  },
});

const LOCAL_AUDIO_PATH = 'C:\\Users\\Akram Editor Studio\\Downloads\\1.mp3';

let passCount = 0;
let failCount = 0;

function check(title: string, condition: boolean, info: string = '') {
  if (condition) {
    passCount++;
    console.log(`  [${GREEN}PASS${RESET}] ${title}`);
    if (info) console.log(`         ↳ ${info}`);
  } else {
    failCount++;
    console.log(`  [${RED}FAIL${RESET}] ${title}`);
    if (info) console.log(`         ↳ ${RED}${info}${RESET}`);
  }
}

async function run() {
  console.log(`${BOLD}1. Audio File Ingestion & Cloud Upload${RESET}`);
  check('Audio file exists locally', fs.existsSync(LOCAL_AUDIO_PATH), LOCAL_AUDIO_PATH);
  const fileBytes = fs.readFileSync(LOCAL_AUDIO_PATH);
  console.log(`     File size: ${(fileBytes.length / 1024).toFixed(1)} KB`);

  const s3Key = `test-runs/book-summary-test-${Date.now()}.mp3`;
  await s3.send(new PutObjectCommand({
    Bucket: bucketName,
    Key: s3Key,
    Body: fileBytes,
    ContentType: 'audio/mpeg',
  }));
  const cloudAudioUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${s3Key}`;
  check('Uploaded to AWS S3 bucket', Boolean(cloudAudioUrl), cloudAudioUrl);

  console.log(`\n${BOLD}2. Groq Whisper Cloud Speech-to-Text Transcription${RESET}`);
  const startTime = Date.now();
  const transcriptResult = await transcribeMediaUrlWithGroq({
    mediaUrl: cloudAudioUrl,
    fileName: '1.mp3',
  });
  const elapsed = Date.now() - startTime;

  check('Groq Whisper responded successfully', Boolean(transcriptResult && transcriptResult.transcript), `Latency: ${elapsed}ms`);
  check('Transcript contains words', (transcriptResult.words || []).length > 20, `Words: ${transcriptResult.words?.length || 0}`);
  check('Detected duration in range', Boolean(transcriptResult.durationSeconds && transcriptResult.durationSeconds > 10 && transcriptResult.durationSeconds <= 600), `Duration: ${transcriptResult.durationSeconds?.toFixed(1)}s (Max: 600s)`);
  console.log(`     Sample transcript: "${transcriptResult.transcript.slice(0, 100)}..."`);

  console.log(`\n${BOLD}3. Book Summary AI Scene Planning & Storyboard Generation${RESET}`);
  const planRequest: BookSummaryPlanRequest = {
    transcript: transcriptResult.transcript,
    words: transcriptResult.words,
    timestampSegments: transcriptResult.segments,
    durationSeconds: transcriptResult.durationSeconds || 24,
    bookTitle: 'The Psychology of Money',
    authorName: 'Morgan Housel',
    bookCoverUrl: 'https://res.cloudinary.com/dhouh9idx/image/upload/v1741706458/itnavideo/book-covers/psychology-of-money.jpg',
    authorPortraitUrl: 'https://res.cloudinary.com/dhouh9idx/image/upload/v1741706458/itnavideo/author-portraits/morgan-housel.jpg',
  };

  const rawPlan = buildLocalBookSummaryPlan(planRequest);
  const finalPlan = validateAndRepairBookSummaryPlan(rawPlan, transcriptResult.transcript, transcriptResult.durationSeconds || 24);

  check('Storyboard generated scenes', finalPlan.scenes.length >= 2, `Total scenes: ${finalPlan.scenes.length}`);
  const hasCover = finalPlan.scenes.some(s => s.type === 'BOOK_COVER');
  check('Intro 3D Book Cover scene created', hasCover, `Has BOOK_COVER: ${hasCover}`);
  const hasKeyIdea = finalPlan.scenes.some(s => s.type === 'KEY_IDEA');
  check('Key Idea / Lesson scenes created', hasKeyIdea, `Has KEY_IDEA: ${hasKeyIdea}`);

  // Check scene timestamps
  let timestampsValid = true;
  for (const s of finalPlan.scenes) {
    if (s.startSeconds < 0 || s.endSeconds > (transcriptResult.durationSeconds || 30) || s.startSeconds >= s.endSeconds) {
      timestampsValid = false;
    }
  }
  check('All scene timestamps strictly bounded', timestampsValid, `Bounds: 0.0s to ${(transcriptResult.durationSeconds || 24).toFixed(1)}s`);

  // Check YouTube metadata
  check('YouTube Title generated', Boolean(finalPlan.metadata.suggestedTitle), finalPlan.metadata.suggestedTitle);
  check('YouTube Chapters generated', finalPlan.metadata.chapters.length >= 1, `Chapters: ${finalPlan.metadata.chapters.length}`);
  check('YouTube Description generated', Boolean(finalPlan.metadata.description), `Length: ${finalPlan.metadata.description.length} chars`);

  console.log(`\n${BOLD}4. Aspect Ratio & Duration Spec Verification${RESET}`);
  const registryEntry = VIDEO_TYPE_REGISTRY.BOOK_SUMMARY;
  check('BOOK_SUMMARY registered in VIDEO_TYPE_REGISTRY', Boolean(registryEntry), `Composition ID: ${registryEntry?.compositionId}`);
  check('Category is long-form (16:9)', registryEntry?.videoCategory === 'long-form', `Category: ${registryEntry?.videoCategory}`);

  console.log(`\n${BOLD}5. Rule 4.1 Credit Pricing Verification (1 Min = 1 Credit)${RESET}`);
  const credits24s = calculateRenderCreditUnits('bookSummary', { durationSeconds: 24 });
  check('24-second audio = 1 Credit', credits24s === 1, `Computed: ${credits24s} Cr`);
  const credits300s = calculateRenderCreditUnits('bookSummary', { durationSeconds: 300 });
  check('5-minute (300s) audio = 5 Credits', credits300s === 5, `Computed: ${credits300s} Cr`);
  const credits600s = calculateRenderCreditUnits('bookSummary', { durationSeconds: 600 });
  check('10-minute (600s) audio = 10 Credits', credits600s === 10, `Computed: ${credits600s} Cr`);

  let rejectedOver10m = false;
  try {
    calculateRenderCreditUnits('bookSummary', { durationSeconds: 601 });
  } catch {
    rejectedOver10m = true;
  }
  check('Audio > 10m (601s) correctly rejected by credit pricing', rejectedOver10m, 'Throws duration error beyond 600s');

  console.log(`\n${BOLD}${CYAN}======================================================================`);
  console.log(`  AUDIT SUMMARY: ${GREEN}${passCount} PASSED${RESET} | ${failCount === 0 ? GREEN : RED}${failCount} FAILED${RESET}`);
  console.log(`======================================================================${RESET}\n`);

  if (failCount > 0) {
    process.exit(1);
  }
}

run().catch((err) => {
  console.error(`\n${RED}CRITICAL TEST FAILURE:${RESET}`, err);
  process.exit(1);
});
