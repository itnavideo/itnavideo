# Long-form Captioned Video

## Purpose

Create a professional landscape captioned video from one uploaded source. This Video Type preserves the source video and original audio; it only adds timed captions.

## Product Contract

| Field | Value |
|---|---|
| Video Type Name | Long-form Captioned Video |
| Internal ID | `LONG_FORM_CAPTIONED_VIDEO` |
| Composition ID | `LONG-FORM-CAPTIONED-VIDEO` |
| Dashboard Mode | `longFormCaptionedVideo` |
| Category | Long Videos |
| Output | 1920×1080, 16:9 H.264/AAC MP4 |
| Maximum duration | 10 minutes / 600 seconds |
| Upload limit | 500 MB |

## Input and Output

- **Input:** one readable 16:9 landscape MP4, MOV, or WEBM video with clear speech. H.264 MP4 is recommended for the most reliable browser metadata check.
- **Output:** the full source video in 16:9 with timed captions; source audio stays at full volume.
- The renderer does not add AI visuals, b-roll, replacement narration, background music, or sound effects.
- Caption controls: style, position, font, size, text, highlight, and background colors.
- Dashboard styles are presented in a 16:9 laptop-frame preview for Long-form only; it shows six professional landscape-safe choices (Studio Clean, Cinematic, Marker Highlight, Midnight, Glass Blur, Metallic Gradient). The laptop frame is dashboard UI only and is never included in the rendered MP4.

## Caption Policy

1. Groq Whisper transcribes the current upload directly; no planning clip and no cached transcript are used.
2. English speech produces English captions.
3. Hindi/Hinglish speech produces clean Roman Hinglish captions; Devanagari is not shown.
4. No OpenAI, Google, AWS, or Azure translation fallback is used for this workflow.
5. Failed or empty transcription blocks rendering with a clear error.

## Credits and Failure Behavior

- Long-form Captioned Video costs **1 credit per started minute** for all 10 minutes.
- Examples: 1 minute = 1 credit; 5 minutes = 5 credits; 5:01 = 6 credits; 10 minutes = 10 credits.
- A render reserves its server-calculated duration cost after Lambda accepts it, settles after a successful MP4, and releases it after a terminal render failure. Stale reservations stop counting after 24 hours.

## QA Checklist

- [ ] Reject non-video files, unreadable metadata, non-16:9 uploads, files over 500 MB, and videos over 10 minutes.
- [ ] Verify source video and audio are preserved at 1920×1080.
- [ ] Verify captions are readable at the selected position/style.
- [ ] Verify English and Roman Hinglish output follows the current upload.
- [ ] Verify 1, 5, 6, and 10-minute pricing boundaries.
- [ ] Verify failed/done-without-output renders release their reserved usage.
- [ ] Visually render a representative 16:9 frame before deployment.
