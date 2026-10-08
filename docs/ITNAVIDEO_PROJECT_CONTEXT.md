# Reference Note

This document remains useful as agent/project context. Please use `docs/ITNAVIDEO_MASTER_DOC.md` as the latest source of truth for Itnavideo product documentation.

# Itnavideo â€” Project Context

## What is Itnavideo

Itnavideo is an AI-powered video creation platform. Users upload raw content (video, audio, images) and get polished, ready-to-post short videos (reels) without manual editing.

It is NOT a video editor. Users do not drag timelines, cut clips, or choose fonts. They upload content, pick a Video Type, and AI handles the rest.

## Product Goal

Turn raw creator content into publish-ready 9:16 reels or a preserved 16:9 long-form captioned video, with no editing skills required.

## Target Users

- YouTube creators promoting long videos
- Instagram/TikTok creators needing captions
- Educators making explainer content
- Small businesses promoting products/services
- Religious content creators (noha, munajat, bayan)
- News/current affairs channels
- Finance/banking educators
- Coaches, consultants, personal brands
- Anyone who has content but no time/skill to edit

## Current Status

- **1080p Full HD Quality Standard**: Every single video rendered across all modes is strictly exported in **1080p Full HD** (1080×1920 for 9:16 vertical shorts, 1920×1080 for 16:9 cinema widescreen) at 30 FPS.
- **Short-Form Videos (9:16)**: All TikTok, Reels, and YouTube Shorts support up to **3 Minutes (180 seconds)** in 1080×1920.
- **Long-Form Videos (16:9)**: All YouTube long-form videos support up to **12 Minutes (720 seconds)** in 1920×1080.
- **Long Video to Clips (`longvideoclips`)**: Accepts input up to **3 Hours (10,800s)**; generates multiple **30s–60s** viral clips in 1080×1920. Full long video is never rendered.
- **Audio Extraction First**: Heavy media is never sent directly to transcription; 16kHz mono audio is extracted first.
- **Transcription**: Primary: Groq Whisper Cloud API. Mandatory Fallback: Google Gemini 2.0 Flash (`asia-south1`).
- **Cloud Rendering Engine**: AWS Lambda (Remotion in Mumbai `us-east-1`).
- No paid translation APIs; supports English and Roman Hinglish captions.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js (App Router), React, Tailwind CSS, Framer Motion |
| UI & Animation Inspirations | **Vengeance UI** (SaaS landing / glow cards), **Skipper UI** (tactile controls / pills), **Animmaster Lib** (kinetic motion / reveals) |
| Render Engine | Remotion (compositions rendered on AWS Lambda) |
| Transcription | Groq Whisper |
| AI Planning | Google Cloud strictly for AI APIs (Gemini/Vertex) |
| Render Storage | AWS S3 (`itnavideo-media-assets`) |
| Image/Video CDN | Cloudinary (Website images & demo videos) |
| Auth | Supabase |
| Payments | Razorpay |
| Hosting | Google Cloud Run (`itnavideo-web`) |
| Fonts | Google Fonts via @remotion/google-fonts |

## Deployment Rules & Commands

- **Web Application & API Server**: Google Cloud Run via `npm run deploy` (or `powershell -ExecutionPolicy Bypass -File .\deploy.ps1`).
- **Video Rendering Engine**: AWS Remotion Lambda via `npm run reel:lambda:deploy`.
- **Render Storage & Temporary Buffers**: AWS S3 (`itnavideo-media-assets` & `remotionlambda-*`).
- **Website UI & Demo Videos**: Cloudinary.
- **AI Planning & Fallback Transcription**: Google Cloud (Gemini 2.0 Flash) / Groq Cloud Whisper.

## Infrastructure Constraints

- Google Cloud Run hosts the containerized Next.js web application (`https://www.itnavideo.com`).
- AWS Lambda handles all Remotion video rendering.
- AWS S3 hosts render media assets and temporary render chunks.
- Cloudinary hosts all website images, marketing graphics, and demo videos.

## Client Environment & Zero Local Render Rule (4GB RAM / HDD)

- The developer workstation is a 4GB RAM laptop with mechanical HDD (No SSD).
- **NEVER** run local Remotion rendering (`npm run reel:render` / Chromium puppeteer), local heavy FFmpeg video encoding, or local ML models. It will freeze the machine.
- All rendering must be offloaded to **AWS Remotion Lambda** (`npm run reel:lambda:render` or production `/api/reels/jobs`).
- All transcription runs on **Groq Whisper Cloud API**.
- Local operations are strictly limited to code editing, `git`, lightweight typecheck (`npx tsc --noEmit`), and cloud deployments.

---

## Design System

### Color System (Google Analytics Specification — Mandatory)

```
Background dark:   #070B14 (deep obsidian base)
Container dark:    #0E1526 (elevated surface container)
Container highlight:#151E30 (high surface container)
Background light:  #FFFFFF / #F8FAFC (clean light canvas)
Primary highlight: #FF6D00 (signature Google Analytics vibrant orange)
Primary mid accent:#FF8F00 (smooth warm transition orange)
Primary warm gold: #FFA726 (highlight tail for gradient headlines)
Text primary dark: #FFFFFF / #F1F5F9 (high legibility dark text)
Text primary light:#0F172A / #1E293B (slate body and headings)
Text muted:        #64748B / #94A3B8 (subtitles, metadata)
Borders:           border-white/10 (dark) / border-slate-200 (light)
Success:           #10B981 (emerald completed status)
Warning:           #F59E0B (amber status / credits)
Danger:            #EF4444 (red error status)
```

### Color & Typography Rules (Modern SaaS Intentional Harmony Standard)
- **Design Variety & Purposeful Colors**: Rigid single-color or single-font platforms feel repetitive and boring. To match modern AI video & SaaS tools (CapCut, Submagic, Descript, Canva, Linear), Itnavideo supports vibrant, feature-specific color accents (GA Orange `#FF6D00`, Emerald Tech `#10B981`, Corporate Blue `#3B82F6`, Cyber Gold `#FFD700`, Impact Red `#EF4444`, Neon Mint `#00F5D4`) alongside rich typography choices (`Plus Jakarta Sans`, `Montserrat`, `Impact`, `Bebas Neue`, `Komika Axis`, `Fraunces`, `Inter`).
- **Cohesive Baseline Structure**: Dashboard canvases (`#070B14`), container cards (`#0E1526`), structural borders (`border-white/10`), and M3 radiuses (`rounded-[28px]` cards, `rounded-2xl` inputs, `rounded-full` pills) maintain visual quality and layout harmony across all studios.

---

## Asset System & Dashboard Hero Banners

- **Production Render Assets**: `public/assets/reusable/` (indexed via `npm run assets:index` into `public/assets/assets.json`, binaries served from AWS S3 `itnavideo-media-assets`).
- **Website UI & Marketing Assets**: `public/visuals/`, `public/brand/`, `public/founder/`.
- **Homepage 2-Image Output Showcase**:
  - `public/visuals/homepage/{videotype}.1.png` & `.2.png`
- **Dashboard Section Hero Banners**:
  - `public/visuals/dashboard hero images/reels.dashboard.png` (9:16 Shorts & Reels Studio)
  - `public/visuals/dashboard hero images/longvideos.dashboard.png` (16:9 Cinema & Long-Form Studio)
  - `public/visuals/dashboard hero images/audio.dashboard.png` (Audio & AI Utilities Studio)

### Typography
- Headings: Space Grotesk / system-ui
- Body: Geist Sans / system-ui
- Gradient text: only for 1-3 highlighted words, never full paragraphs

---

## Naming System

| Term | Meaning |
|------|---------|
| Video Type | Top-level video workflow, such as Auto Caption Video, Compare Explainer Video, or Long Video Promo |
| Video Type Implementation | Technical Remotion/code implementation for a Video Type, or a future style/layout inside a Video Type |
| Mode | Internal dashboard state matching a Video Type implementation |
| Composition | Remotion composition ID (used in Lambda render) |
| Render Props | JSON data passed to the Remotion composition |
| Overlay Timeline | Array of timed text/visual scenes |
| Captions | Word-grouped subtitle segments with timing |

### Video Type Implementation Naming Convention
- Folder name: `TEMPLATE_NAME` (uppercase, underscores)
- Composition ID: `TEMPLATE-NAME` (uppercase, dashes)
- Mode: `camelCase` in dashboard code
- No underscores in Composition IDs (Remotion limitation)

---

## Video Type vs Layout vs Style

- **Video Type** = top-level user choice (Compare Explainer Video, Auto Caption Video, Long Video Promo)
- **Layout** = how elements are arranged on screen for that Video Type
- **Style** = visual variation within a Video Type (sticker character, caption style)

Each Video Type currently has ONE core layout. Styles are optional variations within that layout.

---

## Caption Rules

- Source: Groq Whisper transcription (word-level timing)
- Do not show subtitle language dropdowns in the dashboard. Users should not have to choose English/Hindi/Urdu subtitle output.
- For Video Types that show subtitles/captions/text from speech, the visible text should follow the uploaded audio/video language as produced by the supported Groq transcription pipeline.
- If the user uploads English speech, captions/text should be English. If the user uploads Hindi/Urdu/Hinglish speech, captions/text should follow the supported Roman Hindi/Urdu/Hinglish output.
- Do not promise translation/conversion between languages from the dashboard.
- Supported languages: English, Hinglish (Roman script)
- No Devanagari/Urdu/Arabic script in visible captions
- Hindi audio â†’ clean Roman Hinglish captions
- English audio â†’ English captions
- Each render gets fresh captions from current upload (no cached data)
- Max 5 words per caption group, max 1.5s per group
- No paid translation APIs

## Compare Explainer Studio Architecture & Rules

> [!IMPORTANT]
> **Core Dashboard Principle**:
> **"User controls only what changes the content. System AI controls everything else."**

### 4-Step Studio Flow:
1. **1. VOICEOVER**: Raw narration upload (`.mp3` or `.wav`). Your speech pacing drives the video.
2. **2. COMPARISON**: Image A + Name A (Left Title) and Image B + Name B (Right Title) side-by-side.
3. **3. CHARACTER**: Presenter avatar selection (9 high-quality 3D avatars across `All | 3D | 2D | Professional` categories).
4. **4. OPTIONAL**: Instagram / Channel Handle tag with clean `Show on video` checkbox toggle.
5. **Generate Video CTA**: One-click cloud render triggering automated split-screen framing, dynamic zooms, auto-captions, and winner reveals.

### Automated System Intelligence (Zero Manual Burden):
- **Poses & Gestures**: Synced dynamically with spoken beats.
  - 55-65% of video = left/right direction poses
  - 35-45% = special poses (welcome, thinking, warning, success, question, explaining, comparing, celebrating)
- **Expressions & SFX**: Emotion-matched (thinking, confident, winner shock) and sound effects (versus dings, whooshes, point hits) automatically placed.
- **Timing & Captions**: Millisecond-accurate word alignments from Groq Whisper Cloud with high-contrast kinetic auto-subtitles.
- **No Heavy Client Canvas Preview**: Relies on deterministic 1080p cloud render, keeping developer laptop memory overhead at zero.

---

## Asset Rules

- Render assets: `public/assets/` (local only, NOT deployed to Vercel)
- Website UI assets: `public/visuals/`, `public/brand/`
- Production render assets served from S3/CDN
- Remotion video type implementation folders are code-only (no images/fonts/sounds inside)
- After adding/removing assets: run `npm run assets:index`

## Timeline JSON Rules

- `overlayTimeline`: array of `{id, start, end, text, type, ...}`
- `captions`: array of `{start, end, text, words?}`
- All times in seconds (float)
- Scenes must not overlap
- First scene starts at 0
- Last scene ends at or before `durationSeconds`
- Preview-first video types must pass the same canonical timeline/settings JSON from `/api/reels/preview` into `PreviewEditor` and then into `/api/reels/jobs`
- Preview edits should be stored as JSON changes (`captions`, `scenes`, `stickers`, `layout`, `assets`, `userEdits`) rather than separate final-render-only fields

---

## Code Quality Rules

- Read existing code before writing new code
- Match project style and conventions
- Do not add features beyond what's asked
- Do not add tests unless explicitly requested
- TypeScript diagnostics must be clean after every change
- Run build check before presenting results
- No unused imports, props, or variables in video type implementations
- Video type implementations should be clean and focused on their 3-4 core elements

## QA Rules

- Every video type change must be visually verified (local render or contact sheet)
- Diagnostic script should confirm expected behavior
- Test with both 16:9 and vertical inputs where applicable
- Test with long titles (overflow handling)
- Test with missing optional props (fallbacks work)

## What to Avoid

- Over-designed UI (keep it clean and focused)
- Random decorative elements (gradients, circles, particles)
- Glassmorphism everywhere
- Channel name/subscriber/subscribe button in video type implementations (unless explicitly needed)
- Forced CTA text user didn't provide
- Multiple paid AI API calls for the same decision
- Broad single-word keyword matching
- Pure black backgrounds
- Low-contrast text
- Static-looking videos (everything should have subtle motion)

## Premium Video Type Principles

For every new Video Type, use these professional-editor principles unless the specific spec forbids them:

- Use one shared `styleLock` per render: palette, font, caption/label style, motion family, transition family, icon/sticker direction, and sound pack should feel like one designed world.
- Add cinematic consistency: color grade/LUT-like filter, subtle grain, vignette, depth, shadows, and background blur where appropriate.
- Add subtle camera life: Ken Burns, pan, or controlled motion. Avoid aggressive shake unless it is content-motivated.
- Keep pacing breathable: visual change roughly every 3 seconds, but leave short pauses after dense information.
- Use diegetic SFX only for visible events: UI click, text pop, swipe, page turn, cash, warning, success chime.
- Use audio ducking so voiceover/uploaded audio stays primary.
- Finance/fintech videos should use cool trust grading, precise micro-interactions, shimmer/click/cash/success cues, and no noisy effects.
- Auto Caption remains the exception: no added SFX/music/visual treatment by default; preserve the user's video and audio.

---

## How AI/Developers Should Work Before Coding

1. Read `ITNAVIDEO_PROJECT_CONTEXT.md` (this file)
2. Read the specific video type file in `docs/video-types/`
3. Check existing video type implementation code to understand current state
4. Plan the change before implementing
5. Implement with minimal additions (no feature creep)
6. Verify with diagnostics + visual QA
7. Deploy to AWS
8. Update the video type documentation if behavior changed

---

## Pricing / Credit Rules

- **9:16 Shorts & Reels (upto 3 min)**: `10 Credits` (Auto Caption, Typography, Compare, Whiteboard, Long Video Promo, Faceless Video, Image to Video).
- **16:9 Long-Form Videos (upto 12 min)**: `20 Credits` (YouTube Subtitles, Cinema Explainers, Long Form Faceless, Image to Video AI).
- **AI Audio Cleaner (upto 30 min audio)**: `5 Credits` (Studio loudness mastering, retake and mistake removal).
- **Long Video Clips (upto 3hr source)**: `10 Credits / clip`.
- **Free Signup Trial**: `20 Free Credits` (2 free 9:16 reels or 1 16:9 long video with subtle watermark).
- **Packs & Tiers**:
  - Starter (\$29): `300 Credits` (~30 Reels or 15 Long Videos)
  - Growth / Pro Creator (\$49): `1,000 Credits` (~100 Reels or 50 Long Videos)
  - Pro / Agency (\$149): `2,500 Credits` (~250 Reels or 125 Long Videos)
- Paid credit packs are one-time Razorpay payments. Monthly packs remain active for 30 days.
- Failed renders due to system issues are not charged.
- Preview generation/editing does not deduct credits.
- Deduct/reserve credits only when the final render starts.

## Dashboard UX Rules

- Video Types shown as phone-frame preview cards (3 per row)
- No Video Type opened by default (user must click to see form)
- Form only shows after Video Type selection
- Upload section auto-scrolls on mobile after Video Type choice
- Supported Video Types should use preview-first flow: generate preview plan â†’ user reviews/edits â†’ final render
- Keep form fields minimal (only what the Video Type actually renders)
- Remove fields the Video Type no longer uses
