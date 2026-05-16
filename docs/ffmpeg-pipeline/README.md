# Itnavideo FFmpeg Pipeline

This folder defines how FFmpeg should behave on Itnavideo when a user uploads audio or video. The goal is simple: users should get a smooth video result with as few visible failures as possible.

Core rule:

- Do the minimum reliable render first.
- Add advanced effects only when they are safe.
- If an asset, caption layer, icon, image, or effect fails, fall back instead of stopping the user.

---

## User Upload Paths

### 1. Audio Upload To Video

User flow:

```text
Dashboard
-> Upload voice/audio
-> Optional visual upload
-> AI creates script, captions, scenes, SFX plan
-> FFmpeg renders 1080p portrait MP4
-> User gets video link
```

FFmpeg responsibility:

- Build a 1080x1920 vertical MP4.
- Use uploaded visuals when available.
- Use Google Drive/local background assets when available.
- Use text cards when visuals are missing.
- Mix voice, optional music, and safe SFX.
- Burn simple readable captions.
- Always prefer a completed MP4 over a perfect-but-failing render.

Main files:

- `app/api/render/route.ts`
- `services/rendering/ffmpegService.js`

### 2. Face Video Upload To Shorts

User flow:

```text
Dashboard
-> Face video upload
-> Pick Classic / Cinematic / Clean
-> Backend starts FFmpeg job
-> User watches progress
-> User gets processed video link
```

FFmpeg responsibility:

- Keep original camera audio.
- Scale/crop into 1080x1920 short-form output.
- Apply only stable style filters by default.
- Try captions, but retry without the fragile caption layer if needed.
- Keep progress updates moving so the user does not feel stuck.

Main files:

- `pages/api/process-talking-head.ts`
- `services/rendering/processShortsVideo.ts`
- `services/rendering/videoStyles.ts`
- `services/rendering/ffmpegJobStore.ts`

---

## Default Render Ladder

Every FFmpeg feature should follow this ladder:

1. **Reliable base video**
   - 1080x1920 MP4
   - H.264 video
   - AAC audio
   - `yuv420p`
   - `+faststart`

2. **Safe enhancements**
   - Simple scale/crop
   - Simple color/contrast/sharpening
   - Simple text cards
   - Simple progress/status updates

3. **Optional enhancements**
   - Captions
   - SFX
   - Overlays
   - Dynamic zoom
   - Background MP4s

4. **Fallback**
   - If optional enhancement fails, render the base video anyway.
   - If visual asset is missing, use text.
   - If caption generation fails, use safe placeholder captions or no captions.
   - If overlay/icon/image is missing, use text overlay/card.

---

## Non-Negotiables

- 1080p portrait only for now.
- Only 1080p appears in the active user flow.
- No user-facing raw FFmpeg errors.
- No render should fail only because a visual asset is missing.
- No render should fail only because captions are unavailable.
- No render should fail only because SFX is unavailable.
- Prefer shorter, stable FFmpeg graphs over clever filter chains.
- When in doubt, ship a clean MP4.

---

## Success Definition

A pipeline change is good only if:

- The user can upload audio/video and get a playable MP4.
- The output opens on mobile.
- The dashboard status does not get stuck.
- Missing assets produce text fallback.
- A failed optional layer retries automatically.
- The final error rate goes down, not up.
