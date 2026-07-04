# Reference Note

This document is reference material. Please use `docs/ITNAVIDEO_MASTER_DOC.md` as the latest source of truth for Itnavideo.

# Itnavideo Internal Product Documentation

Source document: `Untitled document.docx` exported from Google Docs.

Last reorganized: 2026-07-02

> [Added by Codex] This document reorganizes the founder notes into a professional internal product document. Original project facts have been preserved and grouped. Any structure, placeholders, recommendations, or status labels added by Codex are marked with `[Added by Codex]`.

## Table of Contents

1. Product Overview
2. Vision and Mission
3. Product Principles
4. Video Types
5. Template Management
6. Design and Creative System
7. Motion, Sound, and Effects System
8. Dashboard and User Experience
9. Input Handling and Asset Handling
10. Processing Pipeline
11. Rendering and Export
12. Quality Assurance
13. Current Tech Stack
14. System Architecture
15. Project Structure
16. Database
17. APIs
18. AI Models Used
19. Third-Party Services
20. Deployment
21. Environment Variables
22. Development Workflow
23. Coding Standards
24. Security, Privacy, and Reliability
25. Credits, Pricing, and Usage Limits
26. SEO and Landing Pages
27. Analytics
28. Roadmap
29. Pending Tasks
30. Future Ideas
31. Known Limitations
32. Risks
33. Decisions Made
34. Issue Tracker
35. Improvement Tracker
36. Change Log
37. Codex Additions Register

## 1. Product Overview

Itnavideo is an AI-powered video creation platform. Users upload raw content such as video, audio, images, logos, thumbnails, screenshots, or scripts, choose a video type, and receive a polished short video ready to post.

The product is not intended to behave like a manual video editor. Users should not need to drag timelines, manually cut clips, or design scenes from scratch. The core promise is that Itnavideo handles the editing, layout, captions, motion, rendering, and export flow automatically.

Current primary output format:

| Output | Current State |
|---|---|
| Short-form vertical reels | 9:16 MP4 |
| Long-form horizontal video | [Added by Codex] Future support placeholder |

Target users include:

- YouTube creators promoting long videos
- Instagram and TikTok creators needing captions
- Educators making explainer content
- Small businesses promoting products or services
- Religious content creators such as noha, munajat, and bayan creators
- News and current affairs channels
- Finance and banking educators
- Coaches, consultants, and personal brands
- Anyone with content but limited time or editing skill

## 2. Vision and Mission

### Vision

> [Added by Codex] Make professional short-form video creation accessible to creators who do not have editing skills, time, or a production team.

### Mission

Turn raw creator content into publish-ready 9:16 reels quickly, with AI-assisted planning, transcription, captions, layout, motion, rendering, and download.

### Product Goal

Turn raw creator content into polished, ready-to-post reels in under 3 minutes, with no editing skills required.

## 3. Product Principles

1. Users choose a video type, not a technical template.
2. Output should look like a finished social media video, not a developer demo.
3. Captions should look like real short-video captions before the user generates the final video.
4. Every video type should clearly tell the user what to upload.
5. The first 3 to 5 seconds must create a strong hook.
6. Each scene should focus on one idea.
7. Video readability matters more than decoration.
8. AI should help plan the video, while Remotion and FFmpeg handle rendering and media processing.
9. User files, transcripts, exports, credits, and payments must be handled safely.
10. Failed renders should not waste user credits.

## 4. Video Types

The source document lists the following video types.

| # | Video Type | Short Intro | Purpose |
|---|---|---|---|
| 1 | Auto Caption Video | Add clean captions to your videos automatically. | Upload a video, choose a caption style, and generate readable captions for reels, shorts, podcasts, courses, and talking videos. Best for videos watched on mute. |
| 2 | Dynamic Explainer Video | Turn your audio or script into an engaging explainer reel. | Uses text highlights, icons, motion, and visual cards to explain a message clearly. Best for educational, business, finance, and informational content. |
| 3 | Compare Explainer Video | Create side-by-side comparison videos easily. | Compare two topics, products, brands, ideas, or services with labels, visuals, captions, and presenter-style elements. |
| 4 | Auto Draw Explainer Video | Create animated notes and whiteboard-style reels. | Converts script/audio into a notebook or whiteboard explainer with handwritten-style text, highlights, arrows, circles, and reveal animations. |
| 5 | Long Video Promo | Promote your long video in a short reel format. | Upload a long clip, thumbnail, and title to create a promo reel with thumbnail, title, preview, and CTA. |
| 6 | Background Replace Video | Change the background of your video. | Upload video and choose or upload a new background to create a clean vertical video with replaced background. |
| 7 | Custom AI Reel | Describe what you want, and create a custom reel. | User provides prompt plus optional audio, images, clips, screenshots, or logo; system creates a custom 9:16 reel. |

> [Added by Codex] Current repo context says there are 6 production video types. The Google Docs source lists 7, including Custom AI Reel. Custom AI Reel should be treated as "status needs confirmation" until product, code, and deployment status are confirmed.

## 5. Template Management

### Template Tracker

> [Added by Codex] This tracker is a central status board. Status values should be confirmed by the founder or engineering owner.

| Metric | Count | Notes |
|---|---:|---|
| Total video types in source document | 7 | Auto Caption, Dynamic Explainer, Compare Explainer, Auto Draw, Long Video Promo, Background Replace, Custom AI Reel |
| Completed | TBD | [Added by Codex] Confirm against production dashboard and render flow. |
| In Progress | TBD | [Added by Codex] Confirm from current roadmap. |
| Planned | TBD | [Added by Codex] Confirm future template list. |
| Deprecated | TBD | [Added by Codex] Confirm if any template is being removed. |
| Blocked | TBD | [Added by Codex] Confirm technical or product blockers. |

### Template Status Board

| Template / Video Type | Current Status | Priority | Owner | Notes |
|---|---|---|---|---|
| Auto Caption Video | Needs confirmation | High | TBD | Caption style preview quality is important for user trust. |
| Dynamic Explainer Video | Needs confirmation | High | TBD | Uses text highlights, icons, visual cards, and motion. |
| Compare Explainer Video | Needs confirmation | High | TBD | Needs clear left/right comparison layout. |
| Auto Draw Explainer Video | Needs confirmation | High | TBD | Notebook/whiteboard visual planning and animations. |
| Long Video Promo | Needs confirmation | Medium | TBD | Thumbnail, title, preview, and CTA workflow. |
| Background Replace Video | Needs confirmation | Medium | TBD | Subject clarity and non-distracting background are key. |
| Custom AI Reel | Needs confirmation | TBD | TBD | [Added by Codex] Listed in source doc; production status must be confirmed. |

### Template Profile: Auto Caption Video

| Field | Details |
|---|---|
| Template Name | Auto Caption Video |
| Current Status | Needs confirmation |
| Purpose | Add clean captions to uploaded videos automatically. |
| Features | Video upload, caption style selection, subtitle/caption generation, caption position, font, colors, final MP4 export. |
| Inputs | Video upload; caption style; caption position; font; text color; highlight color; optional style settings. |
| Outputs | 9:16 captioned video, final MP4 download. |
| Design Notes | Captions must look like real reels, not plain text placeholders. Preview cards should show mini reel frames with realistic caption placement. |
| Animations | Caption pop, karaoke fill, word highlight, pill bounce, typewriter, subtle motion depending on selected style. |
| Assets Required | Uploaded video; optional preview background images for style cards. |
| Current Issues | Caption preview quality must match final output more closely; avoid oversized captions that cover the reel. |
| Planned Improvements | Better mini reel previews, polished caption styles, subtle animation preview, professional sizing, lower shadow intensity where needed. |
| Testing Status | [Added by Codex] Needs visual QA for all caption styles across desktop and mobile dashboard. |
| Priority | High |
| Owner | TBD |
| Notes | Best for reels, shorts, podcasts, courses, talking videos, and mute viewing. |

### Auto Caption Reel Caption Styles

The current Auto Caption Reel caption styles are:

| # | Style |
|---:|---|
| 1 | Eclipse |
| 2 | Hustle |
| 3 | Gold Pill |
| 4 | Studio Clean |
| 5 | One Word |
| 6 | Arctic Glow |
| 7 | Karaoke Fill |
| 8 | Shatter Drop |
| 9 | Pill Bounce |
| 10 | Cinematic |
| 11 | Hacker Type |
| 12 | Vollkorn |
| 13 | Midnight |
| 14 | Marigold |
| 15 | Pop Candy |
| 16 | Bold Fire |
| 17 | Typewriter |
| 18 | Split Color |

> [Added by Codex] Caption style QA should check whether any styles are visually duplicated, too large, too shadow-heavy, too low contrast, or inconsistent with final render behavior.

### Template Profile: Dynamic Explainer Video

| Field | Details |
|---|---|
| Template Name | Dynamic Explainer Video |
| Current Status | Needs confirmation |
| Purpose | Turn audio or script into a dynamic explainer reel. |
| Features | Text highlights, icons, motion, visual cards, captions, AI scene planning. |
| Inputs | Audio, video, or script; optional images; optional logo; style/theme options. |
| Outputs | 9:16 explainer video with structured scenes. |
| Design Notes | Best for educational, business, finance, and informational content. |
| Animations | Text reveal, card entrance, icon pop, transitions, subtle scene motion. |
| Assets Required | User audio/video/script; optional brand assets; icons/visual elements. |
| Current Issues | [Added by Codex] Confirm current render quality, icon relevance, and scene pacing. |
| Planned Improvements | More accurate scene planning, stronger hooks, clearer data/number layouts. |
| Testing Status | [Added by Codex] Needs end-to-end test with audio, script, and missing optional assets. |
| Priority | High |
| Owner | TBD |
| Notes | Should explain one idea per scene and avoid overloaded layouts. |

### Template Profile: Compare Explainer Video

| Field | Details |
|---|---|
| Template Name | Compare Explainer Video |
| Current Status | Needs confirmation |
| Purpose | Compare two topics, products, brands, ideas, or services. |
| Features | Side-by-side layout, left/right labels, captions, visuals, presenter/sticker elements. |
| Inputs | Audio/voiceover; left item name/image/logo; right item name/image/logo; optional sticker/presenter style. |
| Outputs | 9:16 comparison reel. |
| Design Notes | Left and right sides must be clearly readable and balanced. |
| Animations | Split-screen reveals, left/right emphasis, sticker pointing, highlight movement. |
| Assets Required | User images/logos; sticker assets; captions. |
| Current Issues | [Added by Codex] Confirm sticker pose mapping and side readability. |
| Planned Improvements | Stronger comparison moments, clearer labels, better pose variety. |
| Testing Status | [Added by Codex] Needs QA for long names, missing images, and both-side comparison scenes. |
| Priority | High |
| Owner | TBD |
| Notes | Useful for product, brand, idea, service, and topic comparison. |

### Template Profile: Auto Draw Explainer Video

| Field | Details |
|---|---|
| Template Name | Auto Draw Explainer Video |
| Current Status | Needs confirmation |
| Purpose | Create animated notes and whiteboard-style reels. |
| Features | Handwritten-style text, highlights, arrows, circles, diagrams, reveal animations. |
| Inputs | Script or audio; optional logo; notebook/whiteboard style; theme options. |
| Outputs | 9:16 animated note/whiteboard explainer. |
| Design Notes | Best for teaching and concept explanation. Notes must remain readable. |
| Animations | Handwriting reveal, arrow draw, circle draw, highlight sweep, page transitions. |
| Assets Required | User audio/script; optional logo; drawing shapes; notebook/whiteboard backgrounds. |
| Current Issues | [Added by Codex] Confirm text density and timing for readable notebook scenes. |
| Planned Improvements | Better visual planning, cleaner diagram grouping, stronger concept breakdown. |
| Testing Status | [Added by Codex] Needs tests for long transcript, short transcript, and missing optional logo. |
| Priority | High |
| Owner | TBD |
| Notes | Gemini is currently used for Auto Draw visual planning according to project context. |

### Template Profile: Long Video Promo

| Field | Details |
|---|---|
| Template Name | Long Video Promo |
| Current Status | Needs confirmation |
| Purpose | Promote a long video in short reel format. |
| Features | Thumbnail, title, video preview, CTA, promo layout. |
| Inputs | Long video clip; thumbnail; title; optional CTA; optional logo; promo style. |
| Outputs | 9:16 promotional reel. |
| Design Notes | Thumbnail, title, and preview must be visible and not overcrowded. |
| Animations | Thumbnail reveal, title pop, preview motion, CTA entrance. |
| Assets Required | User thumbnail, title, video clip, optional logo. |
| Current Issues | [Added by Codex] Confirm CTA handling and long title overflow behavior. |
| Planned Improvements | More premium promo layouts, stronger hook, better thumbnail/title balance. |
| Testing Status | [Added by Codex] Needs QA for long titles, missing logo, different thumbnail ratios. |
| Priority | Medium |
| Owner | TBD |
| Notes | Best for YouTube videos, podcasts, courses, and webinars. |

### Template Profile: Background Replace Video

| Field | Details |
|---|---|
| Template Name | Background Replace Video |
| Current Status | Needs confirmation |
| Purpose | Change or replace the background of an uploaded video. |
| Features | Main video upload, background image/video upload or selection, fit controls, optional captions. |
| Inputs | Main video; new background image/video; fit options; optional captions. |
| Outputs | 9:16 vertical video with replaced background. |
| Design Notes | Subject must remain clear and background must not distract from the speaker. |
| Animations | Subtle background motion, subject framing, optional caption motion. |
| Assets Required | User video; user-selected or uploaded background. |
| Current Issues | [Added by Codex] Confirm subject/background separation quality and edge cases. |
| Planned Improvements | Better background preview, improved safe-area framing, optional caption integration. |
| Testing Status | [Added by Codex] Needs QA with bright, dark, busy, and simple backgrounds. |
| Priority | Medium |
| Owner | TBD |
| Notes | Useful for professional reels, talking videos, and social media content. |

### Template Profile: Custom AI Reel

| Field | Details |
|---|---|
| Template Name | Custom AI Reel |
| Current Status | Needs confirmation |
| Purpose | Let users describe a custom reel and provide optional media assets. |
| Features | Prompt-based reel creation, optional audio/images/clips/screenshots/logo, AI timeline planning. |
| Inputs | Prompt; optional audio; optional images; optional video clips; optional screenshots; optional logo. |
| Outputs | Custom 9:16 reel based on user instructions. |
| Design Notes | The result should follow the user prompt and avoid random text/assets. |
| Animations | Determined by generated timeline and selected style. |
| Assets Required | User-provided files and generated/planned visual assets. |
| Current Issues | [Added by Codex] Production status must be confirmed because current project context lists 6 production video types while source doc lists this as #7. |
| Planned Improvements | Better prompt-to-timeline planning, asset relevance, preview/edit before render. |
| Testing Status | [Added by Codex] Needs full validation before production claim. |
| Priority | TBD |
| Owner | TBD |
| Notes | Best for unique promos, product explainers, and custom content ideas. |

## 6. Design and Creative System

### Typography

Text is not only for reading; it must also look visually attractive.

Key typography concepts:

- Font psychology: Serif can feel traditional or trustworthy; sans-serif can feel modern and clean.
- Typography hierarchy: Headline, sub-headline, and body text should differ through size, weight, and spacing.
- Kerning: Space between individual letters.
- Leading: Line height between lines.
- Tracking: Overall spacing across a text group.
- Text animation: Text should enter and leave smoothly, using ease-in and ease-out principles.

### Visual Storytelling and Hooks

Retention depends on why the viewer should keep watching.

Important rules:

- The first 3 to 5 seconds should create a strong hook.
- Pacing and rhythm should match the video purpose.
- Fast-paced edits can follow music beats.
- Slow-paced edits can support emotional storytelling.
- Cut styles include jump cuts, match cuts, J-cuts, and L-cuts.
- Pattern interrupts should happen every 5 to 10 seconds through a zoom, text, image, or transition change.

### Color Theory and Grading

Colors trigger emotion and should support the message.

Core notes:

- Primary, secondary, and complementary color relationships matter.
- Contrast and saturation add depth.
- Color correction makes footage natural.
- Color grading gives footage a specific look.
- Blue suggests calm/trust.
- Red suggests urgency/excitement.
- Yellow grabs attention.

### Composition and Layout

Professional video depends on how objects are placed on screen.

Core rules:

- Use the rule of thirds when placing subjects.
- Use negative space to avoid messy design.
- Use depth of field or blur to highlight the subject.
- Balance text, image, and video elements so one element does not hide another.
- Keep captions and important text inside safe areas.

### Data Representation

Numbers and statistics should not feel boring.

Recommended approaches:

- Convert data into graphs or charts where useful.
- Use visual hierarchy for key numbers such as "100%" or "2026".
- Animate numbers with counter-style motion.
- Use icons such as arrows, currency symbols, and checkmarks to represent data visually.

## 7. Motion, Sound, and Effects System

### Sound Effects

Sound effects should support the voiceover and video action, not overpower them.

Useful SFX types:

- Text pop
- Whoosh
- Click
- Ding/success
- Warning/error beep
- Sweep
- Soft impact

Rules:

- Voiceover remains the main audio.
- SFX should be subtle and not too loud.
- Use SFX to support important actions, transitions, or CTA moments.

### Background Music

Background music supports mood and pacing.

Rules:

- Keep voiceover clear.
- Use low volume under narration.
- Offer music on/off options where useful.
- Use soft or no music for serious, religious, legal, or finance content.
- Use stronger energy for promos where appropriate.

### Animations

Animation types:

- Entrance animation
- Exit animation
- Emphasis animation
- Text animation
- Logo animation
- Card animation
- Caption animation

Rules:

- Animation must guide attention.
- Do not animate every element heavily.
- Use one main animation per scene.
- Keep text readable.
- Sync animation with voiceover meaning.
- Use stronger animation on hook and CTA.
- Use cleaner animation for informational or educational content.

### Motions

Motion types:

- Slow zoom
- Pan
- Floating motion
- Background motion
- Camera motion
- Parallax
- Sticker or presenter motion
- Caption motion

Rules:

- Motion should be smooth.
- Background motion should be subtle.
- Text should remain readable during motion.
- Avoid distracting motion.
- One main motion per scene is usually enough.

### Transitions

Transition types:

- Cut
- Fade
- Slide
- Zoom
- Swipe
- Blur
- Match cut
- Whip

Rules:

- Do not use transitions on every scene.
- Fast reels can use cut/swipe transitions.
- Professional explainers can use fade, blur, or slide.
- Avoid too many transition types in one video.
- Use 2 to 3 transition styles for consistency.

### Effects

Effect types:

- Glow
- Shadow
- Blur
- Glass
- Highlight
- Underline/circle
- Light sweep
- Mask/reveal
- Overlay
- Background texture

Rules:

- Effects should feel premium, not overused.
- Readability comes first.
- Use soft shadow or glow only when it improves clarity.
- Use blur to focus attention.
- Use stronger effects for promos and cleaner effects for education.

## 8. Dashboard and User Experience

The dashboard should help the user understand what they will get before they generate a video.

Core dashboard elements:

- Video type cards
- Simple upload form
- Preview
- Options
- Generate button
- Render progress
- History
- Download

User-facing UI rules:

- Use "Video Type", not "Template", in user-facing areas.
- Do not confuse the user with too many technical terms.
- Required fields should be clear.
- Advanced options should be secondary.
- The experience should be mobile friendly.
- Buttons should be readable.
- Preview should be compact but meaningful.
- Errors should be simple and actionable.
- The user should understand the likely output before generating.
- Video type cards should feel professional.

## 9. Input Handling and Asset Handling

Supported input types:

- Video
- Audio/voiceover
- Image
- Logo
- Text/script
- Style selection
- Subtitle/caption option

Input rules:

1. Required input should be clear.
2. Optional input should not block rendering.
3. Wrong file types should show an error.
4. Large uploads should show progress.
5. User media should be prioritized over random assets.
6. Random assets should only be used if allowed by the workflow.
7. Blank inputs should not create blank videos.
8. Inputs should match the purpose of the selected video type.

Asset and storage notes:

- User videos, audio, images, thumbnails, and logos are uploaded.
- Files are temporarily stored in AWS S3.
- FFmpeg, Groq, AI planner, and Remotion process the files.
- Generated final videos are stored and made downloadable.
- Old files should auto-delete to control storage cost.
- Failed jobs should clean up unnecessary files.
- User uploaded assets must link to the correct job.

## 10. Processing Pipeline

General pipeline:

1. User selects a video type.
2. User uploads required files and options.
3. File validation runs.
4. FFmpeg processes media when needed.
5. Groq Whisper transcribes audio/video when voice is present.
6. AI planning or deterministic planning creates the video structure.
7. Timeline is created.
8. Remotion renders the animated video.
9. Final MP4 is optimized.
10. Download link is shown.

Example pipelines:

| Video Type | Pipeline |
|---|---|
| Auto Caption Video | Upload video -> extract audio -> Groq transcription -> caption processing -> Remotion caption render -> final MP4 |
| Dynamic Explainer Video | Upload audio -> transcription -> AI scene planning -> Remotion visual reel -> final MP4 |
| Long Video Promo | Upload thumbnail + title + clip -> layout planning -> Remotion promo render -> final MP4 |
| Custom AI Reel | Prompt/uploads -> AI timeline planning -> Remotion custom scenes -> final MP4 |

Failure handling rules:

- Unsupported file upload should show an error.
- Groq transcription failure should show a clear error.
- AI planning failure may use a fallback timeline where appropriate.
- Remotion/AWS Lambda failure should clearly mark the job failed.
- Empty scenes should prevent render start.
- If subtitles are ON but captions are missing, show error or retry option.

## 11. Rendering and Export

Rendering components:

1. Remotion render: Converts text, captions, images, video clips, logos, animations, and effects into final video.
2. AWS Lambda render: Runs rendering in the cloud so the user's device does not carry the load.
3. Final MP4 creation: Generates a 9:16 reel.
4. Export optimization: Reduces file size while keeping quality.
5. Download link: Gives the user access to the finished video.

Export checks:

- 9:16 format
- Audio present
- Captions synced
- Text not cut off
- Logo clear
- No blank scene
- Correct duration
- Manageable file size
- Mobile friendly
- Downloadable

## 12. Quality Assurance

General QA checklist:

- No blank video
- Audio plays correctly
- Captions are synced
- Text is readable
- Layout is not cut off
- Duration is correct
- Aspect ratio is 9:16
- User input is followed
- Export works

Video-specific QA:

| Video Type | QA Focus |
|---|---|
| Auto Caption Video | Captions readable, synced, correct style, realistic preview, safe-area placement. |
| Dynamic Explainer Video | Scenes, cards, icons, highlights, and CTA match the audio/script. |
| Compare Explainer Video | Left/right sides are clear, labels readable, presenter/sticker elements support comparison. |
| Auto Draw Explainer Video | Notes, arrows, circles, and highlights appear at the right timing. |
| Long Video Promo | Thumbnail, title, clip preview, and CTA are visible and balanced. |
| Background Replace Video | Subject remains clear; background does not distract. |
| Custom AI Reel | Output follows prompt and uploaded assets. |

## 13. Current Tech Stack

| Tool / Service | Purpose |
|---|---|
| Next.js | Website, dashboard, frontend pages, and API routes. |
| React | UI and components. |
| Tailwind CSS | Fast styling, responsive design, buttons, cards, and layouts. |
| Vercel | Website/frontend deployment. |
| Supabase | Authentication, database, user jobs/history, credits. |
| AWS S3 | User uploads, generated videos, assets, images, audio/video storage. |
| AWS Lambda | Video rendering jobs, especially Remotion render. |
| Remotion | React components to video generation/rendering. |
| FFmpeg | Video/audio processing, trimming, converting, compression, screenshots, merging. |
| Groq Whisper | Audio/video transcription and word-level timestamps. |
| OpenAI API | Source notes mention AI planning, script understanding, scene planning, title/text generation. |
| Gemini API | Alternative planner, Auto Draw visual planning, script-to-scene ideas. |
| Claude / Anthropic | Code help, planning, debugging, startup support, possible future AI planning. |
| Kiro | Coding assistant, implementation, bug fixing. |
| Codex | Code generation, debugging, feature implementation. |
| Git/GitHub | Version control and project history. |
| Node.js | Backend scripts, build tools, API logic, render scripts. |
| npm | Package installation and scripts. |
| TypeScript | Safer code and better project structure. |
| Canva / image tools | Image/visual asset creation. |
| ChatGPT | Planning, content, implementation support. |
| Google Gemini / AI image tools | Visual ideas and generated images. |
| YouTube / Instagram / Facebook | Marketing/distribution channels. |
| Google Search Console / Analytics | SEO, indexing, traffic tracking. |
| Razorpay / Payment system | Payments, plans, credits, paid users. |

> [Added by Codex] Current project context says OpenAI is paused because the key is expired, and OpenAI API calls should not be added without explicit approval. The source document still lists OpenAI as part of the planning stack, so the operational status should be reviewed before future implementation.

## 14. System Architecture

### High-Level Architecture

```text
User Dashboard
  -> Video Type selection
  -> Uploads/options
  -> API route/job creation
  -> S3 temporary storage
  -> FFmpeg processing when needed
  -> Groq Whisper transcription
  -> Local planner / Gemini / approved AI planner
  -> Timeline/render props
  -> Remotion Lambda render
  -> S3 output
  -> Job status polling
  -> Download link
```

### AI and Media Responsibilities

| Layer | Responsibility |
|---|---|
| AI planner | Understand transcript or prompt and decide what to create. |
| Groq Whisper | Convert speech to transcript and word-level timestamps. |
| Remotion | Create animated scenes, captions, layouts, and final visual composition. |
| FFmpeg | Process media files: extract audio, trim, convert, compress, resize, merge, screenshot. |
| AWS S3 | Store uploads and outputs temporarily. |
| AWS Lambda | Run rendering/processing jobs in the cloud. |

## 15. Project Structure

> [Added by Codex] This section uses current repo documentation conventions. Keep it updated as folders change.

| Area | Purpose |
|---|---|
| `app/` | Next.js App Router pages and API routes. |
| `app/dashboard/` | Dashboard UI and video type workflow entry points. |
| `app/api/reels/` | Reel preview, job creation, and status API flow. |
| `remotion/` | Remotion compositions and template code. |
| `remotion/templates/` | Code-only template folders. |
| `services/` | Backend services and planners. |
| `public/assets/` | Local reusable/render asset index source; not deployed to Vercel. |
| `public/visuals/` | Website UI/UX visual assets. |
| `docs/` | Project documentation. |
| `docs/video-types/` | Individual video type/template specs. |

## 16. Database

Supabase is used for authentication, database, user jobs/history, credits, and related product data.

Source notes mention Supabase free tier details:

- Unlimited API requests
- 50,000 monthly active users
- 500 MB database size
- Shared CPU
- 500 MB RAM
- 5 GB egress
- 5 GB cached egress
- 1 GB file storage

> [Added by Codex] Database schema details should be documented here when confirmed.

Suggested schema documentation placeholders:

| Table | Purpose | Status |
|---|---|---|
| users/auth identities | User authentication and account identity. | [Added by Codex] Confirm actual Supabase Auth setup. |
| jobs/renders | Render job history, status, progress, output URL. | [Added by Codex] Confirm actual table name. |
| credits/usage | Credit balance and deductions. | [Added by Codex] Confirm actual table name. |
| payments | Payment events and credit top-ups. | [Added by Codex] Confirm Razorpay integration tables. |
| assets/uploads | User upload references and lifecycle metadata. | [Added by Codex] Confirm actual storage/job mapping. |

## 17. APIs

> [Added by Codex] API route names should be verified against the current codebase before publishing externally.

Known/recommended API groups:

| API Area | Purpose |
|---|---|
| Authentication | Signup, login, Google OAuth via Supabase. |
| Uploads | Presigned upload URLs and file validation. |
| Reel jobs | Create render job, process inputs, start Remotion Lambda render. |
| Reel job status | Poll progress, success, failure, and download URL. |
| Preview | Generate preview/timeline before final render where supported. |
| Credits | Check balance, reserve/deduct/refund credits. |
| Payments | Razorpay checkout and payment verification. |

API security rules:

- Backend APIs should not be open to unauthorized users.
- Users should only access their own generated videos.
- Upload/download links should be time-limited.
- Logs should avoid sensitive data.
- Payment details should not be stored directly in the app.

## 18. AI Models Used

| AI / Model | Role |
|---|---|
| Groq Whisper | Transcription from uploaded audio/video; generates captions/subtitles and word-level timestamps. |
| Groq LLMs / Llama models | Source notes mention understanding transcript context and creating instructions for visual planning. |
| Groq Vision models | Source notes mention static image/screenshot understanding. |
| Gemini | Auto Draw visual planning and script-to-scene ideas. |
| OpenAI | Source notes mention video planning, hooks, problem/solution/benefit/CTA, title/text generation; current project context says OpenAI is paused. |
| Claude / Anthropic | Planning, improvement, debugging, possible future AI planner. |
| Custom AI Planner | Converts user instruction into timeline/scenes. |
| AI Clip Finder | Finds hooks, key points, and emotional moments in long videos. |
| AI Caption Styling | Creates short, readable, synced, professional captions. |

Groq-specific notes:

- Groq does not directly "read" a video file as video for transcription.
- Backend should first use FFmpeg to extract audio from the uploaded video.
- Extracted audio is sent to Groq Whisper.
- Groq Whisper returns transcript and word-level timestamps.
- Word-level timestamps are needed for dynamic subtitles, highlights, and karaoke-style effects.
- Source notes say Groq can be much faster than standard APIs, making the UI feel snappy.

## 19. Third-Party Services

| Service | Use |
|---|---|
| Supabase | Auth, database, jobs/history, credits. |
| AWS S3 | Temporary file storage for uploads and outputs. |
| AWS Lambda | Cloud rendering and media jobs. |
| AWS CloudFront | Source notes recommend CDN delivery to reduce direct S3 bandwidth cost. |
| Vercel | Frontend and API hosting. |
| Razorpay | Payments, plans, credits. |
| Google Search Console | SEO/indexing tracking. |
| Google Analytics | Traffic and conversion tracking. |
| Groq | Whisper transcription and possible LLM/vision support. |
| Gemini | Auto Draw visual planning and AI support. |

## 20. Deployment

Current deployment model:

| Layer | Deployment |
|---|---|
| Website/frontend/API | Vercel |
| Remotion render engine | AWS Lambda via Remotion Lambda |
| Uploads/outputs | AWS S3 temporary storage |

Deployment rules:

1. Frontend/API changes need Vercel deployment.
2. Template/render code changes need Remotion Lambda deployment.
3. Forgetting Lambda deployment can cause "template not available" errors.
4. Production render inputs must be HTTPS or signed S3 URLs, not local `/public/...` paths.
5. S3 uploads and rendered outputs expire after about 48 hours.

Useful deployment commands:

```bash
npx vercel --prod
npm run reel:lambda:deploy
```

## 21. Environment Variables

> [Added by Codex] Do not paste secrets into documentation. Keep real values in `.env.local`, Vercel environment variables, Supabase dashboard, AWS, or provider dashboards.

Environment variable tracker:

| Variable Area | Purpose | Where Managed | Status |
|---|---|---|---|
| Supabase URL/key | Auth and database connection. | `.env.local` / Vercel | [Added by Codex] Confirm names. |
| Groq API key | Whisper transcription. | `.env.local` / Vercel | [Added by Codex] Confirm name. |
| AWS credentials | S3/Lambda access. | `.env.local` / deployment env | [Added by Codex] Confirm names and permissions. |
| S3 bucket config | Upload/output storage. | `.env.local` / AWS | [Added by Codex] Confirm bucket and lifecycle policy. |
| Razorpay keys | Payments and credit top-ups. | `.env.local` / Vercel | [Added by Codex] Confirm test/live separation. |
| Google OAuth client | Google sign-in via Supabase. | Supabase provider + Google Cloud | [Added by Codex] Confirm production redirect URLs. |
| Remotion Lambda config | Render engine deployment. | `.env.local` / AWS | [Added by Codex] Confirm names. |

## 22. Development Workflow

> [Added by Codex] Recommended workflow based on current project rules.

1. Read `docs/ITNAVIDEO_PROJECT_CONTEXT.md`.
2. Read the relevant `docs/video-types/{template-name}.md` file before changing a template.
3. Make focused code changes.
4. Keep Remotion template folders code-only.
5. Update template documentation after modifying a template.
6. Run checks/builds required by the change.
7. For render/template changes, deploy both Vercel and Lambda.
8. Verify the result visually.

## 23. Coding Standards

Current project rules:

- Read existing code before writing new code.
- Match project style and conventions.
- Do not add unrelated features.
- TypeScript diagnostics should be clean.
- Avoid unused imports, props, and variables.
- Templates should remain focused on their 3 to 4 core elements.
- No random decorative elements.
- Avoid pure black backgrounds.
- Avoid low contrast.
- Do not add paid AI calls without explicit approval.
- Do not reuse old titles, subtitles, captions, or previous render data.
- Every render should use the current upload.

## 24. Security, Privacy, and Reliability

Security/privacy means user data, uploads, accounts, and payments must remain safe.

Data that needs protection:

- Uploaded videos
- Uploaded audio
- Uploaded images/logos
- Generated final videos
- User email/account data
- Payment details
- Transcripts/captions
- Project/job history

Security rules:

1. Keep user files private.
2. Do not keep public URLs permanent.
3. Use time-limited upload/download links.
4. Users should only access their own generated videos.
5. Failed/old files should auto-delete.
6. Do not directly store payment details in the app.
7. Protect API routes.
8. Do not share user data unnecessarily with third-party tools.
9. Avoid sensitive data in logs.
10. Privacy policy should be clear.

Reliability rules:

- Failed transcription should show clear error.
- Failed render should show retry option.
- Blank scenes should not start rendering.
- Credits should not be lost on failed render.
- Uploads and outputs should be cleaned after lifecycle expiry.

## 25. Credits, Pricing, and Usage Limits

Credits mean how many videos a user can generate.

Pricing means plans and payment system.

Credit usage ideas from source notes:

- Every video generation may use credits.
- Free trial can have limits.
- Paid users can receive more credits or more features.
- Long videos, podcast clips, or heavy rendering can cost more credits.
- Failed render should not waste credit.

Pricing rules:

1. Show remaining credits clearly.
2. Show video generation cost before render.
3. Refund credit on failed render.
4. Heavy video types may need separate credit logic.
5. Free users should have duration/file size limits.
6. Paid users should have higher limits.
7. Credits should be added instantly after payment.
8. Usage history should clearly show credit deduction.

## 26. SEO and Landing Pages

SEO and landing pages help users discover Itnavideo through search and marketing.

Important tracking and marketing concepts:

- Website visitors
- Signup users
- Dashboard visits
- Upload started
- Video generated
- Video downloaded
- Credits used
- Payment completed
- User source: YouTube, Instagram, Google, Facebook

> [Added by Codex] Landing pages should map to real user intent, such as auto caption video, explainer video, comparison video, whiteboard explainer, long video promo, and background replace video.

## 27. Analytics

Analytics should help the team understand where users drop off and which video types need improvement.

Track:

- Dashboard visits
- Upload events
- Render start
- Render success/failure
- Payment events
- Download events
- User source
- Credits used
- Cost by video type

Analytics rules:

1. Track important user actions.
2. Do not track only page views; track signup and generation.
3. Watch dashboard -> upload -> render -> payment -> download drop-off.
4. Track successful and failed renders.
5. Track marketing sources.
6. Use analytics to decide which video type to improve.
7. Show data in a simple internal dashboard.

## 28. Roadmap

> [Added by Codex] Roadmap status should be confirmed by founder/owner.

| Item | Status | Notes |
|---|---|---|
| Improve Auto Caption style previews | In progress / needs confirmation | Caption cards should show realistic mini reel previews and motion. |
| Confirm 6 vs 7 production video types | Open | Source doc lists Custom AI Reel; project context lists 6 production video types. |
| Expand analytics tracking | Planned | Track visitor -> signup -> upload -> render -> payment -> download. |
| Improve cost visibility | Planned | Track AWS/AI cost per video type. |
| Document database schema | Pending | Add Supabase table-level docs. |
| Document all API routes | Pending | Add endpoint, auth, request, response, failure states. |
| Future 16:9 output support | Future | Mentioned in project context as future direction. |

## 29. Pending Tasks

> [Added by Codex] This is a working list created from source notes and project documentation gaps.

- Confirm production status of every video type.
- Confirm whether Custom AI Reel is production, beta, planned, or paused.
- Add owner/status/priority for each template.
- Write or update detailed docs for each video type in `docs/video-types/`.
- Confirm Supabase schema and document it.
- Confirm API route list and document request/response shapes.
- Confirm all environment variable names without exposing values.
- Verify upload, render, failure, refund, and download flows.
- Confirm 48-hour S3 lifecycle for inputs, temporary files, and outputs.
- Confirm analytics events are implemented.
- Confirm payment/credit flow with Razorpay.

## 30. Future Ideas

Future ideas from the source document and project context:

- Custom AI Reel based on prompt and uploaded assets.
- AI clip finder for long videos.
- More advanced AI caption styling.
- Better visual planning for explainers.
- More premium promo layouts.
- Future 16:9 long-form video output.
- CloudFront CDN for serving videos efficiently.
- Fargate or alternative worker for processing that exceeds Lambda limits.

## 31. Known Limitations

Known limitations and constraints:

- Current main output is 9:16 reels.
- S3 uploads/exports are temporary and expire after about 48 hours.
- AWS Lambda has a 15-minute execution limit.
- If final video processing takes more than 15 minutes, source notes recommend moving FFmpeg processing to AWS Fargate.
- OpenAI is currently paused according to project context.
- Only English and Hinglish/Roman-script captions are supported by current project rules.
- No paid translation APIs should be used by default.
- Groq Whisper needs extracted audio from video uploads for transcription.

## 32. Risks

| Risk | Impact | Mitigation |
|---|---|---|
| Render failure after credit deduction | Bad user trust | Refund credits on failed render. |
| Blank video output | Product quality issue | Validate timeline/scenes before render. |
| Caption mismatch or bad sizing | Users may not generate videos | Preview captions as real reel output and visually QA styles. |
| API routes exposed without auth | Security/privacy risk | Protect backend APIs and enforce user ownership. |
| Permanent public media URLs | Privacy and bandwidth risk | Use signed/time-limited URLs and 48-hour lifecycle. |
| Lambda timeout | Failed render | Keep jobs under limit or move long processing to Fargate. |
| Cost growth from heavy renders | Margin risk | Track cost per video type and control credits. |
| Payment detail mishandling | Compliance/security risk | Use Razorpay and do not store raw payment details. |
| AI provider changes or failures | Render planning failure | Use deterministic fallback where appropriate. |

## 33. Decisions Made

| Decision | Reason / Notes |
|---|---|
| Use "Video Type" in user-facing UI | Avoid confusing users with technical template language. |
| Use Remotion for render composition | React components can generate animated videos. |
| Use FFmpeg for media processing | FFmpeg handles extract, trim, convert, resize, compress, screenshot, merge. |
| Use Groq Whisper for transcription | Fast transcription and word-level timestamps. |
| Use AWS S3 for temporary upload/output storage | Stores user files and generated exports. |
| Use AWS Lambda for rendering | Cloud render avoids load on user device. |
| Use Supabase for auth/database/jobs/credits | Source notes define Supabase as user/account/data layer. |
| Use Razorpay for payments | Source notes define Razorpay/payment system for paid users and credits. |
| Use 48-hour lifecycle for temporary files | Controls privacy and storage cost. |
| Avoid paid translation APIs by default | Current project language rule supports English and Roman Hinglish. |

## 34. Issue Tracker

> [Added by Codex] Use this tracker for future issues. Rows below include known risk areas from source notes and placeholders.

| ID | Date | Module | Description | Severity | Status | Root Cause | Proposed Fix | Owner | Resolved Date | Notes |
|---|---|---|---|---|---|---|---|---|---|---|
| ITV-ISS-001 | 2026-07-02 | Auto Caption | Caption style previews may not match final reel output closely enough. | High | Open | Preview cards can look static, oversized, or too shadow-heavy. | Use realistic mini reel frames, safe-area captions, reduced shadows, and subtle animation preview. | TBD | TBD | Source/founder feedback. |
| ITV-ISS-002 | 2026-07-02 | Product Catalog | Source doc lists 7 video types, but project context lists 6 production video types. | Medium | Open | Production status not confirmed in documentation. | Confirm status of Custom AI Reel and update tracker. | TBD | TBD | [Added by Codex] Documentation consistency issue. |
| ITV-ISS-003 | 2026-07-02 | Render Flow | Blank videos must be prevented. | Critical | Open | Empty scenes/captions/timeline could reach render. | Block render when required timeline data is missing. | TBD | TBD | Source rule. |
| ITV-ISS-004 | 2026-07-02 | Credits | Failed render should not waste user credits. | High | Open | Render or transcription can fail after credit reservation. | Refund or avoid final deduction until success. | TBD | TBD | Source rule. |
| ITV-ISS-005 | 2026-07-02 | Security | API routes must not be open to unauthorized users. | Critical | Open | Missing or inconsistent auth checks. | Enforce auth and user ownership on all job/media APIs. | TBD | TBD | Source security rule. |

## 35. Improvement Tracker

> [Added by Codex] Use this tracker for product/design/engineering improvements.

| Module | Current State | Suggested Improvement | Expected Impact | Priority | Status |
|---|---|---|---|---|---|
| Auto Caption styles | Preview cards have improved but need polish. | Make every style preview look like real final output with safe-area placement and subtle animation. | Higher user trust and more generation attempts. | High | Open |
| Template docs | Video type details are distributed across notes. | Maintain one detailed doc per video type in `docs/video-types/`. | Easier onboarding and fewer regressions. | High | Open |
| Database docs | Schema details not fully documented here. | Add Supabase table map, relationships, RLS notes, and ownership rules. | Better developer clarity and safer changes. | High | Open |
| API docs | Endpoints need formal request/response docs. | Document auth, payloads, responses, errors, and retry behavior. | Easier debugging and future team onboarding. | High | Open |
| Analytics | Source notes identify key events. | Implement/confirm funnel analytics from visitor to paid user. | Better product and marketing decisions. | Medium | Open |
| Cost tracking | Source notes mention AWS/AI cost per video type. | Track render duration, provider usage, storage, and bandwidth by video type. | Better margins and pricing decisions. | Medium | Open |
| Security docs | Rules exist as notes. | Add a formal security checklist for auth, URLs, logs, and file lifecycle. | Lower privacy and data risk. | High | Open |

## 36. Change Log

| Date | Change | Owner |
|---|---|---|
| 2026-07-02 | [Added by Codex] Reorganized source Google Docs export into professional internal product documentation with trackers, placeholders, and marked additions. | Codex |

## 37. Codex Additions Register

The following were added by Codex as structure, placeholders, or recommendations:

- Table of contents.
- Vision statement.
- Product principles list.
- Production status warning for 6 vs 7 video types.
- Template tracker and status board.
- Per-template profile tables.
- Auto Caption style QA note.
- Project structure table.
- Database schema placeholder table.
- API area table.
- Environment variable tracker without secret values.
- Development workflow.
- Roadmap table.
- Pending tasks list.
- Risk register.
- Issue tracker.
- Improvement tracker.
- Change log.

All of these additions are marked with `[Added by Codex]` where they introduce new structure, interpretation, or placeholder content.
