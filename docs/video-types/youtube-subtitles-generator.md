# YouTube Subtitles Generator — Studio Specification

## Overview

The **YouTube Subtitles Generator** (`youtubeSubtitleGenerator`) burns broadcast-grade 16:9 landscape subtitles directly into YouTube videos, podcasts, and video essays (`1920×1080` @ 30 FPS MP4) up to 5 minutes long. Designed for long-form creators who want high-contrast, branded subtitles that bypass generic YouTube closed captions, it features signature Western creator typography presets (Ali Abdaal, Vox Documentary, Huberman Lab) and calibrated YouTube player scrubber safe zones.

- **Primary Purpose**: Burn broadcast-quality 16:9 landscape subtitles into YouTube videos and podcasts.
- **Target Audience**: YouTube video essayists, podcasters, interviewers, educators, and enterprise marketing teams.
- **Expected Output**: 1080p Full HD (`1920×1080`) 30 FPS widescreen MP4 video.

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

- **16:9 Landscape Widescreen Only**: Built strictly for YouTube long-form desktop and smart TV viewing (`1920×1080` Full HD) with zero vertical cropping.
- **YouTube Scrubber Safe Zones**: Calibrated bottom margins (84px web / 120px smart TVs) guarantee that burned-in subtitles never collide with YouTube's red progress bar, volume controls, or channel watermarks.
- **Signature Creator Presets**: Authentic typography presets modeled after top creators: Ali Abdaal Clean Sans, Vox Documentary Serif, Huberman Lecture Focus, and High-Contrast Box.
- **Spoken Narration Editorial Transcript**: Full in-studio text editor allowing creators to review, correct typos, fix proper nouns, or adjust Hinglish spellings before rendering.
- **Custom Font Size & Word Casing**: Adjust typography scale (`small`, `medium`, `large`, `xlarge`) and toggle between natural sentence casing and bold uppercase.
- **Pure Dialogue Protection**: Background music defaults to 0% (Mute) to preserve clean spoken dialogue, with an optional 12% blend.

---

## 2. User Workflow

The studio follows a guided 4-step workflow:

1. **Step 1: Upload (16:9 Video or Audio File)**:
   - Creator drops or selects a 16:9 video (`.mp4`, `.mov`, `.webm`) or audio track (`.mp3`, `.wav`, `.m4a`).
   - Files up to 5 minutes (300 seconds) are supported.
   - Cloud transcribes speech and displays the live editorial transcript for verification.
2. **Step 2: Music & Audio Settings**:
   - Optional selection of 14 curated AWS S3 background tracks.
   - Volume slider defaults to 0% (Mute) to preserve crystal-clear speech.
3. **Step 3: Caption Style & Safe-Zone Alignment**:
   - Creator selects from 32 animated typography presets with live word playback loops.
   - Configures safe zone mode (`Scrubber Safe` [recommended], `Standard`, `High`).
4. **Step 4: Live Cinema Preview & Render**:
   - 16:9 Cinema live monitor previews the video stream with burned-in captions in the scrubber safe zone.
   - Creator clicks **Generate 16:9 Subtitles Free** to execute AWS Lambda cloud rendering.

---

## 3. UI/UX Design and Components

- **Studio Route**: `/dashboard/youtube-subtitles`
- **Frontend Studio Component**: `components/dashboard/YoutubeSubtitlesStudio.tsx`
- **Subpage Client**: `components/dashboard/subpages/YoutubeSubtitlesPageClient.tsx`
- **Public SEO Landing Page**: `/youtube-subtitles-generator` (`app/youtube-subtitles-generator/page.tsx`)
- **Design Structure**: Pure White canvas (`#FFFFFF`) with fine borders (`#E2E8F0`) and responsive 3-row layout (`Stepper Header`, `Preview Work Area`, `Sticky Action Bar`).

---

## 4. Colors, Typography and Design Tokens

- **Canvas Background**: Pure White (`#FFFFFF`) with subtle slate background accents (`#F8FAFC`).
- **Primary Brand Accent**: Sunset Orange (`#FF5722` / `#F97316`) for active controls and primary CTA buttons.
- **Secondary Tone**: Crimson Red (`#DC2626`) for YouTube badge indicators.
- **Typography**: Inter / System Sans-serif stack (`font-sans`).

---

## 5. Technical Implementation

- **Video Type ID**: `youtubeSubtitleGenerator` / `YOUTUBE_SUBTITLE_GENERATOR`
- **Remotion Composition ID**: `AUTO-CAPTION-GENERATOR-LANDSCAPE` (`1920×1080` @ 30 FPS)
- **Remotion Template Directory**: `remotion/templates/AUTO_CAPTION_GENERATOR/` (Landscape composition)
- **Speech Extraction**: Extracted 16kHz mono audio processed via Groq Whisper Cloud API.
- **Transcriber Fallback**: Google Gemini 2.0 Flash (`asia-south1`).
- **Render Engine**: AWS Lambda running Remotion cloud workers in `us-east-1`.

---

## 6. Business Logic, Duration and Credit Rules

- **Aspect Ratio**: Strictly 16:9 Widescreen Only (`1920×1080`).
- **Maximum Output Duration**: Strictly **5 Minutes Max (300 seconds / 9,000 frames @ 30 FPS)**.
- **Credit Billing**: **FREE • 5 Daily Videos (0 Credits)** with user sign-in. Paid plan exports are 100% watermark-free.
- **Draft Preview**: 100% Free interactive browser preview before rendering.

---

## 7. Error Handling and Edge Cases

- **No Speech Detected**: Flags `NO_SPEECH_DETECTED`; prompts user to upload audio with clear speech without deducting credits.
- **Scrubber Collision**: Automatic safety clamping forces subtitle bottom offset to at least 84px above viewport base.
- **Render Interruption**: Credits are automatically refunded if cloud rendering encounters an AWS Lambda timeout.

---

## 8. Testing and Quality Assurance

- **Typecheck Verification**: `npx tsc --noEmit` verifies all subtitle props and composition interfaces.
- **Scrubber Clearance Test**: Confirm that subtitles stay above the 84px bottom safe line on desktop browsers.
- **Word Timing Accuracy**: Confirm that word highlighting syncs with audio speech within 1 frame (33ms).

---

## 9. Developer Notes and Guardrails

- **Zero Local Rendering (Rule 0)**: Do not run local Remotion renders on developer machines; all rendering executes on AWS Lambda.
- **Safe Zone Offset**: Subtitle offsets must reference `lib/constants/videoSafeZones.ts`. Never use hardcoded pixel coordinates in template components.
