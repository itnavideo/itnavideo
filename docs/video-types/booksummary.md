# Book Summary Video (`bookSummary`) — Spec & Architecture

> **Master Spec Reference**: 16:9 Cinema Widescreen Book Chapter & Keynote Video Generator.

---

## 1. Overview & Positioning

Book Summary Video transforms raw book notes, chapter outlines, key takeaways, and voiceover audio into crisp **1080p Full HD (1920×1080)** cinematic video summaries. Designed for non-fiction book reviewers, business authors, coaches, and educational channels.

---

## 2. Key Specs & Boundaries

| Parameter | Specification |
| :--- | :--- |
| **Output Aspect Ratio** | **16:9 Widescreen (1920×1080 Full HD)** |
| **Frame Rate** | 30 FPS |
| **Maximum Duration** | **12 Minutes (720 seconds)** |
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
