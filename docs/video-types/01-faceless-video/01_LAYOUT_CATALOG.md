# Layout Catalog — Faceless Video Engine

This is the most important file. A **layout** is not a picture; it is a *composition recipe*: which slots exist, how many elements fill them, where they sit on the canvas, in what order and when they appear, and how they leave.

Values referenced here (`spring.snappy`, safe area, stagger) are defined in `00_INDEX_AND_DECISIONS.md`.

---

## 1. Canvas grid

- Canvas 1920×1080. Safe content box: **x 120→1800, y 80→1000** (1680×920).
- 12-column grid inside the content box: column width 118 px, gutter 24 px.
- Caption band (reserved): **y 860→1000**. Layouts must keep hero content above y = 840 unless captions are suppressed for that scene.
- Usable hero area when captions are visible: **x 120→1800, y 80→840** (1680×760).

Named regions used by layouts:

| Region | Rectangle (x, y, w, h) |
|---|---|
| `full` | 120, 80, 1680, 760 |
| `left-half` | 120, 80, 816, 760 |
| `right-half` | 984, 80, 816, 760 |
| `left-third` | 120, 80, 528, 760 |
| `center-third` | 696, 80, 528, 760 |
| `right-third` | 1272, 80, 528, 760 |
| `top-band` | 120, 80, 1680, 200 |
| `middle-band` | 120, 300, 1680, 380 |
| `bottom-band` | 120, 700, 1680, 140 |

---

## 2. Element budget and density rules (apply to every layout)

Every scene must carry enough visual information to *explain* the sentence, not just decorate it.

| Scene duration | Min elements | Min visual beats | Notes |
|---|---|---|---|
| < 3 s | 3 | 1 | e.g. hero + label + 1 supporting icon |
| 3–6 s | 5 | 2 | hero + 2–3 supporting + 1 ambient/accent |
| 6–10 s | 7 | 3 | split into beats; reveals staggered over time |
| > 10 s | Split the scene | — | Do not allow scenes longer than 10 s; split at a sentence boundary |

Definitions:
- **Element** = any drawn thing: text block, number, icon, svg, image, chart, arrow, shape, card, badge. Background plates and captions do not count.
- **Visual beat** = a moment when something new appears, changes, moves meaningfully, or is highlighted.
- **Emphasis levels:** `hero` (exactly 1 per scene), `primary` (1–3), `secondary` (0–4), `ambient` (0–3, decorative, low contrast).

Hard rules:
1. Exactly one `hero` per scene. The viewer must know where to look first.
2. Max **3 text blocks** per scene (excluding captions). More than that becomes a slide.
3. Max **2 competing motions** at the same instant.
4. Text that duplicates the spoken sentence word-for-word is forbidden as a hero (captions already do this). Hero text is a **distilled idea (2–7 words)**, not the sentence.
5. Always include at least one non-text element (icon, shape, chart, svg, number) unless the layout is `HookTypographyScene` or `QuoteScene`.

---

## 3. Choreography model (what makes it feel directed)

Every element has an **entrance trigger** and a **timeline relative to scene start (ms)**.

### Entrance triggers
- `atMs`: fixed time from scene start.
- `anchorWordIndex`: appears when that word (index in the scene's word list) starts being spoken. **Preferred.** Use for any element tied to a specific word ("save money" → coin icon enters on "save").
- `afterElementId` + `delayMs`: staggered after another element.

### Standard reading order
1. **Frame set (0–150 ms):** background accents, ambient shapes settle in.
2. **Hero (150–400 ms or at anchor word):** the main visual or number enters with `spring.snappy`.
3. **Primary support (stagger 120 ms each).**
4. **Secondary support** after primary completes.
5. **Emphasis moment** on the key spoken word: highlight sweep, scale pulse (1.0→1.06→1.0), or color flip.
6. **Hold with micro-motion** (ambient drift 1.018, subtle float ±6 px over 3 s).
7. **Exit (last 300 ms):** elements leave in *reverse* order, or the whole group fades/slides 40 px while the next scene's elements are about to enter (use transition handle frames).

### Animation presets (names used in JSON)

| Preset | Description | Default timing |
|---|---|---|
| `popIn` | scale 0.85→1 + opacity, `spring.snappy` | ~400 ms |
| `bouncePop` | scale 0.6→1 with overshoot, `spring.bouncy` | ~500 ms |
| `slideUp` | translateY +40→0 + opacity | ~450 ms |
| `slideLeft` / `slideRight` | translateX ±60→0 + opacity | ~450 ms |
| `maskReveal` | clip-path reveal left→right | ~500 ms |
| `drawOn` | SVG stroke-dashoffset draw | 600–1200 ms |
| `countUp` | number counts from 0 to value with ease-out | 900–1400 ms |
| `typeWords` | words appear one by one tied to timestamps | per word timing |
| `highlightSweep` | marker sweep behind a word | ~350 ms |
| `scalePulse` | 1.0→1.06→1.0 | ~300 ms |
| `float` | continuous translateY ±6 px sine | 3000 ms loop |
| `ambientDrift` | scale 1→1.018 over scene | scene duration |
| `exitFade` / `exitSlide` | reverse of entrance, faster | ~300 ms |

---

## 4. Layout selection signals (quick reference)

| Narration signal | Layout |
|---|---|
| Opening hook, bold claim, question | `HookTypographyScene` |
| Numbers, %, money, counts | `StatScene` |
| "vs", "instead of", "before/after", "old way/new way" | `ComparisonScene` |
| "step 1/2/3", "first/then/finally", process | `HorizontalProcessStepsScene` |
| System/flow between parts ("orders go through X to Y") | `WorkflowScene` |
| Time-ordered milestones, years, phases | `RoadmapScene` |
| A concept with 2–4 attributes/benefits | `CardConceptScene` |
| "3 habits", "5 mistakes", enumerations | `ListScene` |
| Trend, growth, decline, with real numbers | `ChartScene` |
| Story/metaphor that benefits from a drawing | `DrawingStoryScene` |
| Mentions of an app, website, tool | `UIMockupScene` |
| Network, audience, connections, ecosystem | `NodeGraphScene` |
| Conversion, stages narrowing | `FunnelScene` |
| Defining a term | `DefinitionScene` |
| Direct quote, principle | `QuoteScene` |
| Chapter change | `ChapterTitleScene` |
| Closing, CTA | `OutroScene` |

---

## 5. Layouts

Each layout lists: purpose, triggers, slots, element budget, geometry, choreography, duration, captions, anti-patterns, fallback, and a JSON example where useful.

---

### L01. `HookTypographyScene`

**Purpose:** Opening hook or high-impact statement. Typography is the visual.

**Triggers:** First 5–10 s of video; rhetorical question; shocking statement; "Most people…", "What if…".

**Slots**
| Slot | Required | Content |
|---|---|---|
| `headline` | yes (hero) | 3–9 words, Font 1, split across 1–3 lines |
| `emphasisWords` | yes | 1–2 words inside headline that get accent color/highlight |
| `kicker` | optional | Small label above (e.g. "THE TRUTH ABOUT MONEY") |
| `accentShape` | yes | Underline stroke, circle, or marker bar |
| `ambient` | optional | 2–3 floating shapes/particles |
| `iconBadge` | optional | One contextual icon top-right of headline |

**Element budget:** 4–7.

**Geometry:** Headline centered in `middle-band`, left-aligned at x=120 for editorial feel OR centered for punchy hooks. Font size 120–180 px, line-height 1.05. Kicker 28 px, letter-spacing 0.14em.

**Choreography**
- 0 ms: kicker `slideUp`.
- 150 ms: headline words enter with `typeWords` (each word on its spoken timestamp) using `popIn`.
- On emphasis word: `highlightSweep` + `scalePulse`.
- +200 ms after emphasis: `drawOn` underline/circle.
- Ambient: `float` loop.
- Exit: `exitSlide` up 40 px.

**Duration:** 2–6 s. **Captions:** suppress if headline already contains ≥75% of spoken words; otherwise show.

**Anti-patterns:** headline longer than 9 words; whole sentence pasted; all words same size/color.

**Fallback:** none needed (this is the safest layout).

---

### L02. `ChapterTitleScene`

**Purpose:** Section divider.

**Slots:** `number` (e.g. "02", hero, Font 1 at 320 px, 15% opacity ghost number behind) , `title` (primary, 80–110 px), `subtitle` (optional), `lineAccent` (primary, horizontal line drawing across).

**Element budget:** 4–5. **Duration:** 1.5–3 s.

**Choreography:** ghost number `maskReveal` (0 ms) → title `slideUp` (150 ms) → line `drawOn` (350 ms) → subtitle `popIn` (550 ms). Exit with crossfade.

**Captions:** show. **Use sparingly:** max once per 45 s.

---

### L03. `StatScene`

**Purpose:** Make a number feel important.

**Triggers:** digits, currency, percentages, "thousand/million", "double", "half".

**Slots**
| Slot | Required | Content |
|---|---|---|
| `value` | yes (hero) | The number, Font 1, 220–320 px; supports prefix/suffix ("₹", "$", "%", "K", "x") |
| `label` | yes (primary) | 3–8 words describing the number, Font 2, 44–56 px |
| `context` | optional (secondary) | 1 supporting line: comparison, source, timeframe |
| `iconBadge` | yes (secondary) | Icon related to the metric in a circular plate |
| `miniViz` | recommended (secondary) | Sparkline, progress ring, or bar fragment (only if numbers justify; otherwise a decorative ring) |
| `ambient` | optional | Soft glow circle behind value |

**Element budget:** 5–8.

**Geometry (default "center stack"):** value centered at (960, 400); label below at y≈590; context at y≈670; iconBadge top-left of value at (≈560, 250) 140 px circle; miniViz at right, `right-third`. Alternate "split": value in `left-half`, miniViz + context in `right-half`.

**Choreography**
- 0 ms: ambient glow `popIn`.
- 150 ms or at anchor word of number: iconBadge `bouncePop`.
- Same time: value `countUp` (1100 ms) with `scalePulse` at end.
- +400 ms: label `slideUp`.
- +520 ms: miniViz `drawOn`.
- +700 ms: context `popIn`.
- Emphasis: when the number is spoken, `highlightSweep` behind the value.

**Duration:** 2.5–6 s.

**Invalid data rule:** value must exist in the narration. If not, do not use `StatScene` (fall back to `CardConceptScene`).

**Anti-patterns:** number rendered small; no unit; counter starts after the number is spoken (should land on the spoken moment).

---

### L04. `ComparisonScene`

**Purpose:** Contrast two things.

**Triggers:** "vs", "instead of", "compared to", "old way / new way", "before / after", "without / with".

**Slots**
| Slot | Required | Content |
|---|---|---|
| `leftTitle` / `rightTitle` | yes (primary) | 1–3 words each |
| `leftVisual` / `rightVisual` | yes (hero pair; treat as one hero group) | Icon/illustration/mini-chart |
| `leftPoints` / `rightPoints` | yes (secondary) | 2–3 short points each (≤5 words) |
| `vsBadge` | yes (primary) | Circle with "VS" or arrow in the center |
| `verdict` | optional | A highlight on the winning side (check badge, glow) |
| `divider` | yes (ambient) | Vertical line or diagonal split |

**Element budget:** 8–12.

**Geometry:** two halves (`left-half`, `right-half`). Left uses a "negative" palette tint (muted/red-leaning accent), right uses positive (accent/green-leaning), unless the context is neutral. VS badge at (960, 440), 120 px circle. Visuals 360 px. Titles at y=140. Points at y=620+, 56 px line spacing.

**Choreography**
- 0 ms: divider `drawOn` top→bottom.
- 150 ms: leftTitle `slideRight`; leftVisual `popIn`.
- When narration moves to the second item (anchor word): vsBadge `bouncePop`, then rightTitle `slideLeft`, rightVisual `popIn`.
- Points stagger 120 ms per side.
- At verdict word: winning side `scalePulse` + glow; losing side opacity to 60%.

**Duration:** 5–10 s. **Captions:** show.

**Fallback:** if only one side is described, use `CardConceptScene`.

---

### L05. `HorizontalProcessStepsScene`

**Purpose:** Ordered steps (3–5).

**Slots:** `steps[]` (3–5, each: number badge, icon, title ≤3 words, optional 1-line caption), `connector` (arrows/line between steps), `progressBar` (optional), `heading` (optional small title).

**Element budget:** 3 steps → 10 elements; 5 steps → 16 elements (each step = badge + icon + title + connector).

**Geometry:** steps evenly distributed across `middle-band`; each step column width = 1680 / n. Number badge 72 px, icon 140 px, title 44 px. Connectors drawn between icon centers.

**Choreography:** each step enters at its anchor word ("first", "then", "finally") — badge `bouncePop`, icon `popIn`, title `slideUp`, connector `drawOn` to the next position. Previous steps dim to 70% as the next becomes active (focus shift). Final step `scalePulse`.

**Duration:** 6–10 s (≈2 s per step). If more than 5 steps, split into two scenes.

---

### L06. `WorkflowScene`

**Purpose:** Show how parts of a system connect.

**Slots:** `nodes[]` (3–5, each: icon plate + label), `edges[]` (arrows with optional labels), `inputBadge` (optional), `outputBadge` (optional), `pulse` (animated dot travelling along edges).

**Element budget:** 8–14.

**Geometry:** left→right flow in `middle-band`; nodes as 200×200 rounded plates; edges as curved arrows. Optionally a branching layout (one node splitting into two) if narration says "or/either".

**Choreography:** nodes enter in order at their anchor words; edge `drawOn` after each node; a pulse dot travels the complete path once all nodes are visible; the "result" node `scalePulse` at the end.

**Duration:** 5–10 s.

---

### L07. `RoadmapScene`

**Purpose:** Milestones over time.

**Slots:** `milestones[]` (3–6; each: date/label, title ≤4 words, dot, optional icon), `timelineLine`, `progressMarker` (travelling indicator), `heading` (optional).

**Geometry:** horizontal line at y≈480; milestones alternate above/below the line to avoid collisions; dot 28 px; card width 360 px.

**Choreography:** line `drawOn` (800 ms) → progressMarker moves along the line, each milestone enters as the marker passes its anchor word.

**Duration:** 6–10 s. Vertical variant for ≥6 milestones (list down the left, preview on the right).

---

### L08. `CardConceptScene`

**Purpose:** Explain a concept or benefits with a central idea and 2–4 supporting cards. The most flexible layout.

**Slots**
| Slot | Required | Content |
|---|---|---|
| `hero` | yes | Central icon/illustration (260–360 px) OR concept title in a large plate |
| `title` | yes | Concept name, Font 1, 72–96 px |
| `cards[]` | yes (2–4) | Each: icon (72 px), headline ≤3 words, body ≤10 words |
| `connectors` | optional | Thin lines from hero to cards |
| `ambient` | optional | Floating particles |

**Element budget:** 7–14.

**Geometry variants (planner picks one, varying across a video):**
- **A: Hub and spokes** — hero center, cards around (left/right/top/bottom).
- **B: Hero left, cards stacked right** — hero in `left-third`, cards in the right 2/3 as vertical stack.
- **C: Title top, cards in a row** — title in `top-band`, 2–4 equal cards in `middle-band`.
- **D: Asymmetric bento grid** — one large card (2×2), two small cards (1×1) for visual hierarchy.

**Choreography:** hero `popIn` → title `slideUp` → cards stagger at anchor words with `slideUp` (or from direction of the hero for hub layout) → connectors `drawOn` → at emphasis word: `scalePulse` on the relevant card.

**Duration:** 4–9 s.

**Notes:** cards must use shadow + 20 px radius + subtle gradient/outline. Not heavy bordered boxes (avoid "SaaS clutter").

---

### L09. `ListScene`

**Purpose:** Enumerations.

**Slots:** `title` (optional small), `items[]` (3–6; each: icon or check/number, text ≤6 words), `highlightBar` (moving focus), `sideVisual` (optional, one illustration on the right to balance).

**Geometry:** items in `left-half` (or `full` when no sideVisual), 100 px row height; sideVisual in `right-half`.

**Choreography:** each item enters at its anchor word; the current item gets full contrast + `highlightSweep`, previous items fade to 55%. After the last item, all items return to 100% briefly (`scalePulse` on the group).

**Duration:** 5–10 s. More than 6 items: split.

---

### L10. `ChartScene`

**Purpose:** Data visualization — **only when real numbers appear in the narration or user data.**

**Slots:** `chart` (hero: bar / line / donut / progress), `title`, `annotations[]` (callout pins pointing at specific data points), `legend` (optional), `takeaway` (primary: one-line conclusion).

**Hard rule:** never invent data. If the narration doesn't contain numbers, do not use. See file 02, section 8.

**Choreography:** axes `drawOn` → bars/line grow with `spring.soft` staggered 80 ms → annotation pins `bouncePop` at anchor words → takeaway `slideUp`.

**Duration:** 5–9 s.

---

### L11. `DrawingStoryScene`

**Purpose:** Metaphors and stories where a hand-drawn/illustrated visual explains better than text (e.g. "money leaking out of your pocket").

**Slots:** `drawing` (hero: procedural SVG composed of 2–5 sub-shapes with draw-on paths), `props[]` (2–4 secondary icons that animate in), `caption` (1 short line, optional), `doodles` (ambient: arrows, circles, underlines).

**Important:** every drawing must be **unique** and **composed from a parts library** (see file 03 section 9) — not one reused stickman. Combine parts: figure style × pose × prop × background doodle.

**Choreography:** `drawOn` lines sequentially (900–1400 ms) → props `bouncePop` at anchor words → doodle circle `drawOn` on emphasis word.

**Duration:** 4–8 s.

---

### L12. `UIMockupScene`

**Purpose:** When narration references an app/site/tool.

**Slots:** `device` (hero: browser or phone frame containing screenshot or generated mock UI), `callouts[]` (1–3: arrow + label pointing to part of the UI), `logoBadge` (optional), `headline` (optional 3–5 words).

**Geometry:** device centered or offset left (`left-half` for browser, 520 px wide for phone) with 6–8° tilt in 3D and soft shadow; callouts placed around.

**Choreography:** device `slideUp` + slight rotation settle (`spring.soft`) → highlight region `maskReveal` → callouts `popIn` at anchor words → slow zoom on highlighted region (1.0→1.12 on the screenshot content layer).

**Duration:** 4–8 s. If no screenshot is available, generate a stylized mock UI (header, cards, buttons) rather than using a random photo.

---

### L13. `NodeGraphScene`

**Purpose:** Audience growth, networks, ecosystems.

**Slots:** `centerNode` (hero), `nodes[]` (6–18 small circles/avatars as abstract icons), `edges` (lines), `counter` (optional, primary: number "10,000" counting), `glow`.

**Choreography:** center `popIn` → nodes spawn outward in waves (stagger 60 ms) with `spring.soft` → edges `drawOn` → counter `countUp` synced to the spoken number.

**Duration:** 4–8 s.

---

### L14. `FunnelScene`

**Purpose:** Conversion or narrowing stages.

**Slots:** `stages[]` (3–5; label + optional number), `funnelShape` (hero), `flowParticles` (ambient, dots moving down), `outcomeBadge` (end result).

**Choreography:** funnel segments grow top→bottom per anchor word; particles flow; at the last stage `scalePulse` + outcome badge `bouncePop`.

**Duration:** 5–9 s.

---

### L15. `DefinitionScene`

**Purpose:** Define a term.

**Slots:** `term` (hero, Font 1, 140 px, with highlight marker), `phonetic/label` (optional), `definition` (primary, ≤18 words, Font 2, 52 px), `exampleChip` (optional: "e.g. …"), `iconBadge`.

**Choreography:** term `typeWords`/`popIn` → highlight sweep → definition `maskReveal` → exampleChip `slideUp`.

**Duration:** 3–7 s.

---

### L16. `QuoteScene`

**Purpose:** A principle or quote.

**Slots:** `quoteText` (hero, 2 lines, Font 1 italic or serif), `quoteMarks` (ambient oversized glyph), `attribution` (optional), `accentLine`.

**Choreography:** quote marks `popIn` at 12% opacity → text `typeWords` → emphasis word `highlightSweep` → attribution `slideUp`.

**Duration:** 3–7 s. Never attribute quotes to real people unless the user supplied the attribution.

---

### L17. `OutroScene`

**Purpose:** Closing and CTA.

**Slots:** `closingLine` (hero), `ctaChip` (e.g. "Subscribe"), `logo`, `socialBadges` (optional), `ambient` confetti/particles (subtle).

**Choreography:** closing line `popIn` → ctaChip `bouncePop` with a pulse loop → logo `popIn` → final 1–2 s slow fade to base background (fade-out buffer).

**Duration:** 3–6 s.

---

## 6. Combining layouts inside one scene ("sub-compositions")

Complex sentences may need more than one idea. Allow **beats** inside a scene:

```json
"beats": [
  { "startMs": 0,    "endMs": 2400, "layoutVariant": "A", "elements": ["..."] },
  { "startMs": 2400, "endMs": 5200, "layoutVariant": "B", "elements": ["..."] }
]
```

Rules:
- A scene has a single `layoutId` but may have 2–3 beats.
- Elements persist across beats unless explicitly removed (e.g., hero stays, support elements swap).
- A beat change must still trigger a visible event (swap, slide, highlight shift).

---

## 7. Layout pacing across a video

Target distribution for a 3-minute video (18–28 scenes):
- 1 hook (L01) at the start, 1 outro (L17) at the end.
- 20–30% concept/card layouts (L08, L09).
- 15–25% data/process layouts (L03, L05, L06, L07, L10, L14).
- 10–20% story/UI layouts (L11, L12, L13).
- 0–2 chapter titles, 0–2 quotes.
- No more than 2 consecutive "text-dominant" layouts (L01, L15, L16, L09).
- Alternate **visual density**: high → medium → high; don't make every scene maximal.

---

## 8. Layout acceptance checklist (per layout implementation)

- [ ] Renders correctly with minimum content AND maximum content (fixture tests).
- [ ] Works for both light and dark canvas.
- [ ] Works with Latin and Devanagari text.
- [ ] All elements inside the safe area; nothing overlaps captions.
- [ ] Each element has an entrance trigger and exit.
- [ ] Hero is visually dominant (≥ 2× area or size of any other element).
- [ ] Text contrast ≥ 4.5:1.
- [ ] Does not break if 1–2 slots are missing (graceful degradation, never blank).
- [ ] Looks different from the other layouts at a glance (silhouette test: blur the screenshot; layouts should still be distinguishable).

