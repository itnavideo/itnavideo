# Image to Video AI — Studio Specification

## Overview

The **Image to Video AI** (`imageToVideoAi`) studio transforms voiceover narration audio, script stories, and photo collections into cinematic 16:9 Full HD (`1920×1080` @ 30 FPS MP4) widescreen documentary videos up to 5 minutes long. It incorporates smooth Ken Burns camera pan-and-zoom motion curves, cross-dissolve scene transitions, timed 2.5D frosted subtitles, and automatic background audio ducking.

- **Primary Purpose**: Transform still photographs and voiceovers into cinematic documentary videos.
- **Target Audience**: Documentary creators, biographical storytellers, travel vloggers, and digital educators.
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

- **16:9 Cinema Widescreen Only**: Built strictly for YouTube long-form desktop and smart TV viewing (`1920×1080` Full HD) with zero vertical cropping.
- **Smooth Ken Burns Motion Curves**: Dynamic pan-and-zoom camera easing brings static images to life with cinematic pacing.
- **Bulk Photo Ingestion**: Supports drag-and-drop uploads for up to 100 images with instant optimistic previews and reordering handles.
- **CapCut-Style Multitrack Timeline**: Full timeline editor enabling creators to split scenes at playhead, replace individual photos, duplicate clips, and adjust clip durations.
- **Automated Speech Synchronization**: Speech AI paces each photo to match spoken sentence breaks and story milestones.
- **Timed 2.5D Frosted Subtitles**: Frosted glass backing cards ensure 100% subtitle readability regardless of background photo brightness.

---

## 2. User Workflow

The studio follows a guided 4-step workflow:

1. **Step 1: Upload (Voiceover Audio & Story Photos)**:
   - Creator uploads narration audio (`.mp3`, `.wav`, `.m4a`) up to 5 minutes (300 seconds).
   - Bulk uploads scene photos (`.jpg`, `.png`, `.webp`).
   - Cloud transcribes speech and displays the live editorial transcript for verification.
2. **Step 2: Music & Audio Design**:
   - Creator selects background music from 14 curated AWS S3 tracks across Ambient, Cinematic, Lo-Fi, and Acoustic genres.
   - Adjusts volume level with automatic audio ducking.
3. **Step 3: Caption Style & Camera Motion**:
   - Chooses from 32 animated typography presets with live word playback loops.
   - Selects camera motion preset (`Ken Burns Slow Zoom` vs `Static Cut`) and framing (`16:9 Cover` vs `Blur-Fill Letterbox`).
4. **Step 4: CapCut Multitrack Studio & Cloud Render**:
   - 16:9 Cinema live monitor previews the real video stream with Ken Burns motion.
   - Creator adjusts photo positions on the multitrack timeline and clicks **Render 1080p Video** to submit to AWS Lambda.

---

## 3. UI/UX Design and Components

- **Studio Route**: `/dashboard/image-to-video`
- **Frontend Studio Component**: `components/dashboard/ImageToVideoStudio.tsx`
- **Public SEO Landing Page**: `/image-to-video-ai` (`app/image-to-video-ai/page.tsx`)
- **Design Structure**: Pure White canvas (`#FFFFFF`) with fine borders (`#E2E8F0`) and responsive 3-row layout (`Stepper Header`, `Timeline Work Area`, `Sticky Action Bar`).

---

## 4. Colors, Typography and Design Tokens

- **Canvas Background**: Pure White (`#FFFFFF`) with subtle slate background accents (`#F8FAFC`).
- **Primary Brand Accent**: Sunset Orange (`#FF5722` / `#F97316`) for active controls and primary CTA buttons.
- **Secondary Tone**: Emerald Mint (`#059669`) for timeline photo tracks.
- **Typography**: Inter / System Sans-serif stack (`font-sans`).

---

## 5. Technical Implementation

- **Video Type ID**: `image-to-video` / `IMAGE_TO_VIDEO_AI`
- **Remotion Composition ID**: `IMAGE-TO-VIDEO-AI` (`1920×1080` @ 30 FPS)
- **Remotion Template Directory**: `remotion/templates/IMAGE_TO_VIDEO_AI/`
- **Speech Extraction**: Extracted 16kHz mono audio processed via Groq Whisper Cloud API.
- **Transcriber Fallback**: Google Gemini 2.0 Flash (`asia-south1`).
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
- **Zero Photos Uploaded**: Studio automatically populates high-definition curated studio scenes so the player is never an empty void.
- **Lambda Render Timeout**: Frame ranges are clamped to 9,000 frames max to prevent out-of-memory errors on Lambda workers.

---

## 8. Testing and Quality Assurance

- **Typecheck Verification**: `npx tsc --noEmit` verifies all timeline props and composition interfaces.
- **Motion Smoothness Test**: Confirm that Ken Burns zoom easing does not jitter or stutter on high-resolution photographs.
- **Credit Boundary Test**: Confirm that a 65-second video charges exactly 2 credits, while a 295-second video charges 5 credits.

---

## 9. Developer Notes and Guardrails

- **Zero Local Rendering (Rule 0)**: Do not run local Remotion renders on developer machines; all video generation executes via AWS Lambda.
- **Memory Protection**: Object URLs created during bulk image ingestion are automatically revoked via `URL.revokeObjectURL` on unmount.
