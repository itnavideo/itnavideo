# Itnavideo — Video Types Master Registry

This directory contains the dedicated requirement, architecture, and pipeline specifications for all **active video types** in [Itnavideo](https://www.itnavideo.com).

As per **Rule 8 of `AGENTS.md` (Video Type Independence)** and the **Founder Master Directive**, video types are strictly split into **16:9 Widescreen Long-Form** and **9:16 Vertical Short-Form** workflows.

---

## 1. 🎬 16:9 Widescreen Long-Form Category (Strictly 16:9 Only — Up to 10 Minutes)

| # | Video Type | Spec File | Aspect Ratio | Max Duration | Credit Policy | Primary Pipeline Focus | Remotion Composition ID |
|---|---|---|:---:|:---:|:---:|---|---|
| 1 | **Faceless Video (Long-Form)** | [`facelessvideo.md`](./facelessvideo.md) | **16:9 Only** | **Up to 10 Min (600s)** | **1 Min = 1 Credit** (1m=1, 5m=5, 10m=10 Cr) | Script/Audio → AI Director + Stock B-Roll + Music | `FACELESS_VIDEO` |
| 2 | **Book Summary Video** | [`booksummary.md`](./booksummary.md) | **16:9 Only** | **Up to 10 Min (600s)** | **1 Min = 1 Credit** (1m=1, 5m=5, 10m=10 Cr) | Book Quotes/Audio → Cinematic Chapter Visuals | `BOOK_SUMMARY_VIDEO` |
| 3 | **Image to Video AI** | [`imagetovideoai.md`](./imagetovideoai.md) | **16:9 Only** | **Up to 10 Min (600s)** | **1 Min = 1 Credit** (1m=1, 5m=5, 10m=10 Cr) | Audio + Scene Images → Parallax & Subtitles | `IMAGE_TO_VIDEO_AI` |
| 4 | **YouTube Subtitles Generator** | [`autocaption.md`](./autocaption.md) | **16:9 Only** | **Up to 10 Min (600s)** | **1 Min = 1 Credit** (1m=1, 5m=5, 10m=10 Cr) | Video/Audio → High-Contrast Spoken Captions | `AUTO_CAPTION_GENERATOR` |
| 5 | **Long Video to Shorts Clips** | [`longvideoclips.md`](./longvideoclips.md) | Input 16:9/9:16 -> Output 9:16 | **Input: Up to 2 Hours**<br/>**Output: 30s–60s Clips** | **2 Credits / Clip** | Long Video → Virality Hook Detection & 9:16 Reframe | `LONG_VIDEO_CLIPS` |

---

## 2. 📱 9:16 Vertical Short-Form Category (Strictly 9:16 Only — Up to 90 Seconds)

| # | Video Type | Spec File | Aspect Ratio | Max Duration | Credit Policy | Primary Pipeline Focus | Remotion Composition ID |
|---|---|---|:---:|:---:|:---:|---|---|
| 1 | **Auto Caption Reel** | [`autocaption.md`](./autocaption.md) | **9:16 Only** | **Up to 90 Seconds (90s)** | **1 Credit** | Video/Audio → Kinetic Glowing Captions & Subtitles | `AUTO_CAPTION_GENERATOR` |
| 2 | **Typography Kinetic Video** | [`typographyvideo.md`](./typographyvideo.md) | **9:16 Only** | **Up to 90 Seconds (90s)** | **1 Credit** | Voiceover → Kinetic Text Motion & Camera Pulses | `TYPOGRAPHY_VIDEO` |
| 3 | **Whiteboard Animation** | [`whiteboardvideo.md`](./whiteboardvideo.md) | **9:16 Only** | **Up to 90 Seconds (90s)** | **1 Credit** | Audio → AI Strategy Board Scenes & SVG Drawing | `WHITEBOARD_VIDEO` |
| 4 | **Faceless Video Shorts** | [`facelessvideo.md`](./facelessvideo.md) | **9:16 Only** | **Up to 90 Seconds (90s)** | **1 Credit** | Script/Audio → AI Director + Vertical B-Roll | `FACELESS_VIDEO` |
| 5 | **Long Video Promo** | [`long-video-promo.md`](./long-video-promo.md) | **9:16 Only** | **Up to 90 Seconds (90s)** | **1 Credit** | Teaser Audio/Video → Kinetic Teaser Overlays | `LONG_VIDEO_PROMO` |

---

## 3. 🎙️ Utility Category

| # | Video Type | Spec File | Aspect Ratio | Max Duration | Credit Policy | Primary Pipeline Focus |
|---|---|---|:---:|:---:|:---:|---|
| 1 | **AI Studio Audio Cleaner** | [`audiocleaner.md`](./audiocleaner.md) | **Audio Utility** | **Up to 10 Minutes (10m)** | **1 Credit** | Raw Audio → Denoise, De-reverb, Loudness & Retakes |

---

## 4. Master Pipeline Error Handling & Fallback Architecture

| Failure Scenario | Video Types Affected | Detection Mechanism | Automated Fix & Fallback | Financial / Credit Protection |
| :--- | :--- | :--- | :--- | :--- |
| **Upload Network Interruption** | All Types | S3 multipart upload chunk timeout | Client-side chunk retry + direct S3 presigned URL upload bypasses server body limits. | Zero credits deducted. |
| **Media Duration Over Limit** | All Types | Browser metadata & server probe validation | Auto-clamps or rejects with clear feedback (Max 90s for Shorts, Max 10m for Long-form). | Zero credits deducted. |
| **Groq Whisper 429 / Downtime** | All Transcribed Types | Groq API error response status or timeout | **Automatic failover to Google Gemini 2.0 Flash (`asia-south1`)** to produce accurate word-level timestamps. | Render continues uninterrupted. |
| **No Speech Detected / Silent Audio** | `autoCaption`, `typographyVideo`, `facelessVideo`, `bookSummary` | Transcript payload empty array | Flags `NO_SPEECH_DETECTED`; prompts user to upload audio containing clear speech. | Full credit refunded via `releaseReservedRenderUsageFromServer`. |
| **AI Scene Planning JSON Malformed** | `facelessVideo`, `whiteboardVideo`, `imageToVideoAi` | Gemini JSON parsing error or timeout | Fallback to deterministic local sentence chunking with default pacing rules. | Render completes successfully. |
| **Asset / Visual Fetch Timeout** | `facelessVideo`, `compare`, `imageToVideoAi` | CDN 404 or image load error | Cascading fallback: Uploaded Media -> Curated Cloudinary Assets (`public/assets/reusable/`) -> Animated CSS Gradient Canvas. | Never crashes render; visually pleasing background applied. |
| **Remotion Lambda Render Crash** | All Rendered Types | AWS Lambda timeout / exit code != 0 | Clamped frame ranges (`frameRange: [0, totalFrames - 1]`) prevent OOM; on fatal crash, `jobs/route.ts` invokes automatic refund. | **100% Credit Auto-Refunded**. User shown 1-click retry. |
| **S3 Presigned URL Expired** | All Types | S3 SignatureExpired error (>48 hours) | `/api/reels/jobs/status` on-demand re-signs fresh download link. | User always receives valid download link. |

---

## Core Guidelines for All Video Types
1. **1080p Full HD Quality Standard**:
   - **All 9:16 Vertical Shorts**: Strictly **1080×1920 (1080p Full HD, 30 FPS MP4)**.
   - **All 16:9 Widescreen Videos**: Strictly **1920×1080 (1080p Full HD, 30 FPS MP4)**.
2. **Master Credit System**:
   - **16:9 Long-Form Videos (Up to 10m)**: **1 Min = 1 Credit** (1m=1 Cr, 5m=5 Cr, 10m=10 Cr).
   - **9:16 Short-Form Videos (Up to 90s)**: **1 Credit** per video.
   - **Long Video to Clips (`longVideoClips`)**: **2 Credits / Clip**.
   - **AI Audio Cleaner**: **1 Credit**.
3. **Audio Extraction First & Transcriber Fallback**:
   - Never send raw heavy video directly to Groq. Audio is extracted as 16kHz mono audio first.
   - **Primary**: Groq Whisper Cloud API (fast transcription).
   - **Mandatory Fallback**: Google Gemini 2.0 Flash (`asia-south1`) handles transcription if Groq fails or rate limits.

