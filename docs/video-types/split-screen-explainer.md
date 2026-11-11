# Split Screen Explainer Video — Studio Specification

## Overview

The **Split Screen Explainer Video** (`splitScreenExplainer`) creates multi-frame 9:16 vertical short videos (`1080×1920` @ 30 FPS MP4) up to 90 seconds long featuring a synchronized **50/50 dual-zone layout**. Designed for software demonstrations, technical walkthroughs, reaction clips, and product tear-downs, it pairs a presenter talking-head camera recording with a live companion screen capture, app walkthrough, slide deck, or reaction b-roll.

- **Primary Purpose**: Combine presenter video with live software demos or reactions in a synchronized split-screen vertical layout.
- **Target Audience**: SaaS founders, developer advocates, tutorial creators, financial analysts, and commentary channels.
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

- **True 50/50 Dual-Zone Layout**:
  - **Top 50% (`1080×960`)**: Dynamic Explanation Stage for software screencasts, app demos, documents, charts, or reaction footage.
  - **Bottom 50% (`1080×960`)**: Creator Video Zone displaying the presenter talking-head with dynamic camera punch-ins.
- **Center Divider Accent**: Custom divider line with a floating topic title pill.
- **6 Master Visual Themes**: Modern SaaS, Bold Kinetic, Premium Finance, Educational, Editorial Minimal, and Futuristic Tech.
- **Synchronized Subtitle Strip**: Captions sit directly along the divider line with high-contrast backdrops, ensuring both screens stay 100% visible.
- **Screencast Clarity Preservation**: High-bitrate cloud processing preserves fine text, code syntax, and UI buttons on recorded screen panels.
- **Audio Track Leveling**: Intelligently balances presenter microphone audio with system screencast audio.

---

## 2. User Workflow

The studio follows a guided 4-step workflow:

1. **Step 1: Upload (Dual 50/50 Ingest)**:
   - Creator uploads bottom presenter talking-head video (`.mp4`, `.mov`).
   - Uploads top companion media (screen recording, app demo video, or high-res image).
   - Enters topic title badge text.
2. **Step 2: Music & Audio Design**:
   - Selects background music from 14 curated AWS S3 tracks.
   - Adjusts volume level (defaulted to 12% during speech).
3. **Step 3: Caption Style & Divider Theme**:
   - Selects divider line style (Studio Slate, Glowing Orange, Neon Mint).
   - Selects animated typography preset with live word previews.
4. **Step 4: Live Phone Preview & Render**:
   - Interactive 9:16 phone simulator previews both panels playing in perfect sync.
   - Creator clicks **Render 1080p Split Explainer** to execute AWS Lambda cloud rendering.

---

## 3. UI/UX Design and Components

- **Studio Route**: `/dashboard/split-screen-explainer`
- **Frontend Studio Component**: `components/dashboard/SplitScreenStudio.tsx`
- **Public SEO Landing Page**: `/split-screen-explainer` (`app/split-screen-explainer/page.tsx`)
- **Design Structure**: Pure White canvas (`#FFFFFF`) with fine borders (`#E2E8F0`) and responsive 3-row layout (`Stepper Header`, `Preview Work Area`, `Sticky Action Bar`).

---

## 4. Colors, Typography and Design Tokens

- **Canvas Background**: Pure White (`#FFFFFF`) with subtle slate background accents (`#F8FAFC`).
- **Primary Brand Accent**: Sunset Orange (`#FF5722` / `#F97316`) for active controls and primary CTA buttons.
- **Divider Accents**: Electric Cyan (`#06B6D4`), Sunset Orange (`#EA580C`), or Clean Slate (`#64748B`).
- **Typography**: Inter / System Sans-serif stack (`font-sans`).

---

## 5. Technical Implementation

- **Video Type ID**: `splitScreenExplainer` / `SPLIT_SCREEN_EXPLAINER`
- **Remotion Composition ID**: `SPLIT-SCREEN-EXPLAINER` (`1080×1920` @ 30 FPS)
- **Remotion Template Directory**: `remotion/templates/SPLIT_SCREEN_EXPLAINER/`
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

- **Asynchronous Audio Tracks**: Engine synchronizes presenter audio waveform with companion media cues.
- **Mismatched Aspect Ratios**: Intelligent content-aware letterboxing preserves companion screencast readability without stretching.
- **Render Interruption**: Credits are automatically refunded if cloud rendering encounters an AWS Lambda timeout.

---

## 8. Testing and Quality Assurance

- **Typecheck Verification**: `npx tsc --noEmit` verifies all split-screen props and composition interfaces.
- **Dual Panel Alignment**: Confirm that top demo and bottom presenter panels do not overlap or distort divider line.
- **Subtitle Strip Clearance**: Confirm that divider subtitles do not cover presenter face or key demo controls.

---

## 9. Developer Notes and Guardrails

- **Zero Local Rendering (Rule 0)**: Do not run local Remotion renders on developer machines; all rendering executes on AWS Lambda.
- **Divider Proportions**: The 50/50 split boundary is calibrated to 960px vertical height. Do not modify split proportions without testing on mobile simulators.
