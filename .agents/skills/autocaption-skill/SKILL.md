---
name: autocaption-skill
description: Dedicated skill for Auto Caption Generator (/dashboard/auto-caption). Covers 9:16 vertical karaoke subtitle reel workflows, AutoCaptionDualTabStudio.tsx, AutoCaptionPageClient.tsx, 32 subtitle presets, Groq Whisper transcription, FREE-tier quota (5 videos/day), and AUTO_CAPTION_GENERATOR Remotion composition.
---

# Auto Caption Generator — Dedicated Studio Skill

This skill contains the comprehensive domain knowledge, UI rules, stepper workflow, component architecture, and Remotion composition specs for **Auto Caption Generator** (`autoCaption`).

---

## 1. Studio Quick Reference

| Property | Value |
|---|---|
| **Video Type ID** | `autoCaption` / `AUTO_CAPTION_GENERATOR` |
| **Dashboard Route** | `/dashboard/auto-caption` |
| **Studio Component** | `components/dashboard/autocaption/AutoCaptionDualTabStudio.tsx` |
| **Page Client** | `components/dashboard/subpages/AutoCaptionPageClient.tsx` |
| **Landing Page** | `app/(marketing)/auto-caption-generator/page.tsx` |
| **API Mode** | `autoCaption` |
| **Remotion Composition** | `AUTO_CAPTION_GENERATOR` |
| **Template Directory** | `remotion/templates/AUTO_CAPTION_GENERATOR/` |
| **Aspect Ratio** | Strictly **9:16 Vertical** (`1080×1920`) |
| **Frame Rate** | 30 FPS |
| **Max Duration** | **90 Seconds** (2,700 frames @ 30 FPS) |
| **Credit Cost** | **FREE • 5 Videos/Day** (0 Credits deducted) |
| **Paywall** | None — free for all signed-in users |
| **Watermark** | Yes, for free-tier users (`watermark: true` if no active paid plan) |

---

## 2. Flexible Stepper Workflow (Rule 7.3 Compliance)

The studio utilizes `components/dashboard/shared/StudioStepper.tsx` with a dynamic 4-step sequence:

```ts
export const AUTO_CAPTION_STEPS = [
  { step: 1, title: "Upload",   desc: "Video or Audio File" },
  { step: 2, title: "Music",    desc: "Background Soundtrack" },
  { step: 3, title: "Style",    desc: "Caption Theme & Position" },
  { step: 4, title: "Preview",  desc: "9:16 Shorts Simulator" },
] as const;

// State declaration — NEVER use union types like useState<1|2|3|4>:
const [currentStep, setCurrentStep] = useState<number>(1);

// Final step check — NEVER hardcode currentStep === 4:
{currentStep === AUTO_CAPTION_STEPS.length && <PreviewStep />}

// Next button label lookup:
const nextStepTitle = AUTO_CAPTION_STEPS.find(s => s.step === currentStep + 1)?.title;
```

---

## 3. Input Validation & Specifications

- **Accepted Media Formats**:
  - Video: `.mp4`, `.mov`, `.webm`
  - Audio: `.mp3`, `.wav`, `.m4a`, `.aac`
- **Duration Policy**:
  - Files longer than 90 seconds are automatically accepted without error.
  - The client & server automatically extract strictly the **first 90 seconds (0:00 to 1:30)** for transcription and rendering.
- **Audio Extraction**:
  - Client extracts 16kHz mono audio via Web Audio API before uploading to minimize payload.
  - Server runs Groq Whisper (`whisper-large-v3-turbo`) with millisecond word timestamps.
  - Automatic fallback to Google Gemini 2.0 Flash (`asia-south1`) on rate limit or Groq error.

---

## 4. UI/UX Color Tokens & Styling (Rule 7.4 + M3)

Follow the 6-color semantic palette. Avoid raw blue (`#3B82F6`) or old brand orange (`#FF5722`):

| Element | Tailwind Token | Hex / Style | Usage |
|---|---|---|---|
| **Active Stepper** | `orange-600` | `#EA580C` | Active circle, step highlights |
| **Completed Step** | `emerald-600` | `#059669` | Checkmark, "Ready" badges |
| **Free Allowance Badge** | `emerald-600` | `#059669` | "Daily Allowance: FREE · 5 Videos/Day" |
| **Dropzone Border** | `orange-600` | `#EA580C` | Hover/active upload ring |
| **Primary CTAs** | `from-orange-600 to-amber-500` | Gradient | "Continue", "Render 1080p Reel" |
| **AI Audio Cleaner** | `violet-700` | `#7C3AED` | AI audio cleaning toggle (AI feature) |
| **Info / Back Links** | `sky-600` | `#0284C7` | Secondary actions, edit transcript |
| **Waveform Glow** | `from-orange-600 to-amber-400` | Gradient | Vocal frequency visualizer |

---

## 5. Caption Styles & Safe Zones

- **Presets**: 32 master kinetic caption styles in `constants/captionStyles.ts` (Pop Word, Hormozi Viral, MrBeast Box, Neon Glow, Clean Minimal).
- **Social Safe Zones**:
  - Bottom margin: **100px** (clears TikTok/Reels sound discs and caption text).
  - Right margin: **80px** (clears like, comment, share, and bookmark buttons).
- **Active-Word Colors**: Sunset Yellow (`#FBBF24`), Neon Lime (`#84CC16`), Crisp White (`#FFFFFF`), Emerald Mint (`#34D399`).

---

## 6. Remotion Composition & Watermark Mandate

### Composition Props:
```ts
interface AutoCaptionProps {
  src: string;                  // S3 presigned URL for media
  words: Array<{
    word: string;
    start: number;              // Milliseconds
    end: number;                // Milliseconds
  }>;
  captionStyle: string;         // Preset ID from captionStyles.ts
  fontSize: 'small' | 'medium' | 'large';
  casing: 'natural' | 'uppercase';
  alignment: 'bottom' | 'center' | 'top';
  musicTrack?: string;          // S3 URL for background track
  musicVolume?: number;         // 0.0 to 1.0 (default: 0.12 ducked)
  watermark?: boolean;          // Mandatory BrandWatermark flag
}
```

### Watermark Enforcement (Rule 7.2):
The template must render `<BrandWatermark watermark={watermark} />` immediately before the closing `</AbsoluteFill>`.
```tsx
import { BrandWatermark } from '@/remotion/components/BrandWatermark';

export const AutoCaptionComposition = ({ watermark, ...props }: AutoCaptionProps) => {
  return (
    <AbsoluteFill>
      {/* Video layer, captions layer, audio tracks */}
      <BrandWatermark watermark={watermark} />
    </AbsoluteFill>
  );
};
```

---

## 7. Developer Guardrails

1. **Zero Local Renders**: Never run `npx remotion render` on local developer machines (4GB RAM safeguard).
2. **Quota Protection**: If audio has zero detected speech (`NO_SPEECH_DETECTED`), do not deduct from user's daily quota.
3. **Type Safety**: Run `npx tsc --noEmit` before confirming any code modification.

