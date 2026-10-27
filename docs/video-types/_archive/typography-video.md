# Typography Video

## Basic Information

| Field | Value |
|---|---|
| Video Type Name | Typography Video |
| Internal ID | `TYPOGRAPHY_VIDEO` |
| Composition ID | `TYPOGRAPHY-VIDEO` |
| Dashboard Mode | `typographyVideo` |
| Category | Creator (Shorts / Reels) |

## Purpose

Turn any uploaded creator or talking-head video into a high-retention, modern kinetic typography reel — with dynamic typography animations, font hierarchy, glowing accents, 3D depth pill callouts, and modular composition primitives synced directly to speech.

## Visual Style Gallery (Video Previews)

The gallery features **29 Master Typography Styles** organized into 5 curated categories with real **5–10 second demo video previews** hosted on Cloudinary:

- **Performance-Optimized Playback**: Inactive cards render lightweight poster images; only the hovered/tapped card dynamically mounts and plays a single `<video>` element.
- **Strict Separation**: `activePreviewId` (controls preview video playback on hover/tap) is strictly separated from `selectedStyleId` (chosen template on click).
- **Categories & Styles**:
  - `Viral & Kinetic`:
    - `dynamic-punch` (Dynamic Punch & Yellow Pop)
    - `hormozi-bold` (Alex Hormozi 900 heavy black stroke outline, slanted word pop, neon yellow highlight)
    - `beast-impact` (MrBeast comic 3D pop, bold drop-shadow, explosive spring bounce & tilt shake)
    - `viral-redline` (Breaking news alert indicator pill, bold high-contrast slam, red caution line)
    - `creator-highlight` (Ali Abdaal clean study sans with animated yellow marker highlighter sweep)
    - `neon-kinetic` (Neon Cyber Kinetic Glow — electric cyan and magenta punch)
    - `prism-pro` (Prism Pro Impact Block)
    - `paper-ii` (Paper II Collage & Editorial Tape)
    - `tokyo-cyber` (Tokyo Cyber Neon & Terminal Hacker)
    - `miami-sunset` (Miami Sunset Kinetic & Electric Coral)
    - `synthwave-80s` (Chrome metallic top, hot magenta neon bottom, retro grid scanlines)
    - `hud-telemetry` (Sci-fi HUD targeting reticles, coordinate stats, and digital monospace readout)
  - `Luxury & Editorial`:
    - `dubai-gold` (Dubai Gold Luxe — Cinzel 24k bevel)
    - `gadzhi-documentary` (Iman Gadzhi classic serif, subtle gold sheen, cinematic slow-drift, bookend rules)
    - `vogue-editorial` (Bodoni high-contrast serif, vertical hairline accents, chic italicized emphasis)
    - `elevate-script` (Elevate Script & Serif — Playfair Italic luxury)
    - `royal-emerald` (Royal Emerald & Champagne Gold)
    - `velvet-crimson` (Velvet Crimson & Rose Gold Luxe)
    - `monarch-violet` (Monarch Amethyst & Royal Gold Luxe)
  - `3D & Depth`:
    - `depth-3d-text` (Captions AI 3D Pill Callout)
    - `spatial-glass` (VisionOS frosted refractive acrylic pill, specular rim light, 3D floating elevation)
    - `isometric-cube` (Angled block lettering with deep 3D shadow extrusion and spatial elevation)
    - `obsidian-gold` (Obsidian Noir & 3D Gold Extrusion behind speaker)
  - `Minimal & Studio`:
    - `keynote-executive` (Apple keynote presentation, frosted glass pill, crisp sans, calm fade-up)
    - `vox-explainer` (Johnny Harris / Vox documentary style, technical coordinate badge, yellow marker box)
    - `nordic-clean` (Scandinavian ultra-minimalism, extra-letterspaced sans, muted slate tones)
    - `platinum-penthouse` (Platinum Penthouse Minimal)
    - `silver-chrome` (Silver Chrome Metallic Precision)
    - `swiss-minimal` (Swiss Bauhaus & Architectural Studio)

## Reusable Composition Primitives

The selected template controls **HOW** the typography looks, while the user's audio controls **WHAT** the typography says:

1. **`FullScreenText`** — Giant hero slam typography with spring scale pop.
2. **`WordEmphasis`** — 1.5x dynamic scaling + glowing glassmorphic backdrop card.
3. **`SplitText`** — Editorial stacked layout (italic/serif lead + heavy all-caps hero + subtext).
4. **`NumberFocus`** — Massive metric highlight with radial backlight flare ring.
5. **`LayeredText`** — 3D depth capsule container (Captions AI style text behind/front layering).
6. **`QuestionCard`** — Accent badge (`?`) + italic question lead + high contrast question text.
7. **`QuoteCard`** — Luxury framed quote with subtle watermark quote marks.
8. **`HighlightBadge`** — Angled torn paper tape or cyber neon chip badge.
9. **`CtaCard`** — Action button pill with directional arrow glyph.
10. **`SubtleText`** — Conversational narration pill.

## Smart Auto-Positioning & Collision Avoidance

- Calculates subject head and body bounding boxes.
- Automatically places typography cards in safe zones (top third, lower third, left/right offset) to avoid obscuring the speaker's face.
- Supports 3-layer rendering (`Original Video` -> `Kinetic Typography Layer` -> `Subject Cutout Video Overlay`).

## Keyword Planner (`services/ai/typographyPlanner.ts`)

Deterministic — fast, lightweight, and zero paid AI cost:
- Analyzes transcript words and timing into 2–4 word kinetic blocks.
- Semantic classification assigns appropriate primitive highlight types (`metric`, `question`, `quote`, `cta`, `tape-badge`, `fullscreen`, `emphasis`).
- Full support for English and Roman Hinglish.

## Fallback Rules

| Scenario | Behavior |
|---|---|
| No speech detected | Show clean video with subtle styling |
| Transcription fails | Show error message — never render silently with empty captions |
| Long phrases | Word count chunking ensures max 3–4 words per kinetic phrase |
| Inactive preview | Video unmounts immediately to free memory and hardware decoders |

## Style Reverse-Engineering & Dual-Layer Replication Validation

The Typography system includes an end-to-end Style Reverse-Engineering and Validation architecture:

1. **Temporal Video Analyzer (`services/ai/typographyAnalyzer/`)**:
   - Multi-stage pipeline: Video metadata -> Scene state detection -> Dynamic frame sampling -> Text detection -> Temporal motion tracking -> Composition & depth analysis -> Style inference -> Machine-readable `AdvancedStyleBlueprint`.
   - Stored in `lib/typography/blueprints/*.json`.

2. **Dual-Layer Fidelity & Multi-Content Robustness Engine (`services/ai/typographyReplication/`)**:
   - **Layer A (Blueprint Compliance)**: Evaluates whether the Remotion renderer executes parameters from the extracted blueprint.
   - **Layer B (Visual Style Fidelity)**: Symmetric direct comparison of Reference Demo Video vs Generated Test Video across 6 design axes (Typography 25%, Composition 20%, Motion 20%, Color 15%, Layering 10%, Timing 10%).
   - **Multi-Content Robustness Suite**: Evaluates 8 standardized content scenarios (`Short Phrase`, `Normal Sentence`, `Long Sentence`, `Multi-Line`, `Keyword Emphasis`, `Multi-Emphasis`, `Fast Rhythm`, `Slow Rhythm`).
   - **Pipeline Bottleneck Diagnosis**: Automatically classifies results into Cases A/B/C/D to pinpoint whether issues stem from blueprint extraction or renderer execution.
   - **Admin Workbench**: Synchronized side-by-side comparison player at `/admin/typography-analyzer`.

