---
name: whiteboard-video-skill
description: Dedicated skill for Whiteboard Animation Maker (/dashboard/whiteboard-video). Covers 9:16 hand-drawn vertical whiteboard animation synced to speech, realistic drawing hands, AI Lesson Director, board themes, and WHITEBOARD-VIDEO Remotion composition.
---

# Whiteboard Animation Maker — Dedicated Studio Skill

This skill contains the domain knowledge, AI lesson direction logic, board themes, and rendering parameters for **Whiteboard Animation Maker** (`whiteboardVideo`).

---

## 1. Quick Reference

| Property | Value |
|---|---|
| **Video Type ID** | `whiteboardVideo` / `WHITEBOARD_VIDEO` |
| **Dashboard Route** | `/dashboard/whiteboard-video` |
| **Studio Component** | `components/dashboard/WhiteboardStudio.tsx` |
| **Landing Page** | `app/(marketing)/whiteboard-video/page.tsx` |
| **API Mode** | `whiteboardVideo` |
| **Remotion Composition** | `WHITEBOARD-VIDEO` |
| **Resolution** | `1080×1920` @ 30 FPS (9:16) |
| **Max Duration** | **90 Seconds** (2,700 frames @ 30 FPS) |
| **Credit Cost** | **1 Credit Flat** |
| **Paywall** | `<FeaturePaywall>` for free users |
| **Watermark** | Yes, for free-tier users |

---

## 2. Flexible Stepper Workflow (Rule 7.3 Compliance)

```ts
export const WHITEBOARD_STEPS = [
  { step: 1, title: "Upload",   desc: "Voiceover or Video" },
  { step: 2, title: "Music",    desc: "Background Soundtrack" },
  { step: 3, title: "Board",    desc: "Theme & Marker Color" },
  { step: 4, title: "Preview",  desc: "9:16 Shorts Simulator" },
] as const;

const [currentStep, setCurrentStep] = useState<number>(1);
{currentStep === WHITEBOARD_STEPS.length && <PreviewStep />}
```

---

## 3. Hand-Drawn Animation & AI Lesson Director

- **Realistic Hand Movements**: Features natural drawing hand masks with realistic pen/stylus follow-through across text strokes, diagrams, and underlines.
- **AI Lesson Director**:
  - Automatically distills full transcript sentences into 3-to-6 word punchy visual takeaways.
  - Generates structured diagrams: concept nodes, bracket lists, pros/cons columns, and summary takeaway boxes.
- **Three Master Board Themes**:
  1. `Executive Classic Whiteboard`: Crisp `#FAFAFA` whiteboard with dark marker ink.
  2. `Dark Glass Studio`: Obsidian background with high-tech fluorescent marker lines.
  3. `Blueprint Schematic`: Architectural grid overlay with engineering blueprint aesthetics.

---

## 4. UI Color Tokens (Rule 7.4)

| Role | Token | Hex |
|---|---|---|
| Active Step | `orange-600` | `#EA580C` |
| Completed Step | `emerald-600` | `#059669` |
| Executive Marker Ink | `slate-900` | `#0F172A` |
| Blueprint Marker Ink | `sky-600` | `#0284C7` |
| Highlight Marker Ink | `amber-500` | `#F59E0B` |
| Primary CTA | `from-orange-600 to-amber-500` | Gradient |

---

## 5. Remotion Composition & Watermark Mandate

```ts
interface WhiteboardVideoProps {
  voiceoverUrl: string;
  words: WordTimestamp[];
  scenes: Array<{
    title: string;
    points: string[];
    diagramType?: 'bullets' | 'tree' | 'box';
    durationInFrames: number;
  }>;
  boardTheme: 'executive' | 'dark' | 'blueprint';
  markerColor: string;
  musicTrack?: string;
  musicVolume?: number;      // default: 0.12
  watermark?: boolean;       // Mandatory BrandWatermark flag
}
```

Template must render `<BrandWatermark watermark={watermark} />` before closing `</AbsoluteFill>`.

---

## 6. Developer Guardrails

- ✅ Hand drawing path must calculate exact stroke duration matching the spoken sentence segment.
- ✅ Vertical safe zone enforcement: 100px bottom margin, 80px right margin.
- ✅ Zero local rendering. Run `npx tsc --noEmit`.

