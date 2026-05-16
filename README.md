# Itnavideo

> Create a 1080p short from either a voiceover or a face-camera video.

Itnavideo is a focused AI video platform for Reels, TikTok, and YouTube Shorts. The current product has two creator flows:

- **Faceless video:** upload one required voiceover; screenshots, images, and clips are optional.
- **Face camera video:** upload one talking-head/camera video; Itnavideo crops, polishes audio, adds motion/effects, and exports a short.

The app uses **Supabase** for authentication, project metadata, render job status, waitlist, and newsletter storage. Firebase/Firestore has been removed from the active product path.

Final media is stored in **Cloudinary**. Groq Whisper transcription runs through Next.js API routes before AI planning. Long FFmpeg rendering runs on the dedicated Render worker, where a Python-assisted render planner now generates richer FFmpeg filter graphs for faster delivery and better text/audio effects.

The AI planning layer keeps **separate instructions** for the two modes:

- Faceless video mode focuses on voiceover timing, images, video clips, screenshots, text cards, b-roll, icons, captions, and SFX.
- Face camera mode keeps the speaker video as the main anchor and focuses on mistake cuts, reframing, captions, icons, callouts, subtle SFX, and audio polish.

Canva, 4K exports, long-form videos, teams, and advanced asset workflows remain future work. The current product should stay simple until short-form 1080p delivery is reliable.

---

## Active Product Flow

```text
User signs in with Supabase
        ↓
Chooses Faceless video or Face camera video
        ↓
Faceless: uploads required audio and optional visuals
Face camera: uploads one camera video
        ↓
Cloudinary stores user uploads
        ↓
Vercel creates Supabase project/job metadata
        ↓
Faceless: Vercel transcribes with Groq, creates AI timeline, and sends render order to Render backend
Face camera: API runs shorts edit pipeline and uploads the final MP4
        ↓
Render backend runs Python-assisted FFmpeg planning/rendering
        ↓
Final MP4 is uploaded to Cloudinary
        ↓
Supabase is updated with final status and videoUrl
        ↓
Dashboard/Videos page show live status
```

Supported output today:

- 9:16 portrait video
- 1080p MP4 only
- Reels, TikTok, and YouTube Shorts ready
- Faceless workflow with required voiceover and optional media
- Face camera workflow with required video upload

Not active today:

- 4K export
- Long-form generation
- Canva-based generation
- Firebase
- Local Vercel FFmpeg rendering
- AWS S3 storage

---

## Architecture

### Vercel

Vercel hosts the Next.js app and lightweight API orchestration.

Responsibilities:

- Public website
- Login/signup
- Dashboard
- Upload UI
- Cloudinary upload endpoints
- Groq-first transcription endpoint and SRT/JSON output
- AI planning and timeline endpoints
- Supabase project and job creation
- Dispatching render jobs to Render

Vercel must not run long FFmpeg jobs. The route [app/api/render/route.ts](app/api/render/route.ts) only sends an order to the dedicated Render worker and returns quickly.

### Render Backend

Render runs the long-lived Node/Express worker for FFmpeg. The worker can call a Python render planner before executing FFmpeg, which keeps render execution native while making advanced text, caption, color, and audio effects easier to evolve.

Entry point:

```bash
npm run render-worker
```

Worker files:

- [render-worker/server.mjs](render-worker/server.mjs)
- [render-worker/ffmpegRenderer.mjs](render-worker/ffmpegRenderer.mjs)
- [render-worker/pythonRendererBridge.mjs](render-worker/pythonRendererBridge.mjs)
- [render-worker/python_renderer.py](render-worker/python_renderer.py)
- [render-worker/python_talking_head_engine.py](render-worker/python_talking_head_engine.py)
- [render-worker/requirements.txt](render-worker/requirements.txt)
- [services/ai/videoModeInstructions.ts](services/ai/videoModeInstructions.ts)

Responsibilities:

- Accept `POST /api/process-video`
- Return `202` immediately
- Download timeline assets and voiceover to `/tmp`
- Build Python-assisted FFmpeg filter graphs for animated text, captions, color grade, and audio polish
- Run FFmpeg with the bundled `ffmpeg-static` binary unless `FFMPEG_PATH` is configured
- Upload final MP4 to Cloudinary
- Update Supabase project status and `videoUrl`
- Clean temporary render output

### Supabase

Supabase handles auth and lightweight product data:

- Email/password login and signup
- Google OAuth
- Password reset emails
- User project metadata
- FFmpeg job status sync
- Waitlist/newsletter leads

Firebase/Firestore is not part of the active stack anymore.

### Cloudinary

Cloudinary stores media:

- Voiceover uploads
- Face-camera source uploads
- Optional user screenshots, images, and clips
- Final rendered MP4 files

### Groq Transcription

Groq is the primary speech-to-text provider. The app sends audio/video files to Groq's OpenAI-compatible Whisper endpoint using `whisper-large-v3-turbo` by default, then converts `verbose_json` timestamps into app subtitles and optional SRT output.

Active files:

- [services/ai/voiceAnalysis.ts](services/ai/voiceAnalysis.ts)
- [app/api/transcribe/route.ts](app/api/transcribe/route.ts)
- [app/api/timeline/route.ts](app/api/timeline/route.ts)
- [app/api/jobs/start/route.ts](app/api/jobs/start/route.ts)

Provider order:

1. `GROQ_API_KEY` for Groq Whisper transcription.
2. `OPENAI_API_KEY` for OpenAI transcription fallback.
3. Gemini audio transcription only when no Groq/OpenAI transcription key is configured.

Standalone subtitle endpoint:

```bash
POST /api/transcribe
Content-Type: multipart/form-data
file=<audio-or-video-file>
```

Response:

```json
{
  "success": true,
  "subtitles": "1\n00:00:00,000 --> 00:00:02,500\n...",
  "transcription": {
    "text": "...",
    "segments": [],
    "words": []
  }
}
```

### Google Drive And Local Assets

Google Drive/internal reusable assets and `public/asset-library` are fallback asset sources for the AI/render pipeline. They are not the main user upload store.

---

## Current Status

| Area | Status | Notes |
|---|---|---|
| Auth | Completed | Email/password and Google sign-in via Supabase Auth. |
| Dashboard | Completed | Two creation paths after login: faceless video and face camera video. |
| Upload | Completed | Voiceover, optional visuals, and face-camera video uploads through Cloudinary. |
| Supabase projects | Completed | Project metadata and status updates in Postgres. |
| Videos page | Completed | Supabase-backed project library. |
| Waitlist | Completed | Supabase-backed waitlist form. |
| Groq transcription | Completed | Groq-first Whisper transcription with OpenAI fallback and SRT output route. |
| AI timeline | In Process | Voice analysis, script planning, scene/caption timeline. |
| Render dispatch | Completed | Vercel sends orders to Render backend. |
| Render worker | In Process | Express worker exists with Python-assisted FFmpeg planner; production runtime testing required on Render. |
| Python render planner | Completed | Generates advanced FFmpeg filters for text animation, captions, grading, and voice polish. |
| Separate AI mode instructions | Completed | Faceless and face-camera planning use different instruction sets. |
| 1080p FFmpeg output | In Process | Active output target for both workflows. |
| Cloudinary render delivery | In Process | Render worker and face-video route upload final MP4 to Cloudinary. |
| Admin panel | In Process | Founder operations pages exist. |
| Billing | Pending | Pricing exists; Stripe production billing is not active. |
| Face camera video | In Process | Upload route processes talking-head/camera clips into Shorts-ready MP4. |
| Canva | Paused | Legacy integration only; not part of the active product. |
| Long-form video | Pending | Waitlist/roadmap item. |
| 4K export | Not planned for MVP | Keep 1080p only until core flow is stable. |

---

## Tech Stack

### Frontend

- Next.js 16 App Router
- React 19
- Tailwind CSS 4
- Framer Motion
- Lucide React icons
- Sonner toasts

### Backend

- Next.js route handlers on Vercel
- Express worker on Render
- Supabase Auth
- Supabase Postgres
- Cloudinary
- Groq Whisper transcription, with OpenAI fallback
- Gemini/OpenAI text planning services
- FFmpeg on Render
- Python 3.12 on the render worker
- `ffmpeg-python`, `moviepy`, `numpy`, and `Pillow` for backend render tooling

### Active Render Path

- Vercel route: [app/api/render/route.ts](app/api/render/route.ts)
- Render worker: [render-worker/server.mjs](render-worker/server.mjs)
- Render FFmpeg module: [render-worker/ffmpegRenderer.mjs](render-worker/ffmpegRenderer.mjs)
- Python render bridge: [render-worker/pythonRendererBridge.mjs](render-worker/pythonRendererBridge.mjs)
- Python render planner: [render-worker/python_renderer.py](render-worker/python_renderer.py)
- Python talking-head engine blueprint: [render-worker/python_talking_head_engine.py](render-worker/python_talking_head_engine.py)
- Job metadata helper: [services/supabase/projectStore.ts](services/supabase/projectStore.ts)

Older rendering service files under `services/rendering/` may still exist for compatibility and future refactor work, but Vercel should not execute FFmpeg in production.

---

## Environment Variables

### Vercel

```bash
# Supabase auth + server writes
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# AI
GROQ_API_KEY=
GROQ_TRANSCRIBE_MODEL=whisper-large-v3-turbo
GROQ_TRANSCRIPTION_TIMEOUT_MS=30000
GEMINI_API_KEY=
GEMINI_MODEL=
GEMINI_TIMEOUT_MS=
GEMINI_AUDIO_FETCH_TIMEOUT_MS=
OPENAI_API_KEY=
OPENAI_TEXT_MODEL=
OPENAI_TRANSCRIBE_MODEL=
OPENAI_TRANSCRIPTION_TIMEOUT_MS=
VOICEOVER_FETCH_TIMEOUT_MS=

# Cloudinary upload endpoint
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
CLOUDINARY_UPLOAD_TIMEOUT_MS=

# Render worker dispatch
RENDER_BACKEND_URL=https://your-render-service.onrender.com
RENDER_WORKER_SECRET=

# Optional public alias used by dashboard polling/links
NEXT_PUBLIC_RENDER_BACKEND_URL=
```

### Render Backend

```bash
# Server
PORT=10000
RENDER_WORKER_SECRET=

# Supabase project/job writes
NEXT_PUBLIC_SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=

# Cloudinary final MP4 upload
CLOUDINARY_URL=
CLOUDINARY_RENDERS_FOLDER=itnavideo/renders

# FFmpeg
# Optional. Leave blank to use the bundled ffmpeg-static binary.
FFMPEG_PATH=
FFMPEG_PRESET=superfast
RENDER_TIMEOUT_MS=900000
ASSET_FETCH_TIMEOUT_MS=60000

# Python-assisted render planning
# Optional. Leave blank to auto-detect Python 3.12/user install.
PYTHON_PATH=
# Set to 0 to skip Python full render and use Node FFmpeg execution.
PYTHON_FULL_RENDER=1
# Set to 1 if Python full render must succeed instead of falling back to Node FFmpeg execution.
PYTHON_FULL_RENDER_REQUIRED=0
# Set to 0 to force the legacy Node filter builder for filter graph planning.
PYTHON_RENDER_ENGINE=1
# Set to 1 if Render should fail instead of falling back to Node filters.
PYTHON_RENDERER_REQUIRED=0

# Face-camera jump cuts
# Set to 0 to disable Python silence/filler jump-cut preprocessing.
FACE_VIDEO_JUMP_CUTS=1
FACE_VIDEO_MIN_SILENCE_SECONDS=0.5
FACE_VIDEO_SILENCE_THRESHOLD_DB=-38dB
FACE_VIDEO_SILENCE_PADDING_SECONDS=0.08
FACE_VIDEO_MAX_SILENCE_CUT_SECONDS=4
FACE_VIDEO_JUMP_CUT_TIMEOUT_MS=900000

# Face-camera zoom/SFX effects
# Set to 0 to disable sentence/key-point zoom pulses.
FACE_VIDEO_ZOOM_EFFECTS=1
FACE_VIDEO_ZOOM_INTERVAL_SECONDS=4
FACE_VIDEO_ZOOM_EVENT_DURATION_SECONDS=0.55
FACE_VIDEO_ZOOM_SCALE=1.12
FACE_VIDEO_SWOOSH_VOLUME=0.22
# Optional. If blank, the renderer auto-picks a swoosh/whoosh file from assets_library/sound_effects.
FACE_VIDEO_SWOOSH_PATH=

# Face-camera big subtitles/icons
# Set to 0 to disable word-pop subtitles and keyword icon overlays.
FACE_VIDEO_CAPTION_EFFECTS=1
FACE_VIDEO_CAPTION_FONT_SIZE=76
FACE_VIDEO_MAX_CAPTION_EVENTS=80
FACE_VIDEO_ICON_SIZE=132
FACE_VIDEO_MAX_ICON_EVENTS=12
FACE_VIDEO_ICON_MIN_SPACING_SECONDS=2.4
```

---

## Development

Install dependencies:

```bash
npm install
```

Install Python render-worker libraries:

```bash
python -m pip install -r render-worker/requirements.txt
```

Run the Next.js app:

```bash
npm run dev
```

Run the Render worker locally:

```bash
npm run render-worker
```

Build check:

```bash
npm run build
```

Windows verification command used in this workspace:

```bash
npm.cmd run build
```

---

## Deployment Checklist

### GitHub

- Push the same monorepo to GitHub.
- Vercel and Render should both deploy from this repo.
- Keep `render-worker/`, `services/`, `app/`, `pages/`, `supabase/`, and `package-lock.json` committed together so the web app and worker stay compatible.

### Vercel

Vercel runs the Next.js product only:

- Website and public pages
- Auth screens
- Dashboard and videos page
- Upload APIs
- AI planning APIs
- Render dispatch to Render

Required Vercel env groups:

- Supabase: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- Cloudinary upload: `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
- Transcription: `GROQ_API_KEY`, optional `GROQ_TRANSCRIBE_MODEL`, optional OpenAI fallback keys
- AI planning: `GEMINI_API_KEY` and/or `OPENAI_API_KEY`
- Render dispatch: `RENDER_BACKEND_URL`, `RENDER_WORKER_SECRET`

Do not run long FFmpeg jobs on Vercel.

### Render

Render runs the worker:

```bash
npm run render-worker
```

Recommended Render settings:

- Runtime: Node.js with Python 3 available.
- Build command: `npm install && python -m pip install -r render-worker/requirements.txt`
- Start command: `npm run render-worker`
- Persistent disk or temp workspace: set `RENDER_WORKSPACE_DIR` when available.

Required Render env groups:

- Supabase server writes: `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`
- Cloudinary final uploads: `CLOUDINARY_URL` or `CLOUDINARY_CLOUD_NAME/API_KEY/API_SECRET`
- Worker auth: `RENDER_WORKER_SECRET`
- Python/FFmpeg: `PYTHON_FULL_RENDER=1`, optional `PYTHON_PATH`, optional `FFMPEG_PATH`

### Python

Install render libraries wherever video rendering runs:

```bash
python -m pip install -r render-worker/requirements.txt
```

Python files used by the render stack:

- `render-worker/python_renderer.py`
- `render-worker/python_talking_head_engine.py`
- `render-worker/python_jump_cutter.py`

### Next.js

Before deploying:

```bash
npm run build
```

The app is on Next.js 16, so check `node_modules/next/dist/docs/` before changing framework APIs or route conventions.

---

## Project Structure

```text
itnavideo/
├── raw_assets/
│   ├── user_videos/
│   ├── user_audios/
│   └── user_images/
├── processed_assets/
│   ├── transcriptions/
│   ├── audio_cuts/
│   ├── overlays/
│   ├── cache/
│   └── python_bridge/
├── assets_library/
│   ├── fonts/
│   ├── icons/
│   └── sound_effects/
├── final_output/
├── app/
│   ├── api/
│   │   ├── jobs/start/
│   │   ├── render/
│   │   ├── timeline/
│   │   ├── transcribe/
│   │   └── upload/
│   ├── dashboard/
│   ├── login/
│   ├── signup/
│   ├── upload/
│   └── videos/
├── components/
│   ├── auth/
│   ├── brand/
│   ├── dashboard/
│   ├── landing/
│   └── ui/
├── render-worker/
│   ├── server.mjs
│   ├── ffmpegRenderer.mjs
│   ├── pythonRendererBridge.mjs
│   ├── python_renderer.py
│   ├── python_talking_head_engine.py
│   └── requirements.txt
├── services/
│   ├── ai/
│   ├── assets/
│   ├── supabase/
│   └── rendering/
├── public/
│   ├── asset-library/
│   └── mode-cards/
├── supabase/
├── next.config.mjs
└── README.md
```

Runtime note: production workers should set `RENDER_WORKSPACE_DIR` when a persistent or mounted workspace is available. If it is not set, the worker creates the same structure under the system temp directory.

Folder responsibilities:

- `raw_assets/user_videos`: raw face-camera videos and downloaded source clips.
- `raw_assets/user_audios`: uploaded voiceovers and downloaded narration/audio.
- `raw_assets/user_images`: screenshots, images, thumbnails, and visual stills.
- `processed_assets/transcriptions`: Gemini/Whisper JSON transcripts and timestamps.
- `processed_assets/audio_cuts`: jump-cut intermediate files after silence/mistake removal.
- `processed_assets/overlays`: generated subtitles, icons, callouts, and overlay assets.
- `processed_assets/cache`: temporary downloaded files that do not fit a raw category.
- `processed_assets/python_bridge`: JSON request/response files exchanged with the Python renderer.
- `assets_library/fonts`: permanent fonts for dynamic text rendering.
- `assets_library/icons`: permanent icons and graphics. Keyword overlays auto-match filenames such as `money.png`, `dollar.png`, `warning.png`, `idea.png`, or `clock.png`.
- `assets_library/sound_effects`: permanent swoosh, pop, impact, and transition sounds. Face-camera zoom effects auto-use files named like `swoosh.wav`, `whoosh.mp3`, or `transition.m4a`.
- `final_output`: finished local MP4 render before Cloudinary upload.

---

## Product Rules

- Keep the MVP centered on short-form 1080p delivery.
- Keep two simple creation paths: faceless voiceover videos and face-camera edits.
- Keep output at 1080p until the core render path is reliable.
- Keep Supabase for auth, project metadata, job status, and lightweight leads.
- Keep user media and rendered videos in Cloudinary.
- Keep FFmpeg on Render, not Vercel.
- Use Python only on backend/render-worker paths for render planning and video tooling.
- Do not reintroduce Canva, 4K, or long-form flows into the main UI until the short-form workflow is stable.
- Prefer a completed playable MP4 over a complex render that fails.

---

## Roadmap

### Phase 1: Short-Form MVP

- [x] Auth
- [x] Dashboard
- [x] Faceless video mode
- [x] Voiceover upload
- [x] Optional visual upload
- [x] Cloudinary upload endpoint
- [x] Supabase project metadata
- [x] AI timeline generation
- [x] Vercel-to-Render render dispatch
- [x] Render worker scaffold
- [x] Python render planner scaffold
- [x] Face camera upload/edit route
- [ ] Confirm Render production env and FFmpeg runtime
- [ ] Confirm Supabase final status updates from Render
- [ ] Confirm Cloudinary final MP4 upload from Render
- [ ] Improve render progress accuracy
- [ ] Improve timeline quality and caption polish

### Phase 2: Creator Beta

- [ ] Usage limits
- [ ] Stripe billing
- [ ] Better video asset matching
- [ ] Caption style upgrades
- [ ] Face camera caption/transcript upgrades
- [ ] Semantic SFX/music mixing in production renders
- [ ] Faster preview mode
- [ ] Admin render monitoring

### Phase 3: Scale

- [ ] Durable queue for render jobs
- [ ] Redis/queue-backed job state if needed
- [ ] AWS S3 storage after growth
- [ ] Team workspaces
- [ ] Long-form video generation
- [ ] API access

---

## Contact

- Website: `itnavideo.com`
- Email: `hello@itnavideo.com`

---

MIT License © 2026 Itnavideo
