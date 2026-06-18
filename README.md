# Itnavideo

This repo is being kept simple after the old video pipeline cleanup. Do not add new folders or files without first choosing the name with the project owner.

## Structure Rule

- Keep frontend and backend sections separate.
- Keep video rendering code small and easy to find.
- Before creating any new file or folder, suggest 3-4 name options first.
- Prefer one clear purpose per folder.
- Resume rule: the project owner's computer can shut down during power cuts, resetting chat history. In any new chat, first read the current workspace/open files and this README, then resume from the exact current project state without asking for background again.

## Frontend

### `app/`

Next.js App Router pages and route handlers.

- `app/page.tsx` - Home page.
- `app/layout.tsx` - Root layout.
- `app/globals.css` - Global styling.
- `app/icon.tsx` - App icon route.
- `app/favicon.ico` - Favicon asset.
- `app/about/` - About page.
- `app/billing/` - Billing page.
- `app/blog/` - Blog list and blog detail pages.
- `app/careers/` - Careers page.
- `app/contact/` - Contact page.
- `app/create/` - Create page.
- `app/dashboard/` - User dashboard page.
- `app/docs/` - Docs page.
- `app/features/` - Features page.
- `app/login/` - Login page.
- `app/pricing/` - Pricing page.
- `app/privacy/` - Privacy page.
- `app/settings/` - Settings page.
- `app/signup/` - Signup page.
- `app/terms/` - Terms page.
- `app/videos/` - Videos page.
- `app/waitlist/` - Waitlist page.
- `app/admin/` - Admin pages and admin layout.

### `components/`

Reusable UI and page sections.

- `components/admin/` - Admin UI components.
- `components/auth/` - Login/signup/auth shell and auth context.
- `components/brand/` - Brand logo components.
- `components/careers/` - Careers page client component.
- `components/landing/` - Home/landing page sections.
- `components/layout/` - Navbar, footer, and app chrome.
- `components/ui/` - Shared base UI components.
- `components/EngagementHook.tsx` - Reusable engagement section.
- `components/FAQSection.tsx` - Reusable FAQ section.

### `public/`

Static assets served by the app.

- `public/brand/` - Logo and brand image files.
- `public/founder/` - Founder/profile images used by the website.
- `public/visuals/` - Marketing and showcase visuals.
- `public/assets/` - Bulk AI/render asset library for local indexing only. Do not deploy this folder to Vercel.
- `public/renders/` - Generated render outputs such as sample reels.
- `public/local-uploads/` - Local test uploads, fixtures, and old render artifacts.

## Vercel Asset Rule

Keep Vercel light. Do not store or deploy bulk render assets on Vercel.

- `.vercelignore` must exclude `public/assets`.
- `public/assets` can exist locally for indexing, tagging, and asset preprocessing, but production binaries should live in AWS/S3/CDN.
- Website-required assets may stay on Vercel only when they are part of the product UI: `public/brand`, `public/founder`, and `public/visuals`.
- Do not move reusable render images, icons, videos, fonts, sound effects, or background music into Vercel-served folders to "fix" missing assets. Upload/sync them to AWS/S3/CDN and point the asset index at those URLs.
- After asset changes, run `npm run assets:index` locally, but keep the deploy package small.

## Backend

### `app/api/`

Active API route handlers.

- `app/api/admin/route.ts` - Admin API entry.
- `app/api/admin/login/route.js` - Admin login.
- `app/api/admin/logout/route.js` - Admin logout.
- `app/api/admin/free-tier/route.ts` - Admin free-tier controls.
- `app/api/careers/apply/route.ts` - Careers application endpoint.
- `app/api/health/route.ts` - Health check endpoint.
- `app/api/leads/route.ts` - Lead capture endpoint.

Note: Some old API folders may still exist without active route files. Treat them as legacy cleanup leftovers unless a route file is present.

### `services/`

Backend support code used by routes or server-side logic.

- `services/rateLimit/` - In-memory rate limiter.
- `services/supabase/` - Site data helpers for Supabase.

### `lib/`

Shared helpers used by frontend and backend.

- `lib/blogPosts.ts` - Blog post data.
- `lib/deployment.js` - Deployment helper.
- `lib/utils.ts` - Shared utility helpers.
- `lib/supabase/` - Supabase client, server, and redirect helpers.

### `supabase/`

Database schema and Supabase setup files.

- `supabase/schema.sql` - Database schema.
- `supabase/enable-rls-security.sql` - RLS security setup.
- `supabase/README.md` - Supabase-specific notes.

## Video Rendering

### `remotion/`

Remotion composition code for reels.

- `remotion/index.tsx` - Current vertical reel composition.

### `scripts/`

Small operational scripts.

- `scripts/render-reel.mjs` - Renders the current Remotion reel to MP4.
- `scripts/preprocess-media-audio.mjs` - Cleans uploaded audio/video audio before transcription/render. It uses light denoise with full FFmpeg when available and falls back to safe loudness normalization with the bundled Remotion FFmpeg.
- `scripts/transcribe-facecam.mjs` - Extracts MP3 audio from a facecam video, transcribes it, and saves `.txt` plus `.json` transcript outputs.
- `scripts/normalize-env-local.mjs` - Normalizes local environment values.
- `scripts/sync-next-standalone-files.mjs` - Syncs files needed by standalone Next.js output.
- `scripts/__pycache__/` - Python cache folder; not part of the active app pipeline.

## Config And Tooling

- `package.json` - Scripts and dependencies.
- `package-lock.json` - Locked npm dependency versions.
- `next.config.mjs` - Next.js config.
- `tsconfig.json` - TypeScript config.
- `eslint.config.mjs` - ESLint config.
- `postcss.config.mjs` - PostCSS config.
- `components.json` - UI component tooling config.
- `proxy.js` - Proxy/middleware support file.
- `ecosystem.config.cjs` - PM2 process config.
- `vercel.json` - Vercel config.
- `.env.example` - Example environment variables.
- `.env.local` - Local environment values; do not commit secrets.
- `.gitignore` - Git ignore rules.
- `.dockerignore` - Docker ignore rules.
- `.vercelignore` - Vercel ignore rules.
- `AGENTS.md` - Agent instructions for this repo.
- `next-env.d.ts` - Next.js generated TypeScript types.
- `tsconfig.tsbuildinfo` - TypeScript incremental build cache.

## Generated Or External Folders

- `.git/` - Git data.
- `.next/` - Next.js build output.
- `.vercel/` - Vercel local metadata.
- `.deploy/` - Deployment helper artifacts.
- `.sandbox/` - Local sandbox artifacts.
- `node_modules/` - Installed npm packages.
- `types/` - Reserved for shared type declarations.

## Commands

- `npm run dev` - Start local Next.js dev server.
- `npm run build` - Build Next.js with webpack.
- `npm run start` - Start standalone production server.
- `npm run lint` - Run ESLint.
- `npm run reel:studio` - Open Remotion Studio for the reel.
- `npm run reel:render` - Render sample reel MP4.
- `npm run reel:lambda:deploy` - Deploy the Remotion Lambda function and site bundle for serverless rendering.
- `npm run reel:lambda:render` - Start a Remotion Lambda render from the current plan/input props.
- `npm run aws:s3:lifecycle` - Apply the 48-hour S3 lifecycle cleanup rules to the temporary media bucket.
- `npm run aws:s3:cors` - Apply browser upload CORS for presigned temporary media uploads.
- `npm run aws:ec2:list` - List EC2 instances in the configured AWS region so idle servers can be found.
- `npm run aws:ec2:stop -- i-xxxxxxxxxxxxxxxxx` - Stop specific EC2 instances after confirming they are not needed.
- `npm run media:clean -- "public/media/gemstones.mp4"` - Clean/normalize upload audio before transcription or render. Uses direct/system FFmpeg when available, then Remotion FFmpeg fallback.
- `npm run media:transcribe -- "public/media/gemstones.mp4"` - Extract cleaned audio and generate transcript files.
- `node scripts/transcribe-facecam.mjs "public/media/viral 2.mp4"` - Extract facecam video audio and generate transcript files.

## New Additions Log

Use this section for every new folder or file added after the structure cleanup. Keep entries at the bottom so we can clearly see what existed before and what was added later.

Format:

- `path/to/file-or-folder` - Short reason for adding it. Added for: feature/fix/task name.

Current baseline:

- `remotion/templates/SPLIT_TOP_MEDIA/motion-assets/chatgpt-transparent-*.png` - Extra ChatGPT-generated transparent PNG overlays/motion graphics were merged into the existing template-local motion asset folder. Exact duplicates of existing semantic motion assets were skipped by SHA-256 hash. Added for: SPLIT_TOP_MEDIA asset expansion.
- `remotion/templates/SPLIT_TOP_MEDIA/images/reel-image-*.png` - ChatGPT-generated 9:16/static reel image assets were merged into the existing template-local image folder and renamed with index + semantic keywords. Local duplicate hash check against existing `images`, `motion-assets`, and related template asset folders found no exact matches before merge. Added for: SPLIT_TOP_MEDIA asset expansion.

New Additions Log:
- `components/ui/LanguageSelector.tsx` - Radix-UI based dropdown for selecting render output language. Added for: Multi-language dashboard support.
- `app/templates/image-story-collage/page.tsx` - SEO page for Cinematic Collage template. Added for: Marketing.
- `template.tsx` - Core Remotion logic for Cinematic Collage. Added for: High-retention storytelling.

- `SPLIT_TOP_MEDIA` - First reel template. Fixed 9:16 layout with a 16:9 user video or audio waveform frame at the top and dynamic typography, icons, and explainer assets at the bottom. This template must always keep media on top and text/assets on bottom. Remotion composition id is `SPLIT-TOP-MEDIA` because Remotion ids do not allow underscores.

Current `SPLIT_TOP_MEDIA` rules:

- Top media can be audio, video, or image.
- `SPLIT_TOP_MEDIA` has a hard 60-second maximum output duration. If a user uploads longer audio or video, planner/rendering should use only the first 60 seconds and ignore everything after that for this template.
- Audio top frame uses real waveform data when audio is available and rotates between 5 waveform designs: `dualRibbon`, `neonScribble`, `minimalBars`, `spectrumSpikes`, and `particlePulse`.
- Video top frame includes only subtle player cues: a moving progress line, progress dot, and play indicator. Do not copy full video-player mockup UI/backgrounds into the frame.
- Facecam/reel uploads must use `mediaFit: facecam` by default. Vertical/reel uploads should not be shown as the original reel with black bars; they should zoom/crop into the 16:9 top frame with face priority. Current framing uses cover fit, upper-center object position, and slight zoom.
- Use `mediaFit: contain` only for debugging when checking the original uncropped source.
- The top frame border should remain strong/premium with outer border plus inner accent stroke.
- The user upload flow can provide a short `topicTitle`/write-title value. `SPLIT_TOP_MEDIA` renders it in a premium strip directly below the top media frame, similar to a YouTube context title. Keep it short and topic-specific, for example `RBI Grade B Job Notification 2026`.
- Bottom story canvas is part of a 3-layer vertical stack. The bottom zone follows the composition rule: one primary visual per scene (image, icon, or story text) to avoid clutter below the subtitles.
- Bottom story images/logos must preserve the original asset framing by default. Use `contain`, no crop, no pan, and no cinematic zoom for factual assets such as offices, logos, exam screenshots, documents, or product images.
- Do not use random local images/videos just to fill space. A scene asset should only render when it clearly matches the scene text/topic; weak matches should fall back to typography or an icon scene.
- Animated icon MP4s can be used in both faceless and facecam reels, but only for icon-focused scenes. The planner should set `animatedIconKey` from the available semantic keys (`important`, `ok`, `right`, `verified`, `cursor`, `arrow`, `curlyArrow`, `cross`, `outline`, `gift`, `confetti`, `instagramFollow`, `instagramHeart`, `soundwave`). Do not use animated icons as extra decoration on typography/image scenes.
- Transparent PNG motion graphics are stored under `remotion/templates/SPLIT_TOP_MEDIA/motion-assets/`. They are ChatGPT-generated isolated assets for list/checklist, cart, rupee/money, bank, deadline, notification, job, exam, salary, charts, phone, warning, verified, timer, trophy, table, steps, question, trend, mail, location, audio, rocket, security, money-bag, callout, frame, underline, label, badge, and annotation scenes. Some extra files use the `chatgpt-transparent-*` prefix because they came from ChatGPT downloads; keep them in this existing folder and do not create another generated asset folder for this template. Use them as one primary bottom-story visual with `assetType: image`, then animate in Remotion; do not place multiple motion PNGs in the same scene.
- ChatGPT-generated static/9:16 reel images are stored under `remotion/templates/SPLIT_TOP_MEDIA/images/` with the `reel-image-###-semantic-name.png` naming pattern. They belong to `SPLIT_TOP_MEDIA` only and should be used as relevant proof/background/product/story visuals when the scene topic clearly matches. Do not move them into `public/` or create duplicate template folders.
- Story asset frames should not all use the same border color. Image scenes use warmer/cyan accents, video clip scenes use motion blue/green accents, and icon scenes use punchier violet/yellow or pink/green accents. Keep this as a subtle premium frame/glow, not a heavy box around the asset.
- Exam/list-heavy content should use organized motion graphics instead of plain paragraphs. If the script mentions syllabus, exam date, notification date, eligibility, salary breakup, exam stages, Phase 1/Phase 2/interview, or important dates, planner should add `structuredItems` and `structuredStyle` (`list`, `table`, or `steps`) so rows reveal sequentially like a premium info graphic.
- Scene pacing should be enter -> hold -> exit before the next focal element appears.
- Retention rule: no single bottom visual should stay on screen too long. Typography, icon, image, video clip, waveform, and structured/list/table visuals should be held for 3-5 seconds max; split longer narration into multiple visual beats.
- Audio/visual sync rule: bottom typography, image, video, icon, or structured asset should appear slightly before the matching spoken idea, not after it. Target a 0.25-0.45 second visual lead when word timestamps or scene timing are available.
- Text/audio match rule: on-screen title/body must be based on the active transcript phrase for that exact moment. Do not show text from a later or earlier sentence while the narrator is saying something else.
- Typography uses rotating font presets, but highlights are default-off for normal typography scenes. Use at most one highlight only in rare structured/card moments such as price, offer, date, salary, deadline, or CTA.
- Typography-focused scenes should render as one primary text element only. Do not stack eyebrow + headline + body in the same typography scene, because that reads like a presentation slide instead of a reel.
- Typography readability rule: bottom story typography should use dark ink text on a light readable surface. Avoid returning to white headline text on dark/mixed motion backgrounds for normal typography scenes because it becomes less clear in exported reels.
- Normal typography scenes must not render a repeated camera/card/square frame behind the text. Keep typography as clean text only with stroke/shadow for clarity; reserve framed panels for structured tables/lists and actual asset cards.
- Typography language rule: match the audio transcript language. English audio must produce English typography only. Hindi/Urdu audio must produce Hinglish roman typography only; never render Urdu/Arabic script or Devanagari inside reel titles, bodies, topic strips, or structured rows.
- Sound effects must be selected by the planner during script analysis, never randomly by the template. Use only clean professional reel SFX keys: `whoosh`, `hit`, `pop`, `click`, `riser`, `reverseWhoosh`, `shutter`, `tick`, `sparkle`, and `typing`. Avoid meme, funny, censor, ringtone, laugh, slap, or random reaction sounds. Each scene can include `soundEffects` with placement (`entry`, `mid`, `late`, `exit`, or scene-relative seconds), controlled volume, and reason. If no effect semantically matches the scene, use `soundEffects: []`.
- Background theme rule: choose one best background per whole reel, not a different background on every scene. Example: finance/RBI/exam reels use one finance/blueprint background throughout; motivation reels use one motivation/violet background throughout; fashion/premium reels use one paper/premium background throughout. Scene visuals may change, but the reel background should stay consistent.
- Facecam bottom-zone rule: facecam videos must not become typography-only. The speaker remains the top-frame media, but the bottom story canvas should still use one focal point at a time across typography, icon/animated-icon, structured data/list/table, and relevant image/logo/video proof moments when the script supports them.
- Reel duration is input-driven up to the template cap. Short uploads can render below 60 seconds, but longer uploads must still export only the first 60 seconds.
- Dashboard render jobs now attempt Groq transcription before planning. `/api/reels/jobs` reads the temporary S3 upload through its signed URL, sends it to Groq Speech-to-Text, and passes transcript text plus word timestamps into the reel planner. If Groq fails or returns empty text, the job falls back to topic/file-name planning so the user still gets a beta render.
- Dashboard generated-video UX: when a render finishes, show both `Preview` and `Download`, not only a direct download link. Finished render links are saved in browser localStorage immediately and also upserted to Supabase `render_history` through `/api/reels/history`, so the same user can see the last 48-hour renders after logging in on another phone/laptop. `localStorage` remains the fallback if Supabase is unavailable. Recent render entries must be pruned after expiration so users do not click dead temporary S3/Remotion links. Production database setup must include the `render_history` table from `supabase/schema.sql` plus RLS from `supabase/enable-rls-security.sql`.
- Dashboard mode UX: homepage/create workflow cards should deep-link to `/dashboard?mode=faceless` or `/dashboard?mode=facecam`, and the dashboard must open the matching upload mode. After file selection, show an audio/video preview before rendering so users can confirm they picked the correct source.
- Pricing policy: use 1 free completed video as the proof flow, then require paid access. Current recommended paid tiers are Lite `$9/mo` for 12 videos, Creator `$19/mo` for 35 videos, and Studio `$49/mo` for 100 videos. This is intentionally more conservative than the old 20/50/150 quota because each render uses AWS Lambda/Remotion, S3 temporary storage/egress, Groq transcription, OpenAI planning, retries, payment fees, and maintenance. Checkout remains locked/request-access until the payment provider is approved.
- Live test incident note: on the first production faceless test, Groq fell back because the production `GROQ_API_KEY` contained a hidden BOM character, and Remotion Lambda timed out at the old 240s function limit near 89% progress. Fix: strip BOM/quotes from Groq env values before building the Authorization header, return explicit render `state` from the status API, allow Lambda render retry, and deploy Remotion Lambda with a higher timeout (`REMOTION_LAMBDA_TIMEOUT_SECONDS=600`). If this repeats, inspect `/api/reels/jobs/status` first; `errors[0].message` usually tells whether it is transcription, render timeout, or upload access.
- Production validation on 2026-05-28 via `https://www.itnavideo.com`, not local render:
  - Faceless audio upload: presign 1.4s, upload 2.3s, Groq transcription + job start 12.2s, render complete 199.1s total, transcript source `groq`, Remotion cost estimate `$0.049`.
  - Facecam video upload: presign 0.6s, upload 2.0s, Groq transcription + job start 7.9s, render complete 183.8s total, transcript source `groq`, Remotion cost estimate `$0.049`.
  - Current production Lambda: `remotion-render-4-0-467-mem3008mb-disk2048mb-600sec`. Do not return to the older 240s function for 60-second SPLIT_TOP_MEDIA renders.

Facecam transcription workflow:

1. Prefer direct/full FFmpeg for cleanup when `FFMPEG_PATH` or system PATH provides it. Use Remotion's bundled FFmpeg only as fallback.
2. Clean the first 60 seconds by default for `SPLIT_TOP_MEDIA`, keeping video stream copied and cleaning only audio.
3. Save extracted mono 16kHz MP3 under `public/renders/transcripts/`.
3. Transcribe with Groq Whisper by default using `GROQ_TRANSCRIPTION_MODEL=whisper-large-v3-turbo`.
4. If Groq fails and `OPENAI_API_KEY` is available, fallback to OpenAI `whisper-1`.
5. If both transcription providers fail or return empty text, stop the render job with a clear transcription error. Do not create a fake topic/file-name transcript.
6. Save transcript as both `.transcript.txt` and `.transcript.json`.

Example:

```powershell
node scripts/transcribe-facecam.mjs "public/media/viral 2.mp4"
```

Render overrides:

```powershell
$env:REEL_MEDIA_SRC='/media/viral 2.mp4'
$env:REEL_MEDIA_TYPE='video'
$env:REEL_TOPIC_TITLE='Facecam Demo Title'
$env:REEL_OUTPUT='public/renders/facecam-demo-1-fit.mp4'
npm.cmd run reel:render
```

Optional debug override:

```powershell
$env:REEL_MEDIA_FIT='contain'
```

AI reel pipeline:

Keep the AI flow to 5 steps so the planner does not miss decisions:

1. `Analyze` - Read upload, transcription, word timestamps, topic, emotion, and pacing.
2. `Plan Scenes` - Create timeline segments and mark each segment as hook, explain, proof, story, transition, or CTA.
3. `Pick Assets` - Choose one primary focus per scene: typography, icon, image, logo, chart, b-roll, motion card, facecam, or waveform.
4. `Style` - Choose design variant, visual mode, font role, color, animation, position, and clutter level from the scene data.
5. `Render` - Send timeline JSON and assets JSON into Remotion.

Template routing rule:

- `services/ai/reelPlanner.ts` owns the central `REEL_TEMPLATE_REGISTRY` for template name, Remotion composition id, allowed upload media, transcript requirement, planner mode, and media fit.
- Route handlers must derive template and composition from that registry instead of duplicating template maps.
- Before Lambda render starts, jobs must run the final pre-render gate. It blocks template/composition mismatch, unsupported media, missing media/image source, invalid duration, placeholder visible text, and Urdu/Arabic/Devanagari visible text.
- User-facing failures should include a stable `reasonCode` such as `UNSUPPORTED_MEDIA_FOR_TEMPLATE`, `MISSING_MEDIA_SOURCE`, `MISSING_IMAGE_SOURCE`, `PLACEHOLDER_VISIBLE_TEXT`, or `FORBIDDEN_VISIBLE_SCRIPT`.

Asset planning rule:

- If an icon is used in the bottom story canvas, it should visually occupy about 5% to 15% of that bottom space. Tiny icons make the reel look weak/PPT-like; oversized icons should not hide the main content.
- Keep important bottom story text above the Instagram/Reels caption zone. Username, caption, and UI overlays can hide the lower area after upload, so the template shifts text/assets upward.
- Reels must be motion-first, not static text slides. The AI should choose an intentional motion graphic per scene such as asset drift, parallax cards, pulsing icons, waveform pulse, count-up data, or kinetic words while keeping clutter controlled.
- `VIDEO_EXPLAINER` uses Remotion animation math for scene transitions. During the visual lead/overlap, outgoing and incoming scenes can render together while opacity, translate, scale, rotate, and subtle skew are combined into one transform. Keep these transitions purposeful and restrained.
- Remotion feature set for better reels:
  - Premium timed subtitles are rendered in the middle zone; the bottom zone is reserved for visual assets and story typography to maintain a clear 3-layer explainer structure.
  - Scene transitions can use `transitionPreset`: `fadeUp`, `scalePop`, `slide`, `wipe`, `softZoom`, or `none`.
  - Entry motion uses `spring()` for more natural text/icon movement.
  - Audio-only frames render a designed waveform hero instead of a placeholder.
  - Timing is frame-accurate from scene `start`/`end` values.
  - AI JSON must drive `primaryVisual`, `visualRole`, layout, animation, emotion, SFX, and scene focus.
  - The template renders one primary visual per scene: uploaded media, waveform, icon, chart, document, mockup, or image asset.
  - If a primary visual asset is missing, render a topic-safe fallback card instead of blank UI.
  - `scripts/render-reel.mjs` can export a still thumbnail with `REEL_THUMBNAIL_OUTPUT`.
  - `scripts/render-reel.mjs` can render multiple design variants with `REEL_VARIANTS=corporateVc,educationCreator`.

`VIDEO_EXPLAINER` template contract:

- Every scene must have one primary visual unless it is an explicitly text-only hook.
- `visualRole` is functional: `topMedia` keeps uploaded media primary in the top zone, `middleSubtitles` renders the transcript-synced captions in the middle zone, and `bottomVisual` renders the scene visual in the bottom story canvas.
- Audio/faceless uploads must render a waveform/topic hero in the top frame, not a "missing media" placeholder.
- Bottom story visuals should support or prove the active transcript phrase; they must not duplicate generic internal labels.
- Visible scene text should stay short, usually 12-16 words total across headline/body.
- No adjacent scene should repeat the same visual idea unless the transcript is continuing the same point.
- Final render props must pass the server-side Zod schema before Remotion render starts.
- The template name is `VIDEO_EXPLAINER`; do not reintroduce old `SPLIT_TOP_MEDIA` naming into this template.

`HANDWRITTEN_NOTES` template contract:

- Notes must feel written live; no scene should be fully visible on frame 1.
- Text must come from transcript/planner meaning and render as English or clean Roman Hinglish only.
- Urdu, Arabic, and Devanagari characters are stripped before render as a template safety net.
- Each note scene explains one active idea, with max 3 bullets and max 8 words per bullet.
- Controlled visual tokens map to renderable note actions: `heading_write`, `bullet_write`, `diagram_flowchart`, `diagram_timeline`, `diagram_mindmap`, `arrow_diagram`, `highlight_swipe`, and `red_circle`.
- Diagrams must reveal step by step and use distinct renderers for flowchart, timeline, mind map, and comparison.
- Highlights and red circles should animate after the related text appears.
- Unknown scene types or weak visual tokens fall back to a clean `bulletLessonScene`.
- Final render props must pass the server-side Handwritten Notes Zod schema before Remotion render starts.

`VIDEO_CAPTION` template contract:

- `VIDEO_CAPTION` requires uploaded video media; audio-only uploads must use another template.
- Uploaded video stays full-screen primary. Do not add explainer cards, notes, diagrams, visual briefs, or invented story layers.
- Captions must come from real transcript words or timestamp segments only. If both are missing, block render.
- Word timings use `wordHighlight` mode; segment-only timing uses `phraseReveal` mode without fake active-word timing.
- Render props include a `captionPlan` with `mode`, `position`, `avoidArea`, and caption items, plus `videoStyle` and `safeZones`.
- Caption text must be English or clean Roman Hinglish only; Urdu, Arabic, and Devanagari characters are stripped before render.
- Captions should stay above the Reels bottom UI safe zone, with max 2 lines, max 7 words per line, and max 14 words per caption.
- Placeholder captions such as "Important Point", "Key Idea", "Visual Brief", or demo text are removed before render.
- Final render props must pass the server-side Video Caption Zod schema before Remotion render starts.

`IMAGE_STORY` template contract:

- `IMAGE_STORY` is image-led: one strong image per scene, subtle cinematic motion, and minimal text only.
- Render props must include `source`, `images`, `storyPlan`, `safeZones`, `imageSources`, and `imageScenes`.
- Supported source modes are `singleImage`, `multiImage`, `audioImageStory`, and `imageOnlyStory`.
- Image-only mode uses the user topic/prompt for story beats; it must not create a fake transcript or word-timed captions.
- Audio-image mode can use transcript segments for beat timing, but text overlays must stay short and must not become subtitles.
- Every story scene must have a valid `imageId`, image role, timing, and motion such as slow zoom, pan, parallax, push-in, or reveal.
- Text overlays are optional, max 1-2 lines, and must not use placeholders such as "Image Brief", "Visual Story", "Scene 1", "Key Point", or "Important".
- Caption/text output must be English or clean Roman Hinglish only; Urdu, Arabic, and Devanagari characters are stripped before render.
- If no usable image exists, block render instead of showing generic fallback graphics.
- Final render props must pass the server-side Image Story Zod schema before Remotion render starts.

`IMAGE_STORY_COLLAGE` template contract:
- Full 9:16 canvas utilization. No fixed splits.
- Each scene must include a high-quality 9:16 background image.
- Kinetic Typography: Large, bold, uppercase text (Montserrat Black or Inter Tight).
- Animations: Slow zoom-in (Ken Burns) for images, spring-scale for text.
- Audio/Visual Lead: Visual changes must lead the spoken word by 0.3-0.5 seconds.
- Color Palette: Dark cinematic overlays with brand-mint accents.
- Mandatory SFX: Use 'whoosh' on every scene transition and 'hit' on key text reveals.

Provider policy:

- Use Groq for transcription and cheap pre-processing.
- Use OpenAI for planning and decisions because quality matters most there.
- One OpenAI planning call should produce final timeline/overlay JSON, visual modes, typography/style decisions, and validation notes together.
- `OPENAI_MAX_CALLS_PER_RENDER=1` is enforced for planning. If OpenAI planning is unavailable, use the deterministic local planner from the real transcript.
- Keep OpenAI usage limited because paid credits are small.
- Use OpenAI Whisper as transcription fallback if Groq transcription fails. Do not use Groq as a planning fallback.
- Do not call multiple paid providers for the same decision unless explicitly testing.

Audio cleanup rule:

- Run audio cleanup before transcription when possible. Cleaned speech improves transcript timing and reduces text/audio mismatch.
- Preferred full FFmpeg filter: `highpass=f=80,lowpass=f=12000,afftdn=nf=-25,loudnorm=I=-16:TP=-1.5:LRA=11`.
- Bundled Remotion FFmpeg may not include denoise filters, so the local fallback is `loudnorm=I=-16:TP=-1.5:LRA=11`.
- Keep denoise light. Aggressive cleanup can make voice muffled or robotic, which is worse than mild room noise.
- For render input, prefer the cleaned media file when available so the audience hears the same cleaned audio used for transcription.

Template asset rule:

- Keep template assets local to the template folder. Do not create one general icon/asset store for every template.
- Do not use AWS/S3 for template asset storage. The current reel system should read assets from local folders such as `remotion/templates/SPLIT_TOP_MEDIA/` and local uploads/renders from `public/`.
- `SPLIT_TOP_MEDIA` must keep its Lucide icon choices and future explainer asset mapping inside `remotion/templates/SPLIT_TOP_MEDIA/`.
- Other templates should only include the icons/assets they need inside their own folder.

S3 temporary media cost rule:

- If S3 is used for user uploads or final MP4 delivery in production, treat it as temporary storage only.
- Store raw uploads under a prefix such as `uploads/raw/` and final renders under `renders/final/`.
- Add an S3 Lifecycle expiration rule for those prefixes with `Expiration.Days = 2`, so user uploaded audio/video and final MP4 files are automatically removed after about 48 hours. S3 lifecycle runs on a daily schedule, so deletion is not an exact 48-hour timer.
- Add `AbortIncompleteMultipartUpload` for one day so failed large uploads do not leave billable parts behind.
- Add S3 CORS for browser presigned uploads. Without it, the dashboard upload step can show only `Failed to fetch` for both faceless and facecam modes. Run `npm run aws:s3:cors` after setting `NEXT_PUBLIC_SITE_URL`; use `S3_UPLOAD_ALLOWED_ORIGINS` for extra comma-separated origins.
- Use S3 Standard for 48-hour files. Do not move short-lived media to Standard-IA, One Zone-IA, Glacier, or Deep Archive because minimum storage duration charges can apply.
- If bucket versioning is enabled, also expire noncurrent versions or keep versioning disabled for the temporary media bucket; otherwise old versions can keep billing after the visible object is deleted.
- The app UI should tell users that generated MP4 links and uploaded source media are temporary and will be removed after about 48 hours unless a paid plan later adds longer retention.

Serverless render rule:

- Do not keep EC2 running for idle video rendering. EC2 should be stopped/terminated unless it is being used for a deliberate migration/debug session.
- Local development and visual testing stay on the computer with `npm run reel:render`, `npm run media:clean`, and Remotion Studio.
- Production rendering should use Remotion Lambda with `npm run reel:lambda:deploy` and `npm run reel:lambda:render`.
- Remotion Lambda uses AWS Lambda to render only when a job is requested, so there is no always-on render server. Lambda, S3, CloudWatch, and data transfer can still create small usage charges.
- Use a dedicated Remotion temporary bucket via `REMOTION_LAMBDA_BUCKET_NAME`. Do not reuse the old AWS asset bucket for template assets.
- Remotion Lambda renders should use `REMOTION_LAMBDA_DELETE_AFTER=3-days` as a fallback, while the S3 bucket lifecycle rule deletes `uploads/raw/` and `renders/final/` after 2 days. Remotion supports `1-day`, `3-days`, `7-days`, and `30-days`, so the exact 48-hour policy should live in the bucket lifecycle rule.
- Lambda render input media must be an HTTPS or signed temporary S3 URL. Do not pass local `/public/...` paths to Lambda renders; those are for local testing only.
- Keep CloudWatch log retention short with `REMOTION_LAMBDA_LOG_RETENTION_DAYS=1` during beta to avoid log storage creep.
- The dashboard upload flow is connected as: presigned temporary S3 upload -> `/api/reels/jobs` -> Groq transcription -> OpenAI Whisper transcription fallback if needed -> one-call AI planner or deterministic local planner -> final plan validation -> Remotion Lambda render -> `/api/reels/jobs/status` progress polling. No real transcript means no render.

`SPLIT_TOP_MEDIA` local asset folders:

- `remotion/templates/SPLIT_TOP_MEDIA/icons/` - 1803 local Lucide SVG icons generated from the installed `lucide-react` package.
- `remotion/templates/SPLIT_TOP_MEDIA/freepik-icons/` - 107 downloaded Freepik PNG icons for this template.
- `remotion/templates/SPLIT_TOP_MEDIA/animated-icons/` - 23 animated MP4 icon/overlay assets.
- `remotion/templates/SPLIT_TOP_MEDIA/motion-assets/` - 102 transparent PNG motion graphics generated through ChatGPT. The first semantic-key set is used by the planner directly; extra `chatgpt-transparent-*` files are template-local overlays, frames, callouts, labels, and badges.
- `remotion/templates/SPLIT_TOP_MEDIA/background-images/` - 47 background images and gradients.
- `remotion/templates/SPLIT_TOP_MEDIA/fonts/` - 12 curated font families kept for reels: Barlow, Bebas Neue, Cinzel, Dancing Script, IBM Plex Sans, Inter, Lato, Merienda, Montserrat, Open Sans, PT Serif, and Roboto.
- `remotion/templates/SPLIT_TOP_MEDIA/images/` - 144 static image/mockup assets, including `reel-image-###-semantic-name.png` ChatGPT-generated 9:16 reel visuals.
- `remotion/templates/SPLIT_TOP_MEDIA/logos/` - 54 logo assets.
- `remotion/templates/SPLIT_TOP_MEDIA/sound-effects/audio/` - 47 extracted audio sound effects.
- `remotion/templates/SPLIT_TOP_MEDIA/sound-effects/video-reactions/` - 30 extracted sound/reaction video assets.
- `remotion/templates/SPLIT_TOP_MEDIA/sound-effects/image-reactions/` - 25 extracted sound/reaction image assets.
- `remotion/templates/SPLIT_TOP_MEDIA/video-clips/` - 17 stock video clips.

`SPLIT_TOP_MEDIA` design variants:

- `corporateVc` - Premium corporate/funding style for founders, VCs, YC-style updates, and investor-facing reels.
- `pinkWomen` - Pink creator style for women-focused creator, lifestyle, and community videos.
- `fashionCommerce` - Fashion/shopping style for online selling, fashion items, and commerce reels.
- `educationCreator` - Clean education style for explainers, tutorials, and knowledge content.
- `storyMotivation` - Warm high-energy style for story, motivation, and personal growth videos.

Existing files updated after baseline:

- `remotion/templates/SPLIT_TOP_MEDIA/` - Dedicated folder for the first reel template so future templates stay separate and easy to remove or edit.
- `remotion/templates/SPLIT_TOP_MEDIA/freepik-icons/` - Added and extracted downloaded Freepik icons from the provided zip archive.
- `remotion/templates/SPLIT_TOP_MEDIA/assets.ts` - Template-local asset catalog mapping backgrounds, images, logos, video clips, animated icons, sound effects, fonts, and Freepik icons.
- `remotion/templates/SPLIT_TOP_MEDIA/designs.ts` - Template-local design variant catalog for corporate, pink, fashion, education, and story/motivation looks.
- `remotion/templates/SPLIT_TOP_MEDIA/fonts/` - Added only the selected reel-useful font families from the provided fonts archive.
- `remotion/templates/SPLIT_TOP_MEDIA/icons/` - Added local Lucide SVG icon inventory for this template.
- `remotion/templates/SPLIT_TOP_MEDIA/sound-effects/` - Added extracted sound-effect audio plus related video/image reaction assets from the provided archive.
- Source archive zip files were removed after extraction; no extra archive folder is kept in `SPLIT_TOP_MEDIA`.
- `remotion/templates/SPLIT_TOP_MEDIA/icons.ts` - Template-local Lucide icon catalog grouped by categories such as general, finance, agriculture, education, health, tech, and business.
- `remotion/templates/SPLIT_TOP_MEDIA/template.tsx` - Contains the fixed top media and modular story canvas for `SPLIT_TOP_MEDIA`; supports audio, video, and image media frames plus scene visual modes for typography, cards, icons, data, quote, and product-style layouts.
- `remotion/index.tsx` - Remotion template registry entrypoint only.
- `scripts/render-reel.mjs` - Updated sample render input to use `SPLIT_TOP_MEDIA`.
- `public/renders/split-top-media-preview-01.png`, `public/renders/split-top-media-preview-02.png`, `public/renders/split-top-media-preview-03.png` - Still previews rendered from `SPLIT_TOP_MEDIA`.
- `public/renders/split-top-media-preview-ai-engine.png` - Still preview for the AI-native cinematic reel generation design experiment.
- `public/renders/split-top-media-preview-reference.png` - Still preview based on the multi-reel AI engine reference image.
- `services/ai/reelPlanner.ts` - Real AI reel planning service for `SPLIT_TOP_MEDIA`; uses one OpenAI planning call, Groq fallback, local dry-run fallback, schema/version contracts, input normalization, visual budget rules, and repair/finalization checks so timeline, assets, style, and render props stay connected.
- `app/api/reels/plan/route.ts` - API endpoint for generating timeline JSON, assets JSON, Remotion render props, and validation notes from transcript/script input.
- `remotion/templates/SPLIT_TOP_MEDIA/template.tsx` - Connected to planner timing by accepting scene `start`/`end` values and calculating composition duration from input props.
- `scripts/render-reel.mjs` - Can render sample props or `public/renders/reel-plan.json` planner output through Remotion.
- `scripts/render-reel.mjs` - Also supports environment overrides: `REEL_MEDIA_SRC`, `REEL_MEDIA_TYPE`, `REEL_MEDIA_FIT`, `REEL_TOPIC_TITLE`, `REEL_OUTPUT`, `REEL_PLAN`, and `REEL_DESIGN`. Video overrides default to `mediaFit: facecam` unless explicitly changed.
- `scripts/remotion-lambda-deploy.mjs` - Deploys the Remotion Lambda function and site bundle for serverless rendering without an always-on EC2 render server.
- `scripts/render-reel-lambda.mjs` - Starts and monitors a Remotion Lambda render using the same planner input shape as the local render script. Lambda media inputs must be HTTPS/signed URLs, not local `/public/...` paths.
- `scripts/transcribe-facecam.mjs` - Added facecam transcription helper. It extracts audio from video using Remotion FFmpeg, transcribes with Groq Whisper, falls back to OpenAI Whisper when available, and writes transcript `.txt`/`.json` files.
- `public/renders/moneytopic.mp3` - Local smoke-test copy of the provided money topic audio.
- `public/renders/moneytopic-transcript.json` - Groq verbose transcript for `moneytopic.mp3`; used to verify audio-to-reel processing.
- `public/renders/reel-plan.json` - Render-ready smoke-test plan generated from the transcript; note: PowerShell wrote a UTF-8 BOM, so `scripts/render-reel.mjs` strips BOM before JSON parse.
- `public/renders/moneytopic-reel.mp4` - Remotion output rendered from `moneytopic.mp3` and `reel-plan.json`.
- Issue note: Remotion bundled renders cannot use `/renders/file.mp3` directly; `SPLIT_TOP_MEDIA` now resolves public media paths through `staticFile()` before passing them to `<Audio />`, `<Img />`, or `<OffthreadVideo />`.
- `public/renders/moneytopic-reel-v2.mp4` - Second money topic render after improving the smoke plan to use valid icon keys plus real template images, videos, and Freepik icons.
- Issue note: If a scene uses an icon name that is not listed in `remotion/templates/SPLIT_TOP_MEDIA/icons.ts`, the template falls back to the same default video icon. Planner output must use valid icon keys such as `cash`, `savings`, `bank`, `growth`, `safety`, or `target`.
- Issue note: Reels look like PPT when every scene is only text plus a small icon. `SPLIT_TOP_MEDIA` now supports scene `assetKey` and `assetType` so the story canvas can show larger local images, videos, and Freepik icons per scene.
- Planning rule added: icon assets in the story canvas should be sized around 5% to 15% of the bottom story space so they are clearly visible without covering the main message.
- Safe-zone rule added: bottom story text/assets should sit above the social caption overlay area so Instagram/Reels UI does not hide important text.
- `public/renders/moneytopic-reel-v3-safezone.mp4` - Money topic render after shifting bottom story text/assets upward for Instagram/Reels caption safe zone.
- `public/renders/moneytopic-reel-v4-clean.mp4` - Money topic render after removing template/debug labels such as itnavideo logo, AI Reels Engine, design labels, audio brief, voice analysis, clean audio, pacing, and 16:9 source frame text from the reel.
- Template rule added: final reel frames should not show internal template/debug text. Only user/story content and intentional visual assets should appear.
- `public/renders/moneytopic-reel-v5-latest.mp4` - Latest money topic render using the current clean template, safe-zone layout, real scene assets, and planner input.
- Planning rule added: every scene should include an intentional `motionGraphic` decision; avoid plain text-slide-only scenes unless used as a deliberate calm pause.
- `public/renders/sample-reel.mp4` - Current smoke render output for `SPLIT_TOP_MEDIA`.
- `public/renders/facecam-demo-1.mp4` and `public/renders/facecam-demo-2.mp4` - Facecam demo renders created from `public/media/viral 2.mp4` and `public/media/gemstones.mp4`.
- `public/renders/facecam-demo-1-fit.mp4` - Facecam demo render using the newer default zoom/crop `mediaFit: facecam` rule.
- `public/renders/transcripts/viral-2.mp3`, `public/renders/transcripts/viral-2.transcript.txt`, `public/renders/transcripts/viral-2.transcript.json` - Extracted audio and transcript for `public/media/viral 2.mp4`.
- `public/renders/transcripts/gemstones.mp3`, `public/renders/transcripts/gemstones.transcript.txt`, `public/renders/transcripts/gemstones.transcript.json` - Extracted audio and transcript for `public/media/gemstones.mp4`.
- Template rule added: uploaded facecam/reel video must be reframed for the 16:9 top frame with face priority. Do not keep the reel exactly as uploaded when it creates side bars or weak framing.
- Template rule added: audio wave designs should vary by design variant so every audio video does not show the same waveform.
- Template rule added: typography should rotate through multiple font stacks and use occasional highlight colors for important words.
- Template rule added: sound effects should be distributed through the whole reel using duration-aware timing, with slightly higher but controlled volume so long reels stay engaging.
- `app/api/reels/history/route.ts` - Saves and reads 48-hour render metadata from Supabase so dashboard recent videos work across devices with `localStorage` fallback.
- `supabase/schema.sql` - Added `render_history` table, indexes, and RLS enablement for cross-device recent render history.
- `supabase/enable-rls-security.sql` - Added `render_history` RLS enablement for production security setup.
- `services/supabase/siteStore.mjs` and `services/supabase/siteStore.ts` - Added server-side Supabase helpers for recent render history list/upsert.
- `app/dashboard/page.tsx` - Recent renders now load from Supabase, merge with local fallback history, and save completed render metadata server-side after each successful render.
- External downloaded typography/motion PNGs in `C:\Users\Akram Editor Studio\Downloads\transparent PNG assets` were renamed from ChatGPT timestamp filenames to readable semantic kebab-case names such as `yellow-highlight-stroke.png`, `speech-bubble-callout.png`, `soft-paper-card-large.png`, and `headline-frame-rectangle.png`. Keep future downloaded assets named by visual purpose before copying them into the template.
- External downloaded image-presentation PNGs in `C:\Users\Akram Editor Studio\Downloads\transparent PNG assets` were renamed to semantic names such as `smartphone-mockup-frame.png`, `browser-window-frame.png`, `clipboard-document-frame.png`, `magnifying-glass-overlay.png`, `red-marker-circle.png`, `tape-corner-set.png`, `cyan-edge-frame-vertical.png`, `torn-paper-frame.png`, and `carousel-image-frame.png`. Use these for presenting screenshots/images/documents in reels; do not bake text into these PNGs.
- `ai-reel-image-prompts.md` - Added 100 numbered ChatGPT image-generation prompts for high-quality reel visuals across finance, education, jobs, business, AI/tech, creator, motivation, commerce, wellness, and generic proof/background scenes. Prompts require no readable text, logos, or watermarks so generated images stay safe for overlay typography.
- 2026-05-29 typography deploy note: `SPLIT_TOP_MEDIA` now has a template-level final display guard that romanizes Urdu/Arabic and Devanagari text before rendering topic strips, scene typography, and structured rows. This is a render safety net in addition to planner language rules, so old or imperfect planner JSON should not show Urdu/Arabic script in generated videos. The Remotion Lambda site bundle was redeployed to `itnavideo-split-top-media`, and deploy defaults now match the production 3008MB/600s Lambda settings.
- 2026-05-29 language policy clarification: upload language controls typography language. English audio/video must keep all reel typography in English. Hindi/Urdu audio/video must render typography as Hinglish/Roman text based on the active transcript phrase, not polished English translation and never Urdu/Arabic/Devanagari script. `/api/reels/jobs` must pass the planner-sanitized `topicTitle` into Lambda instead of re-overriding it with the raw user title.
- 2026-05-29 production deploy note: the language policy fix was deployed to Vercel production as `dpl_8m55anuCc6pW9brUf6xRW6JNBSaB` and aliased to `https://www.itnavideo.com`.
- 2026-05-29 professional asset planner note: the 100+ ChatGPT-generated 9:16 reel images stay together in one shared folder, `remotion/templates/SPLIT_TOP_MEDIA/images/`, and are exposed through one planner key: `reelChatgptImage`. Do not split them into finance/study/business/etc. categories because concepts overlap and AI should choose by scene context. Extra ChatGPT transparent PNGs in `motion-assets/` are exposed as professional frames/callouts such as `presentationFrame`, `documentFrame`, `carouselFrame`, `annotationArrow`, `markerCircle`, `speechBubble`, and `paperCard`. These assets should be used as one strong hero visual per matching scene so `SPLIT_TOP_MEDIA` reels feel premium and not like text-only PPT slides.
- 2026-05-29 professional asset production deploy note: the updated Remotion Lambda site bundle was redeployed to `itnavideo-split-top-media`, and the planner/API update was deployed to Vercel production as `dpl_FdgMBm7zGGGqyGugaNrMwNuDn9BF`, aliased to `https://www.itnavideo.com`.
- 2026-05-29 shared image pool correction: category-specific 9:16 image planner keys were removed. The planner now has one shared key, `reelChatgptImage`, for all ChatGPT 9:16 images in `remotion/templates/SPLIT_TOP_MEDIA/images/`. This avoids missing good visuals when finance, study, business, story, and corporate concepts overlap. Remotion Lambda was redeployed, and Vercel production was deployed as `dpl_D3D8pT1XadUxsQGdrA9sDfP6dymo`, aliased to `https://www.itnavideo.com`.
- 2026-05-29 downloaded asset rename note: external downloaded files were renamed for easier future syncing. `C:\Users\Akram Editor Studio\Downloads\Images` now uses semantic shared-pool names like `reel-image-001-finance-desk-rupee-calculator.png` through `reel-image-105-shared-pool-extra-visual-005.png`. Generic `file_*.png` files in `C:\Users\Akram Editor Studio\Downloads\transparent PNG assets` were renamed to readable `chatgpt-3d-png-###-...png` names such as `chatgpt-3d-png-015-laptop-analytics.png` and `chatgpt-3d-png-032-studio-microphone.png`.
- 2026-05-29 typography/PNG matching correction: Hindi/Urdu/Hinglish uploads now use stronger Roman Hinglish detection and transcript fallback so `SPLIT_TOP_MEDIA` typography does not switch into Urdu/Arabic/Devanagari or polished English. Transparent 3D PNG/frame/callout assets are now selected only on exact semantic matches; weak/generic professional scenes prefer the shared `reelChatgptImage` 9:16 pool instead, so random PNGs do not appear against unrelated Hindi videos.
- 2026-05-29 production deploy note: the typography/PNG matching correction was deployed to Remotion Lambda site `itnavideo-split-top-media` with function `remotion-render-4-0-467-mem3008mb-disk2048mb-600sec` and serve URL `https://remotionlambda-apsouth1-m59wp9dklj.s3.ap-south-1.amazonaws.com/sites/itnavideo-split-top-media/index.html`. Vercel production was deployed as `dpl_FiGndPeuppT4ku8CpuikL3o9Bw6X` and aliased to `https://www.itnavideo.com`.
- 2026-05-29 typography style upgrade: no new files/folders were added. `SPLIT_TOP_MEDIA` now registers selected existing local fonts from `remotion/templates/SPLIT_TOP_MEDIA/fonts/` and supports one controlled `typographyStyle` per scene: `impactBold`, `boldCondensed`, `extruded3d`, `neonGlow`, `metallicGold`, `cinematicDepth`, or `thumbnail3d`. The planner chooses style from the active script phrase, so 3D, glow, gold, depth/shadow, and impact typography are used by context instead of all appearing together.
- 2026-05-29 typography style production deploy note: the style upgrade was deployed to Remotion Lambda site `itnavideo-split-top-media` using existing template fonts only, and Vercel production was deployed as `dpl_44CUZTUWNwKdmasRer2Qj3mUEZHy`, aliased to `https://www.itnavideo.com`.
- 2026-05-29 asset matching/timing upgrade: `SPLIT_TOP_MEDIA` still keeps all 9:16 ChatGPT images in one folder and one planner key, but the renderer now selects the matching image range from the prompt meaning instead of blindly rotating through numbered images. More local video clip keys were exposed for education, travel, meetings, attention writing, motivation writing, late work, agreement, and office thinking scenes. Timeline repair and render duration now keep every typography/image/video/SVG/icon/structured beat in a 3-5 second window where possible, with one primary visual at a time. Clean reusable SFX keys were added for cash register, heartbeat, unlock, and boost using existing local audio files; meme/ringtone/censor/laugh/slap sounds remain excluded from planner guidance.
- 2026-05-29 ChatGPT reel image rename note: the 105 ChatGPT 9:16 images inside `remotion/templates/SPLIT_TOP_MEDIA/images/` were renamed from `chatgpt-reel-image-###.png` to `reel-image-###-semantic-name.png`, for example `reel-image-001-finance-desk-rupee-calculator.png`, while keeping the same single folder and same planner key `reelChatgptImage`. `template.tsx` and `assets.ts` were updated to import the new filenames.
- 2026-05-29 image rename deploy note: after renaming the 105 images, stale direct image imports in `SPLIT_TOP_MEDIA/template.tsx` were remapped to existing semantic reel images/logos, and the Remotion Lambda site `itnavideo-split-top-media` was redeployed successfully with `remotion-render-4-0-467-mem3008mb-disk2048mb-600sec`.
- 2026-05-29 asset/language hotfix: generated reels were showing only typography when planner JSON kept `visualMode: typography` even with an `assetKey`. `SPLIT_TOP_MEDIA` now renders a matching `assetKey` as the primary bottom visual regardless of typography/card/product mode, while still enforcing one primary visual. The planner also overrides weak/mismatched provider asset choices with local semantic asset suggestions. Display text now strips unsupported non-Latin scripts at planner and render time, while keeping Hindi/Urdu in Roman Hinglish when detected or when `language`/`displayLanguage`/`typographyLanguage` is passed as Hindi, Urdu, or Hinglish. Deployed to Remotion Lambda and Vercel production `dpl_DBUvUXQb7RxLJ4nrEiygTBxpKny7`, aliased to `https://www.itnavideo.com`.
- 2026-05-29 sound effects upgrade: downloaded the CC0 Kenney UI Audio pack and copied only selected clean UI sounds into the existing `remotion/templates/SPLIT_TOP_MEDIA/sound-effects/audio/` folder as semantic files: `kenney-ui-click-soft.wav`, `kenney-ui-click-bright.wav`, `kenney-ui-switch-soft.wav`, `kenney-ui-switch-bright.wav`, `kenney-ui-rollover-pop.wav`, and `kenney-ui-rollover-tick.wav`. No new template folders were created. Planner/template now use these for cleaner click/pop/switch moments.
- 2026-05-29 asset matching/SFX production deploy note: the 3-5s visual timing, semantic ChatGPT image range picker, expanded local video keys, and clean SFX mapping were deployed to Remotion Lambda site `itnavideo-split-top-media`. Vercel production was deployed as `dpl_AKdGhg4GAWjvUCFoTMPtZbwM9G9i`, aliased to `https://www.itnavideo.com`.
