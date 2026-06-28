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

## Output: 1080×1920 (9:16), up to 60s

## Key Rules
- User's video is the FULL content (not background)
- AI adds typography overlays at key moments only
- Text style should match modern creator reels: bold white lower-third words, cyan/blue emphasized words, occasional large muted keyword/stat text
- No extra media added — the video IS the reel
- No b-roll scenes, image inserts, quote cards, stock visuals, stickers, or clips
- No progress bar or decorative UI
- Premium editing feel without manual work
- Audio-only NOT supported (needs video)

## Layout Rules

- Full-screen creator video, `object-fit: cover`
- Text overlays sit over the video, usually lower-left/lower-center with safe margins
- Typography uses short phrases from the transcript, not paragraph blocks
- Highlight one important word per phrase with blue/cyan accent
- Creator face must remain visible; overlays should not cover the face for the entire video

## Scene Types

- `creator_face`: creator video plus timed transcript typography
- `typography`: punchy phrase overlay over the creator video
- `key_point`: emphasized keyword/stat plus short supporting phrase over the creator video

Do not use `broll`, `quote`, `transition`, `assetTimeline`, `imageSources`, or any generated visual layer for this template.
