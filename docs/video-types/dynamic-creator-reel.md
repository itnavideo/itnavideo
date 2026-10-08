# Reference Note

This is a detailed Video Type spec. Start with `docs/ITNAVIDEO_MASTER_DOC.md` for the latest source of truth, then use this file for Dynamic Creator Reel implementation details.

# Dynamic Creator Reel

## Basic Information

| Field | Value |
|-------|-------|
| Video Type Name | Dynamic Creator Reel |
| Internal ID | `DYNAMIC_CREATOR_REEL` |
| Composition ID | `DYNAMIC-CREATOR-REEL` |
| Dashboard Mode | `dynamicCreator` |
| Category | Creator |

## Purpose

AI turns a talking-head creator video into a typography-led reel. The creator video stays as the full-screen visual while bold text, emphasized words, and short key-point overlays carry the edit.

## Required User Inputs

| Input | Type | Required |
|-------|------|----------|
| Video | Video (must have face/talking) | Yes |

## Subtitle / Text Language Rule

- Do not show subtitle language dropdowns for this Video Type.
- Dynamic transcript typography should follow the uploaded video's spoken language as produced by the supported Groq transcription pipeline.
- If the user uploads English speech, on-video transcript text should be English.
- If the user uploads Hindi/Urdu/Hinglish speech, on-video transcript text should follow the supported Roman Hindi/Urdu/Hinglish output.
- Do not promise translation/conversion to another language from the dashboard.

## Output: 1080×1920 (9:16), up to 60s

## Key Rules
- User's video is the FULL content (not background)
- AI adds typography overlays at key moments only
- Text style should match modern creator reels: bold white lower-third words, cyan/blue emphasized words, occasional large muted keyword/stat text
- Transcript text language follows the uploaded speech/Groq output; there is no user-facing subtitle language selector
- No extra media added — the video IS the reel
- No b-roll scenes, image inserts, quote cards, stock visuals, stickers, or clips
- No progress bar or decorative UI
- Premium editing feel without manual work
- Audio-only NOT supported (needs video)
- Automatic `styleLock` and sparse diegetic `soundCues` are supported for premium creator-style pacing

## Layout Rules

- Full-screen creator video, `object-fit: cover`
- Text overlays sit over the video, usually lower-left/lower-center with safe margins
- Typography uses short phrases from the transcript, not paragraph blocks
- Highlight one important word per phrase with blue/cyan accent
- Creator face must remain visible; overlays should not cover the face for the entire video

## Premium Style Lock

Dynamic Creator Reel uses the creator-energetic style lock by default. The route passes `styleLock` and `soundCues` so typography pops, key-point takeovers, and outro moments can get subtle UI/pop/whoosh cues while the uploaded creator video remains the full-screen content.

The premium visual layer may add contrast grading, tiny camera energy, grain, and vignette. Motion should still protect the creator's face and avoid making the uploaded video feel over-processed.

## Scene Types

- `creator_face`: creator video plus timed transcript typography
- `typography`: punchy phrase overlay over the creator video
- `key_point`: emphasized keyword/stat plus short supporting phrase over the creator video

Do not use `broll`, `quote`, `transition`, `assetTimeline`, `imageSources`, or any generated visual layer for this template.

Sound cues must not become a separate content layer. They are only timing polish for visible typography or motion events.
