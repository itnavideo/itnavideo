# Reference Note

This is a detailed Video Type spec. Start with `docs/ITNAVIDEO_MASTER_DOC.md` for the latest source of truth, then use this file for Compare Explainer implementation details.

# Compare Explainer

## Basic Information

| Field | Value |
|-------|-------|
| Video Type Name | Compare Explainer |
| Internal ID | `comparisonImages` |
| Composition ID | `comparisonImages` |
| Dashboard Mode | `compare` |
| Category | Education |

## Purpose

Compare two things side by side with a sticker presenter character explaining the differences via voiceover. Think "iPhone 15 vs Samsung S24" or "React vs Vue" — visual comparison with personality.

## Who Uses It

- Tech reviewers comparing products
- Educators comparing concepts
- Students making comparison study reels
- Anyone explaining pros/cons of two options

## Viewer Expectation

The viewer sees a clean split comparison with images, a sticker character reacting and pointing, and captions from the voiceover. It should feel like a fun, digestible explainer — not a boring slide.

## What Problem It Solves

Making comparison videos requires editing software, finding layouts, adding animations. This gives a ready-made comparison format with a presenter character that keeps it engaging.

## Why User Should Pay

- Professional split comparison layout instantly
- Animated sticker presenter adds personality without face-on-camera
- Captions auto-synced to voiceover
- 16 character options with 6 core poses each, plus extra poses on supported character sets — variety across videos
- No editing or design skill needed

---

## Required User Inputs

| Input | Type | Required | Notes |
|-------|------|----------|-------|
| Audio Voiceover | Audio/Video file | Yes | Must contain speech explaining the comparison |
| Left Image | Image (PNG/JPG/WebP) | Yes | First comparison item (e.g., iPhone) |
| Right Image | Image (PNG/JPG/WebP) | Yes | Second comparison item (e.g., Samsung) |

## Optional User Inputs

| Input | Type | Notes |
|-------|------|-------|
| Left Title | Text | Label for left item (e.g., "iPhone 15") |
| Right Title | Text | Label for right item (e.g., "Galaxy S24") |
| Theme | Selection | Visual theme: `light` (default), `dark`, `bold`. Controls background, caption glass, and handle color. |
| Comparison tone | Selection | `versus` (neutral blue vs purple, default) or `goodBad` (green = recommended, red = avoid). Drives both sides' accent colors. |
| Winner | Selection | `none` (default), `left`, or `right`. Adds a 👑 crown on the winning title pill and a winner announcement on the closing card. |
| Image Frame Style | Selection | `rounded` (default), `circle`, `phone`, `tilted`, `polaroid`. Controls how the comparison images are displayed. |
| Sticker Character | Selection | Choose from 16 character sets, grouped into Teachers / 3D Characters / Professionals / Faith |
| Subtitle Language | Not shown | No language dropdown. Captions follow the uploaded voiceover language as produced by the supported Groq transcription pipeline |

### Image Frame Styles

| Style | Description |
|-------|-------------|
| `rounded` | Thick rounded corners (24px radius), colored border, soft shadow. Default. |
| `circle` | Images cropped into circles (380×380). No corner badge. |
| `phone` | Phone mockup frame — thick dark bezel, top notch, deep shadow. |
| `tilted` | 3D perspective tilt (left tilts right, right tilts left). Depth effect. |
| `polaroid` | White polaroid frame with label at bottom ("Option A" / "Option B"). |

## Inputs NOT Collected

- No background image
- No custom fonts
- No CTA text
- No thumbnail
- No separate reel topic/title field

---

## Output Details

| Property | Value |
|----------|-------|
| Default size | 1080×1920 (9:16) |
| Supported aspect | 9:16 only (currently) |
| Max duration | 90 seconds |
| Min duration | 8 seconds |
| Duration source | Matches uploaded audio/video length |
| Export format | MP4 (H.264 + AAC) |
| Audio handling | User's uploaded voiceover plays at full volume |
| Background music | OFF by default |
| Premium style layer | Automatic `styleLock` and subtle `soundCues` for cohesive visual/sound design |

---

## Layout Rules

The Video Type renders a comparison layout with sticker presenter:

```
┌─────────────────────────────┐
│  ┌───────────┬───────────┐  │
│  │  LEFT     │  RIGHT    │  │  ← title bars (A vs B)
│  │  TITLE    │  TITLE    │  │
│  ├───────────┼───────────┤  │
│  │           │           │  │
│  │  LEFT     │  RIGHT    │  │  ← comparison images
│  │  IMAGE    │  IMAGE    │  │
│  │           │           │  │
│  └───────────┴───────────┘  │
├─────────────────────────────┤
│                             │
│    ┌───────────────────┐    │
│    │  CAPTION TEXT      │    │  ← caption box (middle area)
│    └───────────────────┘    │
│                             │
├─────────────────────────────┤
│                             │
│       🧑 STICKER           │  ← sticker presenter (bottom)
│       CHARACTER             │
│                             │
└─────────────────────────────┘
```

### Spacing and Safe Zones
- Title bars are fixed at `top: 112px`, `height: 88px`; each label is constrained to 40 characters, adaptive `28–44px` type, and a clipped two-line area so it never pushes into images.
- Comparison images occupy equal contained `488×430px` panels beginning at `top: 225px`; portrait and landscape inputs keep their aspect ratio.
- Caption box is a fixed `top: 720px`, `height: 126px` band. Captions are capped to two concise lines (up to 12 words / 78 characters) and are never allowed to grow into the presenter zone.
- Sticker presenter has one anchored lower-safe zone from `top: 870px` to `bottom: 34px`. Pose art supplies left/right direction; the container does not move.
- Sticker transform inputs are bounded in the renderer: scale `0.72–1.15`, horizontal offset `-110–110px`, vertical offset `-36–46px`.

### Sticker Character System
- 16 character sets available
- 6 core poses per character: `sticker_welcome_intro_explainer`, `sticker_pointing_left_side_explainer`, `sticker_pointing_right_side_explainer`, `sticker_thinking_analysis_explainer`, `sticker_warning_issue_explainer`, `sticker_success_conclusion_explainer`
- Extra poses when available: `sticker_questioning_surprised_explainer`, `sticker_general_explaining_key_point`, `sticker_happy_celebrating_outro`, `sticker_comparing_both_sides_explainer`
- `sticker_welcome_intro_explainer` means the presenter opens the comparison
- `sticker_pointing_left_side_explainer` means the sticker is using hand/stick to explain the left-side item
- `sticker_pointing_right_side_explainer` means the sticker is using hand/stick to explain the right-side item
- `sticker_comparing_both_sides_explainer` means the sticker is weighing both sides together
- `sticker_questioning_surprised_explainer` means the sticker reacts to a question, surprise, or confusion
- `sticker_general_explaining_key_point` means the sticker explains an important rule, feature, reason, or takeaway
- Legacy aliases (`welcome`, `left`, `right`, `thinking`, `warning`, `success`, `surprised`, `explaining`, `celebrating`, `comparing`, `sticker_left`, `sticker_right`) are accepted only for older render data
- Intent-based switching throughout the video based on content
- Pose changes are grouped by sentence/scene intent, not by every caption chunk or keyword hit
- Minimum pose hold is 4-6 seconds where possible, or until the current sentence/comparison beat ends
- Sticker MUST change poses during the video — never stays static
- Adjacent beats should keep the same pose when the same narration intent genuinely continues

### Caption Handling
- Captions generated from Groq transcript
- No subtitle language dropdown. If the user uploads English voiceover, captions should be English; if the user uploads Hindi/Urdu/Hinglish voiceover, captions should follow the supported Roman Hindi/Urdu/Hinglish output.
- Do not promise translation/conversion to another language from this Video Type.
- Displayed in a box/pill in the middle area
- Word-grouped timing (not single words)

---

## Color and Typography Rules

| Element | Style |
|---------|-------|
| Background | Solid or subtle gradient (clean, not distracting) |
| Title bars | Semi-transparent dark or themed background |
| Title text | White, bold, readable |
| Caption text | White on dark pill/box |
| Image borders | Subtle border or shadow for separation |
| Sticker | Full color character PNG |

### What Colors to Avoid
- No neon or overly bright backgrounds
- No clashing colors between title bars
- No gradient text
- Background should not compete with comparison images

---

## Motion Rules

| Element | Animation |
|---------|-----------|
| Title bars | Slide in from top |
| Comparison images | Scale in or fade in |
| Caption text | Fade/slide per caption group |
| Sticker character | Pose changes only at sentence/scene intent boundaries with a 4-6s stable hold |
| Sticker pointing | `sticker_pointing_left_side_explainer` when discussing the left item, `sticker_pointing_right_side_explainer` for the right item |
| Sticker reaction | Question/surprise/explanation/comparison/conclusion poses should appear when the narration context calls for them |

### Premium Style Lock

Compare Explainer now receives a shared `styleLock` from the render route. Finance comparisons such as RBI/SBI/credit card content can lock into a corporate finance palette, motion pace, sticker direction, and low-volume SFX pack so both sides of the comparison feel like one designed world instead of random scene styles.

The renderer applies the premium visual treatment layer for LUT-like color consistency, light grain, vignette, and depth. For finance comparisons, micro-interactions should feel precise: soft clicks for UI emphasis, cash/count cues for money beats, and success chimes for conclusion or approval moments.

### What Should NOT Animate
- Images should not continuously bounce or float
- No spinning or rotating elements
- No particle effects
- No screen shake
- Sticker should not move position — only change pose

---

## Asset Rules

- Sticker PNGs loaded from `public/assets/stickman/` via `staticFile()`
- No stock images — only user-provided comparison images
- No background music added by default
- Subtle automatic diegetic SFX are allowed through `soundCues` only; no loud or unrelated sound effects
- Character assets are code-referenced, not stored in template folder

---

## Timeline / Scene Structure

- Audio source = user's uploaded voiceover
- Duration = voiceover length (capped at 60s)
- Captions = from Groq transcription, following the uploaded voiceover language through the supported pipeline
- No user-facing subtitle language selector
- Sticker pose changes driven by stabilized overlay timeline / intent detection, with captions allowed to update independently
- Preview plan contains the canonical captions, stabilized `overlayTimeline`, sticker beats, comparison assets, and user edits before the final render.
- On confirmation, the dashboard sends only preview-approved editable data (`previewCaptions`, `previewOverlayTimeline`, `previewStickers`, style/transform choices) with the original upload keys. The jobs route validates timing/text, keeps those approved captions and poses, and never trusts client media URLs.
- Without preview-approved data, the deterministic local planner derives canonical intent poses from the current upload transcript. It merges genuine continuing narration into 4–6 second holds; it never forces left/right alternation merely for variety.
- The same deterministic `styleLock` and timed `soundCues` are supplied to preview and final render. Background music remains off; source voiceover stays primary.
- Credits are deducted only after the user confirms preview and starts final render.
- Intent mapping: `sticker_welcome_intro_explainer` (intro), `sticker_pointing_left_side_explainer` (discussing item A / leftTitle / option A / first item), `sticker_pointing_right_side_explainer` (discussing item B / rightTitle / option B / second item), `sticker_comparing_both_sides_explainer` (both sides / vs / tradeoff), `sticker_questioning_surprised_explainer` (question / confusion / surprise), `sticker_general_explaining_key_point` (feature / reason / rule / benefit), `sticker_thinking_analysis_explainer` (neutral analysis), `sticker_warning_issue_explainer` (cons/issues), `sticker_success_conclusion_explainer` or `sticker_happy_celebrating_outro` (conclusion/recommendation/outro)

### Planner Pose Instructions

- Planner-facing pose names must be descriptive canonical IDs, not vague `left` / `right`.
- Use `sticker_welcome_intro_explainer` for the opening hook only.
- For a left-side comparison beat, output `sticker_pointing_left_side_explainer`.
- For a right-side comparison beat, output `sticker_pointing_right_side_explainer`.
- If both sides are discussed in the same beat, output `sticker_comparing_both_sides_explainer`.
- For question/confusion/surprise beats, output `sticker_questioning_surprised_explainer`.
- For important explanation beats, output `sticker_general_explaining_key_point`.
- For warning/risk/mistake beats, output `sticker_warning_issue_explainer`.
- For conclusion/winner/outro beats, output `sticker_success_conclusion_explainer` or `sticker_happy_celebrating_outro`.
- Keep the same pose on adjacent beats when the same intent genuinely continues; do not force pose changes just to avoid repetition.
- The renderer still accepts old short names as legacy aliases so old jobs do not break.

## Fallback Rules

| Scenario | Behavior |
|----------|----------|
| Missing left image | Placeholder with item label text |
| Missing right image | Placeholder with item label text |
| No left/right titles | Hide title bars or show "Item A" / "Item B" |
| No sticker selected | Use default character set |
| Transcription fails | Show error — don't render without captions |
| Audio too short (<8s) | Clamp to minimum 8s |
| Audio too long (>90s) | Trim to 90s |
| Hindi/Hinglish audio | Roman Hinglish captions |
| No speech detected | Show error — voiceover is required |

---

## QA Checklist

- [ ] Both comparison images render at equal size, side by side
- [ ] Title bars display correctly for both items
- [ ] Sticker character changes poses throughout the video (not static)
- [ ] Sticker points left when discussing left item
- [ ] Sticker points right when discussing right item
- [ ] Captions are synced to voiceover timing
- [ ] Audio plays at correct volume
- [ ] Images don't stretch or distort (maintain aspect ratio)
- [ ] Caption box doesn't overlap sticker or images
- [ ] All 16 sticker characters render correctly when selected
- [ ] Preview editor can change caption text/timing and sticker character, pose, scale, and position before confirmation
- [ ] Preview-confirmed captions, poses, character, and transform values persist in the final render
- [ ] Long unbroken titles fit the fixed title bars without growing into image space
- [ ] Long captions remain inside the fixed caption band and never cover the presenter
- [ ] Out-of-range sticker scale/offset values are clamped inside the lower safe zone
- [ ] Preview and final frames match the approved timeline, style lock, and source-voiceover treatment
- [ ] Hindi/Hinglish audio produces Roman captions

---

## 2026 Quality Pass (Phase A / B / C)

**Phase A — render-critical**
- Fonts are now self-hosted via `@remotion/google-fonts` (`resolveFont`): titles + VS badge use Anton (`DISPLAY_FONT`), captions/handle use Montserrat (`TEXT_FONT`). Previously the template used system `Arial Black/Impact`, which fell back inconsistently on Lambda Linux. Local preview and Lambda output now match.
- Captions are empty-safe: no more hardcoded "Simple difference samjho." placeholder. The caption box only renders when real transcript/overlay text exists (whitespace-safe), so English and silent sections stay clean.

**Phase B — visual + product**
- Three visual themes (`themeId`): `light`, `dark`, `bold` — each defines background, dot pattern, glow, caption glass, handle color, box background, and hook/closing card background.
- Comparison tone (`tone`): `versus` (blue vs purple) or `goodBad` (green vs red). Threaded into title pills, image boxes, corner badges, glows, and cards.
- Winner (`winner`): `left` / `right` / `none`. Puts a 👑 crown on the winning title pill and announces the winner on the closing card.
- Opening hook card: first ~1.85s full-screen "A **VS** B" + topic, springs in and fades into the main layout.
- Closing CTA card: last ~2.6s full-screen winner announcement (or "Which one wins?") + "Follow @handle" pill.

**Phase C — UX parity**
- Live WYSIWYG preview in the dashboard (`components/preview/ComparePreview.tsx`) — CapCut-style sticky `@remotion/player` showing the user's real titles, uploaded images, theme, tone, winner, and sticker before render. Captions/poses in the preview are samples; real ones come from the transcript.
- `StickerStylePicker` is grouped into categories (Teachers / 3D Characters / Professionals / Faith) with the distracting selected `animate-bounce` removed.

**Server validation (`app/api/reels/jobs/route.ts`)**
- `resolveCompareTheme` / `resolveCompareTone` / `resolveCompareWinner` validate `compareTheme`/`compareTone`/`compareWinner` against fixed allow-lists; unknown values fall back to `light` / `versus` / `none`.

## What to Avoid

- DO NOT leave sticker in one pose for the entire video
- DO NOT add background music by default
- DO NOT add extra images or stock photos
- DO NOT add random SFX; sound must map to visible/timed events such as swipe, click, warning, cash, or conclusion
- DO NOT stretch comparison images to fill unequal areas
- DO NOT place captions over the comparison images
- DO NOT use AI image generation for comparison items
- DO NOT add random decorative elements (circles, stars, lines)
- DO NOT make the sticker too small to see or too large to dominate
- DO NOT use Devanagari script for Hindi/Hinglish audio captions

## Video Type Value Proposition

The Video Type adds value through:
1. **Structured comparison** — clean, equal split layout that's hard to make manually
2. **Sticker personality** — animated presenter without needing face-on-camera
3. **Intent-aware posing** — character reacts to content contextually
4. **Auto captions** — synced to voiceover without manual timing
5. **Variety** — 16 characters × 6 poses = unique combinations

NOT through flashy effects, stock imagery, or AI-generated visuals.

## Dedicated Page Social Proof

- The dedicated `/compare-explainer` page includes a Creator Proof gallery using the 21 Instagram screenshots in the Cloudinary asset folder `compare explainer insta screenshots`.
- The images are delivered directly from Cloudinary with responsive `f_auto`, `q_auto`, and cropped thumbnail transformations; they are not copied into Vercel/static render assets.
- This page presents the creator-shared 100K+ follower-growth and millions-of-views proof as social proof for comparison content, followed by all 16 dashboard-available sticker presenter previews.
