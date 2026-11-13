# Long-form Captioned Video (YouTube Subtitles Generator)

## Purpose

Create a professional landscape captioned video from one uploaded source. This Video Type preserves the source video and original audio; it adds precision timed captions and optional AI watermark removal.

## Product Contract

| Field | Value |
|---|---|
| Video Type Name | YouTube Subtitle Generator (Long-form Captioned Video) |
| Internal ID | `YOUTUBE_SUBTITLE_GENERATOR` / `LONG_FORM_CAPTIONED_VIDEO` |
| Composition ID | `AUTO-CAPTION-GENERATOR` / `LONG-FORM-CAPTIONED-VIDEO` |
| Dashboard Mode | `youtubeSubtitleGenerator` |
| Category | 16:9 Long-Form Videos |
| Output | 1920×1080, 16:9 H.264/AAC MP4 |
| Maximum duration | 5 minutes (300 seconds) |
| Credit Pricing | Flat 2 Credits / Video |
| Upload limit | 500 MB |

## Input and Output

- **Input:** one readable 16:9 landscape MP4, MOV, or WEBM video with clear speech.
- **Output:** the full source video in 16:9 with timed subtitles; source audio stays at full volume.
- **Auto-Remove AI Watermark:** Built-in toggle to crop corner watermarks from Google Veo 3, Sora, Runway, etc.
- **Caption Library (40 Curated 16:9 Broadcast Styles):**
  - **Cinematic & Documentary (7):** Clean Documentary, Netflix Yellow, Vox Explainer, Blue Muse Serif, Cinema Gold, Whisper Documentary, Devane Luxury Serif.
  - **Podcast & Interview (7):** Lex Fridman Clean, Podcast Editorial, Huberman Science, Diary of a CEO, Joe Rogan Bold, Deep Discussion, Studio Master.
  - **Viral & Retention (7):** MrBeast Punch, Hormozi Bold Punch, Headliner Orange, Pop Word Viral, Slam Headline, Submagic Glow, Kinetic Wave.
  - **Minimal & Clean (7):** Amber Minimal, Ali Abdaal Pill, Subtitle Classic, Glass Blur Pill, White Pill Highlight, Underline Track, Minimal Ice Blue.
  - **Educational & Tech (6):** Kurzgesagt Pill, Tech Modern (MKBHD), Chalk Monospace, Doctor Emerald, Terminal Typewriter, Paper Typewriter.
  - **Finance & Luxury (6):** Gold Centre Luxury, Editorial Dark Gold, Metallic Gloss 3D, Luxury Dual-Script, Bloomberg Financial, Floating Champagne.

## Caption Policy

1. Groq Whisper transcribes the current upload directly; fallback to Gemini if rate-limited.
2. English speech produces English captions.
3. Hindi/Hinglish speech produces clean Roman Hinglish captions; Devanagari is not shown.
4. YouTube scrubber safe zone clearance is supported (standard, scrubber, high).

## Credits and Failure Behavior

- Flat **2 Credits** per video regardless of duration (1m–5m).
