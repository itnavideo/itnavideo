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
