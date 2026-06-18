<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Asset storage rule

Keep reusable/render assets in one logical place only: `public/assets` for local indexing, with production binaries served from AWS/S3/CDN.

- Do not add images, icons, fonts, sound effects, background music, or background images inside `remotion/templates/*`.
- Remotion template folders are code-only. Templates should consume assets through `assetTimeline`, `public/assets/assets.json`, or explicit uploaded/user-selected URLs.
- Direct one-off page assets go in `public/assets/direct/*`.
- Reusable render assets go in `public/assets/reusable/*`.
- Brand/founder/website UI assets may stay in `public/brand`, `public/founder`, and `public/visuals`.
- After adding/removing assets, run `npm run assets:index` so `public/assets/assets.json` stays current.

## Vercel deployment asset rule

Keep Vercel light.

- `.vercelignore` must exclude `public/assets`.
- Do not deploy bulk render assets to Vercel.
- Do not move reusable render assets into `public/brand`, `public/founder`, or `public/visuals` just to make them deploy; those folders are only for website UI/UX assets.
- Store production render asset binaries in AWS/S3/CDN and use indexed URLs/metadata from the asset picker.

## Subtitle & Caption Language Rule

Captions and subtitles are flexible — some templates need them, some don't. But when a template uses captions:

- User dashboard me jo language select kare, **wahi language me subtitles aane chahiye**. No silent fallback.
- Translation uses OpenAI Chat Completions API (`/v1/chat/completions`), NOT the Responses API (`/v1/responses`).
- If translation fails, show error to founder — don't silently return English/Hinglish.
- `shouldSkipVisibleTextKey` must skip `captions`, `subtitleChunks`, `transcript` fields from forbidden script validation (allows Hindi, Kannada, Tamil, Arabic etc. in captions).
- Templates that use captions: AUTO_CAPTION_REEL, VIDEO_SIMPLE_EXPLAINER, COMPARE_EXPLAINER.
- Templates that DON'T use captions: AUTO_DRAW_EXPLAINER (whiteboard scenes), IMAGE_STORY_COLLAGE (optional text overlays only).
