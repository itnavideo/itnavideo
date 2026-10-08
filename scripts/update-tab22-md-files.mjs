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

const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`
});

const tokenData = await tokenRes.json();
const accessToken = tokenData.access_token;
const docId = '1bJkaF6OAysRQUNnxSusLKsjRCs0mGJhsjE2m1fyeC1U';
const tabId = 't.aiv4w5fbe0h7'; // Tab 22: MD files

const mdFilesGuideContent = `================================================================================
ITNAVIDEO — COMPLETE MD FILES REGISTRY & USAGE GUIDE
================================================================================

Ye guide Itnavideo codebase me moujood har ek Markdown (.md) file ka exact role, kab open karna hai, aur kaha use hota hai detail me explain karti hai.

────────────────────────────────────────────────────────────────────────────────
SECTION 1: CORE AGENT RULES & DEVELOPER SAFETY (ROOT DIRECTORY)
────────────────────────────────────────────────────────────────────────────────

1. AGENTS.md (c:\\...\\itnavideo\\AGENTS.md)
• Kab use hota hai: Jab bhi Antigravity, Cursor, Codex ya koi bhi AI coding agent project par kaam shuru kare. Ye Itnavideo ka SINGLE SOURCE OF TRUTH hai.
• Kaha use hota hai:
  - Rule 0: Strict 4GB RAM / HDD Machine Policy (Local render aur local heavy ffmpeg 100% FORBIDDEN).
  - Rule 0.1: Strict Zero Automatic Git Push (Founder permission ke bina push nahi karna).
  - Rule 0.2: Instant response & 2-minute progress heartbeat.
  - Rule 0.5: Reply language must be Roman English (Hinglish/English only, no Devanagari).
  - Master Color Palette & Material Design 3 (M3) standards.

2. GEMINI.md (c:\\...\\itnavideo\\GEMINI.md)
• Kab use hota hai: Gemini Assistant specific directives aur workflow validation ke liye.
• Kaha use hota hai:
  - "Check First, Update After" workflow enforce karta hai.
  - Local deploy commands (deploy.ps1) permission verify karta hai.

3. README.md (c:\\...\\itnavideo\\README.md)
• Kab use hota hai: Naya developer onboard karte waqt ya repository initial setup ke waqt.
• Kaha use hota hai: Local environment setup, npm install, required node versions, aur basic script commands run karne me.

4. INFRASTRUCTURE.md (c:\\...\\itnavideo\\INFRASTRUCTURE.md)
• Kab use hota hai: Cloud architecture aur server mapping check karte waqt.
• Kaha use hota hai: Google Cloud Run (web hosting), Google Cloud Storage (media), aur AWS Lambda (distributed video render cluster) ke interconnection map me.

────────────────────────────────────────────────────────────────────────────────
SECTION 2: MASTER ARCHITECTURE & WORK TREE (DOCS/ DIRECTORY)
────────────────────────────────────────────────────────────────────────────────

5. docs/ITNAVIDEO_PROJECT_CONTEXT.md
• Kab use hota hai: Product strategy, business goals, design tokens aur core limits samajhne ke liye.
• Kaha use hota hai: Full-context file jisme user tiers ($0, $29, $49, $149), target regions (US, UK, India, EU), aur tech stack documented hai.

6. docs/ITNAVIDEO_WORK_TREE.md
• Kab use hota hai: Fast execution engine ke liye — daily bugs aur features kis order me touch karne hain.
• Kaha use hota hai: Dashboard UI changes aur Video Types iteration workflow me step-by-step guidance.

7. docs/ITNAVIDEO_MASTER_DOC.md
• Kab use hota hai: Comprehensive deep technical manual check karne ke liye.
• Kaha use hota hai: Database schemas, distributed rendering math, audio mastering filters, aur cloud deployment blueprints me.

8. docs/TEMPLATE_NAMING_CONVENTION.md
• Kab use hota hai: Naya Video Type create karte waqt ya existing mode rename karte waqt.
• Kaha use hota hai: Enforces exact naming match between:
  - Dashboard Mode ID (e.g. autoCaption)
  - Remotion Composition ID (e.g. AUTO-CAPTION-GENERATOR)
  - Template Folder Name (e.g. remotion/templates/AUTO_CAPTION_GENERATOR/)

9. docs/ASSET_PREPROCESSING_PIPELINE.md
• Kab use hota hai: Stickman stickers, sound effects (SFX), ya background music add karte waqt.
• Kaha use hota hai: Run \`npm run assets:index\` so public/assets/assets.json stays synced with Google Cloud Storage.

────────────────────────────────────────────────────────────────────────────────
SECTION 3: THE 10 VIDEO TYPES SPECIFICATIONS (DOCS/VIDEO-TYPES/)
────────────────────────────────────────────────────────────────────────────────
*MANDATORY RULE*: Kisi bhi video type ka code edit karne se pehle uski dedicated MD file open karke read karna lazmi hai ("Check First, Update After").

10. docs/video-types/README.md
• Kab use hota hai: Saare 10 video types ka comparison aur input requirements matrix dekhne ke liye.
• Kaha use hota hai: Kis mode me transcription bypass hoti hai aur kis me AI planner chalta hai check karne ke liye.

11. docs/video-types/autocaption.md
• Kab use hota hai: Auto Caption 9:16 Vertical Reel me edits, caption styles, ya timing changes karte waqt.
• Kaha use hota hai: 70+ competitor caption styles, safe zones, aur mobile margins reference.

12. docs/video-types/youtubesubtitles.md
• Kab use hota hai: YouTube Subtitle Generator 16:9 Landscape me kaam karte waqt.
• Kaha use hota hai: 15-minute max length, 1 credit/2 min rules, aur bottom safe padding.

13. docs/video-types/compareexplainer.md
• Kab use hota hai: Compare Explainer Video (vs images) update karte waqt.
• Kaha use hota hai: 9-stage wall-clock timing profile aur stickman pose sequence mapping.

14. docs/video-types/longvideopromo.md
• Kab use hota hai: Long Video Promo features modify karte waqt.
• Kaha use hota hai: Zero-transcription bypass verification aur 20px blur background styling.

15. docs/video-types/whiteboardvideo.md
• Kab use hota hai: Auto Draw / Whiteboard Video animation change karte waqt.
• Kaha use hota hai: Gemini 2.5 Flash scene planning aur stickman SVG drawing mechanics.

16. docs/video-types/typographyvideo.md
• Kab use hota hai: Typography Video motion physics ya word timing update karte waqt.
• Kaha use hota hai: Kinetic spring physics (damping: 12, stiffness: 200) aur gradient color cycling.

17. docs/video-types/longvideoclips.md
• Kab use hota hai: Long Video Clips (16:9 to 9:16) conversion modify karte waqt.
• Kaha use hota hai: Hook detection algorithms aur facial tracking coordinate crop logic.

18. docs/video-types/facelessvideo.md
• Kab use hota hai: Faceless Video B-roll matching ya AI director modify karte waqt.
• Kaha use hota hai: Vector semantic search on ITNAVIDEO_STOCK_ASSETS aur background audio ducking.

19. docs/video-types/imagetovideoai.md
• Kab use hota hai: Image To Video AI slide animations tweak karte waqt.
• Kaha use hota hai: Ken Burns camera zooms, multi-slide timing, aur cloud rendering benchmarks.

20. docs/video-types/audiocleaner.md
• Kab use hota hai: AI Audio Cleaner mastering filters adjust karte waqt.
• Kaha use hota hai: Retake/filler word detection, noise reduction (-25dB), and EBU R128 loudness.

================================================================================
MASTER ENVIRONMENT VARIABLES & API SAFE VAULT (.ENV.LOCAL BACKUP)
================================================================================
# ─── Admin Panel ──────────────────────────────────────────────────────────
ADMIN_API_SECRET=8151933347
ADMIN_PASSWORD=Itnavideo@2026
ADMIN_USERNAME=itnavideo

# ─── App URLs ─────────────────────────────────────────────────────────────
NEXT_PUBLIC_SITE_URL=https://www.itnavideo.com
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api

# ─── Supabase (Auth + Database) ───────────────────────────────────────────
NEXT_PUBLIC_SUPABASE_URL=https://veqkjrcewfwtlepnyjfc.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_kvWfyUSg_SihO3Mnp93TKw_AJVntAiU
SUPABASE_SECRET_KEY=sb_secret_Xo5XelCeUxrfe8qt46lHqw_m78WP_cI

# ─── Groq (Primary Speech Transcription) ───────────────────────────────────
GROQ_API_KEY=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
GROQ_TRANSCRIPTION_MODEL=whisper-large-v3-turbo
GROQ_TRANSCRIPTION_RESPONSE_FORMAT=verbose_json
PREFERRED_TRANSCRIPTION_PROVIDER=groq

# ─── Gemini (AI Planning & Audio Fallback) ────────────────────────────────
GEMINI_API_KEY=AIzaSyCR9-efUMpo2psDvDU8EPIksTyETam8EE8

# ─── AWS (S3 Storage + Remotion Lambda) ───────────────────────────────────
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

# ─── Razorpay (Live Payments) ─────────────────────────────────────────────
RAZORPAY_KEY_ID=rzp_live_TDIcPcfQ6jFu3F
RAZORPAY_KEY_SECRET=D5cyRI6gQnUX7FHOLCt5Q9fG
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_TDIcPcfQ6jFu3F

# ─── Google Cloud Storage & Assets ────────────────────────────────────────
GCS_MEDIA_ASSETS_BUCKET=itnavideo-assets
GCS_MEDIA_ASSETS_BASE_URL=https://storage.googleapis.com/itnavideo-assets

# ─── Processing Limits ────────────────────────────────────────────────────
PLANNING_MEDIA_MAX_SECONDS=60
PREPROCESS_MEDIA_MAX_SECONDS=60
TRANSCRIPTION_MAX_SECONDS=60
MAX_UPLOAD_SIZE_MB=100
MAX_VIDEO_UPLOAD_SIZE_MB=100
MAX_AUDIO_SIZE_MB=50
MAX_AUDIO_DURATION_SEC=3600
CLEAN_TRANSCRIPT_AUDIO=1
`;

// Fetch tab state
const docRes = await fetch(`https://docs.googleapis.com/v1/documents/${docId}?includeTabsContent=true`, {
  headers: { Authorization: `Bearer ${accessToken}` }
});
const doc = await docRes.json();
const tab = doc.tabs.find(t => t.tabProperties?.tabId === tabId);

const bodyContent = tab?.documentTab?.body?.content || [];
const lastElement = bodyContent[bodyContent.length - 1];
const maxIndex = lastElement ? lastElement.endIndex - 1 : 1;

const requests = [];
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

requests.push({
  insertText: {
    location: {
      tabId: tabId,
      index: 1
    },
    text: mdFilesGuideContent
  }
});

const updateRes = await fetch(`https://docs.googleapis.com/v1/documents/${docId}:batchUpdate`, {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ requests })
});

const resJson = await updateRes.json();
if (updateRes.ok) {
  console.log('SUCCESS: Tab 22 (MD files) has been completely updated with the MD Files Registry & Usage Guide!');
} else {
  console.error('ERROR updating Tab 22:', resJson);
}
