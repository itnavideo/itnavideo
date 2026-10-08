# GitHub Spec Kit Master Verification Checklist — Itnavideo

> **Central Acceptance & Regression Matrix**
> Before marking any bug fix or feature task as complete, verify that the target mode's spec acceptance criteria pass and that the remaining 9 video modes remain 100% regression-free.

---

## 📋 Mode-by-Mode Specification & Verification Matrix

### 01. Image to Video AI (`.specify/specs/01-image-to-video.md`)
- [x] **User Inputs**: Narration Audio / Script + Aspect Ratio (16:9 or 9:16) + Visual Style + Reference Character Photos.
- [x] **AI Model Pipeline**: Audio → Groq Whisper (Fallback: Gemini Flash) → Gemini Director Scene Planner → Google AI Studio / Flux `nologo=true` Image Engine.
- [x] **Remotion Composition**: `remotion/templates/IMAGE_TO_VIDEO_AI/template.tsx` (`IMAGE-TO-VIDEO-AI`).
- [x] **Acceptance Criteria**:
  - Spatial Anchoring (`[Left side of frame]`, `[Right side of frame]`) prevents multi-character feature bleeding.
  - Image generation returns 1080p full HD images without watermarks.
  - Parallax motion & camera zoom pulses render smoothly without sub-frame black gaps.

---

### 02. Compare Explainer (`.specify/specs/02-compare-explainer.md`)
- [x] **User Inputs**: Voiceover Audio + 2 Comparison Images (Left vs Right or Product A vs B).
- [x] **AI Model Pipeline**: Audio → Groq Whisper → Local Compare Beat Planner.
- [x] **Remotion Composition**: `remotion/templates/COMPARE_EXPLAINER/template.tsx` (`COMPARE-EXPLAINER`).
- [x] **Acceptance Criteria**:
  - Dual-card blurred backdrop (`blur(24px)`) handles mismatched 9:16 vs 16:9 input images without cropping subjects.
  - Split cards animate cleanly with kinetic vs bounce indicators.
  - Subtitle strip renders at bottom safe zone with high contrast.

---

### 03. Whiteboard Video (`.specify/specs/03-whiteboard-video.md`)
- [x] **User Inputs**: Narration Audio / Script.
- [x] **AI Model Pipeline**: Audio → Groq Whisper → Gemini Stickman & Scene Strategy Planner → Tokenized Asset Index (`assets.json`).
- [x] **Remotion Composition**: `remotion/templates/WHITEBOARD_VIDEO/template.tsx` (`WHITEBOARD-VIDEO`).
- [x] **Acceptance Criteria**:
  - Jaccard similarity token matching finds relevant stickman/diagram assets.
  - Match scores $<0.3$ fallback cleanly to `stickman_thinking.png` without throwing 404 broken asset errors.
  - Hand-drawing animation paths execute synchronously with scene beat audio.

---

### 04. Kinetic Typography (`.specify/specs/04-kinetic-typography.md`)
- [x] **User Inputs**: Voiceover / Narration Audio.
- [x] **AI Model Pipeline**: Audio → Groq Whisper Word Timestamps → Kinetic Typography Engine.
- [x] **Remotion Composition**: `remotion/templates/TYPOGRAPHY_VIDEO/template.tsx` (`TYPOGRAPHY-VIDEO`).
- [x] **Acceptance Criteria**:
  - Auto-fit font formula calculates dynamic font size to keep text strictly within $W_{\text{safe}} = 900\text{px}$ canvas boundary.
  - Word scale pops and kinetic spring transitions sync millisecond-accurately to voice speech pulses.
  - High contrast drop-shadows ensure high legibility over motion backgrounds.

---

### 05. Auto Caption (`.specify/specs/05-auto-caption.md`)
- [x] **User Inputs**: Short-Form Video / Reel Audio.
- [x] **AI Model Pipeline**: Audio → Groq Whisper Word-Level Timestamps → Caption Presets Engine.
- [x] **Remotion Composition**: `remotion/templates/AUTO_CAPTION_REEL/template.tsx` (`AUTO-CAPTION-REEL`).
- [x] **Acceptance Criteria**:
  - Caption chunks split cleanly into 2-4 words per frame (max 22 characters).
  - Karaoke bounce highlight tracks current active spoken word.
  - Audio extraction converts input video to lightweight 16kHz mono audio (~9MB) before sending to Groq Whisper.

---

### 06. Audio Cleaner (`.specify/specs/06-audio-cleaner.md`)
- [x] **User Inputs**: Voiceover / Podcast / Narration Audio File.
- [x] **AI Model Pipeline**: Audio → Groq Whisper Transcript → Retake & Mistake Detection → FFmpeg Smart Pause Compression + EBU R128 Loudness Normalization.
- [x] **Output Format**: Studio Master Audio (WAV/MP3).
- [x] **Acceptance Criteria**:
  - Retakes, stutters, and repeated phrases are automatically marked and spliced out.
  - Long dead air silences ($>0.40\text{s}$) are sample-accurately compressed down to $0.28\text{s}-0.35\text{s}$ with 8ms anti-pop micro-fades.
  - Output audio achieves broadcast-standard $-16\text{ LUFS}$ integrated loudness.

---

### 07. Faceless Video (`.specify/specs/07-faceless-video.md`)
- [x] **User Inputs**: Script / Voiceover Audio + Topic Category.
- [x] **AI Model Pipeline**: Audio → Groq Whisper → Gemini B-Roll Director → Stock Media Index.
- [x] **Remotion Composition**: `remotion/templates/FACELESS_VIDEO/template.tsx` (`FACELESS-VIDEO`).
- [x] **Acceptance Criteria**:
  - B-roll video clips match narration keywords.
  - Background music ducking automatically lowers volume during active speech.

---

### 08. YouTube Subtitles (`.specify/specs/08-youtube-subtitles.md`)
- [x] **User Inputs**: 16:9 Widescreen Video.
- [x] **AI Model Pipeline**: Audio → Groq Whisper → Western Subtitle Presets.
- [x] **Remotion Composition**: `remotion/templates/YOUTUBE_SUBTITLES/template.tsx` (`YOUTUBE-SUBTITLES`).
- [x] **Acceptance Criteria**:
  - Subtitles render in bottom 16:9 safe zone without covering critical video UI.
  - Output renders in crisp 1920x1080 30 FPS Full HD MP4.

---

### 09. Long Video Promo (`.specify/specs/09-long-video-promo.md`)
- [x] **User Inputs**: Long Video Thumbnail + Teaser Audio / Video.
- [x] **AI Model Pipeline**: Local Layout Director → Promo Layout Engine.
- [x] **Remotion Composition**: `remotion/templates/LONG_VIDEO_PROMO/template.tsx` (`LONG-VIDEO-PROMO`).
- [x] **Acceptance Criteria**:
  - Bypasses speech transcription when no audio is supplied.
  - Promo thumbnail container applies subtle floating motion and gloss highlight.

---

### 10. Long Video Clips (`.specify/specs/10-long-video-clips.md`)
- [x] **User Inputs**: Long Widescreen Video (up to 3 Hours).
- [x] **AI Model Pipeline**: Audio Chunking (20m parts) → Parallel Groq Whisper → AI Viral Hook Detector → Remotion Shorts Exporter.
- [x] **Acceptance Criteria**:
  - AI Hook Detector identifies top 3-5 viral hooks with hook scores ($>80/100$).
  - Selected clips export as individual 1080x1920 30 FPS Full HD Shorts.

---

## 🛡️ Zero-Regression Verification Gate
After modifying any template, pipeline service, or UI component:
1. Run `npx tsc --noEmit` — verify 0 static TypeScript errors.
2. Verify target mode `.specify/specs/{mode}.md` acceptance criteria.
3. Confirm remaining 9 mode configurations in `VIDEO_TYPE_REGISTRY` retain exact prop signatures and safe default values.
