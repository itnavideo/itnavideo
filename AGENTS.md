<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Itnavideo — Master Agent Rules

This is the **single source of truth** for all AI tools (Antigravity, Codex, Kiro, Cursor). All instructions, policies, and workflows are consolidated here.

---

## 1. Fast Work Tree (Execution Engine)

Most daily work in Itnavideo focuses on **Existing Video Types** and **Dashboard UI/UX Design**. Follow these targeted workflows for fast, zero-delay completion:

### A. Existing Video Types Iteration
1. **Locate & Inspect**: Target `remotion/templates/TEMPLATE_NAME/` and `docs/video-types/TEMPLATE_NAME.md`.
2. **Visual & Motion Polish**: Update springs, animations, font highlights, and layout. (Assets strictly in `public/assets/reusable/`).
3. **Prop Continuity**: Ensure new props have safe defaults in `services/ai/reelPlanner.ts` and `app/api/reels/jobs/route.ts` so existing render jobs never fail.
4. **Fast Verify**: Run `npx tsc --noEmit` (zero errors required).

### B. Dashboard UI/UX Design Iteration
1. **Modular Components**: Avoid adding large UI blocks to `app/dashboard/page.tsx` directly. Create isolated components in `components/` and import them.
2. **Visual Design System**: Dark aesthetic (zinc-900/950, fine borders `white/10`, mint/orange/purple accents, smooth micro-interactions).
3. **Reactive States**: Instant user feedback on file drop, animated progress pills, and clear error/success banners.
4. **Targeted Edits**: Use targeted line replacements in dashboard to avoid breaking other video types.

---

## 2. Documentation System

Before working on any template or feature, check:
1. `docs/ITNAVIDEO_PROJECT_CONTEXT.md` — Master project context (product, tech, rules, design system)
2. `docs/video-types/{template-name}.md` — Specific template spec (layout, inputs, motion, QA)
3. `docs/ITNAVIDEO_WORK_TREE.md` — Fast execution framework

---

## 3. Subtitle & Caption Language Rule

Multi-language translation is **paused**. Only English and Hinglish (Roman script) subtitles are supported via Groq Whisper. No paid translation APIs.

- **Audio Handling**:
  - Hindi / Hinglish audio → clean Roman Hinglish captions (no Devanagari script).
  - English audio → English captions.
- **Provider Restrictions**:
  - Do NOT use OpenAI, Google Cloud, AWS Translate, or Azure translation APIs for subtitles.
  - Multi-language translation (Kannada, Urdu, Arabic, French, etc.) is PAUSED.
- **Reliability**:
  - If transcription fails, show an error — don't silently return empty captions or fall back to fake English.
  - Each render gets fresh captions from the current upload only. Never reuse old/cached transcript data.
  - Keep subtitle text short and readable (max 10 words per line).
  - `shouldSkipVisibleTextKey` must skip `captions`, `subtitleChunks`, `transcript` fields from forbidden script validation.

### Template-Specific Caption Behavior

| Template | Captions Needed? | Source |
|----------|-----------------|--------|
| `AUTO_CAPTION_REEL` | YES — primary feature | Word-grouped from transcript |
| `CAPTION_STUDIO` | YES — primary feature | Word-grouped with advanced styling |
| `VIDEO_SIMPLE_EXPLAINER` | YES — subtitle strip | From transcript segments |
| `COMPARE_EXPLAINER` | YES — bottom strip | From transcript segments |
| `IMAGE_STORY_COLLAGE` | Optional text overlays | From scene beats |
| `AUTO_DRAW_EXPLAINER` | NO — whiteboard scenes | Uses scenes, not captions |
| `VOICE_SYNCED_NOTES` | YES — note lines | From transcript segments |
| `LONG_VIDEO_PROMO` | Optional captions | If promo clip has speech |
| `TYPOGRAPHY_VIDEO` | YES — kinetic words | Word-level timing synced to speech |
| `AI_AUDIO_CLEANER` | Script Review Preview | Full Groq Whisper transcript with retake detection |

---

## 4. Provider Policy

- **Groq** → Primary transcription provider (Whisper). Always available and fast.
- **Gemini** → Free. Used for Auto Draw scene planning and English transcript repair.
- **OpenAI** → Paused. Key is expired (401). Do not add OpenAI API calls without explicit approval.
- **Local Planners First** → Keep AI usage minimal. Templates (Auto Caption, Compare, Long Video Promo, Voice Synced Notes, Audio Clean) use deterministic local logic from the transcript.

---

## 5. Asset Storage & Vercel Rules

Keep reusable/render assets in one logical place only: `public/assets` for local indexing, with production binaries served from AWS/S3/CDN.

- **No assets in templates**: Remotion template folders are strictly code-only. Do not put images, fonts, sound effects, or audio files inside `remotion/templates/*`.
- **Folders**:
  - One-off page assets: `public/assets/direct/*`
  - Reusable render assets: `public/assets/reusable/*`
  - Website UI/UX only: `public/brand`, `public/founder`, `public/visuals`
  - Stickers: `public/assets/stickman/` (loaded via `staticFile()` in Lambda)
- **Asset Indexing**: After adding/removing assets, run `npm run assets:index` so `public/assets/assets.json` stays current.
- **Keep Vercel Light**:
  - `.vercelignore` must exclude `public/assets`.
  - Do not deploy bulk render assets to Vercel.
  - Production render asset binaries live in AWS S3 / CDN.

---

## 6. Video Type Creation (7-Node Pipeline)

A new Video Type is NOT complete until all 7 are done:
1. Remotion composition in `remotion/templates/TEMPLATE_NAME/template.tsx`
2. Registered in `remotion/index.tsx`
3. Entry in `VIDEO_TYPE_REGISTRY` (`services/ai/reelPlanner.ts`) with proper category
4. Dashboard card + mode config in `app/dashboard/page.tsx`
5. Backend render flow support in `app/api/reels/jobs/route.ts`
6. Lambda redeployment (`npm run reel:lambda:deploy`)
7. Vercel frontend deployment (`npx vercel --prod`)

*Composition IDs use dashes (`TEMPLATE-NAME`). Folder names use underscores (`TEMPLATE_NAME`).*

---

## 7. Render Pipeline & Deployment

### Production Pipeline
1. User uploads file → presigned S3 URL
2. `/api/reels/jobs` → Groq transcription
3. Build render props (template-specific logic)
4. Remotion Lambda render
5. Poll `/api/reels/jobs/status` for progress
6. Return download URL on completion (48-hour S3 lifecycle)

### Deployment Rule
Two deploys are needed for any template or render code change:
- `npx vercel --prod` → Website/frontend/API
- `npm run reel:lambda:deploy` → Remotion render engine (Lambda + site bundle)
