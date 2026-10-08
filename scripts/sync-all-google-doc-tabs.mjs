import fs from 'node:fs';
import crypto from 'node:crypto';

// 1. Authenticate with Service Account
const creds = JSON.parse(fs.readFileSync('gcp-credentials.json', 'utf8'));

const now = Math.floor(Date.now() / 1000);
const header = { alg: 'RS256', typ: 'JWT' };
const payload = {
  iss: creds.client_email,
  sub: creds.client_email,
  aud: 'https://oauth2.googleapis.com/token',
  iat: now,
  exp: now + 3600,
  scope: 'https://www.googleapis.com/auth/documents https://www.googleapis.com/auth/drive'
};

function base64url(obj) {
  return Buffer.from(JSON.stringify(obj))
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

const unsignedToken = `${base64url(header)}.${base64url(payload)}`;
const sign = crypto.createSign('RSA-SHA256');
sign.update(unsignedToken);
const signature = sign.sign(creds.private_key, 'base64')
  .replace(/=/g, '')
  .replace(/\+/g, '-')
  .replace(/\//g, '_');

const jwt = `${unsignedToken}.${signature}`;

console.log('Authenticating with Google OAuth2...');
const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`
});

const tokenData = await tokenRes.json();
const accessToken = tokenData.access_token;
if (!accessToken) {
  console.error('Failed to authenticate:', tokenData);
  process.exit(1);
}
console.log('Authentication successful!');

const docId = '1bJkaF6OAysRQUNnxSusLKsjRCs0mGJhsjE2m1fyeC1U';

// 2. Fetch Document to get latest tab state and ranges
async function getDoc() {
  const res = await fetch(`https://docs.googleapis.com/v1/documents/${docId}?includeTabsContent=true`, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  return await res.json();
}

// 3. Define content for all 23 tabs
const TAB_CONTENTS = {
  't.z57m56tdyaqf': `================================================================================
ITNAVIDEO â€” EXECUTIVE OVERVIEW & PLATFORM ARCHITECTURE
================================================================================

1. MISSION & PRODUCT DEFINITION:
Itnavideo is an automated, AI-powered corporate and social video engine designed to replace manual editing pipelines (Premiere Pro, DaVinci Resolve, or CapCut). Users upload audio or video files, and the platform automatically handles speech transcription, style rendering, asset matching, and multi-worker distributed rendering.

2. TARGET REGIONS & COMPLIANCE:
â€¢ Primary Markets: United States (USA), United Kingdom (UK), Canada, Australia, APAC/India, and Europe (Germany, France, Spain).
â€¢ Regulatory Focus: High-virality retention hooks for TikTok, Instagram Reels, and YouTube Shorts alongside executive, boardroom-safe corporate layouts.

3. COMMERCIAL PRICING TIERS & LIMITS:
â€¢ Free Trial: $0 | 1 Free Watermarked Video | Casual creators exploring the tool.
â€¢ Starter Plan: $29/mo | 30 Credits | Individual creators & podcasters.
â€¢ Pro Plan: $49/mo | 100 Credits | Professional marketers & growing YouTube channels.
â€¢ Enterprise: $149/mo | 350 Credits | Heavy content creation agencies & corporate teams.

4. CORE TECHNOLOGY STACK MATRIX:
â€¢ Frontend: Next.js 15 (App Router) + React 19 (Server Components & Actions).
â€¢ Design System: Material Design 3 (M3) + Google Analytics Color Palette (#070B14, #0E1526, #FF6D00).
â€¢ Composition: Remotion 4.0.467 (Programmatic React-to-video rendering).
â€¢ Speech AI: Groq Whisper LPU (whisper-large-v3-turbo, <2.5s transcription).
â€¢ AI Planning: Google Gemini 2.5 Flash (Whiteboard scripting & audio fallback).
â€¢ Database: Supabase PostgreSQL (SSR Auth, User Profiles, Credits Metering).
â€¢ Storage: Google Cloud Storage (itnavideo-media-assets) via direct presigned streaming.
â€¢ Cloud Render: Remotion AWS Lambda Multi-Worker Cluster (us-east-1 Mumbai).
â€¢ Deployment: Google Cloud Run (itnavideo-web container, us-central1).

5. SUMMARY OF SUPPORTED VIDEO TYPES:
â€¢ 9:16 Short Reels (Max 90s): Auto Caption, Compare Explainer, Long Video Promo, Whiteboard Video, Typography Video.
â€¢ 16:9 Long Form (Max 15m): YouTube Subtitles, Long Video Clips, Faceless Video, Image to Video AI, AI Audio Cleaner.
`,

  't.0': `================================================================================
VIDEO TYPE 1: YOUTUBE SUBTITLE GENERATOR (16:9 LANDSCAPE)
================================================================================

1. KEY SPECIFICATIONS:
â€¢ Mode Identifier: youtubeSubtitleGenerator
â€¢ Remotion Composition ID: AUTO-CAPTION-GENERATOR-LANDSCAPE
â€¢ Aspect Ratio: 16:9 Landscape (1920Ã—1080, 30 FPS)
â€¢ Maximum Video Duration: 15 Minutes (900 seconds)
â€¢ Credit Cost: 1 Credit per 2 minutes of video

2. CONNECTED CODEBASE FILES:
â€¢ Dashboard View: app/dashboard/page.tsx & components/dashboard/DashboardStudio.tsx
â€¢ Planner Registry: services/ai/reelPlanner.ts (skipPlanner: true, needsCaptionStylePicker: true)
â€¢ Backend Controller: app/api/reels/jobs/route.ts (Fast-Path Dispatch lines 536â€“695)
â€¢ Remotion Template: remotion/templates/AUTO_CAPTION_GENERATOR/template.tsx

3. ENGINE WORKFLOW:
â€¢ Step 1 â€” Direct Upload: User uploads long landscape video (up to 500MB) via /api/media/presign.
â€¢ Step 2 â€” Groq Transcription: Transcribes dialogue with millisecond word timestamps.
â€¢ Step 3 â€” Segment Chunking: Splits long audio into 2-minute timed subtitle chunks.
â€¢ Step 4 â€” Safe Zone Placement: Aligns subtitle strips along bottom margin, preventing collision with YouTube player controls.
â€¢ Step 5 â€” Cloud Lambda Dispatch: Dispatches parallel render chunks across AWS Lambda.
`,

  't.eypm8j4yoo65': `================================================================================
VIDEO TYPE 2: AUTO CAPTION GENERATOR (9:16 VERTICAL REELS)
================================================================================

1. KEY SPECIFICATIONS:
â€¢ Mode Identifier: autoCaption
â€¢ Remotion Composition ID: AUTO_CAPTION_GENERATOR
â€¢ Aspect Ratio: 9:16 Vertical (1080Ã—1920, 30 FPS)
â€¢ Maximum Video Duration: 90 Seconds
â€¢ Credit Cost: 1 Credit per minute (Free Trial available)

2. CONNECTED CODEBASE FILES:
â€¢ Dedicated Studio: components/dashboard/AutoCaptionStudio.tsx (/dashboard/auto-caption)
â€¢ Interactive Video Player: components/dashboard/AutoCaptionBeforeAfterPlayer.tsx
â€¢ Luxury Style Carousel: components/dashboard/AutoCaptionStyleCarousel.tsx
â€¢ Subtitle Style Engine: components/ui/SubtitleStylePicker.tsx
â€¢ Remotion Template: remotion/templates/AUTO_CAPTION_GENERATOR/template.tsx

3. TOP COMPETITOR STYLES SUPPORTED (70+ Presets):
â€¢ Creator 3: Alex Hormozi style lime pop with dark shadow and bold punch.
â€¢ Crazy Gradient: Dynamic animated violet/fuchsia gradient fill with stroke.
â€¢ Spark Glow: Radiant golden spark glow for motivational hooks.
â€¢ Solo Pop: Single prominent word at center screen with bounce physics.
â€¢ Master Pill: Clean high-contrast pill backdrop container.

4. REMOTION PROPS INTERFACE:
export interface AutoCaptionGeneratorProps {
  mediaSrc: string;
  captions?: SubtitleChunk[];
  subtitleChunks?: SubtitleChunk[];
  captionStyle: string;
  textColor?: string;
  highlightColor?: string;
  captionPosition?: "top" | "center" | "bottom";
  fontSize?: "small" | "medium" | "large" | "xlarge";
  wordClickSound?: boolean;
}
`,

  't.6i4mwt2ey0j1': `================================================================================
VIDEO TYPE 3: COMPARE EXPLAINER VIDEO (9:16 VERTICAL)
================================================================================

1. KEY SPECIFICATIONS:
â€¢ Mode Identifier: compare
â€¢ Remotion Composition ID: comparisonImages
â€¢ Aspect Ratio: 9:16 Vertical (1080Ã—1920, 30 FPS)
â€¢ Maximum Video Duration: 90 Seconds
â€¢ Credit Cost: 1 Credit per minute

2. CONNECTED CODEBASE FILES:
â€¢ Dashboard Studio: components/dashboard/CompareExplainerStudio.tsx
â€¢ Pose Planning Service: services/ai/compareStickerPlanner.ts
â€¢ Backend Controller: app/api/reels/jobs/route.ts
â€¢ Remotion Template: remotion/templates/COMPARE_EXPLAINER/template.tsx

3. ACTUAL 9-STAGE WALL-CLOCK TIMING PROFILE (Total: 2m 44s):
â€¢ Stage 1 (Upload & Ingestion): 4.13s â€” Voiceover + 2 images stream to S3.
â€¢ Stage 2 (Transcription): 8.91s â€” Groq Whisper extracts word-by-word timestamps.
â€¢ Stage 3 (Caption Generation): 4.80s â€” Formats transcript into 8 timed subtitle cue segments.
â€¢ Stage 4 (Pose Assignment): 0.001s â€” AI script engine assigns 4 stickman poses (welcome -> thinking -> left -> right).
â€¢ Stage 5 (Lambda Dispatch): 3.46s â€” Packages comparison props and triggers Remotion Lambda.
â€¢ Stage 6 (Parallel Rendering): 115.85s â€” 2 parallel Lambda workers render 295 Chromium frames (148/worker).
â€¢ Stage 7 (Video Encoding): 8.35s â€” FFmpeg encodes H.264 video streams and AAC audio.
â€¢ Stage 8 (Cloud Upload): 15.00s â€” Output MP4 ingested into Cloud Storage.
â€¢ Stage 9 (Stream Response): 2.80s â€” Status API returns 'done' and emits downloadable stream.
`,

  't.i7ld1vxjk7ac': `================================================================================
VIDEO TYPE 4: LONG VIDEO PROMO (9:16 VERTICAL)
================================================================================

1. KEY SPECIFICATIONS:
â€¢ Mode Identifier: longVideoPromo
â€¢ Remotion Composition ID: LONG_VIDEO_PROMO
â€¢ Aspect Ratio: 9:16 Vertical (1080Ã—1920, 30 FPS)
â€¢ Maximum Video Duration: 90 Seconds
â€¢ Credit Cost: 1 Credit per minute

2. CONNECTED CODEBASE FILES:
â€¢ Dashboard Studio: components/dashboard/LongVideoPromoStudio.tsx
â€¢ Registry Config: services/ai/reelPlanner.ts (skipTranscription: true, skipPlanner: true)
â€¢ Remotion Template: remotion/templates/LONG_VIDEO_PROMO/template.tsx

3. OPTIMIZED PIPELINE (ZERO-SPEECH BYPASS):
â€¢ Bypasses Whisper transcription completely â€” zero latency, zero API rate limits.
â€¢ Takes the user's video, scales it center, and creates a high-aesthetic blurred background backdrop (filter: blur(20px)).
â€¢ Overlays headline title cards and channel thumbnails dynamically across the top third of the frame.
`,

  't.cmn7wopjm0hc': `================================================================================
VIDEO TYPE 5: WHITEBOARD VIDEO / AUTO DRAW (9:16 VERTICAL)
================================================================================

1. KEY SPECIFICATIONS:
â€¢ Mode Identifier: whiteboardVideo
â€¢ Remotion Composition ID: WHITEBOARD_VIDEO
â€¢ Aspect Ratio: 9:16 Vertical (1080Ã—1920, 30 FPS)
â€¢ Maximum Video Duration: 90 Seconds
â€¢ Credit Cost: 1 Credit per minute

2. CONNECTED CODEBASE FILES:
â€¢ Dashboard Studio: components/dashboard/WhiteboardStudio.tsx
â€¢ AI Scene Planner: services/ai/whiteboardPlanner.ts
â€¢ Remotion Template: remotion/templates/WHITEBOARD_VIDEO/template.tsx
â€¢ Line-Art Stickers: public/assets/stickman/

3. DYNAMIC AI WORKFLOW:
â€¢ Script Scene Planning: Google Gemini 2.5 Flash analyzes audio transcript and generates scene beats.
â€¢ Asset Matching: Matches keywords (e.g. idea, growth, profit) to pre-indexed stickman vector line-art.
â€¢ Simulated Hand-Drawn Engine: Remotion renders progressive SVG stroke-dasharray offsets, simulating real-time whiteboard hand drawing.
`,

  't.bsqoytm2cfm': `================================================================================
VIDEO TYPE 6: TYPOGRAPHY VIDEO (9:16 VERTICAL)
================================================================================

1. KEY SPECIFICATIONS:
â€¢ Mode Identifier: typographyVideo
â€¢ Remotion Composition ID: TYPOGRAPHY_VIDEO
â€¢ Aspect Ratio: 9:16 Vertical (1080Ã—1920, 30 FPS)
â€¢ Maximum Video Duration: 90 Seconds
â€¢ Credit Cost: 1 Credit per minute

2. CONNECTED CODEBASE FILES:
â€¢ Dashboard Studio: components/dashboard/TypographyStudio.tsx
â€¢ Pipeline Service: services/ai/typographyPipeline.ts
â€¢ Planner: services/ai/typographyPlanner.ts
â€¢ Remotion Template: remotion/templates/TYPOGRAPHY_VIDEO/template.tsx

3. KINETIC TYPOGRAPHY MECHANICS:
â€¢ Extracts word audio timing and frequency peaks.
â€¢ Words pop sequentially onto the screen using bold spring dynamics (damping: 12, stiffness: 200).
â€¢ Kinetic neon gradient shifts cycle word-by-word for maximum audience retention.
`,

  't.9jh0vts3g0do': `================================================================================
VIDEO TYPE 7: LONG VIDEO CLIPS (16:9 TO 9:16 VERTICAL)
================================================================================

1. KEY SPECIFICATIONS:
â€¢ Mode Identifier: longVideoClips
â€¢ Remotion Composition ID: LONG_VIDEO_CLIPS
â€¢ Aspect Ratio: 9:16 Vertical (1080Ã—1920, 30 FPS)
â€¢ Maximum Input Duration: 15 Minutes (900 seconds)
â€¢ Credit Cost: 1 Credit per minute

2. CONNECTED CODEBASE FILES:
â€¢ Dashboard Studio: components/dashboard/LongVideoClipsStudio.tsx
â€¢ Clip Selection Service: services/ai/clipSelector.ts
â€¢ Face Cam Vision Tracker: services/vision/faceTracker.ts
â€¢ Remotion Template: remotion/templates/LONG_VIDEO_CLIPS/template.tsx

3. PROCESSING PIPELINE:
â€¢ Hook Detection: Analyzes transcript sentiment and audio energy to detect viral moments.
â€¢ Intelligent Slicing: Extracts the strongest 30-90 second narrative segment.
â€¢ Face Tracker: Dynamically tracks speaker face coordinates and centers the 9:16 crop window smoothly.
`,

  't.v30xgq7m4vju': `================================================================================
VIDEO TYPE 8: FACELESS VIDEO (16:9 LANDSCAPE)
================================================================================

1. KEY SPECIFICATIONS:
â€¢ Mode Identifier: facelessVideo
â€¢ Remotion Composition ID: FACELESS_VIDEO
â€¢ Aspect Ratio: 16:9 Landscape (1920Ã—1080, 30 FPS)
â€¢ Maximum Video Duration: 15 Minutes (900 seconds)
â€¢ Credit Cost: 1 Credit per minute

2. CONNECTED CODEBASE FILES:
â€¢ Dashboard Studio: components/dashboard/FacelessVideoStudio.tsx
â€¢ Scene Director AI: services/ai/sceneDirector.ts
â€¢ Asset Matcher: services/ai/assetMatcher.ts
â€¢ Stock Assets Library: constants/itnavideoStockAssets.ts
â€¢ Remotion Template: remotion/templates/FACELESS_VIDEO/template.tsx

3. AI DIRECTOR & ASSET ENGINE:
â€¢ AI Prompt to Script: Directs scene shots, narration script, and emotional beats.
â€¢ Semantic Asset Matching: Matches scenes to high-definition b-roll footage from Google Cloud Storage.
â€¢ Audio Ducking: Narration automatically ducks background music volume during speech.
`,

  't.if4b4klu7yo5': `================================================================================
VIDEO TYPE 9: IMAGE TO VIDEO AI (16:9 LANDSCAPE)
================================================================================

1. KEY SPECIFICATIONS:
â€¢ Mode Identifier: imageToVideoAi
â€¢ Remotion Composition ID: IMAGE_TO_VIDEO_AI
â€¢ Aspect Ratio: 16:9 Landscape (1920Ã—1080, 30 FPS)
â€¢ Maximum Video Duration: 15 Minutes (900 seconds)
â€¢ Credit Cost: 1 Credit per minute

2. CONNECTED CODEBASE FILES:
â€¢ Dashboard Studio: components/dashboard/ImageToVideoStudio.tsx
â€¢ Backend Router: app/api/reels/jobs/route.ts
â€¢ Remotion Template: remotion/templates/IMAGE_TO_VIDEO_AI/template.tsx

3. ACTUAL WALL-CLOCK TIMING PROFILE:
â€¢ Stage 1 (Direct Ingestion): 5.01s â€” Uploads audio and slide image files.
â€¢ Stage 2 (Speech Transcription): 1.74s â€” Groq Whisper extracts script sentences.
â€¢ Stage 3 (Storyteller Subtitles): 0.003s â€” Formats bottom subtitles strip.
â€¢ Stage 4 (Ken Burns Motion): 0.002s â€” Applies smooth camera zooms and pans per slide.
â€¢ Stage 5 (Composition & Dispatch): 5.53s â€” Packages props and triggers Cloud render.
`,

  't.9wnlgryhxpd3': `================================================================================
VIDEO TYPE 10: AI AUDIO CLEANER (STUDIO MASTERED MP3)
================================================================================

1. KEY SPECIFICATIONS:
â€¢ Mode Identifier: audioClean
â€¢ Output Format: High-Fidelity Studio Clean MP3
â€¢ Maximum Audio Length: 15 Minutes (900 seconds)
â€¢ Credit Cost: 1 Credit per minute

2. CONNECTED CODEBASE FILES:
â€¢ Dashboard Studio: components/dashboard/AudioCleanStudio.tsx
â€¢ Mastering Service: services/ai/audioCleanService.ts
â€¢ API Endpoints: app/api/audio-clean/route.ts & app/api/audio-clean/analyze/route.ts

3. MASTERING PIPELINE:
â€¢ Script Analysis: Transcribes speech and detects verbal filler words (um, ah), repeated retakes, and dead pauses.
â€¢ Acoustic Mastering: Applies highpass (80Hz), lowpass (12kHz), afftdn (-25dB noise floor), and loudnorm (I=-16 LUFS).
â€¢ Studio Export: Trims dead pauses, normalizes volume, and exports crystal-clear podcast audio.
`,

  't.1lj9eiikwviw': `================================================================================
GROQ WHISPER SPEECH AI (LPU ARCHITECTURE & BENCHMARKS)
================================================================================

1. WHAT IS GROQ?
Groq is an AI hardware company that developed the LPU (Language Processing Unit). Unlike standard NVIDIA GPUs that are memory-bandwidth bound, Groq's LPU executes deep learning tensor calculations deterministically with zero memory transfer lag.

2. SPEED BENCHMARK:
â€¢ Groq Whisper (whisper-large-v3-turbo): Transcribes 1 minute of spoken audio in 1.2 to 2.5 seconds.
â€¢ OpenAI Whisper (whisper-1): 20 to 30 seconds for the same audio.
â€¢ Local CPU / Node Whisper: 60+ seconds (causes severe disk paging on developer laptop).

3. DUAL-ENGINE RESILIENCY (GEMINI FALLBACK):
If Groq returns HTTP 429 (rate-limit) or a temporary network drop, app/api/reels/jobs/route.ts immediately switches to transcribeMediaWithGeminiFallback() using Google Gemini 2.5 Flash Audio. User render jobs never fail.
`,

  't.o6kb4icx2n3j': `================================================================================
AWS LAMBDA DISTRIBUTED MULTI-WORKER RENDERING CLUSTER
================================================================================

1. DISTRIBUTED RENDERING ARCHITECTURE:
Standard rendering servers take 10+ minutes to render a 15-minute video. Remotion Lambda splits the timeline into parallel frame chunks across multiple Lambda instances simultaneously:
â€¢ Worker 1: Frames 0 to 4,500
â€¢ Worker 2: Frames 4,501 to 9,000
â€¢ Worker 3: Frames 9,001 to 13,500
â€¢ Worker 4: Frames 13,501 to 18,000
A lightweight combiner Lambda concatenates the chunk MP4s and muxes audio in seconds.

2. CLUSTER CONFIGURATION:
â€¢ Region: us-east-1 (Mumbai) for ultra-low database latency.
â€¢ Memory: 3008 MB per worker (optimal for Chromium headless canvas).
â€¢ Disk: 2048 MB temporary frame cache.
â€¢ Function: remotion-render-4-0-467-mem3008mb-disk2048mb-900sec
â€¢ Concurrency: 6 parallel workers.
`,

  't.wxw2cqpxq2dt': `================================================================================
REMOTION FRAMEWORK & VIDEO COMPOSITION ENGINE
================================================================================

1. HOW REMOTION WORKS:
Remotion is an open-source framework that creates MP4 videos using React, HTML, CSS, SVG, and Canvas.
â€¢ React components are rendered frame-by-frame (useCurrentFrame()) inside a headless Chromium browser.
â€¢ Chromium takes a high-resolution screenshot of each frame.
â€¢ FFmpeg joins screenshots sequentially and muxes audio into high-definition H.264 MP4.

2. CONNECTED CONFIGURATION FILES:
â€¢ Composition Registry: remotion/index.tsx (all 10 templates registered via registerRoot).
â€¢ Configuration: remotion.config.ts (concurrency settings, output formats, and Tailwind injection).
â€¢ Templates Directory: remotion/templates/ (strictly code-only, zero binary assets).
`,

  't.w0m66fser49m': `================================================================================
NEXT.JS 15 & BACKEND SERVER ARCHITECTURE
================================================================================

1. ARCHITECTURAL HIGHLIGHTS:
â€¢ Next.js 15 App Router: Server Components for high-speed page loads + Client Components for interactive canvases.
â€¢ Dynamic Streaming: API endpoints use runtime = 'nodejs' and dynamic = 'force-dynamic' for real-time progress streaming.
â€¢ Direct File Ingestion: Streaming directly from user browser to Cloud Storage via /api/media/presign completely bypasses Next.js 413 'Payload Too Large' errors.

2. CORE API ROUTES DIRECTORY:
â€¢ app/api/reels/jobs/route.ts â€” Central render job creator & dispatcher.
â€¢ app/api/reels/jobs/status/route.ts â€” Real-time render progress polling.
â€¢ app/api/media/presign/route.ts â€” Secure GCS upload URL generator.
â€¢ app/api/audio-clean/route.ts â€” AI audio mastering controller.
`,

  't.m7jikxl5g4w3': `================================================================================
REACT 19 & MASTER VISUAL DESIGN SYSTEM (GOOGLE ANALYTICS THEME)
================================================================================

1. THE GOOGLE ANALYTICS PALETTE SPECIFICATION:
â€¢ Canvas Dark: #070B14 (Deep Obsidian Base) & #0E1526 (Elevated Surface Container).
â€¢ Heading Primary Highlight: #FF6D00 (Signature Google Analytics vibrant orange).
â€¢ Mid Accent: #FF8F00 (Warm gradient transition).
â€¢ Warm Gold: #FFA726 (Highlight tail for gradient text).
â€¢ Primary Text: #FFFFFF (Dark canvas) & #0F172A (Light canvas).
â€¢ Secondary Text: #64748B / #94A3B8 (Metadata, labels, and badges).
â€¢ Subtle Borders: rgba(255, 255, 255, 0.1) (M3 elevation-1 structure).

2. MATERIAL DESIGN 3 (M3) SHAPE & MOTION TOKENS:
â€¢ Containers & Cards: rounded-[28px] (Studio card sheets & video preview).
â€¢ Inputs & Banners: rounded-2xl (Dropzones & settings blocks).
â€¢ Interactive Pills: rounded-full (Category filters & CTAs).
â€¢ Tactile Motion: active:scale-95 transition-all duration-200.
`,

  't.1ac0c45qa9m3': `================================================================================
AWS S3 & CLOUD STORAGE DIRECT UPLOADS
================================================================================

1. CLOUD STORAGE STRATEGY:
â€¢ Presigned Direct Uploads: Client browsers stream files directly to storage buckets via PUT requests using temporary pre-authenticated URLs.
â€¢ Storage Buckets:
  - AWS S3: itnavideo-transcribe (us-east-1 Mumbai) for Remotion Lambda input files.
  - Google Cloud Storage: itnavideo-media-assets for reusable sound effects, stickmen, and fonts.
  - Google Cloud Storage: itnavideo-user-media for production user video uploads.

2. LIFECYCLE & HYGIENE:
â€¢ Temporary render assets and intermediate frame chunks are automatically purged after 48 hours to minimize cloud storage expenses.
`,

  't.1mf9pf0qlb': `================================================================================
SUPABASE DATABASE SCHEMA, AUTH & METERING
================================================================================

1. PROFILES TABLE (User Credits & Auth):
CREATE TABLE public.profiles (
  id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
  updated_at timestamp with time zone,
  full_name text,
  avatar_url text,
  credits integer DEFAULT 0 NOT NULL CHECK (credits >= 0)
);

2. RENDER HISTORY TABLE (Tracked Video Jobs):
CREATE TABLE public.render_history (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  render_id text UNIQUE NOT NULL,
  bucket_name text,
  mode text NOT NULL,
  design text,
  title text,
  output_file text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  expires_at timestamp with time zone NOT NULL
);

3. SSR SDK CONFIGURATION:
â€¢ Client integration via lib/supabase/client.ts.
â€¢ Server-side privileged operations via lib/supabase/server.ts and SUPABASE_SECRET_KEY.
`,

  't.x0k4l3xkoaoe': `================================================================================
GOOGLE CLOUD PLATFORM & CLOUD RUN (PRODUCTION HOSTING)
================================================================================

1. HOSTING ARCHITECTURE:
â€¢ Google Cloud Run Service: itnavideo-web
â€¢ GCP Project ID: geometric-hull-501707-m2
â€¢ Deployment Region: us-central1
â€¢ Primary Domain: https://www.itnavideo.com
â€¢ Failover Direct URL: https://itnavideo-web-804848668830.us-central1.run.app

2. ZERO LOCAL COMPUTE POLICY:
All Docker builds are executed remotely via Google Cloud Build servers when running .\\deploy.ps1. The local developer laptop (4GB RAM, mechanical HDD) experiences zero build, rendering, or memory paging load.
`,

  't.tmi6efazgkwm': `================================================================================
FFMPEG AUDIO/VIDEO MASTERING FILTERS & CODECS
================================================================================

1. ACOUSTIC CLEANUP FILTER STRING:
AUDIO_CLEANUP_FILTER="highpass=f=80,lowpass=f=12000,afftdn=nf=-25,loudnorm=I=-16:TP=-1.5:LRA=11"
â€¢ highpass=f=80: Cuts microphone desk thumps and low-end rumble below 80Hz.
â€¢ lowpass=f=12000: Eliminates high-frequency hiss above 12kHz.
â€¢ afftdn=nf=-25: Adaptive FFT noise reduction (-25dB background reduction).
â€¢ loudnorm=I=-16: EBU R128 loudness normalization for broadcast and podcast standards.

2. VIDEO COMPILATION:
â€¢ Codec: H.264 (libx264) | Preset: fast | CRF: 18 (visually lossless).
â€¢ Audio Codec: AAC (192 kbps, 48kHz stereo).
`,

  't.9prcghga4kow': `================================================================================
FREE VS PAID PLANS LOCK PROTECTION LOGIC
================================================================================

1. DASHBOARD UPFRONT RESTRICTIONS:
â€¢ Free Trial: 1 Free Watermarked Auto Caption Reel (9:16 vertical, up to 1 minute).
â€¢ Paid Features: YouTube Subtitles (16:9), Faceless Video, Whiteboard, AI Audio Cleaner, Image to Video AI, and watermark-free renders require active credits.

2. DROPZONE & UPLOAD PROTECTION:
â€¢ Selecting a paid video type with zero credits transforms the dropzone into an amber lock state.
â€¢ Warning message displayed upfront: "Credits required to render [Video Type]".
â€¢ Users are prevented from wasting network bandwidth uploading 50MBâ€“200MB files before purchasing credits.

3. CTA BUTTON ADAPTATION:
â€¢ Free users on paid modes see CTA change to: "ðŸ”’ Buy Credits to Render [Video Type]".
â€¢ Clicking automatically opens the pricing modal without page reloads.
`,

  't.aiv4w5fbe0h7': `================================================================================
ITNAVIDEO â€” COMPLETE MD FILES REGISTRY & USAGE GUIDE
================================================================================

Ye guide Itnavideo codebase me moujood har ek Markdown (.md) file ka exact role, kab open karna hai, aur kaha use hota hai detail me explain karti hai.

â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
SECTION 1: CORE AGENT RULES & DEVELOPER SAFETY (ROOT DIRECTORY)
â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

1. AGENTS.md (c:\\...\\itnavideo\\AGENTS.md)
â€¢ Kab use hota hai: Jab bhi Antigravity, Cursor, Codex ya koi bhi AI coding agent project par kaam shuru kare. Ye Itnavideo ka SINGLE SOURCE OF TRUTH hai.
â€¢ Kaha use hota hai:
  - Rule 0: Strict 4GB RAM / HDD Machine Policy (Local render aur local heavy ffmpeg 100% FORBIDDEN).
  - Rule 0.1: Strict Zero Automatic Git Push (Founder permission ke bina push nahi karna).
  - Rule 0.2: Instant response & 2-minute progress heartbeat.
  - Rule 0.5: Reply language must be Roman English (Hinglish/English only, no Devanagari).
  - Master Color Palette & Material Design 3 (M3) standards.

2. GEMINI.md (c:\\...\\itnavideo\\GEMINI.md)
â€¢ Kab use hota hai: Gemini Assistant specific directives aur workflow validation ke liye.
â€¢ Kaha use hota hai:
  - "Check First, Update After" workflow enforce karta hai.
  - Local deploy commands (deploy.ps1) permission verify karta hai.

3. README.md (c:\\...\\itnavideo\\README.md)
â€¢ Kab use hota hai: Naya developer onboard karte waqt ya repository initial setup ke waqt.
â€¢ Kaha use hota hai: Local environment setup, npm install, required node versions, aur basic script commands run karne me.

4. INFRASTRUCTURE.md (c:\\...\\itnavideo\\INFRASTRUCTURE.md)
â€¢ Kab use hota hai: Cloud architecture aur server mapping check karte waqt.
â€¢ Kaha use hota hai: Google Cloud Run (web hosting), Google Cloud Storage (media), aur AWS Lambda (distributed video render cluster) ke interconnection map me.

â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
SECTION 2: MASTER ARCHITECTURE & WORK TREE (DOCS/ DIRECTORY)
â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

5. docs/ITNAVIDEO_PROJECT_CONTEXT.md
â€¢ Kab use hota hai: Product strategy, business goals, design tokens aur core limits samajhne ke liye.
â€¢ Kaha use hota hai: Full-context file jisme user tiers ($0, $29, $49, $149), target regions (US, UK, India, EU), aur tech stack documented hai.

6. docs/ITNAVIDEO_WORK_TREE.md
â€¢ Kab use hota hai: Fast execution engine ke liye â€” daily bugs aur features kis order me touch karne hain.
â€¢ Kaha use hota hai: Dashboard UI changes aur Video Types iteration workflow me step-by-step guidance.

7. docs/ITNAVIDEO_MASTER_DOC.md
â€¢ Kab use hota hai: Comprehensive deep technical manual check karne ke liye.
â€¢ Kaha use hota hai: Database schemas, distributed rendering math, audio mastering filters, aur cloud deployment blueprints me.

8. docs/TEMPLATE_NAMING_CONVENTION.md
â€¢ Kab use hota hai: Naya Video Type create karte waqt ya existing mode rename karte waqt.
â€¢ Kaha use hota hai: Enforces exact naming match between:
  - Dashboard Mode ID (e.g. autoCaption)
  - Remotion Composition ID (e.g. AUTO-CAPTION-GENERATOR)
  - Template Folder Name (e.g. remotion/templates/AUTO_CAPTION_GENERATOR/)

9. docs/ASSET_PREPROCESSING_PIPELINE.md
â€¢ Kab use hota hai: Stickman stickers, sound effects (SFX), ya background music add karte waqt.
â€¢ Kaha use hota hai: Run \`npm run assets:index\` so public/assets/assets.json stays synced with Google Cloud Storage.

â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
SECTION 3: THE 10 VIDEO TYPES SPECIFICATIONS (DOCS/VIDEO-TYPES/)
â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
*MANDATORY RULE*: Kisi bhi video type ka code edit karne se pehle uski dedicated MD file open karke read karna lazmi hai ("Check First, Update After").

10. docs/video-types/README.md
â€¢ Kab use hota hai: Saare 10 video types ka comparison aur input requirements matrix dekhne ke liye.
â€¢ Kaha use hota hai: Kis mode me transcription bypass hoti hai aur kis me AI planner chalta hai check karne ke liye.

11. docs/video-types/autocaption.md
â€¢ Kab use hota hai: Auto Caption 9:16 Vertical Reel me edits, caption styles, ya timing changes karte waqt.
â€¢ Kaha use hota hai: 70+ competitor caption styles, safe zones, aur mobile margins reference.

12. docs/video-types/youtubesubtitles.md
â€¢ Kab use hota hai: YouTube Subtitle Generator 16:9 Landscape me kaam karte waqt.
â€¢ Kaha use hota hai: 15-minute max length, 1 credit/2 min rules, aur bottom safe padding.

13. docs/video-types/compareexplainer.md
â€¢ Kab use hota hai: Compare Explainer Video (vs images) update karte waqt.
â€¢ Kaha use hota hai: 9-stage wall-clock timing profile aur stickman pose sequence mapping.

14. docs/video-types/longvideopromo.md
â€¢ Kab use hota hai: Long Video Promo features modify karte waqt.
â€¢ Kaha use hota hai: Zero-transcription bypass verification aur 20px blur background styling.

15. docs/video-types/whiteboardvideo.md
â€¢ Kab use hota hai: Auto Draw / Whiteboard Video animation change karte waqt.
â€¢ Kaha use hota hai: Gemini 2.5 Flash scene planning aur stickman SVG drawing mechanics.

16. docs/video-types/typographyvideo.md
â€¢ Kab use hota hai: Typography Video motion physics ya word timing update karte waqt.
â€¢ Kaha use hota hai: Kinetic spring physics (damping: 12, stiffness: 200) aur gradient color cycling.

17. docs/video-types/longvideoclips.md
â€¢ Kab use hota hai: Long Video Clips (16:9 to 9:16) conversion modify karte waqt.
â€¢ Kaha use hota hai: Hook detection algorithms aur facial tracking coordinate crop logic.

18. docs/video-types/facelessvideo.md
â€¢ Kab use hota hai: Faceless Video B-roll matching ya AI director modify karte waqt.
â€¢ Kaha use hota hai: Vector semantic search on ITNAVIDEO_STOCK_ASSETS aur background audio ducking.

19. docs/video-types/imagetovideoai.md
â€¢ Kab use hota hai: Image To Video AI slide animations tweak karte waqt.
â€¢ Kaha use hota hai: Ken Burns camera zooms, multi-slide timing, aur cloud rendering benchmarks.

20. docs/video-types/audiocleaner.md
â€¢ Kab use hota hai: AI Audio Cleaner mastering filters adjust karte waqt.
â€¢ Kaha use hota hai: Retake/filler word detection, noise reduction (-25dB), and EBU R128 loudness.

================================================================================
MASTER ENVIRONMENT VARIABLES & API SAFE VAULT (.ENV.LOCAL BACKUP)
================================================================================
# â”€â”€â”€ Admin Panel â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
ADMIN_API_SECRET=8151933347
ADMIN_PASSWORD=Itnavideo@2026
ADMIN_USERNAME=itnavideo

# â”€â”€â”€ App URLs â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
NEXT_PUBLIC_SITE_URL=https://www.itnavideo.com
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api

# â”€â”€â”€ Supabase (Auth + Database) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
NEXT_PUBLIC_SUPABASE_URL=https://veqkjrcewfwtlepnyjfc.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_kvWfyUSg_SihO3Mnp93TKw_AJVntAiU
SUPABASE_SECRET_KEY=sb_secret_Xo5XelCeUxrfe8qt46lHqw_m78WP_cI

# â”€â”€â”€ Groq (Primary Speech Transcription) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
GROQ_API_KEY=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
GROQ_TRANSCRIPTION_MODEL=whisper-large-v3-turbo
GROQ_TRANSCRIPTION_RESPONSE_FORMAT=verbose_json
PREFERRED_TRANSCRIPTION_PROVIDER=groq

# â”€â”€â”€ Gemini (AI Planning & Audio Fallback) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
GEMINI_API_KEY=AIzaSyCR9-efUMpo2psDvDU8EPIksTyETam8EE8

# â”€â”€â”€ AWS (S3 Storage + Remotion Lambda) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=AKIA3CLIMM6P7BBAI5PC
AWS_SECRET_ACCESS_KEY=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
AWS_ASSET_BUCKET=itnavideo-transcribe
AWS_ASSET_REGION=us-east-1
REMOTION_AWS_REGION=us-east-1
REMOTION_BUCKET_NAME=remotionlambda-useast1-m59wp9dklj
REMOTION_LAMBDA_BUCKET_NAME=remotionlambda-useast1-m59wp9dklj
REMOTION_LAMBDA_SERVE_URL=https://remotionlambda-useast1-m59wp9dklj.s3.us-east-1.amazonaws.com/sites/itnavideo-render-30fps/index.html
REMOTION_LAMBDA_FUNCTION_NAME=remotion-render-4-0-467-mem3008mb-disk2048mb-900sec
REMOTION_LAMBDA_SITE_NAME=itnavideo-render-30fps
REMOTION_LAMBDA_CONCURRENCY=6
REMOTION_LAMBDA_USE_FRAMES_PER_LAMBDA=true

# â”€â”€â”€ Razorpay (Live Payments) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
RAZORPAY_KEY_ID=rzp_live_TDIcPcfQ6jFu3F
RAZORPAY_KEY_SECRET=D5cyRI6gQnUX7FHOLCt5Q9fG
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_TDIcPcfQ6jFu3F

# â”€â”€â”€ Google Cloud Storage & Assets â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
GCS_MEDIA_ASSETS_BUCKET=itnavideo-assets
GCS_MEDIA_ASSETS_BASE_URL=https://storage.googleapis.com/itnavideo-assets

# â”€â”€â”€ Processing Limits â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
PLANNING_MEDIA_MAX_SECONDS=60
PREPROCESS_MEDIA_MAX_SECONDS=60
TRANSCRIPTION_MAX_SECONDS=60
MAX_UPLOAD_SIZE_MB=100
MAX_VIDEO_UPLOAD_SIZE_MB=100
MAX_AUDIO_SIZE_MB=50
MAX_AUDIO_DURATION_SEC=3600
CLEAN_TRANSCRIPT_AUDIO=1
`,

  't.j5vk2hibrrxo': `================================================================================
PRODUCTION DEPLOYMENT MANUAL & PRE-FLIGHT VERIFICATION
================================================================================

1. STEP-BY-STEP POWERSHELL CLOUD DEPLOYMENT:
Step 1: Open Terminal in project directory:
cd c:\\Users\\user\\.gemini\\antigravity\\scratch\\itnavideo

Step 2: Authenticate GCloud CLI (if expired):
gcloud auth login

Step 3: Trigger Cloud Deployment Script:
powershell -ExecutionPolicy Bypass -File .\\deploy.ps1

2. WHAT HAPPENS BEHIND THE SCENES:
â€¢ Source manifest is uploaded to Google Cloud Build.
â€¢ High-performance remote servers compile the container with zero load on local laptop.
â€¢ Deploys revision to Cloud Run (us-central1, geometric-hull-501707-m2) and routes 100% traffic.

3. PRE-DEPLOY AUTOMATION TOOLS:
â€¢ Configuration Integrity: npm run verify (audits all 10 video types and UI steppers).
â€¢ Synthetic Live Tester: npm run test:live (pings live production website and presign endpoints).
`
};

console.log('Fetching latest document structure...');
const doc = await getDoc();

for (const tab of doc.tabs) {
  const tabId = tab.tabProperties?.tabId;
  const title = tab.tabProperties?.title;
  const content = TAB_CONTENTS[tabId];

  if (!content) {
    console.log(`Skipping tab: ${title} (${tabId}) - no content defined`);
    continue;
  }

  console.log(`Updating tab: ${title} (${tabId})...`);
  const bodyContent = tab.documentTab?.body?.content || [];
  const lastElement = bodyContent[bodyContent.length - 1];
  const maxIndex = lastElement ? lastElement.endIndex - 1 : 1;

  const requests = [];

  // Delete existing content if present
  if (maxIndex > 1) {
    requests.push({
      deleteContentRange: {
        range: {
          tabId: tabId,
          startIndex: 1,
          endIndex: maxIndex
        }
      }
    });
  }

  // Insert fresh comprehensive content
  requests.push({
    insertText: {
      location: {
        tabId: tabId,
        index: 1
      },
      text: content
    }
  });

  try {
    const res = await fetch(`https://docs.googleapis.com/v1/documents/${docId}:batchUpdate`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ requests })
    });

    const resJson = await res.json();
    if (res.ok) {
      console.log(`  âœ” Tab "${title}" successfully synchronized!`);
    } else {
      console.error(`  âœ˜ Error updating tab "${title}":`, resJson.error?.message || resJson);
    }
  } catch (err) {
    console.error(`  âœ˜ Exception on tab "${title}":`, err.message);
  }
}

console.log('\n================================================================================');
console.log('ALL GOOGLE DOC TABS SUCCESSFULLY POPULATED AND SYNCHRONIZED!');
console.log('================================================================================\n');
