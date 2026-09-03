# Whiteboard Video

## Basic Information

| Field | Value |
|-------|-------|
| Video Type Name | Whiteboard Video |
| Internal ID | `WHITEBOARD_VIDEO` |
| Composition ID | `WHITEBOARD-VIDEO` |
| Dashboard Mode | `whiteboardVideo` |
| Category | Short Videos |
| Output | 1080×1920, 9:16 MP4 |
| Max duration | 60 seconds |
| Credits | 1 credit |

## Design Philosophy

**NOT a classroom whiteboard.** This is a premium corporate-strategy board — the kind used in consulting firms, startup boardrooms, and planning sessions.

- Clean white premium board with thin metal frame
- Simple black marker, clean handwriting feel
- Premium spacing between elements
- Consulting/boardroom style sketches (arrows, flowcharts, boxes)
- No cartoon doodles, no school/classroom feeling
- No background music (user narration is primary)

## Workflow — Scene-Based Writing

### Scene 1 (30-40% of video)
1. AI analyzes the full script
2. Divides script into 2-3 logical sections max
3. Writes the current scene's full content on the board at once
4. Not just text — also arrows, flowcharts, boxes, simple corporate-style icons where needed
5. Board stays stable after writing completes

### Scene 2 / Scene 3
1. When voiceover explains, no new text writing
2. Instead: highlight relevant words, diagrams, or sections
3. Use: circle, underline, marker stroke, arrows, or zoom effect
4. If new topic starts: clear board → write next section content at once

## Visual Style

- Corporate planning board feel
- Simple black marker strokes
- Clean handwriting font (not cursive, not Comic Sans)
- Premium spacing — never cramped
- Simple corporate sketches (arrows → boxes, flowcharts, bullet hierarchies)
- No emoji, no cartoon characters, no stickers
- Thin metallic frame border (subtle, premium)

## Sound Design (Future Enhancement)

Corporate whiteboard sound effects to be auto-applied:
- Marker writing sound
- Marker cap open/close
- Soft underline/highlight stroke
- Circle drawing sound
- Board erase/wipe sound
- Light marker tap sound

**Current state:** No SFX implemented. Silent board writing with user narration only.

## Dashboard

- Single board style: `corporate-luxury` (fixed, no picker)
- Upload: audio or video with speech
- No board selection UI (removed)
- Preview image: single clean corporate whiteboard

## Planner (Deterministic — No AI API)

- Local planner derives 2-3 key points from Groq transcript
- `extractPoint()` strips filler words (English + Hinglish)
- `inferBulletType` and `inferIcon` detect point types (steps, warnings, must-do)
- `buildConclusion()` derives a short takeaway recap
- Max 3 concise points per board (never cramped)
- No secondary AI provider used

## Render Pipeline

```
Upload audio/video → S3 presigned URL → /api/reels/jobs →
  Groq Whisper transcription →
  planWhiteboardVideo() (deterministic) →
  Remotion Lambda: WHITEBOARD-VIDEO composition →
  Poll status → Download MP4
```

## Languages

- English → English text on board
- Hindi/Hinglish → Roman Hinglish text on board
- No Devanagari script

## What It Does NOT Do

- No background music or SFX (planned for future)
- No caption/subtitle bar (board writing IS the visual)
- No sticker character
- No progress dots
- No AI image generation
- No external visuals — only marker text + simple diagrams

## Board Image

Single premium corporate whiteboard image (9:16 portrait) used as background.
Location: `public/assets/reusable/images/whiteboard-corporate-luxury.png` (Lambda bundle)
Dashboard preview: `/visuals/previews/Whiteboard Video.png` (Vercel)

## File References

- Template: `remotion/templates/WHITEBOARD_VIDEO/template.tsx`
- Planner: `services/ai/whiteboardPlanner.ts`
- Dashboard: `app/dashboard/page.tsx` (mode === "whiteboardVideo")
- Jobs: `app/api/reels/jobs/route.ts` (whiteboardVideo branch)
- Doc: `docs/video-types/whiteboard-video.md`

## QA Checklist

- [ ] All text stays within board safe-zone (no overflow)
- [ ] Max 3 points displayed (never cramped)
- [ ] Clean corporate look (no classroom/cartoon feel)
- [ ] Writing appears scene-by-scene, not word-by-word
- [ ] Board stays stable after writing
- [ ] User narration audio preserved
- [ ] No background music/SFX
- [ ] English and Roman Hinglish render correctly
