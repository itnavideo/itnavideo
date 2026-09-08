# Itnavideo Master Documentation

**Latest source of truth:** This file is the main project documentation for Itnavideo.

Last updated: 2026-07-02

Use this document before changing product behavior, dashboard UX, video types, render flow, captions, assets, SEO pages, deployment, or roadmap.

Older docs are kept as historical/reference material. If another document conflicts with this one, follow this master doc first and then update the older document or add a clarification note.

## Table of Contents

1. [Startup Overview](#1-startup-overview)
2. [Product Overview](#2-product-overview)
3. [Video Types](#3-video-types)
4. [Technical Architecture](#4-technical-architecture)
5. [Processing Pipeline](#5-processing-pipeline)
6. [Design System](#6-design-system)
7. [Dashboard / UI Rules](#7-dashboard--ui-rules)
8. [SEO Strategy](#8-seo-strategy)
9. [Marketing Strategy](#9-marketing-strategy)
10. [Security / Privacy](#10-security--privacy)
11. [Roadmap](#11-roadmap)
12. [Deployment Notes](#12-deployment-notes)
13. [Known Issues / Bugs](#13-known-issues--bugs)
14. [Decisions / Rules](#14-decisions--rules)
15. [Documentation Map](#15-documentation-map)
16. [Docs Reviewed During Consolidation](#16-docs-reviewed-during-consolidation)

## 1. Startup Overview

### What Itnavideo Is

Itnavideo is an AI-powered short video generator for creators. Users upload raw content such as video, audio, images, screenshots, logos, thumbnails, or prompts, choose a Video Type, and receive a polished 9:16 reel.

Itnavideo is not a traditional video editor. Users should not need to drag timelines, manually cut clips, design layouts, or choose every visual detail. The platform should automate transcription, planning, captions, timing, layout, rendering, and export.

### Target Users

| User Segment | Main Use Case |
|---|---|
| YouTube creators | Promote long videos with short reels. |
| Instagram/TikTok creators | Add captions and creator-style motion to talking videos. |
| Educators | Explain topics using whiteboard, notes, comparison, or typography reels. |
| Finance/banking creators | Explain policies, products, comparisons, and updates. |
| Religious content creators | Promote noha, munajat, bayan, lectures, and long-form content. |
| News/current affairs channels | Create quick news explainer reels. |
| Small businesses | Promote products, services, and offers. |
| Coaches/consultants | Create teaching, motivational, and personal brand clips. |

### Main Problem

- Short-form video creation takes editing skill, time, tools, and design taste.
- Many creators and small businesses cannot afford professional editors.
- Existing AI video tools can feel generic, low-quality, or disconnected from real creator content.
- Captions, layout, render settings, thumbnails, and export formats are confusing for non-editors.

### Main Solution

- User uploads content or describes what they want.
- Itnavideo transcribes, plans, styles, renders, and exports focused video outputs: 9:16 reels by default and a named 16:9 long-form captioned workflow.
- Video Types provide focused workflows instead of one confusing generic editor.
- AI and deterministic planners handle structure; Remotion/FFmpeg handle video output.
- The user sees progress, history, and download without managing technical details.

### Current Product Status

| Area | Status |
|---|---|
| Website | Live at `https://www.itnavideo.com`. |
| Main output | 9:16 short-form MP4 reels by default, plus 16:9 Long-form Captioned Video output. |
| Render engine | Remotion on AWS Lambda. |
| Transcription | Groq Whisper. |
| Storage | AWS S3 temporary uploads and outputs, roughly 48-hour lifecycle. |
| Auth/database | Supabase. |
| Payments | Razorpay. |
| Pricing model | Credit-based. Short video exports use 1 credit; Long-form Captioned Video uses duration-based credits. |
| Language scope | English and Hinglish/Roman script captions. Multi-language translation is paused. |

## 2. Product Overview

### What Users Can Create

Users can create:

- Captioned talking videos
- Creator typography reels
- Side-by-side comparison explainers
- Whiteboard/notes explainers
- Long-form captioned videos (16:9, original media/audio preserved)
- Background-replaced creator clips
- Prompt-driven custom reels

### Official Product Catalog

This master doc tracks 8 product-facing Video Types:

1. Auto Caption Video
2. Dynamic Creator Reel Video
3. Compare Explainer Video
4. Auto Draw Explainer Video
5. Long-form Captioned Video
6. Long Video Promo
7. Background Replace Video
8. Custom AI Reel

> Note: Some older docs describe 6 production Video Types, while some startup docs describe 7 video types. This master doc keeps all 7 requested product workflows visible and marks any uncertain production status in the Video Types section.

### Dashboard Flow

1. User signs in.
2. User opens dashboard.
3. User chooses a Video Type.
4. User uploads required media and fills required fields.
5. User adjusts simple options.
6. Dashboard shows preview or clear upload state where supported.
7. User sees credit cost before render.
8. User starts render.
9. Dashboard shows progress and errors clearly.
10. User downloads final MP4 from history/recent renders.

### Credits / Pricing

- Credits control video generation usage. Plans are currently one-time purchases; no payment method is charged automatically.
- Creator: ₹799/month, 30 monthly credits.
- Channel: ₹1,999/month, 90 monthly credits.
- Agency: ₹5,999/month, 250 monthly credits.
- Annual packs: Creator ₹7,999/year (360 credits), Channel ₹19,999/year (1,080 credits), Agency ₹59,999/year (3,000 credits). Annual credits are available for one year.
- Monthly packs are valid for 31 days and annual packs for one year. They are one-time purchases and unused credits do not roll over.
- Free users receive one watermarked Auto Caption Video up to 60 seconds; no card is required.
- Failed renders should not waste user credits.
- Long-form Captioned Video: up to 10 minutes, 1 credit per started minute (for example: 5 minutes = 5 credits, 5:01 = 6 credits, 10 minutes = 10 credits).
- New users receive one free, watermarked Auto Caption Video up to 60 seconds; other workflows require paid credits.
- Video type credit rates are transparent before final render: focused short video types cost 1 or 2 credits, and Long Video Clips cost 3–12 credits.

### User Journey

```txt
Visitor
  -> landing page / SEO page
  -> signup/login
  -> dashboard
  -> choose Video Type
  -> upload media
  -> configure simple options
  -> generate
  -> render progress
  -> download
  -> history
  -> upgrade / buy credits
```

## 3. Video Types

### Video Type Status Summary

| Video Type | Dashboard Mode | Main Status | Primary Risk |
|---|---|---|---|
| Auto Caption Video | `autoCaption` | Active/core | Caption readability and preview/final parity. |
| Dynamic Creator Reel Video | `dynamicCreator` | Active/core | Text overlay must not cover face or feel crowded. |
| Compare Explainer Video | `compare` | Active/core | Sticker pose clarity and layout readability. |
| Auto Draw Explainer Video | `autoDraw` | Active/core | Dense notes and long headings can overflow. |
| Long Video Promo | `longVideoPromo` | Active/core | Long titles, layout spacing, and clip aspect ratios. |
| Background Replace Video | `creatorBackgroundReplace` | Coming Soon / paused | Needs a funded Python/FFmpeg/rembg worker; too costly for current free-tier AWS usage. |
| Custom AI Reel | `customAiReel` | Milestone/status needs production confirmation | Prompt planning, media rules, and render stability. |

### 3.1 Auto Caption Video

**Short intro:** Add clean, word-level animated captions to an uploaded video.

**User inputs:**

- Required: video with speech, MP4/MOV/WebM.
- Optional: caption style, font, size, position, text color, highlight color, background behavior.

**Options:**

- Caption position: bottom safe area, center, or top.
- Caption style presets such as Studio Clean, Karaoke Fill, Gold Pill, One Word, Typewriter, Split Color, and others.
- Caption font/size/color controls.
- No visible subtitle language dropdown. Captions follow Groq output for the uploaded speech.

**Output:**

- Same video with animated captions overlaid.
- 1080x1920, 9:16 MP4.
- Audio remains the user's original video audio.
- Max duration: 60 seconds.

**Pipeline:**

```txt
Upload video
  -> S3 presigned URL
  -> extract/transcribe speech with Groq Whisper
  -> group word-level captions
  -> build render props
  -> Remotion AUTO-CAPTION-REEL render
  -> final MP4 download
```

**Current status:**

- Core product workflow.
- Caption style preview UI has been improved with mini reel previews.

**Known issues:**

- Caption styles need visual QA after changes.
- Preview and final render must stay visually aligned.
- Long words, brand names, bright backgrounds, and busy videos can hurt readability.
- Noisy audio can produce weak transcription.

**Future improvements:**

- Stronger automated visual tests for caption styles.
- Better transcript correction UI.
- More realistic caption animation previews.
- Face-safe/subject-safe caption placement.

### 3.2 Dynamic Creator Reel Video

**Short intro:** Turn a talking-head creator video into a typography-led creator reel.

**User inputs:**

- Required: creator/talking-head video with speech.
- Optional: topic/title if supported by the current UI.

**Options:**

- No extra images, clips, stickers, stock visuals, or b-roll.
- No subtitle language dropdown.
- Typography overlays are generated from the uploaded speech/Groq transcript.

**Output:**

- Full-screen creator video with bold transcript typography and key phrase overlays.
- 1080x1920, 9:16 MP4.
- Up to 60 seconds.

**Pipeline:**

```txt
Upload creator video
  -> S3 storage
  -> Groq transcription
  -> local/deterministic typography planner
  -> Remotion DYNAMIC-CREATOR-REEL render
  -> final MP4 download
```

**Current status:**

- Core creator workflow.
- Product direction: creator video is the full content; typography supports it.

**Known issues:**

- Text can cover the creator's face if placement is not careful.
- Long transcript phrases can make overlays feel crowded.
- Horizontal or poorly framed videos may crop faces.

**Future improvements:**

- Face-safe text placement checks.
- Visual QA for 16:9, square, and 9:16 inputs.
- Better pacing against reference creator reels.

### 3.3 Compare Explainer Video

**Short intro:** Create a side-by-side comparison reel with a sticker presenter and captions.

**User inputs:**

- Required: audio/voiceover or video with speech.
- Required: left image and right image.
- Optional: left title, right title, sticker character.

**Options:**

- 16 sticker character sets.
- Left/right labels.
- Captions follow uploaded voiceover language from Groq.
- Background music off by default.

**Output:**

- Split comparison layout with left/right images, captions, and sticker presenter.
- 1080x1920, 9:16 MP4.
- Max duration: 60 seconds.

**Pipeline:**

```txt
Upload voiceover/video + two images
  -> S3 storage
  -> Groq transcription
  -> comparison scene/caption planning
  -> sticker pose selection
  -> Remotion comparisonImages render
  -> final MP4 download
```

**Current status:**

- Core education/comparison workflow.
- Uses legacy composition ID `comparisonImages`; do not rename without a migration plan.

**Known issues:**

- Some sticker poses may look too similar depending on character PNGs.
- Long left/right names can create layout pressure.
- Captions must stay between image area and sticker area.

**Future improvements:**

- Better sticker pose distinctness.
- More robust long-title handling.
- More comparison-specific reference QA.

### 3.4 Auto Draw Explainer Video

**Short intro:** Create notebook/whiteboard-style explainer pages from speech.

**User inputs:**

- Required: audio or video with speech.
- Optional: topic/title.

**Options:**

- No uploaded images required.
- No sticker selection.
- No caption style selector.
- No subtitle language dropdown.
- Gemini plans whiteboard/notes scenes.

**Output:**

- Notes/whiteboard explainer with headings, bullets, sketches, arrows, circles, underlines, and highlights.
- 1080x1920, 9:16 MP4.
- Max duration: 60 seconds.

**Pipeline:**

```txt
Upload audio/video
  -> Groq transcript
  -> Gemini scene/notes planning
  -> validate reveal timeline
  -> Remotion AUTO-DRAW-EXPLAINER render
  -> final MP4 download
```

**Current status:**

- Core education workflow.
- AI planning uses Gemini according to current project rules.

**Known issues:**

- Long headings can overflow.
- Dense transcript can create crowded note pages.
- Sketch/text areas must not overlap.

**Future improvements:**

- Better density management.
- More robust page splitting.
- Visual QA with short, medium, and dense transcripts.

### 3.5 Long Video Promo

**Short intro:** Promote a long video, podcast, lecture, song, noha, munajat, or bayan as a short reel.

**User inputs:**

- Required: thumbnail image.
- Required: title.
- Required: promo clip video/audio.

**Options:**

- Optional duration badge.
- Optional/future background music toggle.
- Optional/future captions.
- Channel name, subscriber count, CTA text, channel logo, and chips were removed from the current rendered layout.

**Output:**

- 9:16 promo reel with thumbnail, title, and uploaded promo clip.
- 1080x1920 MP4.
- Max duration: 60 seconds.

**Pipeline:**

```txt
Upload thumbnail + title + promo clip
  -> S3 storage
  -> browser/media duration check
  -> layout/render props
  -> Remotion LONG-VIDEO-PROMO render
  -> final MP4 download
```

**Current status:**

- Core creator/promo workflow.

**Known issues:**

- Long titles can overflow or need truncation.
- Landscape, square, and vertical clips need careful spacing.
- "Video type not available" usually means Lambda was not redeployed after code changes.

**Future improvements:**

- More premium promo layouts.
- Optional captions if promo clip has speech.
- Better title/subtitle variants.

### 3.6 Background Replace Video

**Short intro:** Replace a creator video's background with a user-uploaded background image.

**User inputs:**

- Required: creator video, MP4/MOV/WebM.
- Required: background image, JPG/PNG/WebP.
- Duration capped at 60 seconds.

**Options:**

- Background fit: cover or contain.
- Background zoom.
- Background X/Y position.
- Creator scale.
- Creator X/Y position.
- Reset adjustments.

**Output:**

- Creator video composited over the selected background.
- H.264/AAC MP4.
- Original audio muxed back with FFmpeg.

**Pipeline:**

```txt
Upload creator video + background image
  -> signed S3 URLs
  -> dashboard CSS preview
  -> high-quality Python/FFmpeg worker
  -> rembg human segmentation
  -> composite creator over background
  -> mux original audio
  -> upload final MP4 to S3
  -> final download
```

**Current status:**

- Coming Soon / paused in the dashboard.
- Final render is disabled until a dedicated worker is deployed and the monthly cost is acceptable.

**Known issues:**

- Worker URL/health/secret must be configured.
- Current AWS free-tier budget is not suitable for reliable production background removal.
- Mobile sliders and long diagnostics can cause overflow if not wrapped.
- Background removal is compute-heavy.

**Future improvements:**

- Better worker monitoring.
- Stronger mobile transform controls.
- More preview/final parity checks.

### 3.7 Custom AI Reel

**Short intro:** Let users describe a custom 9:16 reel and optionally upload images, screenshots, and logo.

**User inputs:**

- Required: prompt in simple English.
- Optional milestone 1: images/screenshots and logo.
- Deferred: video clips and voiceover/audio.

**Options:**

- Text-only reels allowed if prompt is clear.
- Uploaded media only. Do not add stock assets, random icons, stickers, music, or generated images in milestone 1.
- No subtitle toggle or subtitle language dropdown.

**Output:**

- 1080x1920 custom reel.
- Default milestone 1 duration: 30 seconds when timing is not provided.
- Clamp to 60 seconds.

**Pipeline:**

```txt
Prompt + optional uploaded images/logo
  -> deterministic timeline planner
  -> validate timeline
  -> Remotion CUSTOM-AI-REEL render
  -> final MP4 download
```

**Current status:**

- Documented as a milestone workflow.
- Production status should be confirmed before promising it as fully live.

**Known issues:**

- Prompt clarity affects planning quality.
- Text-only reels must still feel premium.
- Uploaded images/screenshots must not crop badly.

**Future improvements:**

- Video clip support.
- Voiceover/audio support.
- Better prompt-to-timeline planner.
- More premium custom design components.

## 4. Technical Architecture

### Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| Frontend | Next.js App Router | Website, dashboard, SEO pages, API routes. |
| UI | React | Components and interactive dashboard UI. |
| Styling | Tailwind CSS | Responsive layouts, cards, forms, buttons, dark dashboard UI. |
| Auth | Supabase Auth | Signup, login, Google OAuth, user identity. |
| Database | Supabase/PostgreSQL | Render history, settings, credits, jobs, app data. |
| Storage | AWS S3 | Temporary uploads, temporary render files, final outputs. |
| Rendering | Remotion | React-based video compositions. |
| Serverless rendering | AWS Lambda / Remotion Lambda | Production video rendering. |
| Media processing | FFmpeg | Extract audio, trim, convert, compress, resize, screenshots, mux audio/video. |
| Transcription | Groq Whisper | Speech-to-text and word-level timestamps. |
| AI planning | Local deterministic planners | Stable video-type-specific planning without paid provider calls. |
| AI planning | Gemini | Auto Draw scene/visual planning. |
| AI planning | OpenAI | Paused unless explicitly approved; older docs mention it, current policy says do not add calls without approval. |
| AI support | Claude/Anthropic | Planning/debugging/reference support if used, not default render dependency. |
| Hosting | Vercel | Website and API routes. |
| Payments | Razorpay | Plans, checkout, credits, payment verification. |
| SEO | Google Search Console / Analytics | Indexing, traffic, conversion tracking. |

### Important Architecture Rules

- No always-on render server for normal Remotion renders.
- Vercel should not run heavy video processing.
- Vercel is currently used on the free plan and should stay lightweight: frontend, dashboard UI, SEO pages, and API orchestration only.
- AWS usage should assume the current `$100 free credit / free-tier constrained` budget. Do not design new Video Types that require expensive always-on compute, heavy background workers, long renders, large asset transfers, or paid managed services without explicit founder approval.
- Lambda render inputs must be HTTPS/signed S3 URLs.
- Remotion video type implementation folders are code-only.
- Assets should live in the correct public asset area and production assets should be served from S3/CDN where appropriate.
- Transcription failure should block render and show a clear error.
- Every render starts fresh from the current upload.
- Do not reuse old transcript/title/render data.
- No paid AI provider call should be added without explicit approval.

### Project Structure

| Path | Purpose |
|---|---|
| `app/` | Next.js routes, dashboard, pages, API routes. |
| `app/dashboard/page.tsx` | Main creator dashboard and Video Type selection. |
| `app/api/reels/jobs/route.ts` | Main render job orchestration. |
| `app/api/reels/jobs/status/route.ts` | Render status polling. |
| `app/api/media/presign/route.ts` | S3 upload presign flow. |
| `remotion/` | Remotion render engine. |
| `remotion/templates/` | Video type composition code only. |
| `remotion/index.tsx` | Composition registration. |
| `services/ai/` | Planners, transcription helpers, asset/visual planning. |
| `services/media/` | Media workers/helpers. |
| `public/assets/` | Local reusable/render assets and asset index source. |
| `public/visuals/` | Website/dashboard UI visuals. |
| `public/preview/` | Video Type preview images. |
| `docs/` | Documentation, specs, references, startup notes. |

## 5. Processing Pipeline

### End-to-End Flow

```txt
User selects Video Type
  -> user uploads files / enters fields
  -> browser/API validates inputs
  -> upload to S3 through presigned URL
  -> create render job
  -> extract audio with FFmpeg if needed
  -> transcribe with Groq Whisper if speech is required
  -> build captions/scenes/timeline/render props
  -> validate timeline and required props
  -> render through Remotion Lambda or worker
  -> optional FFmpeg optimization/muxing
  -> store final output in S3
  -> poll status
  -> show download link
  -> temporary files expire after roughly 48 hours
```

### Upload

- Uploads should go directly to S3 through presigned URLs where possible.
- Uploads must be linked to the correct user/job.
- Unsupported file types should fail early with clear UI.

### Validation

Validate:

- User authentication.
- File type.
- Required fields.
- Duration limit.
- Credit availability.
- Video type availability.
- Worker availability for Background Replace.

### Storage

- Temporary uploads and outputs should use S3 lifecycle deletion.
- Old/failed files should be cleaned up.
- Public permanent URLs should not be used for private user uploads.

### Transcription

- Groq Whisper is the primary transcription provider.
- Extract audio first if video cannot be sent directly for the required transcription path.
- If transcription fails or returns empty speech, show a clear error.
- Do not silently use fake/empty captions.

### AI Planning

- Most video types should use deterministic local planners where possible.
- Gemini is used for Auto Draw planning.
- OpenAI is paused unless explicitly approved.
- AI planning failure should either use a safe deterministic fallback or fail clearly, depending on the video type.

### Timeline Generation

Rules:

- First scene starts at 0.
- Last scene ends at or before duration.
- Scenes should not overlap.
- Captions should stay short and readable.
- Required timeline data must exist before render starts.

### Remotion Render

- Register composition in `remotion/index.tsx`.
- Composition IDs must use dashes, not underscores.
- Render props must include required media/captions/video type settings.
- Video types should handle missing optional props gracefully.

### FFmpeg Optimization

FFmpeg handles:

- Audio extraction.
- Trimming.
- Format conversion.
- Compression.
- Resize/crop.
- Screenshot/thumbnail extraction.
- Muxing original audio back into final video.

Use CRF-based compression where appropriate to control quality and bandwidth.

### Final Download

- Final MP4 should be downloadable from a temporary signed or limited URL.
- History should show completed renders.
- Failed jobs should show retry/error state and protect credits.

## 6. Design System

### Brand Colors

| Token | Color | Use |
|---|---|---|
| Dark background | `#0F172A` | Dashboard/product dark base. |
| Soft card background | `#1E293B` | Cards/panels on dark UI. |
| Light background | `#F8FAFC` | Light marketing sections. |
| Primary accent | `#2563EB` | Buttons, selected states, highlights. |
| Secondary accent | `#06B6D4` | Badges, hover, AI glow. |
| Text primary | `#F8FAFC` | White text on dark. |
| Text secondary | `#CBD5E1` | Body text on dark. |
| Muted text | `#94A3B8` | Helper text. |
| Success | `#10B981` | Success states only. |
| Warning | `#F59E0B` | Warnings. |
| Danger | `#EF4444` | Errors. |

Rules:

- Do not use green as primary brand color.
- Green is only for success.
- Avoid pure black backgrounds; use rich navy.
- Avoid harsh neon glow and gaming/crypto aesthetics.
- Dashboard stays dark themed.

### Typography

- Headings: Space Grotesk or system heading stack.
- Body: Geist Sans or system UI.
- Use hierarchy: headline, sub-headline, body, helper.
- Avoid cramped text by managing line-height and spacing.
- Gradient text only for a few highlighted words, not paragraphs.

### Layout Rules

- One main focus per scene.
- Keep safe margins for mobile/social UI.
- Captions and key text must not touch edges.
- Logo must not compete with the main message.
- Use empty space intentionally.
- Avoid nested cards and clutter.

### Captions

- Source: Groq Whisper word-level timing.
- English audio -> English captions.
- Hindi/Hinglish audio -> Roman Hinglish captions.
- No Devanagari/Urdu/Arabic script in visible captions by default.
- No translation dropdown unless a future paid translation feature is intentionally added.
- Caption previews should look like the final reel, not plain placeholder text.
- Keep captions readable on bright, dark, and busy videos.

### Animations

- Use animation to guide attention, not decorate everything.
- One main animation per scene is usually enough.
- Text entry should be smooth.
- Sync emphasis with voiceover.
- Stronger motion belongs in hooks/CTA; explainers should be cleaner.

### Motions

Use selectively:

- Slow zoom
- Pan
- Floating motion
- Background motion
- Camera motion
- Parallax
- Sticker/presenter motion
- Caption motion

### Transitions

Transition types:

- Cut
- Fade
- Slide
- Zoom
- Swipe
- Blur
- Match cut
- Whip

Use 2-3 consistent transition styles per video. Do not over-transition every scene.

### Effects

Effect types:

- Glow
- Shadow
- Blur
- Glass
- Highlight
- Underline/circle
- Light sweep
- Mask/reveal
- Overlay
- Background texture

Rules:

- Readability first.
- Keep glow/shadow soft.
- Use blur for focus.
- Avoid effects that make video types feel cheap or noisy.

### Sound Effects

Useful sound effects:

- Text pop
- Whoosh
- Click
- Ding/success
- Warning/error beep
- Sweep
- Soft impact

Voiceover remains primary. SFX should be subtle and low volume.

### Premium Style Lock / Diegetic Sound

Planned/promo Video Types can receive a `styleLock` and `soundCues` object in render props. This is Itnavideo's shared-latent-space layer: finance, education, creator, luxury, news, and tech reels keep one palette, motion family, typography family, sticker/icon direction, and sound pack for the whole render. Diegetic SFX should be automatic, sparse, and tied to visible events such as reveals, swipes, chart growth, paper turns, typing, warnings, or money-related beats.

`styleLock` also carries premium editor metadata:

- `colorGrade` for LUT-like mood consistency through CSS filter, overlay, grain, and vignette.
- `camera` for subtle Ken Burns, tiny stabilized shake, and motion-blur intensity.
- `depth` for foreground sheen, shadow language, and background blur strength.
- `pacing` for 3-second visual change targets plus short breath/pause windows.
- `audioMix` for low-volume ducking behavior and spatial-pan metadata.

Rules:

- Auto Caption Video stays clean: no added music, ambience, or SFX.
- Creator/explainer/promo/custom renders may use subtle SFX under the user's voice or clip audio.
- Sound cues must be low volume and limited in count; they should enhance timing, not distract.
- Reusable SFX remain under `public/assets/reusable/sound-effects/` and are referenced from render props/components.
- Financial/fintech content should prefer cool trust grading, controlled micro-interactions, cash/click/success chime cues, and no aggressive shake.

### New Video Type Premium Requirements

When creating a new Video Type, treat these premium editor principles as default design requirements unless the specific Video Type explicitly forbids them:

- Shared latent space: every scene should follow one `styleLock`, including palette, font family, motion family, caption/label treatment, icon/sticker direction, and sound pack.
- Color grading: use consistent mood through `colorGrade` rather than scene-by-scene random colors. Finance should lean cool/trustworthy; education should stay clean; creator/promo can be higher contrast.
- Camera movement: avoid dead-static visuals. Use subtle Ken Burns, pan, or controlled camera energy. Do not add aggressive shake unless the content genuinely needs impact.
- Depth and layering: use soft shadows, background blur, vignette, grain, and foreground sheen carefully to avoid a flat digital look.
- Pacing: aim for a meaningful visual change roughly every 3 seconds, with short breath moments after dense information so the viewer can absorb the point.
- Diegetic sound: map SFX to visible actions only. Examples: text pop, UI click, swipe, page turn, cash cue, warning tick, success chime.
- Audio ducking: ambience and SFX must stay below voiceover/uploaded audio. Voice clarity wins over polish.
- Financial micro-interactions: for loan approval, payment success, credit card, banking, chart, or money scenes, prefer precise shimmer/click/cash/success-chime moments over loud effects.

Do not add these layers to Auto Caption Video by default. Auto Caption should preserve the user's uploaded video/audio and only add captions unless its spec changes intentionally.

### Background Music

- Optional where appropriate.
- Keep voiceover clear.
- Use low volume under narration.
- Off/soft for serious, religious, legal, or finance content.
- More energy is acceptable for promo content.

### Mobile Safe Area

- Design for 9:16 mobile first.
- Captions should avoid bottom platform UI areas.
- Controls should not overflow 320-390px screens.
- Long labels, filenames, and diagnostics must wrap or shrink.

## 7. Dashboard / UI Rules

### Naming

- User-facing term: **Video Type**.
- Avoid using **Template** in dashboard, docs, and normal internal product language.
- Use **Video Type** for the product and normal code-level naming where practical.

### Mobile-Friendly Rules

- No horizontal overflow.
- Inputs, buttons, labels, and status cards must fit on small screens.
- Uploaded media previews should not force wide layouts.
- Long filenames and error messages must wrap.
- Important actions should be reachable without confusing scroll jumps.

### Upload Form Rules

- Show only fields relevant to the selected Video Type.
- Required inputs must be obvious.
- Optional inputs should not block render.
- Upload remove/replace UX should be available.
- Wrong file type should show a clear message.

### Preview Rules

- Preview should help the user understand the final result before spending credits.
- Caption style previews should use mini 9:16 reel frames.
- Preview and final render must stay aligned.
- If preview is not available, show clear upload/render expectations.

### Progress Screen Rules

- Show render status clearly.
- Show errors in human language.
- Avoid raw technical diagnostics in primary user text.
- Technical details may be collapsed for founder/debug use.

### History / Download Rules

- Completed videos appear in render history.
- Download link should be clear.
- Temporary files expire after roughly 48 hours.
- The user should not need to remember which Video Type created an export.

## 8. SEO Strategy

### SEO Goals

- Capture users searching for specific AI video tools.
- Build pages around real intent: caption videos, explainer videos, comparison reels, whiteboard explainers, YouTube promo reels, background replacement, and custom AI reels.
- Use SEO pages to explain what each Video Type does and lead users to the dashboard.

### Tool Pages

Examples:

- `/auto-caption-video`
- `/dynamic-creator-reel`
- `/compare-explainer-video`
- `/auto-draw-explainer`
- `/long-video-promo`
- `/background-replace-video`
- `/custom-ai-reel`

### Use-Case Pages

Examples:

- AI reel maker for educators
- AI video tool for finance creators
- YouTube Shorts promo maker
- Instagram caption generator
- Noha/bayan promo reel maker
- Product comparison reel maker

### Blog Pages

Potential topics:

- How to create reels without editing
- Best caption styles for Instagram reels
- How creators can promote long YouTube videos
- How to make comparison explainer videos
- Why captions improve retention

### Comparison Pages

Examples:

- Itnavideo vs CapCut
- Itnavideo vs InVideo
- Itnavideo vs Pictory
- Itnavideo vs Opus Clip

### URL Structure

Rules:

- Keep URLs short and keyword-focused.
- Use lowercase hyphenated slugs.
- Avoid duplicate pages targeting the same keyword.
- Each Video Type should have one primary landing page.

### Sitemap

- Include marketing pages, SEO landing pages, video type pages, pricing, about, contact, docs where useful.
- Keep sitemap updated through `lib/seo/public-url-collector.ts`.
- Submit sitemap in Google Search Console.

### Internal Linking

- Homepage links to main Video Types.
- Video Type pages link to dashboard.
- Blog/use-case pages link to relevant Video Type pages.
- Footer links to product, pricing, docs, contact, and important Video Types.

### Content Expansion Plan

1. Finish primary Video Type landing pages.
2. Add use-case pages by audience.
3. Add comparison pages.
4. Add educational blog articles.
5. Track clicks, signup conversion, upload starts, renders, and paid upgrades.

## 9. Marketing Strategy

### YouTube

- Publish demo reels showing before/after.
- Make videos for each Video Type.
- Show upload -> render -> final output in under 3 minutes.
- Use Long Video Promo as a native example for YouTubers.

### Instagram

- Post short demos of caption styles, comparison reels, and background replacement.
- Use creator-style reels as product proof.
- Show mini tutorials and output examples.

### Facebook

- Share demos in creator, small business, education, and local business groups where allowed.
- Use simple problem/solution posts.

### LinkedIn

- Position Itnavideo as a creator/productivity SaaS.
- Share product progress, architecture lessons, startup milestones, and demo clips.

### Demo Reels

Must show:

- Raw upload.
- Selected Video Type.
- Render progress.
- Final polished output.
- Time saved.

### Product Scripts

Recommended script structure:

1. Hook: "Editing captions takes 30 minutes..."
2. Problem: "Most creators do not have time."
3. Product: "Upload your video to Itnavideo."
4. Proof: "Captions, layout, and export are automatic."
5. CTA: "Try it on your next reel."

### Creator Outreach

- Target educators, finance explainers, YouTubers, podcast creators, religious creators, and small businesses.
- Offer demo renders.
- Ask for output feedback and permission to use examples.

## 10. Security / Privacy

### User Uploads

- User uploads must be private.
- Uploads must be linked to the correct user/job.
- Public permanent URLs should not be used for user media.

### Private Files

Protect:

- Uploaded videos
- Uploaded audio
- Uploaded images/logos
- Generated final videos
- User account data
- Payment events
- Transcripts/captions
- Job/render history

### Signed URLs

- Use signed/limited URLs for uploads and downloads.
- Lambda/render inputs should use HTTPS/signed S3 URLs.
- Users should only access their own files.

### Limited Download Links

- Final output links should expire.
- History can show recent exports while S3 lifecycle keeps storage cost controlled.

### 48-Hour Auto Delete

- Temporary uploads and outputs should expire after roughly 48 hours.
- Apply lifecycle policy to upload, render temp, and output prefixes.

### Payment Safety

- Do not store raw payment details directly in the app.
- Use Razorpay checkout/verification.
- Add credits only after verified payment.
- Refund/protect credits for failed renders.

### Logs

- Avoid sensitive user data in logs.
- Log technical details server-side where needed.
- User-facing errors should be short and understandable.

## 11. Roadmap

### Current Completed / Existing Features

- Live website and dashboard.
- Supabase auth and render history.
- Groq Whisper transcription.
- Remotion Lambda rendering.
- S3 upload/output flow.
- Razorpay payment integration.
- Auto Caption Reel.
- Dynamic Creator Reel.
- Compare Explainer.
- Auto Draw Explainer.
- Long Video Promo.
- Creator Background Replace worker flow.
- Custom AI Reel milestone docs and implementation path.
- Internal docs hub at `/docs`.

### Pending Fixes

- Confirm all 7 Video Types render correctly in production.
- Confirm Custom AI Reel production status.
- Improve Auto Caption preview/final parity and visual QA.
- Improve sticker pose distinctness for Compare Explainer.
- Add stronger render retry/error handling.
- Confirm mobile dashboard forms do not overflow.
- Confirm all deployment docs match current code.
- Confirm environment variable list and remove outdated references.

### Next Priorities

1. Production QA for all 7 Video Types.
2. Caption style visual QA and preview polish.
3. Render failure retry/refund handling.
4. Database/API documentation cleanup.
5. SEO page expansion for core Video Types.
6. Analytics funnel tracking: visitor -> signup -> upload -> render -> download -> payment.

### Future Features

- Multi-language subtitles as a paid/Pro feature.
- Custom branding/watermark.
- Longer videos.
- Priority rendering.
- Custom sticker upload.
- Background music library.
- Batch rendering.
- Analytics dashboard.
- Multi-platform auto-posting.
- More Video Types after core quality is strong.

## 12. Deployment Notes

### Vercel Deploy

Use for:

- Website pages.
- Dashboard UI.
- API route changes.
- SEO pages.

Command:

```bash
npx vercel --prod
```

### Remotion Lambda Deploy

Use for:

- Remotion video type changes.
- Composition registration changes.
- Render component changes.
- Site bundle changes needed by Lambda.

Command:

```bash
npm run reel:lambda:deploy
```

### Environment Variables

Do not put secrets in docs. Track names and purpose only.

| Area | Purpose |
|---|---|
| Supabase | URL/key/auth connection. |
| Groq | Whisper transcription. |
| AWS | S3/Lambda credentials and region. |
| S3 | Bucket, prefixes, lifecycle/CORS. |
| Remotion Lambda | Function, serve URL, region, memory/disk config. |
| Razorpay | Payment checkout and verification. |
| Background worker | Background Replace worker URL, health URL, secret, Python/FFmpeg paths. |
| Google OAuth | Supabase Google sign-in provider. |
| SEO | Indexing/cron secrets if used. |

### Production Testing Checklist

- Login/signup works.
- Google sign-in works.
- Dashboard loads.
- Each Video Type card opens the right form.
- Upload works for required files.
- Preview works where supported.
- Render starts.
- Progress/status updates.
- Final MP4 downloads.
- Render history updates.
- Credits deduct/refund correctly.
- Mobile layout works on 320-390px widths.
- No raw technical errors shown to users.
- S3 lifecycle/CORS are working.
- Lambda bundle includes latest video type implementations.

## 13. Known Issues / Bugs

| Issue | Area | Status / Fix |
|---|---|---|
| OpenAI API key expired / paused | AI provider | Do not add OpenAI calls without explicit approval; local/Gemini paths should work. |
| Sticker poses may look similar | Compare Explainer | Investigate/regenerate similar PNGs. |
| "Video type not available" | Render/Lambda | Deploy Lambda after video type changes. |
| Groq returns empty transcript | Transcription | Show clear error; ask user for clearer audio. |
| S3 upload blocked | Upload | Check S3 CORS and presign logic. |
| Blank render risk | Render props/timeline | Validate required scenes/captions before render. |
| Caption style overflow | Auto Caption | Visual QA all styles with long words and busy backgrounds. |
| Mobile overflow | Dashboard | Long filenames/errors/sliders must wrap/shrink. |
| Background worker not configured | Background Replace | Return short unavailable message; keep diagnostics collapsed. |

## 14. Decisions / Rules

### Product Decisions

- Use "Video Type" for users and internal product language.
- Keep the product video-type-first, not editor-first.
- Focus on output quality over adding many weak Video Types.
- 1 credit generally means 1 rendered video.
- Failed renders should not waste credits.

### Naming Rules

| Item | Convention |
|---|---|
| Folder | `TEMPLATE_NAME` with underscores. |
| Composition ID | `TEMPLATE-NAME` with dashes only. |
| Dashboard mode | `camelCase`. |
| User-facing name | Human readable Video Type name. |

Composition IDs can only contain `a-z`, `A-Z`, `0-9`, and `-`.

### Design Decisions

- Dashboard remains dark themed.
- No pure black background when rich navy works better.
- Avoid random decorative visuals.
- Captions must resemble real short-form output.
- UI should be useful immediately, not a marketing-only page.

### Technical Decisions

- Render on AWS Lambda with Remotion.
- Store uploads/outputs temporarily in S3.
- Use Groq Whisper for transcription.
- Long-form Captioned Video transcribes the full current upload directly, preserves original video/audio, and must not use paid translation fallbacks.
- Use Gemini for Auto Draw planning.
- No paid translation APIs by default.
- Remotion video type implementation folders are code-only.
- Production render inputs must be HTTPS/signed URLs.
- Video type changes require both frontend/API deployment and Lambda deployment.

## 15. Documentation Map

### Source of Truth

| File | Status | Notes |
|---|---|---|
| `docs/ITNAVIDEO_MASTER_DOC.md` | Latest source of truth | Start here for product, architecture, rules, roadmap, and deployment. |
| `docs/README.md` | Start-here index | Points to this master document. |

### Archived / Reference Docs

These files are retained for history, deep details, or focused reference. They should not override this master doc.

| File / Folder | Status | Notes |
|---|---|---|
| `docs/startup/01-startup-overview.md` to `09-yc-investor-notes.md` | Archived/reference | Startup source notes consolidated here. |
| `docs/startup/GOOGLE_DOC_CONTENT.md` | Archived/source archive | Original imported Google Docs content. |
| `docs/startup/ITNAVIDEO_INTERNAL_PRODUCT_DOCUMENTATION.md` | Reference | Professional expanded doc created before this master source-of-truth file. |
| `docs/ITNAVIDEO_PROJECT_CONTEXT.md` | Operational reference | Still useful for Codex/agent context, but master doc is canonical for latest product docs. |
| `docs/ITNAVIDEO_COMPLETE_TECHNICAL_DOCUMENTATION.md` | Archived technical reference | Older technical onboarding doc with some outdated video type counts/provider notes. |
| `docs/AUTO_CAPTION_REEL_CONTEXT.md` | Deep reference | Auto Caption-specific technical context. |
| `docs/ASSET_PREPROCESSING_PIPELINE.md` | Reference | Asset preprocessing pipeline details. |
| `docs/TEMPLATE_NAMING_CONVENTION.md` | Reference | Naming examples; master doc contains canonical rules. |
| `docs/video-types/long-form-captioned-video.md` | Active detailed spec | Inputs, 16:9 output, caption rules, duration pricing, failure behavior, and QA. |
| `docs/video-types/*.md` | Video type specs/reference | Keep detailed video-type-specific specs here and update when video type behavior changes. |
| `docs/product-tracking/templates/*.md` | Product tracking reference | Useful for QA/improvement status. |
| `docs/references/`, `docs/reference-scripts/`, `docs/reference-screenshots/` | Reference assets | Examples and research material, not master policy. |

### Duplicate / Potentially Outdated Docs

| Doc | Potential Conflict |
|---|---|
| `docs/startup/01-startup-overview.md` | Says 7 video types fully working in production; must be verified against current production status. |
| `docs/startup/02-product-and-features.md` | Lists older video type names such as Video Simple Explainer, Cinematic Collage, Voice Synced Notes. |
| `docs/TEMPLATE_NAMING_CONVENTION.md` | Mentions current 5 video types and legacy `comparisonImages`; use master for current product catalog and detailed spec docs for exact IDs. |
| `docs/ITNAVIDEO_COMPLETE_TECHNICAL_DOCUMENTATION.md` | Lists 3 live video types and older OpenAI fallback assumptions. |
| `docs/startup/05-subtitle-language-rules.md` | Mentions future language expansion; current master keeps translation paused. |

## 16. Docs Reviewed During Consolidation

Reviewed and consolidated useful information from:

- `docs/ITNAVIDEO_PROJECT_CONTEXT.md`
- `docs/startup/00-docs-index.md`
- `docs/startup/01-startup-overview.md`
- `docs/startup/02-product-and-features.md`
- `docs/startup/03-technical-architecture.md`
- `docs/startup/04-video-type-rules.md`
- `docs/startup/05-subtitle-language-rules.md`
- `docs/startup/06-assets-and-s3.md`
- `docs/startup/07-known-issues-and-fixes.md`
- `docs/startup/08-roadmap.md`
- `docs/startup/09-yc-investor-notes.md`
- `docs/startup/GOOGLE_DOC_CONTENT.md`
- `docs/startup/ITNAVIDEO_INTERNAL_PRODUCT_DOCUMENTATION.md`
- `docs/ITNAVIDEO_COMPLETE_TECHNICAL_DOCUMENTATION.md`
- `docs/AUTO_CAPTION_REEL_CONTEXT.md`
- `docs/ASSET_PREPROCESSING_PIPELINE.md`
- `docs/TEMPLATE_NAMING_CONVENTION.md`
- `docs/video-types/auto-caption-reel.md`
- `docs/video-types/dynamic-creator-reel.md`
- `docs/video-types/compare-explainer.md`
- `docs/video-types/auto-draw-explainer.md`
- `docs/video-types/long-video-promo.md`
- `docs/video-types/creator-background-replace.md`
- `docs/video-types/custom-ai-reel.md`
- `docs/product-tracking/templates/auto-captions.md`
- `docs/product-tracking/templates/dynamic-creator-reel.md`
- `docs/references/README.md`
