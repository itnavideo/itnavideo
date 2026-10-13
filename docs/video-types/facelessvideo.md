# Faceless Video Generator (`facelessvideo.md`)

## 1. Overview & Purpose
**Faceless Video Generator** powers automated YouTube Cash Cow channels, storytelling accounts, and educational video niches. It turns voiceover audio narration (up to 12 minutes) into a complete 16:9 Full HD video complete with AI visual matching, Canva studio backgrounds, kinetic pan/zoom motion, background music auto-ducking, beat-matched sound effects, and word-synced subtitles.

---

## 2. Key Specifications & Limits

| Attribute | Specification |
| :--- | :--- |
| **Video Type ID** | `faceless-video` / `FACELESS_VIDEO` |
| **Composition ID** | `FACELESS-VIDEO` & `FACELESS-LONG-VIDEO` |
| **Template Location** | `remotion/templates/FACELESS_VIDEO/template.tsx` & `FACELESS_LONG_VIDEO` |
| **Dashboard Studio** | `components/dashboard/FacelessVideoStudio.tsx` |
| **Dashboard Route** | `/dashboard/faceless-video` |
| **Aspect Ratio** | **16:9 Widescreen Cinema Only** |
| **Resolution & Quality** | **1080p Full HD** (`1920×1080` @ 30 FPS MP4) |
| **Max Audio Duration** | **Up to 10 Minutes (600s)** |
| **Primary Category** | 16:9 Widescreen Long-Form |
| **Credit Cost** | **1 Min = 1 Credit** (1m=1, 5m=5, 10m=10 Cr) |
| **Design System** | Google Analytics Obsidian Baseline (`#070B14`, `#0E1526`) + Intentional Color & Typography Variety Policy + Material Design 3 |
| **Transcription Engine**| Extracted 16kHz audio → Groq Whisper Cloud API (Fallback: Google Gemini 2.0 Flash `asia-south1`) |
| **B-Roll Looping** | Seamless `<Loop durationInFrames={120}>` wrapping on all video assets (never freezes) |
| **Audio Ducking** | Dynamic BGM volume interpolation (0.13 during speech, smoothly swelling to 0.28 during >1.5s pauses) |

---

## 3. Simplified 5-Step Creator Dashboard Flow

The Faceless Video Studio implements a clean, icon-driven 5-step interface:

1. **1. Your Narration (Required)**:
   - 🎙️ Upload audio narration track (MP3, WAV, M4A up to 12 minutes).
2. **2. Image Source**:
  - Choose `Itnavideo Assets`, `User Uploaded Images`, or `Mix`.
  - Choose `Realistic`, `3D`, or `2D` images when Itnavideo Assets or Mix is selected.
  - `User Uploaded Images` uses only uploads. `Mix` places uploads at selected beats and fills remaining scenes from Itnavideo Assets.
  - Pexels is searched only for scenes without a suitable local image, and is never used in uploaded-only mode.
  - 📝 `Video Topic — Optional` field for contextual AI storytelling direction.
3. **3. Video Settings**:
   - **Visual Art Style**:
     - 📸 **Realistic Photo**: Real stock & photography
     - 🧊 **3D Render**: 3D Isometric & depth renders
     - 🎨 **2D Vector**: Clean vector illustrations & digital art
   - **Video Pacing Style**:
     - ✨ **Clean**: Minimal & modern
     - 🎬 **Cinematic**: Dramatic & editorial
     - 📜 **Documentary**: Storytelling style
     - ⚡ **Dynamic**: Fast-paced kinetic
4. **4. Audio**:
   - 🎵 **Background Music**: `ON/OFF` switch (*Music: Auto-Ducking*)
   - 🔊 **Sound Effects**: `ON/OFF` switch (*SFX: Auto-Timed*)
5. **5. AI Visuals & Generation**:
   - ✨ Summary card explaining automated visual, icon, and typography composition.
   - 🚀 **Generate Faceless Video** primary CTA with credit & processing time estimate.

---

## 4. Reusable Asset Storage & Catalog

| Asset Category | Local Path | Production Storage | Catalog Indexing |
| :--- | :--- | :--- | :--- |
| **2D Vector Images** | `public/assets/reusable/images/2d/` | AWS S3 / Cloudinary | Indexed via `npm run assets:index` |
| **3D Render Images** | `public/assets/reusable/images/3d/` | AWS S3 / Cloudinary | Indexed via `npm run assets:index` |
| **Realistic Photos** | `public/assets/reusable/images/realistic/` | AWS S3 / Cloudinary | Indexed via `npm run assets:index` |
| **Sound Effects (SFX)** | `public/assets/reusable/sfx/` | AWS S3 / Cloudinary | Indexed via `npm run assets:index` |
| **Studio Backgrounds** | `public/assets/reusable/backgrounds/` | AWS S3 / Cloudinary | Indexed via `npm run assets:index` |

---

## 5. Automated AI Backend Pipeline

```mermaid
graph TD
    A[Voiceover Narration Audio] --> B[Groq Whisper Speech Transcription]
    B --> C[Gemini AI Scene Director: Topic Beats & Visual Anchors]
    C --> D[Visual Asset Matcher: User Assets OR Curated 2D/3D/Realistic Library]
    D --> E[Kinetic Pan/Zoom & Parallax Motion Engine]
    E --> F[Automated BGM Music Ducking & Time-Synced SFX]
    F --> G[Render 1080p Widescreen MP4 on AWS Lambda]
```

  Pexels fallback uses the server-only `PEXELS_API_KEY` from `.env.local` (documented as an empty entry in `.env.example`). Searches are limited to 24 missing scenes per render and disabled in `User Uploaded Images` mode.

---

## 6. Remotion Composition Props

```typescript
export interface FacelessScene {
  id: string;
  startFrame: number;
  durationInFrames: number;
  videoUrl?: string;
  imageUrl?: string;
  visualArtStyle?: 'realistic' | '3d' | '2d';
  fallbackType?: 'typography' | 'gradient' | 'zoom-still';
  zoomMotion?: 'in' | 'out' | 'pan';
}

export interface FacelessVideoProps {
  audioUrl: string;
  musicUrl?: string;
  musicVolume?: number; // default 0.15
  enableSfx?: boolean;
  scenes: FacelessScene[];
  aspectRatio: '16:9' | '9:16';
  totalDurationInFrames: number;
  fps: number;
  subtitles?: {
    text: string;
    startFrame: number;
    endFrame: number;
  }[];
}
```

---

## 7. Pipeline Error Checklist & Auto-Fix Matrix

| Pipeline Stage | Potential Error / Failure | Root Cause | Automated Recovery / Fix | User-Facing Action / Feedback |
| :--- | :--- | :--- | :--- | :--- |
| **1. Upload & Media Validation** | `AUDIO_TOO_LONG` | Audio exceeds 12-15 minute limit | Backend preflight check halts early before consuming API calls or credits | Prompt user to trim audio under limit |
| **1. Upload & Media Validation** | `INVALID_MEDIA_TYPE` | Uploaded video instead of audio in audio-only mode | Auto-detect MIME type & extract 16kHz mono audio via ffmpeg cloud wrapper | Seamless audio extraction without throwing fatal error |
| **1. Upload & Media Validation** | `MISSING_USER_IMAGES` | User selected "User Uploaded Images" mode with 0 files | Client-side validation block on submit | Highlights file dropzone with "Upload at least 1 image" |
| **2. Transcription** | `GROQ_RATE_LIMIT_429` / `GROQ_DOWNTIME` | Groq Whisper API rate limit or outage | Automatic fallback to Google Gemini 2.0 Flash (`asia-south1`) | Transparent failover without user interruption |
| **2. Transcription** | `NO_SPEECH_DETECTED` | Audio is purely music, silence, or heavily distorted | Both Groq and Gemini return empty transcript | Display clear alert: "No clear speech detected. Please upload audio with clear spoken voice." |
| **3. AI Scene Direction** | `GEMINI_JSON_PARSE_ERROR` | LLM returns malformed JSON or truncated output | Fallback to deterministic local scene splitter (1 scene per sentence/beat) | Video generates with fallback uniform scene timing |
| **4. Asset Matching** | `PEXELS_EMPTY_OR_FAIL` | Stock image search returns 0 results or rate limited | Falls back to internal curated asset catalog (`public/assets/reusable/`) and gradient canvas | Scene renders with abstract animated canvas, never black screen |
| **4. Asset Matching** | `BROKEN_ASSET_URL` | Image URL 404 or S3 presign expired | Asset validation step checks head status before passing props to Remotion | Replaces broken asset with default category fallback image |
| **5. Remotion Render** | `LAMBDA_FRAME_TIMEOUT` | Long video (10m+) exceeds single worker timeout | Dynamic frame range chunking across parallel Lambda instances (`getOptimalFramesPerLambda`) | High-speed multi-threaded cloud rendering |
| **5. Remotion Render** | `FATAL_RENDER_ERROR` | Composition crash inside Lambda | Backend status route catches fatal error and executes `releaseReservedRenderUsageFromServer` | Reserved credits immediately refunded to user balance |
| **6. Output Delivery** | `DOWNLOAD_URL_EXPIRED` | User accesses download link after 48h lifecycle | Polling status route auto-renews S3 presigned URL on demand | Fresh download link generated instantly |

