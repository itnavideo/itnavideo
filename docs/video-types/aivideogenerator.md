# AI Video Generator Studio Specification

## 1. Overview & Positioning
The **AI Video Generator** is the flagship prompt-to-production video studio in Itnavideo. It provides a complete end-to-end creative journey where users can type any creative concept, optionally attach their own audio, images, or video clips, and produce a broadcast-quality 16:9 video with scenes, script narration, visual pacing, animated kinetic typography, and background music.

In accordance with the consensus of top AI video architectures (Gemini, ChatGPT, and Claude AI):
1. **Unified Creative Launchpad**: Prompt input is the central hero. Asset upload is an optional attachment chip (`+ Add Media / Attach Assets`). Users can generate in 5 seconds with zero assets.
2. **"✨ Enhance Idea" Prompt Expander**: Automatically expands 1-line beginner prompts into cinematic multi-scene production briefs.
3. **100% Free Live Preview & Timeline Editing**: Draft generation, scene playback, script editing, and timeline adjustments cost 0 credits.
4. **Scene-Level Independent Regeneration & Locking**: Users can regenerate or replace any individual shot without resetting or re-rendering the rest of the project.
5. **CapCut-Style Multitrack Timeline Studio**: Full-width 4-track timeline (Video, Kinetic Captions, Voiceover Waveform, Background Music) with Split, Duplicate, Delete, Replace, and Zoom controls.
6. **"Edit by Script"**: Creators can edit the narration script directly like a text document to update captions and scene pacing.
7. **Transparent Cloud Render**: High-definition 1080p MP4 rendered via AWS Lambda only when the user clicks "Render 1080p Video".

---

## 2. Core Specifications & Constraints

| Parameter | Specification |
| :--- | :--- |
| **Studio ID** | `aiVideoGenerator` / `AI_VIDEO_GENERATOR` |
| **Aspect Ratio** | **16:9 Widescreen Only** (1920×1080 Full HD) |
| **Max Video Duration** | **Up to 5 Minutes (300 seconds)** |
| **Credit Rate** | **1 Min = 1 Credit** (1m = 1 Cr, 2m = 2 Cr, 3m = 3 Cr, 4m = 4 Cr, 5m = 5 Cr max) |
| **Draft Preview** | **100% Free** (Zero credit deduction for preview & timeline editing) |
| **Primary Speech & Transcription** | Groq Whisper Cloud API (Fallback: Gemini 2.0 Flash `asia-south1`) |
| **AI Director Planning** | Serverless Google Cloud Gemini 2.0 Flash |
| **Render Engine** | AWS Lambda (Remotion Cloud) |
| **Media Assets & Storage** | AWS S3 (`itnavideo-media-assets`) & Cloudinary (`itnavideo12345`) |

---

## 3. User Journey & Studio Stages

### Stage 1: The Creative Launchpad (Unified Starting Screen)
- **Central Prompt Box**: Large auto-expanding textarea with placeholder examples (Documentaries, Tech explainers, Product launches, Storytelling, Case studies).
- **[✨ Enhance Idea] Button**: Sends the prompt to Gemini to enrich lighting, camera angles, pacing, and mood.
- **Optional Media Attachment Zone**: `[+ Attach Media]` chip supporting audio voiceovers (`.mp3`, `.wav`, `.m4a`), images (`.jpg`, `.png`, `.webp`), and B-roll clips (`.mp4`).
- **Quick Configuration Chips**:
  - `[⏱️ Target Duration: 30s | 60s | 90s | 3m | 5m]`
  - `[🎨 Visual Style: Cinematic | Modern Flat | Vibrant Pop | Documentary | Minimal]`
  - `[💬 Caption Preset: Pop Word | Hormozi Viral | Box Highlight | Neon Glow | Classic]`
  - `[🎵 Music Mood: Calm Lofi | Inspiring Piano | Upbeat Beats | Epic Cinematic | Mute]`
- **Inspirational Template Prompts**: 1-click starter prompts for common creator niches.

### Stage 2: AI Creative Director Processing
1. Prompt parsed by Gemini 2.0 Flash.
2. Generates scene breakdown (scene beats, duration, camera motion, visual descriptions).
3. If no audio was uploaded: creates structured voiceover narration script.
4. Matches high-quality visuals from Cloudinary/S3 asset library or user uploads.
5. Pairs with recommended background music and animated kinetic subtitle style.

### Stage 3: CapCut-Style Multitrack Timeline Studio (Free Editing)
- **16:9 Cinema Monitor**: Responsive player with live kinetic subtitles, Ken Burns camera motion, and timecode scrubber.
- **Multitrack Timeline (4 Tracks)**:
  - Track 1: Video & Visual Scenes (thumbnails, drag duration handles, lock $🔒$ toggle).
  - Track 2: Animated Kinetic Captions (word-level sync with highlight colors).
  - Track 3: Voiceover Audio Track (waveform visualization with speech scrubbing).
  - Track 4: Background Music Track (volume mixer, fade in/out).
- **CapCut Toolbar**: `Split at Playhead`, `Replace Shot`, `Duplicate Scene`, `Delete`, `Regenerate Scene`, `Undo/Redo`, `Zoom In/Out (1x - 3x)`.
- **Properties Inspector Drawer (3 Modes)**:
  - `Visuals`: Scene duration stepper, Ken Burns vs Static cut, photo swap, scene prompt.
  - `Captions & Script`: Edit script by sentence, change kinetic font style (32 presets), text search.
  - `Audio & Music`: BGM track picker (14 curated tracks), voiceover volume vs BGM volume balance.

### Stage 4: Cloud Export Finish Line
- Shows exact duration, credit cost (*1 Min = 1 Credit*), and resolution (1080p Full HD MP4).
- AWS Lambda serverless render execution.
- 48-hour presigned cloud download URL with QR code mobile transfer.

