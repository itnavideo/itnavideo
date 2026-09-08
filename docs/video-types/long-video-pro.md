# Long Video Pro

AI-directed 16:9 long-form video with scene planning, kinetic typography, and intelligent asset matching.

---

## Overview

| Property | Value |
|----------|-------|
| Mode | `longVideoPro` |
| Composition ID | `LONG-VIDEO-PRO` |
| Template folder | `remotion/templates/LONG_VIDEO/` |
| Aspect ratio | 16:9 (1920×1080) |
| Max duration | 10 minutes |
| FPS | 30 |
| Billing | 1 credit per started minute (flat) |

---

## What It Does

Takes a user's audio/video upload and produces a fully-directed 16:9 video with:
- **AI scene planning** (Gemini or deterministic fallback)
- **Kinetic typography** — keyword emphasis synced to speech
- **Asset matching** — selects relevant images from the library per scene
- **Captions** — word-grouped from Groq Whisper transcript
- **Title cards** and **callout scenes** based on topic flow
- **Smooth transitions** between sections

---

## User Input

| Field | Required | Description |
|-------|----------|-------------|
| Audio or Video file | YES | Up to 500MB, max 10 minutes. Must have clear speech. |
| Topic title | Optional | Helps AI plan better scenes. Auto-detected from transcript if empty. |

---

## Render Pipeline

```
1. User uploads video/audio → S3 (itnavideo-transcribe)
2. Audio extraction from S3 (AWS — ffmpeg extracts mono 16kHz MP3)
3. Groq Whisper transcription (~5MB audio file)
4. Scene Director (Gemini AI or fallback) plans visual shots
5. Asset Matcher selects images from library per scene
6. Build render props (scenes, captions, typography)
7. Remotion Lambda renders 16:9 MP4
8. Poll status → download URL
```

### Audio Extraction (Key Architecture)

Large videos (up to 500MB) are handled by extracting ONLY the audio track:
- Video stays on S3, never downloaded to Vercel
- Audio extracted via AWS (Lambda or Remotion's bundled ffmpeg)
- 10 min mono 16kHz 64kbps = ~5MB (well within Groq's 25MB limit)
- Original full-quality video URL passed directly to Lambda for render

**Two extraction modes:**
1. **Dedicated Lambda** (env: `AUDIO_EXTRACT_LAMBDA_FUNCTION`) — zero Vercel load
2. **Fallback** — uses `@remotion/compositor` bundled ffmpeg locally

---

## Scene Types

| Type | Visual | When Used |
|------|--------|-----------|
| `title` | Large centered text, gradient bg | Intro, topic introduction, CTA |
| `typography` | Animated keyword with underline accent | Emphasis, tension, default fallback |
| `image` | Ken Burns on matched asset | When library has relevant image |
| `callout` | Bullet points list | Comparisons, conclusions |
| `narration` | Subtle pulsing gradient + watermark | Filler between active scenes |
| `transition` | Dark fade | Between major sections |

### Typography Fallback

If NO images are available in the asset library, ALL visual scenes fall back to **animated typography** — never blank screens. The keyword is extracted from:
1. Scene emphasis words (from AI planner)
2. Asset query text
3. Longest meaningful word from captions in that segment

---

## Asset Library

Assets are stored on S3:
```
s3://itnavideo-transcribe/itnavideo/images/
├── index.json          ← asset metadata for matching
├── bank-logos/         ← category folders
├── finance/
├── technology/
└── ...
```

- `assetMatcher.ts` loads `index.json` (or falls back to Lambda site bundle `assets.json`)
- Matching uses: visual type compatibility, mood/intent, keyword overlap, reuse penalty
- Only HTTPS URLs passed to Lambda renderer (no local paths)

---

## Scene Director

`services/ai/sceneDirector.ts` — Plans visual shots from transcript.

- **Primary:** Gemini API (free, smart scene planning)
- **Fallback:** Deterministic local planner (splits by pauses/topic changes)

Each scene gets: `startTime`, `endTime`, `intent`, `visualType`, `motion`, `emphasis[]`, `assetQuery`

---

## Billing

| Duration | Credits |
|----------|---------|
| 0–1 min | 1 |
| 1–2 min | 2 |
| 5 min | 5 |
| 10 min | 10 |

Flat: 1 credit per started minute. No discounts for longer videos.

Early credit check is SKIPPED (duration unknown until transcription completes).

---

## Environment Variables

| Var | Purpose |
|-----|---------|
| `GROQ_API_KEY` | Whisper transcription |
| `GEMINI_API_KEY` | Scene planning (free) |
| `AUDIO_EXTRACT_LAMBDA_FUNCTION` | Optional: dedicated Lambda for audio extraction |
| `REMOTION_LAMBDA_SERVE_URL` | Lambda site bundle URL |
| `REMOTION_LAMBDA_FUNCTION_NAME` | Render function |
| `AWS_REGION` | ap-south-1 |

---

## Key Files

| File | Purpose |
|------|---------|
| `remotion/templates/LONG_VIDEO/template.tsx` | Remotion composition (6 scene renderers) |
| `app/api/reels/jobs/route.ts` | Backend orchestration (line ~744) |
| `services/media/audioExtractLambda.ts` | S3 audio extraction service |
| `services/ai/sceneDirector.ts` | Gemini scene planner |
| `services/ai/assetMatcher.ts` | Asset library matching |
| `services/ai/visualIntelligence.ts` | Probabilistic editing |
| `services/ai/typographyPipeline.ts` | Kinetic typography |
| `services/ai/directorBrain.ts` | Pacing + continuity |
| `lib/billing/creditPricing.ts` | Duration-based billing |

---

## Dashboard

- Mode: `longVideoPro`
- Category: Long Videos
- Upload: accepts audio + video (up to 500MB)
- Progress steps: Upload received → Extracting audio → Transcribing speech → Planning scenes → Matching assets → Rendering 16:9 MP4 → Ready

---

## Deployment

Both deploys needed for any change:
```bash
npx vercel --prod          # Frontend + API
npm run reel:lambda:deploy  # Remotion render engine
```

---

## Known Limitations

- No 4K — renders at 1080p max
- Asset library currently has only bank logos (more categories coming)
- If no assets match, all scenes use typography fallback (still looks good)
- Videos without clear speech will be rejected
- Groq file limit: 25MB (handled by audio extraction — never an issue)
- Vercel function timeout: 60s (audio extraction may need dedicated Lambda for 500MB files)
