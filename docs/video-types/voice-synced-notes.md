# Voice Synced Notes

## Basic Information

| Field | Value |
|-------|-------|
| Video Type Name | Voice Synced Notes |
| Internal ID | `VOICE_SYNCED_NOTES` |
| Composition ID | `VOICE-SYNCED-NOTES` |
| Dashboard Mode | `voiceSyncedNotes` |
| Category | Education |

## Purpose

AI creates study/explanation notes that appear line by line, synced to the speaker's voice. Like watching someone write notes on a clean page in real time as they explain a topic.

## Who Uses It

- Students creating study note reels from lectures
- Educators sharing key points from their explanations
- Content creators turning audio into visual note-taking style content
- Anyone who wants a "notes appearing" visual from speech

## Viewer Expectation

The viewer sees clean, handwritten-style notes appearing one line at a time as the speaker talks. It should feel like a study companion — clear, organized, and easy to follow along with.

## What Problem It Solves

Students and creators want to turn explanations into visual note-taking content. Manually timing notes to appear with speech requires editing. This builds timed notes automatically and deterministically from transcript segments.

## Why User Should Pay

- Notes appear perfectly synced to speech (no manual timing)
- Clean, professional note-taking visual style
- Deterministic — no AI randomness, same input = same output
- Study-friendly format that viewers save and share
- No editing software needed

---

## Required User Inputs

| Input | Type | Required | Notes |
|-------|------|----------|-------|
| Audio or Video | Audio/Video file | Yes | Must contain speech |

## Optional User Inputs

| Input | Type | Notes |
|-------|------|-------|
| Topic/Title | Text | Shown as heading for the notes |

## Inputs NOT Collected

- No images needed
- No sticker selection
- No caption style selection
- No comparison items
- No thumbnail

---

## Output Details

| Property | Value |
|----------|-------|
| Default size | 1080×1920 (9:16) |
| Supported aspect | 9:16 only (currently) |
| Max duration | 60 seconds |
| Min duration | 8 seconds |
| Duration source | Matches uploaded audio/video length |
| Export format | MP4 (H.264 + AAC) |
| Audio handling | User's uploaded audio plays at full volume |
| Background music | OFF by default |
| AI Planning | None — deterministic from transcript segments |

---

## Layout Rules

Clean canvas with notes appearing line by line:

```
┌─────────────────────────────┐
│                             │
│   TOPIC / TITLE             │  ← optional heading at top
│   ─────────────────         │
│                             │
│   • Note line 1             │  ← appears when speaker says it
│                             │
│   • Note line 2             │  ← next line appears with speech
│                             │
│   • Note line 3             │  ← progressive, top to bottom
│                             │
│   • Note line 4             │
│                             │
│   • Note line 5             │
│                             │
│                             │
│                             │
└─────────────────────────────┘
```

### Layout Details
- Clean white or light canvas background (paper/notebook feel)
- Notes appear top-to-bottom, one line at a time
- Each note line timed to its corresponding transcript segment
- Adequate spacing between lines for readability
- Optional topic/title as heading

### Spacing
- Top margin: 80-120px for title area
- Left margin: 60-80px (consistent indent)
- Line spacing: 60-80px between note lines
- Right margin: 60px (text wraps before edge)

### Note Line Handling
- Built deterministically from transcript segments
- Each segment → one note line (or bullet point)
- Lines are concise summaries, NOT full transcript text
- Maximum ~15 words per line for readability
- Clean handwritten-style rendering

---

## Color and Typography Rules

| Element | Style |
|---------|-------|
| Background | White or off-white (paper/clean canvas) |
| Note text | Dark (black/dark gray), handwritten-style font |
| Title | Slightly larger, bold, same dark color |
| Bullet/marker | Simple dot or dash, subtle |
| Divider | Light gray line under title (optional) |
| Overall | Clean, minimal, notebook aesthetic |

### What Colors to Avoid
- No dark backgrounds
- No colorful/gradient backgrounds
- No neon or bright text colors
- No heavy decorative elements
- Keep the "clean notes" aesthetic — paper-like

---

## Motion Rules

| Element | Animation |
|---------|-----------|
| Note lines | Fade in or write-in effect, one at a time |
| Title | Static or gentle fade at start |
| Previous lines | Stay visible after appearing |
| New line | Appears in sync with speech timing |

### What Should NOT Animate
- No bouncing or floating text
- No typewriter character-by-character (line appears as unit)
- No spinning or sliding from sides
- No particle effects
- No background motion
- Lines appear cleanly — not dramatically

---

## Asset Rules

- No stock images
- No background music
- No sound effects
- No pre-loaded visual assets
- No AI-generated images
- Template folder is code-only
- Notes derived deterministically from transcript — no AI planning

---

## Timeline / Scene Structure

Deterministic, single-scene timeline:

- Audio source = user's uploaded audio/video
- Duration = media length (capped at 60s)
- Notes = built from transcript segments (Groq transcription)
- No AI planning — purely deterministic mapping from transcript
- Each transcript segment → one note line
- Lines appear timed to segment start times

### How Notes Are Built
1. Groq transcribes audio → timed transcript segments
2. Each segment is condensed into a note line (deterministic)
3. Note lines rendered with start time matching segment timing
4. Progressive accumulation — lines stay visible once shown

## Fallback Rules

| Scenario | Behavior |
|----------|----------|
| Transcription fails | Show error — can't build notes without transcript |
| No speech detected | Show error — speech required |
| Audio too short (<8s) | Clamp to minimum, fewer note lines |
| Audio too long (>60s) | Trim to 60s |
| Too many segments | Group into reasonable number of lines (~8-12 max) |
| Very short segment | Merge with adjacent segment |
| No title provided | Hide title area, start notes from top |
| Hindi/Hinglish audio | Roman Hinglish note lines |
| Single long sentence | Split into multiple note lines if needed |

---

## QA Checklist

- [ ] Clean white/light background renders (paper-like)
- [ ] Notes appear one line at a time synced to speech
- [ ] Note timing matches speaker's actual words
- [ ] Lines are readable at mobile size (not too small)
- [ ] Previous lines remain visible after appearing
- [ ] Spacing between lines is consistent
- [ ] No overflow — lines don't go off-screen
- [ ] Title displays when provided
- [ ] Audio plays at correct volume
- [ ] Notes do NOT look like subtitle captions
- [ ] Handwritten-style rendering is clean and legible
- [ ] Hindi/Hinglish audio produces Roman script notes
- [ ] No more than ~12 lines visible (scroll/reset if needed)

---

## What to Avoid

- DO NOT render as caption subtitles — this is NOTES, not captions
- DO NOT use caption-style bottom positioning (notes go top-to-bottom)
- DO NOT add background music
- DO NOT add images or visual assets
- DO NOT add decorative elements (borders, icons, stickers)
- DO NOT use AI planning (keep it deterministic from transcript)
- DO NOT show full transcript text as notes (condense to key points)
- DO NOT animate each character individually (line as a unit)
- DO NOT use dark backgrounds
- DO NOT use paid AI providers — transcript is from Groq (already needed)
- DO NOT use Devanagari script for Hindi/Hinglish content

## Video Type Value Proposition

The Video Type adds value through:
1. **Perfect sync** — notes timed to speech without manual editing
2. **Deterministic** — no AI randomness, consistent results
3. **Study format** — viewers save and revisit note-style content
4. **Clean aesthetic** — professional notebook look without design skill
5. **Speed** — instant notes from any audio/video

NOT through captions, AI imagery, stickers, or visual effects. The notes ARE the visual.
