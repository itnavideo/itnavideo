# Long Video Promo Generator — Studio Specification

## Overview

The **Long Video Promo Generator** (`longVideoPromo`) transforms full-length videos, songs, podcasts, and lectures into high-converting 9:16 vertical promotional teaser reels (`1080×1920` @ 30 FPS MP4) up to 90 seconds long. Styled like a movie trailer for digital content, it displays the video's custom YouTube thumbnail card, title badges, teaser video excerpts, and prominent watch prompts that drive viewers to click through to the complete long-form upload.

- **Primary Purpose**: Promote long-form YouTube videos, podcasts, and courses on short-form feeds to drive traffic.
- **Target Audience**: YouTubers, podcasters, musicians, educators, and enterprise marketing teams.
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

- **Thumbnail Spotlight Card**: Prominently features the original 16:9 YouTube thumbnail card with subtle 3D tilt animation and drop shadows.
- **Auto YouTube Thumbnail Ingestion**: Creators can upload an image file or paste a YouTube URL to automatically extract the highest-resolution (`maxresdefault`) thumbnail.
- **Movie-Trailer Teaser Motion**: Slices and highlights the best 15-to-45 second video excerpt with animated progress countdown bars.
- **Kinetic Call-to-Action Overlays**: Clear on-screen watch prompts ("Watch Full Video on YouTube", "Link in Bio", "Full Episode Out Now").
- **20 Standalone Kinetic Caption Styles**: Word-by-word synchronized subtitles with active-word color pops.
- **Multiple Background Modes**: Clean White Studio, Ambient Blur Backdrop, or Solid Obsidian.

---

## 2. User Workflow

The studio follows a guided 4-step workflow:

1. **Step 1: Upload (Thumbnail, Title & Promo Clip)**:
   - Creator enters video title (max 80 characters).
   - Uploads 16:9 thumbnail image or pastes a YouTube URL.
   - Uploads the promo video excerpt (up to 90 seconds).
2. **Step 2: Music & Audio Design**:
   - Selects background music from 14 curated AWS S3 tracks.
   - Sets background music volume with auto-ducking to maintain vocal clarity.
3. **Step 3: Caption Style & Background Mode**:
   - Chooses animated typography preset (Pop Word, Slam, Zoom Punch).
   - Selects background mode (`White Studio`, `Ambient Blur`, `Obsidian Solid`).
4. **Step 4: Live Phone Preview & Render**:
   - Interactive 9:16 phone simulator previews the thumbnail card and teaser playback.
   - Creator clicks **Render 1080p Promo Reel** to execute AWS Lambda cloud rendering.

---

## 3. UI/UX Design and Components

- **Studio Route**: `/dashboard/long-video-promo`
- **Frontend Studio Component**: `components/dashboard/LongVideoPromoStudio.tsx`
- **Public SEO Landing Page**: `/long-video-promo` (`app/long-video-promo/page.tsx`)
- **Design Structure**: Pure White canvas (`#FFFFFF`) with fine borders (`#E2E8F0`) and responsive 3-row layout (`Stepper Header`, `Preview Work Area`, `Sticky Action Bar`).

---

## 4. Colors, Typography and Design Tokens

- **Canvas Background**: Pure White (`#FFFFFF`) with subtle slate background accents (`#F8FAFC`).
- **Primary Brand Accent**: Sunset Orange (`#FF5722` / `#F97316`) for active controls and primary CTA buttons.
- **Secondary Tone**: Violet Purple (`#7C3AED`) for teaser badges.
- **Typography**: Inter / System Sans-serif stack (`font-sans`).

---

## 5. Technical Implementation

- **Video Type ID**: `longVideoPromo` / `LONG_VIDEO_PROMO`
- **Remotion Composition ID**: `LONG-VIDEO-PROMO` (`1080×1920` @ 30 FPS)
- **Remotion Template Directory**: `remotion/templates/LONG_VIDEO_PROMO/`
- **Speech Extraction**: Extracted 16kHz mono audio processed via Groq Whisper Cloud API (when promo clip includes dialogue).
- **Render Engine**: AWS Lambda running Remotion cloud workers in `us-east-1`.

---

## 6. Business Logic, Duration and Credit Rules

- **Aspect Ratio**: Strictly 9:16 Vertical Only (`1080×1920`).
- **Maximum Output Duration**: Strictly **90 Seconds Max (90s / 2,700 frames @ 30 FPS)**.
- **Credit Billing**: **Strictly 1 Credit** per video (Master Rule 4.1 for 9:16 Short-Form).
- **Draft Preview**: 100% Free interactive browser preview before rendering.

---

## 7. Error Handling and Edge Cases

- **Invalid YouTube URL**: Client-side regex validates YouTube URL format before fetching thumbnail metadata.
- **Missing Thumbnail**: Fallback creates a clean procedural title card with author branding.
- **Render Interruption**: Credits are automatically refunded if cloud rendering encounters an AWS Lambda timeout.

---

## 8. Testing and Quality Assurance

- **Typecheck Verification**: `npx tsc --noEmit` verifies all promo props and composition interfaces.
- **Thumbnail Aspect Fit**: Confirm that 16:9 thumbnail fits without distorting or clipping critical text.
- **CTA Legibility**: Confirm that the bottom watch prompt remains legible on small smartphone viewports.

---

## 9. Developer Notes and Guardrails

- **Zero Local Rendering (Rule 0)**: Do not run local Remotion renders on developer machines; all rendering executes on AWS Lambda.
- **YouTube Thumbnail Safety**: Remote thumbnail URLs must route through allowed next/image image domains or Cloudinary proxy.
