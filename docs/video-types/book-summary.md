# Book Summary Video Generator — Studio Specification

## Overview

The **Book Summary Video Generator** (`bookSummary`) turns raw book review notes, chapter outlines, key takeaways, and voiceover audio into cinematic 16:9 Full HD (`1920×1080` @ 30 FPS MP4) widescreen video summaries up to 5 minutes long. Designed for non-fiction book reviewers, executive coaches, educators, and authors, it generates 3D book cover tilt reveals, animated chapter cards, kinetic quote highlights, and lo-fi focus background music.

- **Primary Purpose**: Transform book notes and voiceovers into cinematic 16:9 widescreen educational videos.
- **Target Audience**: Book reviewers, educational channels, executive coaches, authors, and publishing houses.
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
- **Dynamic 8-Scene Non-Repeating Engine**: Automatically selects from 8 distinct visual layouts (3D Cover Display, Chapter Break, Quote Highlight, Bullet Principles, Contrast Takeaways, Core Thesis Card, Summary Wrap-Up) so scenes never look repetitive.
- **Text Notes Ground Truth**: Creators can upload or paste their book notes, giving the AI scene planner 100% factual accuracy.
- **Editable Scene Beats**: Creators can swap scene layouts, tweak takeaway text, and adjust quotes directly in the studio before cloud rendering.
- **YouTube Ready Timestamps**: Automatically generates YouTube description chapter timestamps (`00:00 Intro`, `01:15 Chapter 1`, etc.) and a 1280×720 video thumbnail.
- **Frame-Accurate Subtitles**: Word-level kinetic highlights synced to spoken narration using the shared caption engine.

---

## 2. User Workflow

The studio follows a guided 4-step workflow:

1. **Step 1: Upload (Voiceover Audio, Book Cover & Notes)**:
   - Creator uploads narration audio (`.mp3`, `.wav`, `.m4a`) up to 5 minutes (300 seconds).
   - Optionally uploads a high-resolution book cover image (`.png`, `.jpg`).
   - Optionally pastes book notes and key chapter bullet points.
   - Cloud transcribes speech and displays the live editorial transcript for verification.
2. **Step 2: Music & Audio Design**:
   - Creator selects background music from 14 curated AWS S3 tracks (Lo-Fi Focus, Piano, Acoustic).
   - Sets background music volume with auto-ducking to maintain vocal clarity.
3. **Step 3: Chapter Styling & Subtitle Theme**:
   - Chooses from 32 animated typography presets with live word playback loops.
   - Configures 3D book cover tilt intensity and chapter card transition styles.
4. **Step 4: Live Cinema Preview & Render**:
   - 16:9 Cinema live monitor previews the video stream, chapter cards, and subtitles.
   - Creator clicks **Render 1080p Video** to execute AWS Lambda cloud rendering.

---

## 3. UI/UX Design and Components

- **Studio Route**: `/dashboard/book-summary`
- **Frontend Studio Component**: `components/dashboard/BookSummaryStudio.tsx`
- **Public SEO Landing Page**: `/book-summary` (`app/book-summary/page.tsx`)
- **Design Structure**: Pure White canvas (`#FFFFFF`) with fine borders (`#E2E8F0`) and responsive 3-row layout (`Stepper Header`, `Preview Work Area`, `Sticky Action Bar`).

---

## 4. Colors, Typography and Design Tokens

- **Canvas Background**: Pure White (`#FFFFFF`) with subtle slate background accents (`#F8FAFC`).
- **Primary Brand Accent**: Sunset Orange (`#FF5722` / `#F97316`) for active controls and primary CTA buttons.
- **Accent Tones**: Warm Amber (`#D97706`) and Indigo (`#4F46E5`) for chapter cards and quote borders.
- **Typography**: Inter / System Sans-serif stack (`font-sans`).

---

## 5. Technical Implementation

- **Video Type ID**: `bookSummary` / `BOOK_SUMMARY`
- **Remotion Composition ID**: `BOOK-SUMMARY` (`1920×1080` @ 30 FPS)
- **Remotion Template Directory**: `remotion/templates/BOOK_SUMMARY/`
- **AI Planning Engine**: Google Cloud Gemini 2.0 Flash (`asia-south1`) parses transcript and notes into a structured `scenes` array.
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
- **Missing Book Cover**: Automatically falls back to a clean procedural typography cover card displaying the book title and author name.
- **Lambda Render Timeout**: Frame ranges are clamped to 9,000 frames max to prevent out-of-memory errors on Lambda workers.

---

## 8. Testing and Quality Assurance

- **Typecheck Verification**: `npx tsc --noEmit` verifies all template props and scene interfaces.
- **Chapter Break Alignment**: Confirm that chapter cards trigger exactly at spoken chapter transition timestamps.
- **Credit Boundary Test**: Confirm that a 110-second video charges exactly 2 credits, while a 290-second video charges 5 credits.

---

## 9. Developer Notes and Guardrails

- **Zero Local Rendering (Rule 0)**: Do not run local Remotion renders on developer machines; all video generation executes via AWS Lambda.
- **Sequential Pipeline Integrity**: Text notes editing must occur before scene planning so the AI planner operates on user-approved words.
