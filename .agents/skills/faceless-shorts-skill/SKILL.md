---
name: faceless-shorts-skill
description: Dedicated skill for Faceless Shorts Generator (/dashboard/faceless-shorts). Covers 9:16 viral vertical shorts from voiceover audio, 16-layer modular crew architecture, realistic S3 photo pool, SVG drawings, kinetic subtitles, PAID plan gating (1 credit), and FACELESS-SHORTS Remotion composition.
---

# Faceless Shorts Generator — Dedicated Studio Skill

This skill contains the comprehensive domain knowledge, UI rules, stepper workflow, component architecture, and Remotion composition specs for **Faceless Shorts Generator** (`facelessShorts`).

---

## 1. Studio Quick Reference

| Property | Value |
|---|---|
| **Video Type ID** | `facelessShorts` / `FACELESS_SHORTS` |
| **Dashboard Route** | `/dashboard/faceless-shorts` |
| **Studio Component** | `components/dashboard/FacelessShortsStudio.tsx` |
| **Page Client** | `components/dashboard/subpages/FacelessShortsPageClient.tsx` |
| **Landing Page** | `app/(marketing)/faceless-shorts/page.tsx` |
| **API Mode** | `facelessShorts` |
| **Remotion Composition** | `FACELESS-SHORTS` |
| **Template Directory** | `remotion/templates/FACELESS_SHORTS/` |
| **Aspect Ratio** | Strictly **9:16 Vertical** (`1080×1920`) |
| **Frame Rate** | 30 FPS |
| **Max Duration** | **90 Seconds** (2,700 frames @ 30 FPS) |
| **Credit Cost** | **1 Credit Flat** (Master Rule 4.1 for 9:16) |
| **Paywall** | `<FeaturePaywall>` for free users (server returns 402) |
| **Watermark** | Yes, for free-tier users (`watermark: true`) |

---

## 2. Flexible Stepper Workflow (Rule 7.3 Compliance)

```ts
export const FACELESS_SHORTS_STEPS = [
  { step: 1, title: "Upload",   desc: "Voiceover Audio & Script" },
  { step: 2, title: "Assets",   desc: "Media Source & Background" },
  { step: 3, title: "Style",    desc: "Caption & Visual Pacing" },
  { step: 4, title: "Preview",  desc: "9:16 Shorts Simulator" },
] as const;

const [currentStep, setCurrentStep] = useState<number>(1);
{currentStep === FACELESS_SHORTS_STEPS.length && <PreviewStep />}
```

---

## 3. Asset Source Selection & Media Placer

The studio features a 3-way **Visual Source Selector**:
1. **Itnavideo Assets (`library`)**: Automatically matches curated realistic photographs from the S3 asset pool.
2. **My Uploads (`upload`)**: Uses strictly user-uploaded photos/videos without stock library backfill.
3. **Both / Mix (`mix`)**: User media placed at key emotional beats, with stock library filling remaining scenes.

> [!NOTE]
> `visualArtStyle` (3D / 2D / realistic) has been deprecated and removed. All library assets are high-resolution realistic photography.

---

## 4. Production Crew Architecture (15 Specialists + 1 Emoji Engine)

Built on `services/ai/facelessShortsProductionCrew.ts`:
- **Hook Scene Specialist**: Crafts visual pattern-interrupts and high-contrast text in the first 1.5 seconds.
- **Sentence Splitter**: Breaks scenes strictly on sentence punctuation (`. ! ? ।`) or pauses $\ge 0.45\text{s}$.
- **Procedural SVG Library**: 36 shapes in `svgMasterCatalog.ts` assigned deterministically per concept ID. No back-to-back repeats.
- **Emoji Engine**: 32 thematic categories with rolling `recentWindow` preventing duplicate emojis.
- **Camera Punch-Ins**: Alternates $+5\%$ to $+18\%$ zoom on major sentence pivots.

---

## 5. UI Color Tokens (Rule 7.4)

| Role | Token | Hex |
|---|---|---|
| Active Step | `orange-600` | `#EA580C` |
| Completed Step | `emerald-600` | `#059669` |
| Primary CTA | `from-orange-600 to-amber-500` | Gradient |
| AI Feature Badge | `violet-700` | `#7C3AED` |
| Paywall Trigger | `violet-700` | `#7C3AED` |

---

## 6. Remotion Composition & Watermark Mandate

```ts
interface FacelessShortsProps {
  voiceoverUrl: string;
  words: WordTimestamp[];
  scenes: SceneBeat[];
  captionStyle: string;
  musicTrack?: string;
  musicVolume?: number;      // default: 0.12
  imageSource: 'library' | 'upload' | 'mix';
  punchInIntensity?: 'none' | 'subtle' | 'strong';
  watermark?: boolean;       // Mandatory BrandWatermark flag
}
```

Template must render `<BrandWatermark watermark={watermark} />` before closing `</AbsoluteFill>`.

---

## 7. Developer Guardrails

- ❌ Never merge with `FACELESS-VIDEO` (16:9 Cinema) — completely separate composition!
- ❌ Do not restore dead `visualArtStyle` props.
- ✅ Always check `renderAccess.ts` — free users get 402 on this studio.
- ✅ Run `npx tsc --noEmit` before finishing edits.

