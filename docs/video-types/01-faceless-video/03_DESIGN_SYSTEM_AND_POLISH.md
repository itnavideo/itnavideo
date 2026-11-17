# Design System & Polish Spec

How to make output look like a professionally edited video instead of an assembled slideshow. Values here are design tokens; code should read them from one `tokens.ts` file.

---

## 1. Typography

### Font roles
- **Font 1 (Display):** headlines, numbers, key words. Heavy weight (700–900), tight tracking (-0.02em).
- **Font 2 (Text):** body, labels, captions. Weight 500–700, tracking 0.

### Type scale (px at 1920×1080)

| Token | Size | Use |
|---|---|---|
| `display-xl` | 320 | StatScene value |
| `display-l` | 180 | Hook headline |
| `display-m` | 120 | Concept title / term |
| `title` | 80 | Card title, chapter title |
| `subtitle` | 56 | Labels, definition body |
| `body` | 44 | Card body, list items |
| `caption-ui` | 32 | Small labels, kickers |
| `kicker` | 28 | Uppercase, letter-spacing 0.14em |

Hierarchy rule: **hero text must be at least 2× the size of the next largest text.** This single rule produces the "Abdaal/Warikoo" look more than any font choice.

### Font recommendations
- Display: Montserrat ExtraBold, Outfit Bold, Poppins Bold, or Bricolage Grotesque. Serif option: Playfair Display / Cinzel for editorial.
- Text: Inter, Plus Jakarta Sans.
- Devanagari: Noto Sans Devanagari, Hind, or Mukta (match weights with Latin).
- Arabic (Quran): Amiri Quran or Noto Naskh Arabic.
- Fallback chain example: `"Outfit", "Noto Sans Devanagari", system-ui, sans-serif`.
- Load fonts with Remotion's `@remotion/google-fonts` or `@font-face` and `delayRender` until loaded, so no frame renders with a fallback font.

### Emphasis technique
Within any headline: one word in accent color or with a marker highlight; optionally one word at 1.15× size. Never highlight more than 2 words.

---

## 2. Color system

Tokens depend on canvas polarity (light/dark). Compute accent from user theme.

### Light canvas
```
bg: #FFFFFF or cream #FBF7F0
text-primary: #111827
text-secondary: #374151
muted: #9CA3AF
card: #FFFFFF with shadow
card-border: rgba(17,24,39,0.06)
accent: #EA580C (flame orange)
accent-2: #FFE600 (marker yellow)
positive: #16A34A
negative: #DC2626
```

### Dark canvas
```
bg: #0B1020 or dark slate #111827
text-primary: #FFFFFF
text-secondary: #E5E7EB
muted: #6B7280
card: rgba(255,255,255,0.06) with 1px rgba(255,255,255,0.10) border
accent: #FFB020 (amber) or #8C52FF (purple)
accent-2: #22D3EE
positive: #34D399
negative: #F87171
```

Rules:
- Max 3 colors visible beyond neutrals per scene (accent, accent-2, one semantic).
- Contrast ratio ≥ 4.5:1 for text; ≥ 3:1 for large display text. Compute and auto-adjust.
- Accent colors must stay consistent across the whole video (derived from one palette), not per scene.

---

## 3. Captions (kinetic karaoke)

### Behavior rules
- Active word highlights at the word's `startMs` (use the spoken-word frame, not the sentence).
- Show **max 8 words** per caption group (2 lines max, each ≤ 4–5 words in 1080p), group by natural phrase.
- Group changes at phrase boundaries or pauses ≥ 250 ms.
- Position: bottom band centered, y ≈ 920 center; font size 52–60 px.
- Entrance of each group: `popIn` with `spring.snappy`, 6–8 frames. Words inside the group do not re-animate except the active highlight.
- Suppression rules in file 02, section 10.

### Presets (define each as JSON tokens; start with 5, add more later)

```json
{
  "marker-tape": {
    "font": "font2", "weight": 800, "size": 56, "case": "none",
    "inactive": { "color": "text-primary" },
    "active": { "color": "#111827", "bg": "#FFE600", "padX": 14, "padY": 4, "radius": 6, "rotate": -1.5 },
    "shadow": "0 4px 14px rgba(0,0,0,0.18)"
  },
  "stacy-pill": {
    "font": "font2", "weight": 700, "size": 54,
    "container": { "bg": "rgba(17,24,39,0.88)", "padX": 28, "padY": 14, "radius": 999 },
    "inactive": { "color": "#FFFFFF" },
    "active": { "color": "#FFB020" }
  },
  "neon-glow": {
    "font": "font1", "weight": 800, "size": 58,
    "inactive": { "color": "#E5E7EB" },
    "active": { "color": "#FFFFFF", "glow": "0 0 24px #8C52FF, 0 0 48px #8C52FF" }
  },
  "minimal-clean": {
    "font": "font2", "weight": 600, "size": 50,
    "inactive": { "color": "text-primary", "opacity": 0.55 },
    "active": { "color": "text-primary", "opacity": 1, "underline": "accent" }
  },
  "bold-box": {
    "font": "font1", "weight": 900, "size": 60, "case": "upper",
    "container": { "bg": "accent", "padX": 24, "padY": 10, "radius": 10 },
    "inactive": { "color": "#FFFFFF" },
    "active": { "color": "#111827", "bg": "#FFFFFF", "radius": 8 }
  }
}
```

The earlier spec mentioned "20 master caption themes". Do not promise this until they exist. Ship 5 well-tested presets; add more after.

Caption must never look like plain HTML text: use padding, radius, shadow or highlight shape; text stroke for photo backgrounds.

---

## 4. Backgrounds and depth

Flat white feels cheap. Add depth **without** breaking background loyalty (the chosen base color remains dominant).

### Background stack
1. **Base plate:** chosen color.
2. **Ambient layer:** two or three large blurred radial gradient blobs (accent at 6–10% opacity on light, 12–18% on dark), moving slowly (sine drift, 20–40 px over 8 s). Different blob positions per scene (seeded).
3. **Texture:** subtle paper grain / noise (2–4% opacity). On dark, a faint grid or dot pattern at 4%.
4. **Vignette:** very light (5–8%) darkening at the edges for light canvas; 15–25% for dark.

### Depth on content
- Cards: radius 20–28 px, shadow stack `0 2px 4px rgba(0,0,0,0.06), 0 12px 32px rgba(0,0,0,0.10)`; optional 1 px inner highlight.
- **Parallax:** background elements move 0.4× the speed of foreground drift; ambient shapes 0.6×.
- **Layer separation by scale:** foreground assets slightly larger and sharper; background elements blurred 2–6 px or 60% opacity.
- Subtle float on cards: ±4–6 px sine with different phases per card.

Rule: background layers are **transparent at the scene root** so the user's chosen background renders throughout (consistent with Background Loyalty).

---

## 5. Motion language

Principles:
1. **Enter fast, settle slow.** Springs with slight overshoot for pops; ease-out for slides.
2. **Stagger siblings** by 120 ms in reading order (left→right, top→bottom, or by narrative order).
3. **One thing moves with intent at a time**; ambient motion is slower and smaller than intent motion.
4. **Consistency:** the same preset names produce the same feel in every layout.
5. **Motion has meaning:** things enter from the direction they relate to (the second item in a comparison enters from the right).

Tokens:
```ts
export const springs = {
  snappy: { damping: 16, mass: 0.8, stiffness: 130 },
  soft:   { damping: 22, mass: 1.0, stiffness: 90 },
  bouncy: { damping: 10, mass: 0.8, stiffness: 150 },
};
export const stagger = 4; // frames (≈120 ms @30fps)
export const drift = { from: 1.0, to: 1.018 };
```

Camera moves (for B-roll/image layers): slow push-in (1.00→1.06 over 5 s), pan 40–80 px, never faster. Apply drift to groups, not to text.

---

## 6. Transition rules

| Narrative context | Transition |
|---|---|
| Stat → stat, fast listicle | Hard cut (0 frames) |
| Same chapter, calm | Crossfade 12 frames |
| Chapter change | Slide 10 frames + whoosh SFX |
| Big reveal / hook after intro | Zoom punch 9 frames |
| Final scene → end | Fade out 30–45 frames |

Rules:
- Never use the same transition more than 3 times in a row.
- Transition type is decided by the Transition logic in code from the layout pair, not random.
- Elements inside the outgoing scene begin their `exit` ~300 ms before the cut so the screen is not abruptly full.

---

## 7. Sound design wiring

- **Tracks:** VO (100%), BGM (ducked), SFX, Ambient.
- **Ducking:** compute from speech segments (word timestamps merged where gap < 600 ms). Volume envelope: 12% in speech, 26% in pauses > 600 ms, attack 150 ms, release 500 ms.
- **Loudness safety:** even if you exclude full audio cleanup, apply (a) a simple limiter at -1 dBFS in the final mix and (b) show a warning if the uploaded VO is very quiet or very loud (measure RMS/LUFS on upload; warn if integrated loudness is outside −26 to −12 LUFS).
- **SFX:** see file 02 section 11. Normalize all SFX library files to −16 LUFS so volume is predictable.
- **Don't** play SFX under Quranic recitation.

---

## 8. Component-level polish checklist

Apply to every text/card/icon:
- [ ] Text has padding, no text touching container edge (min 24 px).
- [ ] Rounded corners consistent (cards 24, pills 999, badges 50%).
- [ ] Shadow present on floating elements, none on flat elements.
- [ ] Icons share one style (stroke weight, fill style) within a video.
- [ ] Letter-spacing set for uppercase text.
- [ ] Line-height 1.05–1.15 for display, 1.3–1.4 for body.
- [ ] Max line length 28 chars for display, 42 for body.
- [ ] Orphan control (no single-word last lines).
- [ ] Number formatting localized ("1,00,000" vs "100,000" based on language settings).
- [ ] Hindi text: line-height +0.1 and ensure matras (diacritics) are not clipped.

---

## 9. Procedural illustration system (kills the stickman loop)

Do not store one stickman. Compose scenes from parts.

### Parts library
- **Characters:** 3 styles (blob-person, geometric-person, outline-person) × 8 poses (stand, point, think, walk, sit-laptop, celebrate, worry, hold-item).
- **Props:** 60+ (phone, laptop, coin, wallet, chart, lightbulb, lock, clock, calendar, megaphone, box, shield, trophy...).
- **Environment:** desk, floor line, window, city skyline strip, cloud, plant.
- **Doodles:** arrows (curved, straight), circles, underlines, sparkles, stars, question marks, exclamation marks.
- **Backdrops:** abstract shapes (blob, circle, rounded rect) in palette colors.

### Composition rules
- A drawing = 1 character OR 0 (prop-only) + 1–3 props + 1 backdrop + 1–2 doodles.
- Seeded selection: `seed = hash(videoId + sceneId)` picks character style, pose, prop, backdrop rotation, mirror flip, and color accent. Same video is stable; different videos differ.
- Maintain `usedAssetIds` per part type: no pose+prop combination repeats; no single part repeats within 3 scenes.
- Style consistency: one character style and one icon style **per video** (consistency), with variety coming from poses, props, composition, and layout.
- Each part is an SVG with named paths so `drawOn` can animate strokes.

---

## 10. Image and stock footage policy

- Photos/video only as **supporting** B-roll or in `UIMockupScene` frames; ≤15% of video time.
- Treatment: rounded corners 24 px, soft shadow, slight tilt (≤3°) or duotone overlay in palette color to unify.
- Never full-bleed unless it is an intentional cinematic moment, and then with 40–55% dark overlay for text legibility.
- Always have a license record per asset (source, license, attribution) in `assets-ledger.json`.

---

## 11. Brand and logo

- Watermark top-right at 60% opacity, 96 px max height, 120 px margin from edges.
- Logo generation via SVG: allowed for simple wordmarks and monograms only; do not imitate real brand logos. For third-party brands, use user-uploaded logos or text labels.
- Brand colors override the palette accent when the user provides them.

---

## 12. Accessibility and QA

- Respect contrast 4.5:1.
- No flashing > 3 times/second.
- Caption text always legible on every background (use stroke/shadow/pill as needed).
- QA frame sampler: render a still every 1 s into a contact sheet for quick human review before release.

