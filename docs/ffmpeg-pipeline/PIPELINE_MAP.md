# FFmpeg Pipeline Map

This map explains which part of the platform owns each FFmpeg job.

---

## Audio-To-Video Pipeline

```text
User audio upload
-> Cloudinary upload
-> /api/generate
-> AI planning
-> /api/render
-> renderVideoWithFFmpeg
-> public/renders/*.mp4
-> dashboard video link
```

Owned by:

- `app/dashboard/page.tsx`
- `app/api/generate/route.ts`
- `app/api/render/route.ts`
- `services/rendering/ffmpegService.js`

Minimum FFmpeg work:

- Make a 720p portrait video.
- Use voiceover as primary audio.
- Use timeline scenes.
- Use text-card fallback when visuals are missing.
- Mix SFX only when available.

Avoid:

- Extra API routes for the same render.
- New quality profiles.
- Mandatory asset dependencies.
- Heavy filters without a fallback.

---

## Face Video Pipeline

```text
User face video upload
-> /api/process-talking-head
-> ffmpegJobStore status
-> processShortsVideo
-> public/renders/*.mp4
-> /api/ffmpeg/status polling
-> dashboard video link
```

Owned by:

- `app/dashboard/page.tsx`
- `pages/api/process-talking-head.ts`
- `services/rendering/processShortsVideo.ts`
- `services/rendering/videoStyles.ts`
- `services/rendering/ffmpegJobStore.ts`
- `app/api/ffmpeg/status/route.ts`

Minimum FFmpeg work:

- Preserve camera audio.
- Fit video into 720p portrait.
- Apply a stable default style.
- Show progress.
- Produce MP4 even if captions fail.

Avoid:

- Holding the user with no progress updates.
- Failing because transcription is unavailable.
- Failing because ASS/libass crashes.
- Adding another progress system.

---

## Asset Fallback Pipeline

```text
Need visual asset
-> User upload exists?
-> Google Drive asset-library match?
-> Local asset-library match?
-> Text card / text overlay
-> Solid color background
```

Google Drive internal asset library:

- Link: `https://drive.google.com/drive/folders/1iulyUwCACiwHw-q1y0dgp8fcnnL_i8A7?usp=sharing`
- Scope: Itnavideo only.
- Reader service account: `itnavideo-drive-assets@vocal-marking-496314-p4.iam.gserviceaccount.com`
- Required Drive permission: `Viewer`
- Use for reusable sound effects, screenshots, background videos, video clips, images, and music.
- Use `material_symbols` for reusable icon/symbol overlays in explainer, educational, app/tutorial, and CTA videos.
- Preferred folder names use lowercase and underscores, for example `sound_effects`, `screenshots`, `background_videos`, `video_clips`, `images`, `music`, and `metadata`.

Cloudinary:

- Use for user uploads and generated output/previews.
- Do not use Cloudinary as the long-term internal asset library source.

Future storage:

- Move durable large-scale storage to AWS S3 when the startup grows and paid infrastructure is justified.

Local fallback:

- `public/asset-library`

Default behavior:

- If image is not found, use text.
- If icon is not found, use text.
- If Material Symbol is not found, use text.
- If background is not found, use text card.
- If SFX is not found, skip SFX.

---

## Status Pipeline

```text
queued
-> uploading
-> processing
-> rendering
-> ready
```

Failure should happen only after retries:

```text
optional layer failed
-> retry safer path
-> retry base path
-> error only if base path fails
```

Owned by:

- `services/rendering/ffmpegJobStore.ts`
- `app/api/ffmpeg/status/route.ts`
- `components/dashboard/VideoUploadStatus.tsx`
