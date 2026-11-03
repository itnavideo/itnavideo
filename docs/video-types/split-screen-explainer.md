# Video Type: Split-Screen Explainer (9:16 Vertical)

## Overview & Concept
Split-Screen Explainer is an engaging 9:16 vertical short-form video mode featuring a true **50/50 dual-zone layout**:
- **Top 50% (`1080×960`)**: **Explanation Visuals Zone** — Displays multiple cycling images or video clips (with subtle Ken Burns animation or video playback) explaining the topic.
- **Bottom 50% (`1080×960`)**: **Creator Video Zone** — Displays the creator's talking-head video or camera presentation clip.
- **Center Divider**: Flame Orange gradient bar with a floating topic badge.
- **Floating Subtitles**: 20 Master YouTube animated caption presets with perfect word synchronization.
- **Background Score**: AWS S3 curated BGM tracks (ducked to a default 12% volume) or custom audio upload + subtle transition SFX.

---

## Technical Specifications
- **Aspect Ratio**: `9:16` Vertical (`1080×1920` at 30 FPS).
- **Max Duration**: Up to 90 seconds (2,700 frames).
- **Credit Cost**: **1 Credit** flat per render.
- **Composition ID**: `SPLIT-SCREEN-EXPLAINER`.
- **Template Name**: `SPLIT_SCREEN_EXPLAINER`.
- **Mode Key**: `splitScreenExplainer`.
- **Background Aesthetic**: Clean solid white background (`#FAFAFA`) with subtle dot matrix.

---

## Pipeline & Architecture
1. **User Uploads**:
   - Bottom 50%: Creator talking head video (MP4/MOV).
   - Top 50%: Multiple explanation images and/or video clips.
   - Optional: Custom background music MP3/WAV.
2. **Audio & Speech Alignment**:
   - Groq Whisper neural speech transcription extracts millisecond-accurate timestamps from the creator video audio.
   - Editorial transcript editor allows users to correct typos or proper nouns before rendering.
3. **Pacing, Motion Physics & Sound Design**:
   - **Creator Camera Punch-In**: Alternates between 1.0x and 1.08x every 4.5 seconds (135 frames) with cubic-bezier spring easing to eliminate talking-head fatigue.
   - **Top Explanation Transitions**: Synchronized whoosh sound effects (`whoosh.wav`) and Ken Burns zoom on each visual cut.
   - **Mobile Safe-Zones**: 100px right-side clearance and centered vertical layout to prevent collision with TikTok/Reels UI overlays.
4. **Cloud Rendering**:
   - Rendered on **AWS Lambda** (Remotion) with accurate frame ranges based on creator video duration.

---

## 20 Master Caption Styles
Includes 20 high-retention caption styles such as:
1. `glow-viral` (Flame Glow Yellow)
2. `mrbeast` (MrBeast Yellow Box)
3. `netflix-yellow` (Cinema Gold Subtitle)
4. `hormozi-bold` (Hormozi Lime Punch)
5. `neon-city` (Cyberpunk Electric Cyan)
6. `daily-look` (Sunny Vlog Rounded)
7. `blockbuster` (Blockbuster Flame)
8. `handwriting-pop` (Organic Script Pop)
9. `vox-docu` (Vox Documentary Serif)
10. `minimal-clean` (Minimal Ice Blue)
11. `cyber-ops` (Radar Military Green)
12. `premium-gold` (Wealth Metallic Gold)
13. `word-highlight` (Flame Word Pop)
14. `classic-clean` (Timeless White Cinema)
15. `documentary-serif` (Classical Book Serif)
16. `karaoke-glow` (Karaoke Amber Pulse)
17. `box-pill` (Dark Slate Pill Box)
18. `neon-cyber` (Magenta Cyber Pulse)
19. `minimal-lower-third` (Scrubber Lower Third)
20. `editorial-book` (Author Emerald Accent)

---

## Audio & SFX Details
- **Default BGM Volume**: `12%` (`0.12`), customizable via slider from 0% to 40%.
- **S3 BGM Catalog**: 13+ production tracks (Parasail, 19th Floor, Dutty Vibe, Book Rental, Crimson Fly, etc.) with in-dashboard audio preview.
- **Custom BGM**: Direct upload of MP3/WAV tracks.
- **SFX**: Subtle pop/whoosh sound effects enabled by default on visual transitions.

---

## Compulsory Live Preview Gate
Before the "Render Cloud Video" button is enabled, the user must:
1. Upload Creator Video (Bottom 50%).
2. Upload at least 1 Explanation Visual (Top 50%).
3. Confirm review check in the Editorial & Preview tab.

