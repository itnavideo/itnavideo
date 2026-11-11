# AI Shorts Polisher — Studio Specification

## Overview

The **AI Shorts Polisher** (`aiShortsPolisher`) transforms raw smartphone video clips and multi-take vertical shoots into high-retention, publication-ready vertical short videos (`1080×1920` @ 30 FPS MP4) up to 90 seconds long. It automates essential mobile creator editing: trimming silent pauses, alternating dynamic camera zoom cuts, adding animated karaoke subtitles, inserting kinetic emojis, and applying sound effect swooshes.

- **Primary Purpose**: Turn raw smartphone recordings into high-converting Instagram Reels, YouTube Shorts, and TikToks.
- **Target Audience**: Mobile creators, vloggers, coaches, personal brands, and social media managers.
- **Expected Output**: 1080p Full HD (`1080×1920`) 30 FPS vertical MP4 video.

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

- **Mobile Silence Trimmer**: Automatically trims breath sounds and thinking pauses with 3 sensitivity levels: `Tight` (fast-paced TikTok), `Normal` (balanced Reels), and `Gentle` (conversational).
- **Cadenced Camera Punch-Ins**: Automatically alternates frame zoom (+5% to +18%) on major sentence pivots to sustain mobile viewer dopamine.
- **Multi-Take Reordering**: Upload multiple phone clips, reorder them sequentially, and adjust start/end trim points in seconds.
- **Floating PIP Overlays**: Add reaction videos, product screenshots, or tweet callouts positioned within mobile safe margins.
- **Kinetic Karaoke Subtitles**: 40+ viral subtitle presets with millisecond word synchronization and active-word color pops.
- **Sound Effect Accents**: Subtle audio pops, swooshes, and dings layered onto subtitle transitions to keep headphone listeners engaged.

---

## 2. User Workflow

The studio follows a guided 4-step workflow:

1. **Step 1: Upload (Smartphone Video Clips)**:
   - Creator drops or selects vertical video files (`.mp4`, `.mov`).
   - Recordings of any duration are accepted; the engine automatically extracts and processes the first 90 seconds.
2. **Step 2: Music & Audio Ducking**:
   - Selects background music from 14 curated AWS S3 tracks.
   - Adjusts volume level (defaulted to 12% during speech).
3. **Step 3: Caption Style & Zoom Intensity**:
   - Selects subtitle theme (Hormozi Yellow, MrBeast Impact, Neon Lime, Minimalist).
   - Configures zoom punch-in strength (`+5%`, `+12%`, `+18%`).
4. **Step 4: Live Phone Preview & Render**:
   - Interactive 9:16 phone simulator previews live punch-ins, audio waveforms, and subtitles.
   - Creator clicks **Render 1080p Short** to submit to AWS Lambda.

---

## 3. UI/UX Design and Components

- **Studio Route**: `/dashboard/ai-shorts-polisher`
- **Frontend Studio Component**: `components/dashboard/AiShortsPolisherStudio.tsx`
- **Subpage Client**: `components/dashboard/subpages/AiShortsPolisherPageClient.tsx`
- **Public SEO Landing Page**: `/ai-shorts-polisher` (`app/ai-shorts-polisher/page.tsx`)
- **Design Structure**: Pure White canvas (`#FFFFFF`) with fine borders (`#E2E8F0`) and responsive 3-row layout (`Stepper Header`, `Preview Work Area`, `Sticky Action Bar`).

---

## 4. Colors, Typography and Design Tokens

- **Canvas Background**: Pure White (`#FFFFFF`) with subtle slate background accents (`#F8FAFC`).
- **Primary Brand Accent**: Sunset Orange (`#FF5722` / `#F97316`) for active controls and primary CTA buttons.
- **Subtitle Highlighting**: Sunset Yellow (`#FBBF24`), Neon Green (`#22C55E`), and Crisp White (`#FFFFFF`).
- **Typography**: Inter / System Sans-serif stack (`font-sans`).

---

## 5. Technical Implementation

- **Video Type ID**: `aiShortsPolisher` / `AI_SHORTS_POLISHER`
- **Remotion Composition ID**: `AI-SHORTS-POLISHER` (`1080×1920` @ 30 FPS)
- **Remotion Template Directory**: `remotion/templates/AI_SHORTS_POLISHER/`
- **Speech Extraction**: Extracted 16kHz mono audio processed via Groq Whisper Cloud API.
- **Transcriber Fallback**: Google Gemini 2.0 Flash (`asia-south1`).
- **Render Engine**: AWS Lambda running Remotion cloud workers in `us-east-1`.

---

## 6. Business Logic, Duration and Credit Rules

- **Aspect Ratio**: Strictly 9:16 Vertical Only (`1080×1920`).
- **Maximum Output Duration**: Strictly **90 Seconds Max (90s / 2,700 frames @ 30 FPS)**.
- **Credit Billing**: **Strictly 1 Credit** per video (Master Rule 4.1 for 9:16 Short-Form).
- **Draft Preview**: 100% Free interactive browser preview before rendering.

---

## 7. Error Handling and Edge Cases

- **No Speech Detected**: Flags `NO_SPEECH_DETECTED`; prompts user to upload audio with clear speech without deducting credits.
- **Mobile Safe Zone Overflow**: Text bounding boxes are clamped within 100px bottom margin and 80px right margin.
- **Render Interruption**: Credits are automatically refunded if cloud rendering encounters an AWS Lambda timeout.

---

## 8. Testing and Quality Assurance

- **Typecheck Verification**: `npx tsc --noEmit` verifies all polisher props and composition interfaces.
- **Phone Frame Test**: Confirm that subtitles and PIP elements do not overlap TikTok and Instagram Reels UI elements.
- **Audio Ducking Verification**: Verify background music attenuates to 12% volume during speech activity.

---

## 9. Developer Notes and Guardrails

- **Zero Local Rendering (Rule 0)**: Do not run local Remotion renders on developer machines; all rendering executes on AWS Lambda.
- **First-90s Auto-Trimming**: Long files are never rejected; the first 90 seconds are automatically sliced for processing.
