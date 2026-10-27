# Book Summary Video (`bookSummary`) — Spec & Architecture

> **Master Spec Reference**: 16:9 Cinema Widescreen Book Chapter & Keynote Video Generator.

---

## 1. Overview & Positioning

Book Summary Video transforms raw book notes, chapter outlines, key takeaways, and voiceover audio into crisp **1080p Full HD (1920×1080)** cinematic video summaries. Designed for non-fiction book reviewers, business authors, coaches, and educational channels.

---

## 2. Key Specs & Boundaries

| Parameter | Specification |
| :--- | :--- |
| **Output Aspect Ratio** | **Strictly 16:9 Landscape Widescreen Only** (`1920×1080`) — No 9:16 vertical |
| **Frame Rate** | 30 FPS |
| **Maximum Duration** | **Up to 10 Minutes (600s)** for YouTube long-form |
| **Credit Pricing** | **1 Min = 1 Credit** (1m=1, 5m=5, 10m=10 Cr) per Rule 4.1 |
| **Input Assets** | Voiceover Audio (MP3/WAV/M4A) + Book Cover / Author Portrait / Reference Images |
| **Audio Extraction** | 16kHz mono audio extracted before transcription |
| **Transcription** | Primary: Groq Whisper Cloud API (Fallback: Google Gemini 2.0 Flash) |
| **Remotion Composition ID** | `BOOK-SUMMARY` (`1920×1080`) |
| **Visual Theme** | **Clean Editorial White Background** (`#FFFFFF` / `#FAFAFA`) with high-contrast text (`#0F172A`) |
| **Color Accents** | Flame Orange (`#EA580C` / `#FF5722`), Sunset Amber (`#FFA000`), Warm Peach (`#FFEDD5`) |
| **Dynamic Scene Types** | 8 Non-Repeating Layouts: `BOOK_COVER`, `LESSON_TITLE`, `KEY_IDEA`, `COMPARISON`, `KEY_STEPS`, `STAT_INSIGHT`, `QUOTE`, `CONCLUSION` |

---

## 3. Pipeline Stages

1. **Audio Prep & Extract**: Validate duration <= 10m (600s), extract lightweight audio.
2. **Speech Transcription**: Groq Whisper millisecond timestamps for quotes and keywords.
3. **Chapter & Dynamic Scene Breakdown**: Auto-structure into 8 distinct non-repeating scene layouts (Book Cover, Lesson Title, Key Idea, Comparison split, 3-Step Roadmap, Stat Insight, Quote, and Conclusion) so no card is repeated back-to-back.
4. **Cinematic Motion & Clean White Canvas**: Animate cards with spring physics on a pure white `#FAFAFA` grid canvas with frosted white subtitle pill.
5. **1080p Cloud Render**: AWS Lambda Remotion render to MP4 (16:9 Landscape).

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
| **1. Audio Upload** | `DURATION_EXCEEDED` | Voiceover longer than 10 minutes (600s) | Backend validation rejects before queueing | Notification to split audio into parts |
| **1. Audio Upload** | `UNSUPPORTED_AUDIO_CODEC` | Rare or uncompressed audio container | Cloud FFmpeg wrapper normalizes to 16kHz mono MP3 | Smooth processing without user re-encoding |
| **2. Transcription** | `WHISPER_RATE_LIMIT` | Groq Whisper concurrency burst | Seamless failover to Google Gemini 2.0 Flash (`asia-south1`) | Zero render disruption |
| **2. Transcription** | `NO_SPEECH_DETECTED` | Instrumental audio or corrupted microphone stream | Transcription returns 0 word timestamps | Clear alert: "No clear voiceover detected in audio file" |
| **3. Chapter Planning** | `AI_CHAPTER_DETECTION_FAIL` | Script structure unstructured or LLM timeout | Fallback to deterministic time-window segmentation (equal-split chapters) | Book summary cards generate reliably with timestamped markers |
| **4. Visual Rendering** | `COVER_IMAGE_NOT_FOUND` | User omitted book cover image | Auto-generates stylized typographic 3D book cover graphic | Premium fallback graphic displayed automatically |
| **5. Remotion Render** | `LAMBDA_RENDER_CRASH` | Frame rendering error on heavy canvas | Status route catches error, logs diagnostic reason, and auto-refunds credits | Instant retry button & credit refund |
| **6. File Delivery** | `STORAGE_URL_EXPIRED` | User downloads after initial S3 presign window | Status polling endpoint auto-refreshes signed S3 URL with 48h validity | Instant download availability |

