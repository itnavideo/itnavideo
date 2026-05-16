# FFmpeg Pipeline Checklist

Use this checklist before changing render behavior.

---

## Before Coding

- [ ] Read `docs/FFMPEG_STATUS.md`.
- [ ] Read `docs/ffmpeg-pipeline/README.md`.
- [ ] Decide whether the change belongs to:
  - `ffmpegService.js` for audio-to-video.
  - `processShortsVideo.ts` for face-video/talking-head shorts.
  - `videoStyles.ts` for visual styles.
  - `ffmpegJobStore.ts` and `/api/ffmpeg/status` for status/progress.
- [ ] Confirm the change keeps 1080p portrait as the active target.

---

## Safe Render Defaults

- [ ] Output is 1080x1920.
- [ ] Output uses H.264.
- [ ] Output uses AAC audio.
- [ ] Output uses `yuv420p`.
- [ ] Output uses `+faststart`.
- [ ] Missing visuals become text cards.
- [ ] Missing icons/images become text overlays.
- [ ] Missing SFX/music does not fail the render.
- [ ] Caption failure has a fallback path.

---

## User Experience

- [ ] User sees progress, not raw errors.
- [ ] User gets a playable MP4 when the base render succeeds.
- [ ] Retry messages are calm and short.
- [ ] Dashboard job status reaches `ready` after success.
- [ ] Dashboard job status reaches `error` only after fallback paths fail.

---

## Minimum Test Set

- [ ] Audio upload with no visual.
- [ ] Audio upload with one image.
- [ ] Audio upload with one video.
- [ ] Face video upload.
- [ ] Missing/invalid remote asset URL.
- [ ] Caption/transcription unavailable.
- [ ] No-audio or low-audio input if the changed path touches audio.
- [ ] Mobile playback check.

---

## Do Not Add

- [ ] A second render endpoint for the same flow.
- [ ] A second status polling endpoint.
- [ ] Non-1080p active UI options.
- [ ] Complex filters without fallback.
- [ ] User-facing FFmpeg stderr.
