---
name: compare-explainer-skill
description: Dedicated skill for Compare Explainer Generator (/dashboard/compare-explainer). Covers 9:16 side-by-side Versus comparison reels, 16 animated sticker characters, 6 reactive poses, dual image cards, VS center badge, and comparisonImages Remotion composition.
---

# Compare Explainer Generator — Dedicated Studio Skill

This skill contains the technical specifications, stepper flow, character animation rules, and rendering guidelines for **Compare Explainer Generator** (`compare`).

---

## 1. Quick Reference

| Property | Value |
|---|---|
| **Video Type ID** | `compare` / `comparisonImages` |
| **Dashboard Route** | `/dashboard/compare-explainer` |
| **Studio Component** | `components/dashboard/CompareExplainerStudio.tsx` |
| **Landing Page** | `app/(marketing)/compare-explainer/page.tsx` |
| **API Mode** | `compare` |
| **Remotion Composition** | `comparisonImages` |
| **Resolution** | `1080×1920` @ 30 FPS (9:16) |
| **Max Duration** | **90 Seconds** (2,700 frames @ 30 FPS) |
| **Credit Cost** | **1 Credit Flat** |
| **Paywall** | `<FeaturePaywall>` for free users |
| **Watermark** | Yes, for free-tier / unauthenticated exports |

---

## 2. Flexible Stepper Workflow (Rule 7.3 Compliance)

```ts
export const COMPARE_STEPS = [
  { step: 1, title: "Upload",    desc: "Voiceover Narration" },
  { step: 2, title: "Subjects",  desc: "2 Comparison Images" },
  { step: 3, title: "Music",     desc: "Soundtrack & Volume" },
  { step: 4, title: "Character", desc: "Presenter & Theme" },
  { step: 5, title: "Preview",   desc: "9:16 Shorts Simulator" },
] as const;

const [currentStep, setCurrentStep] = useState<number>(1);
{currentStep === COMPARE_STEPS.length && <PreviewStep />}
```

---

## 3. Required Inputs & Dual Comparison Setup

1. **Narration Audio**: `.mp3`, `.wav`, `.m4a` (max 90s extracted).
2. **Left Subject Image**: Product photo, personality, or concept graphic.
3. **Right Subject Image**: Rival product photo or concept graphic.
4. **Left / Right Titles**: Optional text labels (e.g., "iPhone 15 Pro" vs "Galaxy S24 Ultra").
5. **Presenter Character**: 1 of 16 sticker presenters.
6. **Visual Theme**: `White Studio`, `Soft Gradient Light`, `Midnight Dark`, `Electric Purple`.

---

## 4. Presenter Sticker Character Engine

- **16 Distinct Sticker Avatars** with white die-cut sticker outlines.
- **6 Reactive Poses**:
  - `pointing_left` (Directs focus to Left item)
  - `pointing_right` (Directs focus to Right item)
  - `thinking` (Contemplates pros & cons)
  - `shocked` (Price or spec reveal)
  - `happy` (Winning verdict moment)
  - `neutral` (Intro / conversational baseline)
- Poses dynamically trigger on sentence sentiment transitions.

---

## 5. UI Color Tokens (Rule 7.4)

| Role | Tailwind Token | Hex |
|---|---|---|
| Active Step | `orange-600` | `#EA580C` |
| Left Card Accent | `sky-600` | `#0284C7` |
| Right Card Accent | `amber-600` | `#D97706` |
| VS Badge Accent | `orange-600` | `#EA580C` |
| Primary CTA | `from-orange-600 to-amber-500` | Gradient |

---

## 6. Remotion Props & Watermark Mandate

```ts
interface CompareExplainerProps {
  voiceoverUrl: string;
  words: WordTimestamp[];
  leftImageUrl: string;
  rightImageUrl: string;
  leftTitle?: string;
  rightTitle?: string;
  character: string;
  theme: 'white' | 'soft' | 'dark' | 'electric';
  captionStyle: string;
  musicTrack?: string;
  musicVolume?: number;
  watermark?: boolean;       // Mandatory BrandWatermark flag
}
```

Template must render `<BrandWatermark watermark={watermark} />` before closing `</AbsoluteFill>`.

---

## 7. Developer Guardrails

- ✅ Both Left and Right image uploads are mandatory before moving to Step 3.
- ✅ Character transitions must sync with audio scene beats.
- ✅ Zero local rendering. Run `npx tsc --noEmit`.

