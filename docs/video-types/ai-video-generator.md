# AI Video Generator — Studio Specification

## Overview

The **AI Video Generator** is Itnavideo's flagship prompt-to-production 16:9 cinema widescreen video studio. It allows creators to input a creative concept prompt, optionally attach audio voiceovers or scene media, and produce complete, broadcast-quality 1080p widescreen videos with narrative scene pacing, automated stock B-roll matching, kinetic typography, and auto-ducked music.

- **Primary Purpose**: Transform ideas, scripts, and voiceovers into cinematic 16:9 YouTube videos without manual video editing.
- **Target Audience**: YouTube automation channels, documentary storytellers, educators, and enterprise marketing teams.
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

- **Unified Creative Launchpad**: Central prompt input box with an optional media attachment chip (`+ Add Media`). Creators can generate from prompt alone or ground the video with voiceover audio and images.
- **"✨ Enhance Idea" Prompt Expander**: Uses Gemini 2.0 Flash to expand simple one-line concepts into multi-scene cinematic production briefs.
- **CapCut-Style Multitrack Timeline**: 4-track timeline editor (Video Scenes, Kinetic Captions, Voiceover Waveform, Background Music) with Split, Duplicate, Delete, Replace, and Zoom controls.
- **Scene-Level Independent Regeneration**: Creators can regenerate or swap any single scene's visual asset without resetting or re-rendering the rest of the project.
- **Edit by Script**: Direct text-based script editing automatically updates caption timing and scene durations.
- **100% Free Live Preview**: Interactive browser preview and timeline scrubbing cost zero credits.

---

## 2. User Workflow

The studio follows a structured 4-step guided workflow:

1. **Step 1: Concept Launchpad & Media (`Concept`)**:
   - Creator enters a concept prompt or selects from proven starter templates.
   - Clicks `[✨ Enhance Idea]` to automatically enrich lighting, camera angles, and pacing.
   - Optionally attaches voiceover audio (`.mp3`, `.wav`) or custom scene photos.
   - Selects target duration (30s, 60s, 90s, 2m, 3m, 5m).
2. **Step 2: Music & Audio Design (`Music`)**:
   - Auditions 14 curated AWS S3 background tracks across Lo-Fi, Piano, Upbeat, and Cinematic styles.
   - Configures background music volume with auto-ducking to maintain vocal clarity.
3. **Step 3: Visual Aesthetic & Subtitle Style (`Style`)**:
   - Chooses from 32 animated typography styles with category filtering and live preview loops.
   - Selects visual aesthetic preset (`Cinematic Modern`, `Documentary Realism`, `Clean Flat Vector`, `Vibrant Pop`, `Minimalist Elegant`).
4. **Step 4: 16:9 Cinema Studio & CapCut Timeline (`Studio`)**:
   - Full-width 16:9 cinema live monitor displays the real video stream with Ken Burns camera motion.
   - Multitrack timeline enables precision split, duration trimming, and photo swaps.
   - Creator clicks **Render 1080p Video** to submit the final project to AWS Lambda.

---

## 3. UI/UX Design and Components

- **Studio Route**: `/dashboard/ai-video-generator`
- **Frontend Studio Component**: `components/dashboard/AiVideoGeneratorStudio.tsx`
- **Public SEO Landing Page**: `/ai-video-generator` (`app/ai-video-generator/page.tsx`)
- **Design Structure**: Pure White canvas (`#FFFFFF`) with fine borders (`#E2E8F0`) and responsive 3-row layout (`Stepper Header`, `Timeline Work Area`, `Sticky Action Bar`).
- **Timeline Toolbar**: Full-width editing toolbar featuring `[Split at Playhead]`, `[Replace Photo]`, `[Duplicate Clip]`, `[Delete Clip]`, and `[Zoom 1x-3x]`.

---

## 4. Colors, Typography and Design Tokens

- **Canvas Background**: Pure White (`#FFFFFF`) with subtle slate background accents (`#F8FAFC`).
- **Primary Brand Accent**: Sunset Orange (`#FF5722` / `#F97316`) for active tabs, selected cards, and primary CTA buttons.
- **Secondary Tone**: Sky Blue (`#0284C7`) for timeline video tracks and scene indicators.
- **Typography**: Inter / System Sans-serif stack (`font-sans`) for clean legibility.

---

## 5. Technical Implementation

- **Video Type ID**: `aiVideoGenerator` / `AI_VIDEO_GENERATOR`
- **Remotion Composition ID**: `AI-VIDEO-GENERATOR` (`1920×1080` @ 30 FPS)
- **Remotion Template Directory**: `remotion/templates/AI_VIDEO_GENERATOR/`
- **AI Scene Planning Engine**: Serverless Google Cloud Gemini 2.0 Flash (`asia-south1`) parses prompt and audio semantics into a structured `scenes` JSON array.
- **Speech Transcription**: Groq Whisper Cloud API (Fallback: Gemini 2.0 Flash).
- **Render Engine**: AWS Lambda running Remotion cloud workers in `us-east-1`.

---

## 6. Business Logic, Duration and Credit Rules

- **Aspect Ratio**: Strictly 16:9 Widescreen Only (`1920×1080`).
- **Maximum Output Duration**: Strictly **5 Minutes Max (300 seconds / 9,000 frames @ 30 FPS)**.
- **Credit Billing**: **1 Min = 1 Credit** ($\lceil\text{durationSeconds} / 60\rceil$: 1m=1 Cr, 2m=2 Cr, 3m=3 Cr, 4m=4 Cr, 5m=5 Cr max).
- **Draft Preview**: 100% Free (zero credit deduction for timeline editing or preview playback).
- **Credit Reservation**: Credits are deducted only when the user clicks Render. If rendering fails, credits are 100% automatically refunded.

---

## 7. Error Handling and Edge Cases

- **Scene Generation Failure**: If AI scene generation encounters a network error, a deterministic storyboard fallback creates standard scene beats from transcript timing.
- **Missing Stock Media**: Visual asset loaders fall back to curated high-resolution brand visuals stored in AWS S3 and Cloudinary.
- **Lambda Render Timeout**: Frame ranges are clamped to 9,000 frames max to prevent out-of-memory errors on Lambda workers.

---

## 8. Testing and Quality Assurance

- **Typecheck Verification**: `npx tsc --noEmit` verifies all timeline props and inspector interfaces.
- **Scene Continuity Test**: Verify that consecutive scenes maintain continuous audio waveforms and seamless cross-dissolve transitions.
- **Credit Boundary Test**: Confirm that a 61-second video charges exactly 2 credits, while a 300-second video charges 5 credits.

---

## 9. Developer Notes and Guardrails

- **Zero Local Rendering (Rule 0)**: Do not run local Remotion renders on developer machines; all video generation executes via AWS Lambda.
- **Timeline State Isolation**: Timeline modifications update local React state optimistically before triggering backend render jobs.
