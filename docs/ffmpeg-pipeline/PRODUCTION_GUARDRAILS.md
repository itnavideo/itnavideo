# Production Render Guardrails

Users do not care which internal step failed. The product promise is: upload audio or video, get a playable 720p MP4, or get a clear retry state quickly.

## Standard Output

- Free/trial pipeline target: `720p`.
- Vertical short-form output: `720x1280`.
- Horizontal output, when enabled: `1280x720`.
- 1080p should stay a paid/premium profile later, not the default stability path.

## Failure Ladder

Every render job should move through this ladder:

1. Accept job only after required IDs, source URL, Supabase write, and worker URL are available.
2. Wake or dispatch to the render worker with a short timeout.
3. Render the full planned video first.
4. If the planned render fails or times out, render a safe base MP4 from the same source.
5. Upload the final MP4.
6. Write `ready` with `videoUrl`, or write `error` with a calm product message.

No job should remain in `queued`, `processing`, or `rendering` forever.

## Five Stage Pipeline Contract

### Stage 1: Source Intake And Transcription

- Accept only when `userId`, `jobId`, and source URL exist.
- Reject free/trial uploads over 50MB or 5 minutes before the render starts.
- Normalize source audio to 16kHz mono WAV when possible; if normalization fails, continue with the original audio instead of crashing.
- Sanitize user-facing text before it reaches FFmpeg.
- If transcription or word timestamps are unavailable, continue with generated scene captions instead of failing the render.

### Stage 2: Asset Mapping

- Validate each visual source before making it an FFmpeg input.
- Missing, blocked, unsupported, or failed assets become text cards.
- Non-renderable source types such as SVG, JSON, Lottie, or graphics metadata do not enter FFmpeg.

### Stage 3: Timeline Config

- Normalize the timeline before render.
- Fix invalid, negative, or overlapping scene times.
- Clamp duration, caption count, scene count, and text length from the shared env contract, especially `MAX_AUDIO_DURATION_SEC`.
- Do not keep hidden 60s or 90s caps in UI, planning routes, or worker code when the active pipeline contract says 5 minutes.
- Wrap captions at safe mobile widths. Subtitle lines should stay around 20 characters, and very long words must be split before FFmpeg drawtext receives them.
- Start visual asset prefetch as soon as the timeline has candidate sources. Prefetch failures should not block the render; they should fall back to the normal asset resolver.
- Generate at least one fallback scene and one fallback caption when AI output is missing.

### Stage 4: FFmpeg Render

- Try the planned render first.
- Limit primary render time with `RENDER_PRIMARY_TIMEOUT_SEC`.
- If primary render fails or times out, retry a safe base MP4 from the same source.
- Parse FFmpeg progress (`frame=`, `fps=`, `time=`, `speed=`) and write live job progress so the dashboard can show a moving status bar.
- Scale CRF by motion complexity: static/text-heavy videos can use higher CRF for smaller files, while video-heavy scenes use lower CRF for quality.
- Escape FFmpeg text dynamically.
- Run render jobs through a queue. Default worker concurrency is `MAX_CONCURRENT_RENDERS=1`.
- Protect the queue with the emergency free-tier valve. Free users are paused when `FREE_TIER_RENDER_ENABLED=0` or worker queue size rises above `FREE_TIER_QUEUE_LIMIT`; paid tiers continue through the normal render path.

### Stage 5: Export And Final Check

- Probe the output before upload.
- Reject missing, tiny, audio-only, or corrupt MP4 files.
- Upload only validated MP4 files.
- Write a render report under `processed_assets/render-report-[jobId].json`.
- End in `ready` with `videoUrl` or `error` with a calm retry state.

## Known Failure Classes

- Worker cold start or worker URL misconfiguration.
- Supabase status write failure.
- Cloudinary upload or final save failure.
- Audio/video source URL cannot be downloaded.
- FFmpeg complex filter graph hangs or fails.
- Optional assets, captions, Drive files, icons, or effects are missing.

## Required Fallbacks

- Missing visuals become text cards.
- Caption failure does not fail the whole video.
- Asset failure does not fail the whole video.
- Assets that repeatedly fail are added to `blacklisted_assets` and skipped before future renders.
- Primary FFmpeg failure retries a safe base MP4.
- Fallbacks, timeouts, and recovered render failures can notify `RENDER_TELEMETRY_WEBHOOK_URL`.
- Stale dashboard jobs become `Render worker needs retry`.
- Every render writes a compact stage report for debugging without exposing secrets.

## Required Environment

- `RENDER_BACKEND_URL`
- `RENDER_WORKER_SECRET`
- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `VIDEO_QUALITY_PRESET`
- `TARGET_WIDTH`
- `TARGET_HEIGHT`
- `PREMIUM_VIDEO_QUALITY_PRESET`
- `PREMIUM_TARGET_WIDTH`
- `PREMIUM_TARGET_HEIGHT`
- `MAX_AUDIO_SIZE_MB`
- `MAX_AUDIO_DURATION_SEC`
- `MAX_CONCURRENT_RENDERS`
- `RENDER_TIMEOUT_SEC`
- `RENDER_PRIMARY_TIMEOUT_SEC`
- `AUDIO_NORMALIZE_TIMEOUT_MS`
- `TEMP_ASSET_RETENTION_HOURS`
- `RENDER_TELEMETRY_WEBHOOK_URL` optional
- `DISABLE_RENDER_TELEMETRY` optional
- `BLACKLIST_ASSET_TTL_HOURS`
- `BLACKLIST_STORE_RAW_URL`
- `FREE_TIER_RENDER_ENABLED`
- `FREE_TIER_QUEUE_LIMIT`
- `NEXT_PUBLIC_VIDEO_QUALITY_PRESET`
- `NEXT_PUBLIC_TARGET_WIDTH`
- `NEXT_PUBLIC_TARGET_HEIGHT`
- `NEXT_PUBLIC_PREMIUM_VIDEO_QUALITY_PRESET`
- `NEXT_PUBLIC_PREMIUM_TARGET_WIDTH`
- `NEXT_PUBLIC_PREMIUM_TARGET_HEIGHT`
- `NEXT_PUBLIC_MAX_AUDIO_SIZE_MB`
- `NEXT_PUBLIC_MAX_AUDIO_DURATION_SEC`

Recommended defaults:

```text
VIDEO_QUALITY_PRESET=720p
TARGET_WIDTH=720
TARGET_HEIGHT=1280
PREMIUM_VIDEO_QUALITY_PRESET=1080p
PREMIUM_TARGET_WIDTH=1080
PREMIUM_TARGET_HEIGHT=1920
MAX_AUDIO_SIZE_MB=50
MAX_AUDIO_DURATION_SEC=300
MAX_CONCURRENT_RENDERS=1
RENDER_TIMEOUT_SEC=240
RENDER_PRIMARY_TIMEOUT_SEC=120
AUDIO_NORMALIZE_TIMEOUT_MS=60000
TEMP_ASSET_RETENTION_HOURS=24
FFMPEG_DEFAULT_CRF=26
FFMPEG_STATIC_CRF=30
FFMPEG_MIXED_CRF=28
FFMPEG_MOTION_CRF=23
RENDER_TELEMETRY_WEBHOOK_URL=
DISABLE_RENDER_TELEMETRY=0
BLACKLIST_ASSET_TTL_HOURS=168
BLACKLIST_STORE_RAW_URL=0
FREE_TIER_RENDER_ENABLED=1
FREE_TIER_QUEUE_LIMIT=50

NEXT_PUBLIC_VIDEO_QUALITY_PRESET=720p
NEXT_PUBLIC_TARGET_WIDTH=720
NEXT_PUBLIC_TARGET_HEIGHT=1280
NEXT_PUBLIC_PREMIUM_VIDEO_QUALITY_PRESET=1080p
NEXT_PUBLIC_PREMIUM_TARGET_WIDTH=1080
NEXT_PUBLIC_PREMIUM_TARGET_HEIGHT=1920
NEXT_PUBLIC_MAX_AUDIO_SIZE_MB=50
NEXT_PUBLIC_MAX_AUDIO_DURATION_SEC=300
```

The primary timeout should be shorter than the total timeout so the fallback renderer still has time to produce a playable MP4.
