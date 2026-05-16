# FFmpeg Status And Roadmap

This file is the source of truth for FFmpeg work in Itnavideo. Check this before adding another FFmpeg feature so we do not rebuild the same thing twice.

Reliability pipeline docs live in `docs/ffmpeg-pipeline/`. Storage strategy lives in `docs/STORAGE_STRATEGY.md`. Read them before changing render behavior, fallback behavior, status polling, storage behavior, or user-facing FFmpeg messages.

Last updated: 2026-05-14

---

## Current FFmpeg Modes

Users can now create videos on Itnavideo through the dashboard MVP flows. Current work should improve reliability and quality without blocking the basic creator path.

Pipeline principle: FFmpeg should do the least risky work needed to produce a playable 720p MP4 first, then add captions, SFX, overlays, and styling only when they have fallback paths. 1080p should stay a later premium profile until the 720p pipeline is consistently reliable.

| Mode | Status | User Visible | Main Files |
|---|---|---:|---|
| Voice-to-video render | In Process | Yes | `app/api/render/route.ts`, `services/rendering/ffmpegService.js` |
| Face video / talking-head upload | In Process | Yes | `app/dashboard/page.tsx`, `pages/api/process-talking-head.ts`, `services/rendering/processShortsVideo.ts` |
| FFmpeg job status polling | Completed | Yes | `components/dashboard/VideoUploadStatus.tsx`, `app/api/ffmpeg/status/route.ts`, `services/rendering/ffmpegJobStore.ts` |
| Viral Shorts style templates | Completed | Backend + Face Video UI | `services/rendering/videoStyles.ts` |
| Professional dynamic templates | In Process | Backend | `services/rendering/proVideoTemplates.js`, `app/api/templates/route.ts`, `services/rendering/ffmpegService.js` |

---

## Completed

### 1. Fast Voice-To-Video Renderer

Files:

- `services/rendering/ffmpegService.js`
- `app/api/render/route.ts`

Done:

- 720p portrait is the active stability-first render profile.
- 720p is the current startup export focus; 1080p is a later premium profile.
- Uses `ffmpeg-static` fallback path resolution.
- Downloads/caches remote assets.
- Uses atomic cache writes for fetched assets.
- Falls back to placeholder visuals if a scene asset is missing.
- Default fallback rule: whenever an icon, image, background, or visual asset is needed but not available, use a text-based scene/card instead of failing the render.
- Supports image/video scene inputs.
- Supports subtitles with `drawtext`.
- Supports text cards for placeholder scenes.
- Supports audio mix with voice, music, silence, and SFX.
- Uses `alimiter` instead of expensive `loudnorm` in the older voice-to-video renderer.
- Has render timeout cleanup.

Do not duplicate:

- Do not create another basic `/api/render` endpoint for voice-to-video.
- Improve `services/rendering/ffmpegService.js` instead.

Still needed:

- Better deployment tracing cleanup for Next/Turbopack.
- Better caption rendering using ASS/libass for dynamic word effects.
- Safer cleanup policy for old cache/render files.

---

### 2. Face Video Upload Flow

Files:

- `app/dashboard/page.tsx`
- `pages/api/process-talking-head.ts`
- `services/rendering/processShortsVideo.ts`
- `services/rendering/videoStyles.ts`

Done:

- User can choose `Face video upload` in the dashboard create modal.
- User uploads one talking-head video; no separate audio file is required.
- User can pick style: `classic`, `cinematic`, or `clean`.
- Upload is handled with `formidable` in `pages/api/process-talking-head.ts`.
- Upload completion immediately starts the FFmpeg render task and returns a `202` response for polling.
- Backend extracts audio from the uploaded video when no subtitle file is supplied.
- Backend can auto-generate SRT subtitles using OpenAI transcription.
- If transcription is unavailable or fails, backend writes mock ASS subtitles with `This is a test video` so MVP renders still produce a real MP4.
- Backend renders the processed video to `public/renders/[jobId].mp4`.
- Finished video is added back into the dashboard job list.
- Polling UI shows a `Watch Video` button when the job reaches `ready`.
- MVP safety fallback exists: if ASS/libass or drawtext crashes in the local FFmpeg build, the backend retries a basic 9:16 sharpened MP4 with progress bar and preserved camera audio so the user still gets an output preview.
- Smoke test produced a real file at `public/renders/mvp_face_smoke_1778680437.mp4`.

Do not duplicate:

- Do not create another talking-head upload UI elsewhere.
- Extend the existing dashboard modal flow unless a separate editor page is intentionally designed.

Still needed:

- Add a better UI label explaining that auto captions require server transcription.
- Add file size and max duration warnings before upload.
- Add video preview before processing.
- Add optional manual subtitle upload in the UI.

---

### 3. Viral Shorts Template

File:

- `services/rendering/videoStyles.ts`

Done:

- `SHORTS_CONFIG` exists with:
  - width `1080`
  - height `1920`
  - zoom scale `1.1`
  - zoom interval `6`
  - zoom duration `3`
  - preset `veryfast`
  - CRF `23`
  - mobile audio filters
- `getShortsFilter(style)` exists.
- Supported styles:
  - `classic`
  - `cinematic`
  - `clean`
- `classic` uses blurred auto-fill background, centered foreground video, face glow, and dynamic zoom.
- `cinematic` uses classic layout plus higher contrast and subtle vignette.
- `clean` uses black background, scaled-to-fit source video, and sharpening.
- Audio uses:
  - `compand`
  - `loudnorm`

Do not duplicate:

- Do not create another Shorts filter builder.
- Add new styles inside `services/rendering/videoStyles.ts`.

Still needed:

- Add `reels`, `podcast`, or `product` style variants only if they are actually used in UI.
- Add ASS subtitle styles to this same template later.

---

### 4. FFmpeg Progress Tracking

Files:

- `services/rendering/processShortsVideo.ts`
- `services/rendering/ffmpegJobStore.ts`
- `app/api/ffmpeg/status/route.ts`
- `components/dashboard/VideoUploadStatus.tsx`

Done:

- `processShortsVideo(inputPath, outputPath, options)` exists.
- It runs FFmpeg with `child_process.spawn`.
- It parses FFmpeg stderr using this time regex:

```ts
/time=(\d{2}):(\d{2}):(\d{2}(?:\.\d+)?)/
```

- It converts FFmpeg time into percent based on probed duration.
- It logs progress to the server console.
- It exposes `onProgress({ percent, seconds, raw })`.
- Talking-head route writes progress into `ffmpegJobStore`.
- Frontend polls:

```text
GET /api/ffmpeg/status?userId=...&jobId=...
```

- `VideoUploadStatus` shows spinner, progress bar, status text, ready link, and reconnect state.

Do not duplicate:

- Do not add a second progress polling API.
- Use `/api/ffmpeg/status` and `ffmpegJobStore`.

Still needed:

- Keep Supabase-backed job status stable for production Render/Vercel scale.
- Move the face-camera route to a true Render background job if Vercel/API timeout becomes a blocker.
- Add SSE or WebSocket only after the current polling path becomes a bottleneck.

---

### 5. Creator Asset Library

Current:

- Google Drive is the active internal reusable asset library for Itnavideo-only assets.
- Drive link: `https://drive.google.com/drive/folders/1iulyUwCACiwHw-q1y0dgp8fcnnL_i8A7?usp=sharing`
- Drive reader service account: `itnavideo-drive-assets@vocal-marking-496314-p4.iam.gserviceaccount.com`
- Required Drive permission for that service account: `Viewer`
- Drive API read access verified on 2026-05-14; top-level folders are visible to the service account.
- Drive `fonts` folder verified with 30 Google font-family folders.
- Drive `material_symbols` folder verified with `Outlined`, `Rounded`, and `Sharp` style subfolders.
- Cloudinary currently has older uploaded asset folders that were verified:
  - `Sound Effects`: 35 video/audio resources
  - `Screenshots`: 9 image resources
  - `Background Images MP4`: 82 video resources
- Background MP4 files are 90 seconds long (`00:01:30`) and intended for Reels/Shorts creation.
- Going forward, reusable platform assets should be organized in Google Drive; Cloudinary should focus on user uploads and generated outputs.

Do not duplicate:

- Do not add another Canva-style asset provider for this.
- Extend the existing asset-library matching path so Google Drive assets and `public/asset-library` can be searched together.

Still needed:

- Add Google Drive folder ID config and Drive API indexing helper.
- Keep Cloudinary for user uploads and generated videos.
- Keep the existing Cloudinary visual helper only as a compatibility bridge while Drive indexing is added.
- Prefer assets that can conform cleanly to the env-driven target resolution.

---

### 6. Professional Dynamic Template System

Files:

- `services/rendering/proVideoTemplates.js`
- `services/rendering/ffmpegService.js`
- `app/api/templates/route.ts`
- `docs/ffmpeg-pipeline/PRO_TEMPLATE_SYSTEM.md`

Done:

- Added professional template presets:
  - `pro_motivational_01`
  - `pro_educational_01`
  - `pro_storytelling_01`
  - `pro_modern_01`
- Timeline metadata now carries template JSON with:
  - `template_id`
  - `background_color`
  - `font_family`
  - `animation_style`
  - `text_content`
- FFmpeg voice renderer applies:
- target-resolution-safe solid-color fallback backgrounds
  - 20-24% dark readability overlay
  - optional vignette
  - safe-zone text positioning
  - dynamic font sizing by character count
  - text shadow/glow pass
  - fade-slide / safe reveal text animation
- Renderer caches template fonts from Google Drive `fonts` into `public/cache/drive-fonts` before FFmpeg runs.
- `GET /api/templates` exposes available template presets for future UI use.

Still needed:

- Connect Google Drive background MP4 matching to `background_color`.
- Add a fast preview render mode after the stable full render path is reliable.
- Add true word-by-word caption highlighting using word timestamps.

Do not duplicate:

- Do not create a second template renderer.
- Extend `proVideoTemplates.js` and the existing `ffmpegService.js` path.

---

## In Process

### Dynamic Captions

Current:

- Voice-to-video renderer uses `drawtext`.
- Talking-head route now supports large colorful word-pop captions through FFmpeg `drawtext`.

Needed:

- Generate ASS subtitles from word timestamps.
- Add karaoke word highlighting.
- Add pop/slide animation tags.
- Use `fontsdir=public/fonts`.
- Make caption style selectable in Face Video mode.

Recommended files:

- Add `services/rendering/assCaptions.ts`
- Update `pages/api/process-talking-head.ts`
- Update `services/rendering/processShortsVideo.ts`

---

### B-Roll / Icon Overlays

Current:

- Keyword icon overlays are implemented for the face-camera shorts path when matching PNG/WebP/JPG assets exist.
- Local asset library exists at `public/asset-library`.
- Permanent keyword icons can also live in `assets_library/icons`.
- Google Drive is the target internal asset library for screenshots, background MP4s, images, video clips, music, and SFX.
- Google Drive `material_symbols` should be used for icon/symbol overlays when available.
- Default fallback rule is text-first: if a matching icon/image/background is missing, render a clean text card or text overlay instead.

Needed:

- Expand keyword-to-asset matching beyond the current local filename matcher.
- Add Gemini icon planning metadata for richer icon choices.
- Add Material Symbols matching for educational bullets, app/tutorial highlights, CTA icons, and explainer overlays.
- If no matching icon/image/visual exists, generate a text-only overlay/card from the transcript keyword or scene idea.
- Limit to 5-8 overlays per short.
- Keep overlays away from caption safe zone.

Recommended files:

- Add `services/rendering/overlayPlanner.ts`
- Add overlay inputs to `processShortsVideo`
- Add assets under `public/asset-library/icons` only for local fallback assets.
- Use the future Google Drive indexing helper when relying on internal screenshots/background MP4s in render planning.
- Use Google Drive `material_symbols` as the primary symbol/icon source.

---

### Jump Cuts / Silence Removal

Current:

- Dynamic zoom exists.
- Python silence/filler jump-cut preprocessing exists for face-camera videos.

Needed:

- Add Whisper/Gemini word timestamp generation before jump-cut planning in production.
- Use timestamps to avoid cutting inside words more precisely.
- Move this full talking-head flow to the Render worker when long uploads become common.

Recommended files:

- Add `services/rendering/silenceDetection.ts`
- Extend `processShortsVideo`

---

## Pending

### Production Render Queue

Problem:

- Current talking-head route holds the HTTP request while FFmpeg runs.
- This is okay for early testing but not ideal for production.

Needed:

- Create async job route:

```text
POST /api/ffmpeg/jobs
GET /api/ffmpeg/status
```

- Start render in a background worker on Render.com.
- Store status in Supabase, matching the current `ffmpeg_jobs` path.

Do not build yet unless deployment timeout becomes a blocker.

---

### Storage And Cleanup

Current:

- Uploads go to `public/uploads/talking-head`.
- Outputs go to `public/renders`.
- Job files go to `public/cache/ffmpeg-jobs`.

Needed:

- Delete old uploads after render.
- Delete old temp audio files.
- Add scheduled cleanup for old renders/cache.
- Upload final render to Cloudinary for the current MVP, or durable storage for production later.
- Keep source/reusable Google Drive asset folders separate from Cloudinary user-upload and render-output folders.

---

### Render Quality Testing

Needed:

- Test horizontal input.
- Test vertical input.
- Test no-audio input.
- Test long video input.
- Test subtitle paths with spaces.
- Test Render.com memory usage.
- Test mobile playback compatibility.

---

## Quick Reference

### Face Video Upload User Flow

```text
Dashboard
→ Create video
→ Face video upload
→ Upload one video file
→ Pick Classic / Cinematic / Clean
→ Process face video
→ Poll /api/ffmpeg/status
→ Open processed video
```

### Main FFmpeg Files

```text
services/rendering/ffmpegService.js
services/rendering/processShortsVideo.ts
services/rendering/videoStyles.ts
services/rendering/ffmpegJobStore.ts
app/api/render/route.ts
app/api/ffmpeg/status/route.ts
pages/api/process-talking-head.ts
components/dashboard/VideoUploadStatus.tsx
```

### Before Adding A New FFmpeg Feature

Check these first:

1. Is it a voice-to-video feature? Use `ffmpegService.js`.
2. Is it a talking-head / Shorts feature? Use `processShortsVideo.ts`.
3. Is it a visual style? Use `videoStyles.ts`.
4. Is it progress/status? Use `ffmpegJobStore.ts` and `/api/ffmpeg/status`.
5. Is it UI status? Use `VideoUploadStatus.tsx`.
6. Does it affect reliability or fallback behavior? Read `docs/ffmpeg-pipeline/ERROR_POLICY.md` and `docs/ffmpeg-pipeline/CHECKLIST.md`.
