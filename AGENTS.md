<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Itnavideo — Master Agent Rules

This is the **single source of truth** for all AI tools (Antigravity, Codex, Kiro, Cursor). All instructions, policies, and workflows are consolidated here.

---

## 0. STRICT: Zero Local Heavy Compute Policy (4GB RAM / HDD Machine Rule)

> [!CAUTION]
> **Host Environment**: The developer laptop has **4GB RAM and a mechanical HDD (No SSD)**. 
> Heavy local processing, local rendering, or memory-heavy node processes WILL cause severe disk paging (thrashing) and completely freeze/lock up the laptop.

### ABSOLUTELY FORBIDDEN on Local Machine:
- ❌ **NO Local Remotion Rendering**: Never run `npm run reel:render`, `npx remotion render`, or any local Chromium/headless browser render jobs.
- ❌ **NO Local Heavy Media / FFmpeg Jobs**: No local transcoding, heavy local audio filters, or batch media conversions.
- ❌ **NO Local AI / ML Models**: No running Whisper or LLMs on the local machine.
- ❌ **NO Unchecked Background Daemons**: Do not spin up `remotion studio` or memory-heavy dev watchers unless explicitly requested by the user.

### MANDATORY Cloud-Only Pipeline:
- ☁️ **Rendering Engine**: AWS Lambda (Remotion).
- ☁️ **Transcription**: Groq Whisper Cloud API (ultra-fast, cloud-based).
- ☁️ **AI Planning / Vision**: Google Cloud strictly for AI APIs (Gemini/Vertex AI).
- ☁️ **Storage & Assets (Renders)**: AWS S3.
- ☁️ **Website Images & Demo Videos**: Cloudinary.
- ☁️ **Deployments**: AWS. Google Cloud is no longer used for hosting web/renders.

### PERMITTED Local Operations:
- ✅ **Local Laptop Deployments**: Tumhare paas 132GB local disk space hai, toh local laptop se seedha gcloud/AWS par deploy karna ab se standard rule hai.
- ✅ Code editing, file inspection, and git commands.
- ✅ Static verification: `npx tsc --noEmit`
- ✅ Always guard Node memory when running scripts if needed: `NODE_OPTIONS="--max-old-space-size=1024"`.

---

## 0.1 STRICT: Zero Automatic Git Push Policy (Founder Directive)

> [!CAUTION]
> **ABSOLUTE RULE**: NEVER run `git push` or `git push origin main` automatically after tasks, code edits, or bug fixes.
> Pushing multiple times a day wastes network bandwidth/time, causes background tasks to hang on slow connections, and disrupts rapid iteration.
> 
> - **Strict Exception**: Run `git push` ONLY and EXCLUSIVELY if the founder explicitly commands it (e.g., *"git push karo"*, *"push to github"*).
> - Updating GitHub once a week or on major milestones is more than enough.
> - Keep all ordinary development, verification, and edits strictly local.

---

## 0.2 STRICT: Instant Response & 2-Minute Task Progress Heartbeat (Founder Directive)

> [!IMPORTANT]
> **Instant Action & Transparent Pacing**:
> 1. **Instant Reply**: User jab bhi bole ya task assign kare, bina kisi delay ke turant acknowledge aur clear response dena hai.
> 2. **2-Minute Heartbeat**: Kisi bhi active task ya background command execution ke dauran har 2 minute mein status update dena mandatory hai:
>    - Kitna kaam successfully complete ho chuka hai.
>    - Kaunsa part abhi pending ya in-progress hai.
>    - Estimated time remaining (lagbhag kitne der mein done ho jayega).

---

## 0.3 STRICT: AI Video Industry Grounding & Competitor Intelligence (No Random Answers)

> [!IMPORTANT]
> **Domain First Policy**:
> - **Zero Random Answers**: Kabhi bhi generic ya disconnected answers nahi dena.
> - **Itnavideo & Creator Economy Context**: Har decision, architecture choice, UI component, aur technical advice ko AI Video industry ke lens se evaluate karna hai.
> - **Competitor & Market Benchmark**: Real-world benchmarks jaise CapCut, Opus Clip, InVideo AI, Descript, HeyGen, aur short-form retention mechanics (viral hooks, auto subtitles, kinetic typography, instant cloud render) ko dhyaan mein rakh kar deep, researched aur actionable answers dena hai.

---

## 0.4 STRICT: Post-Task Terminal & Background Task Verification (Zero Hanging Tasks)

> [!CAUTION]
> **Terminal Cleanliness Directive**:
> - Jab bhi koi task ya sub-task complete ho, **hamesha terminal aur running background processes ko ek baar verify karna mandatory hai**.
> - Bahut baar kaam complete hone ke baad bhi background mein commands ya tasks unintentionally chhoot jaate hain (e.g. "1 or 2 tasks running").
> - Task khatam hone par `manage_task` (action: `list`) se ensure karein ki koi unnecessary process ya lingering command background mein na chal rahi ho. Agar koi hung/stale task ho toh use turant kill/clean karein taaki developer machine par memory/CPU load zero rahe.

---

## 0.6 STRICT: Dual-Project Workspace Routing Policy (Web vs Flutter App)

> [!IMPORTANT]
> **Dual Repo Workspace Context**:
> - 🌐 **Web Project Root**: `c:\Users\user\.gemini\antigravity\scratch\itnavideo` (Next.js 16, Remotion, Cloud API Routes)
> - 📱 **Flutter App Root**: `c:\Users\user\.gemini\antigravity\scratch\itnavideo_app` (Flutter Mobile UI Client)
>
> **Automatic Routing Rules**:
> - When user mentions "app", "mobile", "flutter", "itnavideo app" -> Target `itnavideo_app` files.
> - When user mentions "website", "dashboard", "remotion", "api", "backend" -> Target `itnavideo` files.
> - The Flutter App calls live production API `https://www.itnavideo.com/api` — zero backend duplication needed.

---

## 1. Fast Work Tree (Execution Engine)

Most daily work in Itnavideo focuses on **Existing Video Types** and **Dashboard UI/UX Design**. Follow these targeted workflows for fast, zero-delay completion:

### A. Existing Video Types Iteration ("Check First, Update After" Policy)
1. **Mandatory Step 1 — Check Spec First**: Before modifying any code, **directly open and read `docs/video-types/{video-type}.md`** (e.g., `imagetovideoai.md`, `autocaption.md`). Understand its exact inputs, limits, Remotion composition props, and dedicated pipeline stages.
2. **Locate Code**: Target `remotion/templates/TEMPLATE_NAME/`, its dashboard studio in `components/dashboard/`, and `app/api/reels/jobs/route.ts`.
3. **Visual & Motion Polish**: Update springs, animations, font highlights, and layout. (Assets strictly in `public/assets/reusable/`).
4. **Prop Continuity**: Ensure new props have safe defaults in `services/ai/reelPlanner.ts` and `app/api/reels/jobs/route.ts` so existing render jobs never fail.
5. **Mandatory Step 5 — Update Spec After**: Immediately update `docs/video-types/{video-type}.md` with any new props, UI changes, limits, or parameters so docs never go out of date.
6. **Fast Verify**: Run `npx tsc --noEmit` (zero errors required).

### B. Dashboard UI/UX Design Iteration
1. **Modular Components**: Avoid adding large UI blocks to `app/dashboard/page.tsx` directly. Create isolated components in `components/` and import them.
2. **Visual Design System**: Dark aesthetic (zinc-900/950, fine borders `white/10`, mint/orange/purple accents, smooth micro-interactions).
3. **Reactive States**: Instant user feedback on file drop, animated progress pills, and clear error/success banners.
4. **Targeted Edits**: Use targeted line replacements in dashboard to avoid breaking other video types.

---

## 2. Documentation System & Video Types Registry

Before working on any template or feature, check:
1. `docs/video-types/README.md` — Master registry of all 10 active video types.
2. `docs/video-types/{video-type}.md` — The single source of truth for that specific video type.
3. `docs/ITNAVIDEO_PROJECT_CONTEXT.md` — Master project context (product, tech, rules, design system).
4. `docs/ITNAVIDEO_WORK_TREE.md` — Fast execution framework.

---

## 3. Subtitle & Caption Language Rule

Multi-language translation is **paused**. Only English and Hinglish (Roman script) subtitles are supported via Groq Whisper. No paid translation APIs.

- **Audio Handling**:
  - Hindi / Hinglish audio → clean Roman Hinglish captions (no Devanagari script).
  - English audio → English captions.
- **Provider Restrictions**:
  - Do NOT use OpenAI, Google Cloud, AWS Translate, or Azure translation APIs for subtitles.
  - Multi-language translation (Kannada, Urdu, Arabic, French, etc.) is PAUSED.
- **Reliability**:
  - If transcription fails, show an error — don't silently return empty captions or fall back to fake English.
  - Each render gets fresh captions from the current upload only. Never reuse old/cached transcript data.
  - Keep subtitle text short and readable (max 10 words per line).
  - `shouldSkipVisibleTextKey` must skip `captions`, `subtitleChunks`, `transcript` fields from forbidden script validation.

### Template-Specific Caption Behavior

| Template | Captions Needed? | Source |
|----------|-----------------|--------|
| `AUTO_CAPTION_REEL` | YES — primary feature | Word-grouped from transcript |
| `VIDEO_SIMPLE_EXPLAINER` | YES — subtitle strip | From transcript segments |
| `COMPARE_EXPLAINER` | YES — bottom strip | From transcript segments |
| `IMAGE_STORY_COLLAGE` | Optional text overlays | From scene beats |
| `AUTO_DRAW_EXPLAINER` | NO — whiteboard scenes | Uses scenes, not captions |
| `VOICE_SYNCED_NOTES` | YES — note lines | From transcript segments |
| `LONG_VIDEO_PROMO` | Optional captions | If promo clip has speech |
| `TYPOGRAPHY_VIDEO` | YES — kinetic words | Word-level timing synced to speech |
| `AI_AUDIO_CLEANER` | Script Review Preview | Full Groq Whisper transcript with retake detection |

---

## 4. Provider Policy & Transcription Architecture

- **Groq Whisper** → Primary speech-to-text transcription engine. Fast, cloud-based, and millisecond-accurate.
- **Gemini (Google Cloud asia-south1)** → **Mandatory Fallback**: If Groq Whisper encounters rate-limits, downtime, or errors, system automatically falls back to Gemini 2.0 Flash for speech transcription. Also used for AI scene direction and whiteboard planning.
- **Audio Extraction Rule**: Never send raw heavy video directly to Groq. Always extract lightweight 16kHz mono audio (MP3/WAV) before sending to Groq/Gemini.
- **OpenAI** → Removed completely from project. No OpenAI API calls or dependencies.
- **Local Planners First** → Keep AI usage minimal. Templates (Auto Caption, Compare, Long Video Promo, Voice Synced Notes, Audio Clean) use deterministic local logic from the transcript.

---

## 4.1 Master Video Duration & Credit Policy (Founder Directive — STRICT FINAL)

> [!CRITICAL]
> **STRICT ASPECT RATIO, DURATION & CREDIT SYSTEM**:
> - **All 16:9 Long-Form Videos (Up to 10 Minutes / 600s)**: Strictly 16:9 Widescreen Only. Credit Rate: **1 Min = 1 Credit** (1 Min = 1 Cr, 5 Min = 5 Cr, 10 Min = 10 Cr).
> - **All 9:16 Short-Form Videos (Up to 90 Seconds / 90s)**: Strictly 9:16 Vertical Only. Credit Rate: **1 Credit** per video (1080×1920 30 FPS MP4).

### Master Category Matrix & Credit Pricing

| Category | Video Type / Mode | Aspect Ratio | Max Video Duration | Credit Cost | Audio & Transcriber Pipeline |
| :--- | :--- | :---: | :---: | :---: | :--- |
| **16:9 Long-Form** | **Faceless Video** | **16:9 Only** | **Up to 10 Minutes (600s)** | **1 Min = 1 Credit** (1m=1, 5m=5, 10m=10 Cr) | Extracted 16kHz audio → Groq Whisper (Fallback: Gemini) |
| **16:9 Long-Form** | **Book Summary** | **16:9 Only** | **Up to 10 Minutes (600s)** | **1 Min = 1 Credit** (1m=1, 5m=5, 10m=10 Cr) | Extracted 16kHz audio → Groq Whisper (Fallback: Gemini) |
| **16:9 Long-Form** | **Image to Video AI** | **16:9 Only** | **Up to 10 Minutes (600s)** | **1 Min = 1 Credit** (1m=1, 5m=5, 10m=10 Cr) | Extracted 16kHz audio → Groq Whisper (Fallback: Gemini) |
| **16:9 Long-Form** | **YouTube Subtitles Generator** | **16:9 Only** | **Up to 10 Minutes (600s)** | **1 Min = 1 Credit** (1m=1, 5m=5, 10m=10 Cr) | Extracted 16kHz audio → Groq Whisper (Fallback: Gemini) |
| **16:9 Long-Form** | **Long Video to Shorts Clips** (`longVideoClips`) | **Source: 16:9 / 9:16**<br/>**Output: 9:16 Shorts** | **Input: Up to 2 Hours**<br/>**Output: 30s–60s Clips** | **2 Credits / Clip** | Extracted audio → Groq Whisper → AI Hook Detector → Render shorts |
| **9:16 Short-Form** | **Auto Caption Reel** | **9:16 Only** | **Up to 90 Seconds (90s)** | **1 Credit** | Extracted audio → Groq Whisper (Fallback: Gemini) |
| **9:16 Short-Form** | **Typography Kinetic Video** | **9:16 Only** | **Up to 90 Seconds (90s)** | **1 Credit** | Extracted audio → Groq Whisper (Fallback: Gemini) |
| **9:16 Short-Form** | **Whiteboard / Stickman Explainer** | **9:16 Only** | **Up to 90 Seconds (90s)** | **1 Credit** | Extracted audio → Groq Whisper (Fallback: Gemini) |
| **9:16 Short-Form** | **Faceless Video Shorts** | **9:16 Only** | **Up to 90 Seconds (90s)** | **1 Credit** | Extracted audio → Groq Whisper (Fallback: Gemini) |
| **9:16 Short-Form** | **Long Video Promo** | **9:16 Only** | **Up to 90 Seconds (90s)** | **1 Credit** | Extracted audio → Groq Whisper (Fallback: Gemini) |
| **Utility** | **AI Studio Audio Cleaner** | **Audio Utility** | **Up to 10 Minutes (600s)** | **1 Credit** | Groq Whisper + Retake Detection + Mastering |

- **Audio Extraction Rule**: Never pass raw heavy video files directly to Groq. Always extract lightweight 16kHz mono audio (MP3/WAV) before sending to Groq.
- **Transcription Fallback**: **Primary: Groq Whisper Cloud API** (fast, cloud-based). **Fallback: Google Gemini 2.0 Flash** (`asia-south1`) if Groq encounters rate-limits or errors.


---

## 5. Asset Storage, AWS & Cloudinary Rules

Keep reusable/render assets in one logical place only: `public/assets` for local indexing, with production binaries served from AWS S3 (`itnavideo-media-assets`).

- **No assets in templates**: Remotion template folders are strictly code-only. Do not put images, fonts, sound effects, or audio files inside `remotion/templates/*`.
- **Folders**:
  - One-off page assets: `public/assets/direct/*`
  - Reusable render assets: `public/assets/reusable/*`
  - Website UI/UX only: `public/brand`, `public/founder`, `public/visuals`
  - Stickers: `public/assets/stickman/`
- **Asset Indexing**: After adding/removing assets, run `npm run assets:index` so `public/assets/assets.json` stays current.
- **Cloud Storage Separation**:
  - Production render asset binaries live in **AWS S3**.
  - Website images, UI graphics, and demo videos MUST be hosted on **Cloudinary**.

---

## 6. Video Type Creation (5-Node Pipeline)

A new Video Type is complete when all 5 are done:
1. Remotion composition in `remotion/templates/TEMPLATE_NAME/template.tsx`
2. Registered in `remotion/index.tsx`
3. Entry in `VIDEO_TYPE_REGISTRY` (`services/ai/reelPlanner.ts`) with proper category
4. Dashboard card + mode config in `app/dashboard/page.tsx`
5. Backend render flow support in `app/api/reels/jobs/route.ts`

*Composition IDs use dashes (`TEMPLATE-NAME`). Folder names use underscores (`TEMPLATE_NAME`).*

---

## 7. Render Pipeline & Deployment

### Production Pipeline
1. User uploads file → presigned cloud storage URL
2. `/api/reels/jobs` → Groq transcription
3. Build render props (template-specific logic)
4. Cloud render engine
5. Poll `/api/reels/jobs/status` for progress
6. Return download URL on completion (48-hour cloud storage lifecycle)

### Deployment Rule
- Deployments will now be triggered and executed from the **local laptop** directly. 
- Rendering still happens on **AWS Lambda** for performance.

---

## 8. STRICT RULE: Video Type Independence (Distinct Pipelines & UI Steppers)

> [!IMPORTANT]
> **NO ONE-SIZE-FITS-ALL PIPELINE**: Every Video Type in Itnavideo serves a fundamentally different purpose, uses different inputs, and executes a distinct processing pipeline. NEVER share a generic or hardcoded pipeline across all modes.

### A. Core Video Type Requirements Matrix (9 Unified Modes)

| Video Type / Mode | User Inputs | Aspect Ratio Support | Transcription? | Asset Matching? | AI Planner? | Output Format | Pipeline Stages |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :--- |
| `autoCaption` | Video / Audio | 9:16 & 16:9 | ✅ Groq Whisper | ❌ None | ❌ None | 9:16 / 16:9 MP4 | Project Prep → Transcribe Speech → Style Motion Captions → Render 1080p MP4 |
| `imageToVideoAi` | Audio + Images | 9:16 & 16:9 | ✅ Groq Whisper | ❌ (User Images) | ❌ Local | 9:16 / 16:9 MP4 | Audio Prep → Transcribe → Scene Pacing & Parallax → Render 1080p MP4 |
| `facelessVideo` | Script / Audio | 9:16 & 16:9 | ✅ Groq Whisper | ✅ Stock Visuals | ✅ Full Director | 9:16 / 16:9 MP4 | Script Prep → Transcribe → Match B-Roll & SFX → Render 1080p MP4 |
| `compare` | Voiceover + 2 Images | 9:16 & 16:9 | ✅ Groq Whisper | ❌ (User Images) | ❌ Local | 9:16 / 16:9 MP4 | Upload Received → Transcribe Audio → Build Comparison Beats → Render 1080p MP4 |
| `typographyVideo` | Voiceover / Audio | 9:16 & 16:9 | ✅ Groq Whisper | ❌ None | ❌ Local | 9:16 / 16:9 MP4 | Audio Prep → Transcribe → Kinetic Text Kinetics & Camera Pulses → Render 1080p MP4 |
| `whiteboardVideo` | Script / Audio | 9:16 & 16:9 | ✅ Groq Whisper | ✅ Stickman/Icons | ✅ Gemini | 9:16 / 16:9 MP4 | Upload Received → Transcribe → Whiteboard Strategy Scenes → Render 1080p MP4 |
| `longVideoClips` | Long Video (Up to 2h) | Input 16:9/9:16 -> Output 9:16 | ✅ Groq Whisper | ❌ None | ✅ Hook Detector | 9:16 MP4 Clips | Upload Received → Chunk Audio → AI Hook Detector → Render 1080p Shorts |
| `bookSummary` | Script / Audio | 9:16 & 16:9 | ✅ Groq Whisper | ❌ None | ❌ Local | 9:16 / 16:9 MP4 | Audio Prep → Transcribe → Cinematic Chapter Visuals & Kinetic Notes → Render 1080p MP4 |
| `audioClean` | Audio / Video | Utility | ✅ Groq Whisper | ❌ None | ❌ Local | Studio Clean MP3/WAV | Script Transcribe → Retake & Mistake Detection → Loudness & Noise Mastering → Export Studio Master |

### B. Mandatory Implementation Rules

1. **Dedicated UI Stepper Steps**:
   - In [`components/render/InteractiveRenderEngine.tsx`](file:///C:/Users/user/.gemini/antigravity/scratch/itnavideo/components/render/InteractiveRenderEngine.tsx) and [`app/dashboard/page.tsx`](file:///C:/Users/user/.gemini/antigravity/scratch/itnavideo/app/dashboard/page.tsx) (`getRenderStepDefinitions`), **every video type must have its own tailored step sequence**.
   - **FORBIDDEN**: Never display "Processing assets" or "Matching assets" for modes that do not pick external assets (`autoCaption`, `longVideoPromo`, `audioClean`, `compare`).
   - **FORBIDDEN**: Never display "Transcribing speech" for modes that do not transcribe audio (`longVideoPromo`).

2. **Backend Processing Isolation (`app/api/reels/jobs/route.ts`)**:
   - Each mode must execute strictly its own required operations and bypass unnecessary network/LLM calls.
   - Always supply `frameRange: [0, totalFrames - 1]` to Remotion Lambda based on detected media duration to prevent over-rendering default timeline lengths.

3. **Status & Error Stage Accuracy**:
   - Status messages, progress estimations, and failure stages must map directly to the specific video type's actual stages so users always know exactly what is happening in the background.

---

## 9. Visual Design System: The 4 Final Brand Colors (White, Black, Purple, Pink)

> [!IMPORTANT]
> **FOUNDER DIRECTIVE: THE 4 FINAL BRAND COLORS (White, Black, Purple, Pink)**:
> Based on creator economy preferences and viral video tool design (popular with short-form creators, female audiences, and modern SaaS platforms), Itnavideo strictly uses **4 core primary brand colors**:
> 1. **White (`#FFFFFF`)**: Primary high-contrast headlines, crisp body text, and clean surface highlights.
> 2. **Black (`#000000` / `#070B14` / `#0E1526`)**: Deep obsidian dark canvas, video player mockups, and high-elevation cards.
> 3. **Purple (`#9333EA` / `#A855F7` / `purple-600`)**: Primary vibrant brand accent, gradient start (`from-purple-600`), active filter chips, and primary CTAs.
> 4. **Pink (`#EC4899` / `#F43F5E` / `pink-500` / `fuchsia-500`)**: Secondary creator warm gradient (`to-pink-500`), highlight badges, and vibrant button glows (highly favored by creators).

### A. The Core Brand Palette Tokens

| Token / Element | Color Code | Tailwind Equivalent | Purpose & Usage |
| :--- | :--- | :--- | :--- |
| **Canvas / Background (Dark)** | `#070B14` / `#0E1526` | `bg-[#070B14]`, `bg-[#0E1526]` | Primary dark obsidian canvas & card surface |
| **Primary Text (Light)** | `#FFFFFF` / `#F1F5F9` | `text-white`, `text-slate-100` | Crisp high-legibility primary text |
| **Heading Primary Gradient** | `#A855F7` → `#E879F9` → `#EC4899` | `from-purple-400 via-fuchsia-400 to-pink-400` | Signature vibrant Purple & Pink gradient |
| **Primary CTA Button** | `#9333EA` → `#D946EF` → `#EC4899` | `from-purple-600 via-fuchsia-500 to-pink-500` | High-conversion Purple to Pink gradient CTA |
| **Secondary / Muted Text** | `#94A3B8` / `#A1A1AA` | `text-slate-400`, `text-zinc-400` | Subtitles, metadata, input placeholders |
| **Subtle Structural Borders** | `rgba(255,255,255,0.1)` | `border-white/10` | Fine structural borders (no heavy borders) |
| **Active Badges & Eyebrows** | `rgba(168,85,247,0.1)` | `bg-purple-500/10 border-purple-500/30 text-purple-300` | Feature tags and kicker pills |
| **Status: Success** | `#10B981` | `text-emerald-400`, `bg-emerald-500/10` | Verified status, completed renders |
| **Status: Error / Danger** | `#EF4444` | `text-red-400`, `bg-red-500/10` | Failures, delete actions |

### B. Standard Component Patterns (MANDATORY COPY-PASTE PATTERNS)

#### 1. Page Headings (`h1` / `h2` with Purple & Pink Gradient)
```tsx
{/* Standard Eyebrow / Kicker */}
<div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-purple-300">
  <Sparkles size={14} className="text-purple-400" />
  <span>Studio Feature Name</span>
</div>

{/* Standard Heading with Purple & Pink Gradient */}
<h1 className="text-3xl font-black tracking-tight text-white sm:text-5xl md:text-6xl">
  Title Words in Clean White{' '}
  <span className="bg-gradient-to-r from-purple-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent">
    Purple &amp; Pink Creator Highlight
  </span>
</h1>
```

#### 2. Primary & Secondary CTA Buttons
```tsx
{/* Primary CTA: Purple & Pink Gradient */}
<button className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-purple-600 via-fuchsia-500 to-pink-500 px-6 py-3.5 text-sm font-black text-white shadow-lg shadow-purple-500/25 transition hover:brightness-110 active:scale-95">
  <span>Start Creating Free</span>
  <ArrowRight size={16} />
</button>

{/* Secondary CTA: Dark Surface with Purple Icon */}
<a href="#details" className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-[#151E30] px-6 py-3.5 text-sm font-bold text-zinc-200 hover:bg-[#1C2840] transition">
  <BookOpen size={16} className="text-purple-400" />
  <span>Read Guide &amp; Specs</span>
</a>
```

#### 3. Studio Cards & Category Chips
- All studio cards share the Obsidian + Purple hover sheen:
  `rounded-[28px] border border-white/10 bg-[#0E1526] hover:border-purple-500/50 hover:shadow-2xl hover:shadow-purple-500/15`
- Active Category Chips: M3 pill with Purple to Pink gradient (`rounded-full bg-gradient-to-r from-purple-600 via-fuchsia-500 to-pink-500 text-white font-black shadow-lg shadow-purple-500/25`).
- Inactive Category Chips: `rounded-full bg-[#0E1526] text-zinc-400 border border-white/10 hover:border-purple-500/40 hover:text-white`.

### C. Material Design 3 (M3) System Integration (https://m3.material.io/)

Whenever designing or building UI components, layouts, containers, sheets, navigation, forms, and micro-interactions, **ALWAYS apply Google Material Design 3 (M3) specifications**:

1. **M3 Shape System**:
   - **Extra Large Containers & Cards**: `rounded-[28px]` (Studio cards, video preview containers, modal sheets, hero preview stages).
   - **Medium Containers & Inputs**: `rounded-2xl` (Input fields, spec callout boxes, banners, action bars).
   - **Small Elements & Action Anchors**: `rounded-full` (Filter chips, category badges, primary CTA buttons, floating icon buttons).

2. **M3 Elevation & Surfaces**:
   - **Tonal Layering**: Deep Obsidian Base (`#070B14`) -> Elevated Surface Container (`#0E1526`) -> High Surface Container (`#151E30`).
   - **Structural Borders**: Subtle 1px tonal border (`border border-white/10` or `border border-slate-200/80`). Avoid harsh, thick borders.
   - **Ambient Illumination**: On hover, apply a smooth Google Analytics Orange radial glow (`hover:border-[#FF6D00]/50 hover:shadow-2xl hover:shadow-[#FF6D00]/15`).

3. **M3 Motion & Micro-interactions**:
   - **Tactile State Layer**: Every interactive button and chip must implement active compression (`active:scale-95 transition-all duration-200`).
   - **Elevation Lift**: Cards smoothly lift on hover (`hover:-translate-y-1.5 transition-all duration-300 ease-[cubic-bezier(0.2,0,0,1)]`).
   - **Kinetic Horizontal Snap Tracks**: For carousels, hub tracks, and horizontally overflowing toolbars, use `snap-x snap-mandatory overflow-x-auto scroll-smooth no-scrollbar`.
   - **Marquee Motion**: Use `@keyframes m3Marquee` for ambient moving ticker elements with pause on hover (`hover:pause`).

4. **Reference Source**:
   - Official tokens, layouts, and component guidelines: [https://m3.material.io/](https://m3.material.io/).

### D. Approved UI & Animation Component Inspirations

When engineering UI components, micro-interactions, and animations across Itnavideo landing pages and dashboard studios, adopt patterns from these three modern component inspiration libraries:

1. **Vengeance UI (`vengenceui.com`)**:
   - **Focus**: High-converting SaaS landing pages, animated hero stages, moving gradient borders, and dynamic spring cards.
   - **Stack**: Next.js + React + Tailwind CSS + Framer Motion.
   - **Itnavideo Usage**: Glowing ambient border cards, hero video stage transitions, and spring card elevation lift.

2. **Skipper UI / Skiper UI (`skiper-ui.com`)**:
   - **Focus**: shadcn/ui-compatible unconventional layout blocks, tactile micro-interactions, distinct form inputs, and interactive tab/pill switchers.
   - **Stack**: React + Tailwind CSS + shadcn/ui primitives.
   - **Itnavideo Usage**: Video type filter chips with count badges, tactile click snap (`active:scale-95`), and clean dashboard form controls.

3. **Animmaster Lib (`animmasterlib.dev`)**:
   - **Focus**: Awwwards-style web animations, kinetic typography reveals, scroll triggers, and physics-based hover states.
   - **Stack**: Pure Tailwind CSS + Framer Motion.
   - **Itnavideo Usage**: Kinetic headline typography reveals, video card micro-progress indicators, and smooth cubic-bezier easing.

### E. Impeccable Craft Floor & Anti-Pattern Floor Rules

Keep these mandatory UI quality checks and anti-pattern bans in mind for all frontend code:

1. **Hierarchy & Typography Execution**:
   - Body copy measure target: 65–75 characters per line.
   - Text contrast ratio: Body & placeholder text ≥ 4.5:1, large text ≥ 3:1.
   - On dark surfaces (`#070B14`, `#0E1526`), use solid high-contrast white text (`text-white`) or GA Orange (`#FF8F00`) instead of clipped gradient-text masks (`[gradient-text]`). Weight, size, and GA Orange highlights drive visual emphasis.
   - Custom browser surfaces: Caret, text selection (`selection:bg-[#FF6D00]/30 selection:text-white`), focus rings, and custom scrollbars must be explicitly themed to match Google Analytics Obsidian tones.

2. **Card & Container Architecture**:
   - Cards are complete clickable interactive surfaces with subtle border glows (`hover:border-[#FF6D00]/50 hover:shadow-2xl hover:shadow-[#FF6D00]/15`).
   - Tonal surface layering: Deep Obsidian Base (`#070B14`) -> Elevated Surface (`#0E1526`) -> High Surface (`#121824` / `#131926`).
   - Soft offset depth shadows (`shadow-2xl shadow-black/80`). Avoid hard block shadows (`box-shadow: 4px 4px 0`) or zero-blur halos.
   - **BANNED**: Nested cards (cards inside cards) and repetitive text container boxes that duplicate specs already known to the user.

3. **Motion & Interaction Floor**:
   - Single authored motion moment per viewport using exponential ease-out (`ease-[cubic-bezier(0.2,0,0,1)]`).
   - Every interactive element must support full states: default, hover, focus-visible, active (`active:scale-95`), loading, and error.

4. **Copy & Action Clarity**:
   - Buttons and controls explicitly name their action (e.g. "Start Creating Free", "Open Studio", "Download 1080p Full HD").
   - Error banners describe the exact issue and provide a single-click recovery action.




