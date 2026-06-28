# Creator Background Replace

| Field | Value |
|---|---|
| Video Type Name | Creator Background Replace |
| Internal ID | `CREATOR_BACKGROUND_REPLACE` |
| Composition ID | `CREATOR-BACKGROUND-REPLACE` |
| Dashboard Mode | `creatorBackgroundReplace` |
| Route | `/templates/creator-background-replace` |

## Purpose

Replace a creator video's background with one user-uploaded background image. The template is a simple creator utility: upload a creator video, upload a background image, adjust fit/zoom/position, then export.

This is a shorts/reels-only feature. Do not use it for long videos. Background removal is compute-heavy, so the render window is capped at 60 seconds to stay startup-friendly and AWS-cost safe.

## Inputs

- Creator video: MP4, MOV, or WEBM
- Background image: JPG, PNG, or WEBP
- Duration: up to 60 seconds only

## Controls

- Background fit: cover or contain
- Background zoom
- Background X/Y position
- Creator scale
- Creator X/Y position
- Reset adjustments

No timeline editor, rotation, animation controls, color grading, or AI prompt fields.

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

- `CREATOR_BG_REPLACE_PYTHON` or `PYTHON_PATH` for the Python executable.
- `FFMPEG_PATH` for a custom FFmpeg binary.

## Credit Rule

- Preview and adjustments: free
- Final export: 1 credit
