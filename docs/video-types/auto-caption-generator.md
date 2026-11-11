# Auto Caption Generator — Studio Specification

## Overview

The **Auto Caption Generator** is Itnavideo's dedicated 9:16 vertical short-form captioning engine engineered for Instagram Reels, YouTube Shorts, and TikTok. It transcribes spoken dialogue using the cloud-based Groq Whisper API, computes millisecond-accurate word timestamps (30 FPS / ~33ms resolution), and renders dynamic, word-highlighted karaoke subtitles with zero manual keyframing.

- **Primary Purpose**: Add high-retention animated subtitles to talking-head videos and speech recordings in seconds.
- **Target Audience**: Short-form creators, video podcasters, educators, coaches, and founders publishing vertical reels.
- **Expected Output**: 1080p Full HD (`1080×1920`) 30 FPS vertical MP4 video with burned-in subtitles, plus optional `.SRT` and `.VTT` subtitle file downloads.

---

## Table of Contents

1. [Overview](#overview)
2. [Features and Capabilities](#features-and-capabilities)
3. [User Workflow](#user-workflow)
4. [UI/UX Design and Components](#uiux-design-and-components)
5. [Colors, Typography and Design Tokens](#colors-typography-and-design-tokens)
6. [Technical Implementation](#technical-implementation)
7. [Business Logic, Duration and Credit Rules](#business-logic-duration-and-credit-rules)
8. [Error Handling and Edge Cases](#error-handling-and-edge-cases)
9. [Testing and Quality Assurance](#testing-and-quality-assurance)
10. [Developer Notes and Guardrails](#developer-notes-and-guardrails)

---

## 1. Features and Capabilities

- **Millisecond-Accurate Speech Transcription**: Uses Groq Whisper Cloud API to detect spoken words and timestamp every syllable to the exact frame.
- **Spoken Narration Editorial Transcript**: Full in-studio text editor allowing creators to review, correct typos, fix proper nouns, or adjust Hinglish spellings before rendering.
- **32 Master Kinetic Caption Themes**: High-contrast animated styles including Pop Word, Hormozi Viral, MrBeast Box Highlight, Neon Glow, and Clean Minimal.
- **Social Media Safe Zones**: Subtitles are positioned with strict safety margins (100px bottom, 80px right) to avoid collisions with TikTok and Reels UI buttons, likes, comments, and account tags.
- **Audio-Only Mode**: Accepts raw audio recordings (`.mp3`, `.wav`, `.m4a`) and automatically pairs them with an obsidian dark studio canvas and dynamic center audio waveform.
- **Dual Export**: Export burned-in 1080p MP4 video or download standalone `.SRT` and `.VTT` subtitle files for native platform caption upload.

---

## 2. User Workflow

The studio implements a unified 4-step guided stepper workflow:

1. **Step 1: Upload (Video or Audio File)**:
   - Creator drops or selects a video (`.mp4`, `.mov`, `.webm`) or audio track (`.mp3`, `.wav`, `.m4a`).
   - Files longer than 90 seconds are automatically accepted; the engine extracts strictly the first 90 seconds (0:00 to 1:30) for processing.
   - The cloud transcribes speech and displays the live editorial transcript.
2. **Step 2: Music & Audio Settings**:
   - Optional selection of 14 curated AWS S3 background tracks with in-card audio auditioning.
   - Smart audio ducking default (ducks background music to 12% during speech).
3. **Step 3: Caption Style & Positioning**:
   - Creator selects from 32 animated typography presets with live word playback loops.
   - Adjusts font size (`small`, `medium`, `large`), word casing (`natural`, `uppercase`), and vertical alignment (`bottom`, `center`, `top`).
4. **Step 4: Preview & Cloud Render**:
   - Interactive 9:16 smartphone simulator displays the real video stream with synchronized subtitle playback.
   - Creator reviews the preview and clicks **Render 1080p Reel** to launch AWS Lambda cloud rendering.

---

## 3. UI/UX Design and Components

- **Studio Route**: `/dashboard/auto-caption`
- **Frontend Studio Component**: `components/dashboard/AutoCaptionStudio.tsx`
- **Public SEO Landing Page**: `/auto-caption-generator` (`app/auto-caption-generator/page.tsx`)
- **Shell Layout**: Pure White canvas (`#FFFFFF`) with fine slate borders (`#E2E8F0`) and responsive 3-row layout (`Stepper Header`, `Scrollable Work Area`, `Sticky Action Bar`).
- **Mobile Responsiveness**: On mobile screens (<768px), stepper tabs collapse to an active step pill indicator, with full touch-friendly button targets (minimum 44px height).

---

## 4. Colors, Typography and Design Tokens

- **Canvas Background**: Pure White (`#FFFFFF`) with subtle slate background accents (`#F8FAFC`).
- **Primary Brand Accent**: Sunset Orange (`#FF5722` / `#F97316`) for active tabs, checkmarks, and primary CTA buttons.
- **Typography**: Inter / System Sans-serif stack (`font-sans`) for clean legibility.
- **Subtitle Highlighting**: High-contrast active-word colors (Sunset Yellow `#FBBF24`, Neon Lime `#84CC16`, Crisp White `#FFFFFF`, Emerald Mint `#34D399`).

---

## 5. Technical Implementation

- **Video Type ID**: `autoCaption` / `AUTO_CAPTION_GENERATOR`
- **Remotion Composition ID**: `AUTO_CAPTION_GENERATOR` (`1080×1920` @ 30 FPS)
- **Remotion Template Directory**: `remotion/templates/AUTO_CAPTION_GENERATOR/`
- **Speech Extraction**: Raw video is stripped to 16kHz mono audio (`audio/mp3`) via Web Audio API or server probe before sending to Groq Whisper Cloud API.
- **Transcriber Fallback**: If Groq Whisper encounters rate limits or errors, the system automatically falls back to Google Gemini 2.0 Flash (`asia-south1`).
- **Render Engine**: AWS Lambda running Remotion 30 FPS cloud workers in `us-east-1`.

---

## 6. Business Logic, Duration and Credit Rules

- **Aspect Ratio**: Strictly 9:16 Vertical (`1080×1920`).
- **Maximum Output Duration**: Strictly **90 Seconds (90s / 2,700 frames @ 30 FPS)**.
- **Upload Duration Handling**: Files longer than 90s are accepted without error; the system automatically trims and uses the first 90 seconds.
- **Credit Billing**: **FREE • 5 Daily Videos (0 Credits)** with user sign-in. Paid plan exports are 100% watermark-free.
- **Failed Render Protection**: If cloud rendering fails, reserved quota or credits are automatically restored via `releaseReservedRenderUsageFromServer`.

---

## 7. Error Handling and Edge Cases

- **Silent / No Speech Audio**: Flags `NO_SPEECH_DETECTED`; alerts the user to upload a clip with audible dialogue and does not deduct credits.
- **Corrupt File Upload**: Client-side metadata probe inspects video codecs before cloud submission.
- **Network Interruption**: Resumable multipart upload to AWS S3 ensures large uploads recover automatically on slow mobile connections.

---

## 8. Testing and Quality Assurance

- **Verification Script**: Run `npx tsc --noEmit` to ensure type integrity across all caption interfaces.
- **Frame Sync Test**: Verify that word highlighting transitions within 1 frame (33ms) of spoken vocal onset.
- **Safe-Zone Check**: Verify that subtitle bounding boxes maintain a 100px bottom margin on mobile phone viewports.

---

## 9. Developer Notes and Guardrails

- **Zero Local Rendering (Rule 0)**: Never execute local Remotion renders on developer machines; cloud rendering takes place exclusively on AWS Lambda.
- **Single Source of Truth**: All subtitle styling tokens originate from `constants/captionStyles.ts` and `remotion/templates/AUTO_CAPTION_GENERATOR/`. Do not hardcode custom inline font sizes.
