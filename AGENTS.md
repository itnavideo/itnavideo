<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Documentation System

Before working on any template or feature, read these files first:

1. `docs/ITNAVIDEO_PROJECT_CONTEXT.md` — Master project context (product, tech, rules, design system)
2. `docs/video-types/{template-name}.md` — Specific template spec (layout, inputs, motion, QA)

If modifying a template, update its documentation file afterward.

## Asset Storage Rule

Keep reusable/render assets in one logical place only: `public/assets` for local indexing, with production binaries served from AWS/S3/CDN.

- Do not add images, icons, fonts, sound effects, background music, or background images inside `remotion/templates/*`.
- Remotion template folders are code-only. Templates should consume assets through `assetTimeline`, `public/assets/assets.json`, or explicit uploaded/user-selected URLs.
- Direct one-off page assets go in `public/assets/direct/*`.
- Reusable render assets go in `public/assets/reusable/*`.
- Brand/founder/website UI assets may stay in `public/brand`, `public/founder`, and `public/visuals`.
- After adding/removing assets, run `npm run assets:index` so `public/assets/assets.json` stays current.
- Sticker character PNGs live in `public/assets/stickman/` and are loaded via `staticFile()` in the Lambda site bundle.
- Sticker preview images for the dashboard live in `public/visuals/stickers/previews/` (deployed to Vercel).

## Vercel Deployment Asset Rule

Keep Vercel light.

- `.vercelignore` must exclude `public/assets`.
- Do not deploy bulk render assets to Vercel.
- Do not move reusable render assets into `public/brand`, `public/founder`, or `public/visuals` just to make them deploy; those folders are only for website UI/UX assets.
- Store production render asset binaries in AWS/S3/CDN and use indexed URLs/metadata from the asset picker.

## Subtitle & Caption Language Rule

Multi-language translation is **paused**. Only English and Hinglish (Roman script) subtitles are supported via Groq Whisper. No paid translation APIs.

- Hindi/Hinglish audio → clean Roman Hinglish captions (no Devanagari).
- English audio → English captions.
- Do NOT use OpenAI, Google Cloud, AWS Translate, or Azure translation APIs for default subtitles.
- If transcription fails, show error to founder — don't silently return empty captions or fall back to English.
- Each render gets fresh captions from the current upload only. Never reuse old/cached transcript data.
- `shouldSkipVisibleTextKey` must skip `captions`, `subtitleChunks`, `transcript` fields from forbidden script validation.
- See `.kiro/steering/subtitles-language-rule.md` for full template-specific caption table.

## Provider Policy

- **Groq** → Primary transcription provider (Whisper). Always available.
- **Gemini** → Free. Used for Auto Draw scene planning and English transcript repair.
- **OpenAI** → Paused. Key is expired (401). Do not add OpenAI API calls without explicit approval.
- Do not call multiple paid providers for the same decision unless explicitly testing.
- Keep AI usage minimal. Most templates (Auto Caption, Compare, Long Video Promo, Voice Synced Notes) skip AI planning entirely and use deterministic local planners from the transcript.

## Template Creation Rule

A new template is NOT complete until all these are done:

1. Remotion composition in `remotion/templates/TEMPLATE_NAME/template.tsx`
2. Registered in `remotion/index.tsx`
3. Entry in `REEL_TEMPLATE_REGISTRY` (`services/ai/reelPlanner.ts`)
4. Dashboard card + mode config in `app/dashboard/page.tsx`
5. Backend render flow support in `app/api/reels/jobs/route.ts`
6. Lambda redeployment (`npm run reel:lambda:deploy`)
7. Vercel frontend deployment (`npx vercel --prod`)

Do not create template folders/components without completing the full connection. A half-connected template will show "Template not available" errors to users.

## Template Behavior Rules

- Templates must NOT reuse old titles, subtitles, or previous render data. Every render starts fresh from the current upload.
- Every template should clearly communicate what the user needs to upload (video, audio, images, text fields).
- Remotion Composition IDs can only contain `a-z`, `A-Z`, `0-9`, and `-` (NO underscores).
- Template folder names use underscores: `TEMPLATE_NAME`. Composition IDs use dashes: `TEMPLATE-NAME`.
- Render flow stability comes first. Do not add heavy design improvements until the basic render works end-to-end.
- Lambda render inputs must be HTTPS or signed S3 URLs. Never pass local `/public/...` paths to Lambda.
- S3 temporary uploads and rendered outputs expire after ~48 hours.

## Render Flow

The production render pipeline is:

1. User uploads file → presigned S3 URL
2. `/api/reels/jobs` → Groq transcription
3. Build render props (template-specific logic)
4. Remotion Lambda render
5. Poll `/api/reels/jobs/status` for progress
6. Return download URL on completion

If transcription fails → show error, don't render with empty/fake transcript.
If render fails → show retry button to user (they are paying).

## Deployment Rule

Two deploys are needed for any template or render code change:

- `npx vercel --prod` → Website/frontend/API
- `npm run reel:lambda:deploy` → Remotion render engine (Lambda + site bundle)

Forgetting Lambda deploy is the most common cause of "template not available" errors in production.
