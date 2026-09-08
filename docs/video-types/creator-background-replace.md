# Reference Note

This is a detailed Video Type spec. Start with `docs/ITNAVIDEO_MASTER_DOC.md` for the latest source of truth, then use this file for Background Replace implementation details.

# Creator Background Replace

| Field | Value |
|---|---|
| Video Type Name | Creator Background Replace |
| Internal ID | `CREATOR_BACKGROUND_REPLACE` |
| Composition ID | `CREATOR-BACKGROUND-REPLACE` |
| Dashboard Mode | `creatorBackgroundReplace` |
| Route | `/templates/creator-background-replace` |
| Current Status | Coming Soon / Paused |

## Current Availability

Background Replace is currently paused and should be shown as **Coming Soon** in the dashboard. The feature needs a separate Python/FFmpeg/rembg worker, which is too heavy for the current free-tier AWS budget. Do not allow users to start a final Background Replace render until a dedicated worker is deployed and funded.

## Purpose

Replace a creator video's background with one user-uploaded background image. This Video Type is a simple creator utility: upload a creator video, upload a background image, adjust fit/zoom/position, then export.

This is a shorts/reels-only feature. Do not use it for long videos. Background removal is compute-heavy, so the render window is capped at 60 seconds to stay startup-friendly and AWS-cost safe.

## Inputs

- Creator video: MP4, MOV, or WEBM
- Background image: JPG, PNG, or WEBP
- Duration: up to 60 seconds only

The upload presign flow must allow both asset roles for this template:

- Primary media upload: `video/*`
- Background asset upload: `image/*`

## Controls

- Background fit: cover or contain
- Background zoom
- Background X/Y position
- Creator scale
- Creator X/Y position
- Reset adjustments

No reel topic/title field, subtitle language selector, timeline editor, rotation, animation controls, color grading, or AI prompt fields.

## Dashboard UX

- The form must stay within the mobile viewport after video/image upload; range sliders and error cards must never create horizontal page zoom/overflow.
- Uploaded video previews should use a contained phone-shaped frame for this template so vertical creator clips do not force a wide 16:9 mobile preview.
- Background fit controls, filenames, reset buttons, and render status labels must wrap or shrink inside the card on 320-390px mobile screens.
- Show only creator video upload, background image upload, live preview, transform controls, policy pills, credit notice, and render action.
- Background processor configuration errors should be concise and wrapped in the status card. Founder diagnostics may be shown, but they must be short enough not to widen the page.

## Render Props

```json
{
  "mediaSrc": "creator video URL",
  "creatorSrc": "creator video URL",
  "processedCreatorSrc": "optional transparent creator video URL",
  "backgroundImageSrc": "background image URL",
  "backgroundFit": "cover",
  "backgroundScale": 1,
  "backgroundX": 0,
  "backgroundY": 0,
  "creatorScale": 1,
  "creatorX": 0,
  "creatorY": 0
}
```

## Preview Rule

Dashboard preview applies CSS transforms instantly. It must not reprocess the video when the user changes position, scale, crop, or fit.

## Final Render Rule

Final export is processed by the high-quality Python/FFmpeg worker:

1. Download the uploaded creator video and background image from signed S3 URLs.
2. Remove the creator video background frame-by-frame with `rembg` human segmentation.
3. Composite the transparent creator layer over the uploaded background image using the same dashboard transform values.
4. Mux the original audio back with FFmpeg.
5. Upload the finished MP4 to temporary S3 storage and return it as the final output.

The worker preserves the uploaded video's source resolution and frame rate as much as possible. Output is H.264/AAC MP4 with `crf 18`, `yuv420p`, and `+faststart` for broad playback compatibility.

Worker runtime dependencies:

```bash
pip install rembg opencv-python pillow numpy onnxruntime
```

Optional environment variables:

- `CREATOR_BG_REPLACE_WORKER_URL` or `BACKGROUND_REPLACE_WORKER_URL` for production/Vercel. Without this, `/api/reels/jobs` returns `BACKGROUND_REPLACE_WORKER_NOT_CONFIGURED` before attempting the heavy render, and the dashboard must show a short user-facing unavailable message instead of raw worker setup text.
- `CREATOR_BG_REPLACE_WORKER_HEALTH_URL` or `BACKGROUND_REPLACE_WORKER_HEALTH_URL` for an optional worker health check. If this URL is configured and the worker fails health checks after retries, `/api/reels/jobs` returns `BACKGROUND_REPLACE_WORKER_NOT_READY`, logs the exact reason server-side, and the dashboard shows "Background Replace Video is temporarily unavailable. Please try again later or choose another video type." Technical diagnostics must stay collapsed under "View details" on mobile.
- `CREATOR_BG_REPLACE_WORKER_SECRET` or `RENDER_WORKER_SECRET` for the remote worker bearer token.
- `CREATOR_BG_REPLACE_PYTHON` or `PYTHON_PATH` for the Python executable.
- `FFMPEG_PATH` for a custom FFmpeg binary.

## Credit Rule

- Preview and adjustments: free
- Final export: 1 credit
