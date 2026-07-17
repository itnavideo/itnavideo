# Typography Video

## Basic Information

| Field | Value |
|-------|-------|
| Video Type Name | Typography Video |
| Internal ID | `TYPOGRAPHY_VIDEO` |
| Composition ID | `TYPOGRAPHY-VIDEO` |
| Dashboard Mode | `typographyVideo` |
| Category | Creator (Shorts) |

## Purpose

Turn a talking-head video into a premium creator typography reel — big bold keyword/phrase overlays synced to speech, with optional small speech captions below. Targets premium/corporate/luxury/finance/motivation content.

## Output

- 1080×1920 (9:16), up to 90 seconds
- Uploaded video stays full-screen with a per-style cinematic color grade, vignette, grain, subtle Ken Burns
- Big headline keywords appear/exit with elegant editorial animations (no cheap glitch/shake)
- Optional bottom speech captions via the shared SubtitleRenderer

## Controls

- **Typography style** — 13 premium styles (Chrome, Neon Blue, Fire, Ice White, Gold, Purple, Red Bold, Matrix, Cyan, Pink Neon, Yellow, Sunset, Outline). Each pairs a luxury display font with a matching color grade + accent.
- **Speech captions** — on/off toggle. Turn off for clean typography-only output.
- **Caption style + position** — when captions are on.

## Keyword Planner (`services/ai/typographyPlanner.ts`)

Deterministic — no paid AI. Picks 1 keyword every ~3-6s from the transcript:

- Money/number detection → huge headline at top
- Power-word detection → punchy center phrase
- Otherwise → short meaningful phrase (stop-words removed)
- **English + Roman Hinglish** power-words and stop-words are supported, so Hinglish content (paisa, mehnat, safalta, kabhi, sirf, etc.) produces meaningful overlays instead of generic filler.
- Breathable pacing (min gap), gentle fill to a target count.

## Keyword ↔ Caption Coordination

- The headline is auto-nudged out of the caption's vertical band so the two never physically overlap (based on `captionPosition`).
- Captions can be turned off entirely for clean typography.

## Style Notes

- Headline fonts are loaded via `@remotion/google-fonts` (`resolveFont`) so they render correctly on Lambda.
- Outline styles get a subtle dark readability plate behind the text so they stay legible on busy video.

## Fallback Rules

| Scenario | Behavior |
|----------|----------|
| No speech detected | Show video with no keyword overlays |
| Transcription fails | Show error — don't render silently |
| Video too long (>90s) | Trim to 90s |
| Long headline word | Auto-scaled down to fit safe frame |

## What to Avoid

- No cheap glitch/shake on headline entrances
- No paid AI planning (deterministic only)
- No Devanagari/Urdu script in visible text (Roman Hinglish only)
