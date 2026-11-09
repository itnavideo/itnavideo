# Itnavideo — Video Types Master Registry (14 Active Studios)

This directory contains the dedicated requirement, architecture, and pipeline specifications for all **14 active video studios** in [Itnavideo](https://www.itnavideo.com).

As per **Rule 8 of `AGENTS.md` (Video Type Independence)** and the **Founder Master Directive**, video types are strictly categorized into **5 Studios for 16:9 Cinema Long-Form**, **8 Studios for 9:16 Vertical Shorts & Viral Clips**, and **1 Studio for Audio Utility**.

---

## 1. 🎬 16:9 Widescreen Long-Form Category (6 Studios — Strictly 16:9 Only — Up to 5 Minutes)

| # | Video Type | Directory & Spec | Aspect Ratio | Max Duration | Credit Policy | Primary Pipeline Focus | Remotion Composition ID |
|---|---|---|:---:|:---:|:---:|---|---|
| 0 | **AI Video Generator (Flagship)** | [`aivideogenerator.md`](./aivideogenerator.md) | **16:9 Only** | **Up to 5 Min (300s)** | **1 Min = 1 Credit** (1m=1, 5m=5) | Creative Launchpad (Prompt + Optional Assets) → AI Director → CapCut-Style Multitrack Timeline & Free Edit → 1080p Cloud Render | `AI_VIDEO_GENERATOR` |
| 1 | **Faceless Video (Long-Form)** | [`01-faceless-video/`](./01-faceless-video/README.md) · [`facelessvideo.md`](./facelessvideo.md) | **16:9 Only** | **Up to 5 Min (300s)** | **1 Min = 1 Credit** (1m=1, 5m=5) | Script/Audio → transcript-grounded AI planning and animated SVG diagrams/charts with music | `FACELESS_VIDEO` |
| 2 | **Book Summary Video** | [`booksummary.md`](./booksummary.md) | **16:9 Only** | **Up to 5 Min (300s)** | **1 Min = 1 Credit** (1m=1, 5m=5) | Book Quotes/Audio → Cinematic Chapter Visuals | `BOOK_SUMMARY_VIDEO` |
| 3 | **Image to Video AI** | [`03-image-to-video-ai/`](./03-image-to-video-ai/README.md) · [`imagetovideoai.md`](./imagetovideoai.md) | **16:9 Only** | **Up to 5 Min (300s)** | **1 Min = 1 Credit** (1m=1, 5m=5) | Audio + Scene Images → Ken Burns Motion, 32 Caption Styles & Subtitle Sync | `IMAGE_TO_VIDEO_AI` |
| 4 | **YouTube Subtitles Generator** | [`04-youtube-subtitles/`](./04-youtube-subtitles/README.md) · [`youtubesubtitles.md`](./youtubesubtitles.md) | **16:9 Only** | **Up to 5 Min (300s)** | **1 Min = 1 Credit** (1m=1, 5m=5) | Video/Audio → High-Contrast Spoken Captions | `AUTO_CAPTION_GENERATOR` |
| 5 | **AI YouTube Video Polisher** | [`12-ai-video-polisher/`](./12-ai-video-polisher/README.md) · [`ai-video-polisher.md`](./ai-video-polisher.md) | **16:9 Only** | **Up to 5 Min (300s)** | **1 Min = 1 Credit** (1m=1, 5m=5) | Video/Multi-Take Shoot → Silence Jump-Cuts, +12% Dynamic Punch-In & PIP Overlay | `AI_VIDEO_POLISHER` |

---

## 2. 📱 9:16 Vertical Short-Form Category (8 Studios — Strictly 9:16 Only — Up to 90 Seconds / Clips)

| # | Video Type | Directory & Spec | Aspect Ratio | Max Duration | Credit Policy | Primary Pipeline Focus | Remotion Composition ID |
|---|---|---|:---:|:---:|:---:|---|---|
| 1 | **Auto Caption Reel** | [`autocaption.md`](./autocaption.md) | **9:16 Only** | **Up to 90 Seconds (90s)** | **1 Credit** | Video/Audio → Kinetic Glowing Captions & Subtitles | `AUTO_CAPTION_GENERATOR` |
| 2 | **Compare Explainer** | [`07-compare-explainer/`](./07-compare-explainer/README.md) · [`compare-explainer.md`](./compare-explainer.md) | **9:16 Only** | **Up to 90 Seconds (90s)** | **1 Credit** | Voiceover + 2 Images → VS Battle Arena & Product Comparison | `COMPARE_EXPLAINER` |
| 3 | **Whiteboard Animation** | [`09-whiteboard-video/`](./09-whiteboard-video/README.md) · [`whiteboard-video.md`](./whiteboard-video.md) | **9:16 Only** | **Up to 90 Seconds (90s)** | **1 Credit** | Audio → AI Strategy Board Scenes & SVG Drawing | `WHITEBOARD_VIDEO` |
| 4 | **Long Video Promo** | [`10-long-video-promo/`](./10-long-video-promo/README.md) · [`long-video-promo.md`](./long-video-promo.md) | **9:16 Only** | **Up to 90 Seconds (90s)** | **1 Credit** | Teaser Audio/Video → Kinetic Teaser Overlays | `LONG_VIDEO_PROMO` |
| 5 | **Faceless Shorts (Vertical)** | [`faceless-shorts.md`](./faceless-shorts.md) | **9:16 Only** | **Up to 90 Seconds (90s)** | **1 Credit** | Voiceover → 16-Specialist Production Crew (500+ SVGs, 538 S3 Images, 32 Captions, Brand Kits, Voice Isolation) → 1080p Cloud Render (Separate from 16:9 Faceless Video) | `FACELESS_SHORTS` |
| 6 | **AI Shorts Polisher** | [`13-ai-shorts-polisher/`](./13-ai-shorts-polisher/README.md) · [`ai-shorts-polisher.md`](./ai-shorts-polisher.md) | **9:16 Only** | **Up to 90 Seconds (90s)** | **1 Credit** | Smartphone Video/Shoot → Silence Jump-Cuts, +12% Dynamic Punch-In & PIP Overlay | `AI-SHORTS-POLISHER` |
| 7 | **Split-Screen Explainer** | [`split-screen-explainer.md`](./split-screen-explainer.md) | **9:16 Only** | **Up to 90 Seconds (90s)** | **1 Credit** | 50/50 Dual Zone (Top: cycling visual assets, Bottom: creator talking head) → Dynamic zoom pulses & glowing captions | `SPLIT-SCREEN-EXPLAINER` |
| 8 | **Long Video to Shorts Clips** | [`05-long-video-to-shorts/`](./05-long-video-to-shorts/README.md) · [`longvideoclips.md`](./longvideoclips.md) | Input 16:9/9:16 -> Output 9:16 | **Input: Up to 2 Hours**<br/>**Output: 30s–60s Clips** | **1 Credit / Clip** | Long Video → Virality Hook Detection & 9:16 Reframe | `LONG_VIDEO_CLIPS` |

---

## 3. 🎙️ Utility Category (1 Studio)

| # | Video Type | Directory & Spec | Aspect Ratio | Max Duration | Credit Policy | Primary Pipeline Focus |
|---|---|---|:---:|:---:|:---:|---|
| 1 | **AI Studio Audio Cleaner** | [`11-ai-audio-cleaner/`](./11-ai-audio-cleaner/README.md) · [`audiocleaner.md`](./audiocleaner.md) | **Audio Utility** | **Up to 5 Minutes (5m)** | **1 Credit** | Raw Audio → Denoise, De-reverb, Loudness & Retakes |

---

## 4. Master Pipeline Error Handling & Fallback Architecture

| Failure Scenario | Video Types Affected | Detection Mechanism | Automated Fix & Fallback | Financial / Credit Protection |
| :--- | :--- | :--- | :--- | :--- |
| **Upload Network Interruption** | All Types | S3 multipart upload chunk timeout | Client-side chunk retry + direct S3 presigned URL upload bypasses server body limits. | Zero credits deducted. |
| **Media Duration Over Limit** | All Types | Browser metadata & server probe validation | Auto-clamps or rejects with clear feedback (Max 90s for Shorts, Max 5m for 16:9 Long-form). | Zero credits deducted. |
| **Groq Whisper 429 / Downtime** | All Transcribed Types | Groq API error response status or timeout | **Automatic failover to Google Gemini 2.0 Flash (`asia-south1`)** to produce accurate word-level timestamps. | Render continues uninterrupted. |
| **No Speech Detected / Silent Audio** | `autoCaption`, `facelessVideo`, `bookSummary` | Transcript payload empty array | Flags `NO_SPEECH_DETECTED`; prompts user to upload audio containing clear speech. | Full credit refunded via `releaseReservedRenderUsageFromServer`. |
| **AI Scene Planning JSON Malformed** | `facelessVideo`, `whiteboardVideo`, `imageToVideoAi` | Gemini JSON parsing error or timeout | Faceless Video uses a validated deterministic SVG fallback. Other modes use their mode-specific scene-planning fallback. | Render completes successfully. |
| **Asset / Visual Fetch Timeout** | Compare and Image to Video AI modes | CDN 404 or image load error | Faceless Video does not fetch scene media while its image pause is active. Other affected modes use their configured visual fallback. | Never crashes render. |
| **Remotion Lambda Render Crash** | All Rendered Types | AWS Lambda timeout / exit code != 0 | Clamped frame ranges (`frameRange: [0, totalFrames - 1]`) prevent OOM; on fatal crash, `jobs/route.ts` invokes automatic refund. | **100% Credit Auto-Refunded**. User shown 1-click retry. |
| **S3 Presigned URL Expired** | All Types | S3 SignatureExpired error (>48 hours) | `/api/reels/jobs/status` on-demand re-signs fresh download link. | User always receives valid download link. |

---

## Core Guidelines for All Video Types
1. **1080p Full HD Quality Standard**:
   - **All 9:16 Vertical Shorts**: Strictly **1080×1920 (1080p Full HD, 30 FPS MP4)**.
   - **All 16:9 Widescreen Videos**: Strictly **1920×1080 (1080p Full HD, 30 FPS MP4)**.
2. **Master Credit System**:
   - **16:9 Long-Form Videos (Up to 5m)**: **1 Min = 1 Credit** (1m=1 Cr, 5m=5 Cr).
   - **9:16 Short-Form Videos (Up to 90s)**: **1 Credit** per video.
   - **Long Video to Clips (`longVideoClips`)**: **1 Credit / Clip**.
   - **AI Audio Cleaner**: **1 Credit**.
3. **Audio Extraction First & Transcriber Fallback**:
   - Never send raw heavy video directly to Groq. Audio is extracted as 16kHz mono audio first.
   - **Primary**: Groq Whisper Cloud API (fast transcription).
   - **Mandatory Fallback**: Google Gemini 2.0 Flash (`asia-south1`) handles transcription if Groq fails or rate limits.
4. **Compulsory Scene JSON Standard Across All Video Types**:
   - Every active video type in Itnavideo enforces a structured `scenes` JSON array.
   - Every beat of speech or timeline duration belongs to an explicit scene with exact start/end seconds, role/stage, layout elements, and narrative text.
   - Eliminates video render crashes and guarantees predictable timeline rendering.
5. **Dedicated Internal Components (No Generic Visual Reuse)**:
   - Every video type must build its own dedicated Remotion visual `.tsx` components (cards, title banners, scene layouts, overlays) inside its own template folder (`remotion/templates/TEMPLATE_NAME/components/` or within its template file).
   - Reusing a single generic visual component across different video types is strictly forbidden to prevent visual fatigue and keep videos fresh and distinct for creators.
6. **Bhide Composition Inspector ("Ekmev Secretary" for Lambda Renders)**:
   - Before dispatching any render to AWS Lambda, `lib/inspector/bhideCompositionInspector.ts` audits and auto-fixes the composition props.
   - Guarantees: Track A1 Voiceover, Track A2 Sound Effects (tactile pops/whooshes), Track A3 Background Music (auto-ducked to 0.12), safe-zone margins, and high-retention default styles so no video renders blank or silent.
