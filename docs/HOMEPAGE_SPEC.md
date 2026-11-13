# Itnavideo — Homepage Master Specification & Architecture Guide

> **Single Source of Truth** for the Itnavideo Homepage (`app/page.tsx`).  
> All copy, positioning, studio sections, component hierarchies, design tokens, and conversion routes are documented here.

---

## 1. Executive Positioning & Core Mission

| Dimension | Standard / Policy |
| :--- | :--- |
| **Platform Identity** | **All-in-One AI Video Creation Platform with 10+ Purpose-Built Studios** (Not single-purpose faceless-only). |
| **Kicker / Core Hook** | *"More Than AI — Your Personal Editor"* |
| **Headline** | *"The Free AI Video Generator For Creators & Brands"* |
| **Subtitle** | *"The all-in-one AI video creator for every format. 10+ specialized studios for 16:9 YouTube videos, 9:16 viral shorts, kinetic captions, book summaries, and clips."* |
| **Traffic Ratio (CRO)** | **70% Mobile Visitors / 30% Desktop Visitors**. Every section is designed mobile-first with touch-friendly cards and zero horizontal overflow. |
| **Primary Value Props** | ⚡ **60s Cloud Rendering** • 🛡️ **Zero Watermark** • ✅ **1080p Full HD Export** • ✨ **Hindi & Regional Audio to B-Roll** |

---

## 2. Master Duration, Aspect Ratio & Credit Policy

| Format / Studio | Aspect Ratio | Max Video Length | Credit Cost | Audio & Transcriber Pipeline |
| :--- | :---: | :---: | :---: | :--- |
| **16:9 Long-Form Studios**<br/>*(Faceless Video, Book Summary, Image to Video AI, YouTube Subtitles)* | **16:9 Only** | **Up to 5 Minutes (300s / 9,000 frames)** | **1 Min = 1 Credit**<br/>(1m=1, 2m=2, 3m=3, 4m=4, 5m=5 Cr max) | Groq Whisper (Fallback: Gemini Flash) &rarr; Regional/Hindi audio semantically translated to English keywords for B-roll matching &rarr; Rendered on AWS Lambda cluster. |
| **9:16 Vertical Shorts Studios**<br/>*(Auto Caption Reel, Compare Explainer, Typography Kinetic, Whiteboard Animation, Long Video Promo)* | **9:16 Only** | **Up to 90 Seconds (90s / 2,700 frames)** | **1 Credit / Video** | Groq Whisper word timestamps &rarr; Motion kinetic captions & overlays &rarr; Rendered on AWS Lambda. |
| **Viral Video Clips**<br/>*(`longVideoClips`)* | **Source: 16:9 / 9:16**<br/>**Output: 9:16 Shorts** | **Input: Up to 2 Hours**<br/>**Output: 30s–60s Clips** | **1 Credit / Clip**<br/>(1 clip = 1 Cr, 5 clips = 5 Cr) | Audio chunking &rarr; AI Hook Detector & Viral Scoring &rarr; Cuts 1080p vertical shorts. |
| **AI Audio Cleaner**<br/>*(Studio Audio Utility)* | **Audio Utility** | **Up to 5 Minutes (300s)** | **1 Credit** | Groq Whisper + Retake & Mistake Detection + Podcast Warmth EQ Mastering &rarr; Studio WAV/MP3. |

---

## 3. Hindi & Regional Audio Translation Architecture

When creators upload Hindi, Hinglish, or regional Indian language voiceovers, our stock B-roll asset library is indexed in English:
1. **Transcription**: Groq Whisper extracts millisecond-accurate word timestamps.
2. **Semantic Translation for Visuals**: The AI Scene Director translates regional speech concepts into English search keywords to match relevant HD stock B-roll, visuals, and sound effects.
3. **Subtitles Rendering**: Captions are rendered in clean, phonetic **Roman Hinglish / English** script (zero Devanagari script drift).
4. **SEO Value**: Promoted on the homepage as a signature differentiator: *"Upload Hindi or Regional Audio &rarr; AI Matches English B-Roll Visuals &rarr; Exports 1080p MP4"*.

---

## 4. Brand Design Tokens & Visual Hierarchy (Rule 9)

```
Primary Light Canvas : #FFFFFF / #FAFAFA / text-slate-900
Primary Dark Frames  : #070B14 / #0C1222 / text-white
Primary Brand Color  : Flame Orange (#FF5722) → Sunset Amber (#FFA000)
Success Status       : Emerald (#10B981)
AI Intelligence Tag  : Sky / Cyan (#06B6D4)
Motion / Style Tag   : Violet / Purple (#8B5CF6)
Speed / Cloud Tag    : Amber (#F59E0B)
Borders & Dividers   : border-slate-200/80 (light) / border-white/10 (dark)
```

---

## 5. Homepage Section Inventory & Component Breakdown

```
app/page.tsx
 ├── 1. Hero (`components/landing/Hero.tsx`)
 ├── 2. Platform Marquee Ticker (`components/landing/PlatformMarqueeTicker.tsx`)
 ├── 3. 16:9 Cinema & Explainer Showcase (`components/landing/FacelessVideoFlagshipShowcase.tsx`)
 ├── 4. How It Works - Platform Journey (`components/landing/HomepageValueSections.tsx`)
 ├── 5. Before & After Efficiency Benchmark (`components/landing/BeforeAfterComparison.tsx`)
 ├── 6. Live Output Previews - Dual Showcase (`components/landing/DualShowcaseTabs.tsx`)
 ├── 7. 10+ Studios Hub Architecture (`components/landing/TenStudiosHubArchitecture.tsx`)
 ├── 8. Pricing Section (`components/landing/PricingSection.tsx`)
 ├── 9. FAQ Section (`components/FAQSection.tsx`)
 ├── 10. Final Conversion CTA (`components/landing/HomepageValueSections.tsx`)
 └── 11. Sticky Mobile Action Bar (`components/landing/StickyMobileActionBar.tsx`)
```

### Detailed Section Breakdown

#### 1. Hero Section (`components/landing/Hero.tsx`)
- **Badge**: `10+ Purpose-Built AI Video Studios` (Flame orange pill)
- **H1 Headline**: `The Free AI Video Generator For Creators & Brands`
- **Subtext**: All-in-one creator pitch covering 16:9 YouTube explainers, 9:16 viral shorts, kinetic captions, book summaries, and clips.
- **CTAs**:
  - Primary: `Start Creating Free →` &rarr; [`/dashboard`](/dashboard) (Direct studio selection).
  - Secondary: `Explore All 10+ Studios` &rarr; [`#video-types`](#video-types).
- **Social Proof**: 4.9/5 stars, 5,000+ Creators on YouTube & TikTok, 4 user avatar bubbles.
- **Value Tags**: 60s Cloud Rendering • Zero Watermark • 1080p Full HD Export • Hindi & Regional Audio to B-Roll.
- **Feature Mockup**: Cloudinary-hosted 3D AI Video Engine window visual (`Hero_Section_Feature_Illustration_3D_AI_Video_Engine_Visual_simsct.png`).

#### 2. Platform Marquee Ticker (`components/landing/PlatformMarqueeTicker.tsx`)
- Continuous scrolling pill marquee with edge fade masks.
- Highlights dual formats: `1920×1080 Widescreen YouTube (Up to 5 Min)` and `1080×1920 Shorts & Reels (Up to 90s)`.
- Core capabilities: `Hindi & Regional Audio to English B-Roll`, `Roman Hinglish + English`, `Word-Synced Kinetic Subtitles`, `Instant Cloud Rendering`, `Zero Local Hardware Lag`.

#### 3. 16:9 Cinema & YouTube Explainer Studio (`components/landing/FacelessVideoFlagshipShowcase.tsx`)
- Positioned as the dedicated widescreen studio (not the only flagship).
- Embeds real YouTube video output (`wg95A8eg7_c`) with custom play trigger and animated pulse ring.
- 4 capability cards: `📚 Book Summaries`, `📺 YouTube Explainers`, `🎙️ Voiceover Sync`, `⏱️ Up to 5 Minutes`.
- CTA: `Open 16:9 Studio` &rarr; [`/dashboard/faceless-video`](/dashboard/faceless-video).

#### 4. How It Works / Platform Journey (`components/landing/HomepageValueSections.tsx`)
- 4 clear creation stages:
  - **Step 01**: Smart Input & Ingest (Audio, podcast, or script).
  - **Step 02**: AI Storyboard & Visual Matcher (Speech transcribed & translated to English keywords for B-roll matching).
  - **Step 03**: Storyboard Review (Inspect scenes, subtitle styles & timings).
  - **Step 04**: 1080p Cloud Export (Download Full HD 30 FPS MP4).
- Right-side Cloudinary illustration: `Step_1_Smart_Input_B-Roll_Matcher_Visual_How_It_Works_ybdykd.png`.

#### 5. Before & After Efficiency Benchmark (`components/landing/BeforeAfterComparison.tsx`)
- Side-by-side pain comparison:
  - **Without AI (5 Hours)**: Manual timeline slicing, tedious subtitle typing, stock footage searching, laptop render thrashing, $70+/mo tool stack. Output: 1-2 videos/week.
  - **With Itnavideo (60 Seconds)**: 1-click media ingest, automated kinetic subtitles, AI B-roll & SFX matching, AWS Lambda cloud cluster, all 10 video types in one place. Output: 10+ videos/day.

#### 6. Live Output Previews — Dual Showcase (`components/landing/DualShowcaseTabs.tsx`)
- Interactive toggle between:
  - **Tab 1: Kinetic Subtitles (9:16)**: Autoplays real subtitle presets (Hormozi, MrBeast, Submagic Glow, Shorts Karaoke, Vox, Ali Abdaal, etc.) with real word-by-word highlights.
  - **Tab 2: Image to Video AI (16:9)**: Autoplays cinematic parallax 1080p MP4 videos with audio toggle.
- Hover-pause continuous marquee track.

#### 7. 10+ Studios Hub Architecture (`components/landing/TenStudiosHubArchitecture.tsx`)
- Obsidian dark theme (`#070B14`, `#0C1222`) studio environment.
- Filter chips: `All Studios (11)`, `🖥️ 16:9 Widescreen (4)`, `📱 9:16 Shorts & Reels (6)`, `🎙️ Audio Utility (1)`.
- **16:9 Section**: Faceless Video, Book Summary Video, Image to Video AI, YouTube Subtitles Generator. *(Badge: 1 Min = 1 Cr • Max 5m)*.
- **9:16 Section**: Auto Caption Generator, Kinetic Typography, Whiteboard Animation, Compare Explainer, Long Video to Clips, Long Video Promo. *(Badge: 1 Credit / Video • Clips: 1 Cr/Clip)*.
- **Utility**: AI Studio Audio Cleaner. *(Badge: 1 Credit)*.

#### 8. Pricing Section (`components/landing/PricingSection.tsx`)
- Displays `SubscriptionPricingCards` with automatic currency detection (INR / USD / EUR / GBP / AED / THB).
- Plans: Starter ($9 / ₹499), Growth ($19 / ₹999), Pro ($39 / ₹1,999).

#### 9. FAQ Section (`components/FAQSection.tsx`)
- Categorized chips (`All`, `Product & AI`, `Video Workflows`, `Credits & Pricing`).
- Detailed answers for resolutions (1080p 30 FPS), 16:9 max duration (5 min), 9:16 max duration (90s), credit pricing rules (1 min = 1 cr, 1 clip = 1 cr), and regional audio to English B-roll translation.

#### 10. Final Conversion CTA (`components/landing/HomepageValueSections.tsx`)
- Full-width callout box: *"Ready to create your first AI video? No credit card required."*
- Primary CTA: `Start Creating Free →` &rarr; [`/dashboard`](/dashboard).
- Secondary CTA: `View Pricing` &rarr; [`/pricing`](/pricing).

#### 11. Sticky Mobile Action Bar (`components/landing/StickyMobileActionBar.tsx`)
- **Target Audience**: Built specifically for the 70% mobile visitor demographic.
- Appears after 120px scroll; fixes to viewport bottom (`md:hidden`).
- Safe-area bottom padding for mobile home indicators.
- Quick value prompt: *"⚡ 10+ Studios • 1 Free Credit • No Card"*.
- High-conversion gradient button: *"Start Free →"*.

---

## 6. SEO, Schema & Indexing Specifications

### JSON-LD Structured Data
- **`WebSite`**: Canonical `https://www.itnavideo.com`.
- **`SoftwareApplication`**: Multimedia application category, free trial + creator plan offers.
- **`FAQPage`**: Rich schema questions for Google Search SERP snippets.

### Sitemap & Search Engine Distribution
- **Collector**: [`lib/seo/public-url-collector.ts`](file:///c:/Users/user/.gemini/antigravity/scratch/itnavideo/lib/seo/public-url-collector.ts) dynamically compiles all core pages, video type studios, tools, and 80+ blog posts.
- **Real-Time Notification**: Verified via IndexNow API (`public/itnavideo.txt`) and exposed in `robots.txt`.

---

## 7. Modification & Development Rules

1. **No Hardcoded Durations**: Always reference `LONG_FORM_CAPTION_MAX_SECONDS` (300s / 5 min) and `SHORT_REEL_MAX_SECONDS` (90s).
2. **Mobile First**: Whenever updating homepage components, test layout on a 375px–414px mobile viewport first. Ensure text sizes never exceed `text-4xl` on mobile and buttons stack vertically.
3. **No Heavy Daemons Locally**: Follow Rule 0 — do not run local Remotion studio or rendering jobs on the 4GB RAM developer laptop.
4. **Update Spec After Changes**: If any new studio, pricing tier, or section is modified, immediately keep this `docs/HOMEPAGE_SPEC.md` synchronized.
