# Whiteboard Video (`WHITEBOARD_VIDEO`)

## Master Specification

| Field | Value |
|---|---|
| Video Type Name | Whiteboard Video |
| Internal ID | `WHITEBOARD_VIDEO` |
| Composition ID | `WHITEBOARD-VIDEO` |
| Dashboard Mode | `whiteboardVideo` |
| Output Resolution | 1080×1920 (9:16 Full HD MP4) |
| Maximum Duration | 180 seconds (3 minutes) |
| Pipeline Engine | Groq Whisper + Gemini 2.0 Flash + Deterministic Fallback |

---

## 1. System Pipeline Architecture

1. **Audio Extraction**: 16kHz mono MP3/WAV extracted from uploaded media.
2. **Groq Whisper Transcription**: Generates exact word-level timestamps (`words` array with `start` and `end` times).
3. **Sentence-Boundary Segmentation**: `buildWhiteboardSegments()` groups words at sentence boundaries (`. ! ?`) and natural pauses (`> 0.45s`).
4. **Gemini 2.0 Flash Planner (`planWhiteboardVideo`)**:
   - Takes script text, sentence segments, and word timestamps.
   - Outputs points with `text` (2–5 words max), `boardIndex`, `wordStartIndex`, `wordEndIndex`, `icon`, `drawingId`, and `focusType`.
   - **ZERO timing fields output by LLM** — all timing computed in code from word timestamps (`computePointTiming`).
5. **Deterministic Fallback (`planDeterministicWhiteboard`)**: Runs automatically if API key is missing or Gemini call fails.

---

## 2. Shared Layout Geometry (`lib/whiteboard/whiteboardConstants.ts`)

Single source of truth shared across planner and Remotion renderer:

```ts
export const WB_CANVAS_WIDTH = 1080;
export const WB_CANVAS_HEIGHT = 1920;

// Safe Area (Clear of Reel UI)
export const WB_SAFE_LEFT = 80;
export const WB_SAFE_RIGHT = 80;
export const WB_SAFE_TOP = 160;
export const WB_SAFE_BOTTOM = 240;

export const WB_USABLE_WIDTH = 920;   // 1080 - 80 - 80
export const WB_USABLE_HEIGHT = 1520; // 1920 - 160 - 240

// Typography Limits
export const WB_TITLE_SIZE = 96;       // Fixed Title Size
export const WB_CONCLUSION_SIZE = 72;  // Fixed Conclusion Size
export const WB_POINT_SIZE_BY_COUNT = { 1: 80, 2: 72, 3: 68 }; // Point Size Table
export const WB_POINT_SIZE_MIN = 52;   // Hard minimum

// Per-Board Limits
export const WB_MAX_POINTS_PER_BOARD = 3;
export const WB_MAX_WORDS_PER_POINT = 5;
export const WB_MAX_LINES_PER_POINT = 2;
export const WB_MAX_CHARS_PER_LINE = 26;
```

---

## 3. Zero-Shift Layout Engine (`remotion/templates/WHITEBOARD_VIDEO/template.tsx`)

- **100% Stable DOM Layout**: Full text is rendered in place from frame 0 so line wrapping and container dimensions remain completely static throughout animation.
- **Opacity + TranslateY Reveal**: Point text reveals smoothly over `WB_REVEAL_FADE_FRAMES` (8 frames) with 12px `translateY` offset starting at spoken speech timestamp (`startTime`).
- **No Container Scaling**: Container width and height are fixed to `WB_USABLE_WIDTH` (920px) × `WB_USABLE_HEIGHT` (1520px) without `transform: scale()`.
- **Vector Strokes & SFX**: Vector sketch drawings (`WhiteboardDynamicSketch`) and doodle icons draw progressively via `strokeDashoffset` synced with speech and marker sound effects.
