# AI Audio Cleaner & Enhancer — Studio Specification

## Overview

The **AI Audio Cleaner & Enhancer** (`audioClean`) is Itnavideo's precise voiceover timing, retake cutting, and silence removal engine. It automatically detects and compresses dead-air, awkward pauses, and repeated sentence takes across raw voice recordings while preserving **100% of the original speaker's authentic voice, tone, pitch, accent, and acoustic character**.

- **Primary Purpose**: Automatically cut mistakes, eliminate pauses, remove background hum, and master voice recordings to broadcast quality.
- **Target Audience**: Voiceover artists, podcasters, course creators, video essayists, and interviewers.
- **Expected Output**: Studio-mastered 320kbps MP3 (default), Lossless WAV, or Apple M4A audio.

---

## Table of Contents

1. [Overview](#overview)
2. [Features and Capabilities](#features-and-capabilities)
3. [User Workflow](#user-workflow)
4. [UI/UX Design and Components](#uiux-design-and-components)
5. [Colors, Typography and Design Tokens](#colors-typography-and-design-tokens)
6. [Technical Implementation](#technical-implementation)
7. [Business Logic, Duration and Credit Rules](#business-logic-duration-and-credit-rules)
8. [Error Handling and Edge Cases](#error-handling-and-edge-cases)
9. [Testing and Quality Assurance](#testing-and-quality-assurance)
10. [Developer Notes and Guardrails](#developer-notes-and-guardrails)

---

## 1. Features and Capabilities

- **Automatic Retake & False-Start Detection**: Detects repeated sentences and hesitations in the transcript, cleanly slicing out failed takes and preserving only the best performance.
- **Millisecond Silence Trimmer**: Scans pauses longer than 300ms and trims them to natural pacing without harsh audio clicks.
- **3 Pacing Profiles**:
  - `Fast Retention (300ms trigger → 100ms gap)`: Snappy pacing calibrated for high-retention social reels.
  - `Natural Flow (300ms trigger → 140ms gap)`: Balanced conversational cadence for podcasts and interviews.
  - `Relaxed Cadence (450ms trigger → 200ms gap)`: Gentle trimming for audiobooks and educational lectures.
- **Spoken Narration Editorial Transcript**: Displays the full speech transcript first with heading formatting (`# Section`) and typo corrections before triggering audio processing.
- **Live A/B Comparison Switcher**: Real-time interactive player allows instant toggling between `🔴 Before (Original)` and `✨ After (Cleaned)` with synchronized timeline scrubbing.
- **Broadcast Audio Mastering**: 24-bit studio normalization, de-essing, room echo reduction, and multi-format export (320kbps MP3, WAV, M4A).

---

## 2. User Workflow

The studio follows a guided 4-step workflow:

1. **Step 1: Upload (Voiceover Audio or Video Recording)**:
   - Creator uploads raw voiceover (`.mp3`, `.wav`, `.m4a`, `.aac`) or video (`.mp4`, `.mov`).
   - Recordings up to 5 minutes (300 seconds) are supported.
   - Cloud transcribes speech and detects all pauses and retakes.
2. **Step 2: Pacing & Threshold Configuration**:
   - Creator selects pacing profile (`Fast Retention`, `Natural Flow`, `Relaxed Cadence`).
   - Selects output audio format (320kbps MP3, WAV, M4A).
3. **Step 3: Review & Edit Transcript Canvas**:
   - Full transcript editor allows fixing typos, removing sections, or pasting an exact script.
   - Timeline Pause Inspector lists every detected gap with duration and cut timestamps.
4. **Step 4: Master Preview & Live A/B Compare**:
   - Live A/B audio player lets the creator audition the cleaned track against the original.
   - Creator reviews time-saved metrics and clicks **Download Cleaned Audio**.

---

## 3. UI/UX Design and Components

- **Studio Route**: `/dashboard/audio-cleaner`
- **Frontend Studio Component**: `components/dashboard/AudioCleanStudio.tsx`
- **Public SEO Landing Page**: `/ai-audio-cleaner` (`app/ai-audio-cleaner/page.tsx`)
- **Design Structure**: Pure White canvas (`#FFFFFF`) with fine borders (`#E2E8F0`) and responsive 3-row layout (`Stepper Header`, `Preview Work Area`, `Sticky Action Bar`).

---

## 4. Colors, Typography and Design Tokens

- **Canvas Background**: Pure White (`#FFFFFF`) with subtle slate background accents (`#F8FAFC`).
- **Primary Brand Accent**: Sunset Orange (`#FF5722` / `#F97316`) for active controls and primary CTA buttons.
- **Audio Waveform Accent**: Emerald Green (`#059669`) for cleaned audio tracks.
- **Typography**: Inter / System Sans-serif stack (`font-sans`).

---

## 5. Technical Implementation

- **Video Type ID**: `audio-cleaner` / `AUDIO_CLEAN`
- **Processing Engine**: Cloud-based sample-accurate FFmpeg `atrim` + `concat` slicing with 8ms anti-pop micro cross-fades.
- **Speech Extraction**: Extracted 16kHz mono audio processed via Groq Whisper Cloud API.
- **Transcriber Fallback**: Google Gemini 2.0 Flash (`asia-south1`).

---

## 6. Business Logic, Duration and Credit Rules

- **Aspect Ratio**: Audio Utility (Non-video output).
- **Maximum Output Duration**: Up to **5 Minutes Max (300 seconds)** natively.
- **Credit Billing**: **Strictly 1 Credit** per cleaned audio file (Master Rule 4.1).
- **Draft Preview**: 100% Free interactive browser A/B preview before downloading.

---

## 7. Error Handling and Edge Cases

- **No Speech Detected**: Flags `NO_SPEECH_DETECTED`; prompts user to upload audio with clear speech without deducting credits.
- **Anti-Pop Micro Cross-Fades**: 8ms cross-fade curves prevent audio clicks or pops at splice boundaries.
- **Memory Protection**: `URL.revokeObjectURL` automatically releases allocated audio buffers on unmount or file reset.

---

## 8. Testing and Quality Assurance

- **Typecheck Verification**: `npx tsc --noEmit` verifies all audio cleaner props and state interfaces.
- **A/B Switcher Sync**: Confirm that switching between Before and After preserves relative playback position without restart.
- **Splice Smoothness Test**: Verify that joined sentences sound completely natural without clipped syllables.

---

## 9. Developer Notes and Guardrails

- **Zero Local Rendering (Rule 0)**: Heavy audio filtering and batch transcoding must run on serverless cloud workers, never locally on the developer machine.
- **Voice Character Preservation**: The cleaner trims timing and removes background noise; it does not alter vocal timbre, pitch, or accent.
