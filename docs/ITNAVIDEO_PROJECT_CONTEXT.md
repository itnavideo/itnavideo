# Reference Note

This document remains useful as agent/project context. Please use `docs/ITNAVIDEO_MASTER_DOC.md` as the latest source of truth for Itnavideo product documentation.

# Itnavideo — Project Context

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

- Core short-form Video Types output 9:16 reels.
- Long-form Captioned Video outputs a 16:9 landscape MP4 up to 10 minutes, preserving the uploaded video/audio while adding fresh timed captions.
- Product direction: quality over quantity. Keep the core library focused; new Video Types must meet the production-quality bar end to end.
- Credit-based pricing: Auto Caption, Long Video Promo, and Typography cost 1 credit; Compare, Whiteboard, and Multi Images cost 2; Long Video Clips cost 3–12; Long-form Captioned Video costs 1 credit per started minute.
- Renders on AWS Lambda via Remotion
- Transcription via Groq Whisper
- No paid translation APIs
- Supports English and Hinglish (Roman script) captions

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js (App Router), React, Tailwind CSS |
| Render Engine | Remotion (compositions rendered on AWS Lambda) |
| Transcription | Groq Whisper |
| AI Planning | Local planner (deterministic) + Gemini (Auto Draw only) |
| Storage | AWS S3 (temporary, 48-hour lifecycle) |
| Auth | Supabase |
| Payments | Razorpay |
| Hosting | Vercel (frontend/API) + AWS Lambda (renders) |
| Fonts | Google Fonts via @remotion/google-fonts |

## Deployment Rules

Two deploys needed for any video type/render code change:
1. `npx vercel --prod` — frontend + API
2. `npm run reel:lambda:deploy` — Remotion render engine (Lambda + site bundle)

Forgetting Lambda deploy = "video type not available" errors in production.

## Free-Tier Infrastructure Constraint

Itnavideo is currently operating with constrained startup infrastructure:

- Vercel is the free plan and should be used only for website/frontend, dashboard UI, SEO pages, lightweight API orchestration, and status routes.
- Vercel must not do heavy video processing, long FFmpeg work, background rendering, or bulk asset serving.
- AWS should be treated as the current `$100 free credit / free-tier constrained` render budget.
- New Video Types must avoid always-on servers, expensive workers, large default media libraries, long renders, high memory Lambda assumptions, and paid managed services unless the founder explicitly approves.
- Prefer deterministic local planners, existing Remotion Lambda flow, S3 temporary storage, and reusable indexed assets.

---

## Design System

### Color System (Current — Blue Primary)

```
Background dark:   #0F172A (rich navy)
Background soft:   #1E293B (cards on dark)
Background light:  #F8FAFC (light sections)
Primary accent:    #2563EB (blue — buttons, selected states, highlights)
Secondary accent:  #06B6D4 (cyan — badges, hover, AI glow)
Text primary:      #F8FAFC (white headings on dark)
Text secondary:    #CBD5E1 (body text on dark)
Text muted:        #94A3B8 (helper text)
Text on light:     #111827 (headings on light bg)
Success:           #10B981 (completed, success only)
Warning:           #F59E0B
Danger:            #EF4444
```

### Color Rules
- No emerald/green as primary brand
- Green only for success states
- No pure black backgrounds (use navy)
- Alternate dark/light sections on marketing pages
- Dashboard stays dark themed
- No harsh neon glow
- No gaming/crypto aesthetic

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
- Hindi audio → clean Roman Hinglish captions
- English audio → English captions
- Each render gets fresh captions from current upload (no cached data)
- Max 5 words per caption group, max 1.5s per group
- No paid translation APIs

## Sticker Rules (Compare Explainer)

- 6 core poses: `sticker_welcome_intro_explainer`, `sticker_pointing_left_side_explainer`, `sticker_pointing_right_side_explainer`, `sticker_thinking_analysis_explainer`, `sticker_warning_issue_explainer`, `sticker_success_conclusion_explainer`
- Extra poses when available: `sticker_questioning_surprised_explainer`, `sticker_general_explaining_key_point`, `sticker_happy_celebrating_outro`, `sticker_comparing_both_sides_explainer`
- 16 character sets available
- Pose selection based on scene intent (not caption language)
- Left-side comparison content MUST use `sticker_pointing_left_side_explainer`
- Right-side comparison content MUST use `sticker_pointing_right_side_explainer`
- Both-side comparison content SHOULD use `sticker_comparing_both_sides_explainer` when available
- Question/confusion content SHOULD use `sticker_questioning_surprised_explainer` when available
- Do not repeat the same pose on adjacent beats unless the narration genuinely continues the same intent
- Legacy aliases (`welcome`, `left`, `right`, `thinking`, `warning`, `success`, `surprised`, `explaining`, `celebrating`, `comparing`, `sticker_left`, `sticker_right`) are accepted only for backward compatibility
- 55-65% of video = left/right direction poses
- 35-45% = special poses (welcome, thinking, warning, success, question, explaining, comparing, celebrating)
- Sticker files: English names only (e.g., `teacher-welcome.png`)
- Script language does NOT affect pose selection

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
7. Deploy both Vercel + Lambda if video type render code changed
8. Update the video type documentation if behavior changed

---

## Pricing / Credit Rules

- Auto Caption Video, Long Video Promo, Typography Video: 1 credit.
- Compare Explainer, Whiteboard Video, Multi Images Video: 2 credits.
- Long Video Clips: 2-credit base plus 1 credit per requested clip (3–12 credits).
- Long-form Captioned Video: 1 credit per started minute, maximum 10 credits for 10 minutes.
- One free trial: Auto Caption only, maximum 60 seconds, with a fixed Itnavideo watermark.
- Paid credit pack: 20 credits valid for 31 days; ₹499 for India billing region, $19 internationally.
- Failed renders due to system issues are not charged
- Preview generation/editing does not deduct credits
- Deduct/reserve credits only when the final render starts
- Existing reusable/internal assets can be included; paid stock or generative assets require a separate priced workflow.

## Dashboard UX Rules

- Video Types shown as phone-frame preview cards (3 per row)
- No Video Type opened by default (user must click to see form)
- Form only shows after Video Type selection
- Upload section auto-scrolls on mobile after Video Type choice
- Supported Video Types should use preview-first flow: generate preview plan → user reviews/edits → final render
- Keep form fields minimal (only what the Video Type actually renders)
- Remove fields the Video Type no longer uses
