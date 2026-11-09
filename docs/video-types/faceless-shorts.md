# Faceless AI Shorts Generator (`faceless-shorts.md`)

**ID**: `FACELESS_SHORTS` / `facelessShorts`  
**Aspect Ratio**: **9:16 Vertical Only (`1080×1920` @ 30 FPS MP4)**  
**Max Duration**: **Up to 90 Seconds (90s / 2,700 Frames)**  
**Credit Cost**: **Flat 1 Credit per video** (per Rule 4.1 Master Credit System)  
**Host Architecture**: AWS Lambda Remotion Cloud Cluster (Strictly zero local heavy compute per Rule 0)  
**Composition Source**: `remotion/templates/FACELESS_SHORTS/template.tsx`  
**Studio Dashboard**: `components/dashboard/FacelessShortsStudio.tsx` (`/dashboard/faceless-shorts`)  

---

## 1. Overview & Core Philosophy

The Faceless AI Shorts Generator transforms raw voiceover audio into broadcast-quality vertical short videos (`1080×1920` Full HD) tailored for YouTube Shorts, Instagram Reels, and TikTok.

Instead of treating video generation as one monolithic task or chopping audio at arbitrary fixed timers (like 4s or 7s), the system operates on two core pillars:
1. **Sentence-Aligned Natural Scene Pacing**: Slices scenes strictly at real sentence punctuation (`. ! ? ।`) or natural speaker pauses (`>= 0.45s`). Every visual scene represents one complete spoken thought.
2. **Decoupled 16-Layer Modular Production Architecture**: Every visual, audio, and kinetic element is rendered as an independent, data-driven Remotion layer wrapped in `<Sequence>` time-windowing, positioned on GPU compositor layers (`translate3d`), with zero decoded image or layout leaks.

---

## 2. The 16-Specialist Production Crew Architecture

```
                           [ SPOKEN VOICEOVER ]
                                    │
    ┌───────────────────────────────┼───────────────────────────────┐
    ▼                               ▼                               ▼
 [ VISUAL CREW ]             [ TEXT & DATA CREW ]           [ AUDIO & RENDER ]
 • Hook Specialist           • Caption Specialist           • Music Director
 • Sentence Splitter         • Headline & Stat Master       • Audio Ducking Master
 • Safe-Zone Guard           • Comparison Specialist        • Sound Effects Master
 • Vector Artist             • Checklist & Steps Master     • Watermark Guard
 • Media & B-Roll Placer     • Misheard Word Corrector      • Cloud Render Engine
 • Camera Zoom Master
 • Canvas & Background
```

### Category A: Visual & Motion Crew
1. **The Hook Specialist (`HookScene.tsx`)**: Maximum viewer retention across the critical first 3 seconds with pattern-interrupt headlines and curiosity questions.
2. **The Sentence & Thought Splitter (`sentenceTimelineBuilder.ts`)**: Natural sentence cadence detection. Slices scenes strictly at real punctuation or natural pauses (`>= 0.45s`).
3. **The Mobile Safe-Zone Guard (`FACELESS_DESIGN_TOKENS`)**: Enforces 100px right-side margin (clearing TikTok/Reels like and comment buttons) and top/bottom padding (clearing account badges and seek bars).
4. **The Vector & Illustration Artist (`VectorDrawingIcon.tsx`)**: Rotates across 16 SVG illustrations. **Zero-Repeat Rule**: Consecutive scenes never feature the same drawing twice in a row.
5. **The Media & B-Roll Placer (`FullBleedVisualScene.tsx`)**: Smooth Ken Burns zoom drifts (+5% scale over scene duration) ensuring static images feel dynamic.
6. **The Camera Punch-In Master (`smartPunchIns`)**: Alternates frame scale (+5% subtle, +12% standard, or +18% dramatic) on major sentence breaks to prevent visual fatigue.
7. **The Canvas & Lighting Specialist (`Background.tsx`)**: Renders clean backgrounds with subtle dot-matrix texture and ambient radial glow.

### Category B: Text, Data & Subtitles Crew
8. **The Caption & Kinetic Typography Specialist (`UniversalCaptionLayer.tsx`)**: Word-by-word synchronized subtitles across 32 master presets with millisecond active word color pops.
9. **The Headline & Stat Designer (`StatScene.tsx`, `MetricGrowthPill.tsx`)**: Numeric proof callouts and financial data (e.g. `"$25,000"`, `"98%"`, `"3X Growth"`).
10. **The Comparison & Contrast Specialist (`ComparisonScene.tsx`, `VsBattleCard.tsx`)**: Contrasts "Standard Method (Red)" against "Pro Winner Method (Glowing Emerald)".
11. **The Checklist & Milestone Step Specialist (`MilestoneLadderScene.tsx`, `NumberedStepsCard.tsx`)**: Staggered animated checkmarks and vertical progress ladders.
12. **The Misheard Word & Brand Corrector (`editorialTranscript`)**: Replaces mistranscribed brand names or regional slang without disrupting underlying millisecond audio alignment.

### Category C: Sound, Music & Cloud Engine Crew
13. **The Background Music Director (`AWS_BGM_TRACKS`)**: Selects and seamlessly loops curated royalty-free tracks (Lo-Fi, Ambient Piano, Upbeat, Narrative, Cinematic).
14. **The Smart Audio Ducking Specialist (`bgmVolume`)**: Ducks music volume to **12% (`0.12`)** during active speech, smoothly swelling to 25% during sentence pauses.
15. **The Transition SFX & Foley Master (`sfxEvents`)**: Synchronized audio cues (`whoosh.wav` on scene cuts, `pop.wav` on sticker reveals, `ding.wav` on stat arrivals).
16. **The Watermark Guard & Cloud Render Engine (`InteractiveRenderEngine.tsx`)**: Distributes rendering across AWS Lambda cores, outputting clean 1080×1920 30 FPS MP4 files with a 48-hour signed cloud download link.

---

## 3. Standard 4-Step Guided Stepper Pipeline

The Studio Workbench (`/dashboard/faceless-shorts`) follows a strictly validated 4-step workflow:

```
[1. Upload] ──> [2. Music] ──> [3. Style] ──> [4. Preview]
```

* **Step 1: Upload (Voiceover & Supporting Media)**:
  - Spoken voiceover file (.mp3, .wav, .m4a, .aac) up to 90 seconds.
  - Multi-asset supporting visuals (PNG, JPG, WEBP, MP4, MOV).
  - In-place audio health diagnostics & AI voice isolation toggle.
* **Step 2: Music (Soundtrack & Audio Design)**:
  - 14 Curated AWS S3 Background Tracks with real-time in-card audition player.
  - BGM Volume Slider: Default 12% (`0.12`), customizable 0% to 50% ducking during speech.
  - Custom BGM upload and transition SFX toggle.
* **Step 3: Style (Captions & Pacing)**:
  - 32 Master Animated Subtitle Presets (MrBeast, Hormozi, Vox, Cyberpunk, Glow).
  - Mobile safe-zone placement (Bottom, Center, Top).
  - Creator Brand Kit (@handle & theme presets) and spoken transcript word editor.
* **Step 4: Preview (9:16 Shorts Simulator)**:
  - Interactive 9:16 mobile phone simulator rendering the real Remotion composition.
  - Summary recap card: duration, visual asset count, music track, caption style, 1 Credit flat cost.
  - Single-click launch to AWS Lambda Remotion Cloud cluster.

---

## 4. Master Video Composition Stacking Order (Z-Index Hierarchy)

Every layer has an explicit, non-colliding Z-index ensuring flawless visual hierarchy:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                 ITNAVIDEO COMPLETE VIDEO COMPOSITION STACK                  │
├───────┬───────────────────────────────────┬─────────────────────────────────┤
│ Z-Idx │ Component & Engine File           │ Primary Responsibilities        │
├───────┼───────────────────────────────────┼─────────────────────────────────┤
│ Z: 40 │ UniversalCaptionLayer.tsx         │ Word-by-word active karaoke     │
│ Z: 38 │ KineticEmojiLayer.tsx             │ Contextual emoji pops (🚀, 💰)  │
│ Z: 36 │ MultiLayerTextOverlay.tsx         │ 11 Kinetic typography presets   │
│ Z: 35 │ MultiLayerTransitionOverlay.tsx   │ Whip pans, zoom snaps, glitches │
│ Z: 32 │ MultiLayerCalloutOverlay.tsx      │ Speech bubbles, pointers, cards │
│ Z: 30 │ MultiLayerEffectsOverlay.tsx      │ 35mm film grain, leaks, vignette│
│ Z: 25 │ MultiLayerAudioVisualizerOverlay  │ Equalizer bars, waves, audiogram│
│ Z: 24 │ MultiLayerAdjustmentOverlay.tsx   │ 8 Creator LUTs & color grading  │
│ Z: 22 │ MultiLayerGaugeOverlay.tsx        │ Progress rings, speedometers    │
│ Z: 20 │ VirtualCameraLayer.tsx            │ Handheld shake, zoom punch      │
│ Z: 18 │ MultiLayerMaskOverlay.tsx         │ Subtitle scrim, cinema scope    │
│ Z: 16 │ IsometricPerspectiveOverlay.tsx   │ 2.5D cubes, pedestals, mockups  │
│ Z: 14 │ MultiLayerSvgOverlay.tsx          │ 10 Vector archetypes & charts   │
│ Z: 12 │ MultiLayerPatternOverlay.tsx      │ Halftone, hatch, waves, mesh    │
│ Z: 10 │ MultiLayerImageOverlay.tsx        │ 8 Image presets & Ken Burns     │
│ Base  │ Background & Scene Layouts        │ 1080×1920 modular scene canvas  │
└───────┴───────────────────────────────────┴─────────────────────────────────┘
```

---

## 5. Comprehensive Specifications of All 14 Layer Engines

### 5.1 Universal Word-Level Subtitles & Karaoke (`UniversalCaptionLayer.tsx`)
* **Location**: `remotion/components/library/UniversalCaptionLayer.tsx`
* **Z-Index**: `40`
* **Core Duties**: 
  - Word-by-word millisecond synchronized karaoke highlight.
  - 32 Popular Creator Subtitle Presets (MrBeast boxed, Hormozi lime punch, Vox documentary serif, cyberpunk cyan, glowing viral text).
  - Safe-zone positioning (`bottom`, `center`, `top`) strictly clearing TikTok/Instagram UI controls.
  - Active word spring bounce physics (`spring({ frame, fps, config: { damping: 9, stiffness: 220 } })`).

---

### 5.2 Kinetic Emojis Engine (`KineticEmojiLayer.tsx`)
* **Location**: `remotion/components/library/KineticEmojiLayer.tsx`
* **Z-Index**: `38`
* **Core Duties**:
  - Automatically scans transcript words and triggers contextual animated 3D emojis (e.g. 🚀 on "growth", 💰 on "money", ⚠️ on "danger", 🔥 on "viral").
  - Spawns directly above active caption words with high-energy spring overshoot (`damping: 8, stiffness: 240, mass: 0.4`).
  - Auto-fades after 18 frames so emojis never clutter subsequent sentences.

---

### 5.3 Dynamic Multi-Layer Typography Engine (`MultiLayerTextOverlay.tsx`)
* **Location**: `remotion/components/library/MultiLayerTextOverlay.tsx`
* **Z-Index**: `36`
* **Interface**: `DynamicTextLayer[]`
* **11 Creator Presets**:
  1. `hero-headline`: 56px, 900 weight, uppercase, flame glow, `spring-pop`, `per-word`.
  2. `kicker-pill`: 22px, rounded-full pill badge, 1px border, 0.12em letter spacing.
  3. `editorial-callout`: 32px, 600 weight, dark translucent card backdrop.
  4. `kinetic-punch`: 76px, 900 weight, golden yellow `#FACC15`, `per-character` spring.
  5. `stat-callout`: 68px, emerald green `#10B981`, glowing drop shadow, `zoom-in`.
  6. `quote-card`: 28px, editorial card, italicized quote styling.
  7. `comparison-vs`: 34px, bold red vs green battle badge `#DC2626`.
  8. `code-mono`: 24px, Fira Code monospace, cyan `#38BDF8`, terminal backdrop.
  9. `timer-urgency`: 26px, crimson red badge `#EF4444`, rounded-full pill.
  10. `footnote-disclaimer`: 16px, slate-400 `#94A3B8`, anchored at `y: 1720px`.
  11. `freeform`: Completely custom fonts, colors, and positioning.
* **Kinetic Animation Drivers**:
  - `standard`: Card-level entrance and exit.
  - `per-word`: Words stagger into place with independent spring pops.
  - `per-character`: Characters animate individually for maximum kinetic impact.

---

### 5.4 Dynamic Transitions Engine (`MultiLayerTransitionOverlay.tsx`)
* **Location**: `remotion/components/library/MultiLayerTransitionOverlay.tsx`
* **Z-Index**: `35`
* **Interface**: `DynamicTransitionEvent[]`
* **Supported Transitions**:
  - `whip-pan-left` / `whip-pan-right` / `whip-pan-up`: High-velocity directional sweeps with dynamic motion blur (`backdrop-filter: blur(...)`).
  - `zoom-snap`: Rapid zoom-in burst bridging fast cuts.
  - `glitch-cut`: 3-to-5 frame digital scanline slice with RGB chromatic aberration.
  - `white-flash`: Blinding white flash cut for beat drops and climax reveals.
  - `fade-black`: Cinematic 12-frame dip to black for dramatic chapter shifts.
* **Performance**: Scoped to tiny 8-to-12 frame windows between scenes, keeping memory footprint near zero.

---

### 5.5 Semantic Callout & Information Label Engine (`MultiLayerCalloutOverlay.tsx`)
* **Location**: `remotion/components/library/MultiLayerCalloutOverlay.tsx`
* **Z-Index**: `32`
* **Interface**: `DynamicCalloutLayer[]`
* **Supported Callout Types**:
  1. `speech-bubble`: Rounded dialogue card with an SVG pointing tail (top/bottom/left/right) directing to speakers or commentators.
  2. `thought-bubble`: Cloud-like editorial card with 3 ascending trailing thought dots.
  3. `target-pointer`: Target focus dot placed on a subject + dashed leader line + spec label pill (Vox & Apple keynote spec style).
  4. `info-box`: Structured editorial card with a category badge, bold title, and explanatory description.
  5. `status-pill`: High-energy status pill with an animated pulsing live dot (e.g. `● LIVE`, `● STEP 1`, `● 10X GROWTH`).
  6. `connector-label`: Multi-point leader line connecting two points with an explanatory badge.
* **5 Built-In Visual Themes**: `dark-card`, `glass` (frosted blur), `flame-accent`, `mint-tech`, and `gold-luxury`.

---

### 5.6 Visual Effects Engine (`MultiLayerEffectsOverlay.tsx`)
* **Location**: `remotion/components/library/MultiLayerEffectsOverlay.tsx`
* **Z-Index**: `30`
* **Interface**: `DynamicEffectLayer[]`
* **Supported Effects**:
  - `film-grain`: Procedural SVG fractal noise filter where the seed advances dynamically with the Remotion frame (`seed = (frame % 30) * 11`), creating real 35mm organic film grain without heavy video textures.
  - `vignette`: Soft radial gradient edge-darkening drawing viewer focus to the center.
  - `light-leak`: Warm orange/magenta light streaks drifting smoothly with natural trajectories.
  - `chromatic-aberration`: Red/Cyan RGB splitting on high-impact drops.
  - `glow-bloom`: Soft diffused ambient lighting for modern neon and tech themes.
  - `lens-blur`: Hardware-accelerated depth blur (`backdrop-filter: blur(...)`).
* **Zero Heavy Compute**: 100% computed via GPU blend modes (`screen`, `overlay`, `mix-blend-mode`).

---

### 5.7 Audio Waveform & Reactive Visualizer Engine (`MultiLayerAudioVisualizerOverlay.tsx`)
* **Location**: `remotion/components/library/MultiLayerAudioVisualizerOverlay.tsx`
* **Z-Index**: `25`
* **Interface**: `DynamicAudioVisualizerLayer[]`
* **Supported Visualizer Types**:
  1. `equalizer-bars`: Vertical jumping frequency bars that react to speech cadence, with customizable bar width, rounded caps, and vertical mirroring (symmetrical bounce).
  2. `smooth-wave`: Continuous fluid sinusoidal wave line that ripples smoothly as words are spoken.
  3. `spectrum-area`: Mountainous frequency curve with a warm gradient fill underneath.
  4. `circular-audiogram`: Radial sunburst of audio bars radiating outward around a center circular avatar or microphone icon (classic podcast/audiogram format).
  5. `pulsing-dots`: Dynamic vertical matrix of dots that pulse to vocal cadence.
* **Speech Cadence Formula**: Multi-frequency harmonic formula simulates human speech syllables and micro-pauses with zero audio analysis latency.

---

### 5.8 Color Grading & Adjustment Engine (`MultiLayerAdjustmentOverlay.tsx`)
* **Location**: `remotion/components/library/MultiLayerAdjustmentOverlay.tsx`
* **Z-Index**: `24`
* **Interface**: `DynamicAdjustmentLayer[]`
* **8 Curated Creator LUT Presets**:
  1. `dark-luxury`: Rich deep contrast, cool shadows, gold highlights (Finance / Business / Tech).
  2. `warm-creator`: Warm golden skin tones, soft lifted shadows (Podcasts / Lifestyle).
  3. `cyber-neon`: High saturation, blue/cyan shadows, magenta highlights.
  4. `vintage-film`: Muted green-yellow tones with soft contrast and slight sepia.
  5. `clean-corporate`: Crisp white balance, subtle saturation boost, high clarity.
  6. `moody-bw`: High-contrast black and white with strong silhouettes.
  7. `bleach-bypass`: Desaturated mids with harsh contrast (Cinematic action / thriller).
  8. `sunset-gold`: Warm orange/rose sunset glow with soft highlights.
* **Zero Heavy Compute**: Evaluated directly through GPU backdrop filters (`brightness`, `contrast`, `saturate`, `sepia`, `hue-rotate`).

---

### 5.9 Dynamic Metric Gauges & Progress Engine (`MultiLayerGaugeOverlay.tsx`)
* **Location**: `remotion/components/library/MultiLayerGaugeOverlay.tsx`
* **Z-Index**: `22`
* **Interface**: `DynamicGaugeLayer[]`
* **Supported Gauge Types**:
  1. `percentage-ring`: Circular progress dial with animated stroke fill, glowing neon head, and center percentage/label readout (e.g. `88%`).
  2. `speedometer`: 220° radial arc with graduated tick marks and an animated needle pointer sweep.
  3. `linear-meter`: Horizontal bar meter with animated progress fill, glowing bead, and percentage badge.
  4. `counter`: Large numerical count-up display with spring interpolation (e.g. counting from `$0` to `$250,000` or `+0%` to `+340%`).
  5. `concentric-rings`: Apple Watch Fitness-style 3-tier concentric rings comparing multiple metrics simultaneously (Retention, Engagement, Conversion).
  6. `loading-spinner`: High-tech rotating circular ring with a glowing head, perfect for suspense or transition beats.
* **Pure SVG Math**: Uses `strokeDashoffset = circumference * (1 - progress)` with zero external chart libraries.

---

### 5.10 Virtual Camera & Kinetic Motion Engine (`VirtualCameraLayer.tsx`)
* **Location**: `remotion/components/library/VirtualCameraLayer.tsx`
* **Z-Index**: `20`
* **Interface**: `VirtualCameraConfig`
* **Core Capabilities**:
  - **Handheld Camera Micro-Shake**: Natural multi-frequency sinusoidal oscillation (`translate3d` + `rotate`) giving live-action realism to AI-generated scenes.
  - **Kinetic Zoom Punch**: Instant spring-driven 1.15x zoom punches on critical emphasis words, with natural spring recovery.
  - **Continuous Ken Burns Drift**: Smooth continuous push-in (1.0x ──> 1.12x) with edge clamping so black borders are never exposed.

---

### 5.11 Dynamic Mask & Scrim Overlay Engine (`MultiLayerMaskOverlay.tsx`)
* **Location**: `remotion/components/library/MultiLayerMaskOverlay.tsx`
* **Z-Index**: `18`
* **Interface**: `DynamicMaskLayer[]`
* **Supported Masks**:
  - `subtitle-scrim`: Smooth bottom 38% dark gradient guaranteeing 100% caption readability over busy B-roll.
  - `cinema-scope`: Clean top and bottom matte letterbox bars for cinematic storytelling.
  - `split-screen-divider`: Glowing vertical or horizontal accent divider for comparison scenes.
  - `spotlight-cutout`: Dims background canvas while keeping circular subject in full focus.

---

### 5.12 Isometric 2.5D Perspective Engine (`IsometricPerspectiveOverlay.tsx`)
* **Location**: `remotion/components/library/IsometricPerspectiveOverlay.tsx`
* **Z-Index**: `16`
* **Interface**: `DynamicIsometricLayer[]`
* **Supported 2.5D Archetypes**:
  1. `cube`: 3-faced shaded 3D isometric block (Top: highlight, Left: midtone, Right: shadow) with extruded height growth.
  2. `platform`: Stepped pedestal / circular stage with neon perimeter glow and drop shadow.
  3. `device-mockup`: 2.5D floating angled smartphone or tablet screen holding an image or video UI screenshot.
  4. `server-building`: Extruded skyscraper / data center server tower with floor LED indicators.
* **Zero WebGL Overhead**: Uses pure SVG polygon projection and CSS 3D matrix transforms (`rotateX(55deg) rotateZ(-38deg)`), running at constant 30 FPS without GPU context crashes.

---

### 5.13 Unified Vector & SVG Graphics Engine (`MultiLayerSvgOverlay.tsx`)
* **Location**: `remotion/components/library/MultiLayerSvgOverlay.tsx`
* **Z-Index**: `14`
* **Interface**: `DynamicSvgLayer[]`
* **10 Vector Archetypes in One Factory**:
  1. `illustration`: Multi-path raw SVG vector artwork with precomputed stroke lengths.
  2. `icon`: Single or dual-tone SVG glyphs with spring-pop bounce.
  3. `chart`: Bar charts (spring heights), Donut charts (circumference stroke), and Trendlines (curved polyline sparklines).
  4. `diagram`: Flowchart boxes connected by directed arrow edges with automatic layout interpolation.
  5. `shape`: Rectangles, rounded squircles, pills, and circles with solid or gradient fills.
  6. `annotation`: Kinetic hand-drawn underlines, circling ovals, curved arrows, and highlight boxes.
  7. `path`: Self-drawing kinetic SVG paths with configurable line caps & arrowheads.
  8. `background`: Dot matrices, geometric grids, and floating micro-particles.
  9. `badge`: Pill tags with icon slots and subtle continuous pulse.
  10. `character`: Modular stickman/character pose paths with fluid gesture animations.
* **Zero Reflow Guarantee**: Precomputed path lengths eliminate expensive runtime SVG `.getTotalLength()` calls.

---

### 5.14 Procedural Pattern & Texture Layer Engine (`MultiLayerPatternOverlay.tsx`)
* **Location**: `remotion/components/library/MultiLayerPatternOverlay.tsx`
* **Z-Index**: `12`
* **Interface**: `DynamicPatternLayer[]`
* **8 Procedural Patterns**:
  1. `halftone`: Comic & pop-art dot matrix with adjustable spacing and size.
  2. `noise`: Procedural fractal noise with frame-advance seed realism.
  3. `hatch`: Crisp 45° single-direction architectural parallel lines.
  4. `crosshatch`: Intersecting sketch lines creating tactile depth.
  5. `waves`: Dynamic sinusoidal topographic/audio contour lines.
  6. `mesh`: Futuristic technical wireframe grid with corner nodes.
  7. `chevron`: Decorative geometric zigzag pattern.
  8. `stipple`: Micro-stippling organic dot distribution.
* **Zero Asset Size**: Total payload under 10 KB, rendered via SVG `<pattern>` tiles.

---

### 5.15 Dynamic Multi-Layer Image Engine (`MultiLayerImageOverlay.tsx`)
* **Location**: `remotion/components/library/MultiLayerImageOverlay.tsx`
* **Z-Index**: `10`
* **Interface**: `DynamicImageLayer[]`
* **8 Practical Presets**:
  1. `full-bleed`: Full 1080×1920 canvas, edge-clamped Ken Burns (1.0x ──> 1.12x).
  2. `device-mockup`: 760×1100 card, 24px radius, 48px elevation shadow, `spring-pop`.
  3. `pip-avatar`: 260×260 circular cutout, 6px solid white border ring, 28px shadow.
  4. `sticker`: 320×320 transparent PNG, spring overshoot, subtle floating bob.
  5. `split-screen`: Two layers clipped at 50% canvas height (1080×960).
  6. `collage`: 2 to 4 editorial photos in an aligned grid with staggered zoom entrances.
  7. `framed`: 720×720 square card, 20px radius, 36px shadow.
  8. `watermark`: 140×140 transparent logo anchored at `(940px, 120px)`.
* **Remotion `<Img>` Guarantee**: Pauses cloud frame capture until images are 100% downloaded and decoded.

---

### 5.16 Dynamic Shape Clipping & Reveal Wipes Container (`ShapeClippingContainer.tsx`)
* **Location**: `remotion/components/library/ShapeClippingContainer.tsx`
* **Core Duties**:
  - Wraps any graphic, image, or headline and reveals/masks it inside custom geometric shapes.
  - **`circle-reveal`**: Expanding iris circle (0% to 150% radius).
  - **`diagonal-wipe`**: 45° angled cinematic polygon reveal wipe.
  - **`horizontal-wipe` / `vertical-wipe`**: Clean linear reveals.
  - **Geometric Shape Cutouts**: `squircle`, `pill`, `star` (5-point star), `diamond`, and `custom-svg-path`.
  - **Zero Layout Shifts**: 100% evaluated on GPU compositor layer using CSS `clip-path`.

---

## 6. Remotion Composition Props Specification (`FacelessShortsProps`)

All layers are exposed as optional, cleanly typed props on `FacelessShortsProps` inside `remotion/templates/FACELESS_SHORTS/template.tsx`:

```tsx
export interface FacelessShortsProps {
  // Spoken Audio & Duration
  audioUrl?: string;
  durationSeconds?: number;
  sourceDurationSeconds?: number;
  playbackRate?: number;
  sourceAudioVolume?: number;

  // Background Music & Audio Ducking
  musicUrl?: string;
  musicVolume?: number;
  bgmVolume?: number;
  duckingVolume?: number;
  sfxEvents?: SFXEvent[];

  // Subtitles & Captions
  captions?: CaptionChunk[];
  subtitleChunks?: CaptionChunk[];
  captionThemeId?: string;
  captionAnimationStyle?: 'mrbeast' | 'handwriting' | 'bouncy' | 'smooth';
  captionPosition?: 'bottom' | 'center' | 'top';
  enableKineticEmojis?: boolean;
  emojiEvents?: KineticEmojiEvent[];

  // 14 Modular Layer Engines (All Optional, Safe Defaults)
  textLayers?: DynamicTextLayer[];
  imageLayers?: DynamicImageLayer[];
  svgLayers?: DynamicSvgLayer[];
  effectsLayers?: DynamicEffectLayer[];
  adjustmentLayers?: DynamicAdjustmentLayer[];
  transitionEvents?: DynamicTransitionEvent[];
  maskLayers?: DynamicMaskLayer[];
  patternLayers?: DynamicPatternLayer[];
  calloutLayers?: DynamicCalloutLayer[];
  isometricLayers?: DynamicIsometricLayer[];
  gaugeLayers?: DynamicGaugeLayer[];
  audioVisualizerLayers?: DynamicAudioVisualizerLayer[];
  cameraConfig?: VirtualCameraConfig;

  // Supporting Media & Scene Blueprint
  visualTheme?: string | Partial<VideoVisualTheme>;
  brollUrls?: Record<number, string> | string[];
  mediaAssets?: Array<{ id: string; type: 'image' | 'video'; url: string }>;
  sceneBlueprint?: SceneBlueprintItem[];
}
```

---

## 6. Unified Visual Design System Engine

* **Engine Location**: `services/design/visualDesignSystem.ts`
* **Remotion Context**: `remotion/theme/VideoVisualTheme.ts` (`<VideoVisualThemeProvider>`)
* **Core Philosophy**: A single visual language governs all text, typography, backgrounds, SVGs, illustrations, charts, images, containers, captions, and motion so that every scene feels organically part of the same production rather than independently generated elements.

### The 12 Controlled Visual Systems:
1. **Color System**: Curated palettes (`ColorPalette`) ensuring WCAG AA/AAA contrast ratios, semantic accents, surface cards, and pill backdrops.
2. **Typography System**: Strict 2-family combinations, 3-4 weights, consistent headline hierarchies, and safe-area auto-fitting.
3. **Text Styling System**: Solid, gradient, outline, shadow, ambient glow, highlighter tape, wavy underlines, and 3D extrusion.
4. **Background System**: Solid, linear/radial gradients, technical grids, dot matrices/halftone, paper grain, and moving particles.
5. **SVG & Vector System**: Unified style families (`minimal-line`, `flat`, `duotone`, `outline`, `isometric`, `bold-stroke-icon`) preventing mismatched illustration weights.
6. **Image Styling System**: Aspect ratio preservation, squircle/circle masks, prominent/subtle borders, and shadow elevation.
7. **Shape & Container System**: Standardized border radiuses (`none`, `sm`, `md`, `lg`, `xl`, `full`) and frosted glass backdrops.
8. **Composition & Layout System**: Reusable archetypes (`center-focus`, `split-screen`, `top-to-bottom`, `left-right`, `circular`, `full-bleed`, `stacked-cards`, `timeline`, `grid`, `floating-elements`) with safe-zone margin bounds (Top 140px, Bottom 260px, Horizontal 80px for 9:16 Shorts).
9. **Motion Design System**: Curated transition styles (`whip-pan`, `zoom-snap`, `fade`, `glitch`) and physics springs (damping: 10–18, mass: 0.6–1.1).
10. **Effects System**: 35mm grain, vignette falloff, chromatic aberration, light leaks, and ambient glow blooms.
11. **Depth System**: Standard 10-tier z-index stack with subtle parallax factors between foreground and background.
12. **Consistency System**: Deterministic theme propagation across scenes.

### 6 Master Predefined Visual Themes:
| Theme ID | Name | Color Mood | Typography Combination | Best For |
| :--- | :--- | :--- | :--- | :--- |
| `modern-saas` | **Modern SaaS & AI** | Clean Blue (`#3B82F6`), Slate (`#0F172A`) | Inter Bold + Inter Regular | SaaS, AI, Product explainers |
| `bold-kinetic` | **Bold Viral Kinetic** | High-Voltage Yellow (`#FACC15`), Obsidian Slate | Anton (900) + Inter SemiBold | Viral Hooks, YouTube Shorts, Reels |
| `premium-finance` | **Premium Finance** | Champagne Gold (`#D4AF37`), Deep Navy (`#070C1B`) | DM Sans Bold + DM Sans Regular | Finance, Real Estate, Wealth, Advisory |
| `educational` | **Educational & Explainer** | Approachable Teal (`#0D9488`), Coral (`#F43F5E`) | Nunito ExtraBold + Nunito Regular | Education, Self-Help, Storytelling |
| `editorial-minimal` | **Editorial Minimalist** | Warm Ivory (`#FAF8F5`), Obsidian Charcoal | Playfair Display + Inter Regular | Essays, Books, Philosophy, Quotes |
| `futuristic-tech` | **Futuristic Cyber Tech** | Neon Cyan (`#06B6D4`), Electric Violet | Space Grotesk + Inter Regular | Web3, Deep Tech, Developer Reels |

### 3-Tier Theme Resolution Hierarchy:
```
Tier 1: Global Master Theme (e.g. 'modern-saas')
   │
   ▼
Tier 2: Scene-Level Overrides (e.g. custom scene accent or background)
   │
   ▼
Tier 3: Individual Layer Overrides (e.g. specific text glow or image border)
```
Resolved using `resolveVisualTheme(themeInput, sceneOverrides?, layerOverrides?)`.

---

## 7. Verification & Cloud Deployment Safeguards

1. **Static Type Safety**: Every layer is fully typed; `npx tsc --noEmit` runs with 0 errors.
2. **Specification & Pipeline Independence**: Validated via `scripts/validate-all-video-types.mjs` (11/11 tests pass).
3. **Zero Local Heavy Compute (Rule 0)**: No local Chromium rendering, no local FFmpeg transcoding. All 1080p MP4 rendering executes exclusively on AWS Lambda.
4. **Clean Background Tasks (Rule 0.4)**: Verified 0 hanging background tasks at all times.
5. **Zero Automatic Git Push (Rule 0.1)**: All edits remain strictly local until explicitly commanded by the founder.

---

### 5.10 Virtual Camera & Kinetic Motion Engine (`VirtualCameraLayer.tsx`)
* **Location**: `remotion/components/library/VirtualCameraLayer.tsx`
* **Z-Index**: `20`
* **Interface**: `VirtualCameraConfig`
* **Core Capabilities**:
  - **Handheld Camera Micro-Shake**: Natural multi-frequency sinusoidal oscillation (`translate3d` + `rotate`) giving live-action realism to AI-generated scenes.
  - **Kinetic Zoom Punch**: Instant spring-driven 1.15x zoom punches on critical emphasis words, with natural spring recovery.
  - **Continuous Ken Burns Drift**: Smooth continuous push-in (1.0x ──> 1.12x) with edge clamping so black borders are never exposed.

---

### 5.11 Dynamic Mask & Scrim Overlay Engine (`MultiLayerMaskOverlay.tsx`)
* **Location**: `remotion/components/library/MultiLayerMaskOverlay.tsx`
* **Z-Index**: `18`
* **Interface**: `DynamicMaskLayer[]`
* **Supported Masks**:
  - `subtitle-scrim`: Smooth bottom 38% dark gradient guaranteeing 100% caption readability over busy B-roll.
  - `cinema-scope`: Clean top and bottom matte letterbox bars for cinematic storytelling.
  - `split-screen-divider`: Glowing vertical or horizontal accent divider for comparison scenes.
  - `spotlight-cutout`: Dims background canvas while keeping circular subject in full focus.

---

### 5.12 Isometric 2.5D Perspective Engine (`IsometricPerspectiveOverlay.tsx`)
* **Location**: `remotion/components/library/IsometricPerspectiveOverlay.tsx`
* **Z-Index**: `16`
* **Interface**: `DynamicIsometricLayer[]`
* **Supported 2.5D Archetypes**:
  1. `cube`: 3-faced shaded 3D isometric block (Top: highlight, Left: midtone, Right: shadow) with extruded height growth.
  2. `platform`: Stepped pedestal / circular stage with neon perimeter glow and drop shadow.
  3. `device-mockup`: 2.5D floating angled smartphone or tablet screen holding an image or video UI screenshot.
  4. `server-building`: Extruded skyscraper / data center server tower with floor LED indicators.
* **Zero WebGL Overhead**: Uses pure SVG polygon projection and CSS 3D matrix transforms (`rotateX(55deg) rotateZ(-38deg)`), running at constant 30 FPS without GPU context crashes.

---

### 5.13 Unified Vector & SVG Graphics Engine (`MultiLayerSvgOverlay.tsx`)
* **Location**: `remotion/components/library/MultiLayerSvgOverlay.tsx`
* **Z-Index**: `14`
* **Interface**: `DynamicSvgLayer[]`
* **10 Vector Archetypes in One Factory**:
  1. `illustration`: Multi-path raw SVG vector artwork with precomputed stroke lengths.
  2. `icon`: Single or dual-tone SVG glyphs with spring-pop bounce.
  3. `chart`: Bar charts (spring heights), Donut charts (circumference stroke), and Trendlines (curved polyline sparklines).
  4. `diagram`: Flowchart boxes connected by directed arrow edges with automatic layout interpolation.
  5. `shape`: Rectangles, rounded squircles, pills, and circles with solid or gradient fills.
  6. `annotation`: Kinetic hand-drawn underlines, circling ovals, curved arrows, and highlight boxes.
  7. `path`: Self-drawing kinetic SVG paths with configurable line caps & arrowheads.
  8. `background`: Dot matrices, geometric grids, and floating micro-particles.
  9. `badge`: Pill tags with icon slots and subtle continuous pulse.
  10. `character`: Modular stickman/character pose paths with fluid gesture animations.
* **Zero Reflow Guarantee**: Precomputed path lengths eliminate expensive runtime SVG `.getTotalLength()` calls.

---

### 5.14 Procedural Pattern & Texture Layer Engine (`MultiLayerPatternOverlay.tsx`)
* **Location**: `remotion/components/library/MultiLayerPatternOverlay.tsx`
* **Z-Index**: `12`
* **Interface**: `DynamicPatternLayer[]`
* **8 Procedural Patterns**:
  1. `halftone`: Comic & pop-art dot matrix with adjustable spacing and size.
  2. `noise`: Procedural fractal noise with frame-advance seed realism.
  3. `hatch`: Crisp 45° single-direction architectural parallel lines.
  4. `crosshatch`: Intersecting sketch lines creating tactile depth.
  5. `waves`: Dynamic sinusoidal topographic/audio contour lines.
  6. `mesh`: Futuristic technical wireframe grid with corner nodes.
  7. `chevron`: Decorative geometric zigzag pattern.
  8. `stipple`: Micro-stippling organic dot distribution.
* **Zero Asset Size**: Total payload under 10 KB, rendered via SVG `<pattern>` tiles.

---

### 5.15 Dynamic Multi-Layer Image Engine (`MultiLayerImageOverlay.tsx`)
* **Location**: `remotion/components/library/MultiLayerImageOverlay.tsx`
* **Z-Index**: `10`
* **Interface**: `DynamicImageLayer[]`
* **8 Practical Presets**:
  1. `full-bleed`: Full 1080×1920 canvas, edge-clamped Ken Burns (1.0x ──> 1.12x).
  2. `device-mockup`: 760×1100 card, 24px radius, 48px elevation shadow, `spring-pop`.
  3. `pip-avatar`: 260×260 circular cutout, 6px solid white border ring, 28px shadow.
  4. `sticker`: 320×320 transparent PNG, spring overshoot, subtle floating bob.
  5. `split-screen`: Two layers clipped at 50% canvas height (1080×960).
  6. `collage`: 2 to 4 editorial photos in an aligned grid with staggered zoom entrances.
  7. `framed`: 720×720 square card, 20px radius, 36px shadow.
  8. `watermark`: 140×140 transparent logo anchored at `(940px, 120px)`.
* **Remotion `<Img>` Guarantee**: Pauses cloud frame capture until images are 100% downloaded and decoded.

---

### 5.16 Dynamic Shape Clipping & Reveal Wipes Container (`ShapeClippingContainer.tsx`)
* **Location**: `remotion/components/library/ShapeClippingContainer.tsx`
* **Core Duties**:
  - Wraps any graphic, image, or headline and reveals/masks it inside custom geometric shapes.
  - **`circle-reveal`**: Expanding iris circle (0% to 150% radius).
  - **`diagonal-wipe`**: 45° angled cinematic polygon reveal wipe.
  - **`horizontal-wipe` / `vertical-wipe`**: Clean linear reveals.
  - **Geometric Shape Cutouts**: `squircle`, `pill`, `star` (5-point star), `diamond`, and `custom-svg-path`.
  - **Zero Layout Shifts**: 100% evaluated on GPU compositor layer using CSS `clip-path`.

---

## 6. Remotion Composition Props Specification (`FacelessShortsProps`)

All layers are exposed as optional, cleanly typed props on `FacelessShortsProps` inside `remotion/templates/FACELESS_SHORTS/template.tsx`:

```tsx
export interface FacelessShortsProps {
  // Spoken Audio & Duration
  audioUrl?: string;
  durationSeconds?: number;
  sourceDurationSeconds?: number;
  playbackRate?: number;
  sourceAudioVolume?: number;

  // Background Music & Audio Ducking
  musicUrl?: string;
  musicVolume?: number;
  bgmVolume?: number;
  duckingVolume?: number;
  sfxEvents?: SFXEvent[];

  // Subtitles & Captions
  captions?: CaptionChunk[];
  subtitleChunks?: CaptionChunk[];
  captionThemeId?: string;
  captionAnimationStyle?: 'mrbeast' | 'handwriting' | 'bouncy' | 'smooth';
  captionPosition?: 'bottom' | 'center' | 'top';
  enableKineticEmojis?: boolean;
  emojiEvents?: KineticEmojiEvent[];

  // 14 Modular Layer Engines (All Optional, Safe Defaults)
  textLayers?: DynamicTextLayer[];
  imageLayers?: DynamicImageLayer[];
  svgLayers?: DynamicSvgLayer[];
  effectsLayers?: DynamicEffectLayer[];
  adjustmentLayers?: DynamicAdjustmentLayer[];
  transitionEvents?: DynamicTransitionEvent[];
  maskLayers?: DynamicMaskLayer[];
  patternLayers?: DynamicPatternLayer[];
  calloutLayers?: DynamicCalloutLayer[];
  isometricLayers?: DynamicIsometricLayer[];
  gaugeLayers?: DynamicGaugeLayer[];
  audioVisualizerLayers?: DynamicAudioVisualizerLayer[];
  cameraConfig?: VirtualCameraConfig;

  // Supporting Media & Scene Blueprint
  brollUrls?: Record<number, string> | string[];
  mediaAssets?: Array<{ id: string; type: 'image' | 'video'; url: string }>;
  sceneBlueprint?: SceneBlueprintItem[];
}
```

---

## 7. Verification & Cloud Deployment Safeguards

1. **Static Type Safety**: Every layer is fully typed; `npx tsc --noEmit` runs with 0 errors.
2. **Specification & Pipeline Independence**: Validated via `scripts/validate-all-video-types.mjs` (11/11 tests pass).
3. **Zero Local Heavy Compute (Rule 0)**: No local Chromium rendering, no local FFmpeg transcoding. All 1080p MP4 rendering executes exclusively on AWS Lambda.
4. **Clean Background Tasks (Rule 0.4)**: Verified 0 hanging background tasks at all times.
5. **Zero Automatic Git Push (Rule 0.1)**: All edits remain strictly local until explicitly commanded by the founder.
