# Itnavideo Docs Index

Use this as the study map before opening implementation files.

## Start Here

- [Root README](../README.md): product overview, active architecture, env keys, deploy checklist.
- [Project Structure Notes](PROJECT_STRUCTURE_NOTES.md): folder/file map and where to edit next time.
- [Production Guardrails](ffmpeg-pipeline/PRODUCTION_GUARDRAILS.md): the 720p fail-safe pipeline contract.
- [FFmpeg Status](FFMPEG_STATUS.md): current render features, known work, and roadmap.
- [Storage Strategy](STORAGE_STRATEGY.md): where user uploads, reusable assets, and final renders live.

## Video Pipeline

- [Pipeline README](ffmpeg-pipeline/README.md): render principles and non-negotiables.
- [Pipeline Map](ffmpeg-pipeline/PIPELINE_MAP.md): request flow and main files.
- [Error Policy](ffmpeg-pipeline/ERROR_POLICY.md): fallback and timeout rules.
- [Checklist](ffmpeg-pipeline/CHECKLIST.md): minimum checks before changing render behavior.
- [Pro Template System](ffmpeg-pipeline/PRO_TEMPLATE_SYSTEM.md): dynamic template renderer notes.

## Main Implementation Files

- `app/dashboard/page.tsx`: dashboard create modal, browser preflight, project list.
- `app/api/jobs/start/route.ts`: server preflight and Render worker dispatch.
- `app/api/admin/free-tier/route.ts`: emergency free-tier render valve for abuse or queue spikes.
- `app/careers/page.tsx`: careers/talent network page.
- `app/api/careers/apply/route.ts`: job application capture endpoint.
- `components/dashboard/VideoUploadStatus.tsx`: live FFmpeg status polling.
- `lib/videoPipelineConfig.ts`: Next.js/API video pipeline env contract.
- `render-worker/videoPipelineConfig.mjs`: Render worker video pipeline env contract.
- `render-worker/pipelineGuards.mjs`: timeline normalization, text sanitization, render reports.
- `render-worker/server.mjs`: Express worker, render queue, status updates, Cloudinary upload.
- `render-worker/ffmpegRenderer.mjs`: FFmpeg render, asset handling, fallback render, process cleanup.
- `scripts/validate-video-env.mjs`: prebuild env contract validation.
- `scripts/smoke-video-pipeline.mjs`: one-command render smoke test.

## Useful Commands

```bash
npm run test:smoke
npm run build
npm run render-worker
```

`npm run test:smoke` is sandbox-only and writes to `.sandbox/smoke/`.

## Current Output Contract

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
TEMP_ASSET_RETENTION_HOURS=24
FREE_TIER_RENDER_ENABLED=1
FREE_TIER_QUEUE_LIMIT=50
```
