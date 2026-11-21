# AI YouTube Video Polisher — Studio Specification

## Overview

The **AI YouTube Video Polisher** (`aiVideoPolisher`) transforms raw 16:9 talking-head video footage and multi-take camera recordings into studio-grade YouTube videos (`1920×1080` @ 30 FPS MP4). It automates tedious manual post-production steps: cutting silent gaps, applying dynamic camera zoom punch-ins, overlaying topic-matched stock visuals, auto-ducking background audio, and burning in landscape subtitles with calibrated safe zones.

- **Primary Purpose**: Automate YouTube video editing for talking-head creators, vloggers, and educators.
- **Target Audience**: Independent YouTube creators, educators, video podcasters, and marketing teams.
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

- **Automated Silence & Gap Trimmer**: Detects dead-air pauses and breath gaps with 3 sensitivity levels: `Tight` (fast-paced YouTube flow), `Normal` (standard pacing), and `Gentle` (relaxed podcasts).
- **Dynamic Camera Punch-Ins**: Automatically alternates digital scale at sentence boundaries with configurable intensity: `Subtle (+5%)`, `Standard (+12%)`, or `Dramatic (+18%)`.
- **Multi-Take Sequencing & Trimming**: Creators can upload multiple video takes, reorder them sequentially, and trim in/out seconds directly in the studio.
- **Picture-in-Picture (PIP) Calling**: Floating overlays for slides, screenshots, or reaction clips with 5 anchor positions (`Top-Right`, `Top-Left`, `Bottom-Right`, `Bottom-Left`, `Center-Split`).
- **Word-Level Script & Misheard Name Corrector**: Quick-replacer allows creators to fix mistranscribed jargon, brand names, or technical terms while preserving audio timestamp synchronization.
- **16:9 YouTube Safe Zones**: Subtitles are positioned with bottom margins (84px web / 120px smart TVs) so captions never collide with the YouTube progress scrubber or video titles.

---

## 2. User Workflow

The studio follows a guided 4-step workflow:

1. **Step 1: Upload (Video Takes & Secondary Media)**:
   - Creator uploads primary talking-head video clips (`.mp4`, `.mov`, `.webm`).
   - Long files up to 5 minutes (300 seconds) are supported.
   - Optionally uploads secondary PIP images or screen recordings.
2. **Step 2: Music & Audio Design**:
   - Selects background music from 14 curated AWS S3 production tracks.
   - Sets background music volume (defaulted to 12% during speech).
3. **Step 3: Pacing, Zoom & Subtitle Style**:
   - Configures zoom punch-in intensity (`+5%`, `+12%`, `+18%`) and silence cut sensitivity.
   - Selects from signature 16:9 typography presets (Ali Abdaal Clean, Vox Documentary, Huberman Lab).
4. **Step 4: Live Preview & Cloud Render**:
   - Interactive 16:9 cinema monitor previews live zoom cuts, PIP positions, and subtitles.
   - Creator clicks **Render 1080p Video** to execute AWS Lambda cloud rendering.

---

## 3. UI/UX Design and Components

- **Studio Route**: `/dashboard/ai-video-polisher`
- **Frontend Studio Component**: `components/dashboard/AiVideoPolisherStudio.tsx`
- **Subpage Client**: `components/dashboard/subpages/AiVideoPolisherPageClient.tsx`
- **Public SEO Landing Page**: `/ai-video-polisher` (`app/ai-video-polisher/page.tsx`)
- **Design Structure**: Pure White canvas (`#FFFFFF`) with fine borders (`#E2E8F0`) and responsive 3-row layout (`Stepper Header`, `Preview Work Area`, `Sticky Action Bar`).

---

## 4. Colors, Typography and Design Tokens

- **Canvas Background**: Pure White (`#FFFFFF`) with subtle slate background accents (`#F8FAFC`).
- **Primary Brand Accent**: Sunset Orange (`#FF5722` / `#F97316`) for active controls and primary CTA buttons.
- **Accent Tones**: Slate Navy (`#0F172A`) for high-contrast cards and TV safe indicators.
- **Typography**: Inter / System Sans-serif stack (`font-sans`).

---

## 5. Technical Implementation

- **Video Type ID**: `aiVideoPolisher` / `AI_VIDEO_POLISHER`
- **Remotion Composition ID**: `AI_VIDEO_POLISHER` (`1920×1080` @ 30 FPS)
- **Remotion Template Directory**: `remotion/templates/AI_VIDEO_POLISHER/`
- **Speech Extraction**: Extracted 16kHz mono audio processed via Groq Whisper Cloud API.
- **Transcriber Fallback**: Google Gemini 2.0 Flash (`asia-south1`).
- **Render Engine**: AWS Lambda running Remotion cloud workers in `us-east-1`.

---

## 6. Business Logic, Duration and Credit Rules

- **Aspect Ratio**: Strictly 16:9 Widescreen Only (`1920×1080`).
- **Maximum Output Duration**: Strictly **5 Minutes Max (300 seconds / 9,000 frames @ 30 FPS)**.
- **Credit Billing**: **1 Min = 1 Credit** (1m = 1 Cr, 2m = 2 Cr, 3m = 3 Cr, 4m = 4 Cr, 5m = 5 Cr max).
- **Draft Preview**: 100% Free interactive browser preview before rendering.

---

## 7. Error Handling and Edge Cases

- **No Speech Detected**: Flags `NO_SPEECH_DETECTED`; prompts user to upload audio with clear speech without deducting credits.
- **Misaligned Takes**: Automatic audio waveform cross-correlation ensures multi-take transitions splice cleanly without audio pops.
- **Expired S3 Links**: On-demand presigned URL re-signer delivers fresh download links for up to 48 hours.

---

## 8. Testing and Quality Assurance

- **Typecheck Verification**: `npx tsc --noEmit` verifies all polisher props and composition interfaces.
- **Scrubber Clearance Test**: Confirm that subtitles stay above the 84px bottom safe line on desktop browsers.
- **Audio Ducking Verification**: Verify background music attenuates to 12% volume during speech activity.

---

## 9. Developer Notes and Guardrails

- **Zero Local Rendering (Rule 0)**: Do not run local Remotion renders on developer machines; all rendering executes on AWS Lambda.
- **Safe Zone Constants**: Safe zone dimensions are centralized in `lib/constants/videoSafeZones.ts`. Do not use hardcoded pixel offsets in template components.

---

## 10. Creator Reverse-Engineering Blueprint: The Ali Abdaal Talking-Head Polishing Engine

The **AI YouTube Video Polisher** (`aiVideoPolisher`) directly adopts the editing blueprint reverse-engineered from Ali Abdaal's high-retention YouTube masterclasses (e.g. *"This One AI Prompt Will Organise Your Entire Life"* and *"If You Have a Job, Start Selling Your Skills ASAP"*).

### 10.1 The 4 Polishing Pillars Learned from Ali Abdaal
1. **Rhythmic Camera Punch-Ins**:
   - Alternates between Wide (1.0x) and Punch-In (1.10x–1.14x) at sentence starts or on key emphasis words. Keeps talking-head footage visually dynamic without feeling jarring.
2. **Contextual Full-Screen Cutaways & PIP Cards**:
   - Instead of keeping the camera solely on the presenter's face, the engine triggers editorial cutaways or floating Picture-in-Picture (PIP) cards whenever the voiceover references mental models:
     - Spoken prompt / AI workflow $\rightarrow$ `PromptWindowAsset` (macOS code terminal with live typing).
     - Career / salary / pricing discussion $\rightarrow$ `LeverageLadderAsset` (4-rung career multiplier ladder).
     - Life balance / routine audit $\rightarrow$ `LifePillarsDeckAsset` (4 life pillars deck).
     - High-ticket problem solving $\rightarrow$ `ProblemAuditCardAsset` (client ROI problems list).
3. **Editorial Typography & Organic Doodles**:
   - **Default Canvas for Cutaways**: Warm off-white / editorial cream paper (`#FAF6F2`) with subtle `#EFE7DF` depth shift.
   - **Heading Font**: `Lora` / `Playfair Display` (700 bold, deep charcoal `#141414`).
   - **Handwritten Annotations**: `HandwritingAnnotation` using `Caveat, cursive` with orange (`#EA580C`) or amber (`#D97706`) doodle arrows and circles highlighting key words.
4. **Studio Outro Polish**:
   - Incorporates `SubscribeBellAsset` with metallic shimmer pill, animated cursor click, and swinging golden bell sound waves during channel sign-offs.

### 10.2 Forensic Visual & Animation Tokens (Learned from Ali Abdaal)

#### 1. Dynamic Screen Partitioning: The Side-Docked Presenter (`SideDockedPresenterLayout`)
* **Problem**: When a creator sits dead-center in the 16:9 frame, displaying infographics or text overlays directly over their body/head creates visual clutter and looks amateurish.
* **The Solution**: 
  - **Center-Stage Mode**: When speaking casually or personally, the presenter is full-screen with subtle `1.0x` $\rightarrow$ `1.12x` punch-in cuts.
  - **Side-Docked Explanation Mode (`SideDockedPresenterLayout`)**: The moment a concept, prompt, pricing model, or framework is explained, the presenter video smoothly docks into a 35% width card on the left/right with rounded borders (`20px`) and live status tag, while 65% of the screen opens up into a dedicated warm-paper explanation canvas (`#FAF6F2`).
  - **Cross-Docking Doodle Arrow (`HandwritingAnnotation`)**: An animated doodle arrow connects the presenter's docked card directly to the active step or diagram with a callout note in `Caveat, cursive`.

#### 2. Exact Typography Scale & Color Standards
* **Hero Titles**: `44px` to `56px`, 700 Bold, Editorial Serif (`Lora`, `Playfair Display`), Color: `#141414` (Deep Charcoal Black).
* **Section / Card Titles**: `22px` to `28px`, 700 Bold, Color: `#18181B`.
* **Body / Subtitles**: `14px` to `16px`, 500 Medium, `Plus Jakarta Sans` / `Inter`, Color: `#52525B` / `#71717A`.
* **Category Badges**: `11px` to `12px`, 700 Bold Uppercase, `0.06em` letter spacing, rounded pill with colored outline.
* **Handwriting Callouts**: `22px` to `28px`, `Caveat, cursive`, Color: `#EA580C` (Flame Orange) or `#D97706` (Amber), rotated `-4deg` to `-6deg`.
* **Kinetic Captions**: `32px` to `36px` 16:9 (`48px` to `54px` 9:16), 700 Bold with animated highlight box.

#### 3. Exact Card Geometry & Shadow Hierarchy
* **Canvas Tone**: Warm Cream (`#FAF6F2`) with soft diagonal tone shift to `#EFE7DF`.
* **Card Surface**: Pure White (`#FFFFFF`) or frosted glass (`rgba(255, 255, 255, 0.94)`).
* **Card Borders**: Hairline `1.0px` to `1.5px` border: `rgba(0, 0, 0, 0.08)` (Light) or `rgba(255, 255, 255, 0.10)` (Dark).
* **Corner Radius**: `16px` to `24px` smooth modern curvature (`border-radius: 18px`).
* **Card Shadows**: Ambient multi-layer drop shadow `0 20px 40px -15px rgba(0, 0, 0, 0.07)` (never harsh black borders).

#### 4. Animation Timing & Physics Engine
* **Card Entrance Spring**: `damping: 14-16`, `stiffness: 120-140` via Remotion `spring()`. Natural organic pop without rubberband bounce.
* **Handwriting Stroke Draw**: `14` to `24` frames draw duration using SVG `strokeDashoffset` interpolation.
* **Yellow Marker Highlighter**: Smooth left-to-right clip-path wipe across text (`0%` to `100%` in 15 frames) with `#FFE600` at `0.35` opacity.
* **Camera Punch-Ins**: Direct editor jump cut (`1.0x` $\rightarrow$ `1.12x`) on spoken sentence starts (zero sluggish zoom drift).

---

*Last Updated: November 2026 — Official Master Documentation for Itnavideo Company.*
