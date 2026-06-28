# Itnavideo — Project Context

## What is Itnavideo

Itnavideo is an AI-powered video creation platform. Users upload raw content (video, audio, images) and get polished, ready-to-post short videos (reels) without manual editing.

It is NOT a video editor. Users do not drag timelines, cut clips, or choose fonts. They upload content, pick a template, and AI handles the rest.

## Product Goal

Turn raw creator content into publish-ready 9:16 reels in under 3 minutes, with no editing skills required.

Future: Also support 16:9 long-form video output.

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

- 6 production templates (all 9:16 reels)
  - Dynamic Creator Reel
  - Auto Caption Reel
  - Creator Background Replace
  - Compare Explainer
  - Auto Draw Explainer
  - Long Video Promo
- Product direction: quality over quantity. Keep the core library focused; new templates must meet the production-quality bar end to end.
- Credit-based pricing (1 credit = 1 video)
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

Two deploys needed for any template/render code change:
1. `npx vercel --prod` — frontend + API
2. `npm run reel:lambda:deploy` — Remotion render engine (Lambda + site bundle)

Forgetting Lambda deploy = "template not available" errors in production.

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
| Template | A specific video format/workflow with its own render logic |
| Mode | Internal dashboard state matching a template |
| Composition | Remotion composition ID (used in Lambda render) |
| Render Props | JSON data passed to the Remotion composition |
| Overlay Timeline | Array of timed text/visual scenes |
| Captions | Word-grouped subtitle segments with timing |

### Template Naming Convention
- Folder name: `TEMPLATE_NAME` (uppercase, underscores)
- Composition ID: `TEMPLATE-NAME` (uppercase, dashes)
- Mode: `camelCase` in dashboard code
- No underscores in Composition IDs (Remotion limitation)

---

## Video Type vs Layout vs Style

- **Video Type** = the template (Compare Explainer, Auto Caption, Long Video Promo)
- **Layout** = how elements are arranged on screen for that template
- **Style** = visual variation within a template (sticker character, caption style)

Each template has ONE core layout. Styles are optional variations within that layout.

---

## Caption Rules

- Source: Groq Whisper transcription (word-level timing)
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
- Remotion template folders are code-only (no images/fonts/sounds inside)
- After adding/removing assets: run `npm run assets:index`

## Timeline JSON Rules

- `overlayTimeline`: array of `{id, start, end, text, type, ...}`
- `captions`: array of `{start, end, text, words?}`
- All times in seconds (float)
- Scenes must not overlap
- First scene starts at 0
- Last scene ends at or before `durationSeconds`
- Preview-first templates must pass the same canonical timeline/settings JSON from `/api/reels/preview` into `PreviewEditor` and then into `/api/reels/jobs`
- Preview edits should be stored as JSON changes (`captions`, `scenes`, `stickers`, `layout`, `assets`, `userEdits`) rather than separate final-render-only fields

---

## Code Quality Rules

- Read existing code before writing new code
- Match project style and conventions
- Do not add features beyond what's asked
- Do not add tests unless explicitly requested
- TypeScript diagnostics must be clean after every change
- Run build check before presenting results
- No unused imports, props, or variables in templates
- Templates should be clean and focused on their 3-4 core elements

## QA Rules

- Every template change must be visually verified (local render or contact sheet)
- Diagnostic script should confirm expected behavior
- Test with both 16:9 and vertical inputs where applicable
- Test with long titles (overflow handling)
- Test with missing optional props (fallbacks work)

## What to Avoid

- Over-designed UI (keep it clean and focused)
- Random decorative elements (gradients, circles, particles)
- Glassmorphism everywhere
- Channel name/subscriber/subscribe button in templates (unless explicitly needed)
- Forced CTA text user didn't provide
- Multiple paid AI API calls for the same decision
- Broad single-word keyword matching
- Pure black backgrounds
- Low-contrast text
- Static-looking videos (everything should have subtle motion)

---

## How AI/Developers Should Work Before Coding

1. Read `ITNAVIDEO_PROJECT_CONTEXT.md` (this file)
2. Read the specific video type file in `docs/video-types/`
3. Check existing template code to understand current state
4. Plan the change before implementing
5. Implement with minimal additions (no feature creep)
6. Verify with diagnostics + visual QA
7. Deploy both Vercel + Lambda if template code changed
8. Update the video type documentation if behavior changed

---

## Pricing / Credit Rules

- 1 video = 1 credit
- Failed renders due to system issues are not charged
- Preview generation/editing does not deduct credits
- Deduct credit only when the user confirms preview and final render starts
- Plans: Starter (₹9), Creator, Pro tiers
- All templates included in every plan
- No free tier renders (first video requires payment or trial credit)

## Dashboard UX Rules

- Templates shown as phone-frame preview cards (3 per row)
- No template opened by default (user must click to see form)
- Form only shows after template selection
- Upload section auto-scrolls on mobile after template choice
- Supported templates should use preview-first flow: generate preview plan → user reviews/edits → final render
- Keep form fields minimal (only what the template actually renders)
- Remove fields the template no longer uses
