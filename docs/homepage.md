# Itnavideo — Homepage Master Architecture & Spec (`homepage.md`)

## Overview

This document is the **Single Source of Truth** for the Itnavideo public homepage (`app/page.tsx`). It details the complete page architecture, hero positioning, conversion funnels, visual design tokens, mobile-first responsive behaviors, SEO metadata, and studio counts. Any frontend engineer, content strategist, or UI designer modifying the homepage must consult and update this document to keep the live product and documentation in perfect alignment.

---

## Table of Contents

1. [Quick Audit and Verification Checklist](#1-quick-audit--verification-checklist-30-second-audit)
2. [Executive Positioning and Value Hook](#2-executive-positioning--value-hook)
3. [Studio Count Architecture](#3-studio-count-architecture)
4. [Master Category Matrix & Duration Standards](#4-master-category-matrix--duration-standards)
5. [Complete Homepage Section Hierarchy](#5-complete-homepage-section-hierarchy-top-to-bottom)
6. [Brand Design Tokens & Color Hierarchy](#6-brand-design-tokens-rule-9--orange-primary-system)
7. [Developer and Maintenance Rules](#7-developer--maintenance-rules)

---

## 1. Quick Audit & Verification Checklist (30-Second Audit)

| Checkpoint | Expected Standard | Status |
| :--- | :--- | :---: |
| **Studio Count Architecture** | **15 Total Studios** (14 Video Studios + 1 Audio Utility Studio) across 2 native aspect ratios | ✅ Verified |
| **Safe Marketing Phrase** | **"10+ Purpose-Built AI Video Studios"** (Safe phrase defined in `constants/studios.ts` so roadmap expansions never break copy) | ✅ Verified |
| **16:9 Cinema Studios** | **6 Purpose-Built Studios** (Faceless Video, Book Summary, Image to Video, YouTube Subtitles, AI Video Generator, AI YouTube Video Polisher) | ✅ Verified |
| **9:16 Shorts & Reels Studios**| **8 Purpose-Built Studios** (Auto Caption, Faceless Shorts, Whiteboard, Compare, Long Video Clips, Long Video Promo, Split Screen, AI Shorts Polisher) | ✅ Verified |
| **Audio Utility Studio** | **1 Studio** (AI Studio Audio Cleaner) | ✅ Verified |
| **16:9 Max Duration** | **Strictly 5 Minutes Max (300s / 9,000 frames)** for all plans | ✅ Verified |
| **9:16 Max Duration** | **Strictly 90 Seconds Max (90s / 2,700 frames)** | ✅ Verified |
| **16:9 Credit Pricing** | **1 Min = 1 Credit** ($\lceil\text{duration} / 60\rceil$: 1m=1, 2m=2, 3m=3, 4m=4, 5m=5 Cr max) | ✅ Verified |
| **9:16 Credit Pricing** | **1 Credit / Video** (Flat 1080×1920 30 FPS MP4) | ✅ Verified |
| **Free Tier Allowance** | **Up to 5 Free Daily Subtitle Videos (0 Credits)** strictly for Auto Caption (9:16) & YouTube Subtitles (16:9). Resets daily (no rollover; "up to 150/mo" only if used daily). Heavy 16:9 creation studios require credits. | ✅ Verified |
| **Watermark Policy** | **Free Tier: Subtle brand watermark. Paid Plans: 100% Unbranded & Zero Watermark** | ✅ Verified |
| **Viral Clips Pricing** | **1 Credit / Clip** (1 clip = 1 Cr, 5 clips = 5 Cr; source input up to 2 hours) | ✅ Verified |
| **Mobile-First CRO** | **70% Mobile / 30% Desktop**. Sticky Mobile Action Bar appears on upward scroll with safe-area padding | ✅ Verified |
| **Regional Audio Pipeline** | Transcribed via Groq &rarr; Semantic English translation for B-roll matching &rarr; Roman Hinglish captions | ✅ Verified |
| **Subtitles Script** | Clean Roman Hinglish (English alphabet) only — Zero Devanagari script drift | ✅ Verified |
| **Primary Brand Color** | **Sunset Orange / Amber (`#EA580C` / `#F97316`)** as the single primary brand color. Neutral canvas (`#FFFFFF`), energetic orange gradient CTA buttons (`from-orange-600 via-amber-600 to-orange-500`), slate borders (`#E2E8F0`), and emerald (`#10B981`) strictly for success/trust badges. | ✅ Verified |

---

## 2. Executive Positioning & Value Hook

- **Platform Identity**: **All-in-One AI Video Creation Platform with 10+ Purpose-Built Studios**
- **Studio Count Constants (`constants/studios.ts`)**:
  - `STUDIO_COUNT_PHRASE`: `"10+"`
  - `STUDIO_COUNTS.TOTAL`: `15`
  - `STUDIO_COUNTS.VIDEO_ONLY`: `14` (8 Vertical 9:16 + 6 Widescreen 16:9)
  - `STUDIO_COUNTS.UTILITY_AUDIO`: `1`
- **Main Hero Headline**: `"Don't edit, just speak."`
- **Subtitle**: `"Upload audio or video. Get a complete, studio-quality video in minutes with AI."`
- **Hero CTA**:
  - Primary Button: `Start Creating Free →` &rarr; [`/dashboard`](/dashboard)
- **Hero Social Proof & Trust Strip**:
  - `★★★★★ 4.9 / 5.0`
  - `Free Trial on Signup`
  - `No Credit Card Required`
  - `No Watermark on Paid Plans`
- **Core Value Highlights**: ⚡ Fast Cloud Rendering (From 60s for Shorts) • 🛡️ Zero Watermark on Paid Plans • ✅ 1080p Full HD Export • ✨ Hindi & Regional Audio to English B-Roll Visuals.

---

## 3. Master Duration, Format & Credit Matrix (15 Total Studios)

The platform provides **15 distinct studios** categorized into 3 format tabs. Every studio operates on its own dedicated processing pipeline:

### A. 16:9 Widescreen Cinema & YouTube Studios (6 Studios — Up to 5 Min / 300s)

| Studio / Video Type | Aspect Ratio | Max Duration | Credit Pricing | Audio & Asset Pipeline |
| :--- | :---: | :---: | :---: | :--- |
| **Faceless Video** | **16:9 Widescreen** | **Up to 5 Min (300s)** | **1 Min = 1 Credit** (1–5 Cr max) | Voiceover / Script &rarr; Groq Whisper &rarr; AI Scene Director translates regional speech to English B-roll keywords &rarr; AWS Lambda 1080p render. |
| **Book Summary Video** | **16:9 Widescreen** | **Up to 5 Min (300s)** | **1 Min = 1 Credit** (1–5 Cr max) | Narration audio + optional notes &rarr; Groq Whisper &rarr; 8 chapter layout cards & kinetic takeaway notes &rarr; AWS Lambda 1080p render. |
| **Image to Video AI** | **16:9 Widescreen** | **Up to 5 Min (300s)** | **1 Min = 1 Credit** (1–5 Cr max) | Spoken audio + photos &rarr; Ken Burns 3D smooth camera parallax & motion transitions &rarr; AWS Lambda 1080p render. |
| **YouTube Subtitle Generator** | **16:9 Widescreen** | **Up to 5 Min (300s)** | **FREE • 5 Daily** (or 1 Min = 1 Cr) | Widescreen video/audio &rarr; Burnt-in Western style subtitles with bottom scrubber safe-zone clearance. |
| **AI Video Generator** | **16:9 Widescreen** | **Up to 5 Min (300s)** | **1 Min = 1 Credit** (1–5 Cr max) | Prompt-to-production creative director multitrack video suite (Coming Soon banner). |
| **AI YouTube Video Polisher** | **16:9 Widescreen** | **Up to 5 Min (300s)** | **1 Min = 1 Credit** (1–5 Cr max) | Raw recording &rarr; Auto silence jump-cuts, dynamic camera zoom punch-ins (+12%) & PIP overlay layers. |

### B. 9:16 Vertical Shorts & Reels Studios (8 Studios — Up to 90s)

| Studio / Video Type | Aspect Ratio | Max Duration | Credit Pricing | Audio & Asset Pipeline |
| :--- | :---: | :---: | :---: | :--- |
| **Auto Caption Generator** | **9:16 Vertical** | **Up to 90s (90s)** | **FREE • 5 Daily** (0 Credits, sign-in only) | Vertical video/audio &rarr; Groq Whisper frame-accurate timestamps &rarr; Word-by-word kinetic animated subtitles (.SRT/.VTT export). |
| **Faceless Shorts** | **9:16 Vertical** | **Up to 90s (90s)** | **1 Credit / Video** | Spoken voiceover &rarr; AI Hook detection &rarr; Vertical stock B-roll visuals & kinetic subtitle overlay. |
| **Whiteboard Animation** | **9:16 Vertical** | **Up to 90s (90s)** | **1 Credit / Video** | Spoken narration &rarr; Hand-drawn marker stickman explainer scenes with ink drawing animation. |
| **Compare Explainer** | **9:16 Vertical** | **Up to 90s (90s)** | **1 Credit / Video** | Voiceover + exactly 2 images &rarr; Side-by-side comparison with animated stickman presenter & winner badge. |
| **Long Video to Clips** (`longVideoClips`) | **Source: 16:9 / 9:16**<br/>**Output: 9:16** | **Input: Up to 2h**<br/>**Clips: 30s–60s** | **1 Credit / Clip** (1 clip = 1 Cr, 5 clips = 5 Cr) | Long audio chunking &rarr; AI Hook Detection & Viral Retention Scoring &rarr; Cuts vertical shorts. |
| **Long Video Promo** | **9:16 Vertical** | **Up to 90s (90s)** | **1 Credit / Video** | YouTube video teaser with thumbnail card, channel handle, and animated watch CTA layout. |
| **Split Screen Explainer** | **9:16 Vertical** | **Up to 90s (90s)** | **1 Credit / Video** | Creator facecam at bottom with kinetic explainer graphics & chapter tracker at top. |
| **AI Shorts Polisher** | **9:16 Vertical** | **Up to 90s (90s)** | **1 Credit / Video** | Raw vertical reel &rarr; Auto silence jump-cuts, camera zoom punch-ins (+12%) & PIP overlay layers. |

### C. Audio Utility Studio (1 Studio — Up to 5 Min / 300s)

| Studio / Tool Name | Kind | Max Duration | Credit Pricing | Pipeline Details |
| :--- | :---: | :---: | :---: | :--- |
| **AI Studio Audio Cleaner** | **Audio Utility** | **Up to 5 Min (300s)** | **1 Credit** | Voice audio &rarr; Groq Whisper transcription &rarr; Retake mistakes detection, background room denoise & 48kHz studio master audio export. |

### D. Master Free Tier Architecture (Zero Confusion Standard)

To eliminate any confusion between "Free Daily Videos" vs "Free Trial Credits", Itnavideo operates on one unified rule:

| Tier / Model | Studios Included | Quota & Refill | Credit Cost | Watermark Status | Commercial Rights |
| :--- | :--- | :---: | :---: | :---: | :---: |
| **1. Free Daily Subtitles Engine** | **Auto Caption** (9:16) & **YouTube Subtitles** (16:9) | **5 Free Videos Daily** (Refreshes every 24h) | **0 Credits** | Subtle Top-Right Watermark | Personal / Creator |
| **2. Free Trial Studio Credit** | **All 13 Video Studios** (Faceless Video, Whiteboard, Book Summary, Compare, Clips, etc.) | **1 Welcome Credit** (One-time on signup, no card) | **Consumes 1 Cr** (Tests 1 full Short or 1 min 16:9) | Subtle Top-Right Watermark | Evaluation |
| **3. Paid Plans** (Starter, Growth, Pro) | **All 15 Video & Audio Studios** | **100 to 500 Credits Monthly** | 1 Cr / Short<br/>1 Cr / Min 16:9 | **100% Unbranded (Zero Watermark)** | Full Commercial License |

> [!IMPORTANT]
> **Clear Rule for Users & Marketing**:
> 1. **Subtitle Tools Only**: The "5 free daily videos" rule applies **exclusively to Auto Caption (9:16) and YouTube Subtitles (16:9)**. It does not apply to heavy AI video generators.
> 2. **No Rollover ("Up to 150/mo")**: The 5-video allowance resets every 24 hours at midnight and **never rolls over**. If marketing mentions a monthly figure, it must strictly be phrased as **"Up to 150 free captioned videos/month"** (5/day × 30 days of active usage).
> 3. **16:9 Creation Studios are Credit-Based**: Heavy 16:9 creation studios (Faceless Video, Book Summary, Image to Video AI) are **NOT** free daily. They are billed at **1 Min = 1 Credit** ($\lceil\text{duration}/60\rceil$). New signups get **1 Free Welcome Credit** to test these studios before buying.
> 4. **Watermarks**: Free outputs include a subtle brand mark; all paid plans are **100% watermark-free**.

---

## 4. Hindi & Regional Audio Translation Architecture

When creators upload Hindi, Hinglish, or regional Indian language voiceovers, our stock B-roll asset library is indexed in English:
1. **Transcription**: Groq Whisper extracts word-level sync timestamps (~33ms frame-accurate resolution; Fallback: Google Gemini 2.0 Flash in `asia-south1`).
2. **Semantic Translation for Visuals**: The AI Scene Director translates regional speech concepts into English search keywords to match relevant HD stock B-roll, visuals, and sound effects.
3. **Subtitles Rendering**: Captions are rendered in clean, phonetic **Roman Hinglish / English** script (zero Devanagari script drift).
4. **Signature Value Proposition**: *"Upload Hindi or Regional Audio &rarr; AI Matches English B-Roll Visuals &rarr; Exports 1080p MP4"*.

---

## 5. Section-by-Section Component Architecture (`app/page.tsx`)

The Homepage is composed of 10 modular components in exact vertical order:

```
app/page.tsx
 ├── 1. Hero (`components/landing/Hero.tsx`)
 ├── 2. PlatformMarqueeTicker (`components/landing/PlatformMarqueeTicker.tsx`)
 ├── 3. TransformationShowcaseSection (`components/landing/TransformationShowcaseSection.tsx`)
 ├── 4. TenStudiosHubArchitecture (`components/landing/TenStudiosHubArchitecture.tsx`)
 ├── 5. TestimonialSection (`components/landing/TestimonialSection.tsx`)
 ├── 6. HomepagePricing (`components/landing/PricingSection.tsx`)
 ├── 7. FAQSection (`components/FAQSection.tsx`)
 ├── 8. FreeCreatorUtilitiesSection (`components/landing/FreeCreatorUtilitiesSection.tsx`)
 ├── 9. HomepageFinalCta (`components/landing/HomepageValueSections.tsx`)
 └── 10. StickyMobileActionBar (`components/landing/StickyMobileActionBar.tsx`)
```

> [!NOTE]
> Per Rule 0.7 of `AGENTS.md`, all eyebrow pill tags, kickers, and spark chips have been removed from section headings. Headlines remain bold, uncluttered, and direct.

### Component Breakdown

#### 1. Hero Section (`components/landing/Hero.tsx`)
- **Theme**: Crisp white canvas with warm amber-orange halo lighting (`rgba(249, 115, 22, 0.09)`).
- **Headline**: `"Don't edit, just speak."` (with radiant orange gradient on `"just speak."`).
- **Subtitle**: `"Upload audio or video. Get a complete, studio-quality video in minutes with AI."`
- **CTA**: Single bold pill button `Start Creating Free` (`/dashboard`).
- **Social Proof**: `★★★★★ 4.9 / 5.0 • Free Trial on Signup • No Credit Card Required • No Watermark on Paid Plans`.

#### 2. Platform Marquee Ticker (`components/landing/PlatformMarqueeTicker.tsx`)
- High-impact infinite marquee with dual aspect ratios: `16:9 Widescreen` and `9:16 Shorts & Reels`.
- Card height: **280px (mobile) / 340px (tablet) / 380px (desktop)** for prominent visibility.
- Showcases **14 Video Studios** (8 Vertical 9:16 + 6 Widescreen 16:9) with native uncropped aspect ratio and Cloudinary edge CDN delivery.

#### 3. Transformation Showcase (`components/landing/TransformationShowcaseSection.tsx`)
- Headline: `"From Video Editing Frustration to Instant AI Creation"`.
- Subtitle: Explains how creators skip timelines and plugins by uploading raw audio or video.
- 3 Core Value Pillars:
  - Step 1: Upload (Voiceover audio or raw video).
  - Step 2: AI Directs (Scene planning, B-roll visuals, sound).
  - Step 3: Cloud Export (Full 1080p HD render on AWS Lambda).

#### 4. Studios Hub Architecture (`components/landing/TenStudiosHubArchitecture.tsx`)
- Anchor: `#video-types`.
- Section Title: `"AI Video Studios & Workflows"`.
- **Capsule Tab Filter Bar**:
  - `📱 9:16 Shorts & Reels (8)` &rarr; Shows 8 vertical studios.
  - `📺 16:9 YouTube Cinema (6)` &rarr; Shows 6 widescreen studios.
  - `🎙️ Studio Audio Cleaner (1)` &rarr; Shows audio utility studio.
  - `✨ All Studios (15 Total)` &rarr; Shows all 15 studios simultaneously.
- Studio Cards: Rich cards with preview media, feature badges, and direct `/dashboard/*` access links.

#### 5. Testimonial Section (`components/landing/TestimonialSection.tsx`)
- Verified creator reviews across YouTube explainers, short-form agencies, and international creators.
- Highlights: 16:9 Faceless Video speed, zero laptop freezing on cloud renders, and high transcription accuracy.

#### 6. Pricing Section (`components/landing/PricingSection.tsx`)
- **Dynamic local currency quotes:**
  - **Starter**: $19.99 / ₹999 (100 credits / 30-day pack)
  - **Growth**: $39.99 / ₹1,999 (250 credits / 30-day pack)
  - **Pro**: $69.99 / ₹3,499 (600 credits / 30-day pack)
- Duration rates emphasized: 1 Min = 1 Credit for 16:9, 1 Credit flat for 9:16 Shorts.

#### 7. FAQ Section (`components/FAQSection.tsx`)
- Comprehensive answers covering:
  - 16:9 YouTube video support (up to 5 minutes).
  - 9:16 Shorts support (up to 90 seconds).
  - Credit consumption rules (1 Min = 1 Credit, 1 Credit / Clip for viral clips).
  - Hindi and regional audio translation.
  - Cloud rendering with zero local laptop load.

#### 8. Free Creator Utilities (`components/landing/FreeCreatorUtilitiesSection.tsx`)
- 4 Quick-access creator tools:
  1. Free WAV to MP3 Converter (`/wav-to-mp3`)
  2. YouTube Subtitle Generator (`/video-types/youtube-subtitle-generator`)
  3. AI Studio Audio Cleaner (`/dashboard/audio-cleaner`)
  4. Image to Video AI Generator (`/tools/image-to-video-ai`)

#### 9. Final CTA (`components/landing/HomepageValueSections.tsx`)
- Title: `"Ready to create your first AI video?"`
- Subtitle: `"Instant Cloud Access • 1080p Full HD Export • 1 Min = 1 Credit"`.
- Button: `Start Creating Free` (`/dashboard`).
- Trust note: `Free Trial on Signup • No Credit Card Required • No Watermark on Paid Plans`.

#### 10. Sticky Mobile Action Bar (`components/landing/StickyMobileActionBar.tsx`)
- Rendered on mobile screens (`md:hidden`).
- Activates on upward scroll after 120px with safe-area padding.
- Displays `{STUDIO_COUNT_EXACT_LABEL}` (`15 Studios`) with `Instant Studio Access • 1080p HD`.
- Fast 1-tap `Get Started` button directing to `/dashboard`.

---

## 6. Brand Design Tokens (Rule 9 — Orange Primary System)

All dual-primary conflicts have been eliminated. **Sunset Orange / Amber** is the single primary brand color, backed by neutral white and obsidian dark contrast:

```css
/* Core Brand Hierarchy (Orange Primary) */
--primary-brand   : #EA580C; /* Vibrant Sunset Orange */
--primary-accent  : #F97316; /* Electric Orange */
--primary-amber   : #F59E0B; /* Warm Amber Accent */
--primary-gradient: linear-gradient(to right, #EA580C, #F97316, #F59E0B);

/* Neutral System */
--canvas-light    : #FFFFFF; /* High-Signal White Canvas */
--canvas-card     : #FAFAFA; /* Subtle Card Surface */
--surface-dark    : #09090B; /* Deep Obsidian Contrast */
--border-subtle   : #E2E8F0; /* Clean Slate Border */
--text-primary    : #09090B; /* Zinc-950 Text */
--text-muted      : #71717A; /* Zinc-500 Neutral Muted */

/* Semantic Accents (Non-Primary) */
--status-success  : #10B981; /* Emerald Green: Trust badges & checks ONLY */
```

---

## 7. Developer & Maintenance Rules

1. **Studio Counts Source of Truth**: Always import counts from `@/constants/studios`. Never hardcode `"12"`, `"13"`, or `"14"` in component copy.
2. **Safe Marketing Phrase**: Use `"10+ Purpose-Built Studios"` in high-level marketing copy.
3. **Keep `homepage.md` Synchronized**: Whenever copy, pricing, limits, or components in `app/page.tsx` change, update this file immediately.
4. **Mobile First (70% Traffic)**: Always preview changes on 375px mobile viewports.
5. **Zero Local Heavy Compute (Rule 0)**: Never run local Remotion renders on developer machines.
6. **Terminal Cleanliness (Rule 0.4)**: Verify zero hanging background tasks after editing.
