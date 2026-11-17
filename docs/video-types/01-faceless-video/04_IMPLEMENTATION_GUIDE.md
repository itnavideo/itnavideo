# Implementation Guide (Developer)

Step-by-step plan to implement the layout system in Remotion + Next.js + AWS Lambda. Code is TypeScript. Adjust names to your repo. Check your Remotion version: in recent versions the audio component may be `Html5Audio` (import from `remotion`), in older ones `Audio`.

---

## 1. Repo structure

```
/remotion
  /compositions
    FacelessVideo.tsx          # root composition, reads inputProps
    LayoutGallery.tsx          # preview every layout with fixtures
  /core
    tokens.ts                  # colors, type scale, springs, safe area
    time.ts                    # ms <-> frames
    schema.ts                  # zod schemas (scene, element, plan)
    registry.ts                # layoutId -> component + metadata
    Animated.tsx               # entrance/exit primitive
    SceneRenderer.tsx          # picks layout, renders elements
    Background.tsx             # layers 1-2 (+ grain, vignette)
    Captions.tsx               # karaoke captions
    AudioMix.tsx               # VO, BGM ducking, SFX
  /layouts
    HookTypographyScene.tsx
    StatScene.tsx
    ComparisonScene.tsx
    CardConceptScene.tsx
    ListScene.tsx
    ... (one file per layout)
  /parts                       # procedural illustration parts
  /fixtures                    # layout test data (JSON)
/services
  /planner
    preprocess.ts              # sentence grouping + features
    storyDirector.ts           # pass 1
    layoutDirector.ts          # pass 2
    fallbackRouter.ts
    validators/*.ts
    repair.ts
    assets.ts                  # resolve + dedupe + fallback ladder
/docs  (these MD files)
```

---

## 2. Schemas (zod)

`core/schema.ts`

```ts
import { z } from 'zod';

export const PresetName = z.enum([
  'popIn','bouncePop','slideUp','slideLeft','slideRight','maskReveal',
  'drawOn','countUp','typeWords','highlightSweep','scalePulse','float','none',
]);

export const Emphasis = z.enum(['hero','primary','secondary','ambient']);

export const ElementSchema = z.object({
  id: z.string(),
  slot: z.string(),
  type: z.enum(['text','number','icon','svg','image','video','chart','shape','arrow','card','badge','emoji','mockup','group']),
  emphasis: Emphasis,
  content: z.record(z.any()),
  enter: z.object({
    preset: PresetName,
    atMs: z.number().optional(),
    anchorWordIndex: z.number().optional(),
    afterElementId: z.string().optional(),
    delayMs: z.number().optional(),
  }),
  exit: z.object({ preset: PresetName.optional(), atMs: z.number().optional() }).optional(),
});

export const SceneSchema = z.object({
  sceneId: z.string(),
  startMs: z.number(),
  endMs: z.number(),
  intent: z.string(),
  viewerShouldUnderstand: z.string().optional(),
  layoutId: z.string(),
  layoutVariant: z.string().default('A'),
  elements: z.array(ElementSchema).min(1),
  emphasisWords: z.array(z.object({ wordIndex: z.number(), treatment: PresetName })).default([]),
  sfx: z.array(z.object({ atWordIndex: z.number().optional(), atMs: z.number().optional(), cue: z.string() })).default([]),
  captions: z.object({ mode: z.enum(['show','suppress','minimal']).default('show') }),
  transitionIn: z.enum(['cut','fade','crossfade','slide','zoom']).default('crossfade'),
});

export type Scene = z.infer<typeof SceneSchema>;
export type SceneElement = z.infer<typeof ElementSchema>;
```

**Resolved scene** (after choreography pass) adds `enterMs`/`exitMs` (scene-relative) to each element and `words[]` for the scene. The renderer only consumes resolved scenes.

---

## 3. Time conversion

`core/time.ts`

```ts
export const FPS = 30;
export const msToFrames = (ms: number) => Math.round((ms * FPS) / 1000);

// Build contiguous scene frame ranges so no gaps/overlaps appear from rounding
export function toFrameRanges(scenes: { startMs: number; endMs: number }[], totalMs: number) {
  const starts = scenes.map(s => msToFrames(s.startMs));
  return scenes.map((s, i) => {
    const start = starts[i];
    const end = i < scenes.length - 1 ? starts[i + 1] : msToFrames(totalMs);
    return { start, duration: Math.max(1, end - start) };
  });
}
```

---

## 4. Scene renderer and the animation primitive

`core/Animated.tsx`

```tsx
import React from 'react';
import { spring, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { springs } from './tokens';
import { msToFrames } from './time';

type Props = {
  enterMs: number;
  exitMs?: number;               // scene-relative
  preset: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
};

export const Animated: React.FC<Props> = ({ enterMs, exitMs, preset, children, style }) => {
  const frame = useCurrentFrame();          // scene-local because we are inside a <Sequence>
  const { fps } = useVideoConfig();
  const enterF = msToFrames(enterMs);
  const exitF = exitMs != null ? msToFrames(exitMs) : Infinity;

  const cfg = preset === 'bouncePop' ? springs.bouncy : preset === 'maskReveal' ? springs.soft : springs.snappy;
  const p = spring({ frame: frame - enterF, fps, config: cfg });         // 0 -> 1
  const out = interpolate(frame, [exitF, exitF + 9], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  if (frame < enterF) return null;                                       // not visible before its time
  let transform = '';
  let clipPath: string | undefined;
  switch (preset) {
    case 'popIn':       transform = `scale(${0.85 + 0.15 * p})`; break;
    case 'bouncePop':   transform = `scale(${0.6 + 0.4 * p})`; break;
    case 'slideUp':     transform = `translateY(${(1 - p) * 40}px)`; break;
    case 'slideLeft':   transform = `translateX(${(1 - p) * 60}px)`; break;
    case 'slideRight':  transform = `translateX(${-(1 - p) * 60}px)`; break;
    case 'maskReveal':  clipPath = `inset(0 ${100 - p * 100}% 0 0)`; break;
    default: break;
  }
  const opacity = Math.min(1, p * 1.4) * out;
  return <div style={{ transform, clipPath, opacity, willChange: 'transform, opacity', ...style }}>{children}</div>;
};
```

`core/SceneRenderer.tsx`

```tsx
import React from 'react';
import { AbsoluteFill, Sequence } from 'remotion';
import { layoutRegistry } from './registry';
import { ResolvedScene } from './schema';

export const SceneRenderer: React.FC<{ scene: ResolvedScene; from: number; duration: number; theme: any }> = ({ scene, from, duration, theme }) => {
  const entry = layoutRegistry[scene.layoutId];
  if (!entry) {
    // Never silently fall back. Show a loud error in dev, and a typography fallback in production.
    console.error(`Unknown layoutId: ${scene.layoutId}`);
    const Fallback = layoutRegistry['HookTypographyScene'].component;
    return <Sequence from={from} durationInFrames={duration}><Fallback scene={scene} theme={theme} /></Sequence>;
  }
  const Layout = entry.component;
  return (
    <Sequence from={from} durationInFrames={duration}>
      <AbsoluteFill><Layout scene={scene} theme={theme} /></AbsoluteFill>
    </Sequence>
  );
};
```

`core/registry.ts`

```ts
export const layoutRegistry: Record<string, {
  component: React.FC<{ scene: ResolvedScene; theme: any }>;
  requiredSlots: string[];
  optionalSlots: string[];
  minElements: number;
  maxElements: number;
  durationMs: [number, number];
  variants: string[];
}> = {
  StatScene: { component: StatScene, requiredSlots: ['value','label','iconBadge'], optionalSlots: ['context','miniViz','ambient'], minElements: 5, maxElements: 8, durationMs: [2500, 6000], variants: ['A','B'] },
  // ...register all layouts here
};
```

Use this registry to (a) render, (b) validate, and (c) auto-generate the compact catalog that goes into the planner prompt. One source of truth.

---

## 5. Writing a layout (example: `StatScene`)

Approach for every layout:
1. Read elements by slot with a helper.
2. Position with the regions/geometry from file 01.
3. Wrap each element in `<Animated enterMs=... preset=...>`.
4. Apply hierarchy sizes from tokens.
5. Gracefully handle missing optional slots.

```tsx
import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { Animated } from '../core/Animated';
import { msToFrames } from '../core/time';
import { ResolvedScene } from '../core/schema';

const bySlot = (scene: ResolvedScene, slot: string) => scene.elements.find(e => e.slot === slot);

export const StatScene: React.FC<{ scene: ResolvedScene; theme: any }> = ({ scene, theme }) => {
  const frame = useCurrentFrame();
  const value = bySlot(scene, 'value');
  const label = bySlot(scene, 'label');
  const context = bySlot(scene, 'context');
  const icon = bySlot(scene, 'iconBadge');
  const viz = bySlot(scene, 'miniViz');

  // count-up
  const target = Number(value?.content.number ?? 0);
  const startF = msToFrames(value?.enterMs ?? 0);
  const t = interpolate(frame, [startF, startF + 33], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const eased = 1 - Math.pow(1 - t, 3);
  const shown = Math.round(target * eased).toLocaleString(value?.content.locale ?? 'en-US');

  return (
    <AbsoluteFill style={{ padding: '80px 120px 200px' }}>
      {/* ambient glow */}
      <div style={{ position: 'absolute', left: 560, top: 180, width: 800, height: 800, borderRadius: '50%',
        background: `radial-gradient(circle, ${theme.accent}22, transparent 65%)` }} />

      {icon && (
        <Animated enterMs={icon.enterMs} exitMs={icon.exitMs} preset="bouncePop" style={{ position: 'absolute', left: 520, top: 210 }}>
          <div style={{ width: 140, height: 140, borderRadius: '50%', background: theme.card, boxShadow: theme.shadowCard,
            display: 'grid', placeItems: 'center' }}>
            {/* render icon by content.svg or content.name */}
          </div>
        </Animated>
      )}

      {value && (
        <Animated enterMs={value.enterMs} exitMs={value.exitMs} preset="popIn"
          style={{ position: 'absolute', left: 0, right: 0, top: 260, textAlign: 'center' }}>
          <span style={{ fontFamily: theme.font1, fontWeight: 900, fontSize: 280, letterSpacing: '-0.03em', color: theme.textPrimary }}>
            {value.content.prefix}{shown}<span style={{ color: theme.accent }}>{value.content.suffix}</span>
          </span>
        </Animated>
      )}

      {label && (
        <Animated enterMs={label.enterMs} exitMs={label.exitMs} preset="slideUp"
          style={{ position: 'absolute', left: 0, right: 0, top: 590, textAlign: 'center' }}>
          <span style={{ fontFamily: theme.font2, fontWeight: 700, fontSize: 52, color: theme.textSecondary }}>{label.content.text}</span>
        </Animated>
      )}

      {context && (
        <Animated enterMs={context.enterMs} exitMs={context.exitMs} preset="popIn"
          style={{ position: 'absolute', left: 0, right: 0, top: 680, textAlign: 'center' }}>
          <span style={{ fontFamily: theme.font2, fontSize: 36, color: theme.muted }}>{context.content.text}</span>
        </Animated>
      )}

      {/* viz: render sparkline/ring in right third if provided */}
    </AbsoluteFill>
  );
};
```

Repeat for each layout. **Rule:** layouts must never read raw text from the scene sentence; they read `elements` only.

---

## 6. Layout Gallery (build this first)

`compositions/LayoutGallery.tsx` renders every layout with fixture data, sequentially, 4–6 s each, so you can scrub in Remotion Studio and judge polish without running the AI.

```tsx
import { Series } from 'remotion';
import fixtures from '../fixtures/index';   // { StatScene: [fixtureA, fixtureB], ... }

export const LayoutGallery = () => (
  <Series>
    {Object.entries(fixtures).flatMap(([layoutId, list]) =>
      list.map((fx, i) => (
        <Series.Sequence key={`${layoutId}-${i}`} durationInFrames={Math.round((fx.endMs - fx.startMs) * 30 / 1000)}>
          <SceneRenderer scene={fx} from={0} duration={Math.round((fx.endMs - fx.startMs) * 30 / 1000)} theme={lightTheme} />
        </Series.Sequence>
      ))
    )}
  </Series>
);
```

Create fixtures for **each layout** with: minimum content, maximum content, Hinglish text, dark theme, missing optional slots. The silhouette test and the acceptance checklist (file 01, section 8) run here.

Register it in `Root.tsx` as a separate `<Composition id="LayoutGallery" ... />`.

---

## 7. Planner service

`services/planner/layoutDirector.ts` (outline)

```ts
export async function planScenes(chunks: Chunk[], macro: MacroPlan, ctx: PlanContext) {
  const batches = batch(chunks, 6);
  const scenes: Scene[] = [];
  for (const b of batches) {
    const prompt = buildLayoutPrompt({
      macro,
      catalog: buildCompactCatalog(layoutRegistry),   // from registry
      chunks: b,
      recentLayouts: lastN(scenes.map(s => s.layoutId), 3),
      usedAssetIds: [...ctx.usedAssetIds],
    });
    let result = await callLLM(prompt, { json: true, temperature: 0.6 });
    for (let round = 0; round < 3; round++) {
      const report = validateScenes(result.scenes, ctx);
      if (report.ok) break;
      if (round === 2) { result.scenes = applyFallbacks(result.scenes, report, ctx); break; }
      result = await callLLM(buildRepairPrompt(result.scenes, report), { json: true, temperature: 0.3 });
    }
    scenes.push(...result.scenes);
    ctx.registerUsedAssets(result.scenes);
  }
  return scenes;
}
```

Tips:
- Use **structured outputs / JSON schema mode** if your LLM provider supports it; otherwise parse with zod and treat failure as a repair case.
- Temperature 0.5–0.7 for diversity; lower for repair.
- Keep batches to 5–8 scenes to avoid truncation and the "lazy later scenes" problem.
- Log every raw and validated plan (file 02, section 13).

Example validator:

```ts
export const elementBudget: Validator = (scene) => {
  const secs = (scene.endMs - scene.startMs) / 1000;
  const min = secs < 3 ? 3 : secs < 6 ? 5 : 7;
  const count = scene.elements.filter(e => e.emphasis !== 'ambient' || true).length;
  return count >= min ? ok() : fail(`elementBudget: needs >=${min}, has ${count}`);
};
```

---

## 8. Captions component

`core/Captions.tsx` outline:

```tsx
export const Captions: React.FC<{ words: Word[]; preset: CaptionPreset; mode: 'show'|'suppress'|'minimal' }> = ({ words, preset, mode }) => {
  const frame = useCurrentFrame();            // GLOBAL frame (render outside scene sequences)
  const nowMs = (frame / 30) * 1000;
  if (mode === 'suppress') return null;

  const groups = useMemo(() => groupWords(words, { maxWords: 8, pauseMs: 250 }), [words]);
  const g = groups.find(g => nowMs >= g.startMs && nowMs < g.endMs + 120);
  if (!g) return null;
  return (
    <div style={{ position: 'absolute', left: 120, right: 120, bottom: 80, textAlign: 'center' }}>
      <div style={preset.container}>
        {g.words.map((w, i) => {
          const active = nowMs >= w.startMs && nowMs < w.endMs;
          return <span key={i} style={active ? preset.active : preset.inactive}>{w.text} </span>;
        })}
      </div>
    </div>
  );
};
```

Place `Captions` in the root composition **above** all scenes, so the caption mode per scene is read from the scene that is currently active (look up by time). Do not render captions inside each scene's sequence or they will reset on every scene change.

---

## 9. Audio: ducking and SFX (and why SFX may not play)

### Ducking envelope

```ts
export function buildDuckEnvelope(speech: {startMs:number; endMs:number}[], totalFrames: number) {
  const target = new Float32Array(totalFrames).fill(0.26);
  for (const s of speech) {
    const a = Math.floor(s.startMs * 30 / 1000), b = Math.ceil(s.endMs * 30 / 1000);
    for (let f = a; f < Math.min(b, totalFrames); f++) target[f] = 0.12;
  }
  // smooth: attack 150ms (~5 frames), release 500ms (~15 frames)
  const out = new Float32Array(totalFrames);
  let v = target[0];
  for (let f = 0; f < totalFrames; f++) {
    const down = target[f] < v;
    const k = down ? 1 / 5 : 1 / 15;
    v += (target[f] - v) * k;
    out[f] = v;
  }
  return out;
}
```

Merge speech segments whose gap is < 600 ms before calling (so BGM does not pump between words).

```tsx
const env = useMemo(() => buildDuckEnvelope(mergedSpeech, totalFrames), [mergedSpeech, totalFrames]);
<Audio src={bgmUrl} volume={(f) => env[f] ?? 0.12} loop />
<Audio src={voiceoverUrl} volume={1} />
```

Note: `volume` callback frame is relative to the audio's own start; if BGM sits inside a Sequence, `f` is relative to the Sequence start. Put BGM at root (frame 0) to keep it simple.

### SFX

```tsx
{sfxCues.map(c => (
  <Sequence key={c.id} from={Math.max(0, msToFrames(c.atMs) - jCutFrames)} durationInFrames={msToFrames(c.durationMs)}>
    <Audio src={c.url} volume={c.volume ?? 0.35} />
  </Sequence>
))}
```

### Checklist when "SFX are defined but sometimes don't play"

1. Is `sound.json` / cue list actually included in `inputProps` sent to Lambda? Log `sfxCues.length` inside the composition.
2. Is each cue's `atMs` inside the video duration? (Cues past the end never play.)
3. Is the `url` public and CORS-enabled for the Lambda renderer (S3 bucket policy + CORS)? A 403 silently produces no sound. Pre-check with HTTP 200 in the audit.
4. Is the audio file duration shorter than `durationInFrames`? If you set the Sequence too short, the SFX is cut.
5. Is the SFX overlapping a ducked VO but with volume 0 due to a mistaken multiplier? Log the final volume.
6. Do two cues collide within 700 ms and one is filtered out by your own spacing rule? Log dropped cues.
7. Does the scene skip its sfx array because the layout ignores `scene.sfx`? Make SFX a **global** pass (build one list from all scenes), not something each layout plays.
8. Are you rendering with `muted: true` or a codec/audio setting that drops audio? Check the render options.
9. Are SFX files loaded via `staticFile()` locally but not uploaded when running on Lambda? Use S3 URLs in production.

---

## 10. Render pipeline, credits, reliability

- Job states: `uploaded → transcribing → planned → validating → rendering → qa → ready | failed`.
- **Credits:** reserve at job creation (`ceil(minutes)`); commit on success; auto-refund on failure or timeout. Make the refund idempotent (store `refundedAt`).
- **Retries:** transcription 2× with fallback; render chunk retry per Lambda failure; whole-job retry once.
- **Preview first:** render a 480p low-fps preview (10 fps) of the first 20 s or per-scene stills before the full render. Optional but reduces wasted credits.
- **Per-scene regeneration:** since scenes are modular JSON, allow "regenerate this scene" or "change layout" in the UI.
- **Limits:** audio ≤ 300 s, ≤ 50 MB, formats MP3/WAV/M4A; reject invalid with clear messages (do not silently trim without telling the user).
- **Cost monitoring:** log per job: LLM tokens, Lambda duration, S3 egress; compare to credits.
- **Presigned URLs:** expiry (e.g. 24 h), single-use if possible.

---

## 11. Testing strategy

1. **Unit:** `msToFrames`, `toFrameRanges` (no gaps/overlaps), `buildDuckEnvelope`, validators, fallback router.
2. **Fixture snapshots:** render a still at 25%, 50%, 90% of each fixture and compare against baselines (use Remotion `renderStill` + image diff with tolerance).
3. **Planner contract tests:** run the planner on 5 reference scripts (finance, tech tutorial, Islamic/Quran, history, Hinglish motivation). Assert: no back-to-back layout, ≥8 unique layouts per 3 minutes, element budget satisfied, zero reused assets, no invented numbers.
4. **Visual QA contact sheet:** render 1 still/second, assemble a grid, review manually before launch.
5. **Sync test:** render a video with a click track at known word times; verify caption highlights within ±1 frame.
6. **Load test:** 5-minute video renders across Lambda concurrency limits.

---

## 12. Debugging playbook — "Only a few elements show / looks plain"

Work top to bottom. Stop at the first problem found.

1. **Open `plan.raw.json`.** How many `elements` per scene? If 1–3, the planner is the problem (prompt lacks catalog/budget/schema). Fix file 02.
2. **Open `validation-report.json`.** Did `elementBudget` or `requiredSlots` fail and fall back? If fallbacks are firing for most scenes, the LLM prompt or schema is mismatched.
3. **Check layout distribution:** count `layoutId` usage. If > 40% is one layout, the variety score/penalty is not applied.
4. **Check the renderer:** does each layout actually render every slot? Add a dev overlay that outlines each element and prints `slot / enterMs`. Missing elements often have `enterMs` beyond scene length (anchor index out of range), `opacity 0`, or are positioned off-canvas.
5. **Check anchors:** `anchorWordIndex` must be relative to **scene words**, not the global transcript. A global index makes elements enter minutes late or never.
6. **Check assets:** are icons resolving (HTTP 200)? Failed icons render nothing, so a scene looks empty. The audit must replace them.
7. **Check z-index/layers:** background layer might cover content if its scene container is not transparent.
8. **Check fonts:** if Font 1/2 are not loaded, text appears in a default serif/sans and kills polish. Use `delayRender` until loaded.
9. **Check timing:** scenes cut off elements that have not entered; durations too short for the element count.
10. **Run the Layout Gallery.** If the gallery looks good but real videos look plain, the problem is the planner/asset pipeline, not the layouts. If the gallery looks plain, fix the layouts and design tokens.

---

## 13. Task plan (suggested sprints)

**Sprint 1 — Foundation (1–2 weeks):** upload → S3 → job queue → transcription → word timestamps → blank scenes with audio + captions rendering; credit reserve/refund; status page.

**Sprint 2 — Layout core (1–2 weeks):** tokens, `Animated`, `SceneRenderer`, registry, Background (depth), Layout Gallery, first five layouts (Hook, Stat, Comparison, CardConcept, List) with fixtures; polish until reviewed by your video editor.

**Sprint 3 — Planner (1–2 weeks):** preprocess, story director, layout director, validators, repair loop, fallback router, asset resolver with dedupe and procedural parts v1.

**Sprint 4 — Remaining layouts + sound (1–2 weeks):** Process, Workflow, Roadmap, Chart, DrawingStory, UIMockup, NodeGraph, Funnel, Definition, Quote, Chapter, Outro; SFX pass; ducking; transitions.

**Sprint 5 — Specialized + QA (1 week):** Quran module with verified text DB, Hinglish/Devanagari captions, more caption presets, analytics, contact-sheet QA, load tests.

After each sprint: show 3 sample videos to your editor, collect feedback, convert to measurable rules in file 01/02.

---

## 14. Prompts you can give an AI coding agent

**Task: implement a layout**
```
Context: read 00_INDEX_AND_DECISIONS.md and 01_LAYOUT_CATALOG.md (layout L03 StatScene) and 03_DESIGN_SYSTEM_AND_POLISH.md.
Implement /remotion/layouts/StatScene.tsx following the slot list, geometry, and choreography in L03.
Use Animated from core/Animated.tsx, tokens from core/tokens.ts, safe area 120/80.
Register it in core/registry.ts with requiredSlots/optionalSlots/minElements/maxElements/durationMs.
Create 4 fixtures (min content, max content, Hinglish, dark theme) in /remotion/fixtures.
Do not read text from the scene sentence; read only elements by slot.
Acceptance: all checks in file 01 section 8 pass in LayoutGallery.
```

**Task: implement validators**
```
Read 02_AI_PLANNER_AND_ROUTER.md section 7. Implement each validator as a pure function (scene, ctx) => {ok, reason}.
Add unit tests with passing and failing examples for each.
Export validateScenes(scenes, ctx) that returns a report listing all failures per scene.
```

**Task: implement the planner**
```
Read 02 sections 1-9. Implement preprocess.ts, storyDirector.ts, layoutDirector.ts, repair.ts, fallbackRouter.ts, assets.ts.
Build the compact catalog from layoutRegistry. Use zod parsing; on parse failure, treat as a repair case.
Log raw and validated plans per job.
```

