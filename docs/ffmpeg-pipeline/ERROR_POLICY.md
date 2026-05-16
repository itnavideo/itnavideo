# FFmpeg Error Policy

This policy exists because repeated render errors make users lose trust. FFmpeg should feel quiet, stable, and boring in production.

---

## User-Facing Rule

Never show raw FFmpeg stderr to users.

Use calm product messages:

- `Preparing your video...`
- `Rendering your video...`
- `Retrying with a safer render path...`
- `Video ready`
- `Render took too long. Please try a shorter upload.`

Keep technical details in server logs only.

---

## Retry Rules

### Captions

Try in this order:

1. ASS/SRT subtitle burn.
2. Simple `drawtext` caption fallback.
3. Render without captions.

Do not fail the whole job only because captions failed.

### Visuals

Try in this order:

1. User-uploaded visual.
2. Google Drive matching asset.
3. Local `public/asset-library` fallback.
4. Text scene/card.
5. Solid-color background with readable text.

Do not fail the whole job only because an image, icon, screenshot, or background is missing.

### SFX And Music

Try in this order:

1. Matching SFX/music asset.
2. Lower-density SFX plan.
3. Voice-only audio.

Do not fail the whole job only because SFX or music is missing.

### Style Filters

Try in this order:

1. Requested style.
2. Clean style.
3. Base scale/crop render.

Do not fail the whole job only because a visual style filter is too heavy.

---

## Timeout Rules

- Audio-to-video render timeout: keep the 720p primary timeout short, then fall back to the safe base render.
- Face video render timeout: prefer progress polling and fallback retries over long silent waits.
- If a job times out, delete incomplete output if possible.
- Status should move to `error` only after all safe fallback paths fail.

---

## Logging Rules

Server logs should include:

- job id
- user id when available
- input type
- chosen style
- render path attempted
- fallback path attempted
- final output path
- final output size
- trimmed FFmpeg stderr for debugging

Server logs should not include:

- API secrets
- signed upload credentials
- full private tokens
- unnecessary user personal data

---

## Release Gate

Before shipping FFmpeg changes:

- Test one audio upload.
- Test one face-video upload.
- Test missing visual asset fallback.
- Test missing caption fallback.
- Confirm output MP4 is non-empty.
- Confirm `/api/ffmpeg/status` reaches `ready` or a clear final `error`.
