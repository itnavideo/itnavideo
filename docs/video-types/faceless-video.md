# Faceless Video Generator — Studio Specification

## Overview

The **Faceless Video Generator** (`facelessVideo`) turns voiceover narration audio or text scripts into complete 16:9 Full HD widescreen documentary videos (`1920×1080` @ 30 FPS MP4) up to 5 minutes long. Designed for automated YouTube cash-cow channels, educational essayists, and documentary storytelling creators, it pairs spoken narration with curated cinematic stock footage, procedural SVG illustrations, studio vignette backgrounds, kinetic typography, and auto-ducked music.

- **Primary Purpose**: Build monetized, high-production YouTube channels without appearing on camera or recording video.
- **Target Audience**: YouTube automation creators, video essayists, educational channels, and digital media agencies.
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

- **16:9 Cinema Widescreen Only**: Built strictly for YouTube desktop and smart TV viewing (`1920×1080` Full HD) with zero vertical cropping.
- **Transcript-Grounded Scene Planning**: Speech AI parses narration into semantic scene beats every 3 to 6 seconds to eliminate visual fatigue.
- **Procedural SVG Diagrams & Data Layouts**: Allocations, comparisons, metric counters, sequence diagrams, concept maps, and time-series growth curves grounded in the transcript.
- **Curated Cloud Stock Footage**: Contextual B-roll visuals matched to spoken keywords with smooth Ken Burns camera easing.
- **Regional Audio to English Visuals**: Speech in Hindi or regional languages is semantically translated into English keywords to match international stock libraries while rendering clean Roman Hinglish subtitles.
- **Automated Sound Design**: Dynamic background music auto-ducking (ducks to 12% during speech) and synchronized sound effect accents on scene transitions.

---

## 2. User Workflow

The studio follows a guided 4-step workflow:

1. **Step 1: Upload (Voiceover Audio & Topic Script)**:
   - Creator uploads narration audio (`.mp3`, `.wav`, `.m4a`) or enters a script title.
   - Files up to 5 minutes (300 seconds) are supported.
   - Cloud transcribes speech and displays the live editorial transcript for review and spelling corrections.
2. **Step 2: Music & Audio Design**:
   - Creator chooses from 14 curated AWS S3 production tracks across Cinematic, Lo-Fi, Piano, and Upbeat moods.
   - Adjusts background music volume with auto-ducking.
3. **Step 3: Subtitle Style & Visual Pacing**:
   - Selects from 32 animated typography presets with live word playback loops.
   - Configures motion pacing and scene transition styles.
4. **Step 4: Live Cinema Preview & Render**:
   - 16:9 Cinema live monitor previews the video stream, SVG diagrams, and subtitles.
   - Creator clicks **Render 1080p Video** to execute AWS Lambda cloud rendering.

---

## 3. UI/UX Design and Components

- **Studio Route**: `/dashboard/faceless-video`
- **Frontend Studio Component**: `components/dashboard/FacelessVideoStudio.tsx`
- **Public SEO Landing Page**: `/faceless-video` (`app/faceless-video/page.tsx`)
- **Design Structure**: Pure White canvas (`#FFFFFF`) with fine borders (`#E2E8F0`) and responsive 3-row layout (`Stepper Header`, `Preview Work Area`, `Sticky Action Bar`).

---

## 4. Colors, Typography and Design Tokens

- **Canvas Background**: Pure White (`#FFFFFF`) with subtle slate background accents (`#F8FAFC`).
- **Primary Brand Accent**: Sunset Orange (`#FF5722` / `#F97316`) for active controls and primary CTA buttons.
- **Accent Tones**: Deep Slate (`#0F172A`) for high-contrast cards and TV safe indicators.
- **Typography**: Inter / System Sans-serif stack (`font-sans`).

---

## 5. Technical Implementation

- **Video Type ID**: `facelessVideo` / `FACELESS_VIDEO`
- **Remotion Composition ID**: `FACELESS-VIDEO` (`1920×1080` @ 30 FPS)
- **Remotion Template Directory**: `remotion/templates/FACELESS_VIDEO/`
- **AI Planning Engine**: Google Cloud Gemini 2.0 Flash (`asia-south1`) parses transcript into structured scenes with SVG primitives.
- **Speech Transcription**: Groq Whisper Cloud API (Fallback: Gemini 2.0 Flash).
- **Render Engine**: AWS Lambda running Remotion cloud workers in `us-east-1`.

---

## 6. Business Logic, Duration and Credit Rules

- **Aspect Ratio**: Strictly 16:9 Widescreen Only (`1920×1080`).
- **Maximum Output Duration**: Strictly **5 Minutes Max (300 seconds / 9,000 frames @ 30 FPS)**.
- **Credit Billing**: **1 Min = 1 Credit** ($\lceil\text{durationSeconds} / 60\rceil$: 1m=1, 2m=2, 3m=3, 4m=4, 5m=5 Credits Max).
- **Draft Preview**: 100% Free interactive browser preview before rendering.

---

## 7. Error Handling and Edge Cases

- **No Speech Detected**: Flags `NO_SPEECH_DETECTED`; prompts user to upload audio with clear speech without deducting credits.
- **AI Planning Malformed JSON**: Deterministic storyboard fallback creates standard scene beats and layout cards from transcript timing.
- **Lambda Render Timeout**: Frame ranges are clamped to 9,000 frames max to prevent out-of-memory errors on Lambda workers.

---

## 8. Testing and Quality Assurance

- **Typecheck Verification**: `npx tsc --noEmit` verifies all template props and scene interfaces.
- **Audio Ducking Verification**: Verify background music attenuates to 12% volume during speech activity.
- **Credit Boundary Test**: Confirm that a 125-second video charges exactly 3 credits, while a 300-second video charges 5 credits.

---

## 9. Developer Notes and Guardrails

- **Zero Local Rendering (Rule 0)**: Do not run local Remotion renders on developer machines; all video generation executes via AWS Lambda.
- **Strict Separation from Shorts**: 16:9 Faceless Video is independent from 9:16 Faceless Shorts. Do not combine their templates or compositions.
