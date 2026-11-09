# YouTube Subtitle Generator (`youtubeSubtitleGenerator`)

## 1. Scope & Overview

This studio creates burned-in broadcast subtitles for widescreen 16:9 YouTube videos. Designed for long-form creators, educational channels, podcast hosts, and essayists.

- **Dashboard Mode**: `youtubeSubtitleGenerator`
- **Studio Component**: `components/dashboard/YoutubeSubtitlesStudio.tsx`
- **Page Client**: `components/dashboard/subpages/YoutubeSubtitlesPageClient.tsx`
- **Credit Policy**: **FREE • 5 Daily Allowance (0 Credits)** (Account sign-in required)
- **Output Canvas**: **Strictly 16:9 Landscape Widescreen Only** (`1920×1080` @ 30 FPS MP4)
- **Maximum Duration**: **Up to 5 Minutes (300s)** per Rule 4.1 Master Video Duration Policy
- **Remotion Composition ID**: `YOUTUBE_SUBTITLE_GENERATOR`

---

## 2. Guided 4-Step Studio Architecture

The studio follows the unified 4-step guided workflow:

1. **Step 1: Upload (16:9 Video & Audio)**:
   - 16:9 Widescreen video/audio dropzone (MP4, MOV, WebM, MP3, WAV, M4A).
   - 3 Instant 1-Click Cloudinary sample videos (Podcast Interview, Cinematic Parallax, Creator Explainer).
   - Spoken narration editable transcript with save button.
   - Waveform and video duration detection.
2. **Step 2: Music (Soundtrack & Volume)**:
   - 14 AWS S3 background tracks with in-card audio auditioning (play/pause).
   - Volume slider with default 0% (Mute) to preserve clean spoken dialogue, with option to blend music at 12%.
3. **Step 3: Style (Subtitles & Safe-Zone)**:
   - 32 master kinetic caption styles with live interactive word previews and search filter.
   - YouTube 16:9 Scrubber-Safe Zone selector (`scrubber` [recommended], `standard`, `high`).
   - Font size picker (`small`, `medium`, `large`, `xlarge`).
   - Word casing toggle (`natural`, `uppercase`).
4. **Step 4: Preview (16:9 Cinema & Review)**:
   - 16:9 Cinema Widescreen Live Monitor with real video playback stream.
   - Burnt-in caption preview placed in the YouTube scrubber safe-zone.
   - Watermark remover toggle.

---

## 3. Product Behavior & Safe-Zones

- **YouTube Scrubber Safe-Zone**: Captions are elevated slightly above the bottom boundary to prevent YouTube's native scrubber bar, video title, and channel watermark from obscuring subtitle text.
- **Word Casing**: Natural sentence casing preserves punctuation, while ALL CAPS provides bold, viral punchiness.
