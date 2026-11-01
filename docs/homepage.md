# Itnavideo — Homepage Master Architecture & Spec (`homepage.md`)

> **Single Source of Truth** for the Itnavideo Homepage (`app/page.tsx`).  
> Is ek file se hi bina kisi detailed code audit ke homepage ke sabhi components, copy, limits, credit rules aur visual tokens instantly samajh aa jayenge.

---

## 1. Quick Audit & Verification Checklist (30-Second Audit)

| Checkpoint | Expected Standard | Status |
| :--- | :--- | :---: |
| **Platform Pitch** | All-in-One AI Video Creation Platform with 10+ Purpose-Built Studios (No single-studio bias) | ✅ Verified |
| **16:9 Max Duration** | **Strictly 5 Minutes Max (300s / 9,000 frames)** for all plans | ✅ Verified |
| **9:16 Max Duration** | **Strictly 90 Seconds Max (90s / 2,700 frames)** | ✅ Verified |
| **16:9 Credit Pricing** | **1 Min = 1 Credit** (1m=1, 2m=2, 3m=3, 4m=4, 5m=5 Cr max) | ✅ Verified |
| **9:16 Credit Pricing** | **1 Credit / Video** | ✅ Verified |
| **Viral Clips Pricing** | **1 Credit / Clip** (1 clip = 1 Cr, 5 clips = 5 Cr) | ✅ Verified |
| **Mobile-First CRO** | **70% Mobile / 30% Desktop**. Sticky Mobile Action Bar appears briefly on upward scroll, with safe-area padding | ✅ Verified |
| **Regional Audio** | Transcribed via Groq &rarr; Translated to English keywords to match stock B-roll &rarr; Roman Hinglish subtitles | ✅ Verified |
| **Subtitles Script** | Clean Roman Hinglish (English alphabet) only — Zero Devanagari script | ✅ Verified |
| **Brand Colors** | White canvas (`#FFFFFF`), Obsidian dark (`#070B14`), Flame Orange (`#FF5722` &rarr; `#FFA000`) | ✅ Verified |

---

## 2. Executive Positioning & Value Hook

- **Platform Identity**: **All-in-One AI Video Creation Platform with 10+ Purpose-Built Studios**
- **Kicker Badge**: `"10+ Purpose-Built AI Video Studios"`
- **Main Headline**: `"The Free AI Video Generator For Creators & Brands"`
- **Subtitle**: `"The all-in-one AI video creator for every format. 10+ specialized studios for 16:9 YouTube videos, 9:16 viral shorts, kinetic captions, book summaries, and clips."`
- **Primary CTAs**:
  - Primary Button: `Start Creating Free →` &rarr; [`/dashboard`](/dashboard) (Direct studio selection).
  - Secondary Button: `Explore All 12 Studios` &rarr; [`#video-types`](#video-types).
- **Trust Elements**: 4.9/5 stars rating, 5,000+ creators on YouTube & TikTok, 4 user avatar bubbles.
- **Core Value Tags**: ⚡ 60s Cloud Rendering • 🛡️ Zero Watermark • ✅ 1080p Full HD Export • ✨ Hindi & Regional Audio to B-Roll.

---

## 3. Master Duration, Format & Credit Matrix

| Studio / Video Type | Aspect Ratio | Max Video Duration | Credit Pricing | Audio & Asset Pipeline |
| :--- | :---: | :---: | :---: | :--- |
| **Faceless Video** | **16:9 Widescreen** | **Up to 5 Min (300s)** | **1 Min = 1 Credit** (Max 5 Cr) | Groq Whisper &rarr; AI Scene Director translates regional speech to English B-roll keywords &rarr; AWS Lambda 1080p. |
| **Book Summary Video** | **16:9 Widescreen** | **Up to 5 Min (300s)** | **1 Min = 1 Credit** (Max 5 Cr) | Book narration &rarr; Chapter timestamps & kinetic lesson cards &rarr; AWS Lambda 1080p. |
| **Image to Video AI** | **16:9 Widescreen** | **Up to 5 Min (300s)** | **1 Min = 1 Credit** (Max 5 Cr) | User photos + speech &rarr; Ken Burns smooth camera parallax & transitions &rarr; AWS Lambda 1080p. |
| **YouTube Subtitle Generator** | **16:9 Widescreen** | **Up to 5 Min (300s)** | **1 Min = 1 Credit** (Max 5 Cr) | Widescreen video/audio &rarr; Burnt-in Western style subtitles with TV scrubber safe-zone. |
| **Auto Caption Generator** | **9:16 Vertical** | **Up to 90s (90s)** | **1 Credit / Video** | Word-by-word kinetic animated subtitles (Hormozi, MrBeast, Submagic styles). |
| **Compare Explainer** | **9:16 Vertical** | **Up to 90s (90s)** | **1 Credit / Video** | Dual-column side-by-side comparison with animated stickman presenter. |
| **Kinetic Typography** | **9:16 Vertical** | **Up to 90s (90s)** | **1 Credit / Video** | Kinetic speech-to-text text blitz motion popping to audio beats. |
| **Whiteboard Animation** | **9:16 Vertical** | **Up to 90s (90s)** | **1 Credit / Video** | Speech to hand-drawn marker whiteboard lesson animation. |
| **Long Video Promo** | **9:16 Vertical** | **Up to 90s (90s)** | **1 Credit / Video** | YouTube video teaser with thumbnail card, channel handle, and watch CTA. |
| **Long Video to Clips** (`longVideoClips`) | **Source: 16:9/9:16**<br/>**Output: 9:16** | **Input: Up to 2h**<br/>**Clips: 30s–60s** | **1 Credit / Clip** (1 clip = 1 Cr, 5 clips = 5 Cr) | Long audio chunking &rarr; AI Hook Detection & Viral Scoring &rarr; Cuts vertical shorts. |
| **AI Audio Cleaner** | **Audio Utility** | **Up to 5 Min (300s)** | **1 Credit** | Voice audio &rarr; Retake detection, background denoise & podcast warmth EQ mastering. |

---

## 4. Hindi & Regional Audio Translation Architecture

When creators upload Hindi, Hinglish, or regional Indian language voiceovers, our stock B-roll asset library is indexed in English:
1. **Transcription**: Groq Whisper extracts millisecond-accurate word timestamps.
2. **Semantic Translation for Visuals**: The AI Scene Director translates regional speech concepts into English search keywords to match relevant HD stock B-roll, visuals, and sound effects.
3. **Subtitles Rendering**: Captions are rendered in clean, phonetic **Roman Hinglish / English** script (zero Devanagari script drift).
4. **SEO Value**: Promoted on the homepage as a signature differentiator: *"Upload Hindi or Regional Audio &rarr; AI Matches English B-Roll Visuals &rarr; Exports 1080p MP4"*.

---

## 5. Complete Section-by-Section Component Map

```
app/page.tsx
 ├── 1. HeroSection (`components/landing/Hero.tsx`)
 ├── 2. PlatformMarqueeTicker (`components/landing/PlatformMarqueeTicker.tsx`)
 ├── 3. FacelessVideoFlagshipShowcase (`components/landing/FacelessVideoFlagshipShowcase.tsx`)
 ├── 4. PlatformJourney (`components/landing/HomepageValueSections.tsx`)
 ├── 5. BeforeAfterComparison (`components/landing/BeforeAfterComparison.tsx`)
 ├── 6. DualShowcaseTabs (`components/landing/DualShowcaseTabs.tsx`)
 ├── 7. TenStudiosHubArchitecture (`components/landing/TenStudiosHubArchitecture.tsx`)
 ├── 8. PricingSection (`components/landing/PricingSection.tsx`)
 ├── 9. FAQSection (`components/FAQSection.tsx`)
 ├── 10. HomepageFinalCta (`components/landing/HomepageValueSections.tsx`)
 └── 11. StickyMobileActionBar (`components/landing/StickyMobileActionBar.tsx`)
```

### Component Details

#### 1. Hero Section (`components/landing/Hero.tsx`)
- **Theme**: Crisp white canvas with warm ambient glow.
- **Visual**: Cloudinary 3D AI Video Engine window (`Hero_Section_Feature_Illustration_3D_AI_Video_Engine_Visual_simsct.png`).
- **CTAs**: Primary `Start Creating Free →` (`/dashboard`), Secondary `Explore All 12 Studios` (`#video-types`).

#### 2. Platform Marquee Ticker (`components/landing/PlatformMarqueeTicker.tsx`)
- Auto-scrolling marquee with dual aspect ratios: `1920×1080 Widescreen YouTube (Up to 5 Min)` and `1080×1920 Shorts & Reels (Up to 90s)`.
- Features `Hindi & Regional Audio to English B-Roll` with clean `EN / HI` Roman script icon.

#### 3. 16:9 Cinema & YouTube Studio (`components/landing/FacelessVideoFlagshipShowcase.tsx`)
- Dedicated 16:9 Widescreen showcase.
- Embeds YouTube video output (`wg95A8eg7_c`) with pulse ripple play trigger.
- 4 capability badges: Book Summaries, YouTube Explainers, Voiceover Sync, Up to 5 Minutes.

#### 4. How It Works / 4-Step Journey (`components/landing/HomepageValueSections.tsx`)
- **Step 1**: Smart Media Input & Ingest.
- **Step 2**: AI Storyboard & Visual Matcher (Translates Hindi/regional audio to English B-roll keywords).
- **Step 3**: Storyboard Review (Inspect scenes, subtitles & timings).
- **Step 4**: 1080p Cloud Export (Full HD 30 FPS MP4).

#### 5. Before & After Efficiency Benchmark (`components/landing/BeforeAfterComparison.tsx`)
- Side-by-side pain comparison:
  - Without AI: 5 Hours, timeline lag, laptop render thrashing, $70+/mo tool stack.
  - With Itnavideo: 60 Seconds, 1-click ingest, automated kinetic subtitles, AWS Lambda rendering.

#### 6. Live Output Previews (`components/landing/DualShowcaseTabs.tsx`)
- Interactive switcher:
  - **Tab 1: Kinetic Subtitles (9:16)**: Live playable video presets (Hormozi, MrBeast, Submagic, etc.).
  - **Tab 2: Image to Video AI (16:9)**: Live playable cinematic parallax videos.

#### 7. 12 Studios Hub Architecture (`components/landing/TenStudiosHubArchitecture.tsx`)
- Obsidian dark theme (`#0c0a09`, `#070B14`) with ambient Flame Orange & Sunset Amber glow.
- **Unified Mobile & Desktop Format Capsule Bar**:
  - Replaces clunky 2x2 mobile boxes with a sleek, horizontally-scrollable glass capsule pill bar (`bg-zinc-950/95`, `border-white/10`).
  - Active Tab: Vibrant Flame Orange gradient (`from-[#FF5722] to-[#E64A19]`) with white typography, white icon, and high-contrast count badge.
  - 4 Categorical filter tabs: `📱 9:16 Shorts & Reels (8)`, `📺 16:9 YouTube Cinema (4)`, `🎙️ Studio Audio Cleaner (1)`, `✨ All Studios (13)`.
- Cards with live Cloudinary preview images and direct studio links.

#### 8. Pricing Section (`components/landing/PricingSection.tsx`)
- Dynamic local currency quotes: Starter ($9 / ₹499), Growth ($19 / ₹999), Pro ($39 / ₹1,999).

#### 9. FAQ Section (`components/FAQSection.tsx`)
- Comprehensive answers covering video resolutions, 5-minute 16:9 limit, 1 credit per minute, 1 credit per clip for viral clips, and regional audio support.

#### 10. Final CTA (`components/landing/HomepageValueSections.tsx`)
- High-conversion callout: *"Ready to create your first AI video? No credit card required."*

#### 11. Sticky Mobile Action Bar (`components/landing/StickyMobileActionBar.tsx`)
- Dedicated mobile widget for the 70% mobile visitor demographic (`md:hidden`).
- Fixes to bottom viewport with safe-area padding after 120px scroll.
- Direct CTA: *"Start Free →"* with *"⚡ 12 Studios • 1 Free Credit"*.

---

## 6. Brand Design Tokens (Rule 9)

```css
/* Core Colors */
--canvas-light : #FFFFFF;
--canvas-card  : #FAFAFA;
--canvas-dark  : #070B14;
--frame-dark   : #0C1222;
--text-primary : #0F172A;
--text-muted   : #64748B;
--primary-cta  : linear-gradient(to right, #FF5722, #FF7043, #FFA000);
--status-green : #10B981;
--tag-speech   : #06B6D4;
--tag-motion   : #8B5CF6;
--tag-speed    : #F59E0B;
```

---

## 7. Developer & Maintenance Rules

1. **Keep `homepage.md` Synchronized**: Whenever copy, pricing, limits, or components in `app/page.tsx` change, update this file immediately.
2. **Mobile First**: Always preview on 375px mobile viewports. 70% of visitors are mobile.
3. **Zero Local Heavy Compute (Rule 0)**: Never run local Remotion renders on developer machines.
4. **Terminal Cleanliness (Rule 0.4)**: Verify zero hanging background tasks after editing.


## Animated Fan Deck
Recently added the Framer Motion-based AnimatedFanDeck component to the homepage, which replaces static lists with an interactive 3D fanning effect for video types.
