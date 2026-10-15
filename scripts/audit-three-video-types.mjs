import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';
import { loadEnvLocal } from './load-env-local.mjs';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { transcribeMediaUrlWithGroq } from '../services/ai/groqTranscription.ts';
import { buildDeterministicSceneBlueprint } from '../services/ai/aiScenePlanner.ts';
import { planImagesFromLibraryForScenes } from '../services/ai/aiImageLibraryMatcher.ts';
import { generateSFXEvents } from '../services/ai/sfxEngine.ts';
import { planTypographyVideo } from '../services/ai/typographyPlanner.ts';
import { VIDEO_TYPE_REGISTRY } from '../services/ai/reelPlanner.ts';
import { calculateRenderCreditUnits } from '../lib/billing/creditPricing.ts';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
loadEnvLocal(rootDir);

const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';
const CYAN = '\x1b[36m';
const BOLD = '\x1b[1m';
const RESET = '\x1b[0m';

console.log(`${BOLD}${CYAN}======================================================================`);
console.log(`      ITNAVIDEO — 3 FLAGSHIP VIDEO TYPES COMPLETE AUDIT`);
console.log(`  1. Faceless Video | 2. Auto Captions | 3. Typography Video`);
console.log(`======================================================================${RESET}\n`);

const region = process.env.AWS_REGION || process.env.REMOTION_AWS_REGION || 'us-east-1';
const bucketName = process.env.AWS_S3_BUCKET_NAME || process.env.REMOTION_LAMBDA_BUCKET_NAME || 'remotionlambda-useast1-2zq6twaok1';

const s3 = new S3Client({
  region,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || process.env.REMOTION_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || process.env.REMOTION_AWS_SECRET_ACCESS_KEY,
  },
});

const CLOUDINARY_DEMO_VIDEO = 'https://res.cloudinary.com/dhouh9idx/video/upload/v1789985898/90_People_Confuse_These_Two_learnenglish_difference_trendingreel_english_hnepyd.mp4';
const LOCAL_AUDIO_PATH = 'C:\\Users\\Akram Editor Studio\\Downloads\\1.mp3';

let passCount = 0;
let failCount = 0;

function check(title, condition, info = '') {
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

async function uploadLocalFileToS3(filePath, key) {
  const fileBytes = fs.readFileSync(filePath);
  await s3.send(
    new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: fileBytes,
      ContentType: 'audio/mpeg',
    })
  );
  return `https://${bucketName}.s3.${region}.amazonaws.com/${key}`;
}

async function runAudit() {
  console.log(`${BOLD}SECTION 1: Naming & Registry Alignment Audit${RESET}`);
  // Verify Faceless Video
  check(
    "Faceless Video Registry Configuration",
    Boolean(VIDEO_TYPE_REGISTRY.FACELESS_VIDEO && VIDEO_TYPE_REGISTRY.FACELESS_VIDEO.compositionId === 'FACELESS-VIDEO'),
    `Template: FACELESS_VIDEO -> Comp: ${VIDEO_TYPE_REGISTRY.FACELESS_VIDEO?.compositionId}`
  );
  check(
    "Faceless Video Allowed Media includes audio & video",
    VIDEO_TYPE_REGISTRY.FACELESS_VIDEO?.allowedMedia.includes('audio') && VIDEO_TYPE_REGISTRY.FACELESS_VIDEO?.allowedMedia.includes('video'),
    `Allowed media: ${JSON.stringify(VIDEO_TYPE_REGISTRY.FACELESS_VIDEO?.allowedMedia)}`
  );

  // Verify Auto Caption
  check(
    "Auto Caption Registry Configuration",
    Boolean(VIDEO_TYPE_REGISTRY.AUTO_CAPTION_GENERATOR && VIDEO_TYPE_REGISTRY.AUTO_CAPTION_GENERATOR.compositionId === 'AUTO-CAPTION-GENERATOR'),
    `Template: AUTO_CAPTION_GENERATOR -> Comp: ${VIDEO_TYPE_REGISTRY.AUTO_CAPTION_GENERATOR?.compositionId}`
  );

  // Verify Typography Video
  check(
    "Typography Video Registry Configuration",
    Boolean(VIDEO_TYPE_REGISTRY.TYPOGRAPHY_VIDEO && VIDEO_TYPE_REGISTRY.TYPOGRAPHY_VIDEO.compositionId === 'TYPOGRAPHY-VIDEO'),
    `Template: TYPOGRAPHY_VIDEO -> Comp: ${VIDEO_TYPE_REGISTRY.TYPOGRAPHY_VIDEO?.compositionId}`
  );

  // Verify Credit Pricing Rule 4.1
  const facelessCredit1m = calculateRenderCreditUnits('facelessVideo', { durationSeconds: 60 });
  const facelessCredit5m = calculateRenderCreditUnits('facelessVideo', { durationSeconds: 300 });
  const facelessCredit10m = calculateRenderCreditUnits('facelessVideo', { durationSeconds: 600 });
  const autoCaptionCredit = calculateRenderCreditUnits('autoCaption', { durationSeconds: 60 });
  const typographyCredit = calculateRenderCreditUnits('typographyVideo', { durationSeconds: 60 });

  check(
    "Rule 4.1 Credit Pricing - Faceless Video (1m=1, 5m=5, 10m=10)",
    facelessCredit1m === 1 && facelessCredit5m === 5 && facelessCredit10m === 10,
    `1m: ${facelessCredit1m} Cr, 5m: ${facelessCredit5m} Cr, 10m: ${facelessCredit10m} Cr`
  );
  check(
    "Rule 4.1 Credit Pricing - Auto Caption (1 Cr)",
    autoCaptionCredit === 1,
    `Cost: ${autoCaptionCredit} Cr`
  );
  check(
    "Rule 4.1 Credit Pricing - Typography Video (1 Cr)",
    typographyCredit === 1,
    `Cost: ${typographyCredit} Cr`
  );

  console.log(`\n${BOLD}SECTION 2: Faceless Video Pipeline Audit (User Audio: 1.mp3)${RESET}`);
  check("Audio File Exists", fs.existsSync(LOCAL_AUDIO_PATH), LOCAL_AUDIO_PATH);
  const audioSize = fs.statSync(LOCAL_AUDIO_PATH).size;
  console.log(`  File size: ${(audioSize / 1024).toFixed(1)} KB`);

  console.log(`  Uploading 1.mp3 to AWS S3...`);
  const s3AudioKey = `audits/faceless-${Date.now()}-1.mp3`;
  const s3AudioUrl = await uploadLocalFileToS3(LOCAL_AUDIO_PATH, s3AudioKey);
  console.log(`  Uploaded to S3: ${s3AudioUrl}`);

  console.log(`  Transcribing with Groq Whisper Cloud API...`);
  const startTranscribe = Date.now();
  const facelessTranscription = await transcribeMediaUrlWithGroq({
    mediaUrl: s3AudioUrl,
    fileName: '1.mp3',
    maxSeconds: 600,
  });
  const transcribeDuration = Date.now() - startTranscribe;
  console.log(`  Transcription complete in ${transcribeDuration}ms`);
  console.log(`  Transcript preview: "${facelessTranscription.transcript.slice(0, 120)}..."`);
  console.log(`  Duration: ${facelessTranscription.durationSeconds?.toFixed(1)}s, Words: ${facelessTranscription.words?.length || 0}`);

  check(
    "Faceless Video Transcription Successful",
    Boolean(facelessTranscription.transcript && (facelessTranscription.words?.length || 0) > 0),
    `Total words: ${facelessTranscription.words?.length || 0}`
  );

  // AI Scene Blueprint
  console.log(`  Generating Scene Blueprint for Faceless Video...`);
  const segments = facelessTranscription.segments && facelessTranscription.segments.length > 0
    ? facelessTranscription.segments
    : [{ start: 0, end: facelessTranscription.durationSeconds || 10, text: facelessTranscription.transcript }];

  const sceneBlueprint = buildDeterministicSceneBlueprint(segments, {
    title: 'Faceless Video Demo',
    visualStyle: 'realistic',
  });

  check(
    "Scene Blueprint Generated",
    Array.isArray(sceneBlueprint.scenes) && sceneBlueprint.scenes.length > 0,
    `Total scenes: ${sceneBlueprint.scenes?.length || 0}`
  );

  // Asset Matching from Library
  const matchedAssets = planImagesFromLibraryForScenes(sceneBlueprint.scenes || [], {
    visualStyle: 'realistic',
    fallbackCategory: 'business_tech',
  });
  check(
    "Asset Library Matching",
    matchedAssets && Object.keys(matchedAssets).length > 0,
    `Matched assets count: ${Object.keys(matchedAssets).length}`
  );

  // SFX Generation
  const sfxEvents = generateSFXEvents({
    scenes: sceneBlueprint.scenes || [],
    durationSeconds: facelessTranscription.durationSeconds || 15,
    intensity: 'medium',
  });
  check(
    "SFX Generation",
    Array.isArray(sfxEvents) && sfxEvents.length > 0,
    `Total SFX events: ${sfxEvents.length}`
  );

  // Validate Render Props Payload
  const facelessRenderProps = {
    template: 'FACELESS_VIDEO',
    templateName: 'FACELESS_VIDEO',
    compositionId: 'FACELESS-VIDEO',
    mediaSrc: s3AudioUrl,
    mediaType: 'audio',
    durationSeconds: facelessTranscription.durationSeconds || 15,
    title: 'Faceless Video Demo',
    scenes: sceneBlueprint.scenes,
    brollUrls: matchedAssets,
    sfxEvents,
    backgroundTheme: 'purple-vignette',
    watermark: false,
  };

  const isSerializable = JSON.stringify(facelessRenderProps).length > 0;
  check("Faceless Video Render Props Serializable & Valid", isSerializable);

  console.log(`\n${BOLD}SECTION 3: Auto Captions Pipeline Audit (Cloudinary Demo Video)${RESET}`);
  console.log(`  Demo Video: ${CLOUDINARY_DEMO_VIDEO}`);
  console.log(`  Transcribing with Groq Whisper Cloud API...`);
  const autoStart = Date.now();
  const autoTranscription = await transcribeMediaUrlWithGroq({
    mediaUrl: CLOUDINARY_DEMO_VIDEO,
    fileName: 'demo-reel.mp4',
    maxSeconds: 90,
  });
  console.log(`  Auto Caption transcribed in ${Date.now() - autoStart}ms`);
  console.log(`  Transcript preview: "${autoTranscription.transcript.slice(0, 120)}..."`);
  console.log(`  Words: ${autoTranscription.words?.length || 0}, Duration: ${autoTranscription.durationSeconds?.toFixed(1)}s`);

  check(
    "Auto Caption Transcription Successful",
    Boolean(autoTranscription.transcript && (autoTranscription.words?.length || 0) > 0),
    `Words: ${autoTranscription.words?.length || 0}`
  );

  // Build word-level kinetic subtitle chunks
  const rawWords = autoTranscription.words || [];
  const autoCaptionSegments = [];
  for (let i = 0; i < rawWords.length; i += 4) {
    const slice = rawWords.slice(i, i + 4);
    autoCaptionSegments.push({
      start: slice[0].start,
      end: slice[slice.length - 1].end,
      text: slice.map(w => w.word).join(' '),
      words: slice,
    });
  }

  const autoCaptionRenderProps = {
    template: 'AUTO_CAPTION_GENERATOR',
    templateName: 'AUTO_CAPTION_GENERATOR',
    compositionId: 'AUTO-CAPTION-GENERATOR',
    mediaSrc: CLOUDINARY_DEMO_VIDEO,
    mediaType: 'video',
    durationSeconds: autoTranscription.durationSeconds || 15,
    captions: autoCaptionSegments,
    captionStyle: 'dynamic-punch',
    captionPosition: 'bottom',
    textColor: '#FFFFFF',
    highlightColor: '#FFA000',
    watermark: false,
  };

  check(
    "Auto Caption Render Props Built & Valid",
    Boolean(autoCaptionRenderProps.captions.length > 0 && JSON.stringify(autoCaptionRenderProps)),
    `Generated ${autoCaptionSegments.length} motion subtitle chunks`
  );

  console.log(`\n${BOLD}SECTION 4: Typography Video Pipeline Audit (Cloudinary Demo Video)${RESET}`);
  console.log(`  Planning Kinetic Typography Video via planTypographyVideo...`);
  const typoStart = Date.now();
  const typoPlan = planTypographyVideo({
    transcript: autoTranscription.transcript,
    words: rawWords.map(w => ({ word: String(w.word), start: Number(w.start), end: Number(w.end) })),
    segments: autoCaptionSegments.map(c => ({ start: c.start, end: c.end, text: c.text })),
    durationSeconds: autoTranscription.durationSeconds || 15,
    typographyStyle: 'vox-giant-stagger',
  });
  console.log(`  Typography plan created in ${Date.now() - typoStart}ms`);
  console.log(`  Kinetic Keywords: ${typoPlan.keywords?.length || 0}, Sound Cues: ${typoPlan.soundCues?.length || 0}`);

  check(
    "Typography Plan Generated",
    Boolean(typoPlan.keywords && typoPlan.keywords.length > 0),
    `Found ${typoPlan.keywords?.length || 0} kinetic keywords and ${typoPlan.soundCues?.length || 0} sound cues`
  );

  const typographyRenderProps = {
    template: 'TYPOGRAPHY_VIDEO',
    templateName: 'TYPOGRAPHY_VIDEO',
    compositionId: 'TYPOGRAPHY-VIDEO',
    mediaSrc: CLOUDINARY_DEMO_VIDEO,
    mediaType: 'video',
    durationSeconds: autoTranscription.durationSeconds || 15,
    keywords: typoPlan.keywords,
    soundCues: typoPlan.soundCues,
    typographyStyle: 'vox-giant-stagger',
    aspectRatio: '9:16',
    captions: autoCaptionSegments,
    showCaptions: false,
    watermark: false,
  };

  check(
    "Typography Video Render Props Built & Valid",
    Boolean(typographyRenderProps.keywords.length > 0 && JSON.stringify(typographyRenderProps)),
    `Composition: ${typographyRenderProps.compositionId}`
  );

  console.log(`\n${BOLD}${CYAN}======================================================================`);
  console.log(`      AUDIT SUMMARY: ${GREEN}${passCount} PASSED${RESET} | ${failCount > 0 ? `${RED}${failCount} FAILED${RESET}` : `${GREEN}0 FAILED${RESET}`}`);
  console.log(`======================================================================${RESET}\n`);

  if (failCount > 0) {
    process.exit(1);
  }
}

runAudit().catch(err => {
  console.error(`\n${RED}[AUDIT FATAL ERROR]${RESET}`, err);
  process.exit(1);
});
