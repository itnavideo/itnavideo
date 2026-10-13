# Book Summary Video (`bookSummary`) — Spec & Architecture

> **Master Spec Reference**: 16:9 Cinema Widescreen Book Chapter & Keynote Video Generator.

---

## 1. Overview & Positioning

Book Summary Video transforms raw book notes, chapter outlines, key takeaways, and voiceover audio into crisp **1080p Full HD (1920×1080)** cinematic video summaries. Designed for non-fiction book reviewers, business authors, coaches, and educational channels.

---

## 2. Key Specs & Boundaries

| Parameter | Specification |
| :--- | :--- |
| **Output Aspect Ratio** | **Dual Aspect Ratio**: `16:9` Widescreen Cinema & `9:16` Vertical Shorts |
| **Frame Rate** | 30 FPS |
| **Maximum Duration** | **12 Minutes (720s for 16:9 Cinema)** / **90 Seconds (9:16 Shorts)** |
| **Input Assets** | Voiceover Audio / Script + Chapter Notes / Book Cover / Quotes |
| **Audio Extraction** | 16kHz mono audio extracted before transcription |
| **Transcription** | Primary: Groq Whisper Cloud API (Fallback: Google Gemini 2.0 Flash) |
| **Remotion Composition ID** | `BOOK_SUMMARY_VIDEO` |
| **Color Accents** | Cyber Gold (`#FFD700`) & Deep Amber (`#FF8F00`) |

---

## 3. Pipeline Stages

1. **Audio Prep & Extract**: Validate duration <= 12m, extract lightweight audio.
2. **Speech Transcription**: Groq Whisper millisecond timestamps for quotes and keywords.
3. **Chapter Breakdown**: Auto-structure into Chapter Title, Big Idea, Key Quote, and Actionable Steps.
4. **Cinematic Motion & Parallax**: Animate book illustrations, kinetic quote reveals, and chapter progress bar.
5. **1080p Cloud Render**: AWS Lambda Remotion render to MP4.

---

## 4. Remotion Props Interface

```typescript
export interface BookSummaryVideoProps {
  audioUrl: string;
  bookTitle: string;
  authorName?: string;
  coverImageUrl?: string;
  chapters: Array<{
    title: string;
    keyTakeaway: string;
    quoteText?: string;
    startTimeSeconds: number;
    endTimeSeconds: number;
  }>;
  subtitles?: Array<{
    text: string;
    start: number;
    end: number;
  }>;
  accentColor?: string;
}
```

---

## 5. Pipeline Error Checklist & Auto-Fix Matrix

| Pipeline Stage | Potential Error / Failure | Root Cause | Automated Recovery / Fix | User-Facing Action / Feedback |
| :--- | :--- | :--- | :--- | :--- |
| **1. Audio Upload** | `DURATION_EXCEEDED` | Voiceover longer than 12 minutes (720s) | Backend validation rejects before queueing | Notification to split audio into parts |
| **1. Audio Upload** | `UNSUPPORTED_AUDIO_CODEC` | Rare or uncompressed audio container | Cloud FFmpeg wrapper normalizes to 16kHz mono MP3 | Smooth processing without user re-encoding |
| **2. Transcription** | `WHISPER_RATE_LIMIT` | Groq Whisper concurrency burst | Seamless failover to Google Gemini 2.0 Flash (`asia-south1`) | Zero render disruption |
| **2. Transcription** | `NO_SPEECH_DETECTED` | Instrumental audio or corrupted microphone stream | Transcription returns 0 word timestamps | Clear alert: "No clear voiceover detected in audio file" |
| **3. Chapter Planning** | `AI_CHAPTER_DETECTION_FAIL` | Script structure unstructured or LLM timeout | Fallback to deterministic time-window segmentation (equal-split chapters) | Book summary cards generate reliably with timestamped markers |
| **4. Visual Rendering** | `COVER_IMAGE_NOT_FOUND` | User omitted book cover image | Auto-generates stylized typographic 3D book cover graphic | Premium fallback graphic displayed automatically |
| **5. Remotion Render** | `LAMBDA_RENDER_CRASH` | Frame rendering error on heavy canvas | Status route catches error, logs diagnostic reason, and auto-refunds credits | Instant retry button & credit refund |
| **6. File Delivery** | `STORAGE_URL_EXPIRED` | User downloads after initial S3 presign window | Status polling endpoint auto-refreshes signed S3 URL with 48h validity | Instant download availability |

