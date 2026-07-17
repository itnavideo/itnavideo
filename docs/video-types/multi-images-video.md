# Multi Images Video

## Purpose and flow
Multi Images Video is built for stories, motivation, and information reels: upload one source video (the narration), add a title, and upload two to eight supporting images. The video remains the audio source. The narration is transcribed with Groq so the **images change on speech beats** and **captions** stay in sync — the images are no longer split by a blind even timer.

## Narration sync (2026)
- On render, the uploaded video is transcribed with Groq (English / Roman Hinglish; no paid translation).
- `planMultiImageTimings` distributes the images across the narration: each image change is snapped to the nearest natural speech pause (caption boundary) to an even split, and passed to the composition as `imageTimings`. Image order = the creator's chosen order = first→last spoken beat.
- Groq captions are cleaned and passed as `captions`; the composition renders a synced caption bar over the lower stage.
- **Graceful fallback:** if transcription fails, the render still succeeds using an even split with no captions (logged as `transcriptSource: 'not-required'`). It never blocks the render.
- Duration + trim come from the speech-aware render window (capped at 90s); `mediaTrimStartSeconds` skips leading silence and keeps audio, images, and captions aligned.

## Composition
- The source video has a restrained top hero treatment; the title sits between the video and the image story; captions render near the bottom of the image stage.
- The image stage preserves every image’s full composition with `contain`. A blurred version of the same image fills unused space, so landscape, portrait, square, product, document, and text-heavy photos do not receive hard crops or black gaps.
- The slideshow uses `imageTimings` when valid (narration-synced); otherwise it falls back to an even split across the duration, including a full hold on the final image. Adjacent images crossfade with source-seeded Ken Burns motion (stronger in 2026 for more life).
- Fonts are self-hosted (Montserrat title, Inter captions) via `resolveFont` — Lambda-safe. The old bare `Inter, system-ui` string fell back to system fonts on Lambda.
- Titles are normalized, use responsive two-line typography, and truncate with an ellipsis rather than clipping.

## Dashboard controls
- Images can be **reordered** (↑/↓) with a visible order number, so the creator can match image order to what they say first→last and avoid a mismatched (wasted) render.
- A CapCut-style sticky **live preview** (`components/preview/MultiImagesPreview.tsx`) shows the video, title, image order, and motion before render. Captions and narration-synced timing are applied at render time (browser preview uses an even split).

## Render safeguards
- API accepts exactly two through eight images before starting a paid render.
- The composition defensively limits render-time image sources to eight.
- `imageTimings` are validated in the composition (must match image count and be ordered) before use, else even split.

## Visual QA
Check 2, 5, and 8 images; portrait, landscape, square, text-heavy, and product images; a long title; and short/long source videos. Verify: images change on speech pauses (not a blind timer), captions stay in sync with the narration, reordering images changes their on-screen order, the last image holds through the final frame, images stay uncropped, crossfades do not darken the stage, and source audio remains primary. Confirm a transcription failure still renders (even split, no captions).
