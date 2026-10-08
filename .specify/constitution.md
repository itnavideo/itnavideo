# Spec-Driven Development (SDD) Constitution — Itnavideo

> **Single Source of Truth & Governance Framework**
> All AI coding assistants (Antigravity, Codex, Kiro, Cursor) and human developers MUST strictly adhere to this constitution across all 10 active video generation modes and dashboard workflows.

---

## 🏛️ Fundamental Governance Rules

### Rule 1: Fail Fast & Zero Silent Fallback Policy
- **No Swallowed Exceptions**: Never silently catch external AI API errors (Google Vertex AI, Groq Whisper, ElevenLabs, Cloudinary, AWS S3) and return fallback placeholders or 0-byte outputs without logging and propagating the exact HTTP status code and error payload.
- **Explicit Diagnostics**: Surface the exact raw error string and status code (`[VERTEX_AI_ERROR] 404`, `[GROQ_WHISPER_ERROR] 429`, etc.) to the job status API and diagnostic UI container.

### Rule 2: Remotion Safe Boundaries & Cumulative Sub-Frame Snapping
- **Cumulative Integer Snapping**: Every sequence transition and audio-synced scene cut MUST be calculated using cumulative integer frame ceiling/offset (`Math.ceil(accumulatedFrames)`).
- **Zero Black Flashes**: Timeline gaps caused by fractional floating-point frame rounding (`179.4` frames vs `179` frames) are strictly forbidden. Clamp final sequence duration to `totalFrames - frameCursor` to prevent 1-frame black flickers.

### Rule 3: Payload Limits & S3 Canonical URL Mandate
- **No Data URIs in Lambda Payloads**: Never pass heavy Base64 data URIs or inline binary buffers to the AWS Lambda render engine or background job runners.
- **Canonical S3 URLs**: All media assets (images, audio files, font binaries, videos) sent to Remotion Lambda MUST be presigned or public canonical S3 / Cloudinary URLs.

### Rule 4: Strict Video Mode Isolation
- **Pipeline Scoping**: Every video type (`autoCaption`, `imageToVideoAi`, `compare`, `whiteboardVideo`, etc.) MUST execute strictly its own pipeline and stepper sequence.
- **Zero Cross-Mode Contagion**: Edits to one video mode's planner, template props, or backend job handler MUST have zero side-effects on the remaining 9 video modes.

### Rule 5: Master Google Analytics Dark Theme Consistency
- **Zero Color Drift**: Never introduce arbitrary neon purple, pink, or cyan accent colors.
- **Palette Specification**: Strictly enforce Obsidian Dark (`#070B14`, `#0E1526`) with signature Google Analytics Orange highlights (`#FF6D00` via `#FF8F00` to `#FFA726`).
- **High-Contrast Errors**: Error containers MUST use `bg-red-950/80 border border-red-500/40 text-red-200 font-mono` to guarantee 100% legibility.

---

## 📐 Verification & Quality Gates
1. Static Type Checking: `npx tsc --noEmit` MUST pass with 0 errors before any code deployment.
2. Resolution Mandate: Every video mode exports in crisp **1080p Full HD** (1080x1920 or 1920x1080 30 FPS MP4).
3. Zero Hanging Processes: Post-task execution MUST verify terminal cleanliness via `manage_task` (action: `list`).
