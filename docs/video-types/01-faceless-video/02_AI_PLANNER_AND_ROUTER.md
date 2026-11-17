# AI Planner, Layout Router & Validators

This file defines how narration becomes a scene plan that actually uses the layout system (see `01_LAYOUT_CATALOG.md`). The key idea: **the LLM proposes, code validates, and a repair loop fixes.** Never trust the LLM output blindly.

---

## 1. Pipeline overview

```
audio
 → transcription.json (words + ms timestamps)
 → sentence/beat grouping (code)
 → PASS 1: Story Director (macro)           [LLM call #1]
 → PASS 2: Layout Director (micro, per chunk) [LLM calls, 5–8 scenes each]
 → Asset resolution (library search / generation / SVG composition)
 → Choreography pass (anchors, stagger)     [code + optional LLM]
 → Sound cues (SFX)                         [code rules + optional LLM]
 → VALIDATORS (code) → pass? → render
                     → fail? → repair loop (max 2 rounds) → fallback ladder
```

Why two passes: the macro pass sees the whole story (tone, structure, chapters, repeated ideas), so layouts vary and visuals build on each other. The micro pass focuses on slot filling for a few scenes at a time with the full catalog.

---

## 2. Pre-processing (code, no LLM)

1. **Group words into sentences** using punctuation and pauses > 450 ms.
2. **Compute sentence features:**
   - duration in ms, word count, speaking rate;
   - contains numbers (digits, spelled numbers, "thousand", "lakh", "crore", "million");
   - contains currency/percent;
   - contains contrast markers: `vs, versus, instead of, rather than, unlike, compared to, but, however, before, after, old, new`;
   - contains sequence markers: `first, second, third, then, next, finally, step`;
   - contains list markers: `three, 3, five, 5 ... habits/ways/mistakes/tips/reasons`;
   - contains tool/product names (matched against a small gazetteer + LLM tagging);
   - question mark or imperative.
3. **Candidate scene grouping:** merge short sentences (< 2 s) with neighbors; split sentences longer than 10 s at commas or conjunctions. Target **3–8 s per scene**.
4. Output: `chunks[]` each with `startMs`, `endMs`, `text`, `words[]`, `features`.

The features become **hints** to the LLM (not final decisions) and also feed the rule-based fallback router (section 6).

---

## 3. Pass 1 — Story Director (macro)

**Input:** full transcript, total duration, language, optional user topic/title, selected canvas theme (light/dark).

**Output (JSON):**

```json
{
  "topic": "Saving money habits",
  "tone": "motivational, educational",
  "audience": "young professionals",
  "structure": [
    { "chapter": 1, "title": "The Problem", "startMs": 0, "endMs": 38000 },
    { "chapter": 2, "title": "The 3 Habits", "startMs": 38000, "endMs": 120000 }
  ],
  "recurringMotifs": ["coins", "growth arrow"],
  "visualStyleNotes": "clean, vector, warm accent",
  "layoutBudgetPlan": {
    "HookTypographyScene": 1, "StatScene": 3, "ComparisonScene": 2,
    "CardConceptScene": 5, "ListScene": 2, "ChartScene": 1, "OutroScene": 1
  }
}
```

**Prompt (copy-paste):**

```
You are a senior documentary video editor and creative director planning a faceless explainer video.
Read the full transcript and produce the macro plan.

Rules:
- Identify topic, tone, audience, and chapter structure.
- Choose 1–3 recurring visual motifs that connect scenes (do not repeat identical assets).
- Propose a layout budget for the video using only the layouts in the provided catalog.
- Variety is mandatory: no layout should dominate; avoid the same layout back-to-back.
- Never plan statistics that are not in the transcript.
Return JSON only, matching the schema.
```

---

## 4. Pass 2 — Layout Director (micro, per chunk)

**Input per call:** macro plan, **layout catalog (compact form, section 5 below)**, 5–8 chunks with text + word timestamps + features, previously used layouts (last 3), `usedAssetIds`.

**Output per scene (this is the key schema that unlocks "more elements"):**

```json
{
  "sceneId": "s07",
  "startMs": 41200,
  "endMs": 47300,
  "intent": "contrast between hiring drivers and using a delivery network",
  "viewerShouldUnderstand": "outsourcing delivery is cheaper and faster",
  "layoutId": "ComparisonScene",
  "layoutVariant": "A",
  "elements": [
    {
      "id": "e1", "slot": "leftTitle", "type": "text", "emphasis": "primary",
      "content": { "text": "Hire Drivers" },
      "enter": { "anchorWordIndex": 3, "preset": "slideRight" }
    },
    {
      "id": "e2", "slot": "leftVisual", "type": "icon", "emphasis": "hero",
      "content": { "query": "delivery driver", "style": "flat" },
      "enter": { "anchorWordIndex": 3, "preset": "popIn" }
    },
    {
      "id": "e3", "slot": "vsBadge", "type": "badge", "emphasis": "primary",
      "content": { "text": "VS" },
      "enter": { "anchorWordIndex": 7, "preset": "bouncePop" }
    }
  ],
  "emphasisWords": [{ "wordIndex": 12, "treatment": "highlightSweep" }],
  "sfx": [{ "atWordIndex": 7, "cue": "pop" }],
  "captions": { "mode": "show" },
  "transitionIn": "slide",
  "confidence": 0.82
}
```

**Prompt (copy-paste):**

```
You are the Layout Director for a professional faceless explainer video. You decide, for each scene, what the viewer should look at, in what order, and how it enters.

For EACH scene you must:
1. State the intent (what is being said) and what the viewer should understand.
2. Choose ONE layoutId from the catalog based on meaning, not keywords alone.
3. Fill EVERY required slot and as many optional slots as the scene duration justifies. Respect the element budget:
   - <3s: at least 3 elements; 3–6s: at least 5; 6–10s: at least 7.
4. Exactly ONE element has emphasis "hero". 
5. Hero text must be a distilled idea (2–7 words). Never paste the full sentence; captions already show it.
6. Use anchorWordIndex so elements enter when the related word is spoken.
7. Choose 1–2 emphasis words from the sentence.
8. Never choose the same layoutId as the previous scene. Avoid layouts used in the last 3 scenes when an equally good alternative exists.
9. Never reuse an asset query already used (usedAssetIds / usedQueries). If a visual would repeat, pick a different concept or a typography/chart treatment.
10. Never invent numbers. StatScene and ChartScene require numbers present in the text.
11. Prefer vector, typography, UI mockup, and chart treatments over stock photos. Photos only as supporting elements.
12. Keep text blocks to 3 maximum per scene (excluding captions).

Return JSON only, matching the scene schema. No commentary.
```

**Compact catalog to inject (generate automatically from the layout registry):**

```
HookTypographyScene: slots[headline*,emphasisWords*,kicker,accentShape*,ambient,iconBadge] elements 4-7 dur 2-6s use: opening hook, bold claim, question
StatScene: slots[value*,label*,context,iconBadge*,miniViz,ambient] elements 5-8 dur 2.5-6s use: numbers/money/%
ComparisonScene: slots[leftTitle*,rightTitle*,leftVisual*,rightVisual*,leftPoints*,rightPoints*,vsBadge*,divider*,verdict] elements 8-12 dur 5-10s use: contrast/vs/before-after
HorizontalProcessStepsScene: slots[steps*(3-5),connector*,heading,progressBar] ... use: sequence/steps
WorkflowScene: ...
RoadmapScene: ...
CardConceptScene: slots[hero*,title*,cards*(2-4),connectors,ambient] variants A-D ...
ListScene: ...
ChartScene: ... (needs real numbers)
DrawingStoryScene: ...
UIMockupScene: ...
NodeGraphScene: ...
FunnelScene: ...
DefinitionScene: ...
QuoteScene: ...
ChapterTitleScene: ...
OutroScene: ...
(* = required)
```

Build this string programmatically from `layoutRegistry` so the prompt never drifts from code.

---

## 5. How the layout is actually selected (decision logic)

The LLM chooses; the router verifies and can override. Priority order:

1. **Hard constraints (code):**
   - Number present? → `StatScene`/`ChartScene` allowed. No number → disallowed.
   - Screenshot/tool name present? → `UIMockupScene` allowed.
   - Not the same as the previous scene's layout.
   - Max 3 uses per 60 s for the same layout.
2. **Semantic fit (LLM):** meaning, emotion, storytelling purpose.
3. **Feature hints (code):** from section 2 features; if the LLM contradicts a very strong hint (e.g., "step 1, step 2, step 3" but picks `CardConceptScene`), flag for repair.
4. **Variety:** penalize recently used layouts. Implement as a score:

```
score(layout) = semanticFit(0–1) * 0.6
              + featureMatch(0–1) * 0.25
              + varietyBonus(0–1) * 0.15
varietyBonus = 1 - (usesInLast5Scenes / 5)
```

If you only trust the LLM, monotony returns. This score gives you a deterministic safety net.

---

## 6. Rule-based fallback router (when LLM fails or times out)

```ts
function fallbackLayout(chunk, prevLayouts): LayoutId {
  const f = chunk.features;
  if (chunk.isFirst) return 'HookTypographyScene';
  if (chunk.isLast) return 'OutroScene';
  if (f.hasNumber && f.hasCurrencyOrPercent) return avoid('StatScene', prevLayouts);
  if (f.hasContrast) return avoid('ComparisonScene', prevLayouts);
  if (f.hasSequence) return avoid('HorizontalProcessStepsScene', prevLayouts);
  if (f.hasListMarker) return avoid('ListScene', prevLayouts);
  if (f.hasToolName) return avoid('UIMockupScene', prevLayouts);
  if (f.isDefinition) return avoid('DefinitionScene', prevLayouts);
  return rotate(['CardConceptScene','DrawingStoryScene','NodeGraphScene','WorkflowScene'], prevLayouts);
}
```

`avoid(x, prev)` returns `x` unless it equals the previous layout; then returns the next best candidate.

---

## 7. Validators (code, deterministic)

Run after the planner and after asset resolution. Every failure returns a machine-readable reason for the repair loop.

| Validator | Check | On fail |
|---|---|---|
| `schemaValid` | JSON matches zod schema | repair |
| `knownLayout` | `layoutId` in registry | repair → fallback router |
| `requiredSlots` | all required slots present and non-empty | repair |
| `elementBudget` | count ≥ min for duration | repair ("add N more supporting elements") |
| `singleHero` | exactly 1 hero | repair |
| `textBlocks` | ≤ 3 text blocks | repair |
| `heroTextLength` | 2–7 words, not equal to sentence | repair |
| `anchorsValid` | anchorWordIndex exists in the scene's words | auto-fix to nearest |
| `noBackToBack` | layout ≠ previous | repair |
| `assetUnique` | no reused assetId/query | resolve alternative, else switch layout |
| `numbersGrounded` | every number in Stat/Chart appears in the transcript | switch to `CardConceptScene` |
| `timeContinuity` | scenes cover 0→end with no gaps/overlaps | auto-fix boundaries |
| `visualEventGap` | max 2.5 s without a new visual event | add ambient/micro event or beat |
| `safeArea` | all element boxes inside safe area | auto-nudge, else repair |
| `textOverlap` | no overlapping text boxes | auto-reflow |
| `contrast` | text vs background ≥ 4.5:1 | auto-switch palette |
| `fontCoverage` | all glyphs covered by loaded fonts | switch to fallback font |
| `assetReachable` | HTTP 200 for external assets | replace asset or switch layout |
| `captionPlan` | caption mode is explicit | set default `show` |

**Repair loop:** send the failing scene + the validator reason back to the LLM:

```
This scene failed validation.
Scene: {...}
Failures: ["elementBudget: needs >=5 elements, has 3", "singleHero: found 0"]
Fix ONLY these problems. Keep layoutId unless the failure says to change it. Return the corrected scene JSON.
```

Max 2 repair rounds per scene, then use the fallback ladder (section 8).

---

## 8. Asset resolution and the fallback ladder (stops the stickman loop)

For each element needing an asset:

1. **User-uploaded asset** that matches the narration (highest priority).
2. **Library search** (icons, SVG, illustrations, stickers) by query → pick the best unused result; add to `usedAssetIds`.
3. **Procedural generation:** compose from the parts library (shapes, figures, props) — see file 03 section 9. Use a seeded random so the output is reproducible: `seed = hash(videoId + sceneId + elementId)`.
4. **Alternate concept query:** ask the LLM for a different metaphor ("coins" → "piggy bank" → "wallet" → "jar").
5. **Type or chart treatment:** replace the visual with a typographic emphasis, number, or abstract shape cluster.
6. **Last resort:** switch layout to `HookTypographyScene`/`DefinitionScene` using the sentence. **Never reuse a previous asset.** Never show a blank frame.

Rules for numbers: if no numbers exist, `ChartScene`/`StatScene` are forbidden; use `CardConceptScene`/`ListScene`.

---

## 9. Choreography pass

Code resolves each element's final timing:

```ts
function resolveEnterMs(el, scene) {
  if (el.enter.anchorWordIndex != null)
    return scene.words[el.enter.anchorWordIndex].startMs - scene.startMs - 80; // lead 80 ms
  if (el.enter.afterElementId)
    return resolved[el.enter.afterElementId].endMs + (el.enter.delayMs ?? 120);
  return el.enter.atMs ?? 0;
}
```

- Enter slightly *before* the spoken word (80 ms lead) so the visual meets the word.
- Resolve collisions: if two elements share an enter time within the same region, push the lower emphasis one by 120 ms.
- Enforce: hero enters within 200 ms of the anchor.
- Exit: default `exitAtMs = sceneDuration - 300`, reverse order stagger 60 ms.

---

## 10. Caption plan per scene

`captions.mode`: `show` | `suppress` | `minimal`.

- `suppress` only if hero/primary text contains ≥ 75% of the spoken words **and** layout is `HookTypographyScene`, `QuoteScene`, or `DefinitionScene`.
- `minimal` (smaller, bottom band, 70% opacity) for dense layouts (`ComparisonScene`, `HorizontalProcessStepsScene`).
- Otherwise `show`.

---

## 11. SFX planning (so they actually play)

Rules (code first, LLM optional):

| Event | SFX | Notes |
|---|---|---|
| Hero entrance | `pop` or `whoosh-soft` | volume 35% |
| Stat counter lands | `tick-roll` then `ding` | |
| Chapter title | `riser` + `hit` | 1/chapter max |
| Transition slide/zoom | `whoosh` | J-cut 6–9 frames early |
| Checklist item | `click` | |
| Outro CTA | `chime` | |

Constraints: max 1 SFX per 700 ms, SFX total volume ≤ 40% of VO reference, none during a Quranic verse. SFX cue list is **stored in `sound.json` and passed through input props** (see file 04 section 9).

---

## 12. Quality scoring (optional but valuable)

After validators pass, compute a **polish score** per scene (0–100):
- Element richness (budget exceeded) 20
- Hierarchy clarity (hero ≥2× size) 20
- Timing precision (anchors used) 20
- Variety (layout + asset novelty) 15
- Motion coverage (events per 2.5 s) 15
- Contrast and whitespace 10

Scenes under 70 get one automatic regeneration. Log scores to analytics to learn which layouts or prompts underperform.

---

## 13. Logging for debugging

Save per job: `plan.raw.json` (LLM output), `plan.validated.json`, `validation-report.json`, `repair-log.json`. When a user says "my video looks plain", open the report: you will see exactly which validator failed or which fallback fired.

