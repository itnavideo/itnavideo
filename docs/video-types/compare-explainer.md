# Compare Explainer Generator — Studio Specification

## Overview

The **Compare Explainer Generator** (`compare`) generates side-by-side Versus comparison reels (`1080×1920` @ 30 FPS MP4) up to 90 seconds long. Featuring animated sticker presenter characters, split comparison image cards, animated VS badges, and synchronized subtitles, it turns product reviews, debates, and concept face-offs into engaging, digestible short-form content.

- **Primary Purpose**: Create engaging side-by-side versus comparison videos for product reviews and conceptual debates.
- **Target Audience**: Tech reviewers, finance analysts, educators, and social media debate channels.
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

- **Side-by-Side Dual Comparison Stage**: Compares two products, features, or concepts simultaneously with clean split image cards and labels.
- **16 Animated Presenter Sticker Characters**: Select from 16 distinct sticker characters with 6 dynamic reactive poses (Pointing Left, Pointing Right, Thinking, Shocked, Happy, Neutral).
- **Animated VS Center Badge**: High-impact center Versus badge with pulsing energy ring.
- **Word-Level Kinetic Subtitles**: Synchronized subtitles with active-word color pops placed in mobile safe areas.
- **Multiple Visual Themes**: Supports 4 distinct visual themes (`White Studio`, `Soft Gradient Light`, `Midnight Dark`, `Electric Purple`).
- **Sound Design**: Curated tension-building background music and swoosh sound effects on character pose transitions.

---

## 2. User Workflow

The studio follows a guided 4-step workflow:

1. **Step 1: Upload (Voiceover Audio, Left Image & Right Image)**:
   - Creator uploads narration audio (`.mp3`, `.wav`, `.m4a`).
   - Uploads Left comparison item photo (e.g., iPhone 15) and Right item photo (e.g., Galaxy S24).
   - Enters optional Left Title and Right Title labels.
   - Cloud transcribes speech and displays the live editorial transcript for verification.
2. **Step 2: Music & Audio Design**:
   - Creator selects background music from 14 curated AWS S3 tracks.
   - Sets background music volume with auto-ducking to maintain vocal clarity.
3. **Step 3: Character Selection & Caption Theme**:
   - Chooses presenter character and default theme.
   - Selects animated typography style with live word previews.
4. **Step 4: Live Phone Preview & Render**:
   - Interactive 9:16 phone simulator previews the split-screen cards and sticker character reactions.
   - Creator clicks **Render 1080p Compare Reel** to execute AWS Lambda cloud rendering.

---

## 3. UI/UX Design and Components

- **Studio Route**: `/dashboard/compare-explainer`
- **Frontend Studio Component**: `components/dashboard/CompareExplainerStudio.tsx`
- **Public SEO Landing Page**: `/compare-explainer` (`app/compare-explainer/page.tsx`)
- **Design Structure**: Pure White canvas (`#FFFFFF`) with fine borders (`#E2E8F0`) and responsive 3-row layout (`Stepper Header`, `Preview Work Area`, `Sticky Action Bar`).

---

## 4. Colors, Typography and Design Tokens

- **Canvas Background**: Pure White (`#FFFFFF`) with subtle slate background accents (`#F8FAFC`).
- **Primary Brand Accent**: Sunset Orange (`#FF5722` / `#F97316`) for active controls and primary CTA buttons.
- **Comparison Split Accents**: Cyan Blue (`#0EA5E9`) for left item and Amber Orange (`#F59E0B`) for right item.
- **Typography**: Inter / System Sans-serif stack (`font-sans`).

---

## 5. Technical Implementation

- **Video Type ID**: `compare` / `comparisonImages`
- **Remotion Composition ID**: `comparisonImages` (`1080×1920` @ 30 FPS)
- **Remotion Template Directory**: `remotion/templates/comparisonImages/`
- **Sticker Asset Library**: Vector PNG/SVG sticker character assets stored in `public/assets/stickman/`.
- **Speech Transcription**: Groq Whisper Cloud API.
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
- **Missing Side Image**: Fallback renders a clean high-contrast text badge displaying the item title.
- **Render Interruption**: Credits are automatically refunded if cloud rendering encounters an AWS Lambda timeout.

---

## 8. Testing and Quality Assurance

- **Typecheck Verification**: `npx tsc --noEmit` verifies all comparison props and composition interfaces.
- **Sticker Alignment**: Confirm that presenter character does not obscure comparison image cards or subtitles.
- **Side Switch Timing**: Confirm that sticker pointing transitions correspond to the spoken item being discussed.

---

## 9. Developer Notes and Guardrails

- **Zero Local Rendering (Rule 0)**: Do not run local Remotion renders on developer machines; all rendering executes on AWS Lambda.
- **Character Asset Index**: Any new sticker characters must be registered in `public/assets/stickman/` and indexed via `npm run assets:index`.
