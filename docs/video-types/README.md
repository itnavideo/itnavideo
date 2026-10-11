# Itnavideo — Video Types Master Registry (9 Unified Modes)

This directory contains the dedicated requirement, architecture, and pipeline specifications for all **9 active video types** in [Itnavideo](https://www.itnavideo.com).

As per **Rule 8 of `AGENTS.md` (Video Type Independence)**, each video type has distinct inputs, independent backend processing paths, and tailored UI steppers with dynamic 9:16 / 16:9 Aspect Ratio Pickers.

> [!IMPORTANT]
> ### 🚨 Mandatory Developer & AI Rule: "Check First, Update After"
> 1. **Before Starting Any Work**: Always open the specific `.md` file first (e.g. [`imagetovideoai.md`](./imagetovideoai.md) for Image to Video AI) to inspect its inputs, duration limits, Remotion composition props, and pipeline stages.
> 2. **After Making Any Changes**: Immediately update that specific `.md` file with the changes, new features, or updated props so code and documentation never drift.

---

## The 9 Live Video Types

| # | Video Type | Spec File | Aspect Ratio Support | Resolution & Quality | Max Duration | Primary Pipeline Focus | Remotion Composition ID |
|---|---|---|:---:|:---:|:---:|---|---|
| 1 | **Auto Caption Generator** | [`autocaption.md`](./autocaption.md) | 9:16 & 16:9 | **1080p Full HD** | **90s** (9:16) / **5m** (16:9) | Video/Audio → Kinetic Glowing Captions & Subtitles | `AUTO_CAPTION_GENERATOR` |
| 2 | **Faceless Video Generator** | [`facelessvideo.md`](./facelessvideo.md) | 9:16 & 16:9 | **1080p Full HD** | **90s** (9:16) / **5m** (16:9) | Script/Audio → AI Director + Stock B-Roll + Music | `FACELESS_VIDEO` |
| 3 | **Compare Explainer Video** | [`compareexplainer.md`](./compareexplainer.md) | 9:16 & 16:9 | **1080p Full HD** | **90s** (9:16) / **5m** (16:9) | 2 Images + Voiceover → Versus Split Screen & Stickers | `comparisonImages` |
| 4 | **Kinetic Typography Video** | [`typographyvideo.md`](./typographyvideo.md) | 9:16 & 16:9 | **1080p Full HD** | **90s** (9:16) / **5m** (16:9) | Voiceover → Kinetic Text Motion & Camera Pulses | `TYPOGRAPHY_VIDEO` |
| 5 | **Whiteboard Animation** | [`whiteboardvideo.md`](./whiteboardvideo.md) | 9:16 & 16:9 | **1080p Full HD** | **90s** (9:16) / **5m** (16:9) | Audio → AI Strategy Board Scenes & SVG Drawing | `WHITEBOARD_VIDEO` |
| 6 | **Long Video to Viral Clips** | [`longvideoclips.md`](./longvideoclips.md) | Input 16:9/9:16 -> Output 9:16 | **1080p Full HD** | **Input: Up to 2 Hours**<br/>**Output: 30s–60s Clips** | Long Video → Virality Hook Detection & 9:16 Reframe | `LONG_VIDEO_CLIPS` |
| 7 | **Book Summary Video** | [`booksummary.md`](./booksummary.md) | 9:16 & 16:9 | **1080p Full HD** | **90s** (9:16) / **5m** (16:9) | Book Quotes/Audio → Cinematic Chapter Visuals & Kinetic Notes | `BOOK_SUMMARY_VIDEO` |
| 8 | **AI Audio Cleaner & Studio** | [`audiocleaner.md`](./audiocleaner.md) | Audio Utility | **320kbps MP3 / WAV** | **Up to 5 Minutes** | Raw Audio → Denoise, De-reverb, Loudness & Retakes | Audio Mastering Engine |
| 9 | **Image to Video AI** | [`imagetovideoai.md`](./imagetovideoai.md) | 9:16 & 16:9 | **1080p Full HD** | **90s** (9:16) / **5m** (16:9) | Audio + Scene Images → Parallax & Subtitles | `IMAGE_TO_VIDEO_AI` |

---

## Core Guidelines for All Video Types
1. **1080p Full HD Quality Standard (Founder Directive)**:
   - **Every single video rendered on Itnavideo MUST be 1080p Full HD quality**:
     - **All 9:16 Vertical Videos**: Strictly **1080×1920 (1080p Full HD, 30 FPS MP4)**.
     - **All 16:9 Cinema / Widescreen Videos**: Strictly **1920×1080 (1080p Full HD, 30 FPS MP4)**.
   - Low-resolution exports (720p or lower) are strictly forbidden across all modes.
2. **Duration Standards (Founder Directive)**:
   - **All 9:16 Videos (TikTok, Shorts, Reels)**: Maximum duration **90 Seconds (90s)**.
   - **All 16:9 Videos (YouTube Long Videos)**: Maximum duration **5 Minutes (300 seconds)**.
   - **Long Video to Clips (`longvideoclips`)**: Accepts input up to **2 Hours (120 minutes)**, outputs multiple **30s–60s** viral clips based on user selection. Full video is never rendered.
3. **Audio Extraction First & Transcriber Fallback**:
   - Never send raw heavy video directly to Groq. Audio is extracted as 16kHz mono audio first.
   - **Primary**: Groq Whisper Cloud API (fast transcription).
   - **Mandatory Fallback**: Google Gemini 2.0 Flash (`asia-south1`) handles transcription if Groq fails or rate limits.
4. **Zero Local Heavy Compute**: Local machines (4GB RAM) must never run rendering or heavy media processing. Rendering is handled exclusively by AWS Remotion Lambda in Mumbai (`us-east-1`).
5. **Intentional Harmony & Visual Variety**: All dashboard studios maintain cohesive layout structure and Material Design 3 (M3) container specs (`#070B14`, `#0E1526`, `border-white/10`) while supporting vibrant, feature-specific color accents (GA Orange `#FF6D00`, Emerald Tech `#10B981`, Corporate Blue `#3B82F6`, Cyber Gold `#FFD700`, Impact Red `#EF4444`, Neon Mint `#00F5D4`) and rich Google Fonts choices (`Plus Jakarta Sans`, `Montserrat`, `Impact`, `Bebas Neue`, `Komika Axis`, `Fraunces`, `Inter`) to prevent visual monotony and keep creators engaged.
6. **Dedicated Steppers**: No video type should ever display irrelevant pipeline steps (e.g., auto-caption must never show "Matching assets", and long video promo must never show "Transcribing speech").
7. **Modern Rendering Engine**: Every video type uses the unified `InteractiveRenderEngine` featuring animated `BorderBeam` glow, `AudioSpectrumVisualizer` neural waveforms, live elapsed/remaining countdown timers, and zero blue artifacts.

