# Video Type: Split-Screen Explainer (9:16 Vertical)

## Overview & Concept
Split-Screen Explainer is an engaging 9:16 vertical short-form video mode featuring a true **50/50 dual-zone layout**:
- **Top 50% (`1080×960`)**: **Dynamic Explanation Stage** — Powered by the Faceless modular layer engines:
  - Procedural **SVG Illustrations & Vector Diagrams**
  - Kinetic **Typography & Marker Tape Highlighting**
  - Metric **Gauges, Speedometers & Percentage Rings**
  - **2.5D Isometric** platforms and device mockups
  - **Audio-Reactive Waveforms** pulsing in sync with creator speech
  - **Explanatory Callouts, Pointers & Speech Bubbles**
  - Edge-clamped Ken Burns cycling images/videos with shape clipping masks
- **Bottom 50% (`1080×960`)**: **Creator Video Zone** — Displays the creator's talking-head video or camera presentation clip with dynamic +8% camera punch-in every 4.5 seconds to retain viewer attention.
- **Center Divider**: Flame Orange gradient bar with a floating topic badge.
- **Unified Visual Design System**: 6 Master Themes (*Modern SaaS, Bold Kinetic, Premium Finance, Educational, Editorial Minimal, Futuristic Tech*) coordinating colors, divider bars, charts, and captions across both zones.
- **Floating Subtitles**: 32 Master YouTube & TikTok animated caption presets with perfect word synchronization.
- **Background Score**: 14 AWS S3 curated BGM tracks (ducked to a default 12% volume) or custom audio upload + subtle transition SFX.
- **Guided 4-Step Stepper**: Standardized across Itnavideo (`Upload`, `Music`, `Style`, `Preview`) with live 9:16 phone simulator.

---

## Technical Specifications
- **Aspect Ratio**: `9:16` Vertical (`1080×1920` at 30 FPS).
- **Max Duration**: Up to 90 seconds (2,700 frames max).
- **Credit Cost**: **1 Credit** flat per render.
- **Composition ID**: `SPLIT-SCREEN-EXPLAINER`.
- **Template Name**: `SPLIT_SCREEN_EXPLAINER`.
- **Mode Key**: `splitScreenExplainer`.
- **Background Aesthetic**: Clean solid white background (`#FAFAFA`) with subtle dot matrix.

---

## Standard 4-Step Guided Stepper Pipeline

### Step 1: Upload (Dual 50/50 Ingest)
- **Bottom 50% Creator Video**: Talking-head MP4/MOV clip with speech.
- **Top 50% Explanation Visuals**: Multi-file upload of supporting images and/or B-roll clips.
- **Topic Title Badge**: Dynamic flame orange pill displayed at the 50/50 split boundary.

### Step 2: Music (Audio & Sound Design)
- **14 Curated AWS S3 Tracks**: Ambient, lo-fi, cinematic, tech, corporate, and upbeat options.
- **In-Card Audition Player**: Real-time play/pause preview before selecting.
- **BGM Volume Slider**: Default 12% (`0.12`), customizable 0% to 50% ducking.
- **Custom BGM Upload**: Support for custom MP3/WAV/AAC files.
- **Dynamic Transition SFX**: Subtle whoosh and pop audio cues on top-zone visual cuts.

### Step 3: Style (32 Kinetic Caption Styles & Editorial Transcript)
- **32 Master Presets**: Glowing viral text, MrBeast boxed, Hormozi lime punch, Vox documentary serif, cyberpunk cyan, karaoke pulse, and more.
- **Editorial Transcript Editor**: Live editable transcript synced with Groq Whisper timestamps for instant typo corrections.

### Step 4: Preview (Interactive 9:16 Phone Simulator)
- **Dual-Zone Phone Frame**: Real-time interactive simulation showing the top 50% explanation visuals and bottom 50% creator talking-head.
- **Live Kinetic Subtitle Demonstration**: In-simulator preview of selected typography style.
- **Single-Click Cloud Launch**: Instant submission to AWS Lambda 1080p rendering pipeline.

---

## Cloud Rendering Engine
- **Transcription Engine**: Groq Whisper Cloud API (Fallback: Google Gemini 2.0 Flash in `asia-south1`).
- **Render Infrastructure**: AWS Lambda Remotion Cloud cluster (Zero local compute on developer machine).
- **Output**: 1080×1920 30 FPS MP4 with burned-in kinetic typography and balanced stereo audio mix.
