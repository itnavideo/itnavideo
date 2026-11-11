# Long Video to Clips Generator — Studio Specification

## Overview

The **Long Video to Clips Generator** (`longVideoClips`) automatically converts lengthy horizontal podcasts, webinars, conference keynotes, and interview videos (up to 2 hours) into multiple bite-sized, 9:16 vertical viral Shorts and Reels (`1080×1920` @ 30 FPS MP4) between 30 and 60 seconds long. It uses active speaker face tracking to reframe 16:9 cameras into vertical viewports, evaluates speech density and emotional hooks to extract high-performing moments, and renders 1080p clips with burned-in subtitles.

- **Primary Purpose**: Repurpose long-form videos and podcasts into viral short-form clips.
- **Target Audience**: Video podcasters, YouTubers, webinar hosts, and content repurposing agencies.
- **Expected Output**: Multiple 1080p Full HD (`1080×1920`) 30 FPS vertical MP4 clips.

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

- **Large Source Ingestion**: Accepts raw video files (MP4, MOV, WEBM) or YouTube links up to **2 Hours (120 minutes / 7,200 seconds)**.
- **AI Virality Hook Detector**: Analyzes speech inflection, audience curiosity questions, and cadence spikes across 9 viral triggers (hooks, opinions, emotions, stories, advice, facts, debates, Q&A, punchlines).
- **Computer Vision Speaker Reframing**:
  - `Auto Active Speaker`: MediaPipe face detection tracks the active speaker with dynamic sentence-synced camera jump-cuts.
  - `Split Screen`: Stacks Host in Top 50% and Guest in Bottom 50% divided by an accent bar.
  - `Fit Widescreen`: Centers 16:9 widescreen video on a stylized gaussian blurred background.
- **Configurable Clip Counts**: Select `AI Recommended` (auto-sizes based on content), `3 Clips`, `5 Clips`, or `10 Clips`.
- **50 Standalone Kinetic Caption Styles**: Complete library of animated typography presets with live preview cards.
- **Selective Rendering**: Full 2-hour video is never rendered locally or on the cloud; Remotion Lambda renders strictly the selected 30s–60s clip segments.

---

## 2. User Workflow

The studio follows a guided 4-step workflow:

1. **Step 1: Upload (Video File or YouTube URL)**:
   - Creator uploads long video file (up to 3GB) or pastes YouTube URL.
   - Selects target clip count and duration preference (`Under 30s`, `30–60s`, `60–90s`).
   - Engine extracts audio, transcribes speech, and identifies top viral moment candidates.
2. **Step 2: Review Candidate Clips**:
   - Studio displays a grid of candidate clips with virality scores (e.g., `98/100`), timestamps, and quote summaries.
   - Creator selects which clips to generate.
3. **Step 3: Caption Style & Speaker Layout**:
   - Chooses reframing mode (`Active Speaker`, `Split Screen`, `Fit Widescreen`).
   - Selects animated typography preset and background music.
4. **Step 4: Live Phone Preview & Cloud Render**:
   - Interactive 9:16 phone simulator previews the reframed video and animated subtitles.
   - Creator clicks **Generate Viral Clips** to launch parallel AWS Lambda renders.

---

## 3. UI/UX Design and Components

- **Studio Route**: `/dashboard/long-video-clips`
- **Frontend Studio Component**: `components/dashboard/LongVideoClipsStudio.tsx`
- **Public SEO Landing Page**: `/long-video-clips` (`app/long-video-clips/page.tsx`)
- **Design Structure**: Pure White canvas (`#FFFFFF`) with fine borders (`#E2E8F0`) and responsive 3-row layout (`Stepper Header`, `Clips Work Area`, `Sticky Action Bar`).

---

## 4. Colors, Typography and Design Tokens

- **Canvas Background**: Pure White (`#FFFFFF`) with subtle slate background accents (`#F8FAFC`).
- **Primary Brand Accent**: Sunset Orange (`#FF5722` / `#F97316`) for active controls and primary CTA buttons.
- **Virality Metric Accent**: Emerald Green (`#10B981`) for virality score badges (e.g. `98/100`).
- **Typography**: Inter / System Sans-serif stack (`font-sans`).

---

## 5. Technical Implementation

- **Video Type ID**: `long-video-clips` / `LONG_VIDEO_CLIPS`
- **Remotion Composition ID**: `LONG_VIDEO_CLIPS` (`1080×1920` @ 30 FPS)
- **Remotion Template Directory**: `remotion/templates/LONG_VIDEO_CLIPS/`
- **Virality Engine**: Groq Whisper timestamps + Gemini 2.0 Flash analyze audio density to extract candidate segments.
- **Render Engine**: AWS Lambda running parallel Remotion cloud workers in `us-east-1`.

---

## 6. Business Logic, Duration and Credit Rules

- **Aspect Ratio**: Output is strictly 9:16 Vertical (`1080×1920`). Source can be 16:9 or 9:16.
- **Source Video Duration**: Up to **2 Hours (7,200 seconds)**.
- **Output Clip Duration**: 30 to 60 seconds per clip (up to 90s max).
- **Credit Billing**: **Strictly 1 Credit per Clip** (1 clip = 1 credit, 3 clips = 3 credits, 5 clips = 5 credits).
- **Draft Preview**: 100% Free interactive browser preview before rendering.

---

## 7. Error Handling and Edge Cases

- **No Speech Detected**: Flags `NO_SPEECH_DETECTED`; prompts user to upload audio with clear speech without deducting credits.
- **OffthreadVideo Loading Safety**: Offthread video layers use `pauseOnLoading={false}` to prevent end-frame freezes during boundary cuts.
- **Headline Auto-Wrap**: Dynamic font scaling ensures long headline titles stay strictly within 2 lines.

---

## 8. Testing and Quality Assurance

- **Typecheck Verification**: `npx tsc --noEmit` verifies all clip props and composition interfaces.
- **Clip Boundary Accuracy**: Confirm that clip start and end timestamps snap to sentence boundaries without cutting mid-word.
- **Speaker Reframe Centering**: Confirm that active speaker face remains centered in 9:16 vertical viewport.

---

## 9. Developer Notes and Guardrails

- **Zero Local Rendering (Rule 0)**: Do not run local Remotion renders on developer machines; all rendering executes on AWS Lambda.
- **Parallel Lambda Execution**: Each clip renders as an independent Lambda job, allowing 5 clips to render concurrently in under 60 seconds.
