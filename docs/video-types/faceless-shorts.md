# Faceless Shorts Generator — Studio Specification

## Overview

The **Faceless Shorts Generator** (`facelessShorts`) transforms raw voiceover audio into broadcast-quality vertical short videos (`1080×1920` @ 30 FPS MP4) up to 90 seconds long, tailored specifically for YouTube Shorts, Instagram Reels, and TikTok. Built on a 16-layer decoupled modular architecture, it synchronizes sentence-aligned scene pacing, procedural SVG illustrations, kinetic typography, dynamic camera punch-ins, and sound effect accents.

- **Primary Purpose**: Build viral faceless vertical channels on TikTok, Reels, and Shorts without filming video.
- **Target Audience**: Short-form creators, faceless niche channels, educators, and social media agencies.
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

- **Sentence-Aligned Scene Pacing**: Slices scenes strictly at real sentence punctuation (`. ! ? ।`) or natural pauses (`>= 0.45s`). Every visual scene represents one complete spoken thought.
- **16-Layer Decoupled Architecture**: Hook scenes, sentence splitters, vector drawings, full-bleed visuals, punch-in zooms, kinetic captions, headlines, and audio ducking operate as isolated Remotion layers.
- **First-3-Seconds Hook Retention**: Special `HookScene` triggers high-contrast curiosity headlines and visual pattern interrupts to halt user scrolling within the first 1.5 seconds.
- **Procedural SVG Vector Art**: Library of 16 custom SVG drawings that animate on-screen with drawing stroke effects. Consecutive scenes never repeat the same drawing.
- **Dynamic Camera Punch-Ins**: Alternates frame scale (+5% to +18%) on major sentence breaks to reset visual attention.
- **Mobile Safe-Zone Clearance**: Enforces 100px bottom margin and 80px right margin to prevent overlaps with platform UI elements.

---

## 2. User Workflow

The studio follows a guided 4-step workflow:

1. **Step 1: Upload (Voiceover Audio & Topic Script)**:
   - Creator uploads narration audio (`.mp3`, `.wav`, `.m4a`).
   - Long recordings are accepted; the first 90 seconds are automatically trimmed for processing.
   - Live editorial transcript allows instant typo and proper noun corrections.
2. **Step 2: Music & Audio Design**:
   - Creator selects background music from 14 curated AWS S3 tracks.
   - Sets background music volume (defaulted to 12% during speech).
3. **Step 3: Caption Style & Visual Pacing**:
   - Chooses from 32 animated typography presets with live word playback loops.
   - Configures camera punch-in intensity and scene transition effects.
4. **Step 4: Live Phone Preview & Render**:
   - Interactive 9:16 phone simulator previews the full video stream with animated captions and illustrations.
   - Creator clicks **Render 1080p Short** to execute AWS Lambda cloud rendering.

---

## 3. UI/UX Design and Components

- **Studio Route**: `/dashboard/faceless-shorts`
- **Frontend Studio Component**: `components/dashboard/FacelessShortsStudio.tsx`
- **Public SEO Landing Page**: `/faceless-shorts` (`app/faceless-shorts/page.tsx`)
- **Design Structure**: Pure White canvas (`#FFFFFF`) with fine borders (`#E2E8F0`) and responsive 3-row layout (`Stepper Header`, `Preview Work Area`, `Sticky Action Bar`).

---

## 4. Colors, Typography and Design Tokens

- **Canvas Background**: Pure White (`#FFFFFF`) with subtle slate background accents (`#F8FAFC`).
- **Primary Brand Accent**: Sunset Orange (`#FF5722` / `#F97316`) for active controls and primary CTA buttons.
- **Subtitle Highlighting**: Sunset Yellow (`#FBBF24`), Neon Lime (`#84CC16`), and Crisp White (`#FFFFFF`).
- **Typography**: Inter / System Sans-serif stack (`font-sans`).

---

## 5. Technical Implementation

- **Video Type ID**: `facelessShorts` / `FACELESS_SHORTS`
- **Remotion Composition ID**: `FACELESS-SHORTS` (`1080×1920` @ 30 FPS)
- **Remotion Template Directory**: `remotion/templates/FACELESS_SHORTS/`
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
- **Missing Scene Drawing**: If a specific vector drawing asset fails to load, a deterministic fallback SVG is rendered instantly.
- **Render Interruption**: Credits are automatically refunded if cloud rendering encounters an AWS Lambda timeout.

---

## 8. Testing and Quality Assurance

- **Typecheck Verification**: `npx tsc --noEmit` verifies all polisher props and composition interfaces.
- **Sentence Cadence Test**: Confirm that scenes split strictly on punctuation or pauses >= 0.45s.
- **Mobile Safe Zone Verification**: Verify text bounding boxes do not overlap TikTok and Reels like/comment buttons.

---

## 9. Developer Notes and Guardrails

- **Zero Local Rendering (Rule 0)**: Do not run local Remotion renders on developer machines; all rendering executes on AWS Lambda.
- **Dedicated Composition**: Faceless Shorts runs on its own Remotion composition (`FACELESS-SHORTS`), completely isolated from 16:9 Faceless Video.

---

## 10. Changelog — Recent Changes

### Session: Faceless Shorts Overhaul

**Visual Art Style (3D/2D removed):**
- Removed `visualArtStyle` prop (`"realistic" | "3d" | "2d"`) from `FacelessShortsPageClient`, `FacelessVideoPageClient`, `FacelessShortsStudio`, `FacelessVideoStudio`.
- Only realistic photo assets remain. 2D/3D pool never existed on S3 — removed to avoid user confusion.
- Updated `.specify/specs/07-faceless-video.md` and asset table accordingly.

**Asset Source Selector (Library / Upload / Mix):**
- `FacelessShortsStudio` now shows a 3-button "Visual Source" selector: **Itnavideo Assets**, **My Uploads**, **Both (Mix)**.
- `executeMediaPlacer` in `services/ai/facelessShortsProductionCrew.ts` now has 3-way logic:
  - `library` → pulls from curated S3 realistic pool only
  - `upload` → user media only, no library fill
  - `mix` → uploads at selected beats + remaining scenes from library
- `assetMode` / `imageSource` wired through: `plan-faceless-shorts` route, `jobs/route.ts` crew call, and render payload.

**Production Crew (16 Specialists):**
- Added `imageSource?: 'library' | 'upload' | 'mix'` to `ProductionCrewInput`.
- Removed dead `executeRenderAssembler` (Specialist 16) — was defined but never called by orchestrator. False audit log entry removed.
- Removed misleading "16-specialist" reference — now 15 real specialists + 1 emoji specialist.

**BrandWatermark:**
- Added `watermark?: boolean` prop and `<BrandWatermark>` render to `FACELESS_SHORTS` and `FACELESS_LONG_VIDEO` templates (were previously missing).

**Free-Tier Paywall:**
- `FacelessShortsPageClient` and `FacelessVideoPageClient` now gate free users with `<FeaturePaywall>` before the studio renders.
- Server-side 402 enforcement was already in place via `renderAccess.ts`.

**Emoji Engine:**
- Expanded from 12 categories to 32 categories with multiple variants per category.
- Rolling repetition-avoidance window (`recentWindow`) prevents the same emoji repeating back-to-back in a single video.

**SVG Library:**
- 36 distinct shape primitives added to `svgMasterCatalog.ts` — assigned deterministically per concept ID.
- `services/ai/svgLibrary.ts` created for future S3-hosted SVG illustrations (prefer S3, fallback to procedural).
- `VectorDrawingIcon.tsx` updated to render `url`-based SVGs when available.
