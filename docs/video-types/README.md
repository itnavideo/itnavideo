# Itnavideo — Video Types Master Registry (15 Active Studios)

## Overview

This directory contains the dedicated technical specifications, user workflows, design rules, and rendering pipelines for all **15 active creation studios** in [Itnavideo](https://www.itnavideo.com). 

In accordance with the **Master Video Duration & Credit System (Rule 4.1)** and the **Video Type Independence Rule (Rule 8)**, all creation studios are strictly categorized into:
- **6 Studios for 16:9 Cinema Long-Form** (Strictly 16:9 Widescreen • Up to 5 Minutes • 1 Min = 1 Credit)
- **8 Studios for 9:16 Vertical Shorts & Reels** (Strictly 9:16 Vertical • Up to 90 Seconds • 1 Credit Flat)
- **1 Studio for Audio Utility** (Up to 5 Minutes • 1 Credit Flat)

---

## Table of Contents

1. [Overview](#overview)
2. [16:9 Cinema Widescreen Studios (6 Tools)](#1-169-cinema-widescreen-studios-6-tools)
3. [9:16 Vertical Shorts Studios (8 Tools)](#2-916-vertical-shorts-studios-8-tools)
4. [Audio Utility Studio (1 Tool)](#3-audio-utility-studio-1-tool)
5. [Cross-Studio Pipeline Standards](#4-cross-studio-pipeline-standards)
6. [Master Failure Handling & Refund Architecture](#5-master-failure-handling--refund-architecture)
7. [Developer Guidelines](#6-developer-guidelines)

---

## 1. 16:9 Cinema Widescreen Studios (6 Tools)

All 16:9 studios export exclusively in **1920×1080 Full HD at 30 FPS MP4** for YouTube desktop, television viewing, and presentation video.

| # | Video Creation Tool | Dedicated Documentation | Max Duration | Credit Pricing | Primary Focus & Output | Remotion Composition ID |
|---|---|---|:---:|:---:|---|---|
| **1** | **AI Video Generator** | [`ai-video-generator.md`](./ai-video-generator.md) | **5 Min (300s)** | **1 Min = 1 Credit** | Prompt-to-video creative launchpad, Gemini scene planning, CapCut multitrack timeline | `AI-VIDEO-GENERATOR` |
| **2** | **AI YouTube Video Polisher** | [`ai-video-polisher.md`](./ai-video-polisher.md) | **5 Min (300s)** | **1 Min = 1 Credit** | Auto dead-air trimming, dynamic zoom punch-ins, topic B-roll, scrubber-safe subtitles | `AI_VIDEO_POLISHER` |
| **3** | **Faceless Video Generator** | [`faceless-video.md`](./faceless-video.md) | **5 Min (300s)** | **1 Min = 1 Credit** | Voiceover to documentary video with procedural SVG diagrams, vignettes & subtitles | `FACELESS-VIDEO` |
| **4** | **Book Summary Video** | [`book-summary.md`](./book-summary.md) | **5 Min (300s)** | **1 Min = 1 Credit** | Book notes & audio to 3D cover tilt reveals, animated chapter cards & focus music | `BOOK-SUMMARY` |
| **5** | **Image to Video AI** | [`image-to-video-ai.md`](./image-to-video-ai.md) | **5 Min (300s)** | **1 Min = 1 Credit** | Photos & voiceover to Ken Burns camera motion, crossfade transitions & 2.5D frosted subtitles | `IMAGE-TO-VIDEO-AI` |
| **6** | **YouTube Subtitles Generator** | [`youtube-subtitles-generator.md`](./youtube-subtitles-generator.md) | **5 Min (300s)** | **FREE • 5 Daily** | Burned-in 16:9 landscape subtitles with calibrated YouTube scrubber safe zones | `AUTO-CAPTION-GENERATOR-LANDSCAPE` |

---

## 2. 9:16 Vertical Shorts Studios (8 Tools)

All 9:16 studios export exclusively in **1080×1920 Full HD at 30 FPS MP4** optimized for Instagram Reels, YouTube Shorts, and TikTok. Files longer than 90s are automatically accepted and first 90s used.

| # | Video Creation Tool | Dedicated Documentation | Max Duration | Credit Pricing | Primary Focus & Output | Remotion Composition ID |
|---|---|---|:---:|:---:|---|---|
| **1** | **Auto Caption Generator** | [`auto-caption-generator.md`](./auto-caption-generator.md) | **90s Max** | **FREE • 5 Daily** | Word-synced animated karaoke subtitles with 32 presets & safe zones | `AUTO_CAPTION_GENERATOR` |
| **2** | **AI Shorts Polisher** | [`ai-shorts-polisher.md`](./ai-shorts-polisher.md) | **90s Max** | **1 Credit** | Phone video polisher with auto zoom cuts, silence trimming, kinetic emojis & sound effects | `AI-SHORTS-POLISHER` |
| **3** | **Faceless Shorts** | [`faceless-shorts.md`](./faceless-shorts.md) | **90s Max** | **1 Credit** | Voiceover to viral vertical clips with 16-layer modular crew, SVG art & kinetic text | `FACELESS-SHORTS` |
| **4** | **Whiteboard Animation Maker** | [`whiteboard-video.md`](./whiteboard-video.md) | **90s Max** | **1 Credit** | Spoken audio to hand-drawn marker strokes, blueprint schematics & concept takeaways | `WHITEBOARD-VIDEO` |
| **5** | **Compare Explainer Generator**| [`compare-explainer.md`](./compare-explainer.md) | **90s Max** | **1 Credit** | Side-by-side product comparisons with 16 animated sticker presenter characters & VS badge | `comparisonImages` |
| **6** | **Long Video to Clips** | [`long-video-clips.md`](./long-video-clips.md) | **30s–60s Clips** | **1 Credit / Clip** | Up to 2 hours source ingestion → AI virality hook detector & 9:16 active speaker reframing | `LONG_VIDEO_CLIPS` |
| **7** | **Long Video Promo** | [`long-video-promo.md`](./long-video-promo.md) | **90s Max** | **1 Credit** | Movie-trailer promo teaser reels with 3D thumbnail spotlight & YouTube click prompts | `LONG-VIDEO-PROMO` |
| **8** | **Split Screen Explainer** | [`split-screen-explainer.md`](./split-screen-explainer.md) | **90s Max** | **1 Credit** | True 50/50 dual-zone layout pairing presenter webcam with live software screencasts | `SPLIT-SCREEN-EXPLAINER` |

---

## 3. Audio Utility Studio (1 Tool)

| # | Tool Name | Dedicated Documentation | Max Duration | Credit Pricing | Primary Focus & Output |
|---|---|---|:---:|:---:|---|
| **1** | **AI Audio Cleaner & Enhancer** | [`ai-audio-cleaner.md`](./ai-audio-cleaner.md) | **5 Min (300s)** | **1 Credit** | Automated retake detection, silence trimming, noise removal & 320kbps MP3/WAV mastering |

---

## 4. Cross-Studio Pipeline Standards

1. **Pure White Design System**: All studios render on a clean `#FFFFFF` canvas with fine slate borders (`#E2E8F0`), high-contrast slate typography (`#0F172A`), and Sunset Orange (`#FF5722` / `#F97316`) primary action accents.
2. **Audio Extraction Rule**: Media files are stripped to 16kHz mono audio before sending to transcription APIs to minimize network payloads and ensure fast responses.
3. **Primary & Fallback Speech AI**:
   - **Primary**: Groq Whisper Cloud API (millisecond word-level timestamps).
   - **Fallback**: Google Gemini 2.0 Flash (`asia-south1`) automatically takes over if Groq encounters rate limits or errors.
4. **Bhide Composition Inspector**: Before any job is dispatched to AWS Lambda, `lib/inspector/bhideCompositionInspector.ts` validates and sanitizes all composition props (Tracks A1 voiceover, A2 SFX, A3 BGM ducked to 0.12, safe-zone margins).
5. **No One-Size-Fits-All Pipeline**: Every studio maintains dedicated Remotion components and independent props schemas to prevent visual fatigue and repetitive video outputs.

---

## 5. Master Failure Handling & Refund Architecture

| Failure Event | Affected Tools | Automatic Resolution | Credit Protection |
| :--- | :--- | :--- | :--- |
| **Network Interruption** | All Studios | S3 multipart upload chunk retry + direct presigned URL upload bypasses server limits. | Zero credits deducted. |
| **Duration Exceeds Limit** | All Studios | Long files are accepted; system automatically trims strictly the first 90s (Shorts) or 5m (Cinema). | Zero credits wasted. |
| **Speech API Downtime** | All Studios | Instant automatic failover to Google Gemini 2.0 Flash (`asia-south1`). | Render continues seamlessly. |
| **Silent Audio / No Speech**| All Studios | Flags `NO_SPEECH_DETECTED`; prompts user for audible audio. | 100% Credit Auto-Refunded. |
| **Lambda Render Timeout** | All Studios | Frame ranges clamped to composition limits; fatal crash triggers automatic credit restoration. | 100% Credit Auto-Refunded. |
| **Presigned URL Expiry** | All Studios | On-demand status check re-signs fresh download URLs for up to 48 hours. | Download link always valid. |

---

## 6. Developer Guidelines

- **Zero Local Rendering (Rule 0)**: Do not run local Remotion renders on developer machines; all rendering executes on AWS Lambda.
- **Spec First, Code Second (Rule 1)**: Before modifying any studio, read its dedicated specification in this directory. After making changes, update the specification so documentation never goes out of date.
