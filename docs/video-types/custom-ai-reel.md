# Reference Note

This is a detailed Video Type spec. Start with `docs/ITNAVIDEO_MASTER_DOC.md` for the latest source of truth, then use this file for Custom AI Reel implementation details.

# Custom AI Reel

## Basic Information

| Field | Value |
|-------|-------|
| Video Type Name | Custom AI Reel |
| Internal ID | `CUSTOM_AI_REEL` |
| Composition ID | `CUSTOM-AI-REEL` |
| Dashboard Mode | `customAiReel` |
| Category | Creator |

## Purpose

Let users describe a custom 9:16 reel in simple English, optionally upload images/screenshots and a logo, and receive a polished premium reel generated from a structured timeline.

Milestone 1 supports text scenes, uploaded image/screenshot scenes, logo/end screen, simple timeline JSON, and Remotion render. Video clips and voiceover are deferred to later milestones. Do not show subtitle language dropdowns or a subtitle toggle in the dashboard for this video type.

## Inputs

| Input | Type | Required | Milestone |
|-------|------|----------|-----------|
| What do you want in your video? | Textarea | Yes | 1 |
| Images/screenshots | Multiple images | No | 1 |
| Logo | Image | No | 1 |
| Video clip | Video file (MP4/MOV/WEBM) | No | 2 |
| Voiceover / Audio | Audio file (MP3/WAV/M4A) | No | 3 |

Media is optional. Text-only reels are allowed when the prompt clearly asks for a text-based video.

## English Prompt Rule

The prompt should be in simple English for best results, but validation must be forgiving. Grammar mistakes and simple phrasing are accepted.

Reject only prompts that are mostly non-English/non-Latin or too unclear to plan. User-facing error:

```txt
Please describe your video in simple English for best results.
```

## Output

- Format: 1080x1920, 9:16 reel
- Max duration: 60 seconds
- Default Milestone 1 duration: 30 seconds when timing is not provided
- If user gives exact timing, follow it as much as possible and clamp to 60 seconds
- Automatic `styleLock` and sparse `soundCues` are included so text, image, video, logo, and CTA scenes share one premium visual/sound language

## Milestone 1 Flow

```txt
Prompt + optional uploaded images/logo
→ deterministic timeline planner
→ validate timeline
→ Remotion render
```

The planner uses uploaded media only. Do not add stock assets, random icons, stickers, music, or generated images.

The render route also creates a shared style lock from the prompt and timeline. This can select finance, education, creator, luxury, news, or tech visual language, then pass matching low-volume sound cues for scene reveals.

The same style lock carries color grade, camera movement, depth, pacing, and audio-mix metadata. Custom AI Reel should use this to avoid disconnected scene styles and to keep text/image/video/logo scenes in one premium editing language.

## Timeline Rules

- First scene starts at `0`
- Last scene ends at or before `60`
- Scenes do not overlap
- Uploaded images are used in order when the user asks for images/screenshots
- Logo is used only for end screen/logo scene
- If no media is uploaded, create a premium text-only timeline

## Premium Design Components

The Remotion template should include code-level components with these responsibilities:

- `SoftBlurBackground`
- `SafeAreaContainer`
- `PremiumTitleBlock`
- `MediaShowcaseFrame`
- `ScreenshotZoomCard`
- `ImageMotionCard`
- `LogoEndScreen`
- `CTAEndCard`

Design should feel like a polished modern SaaS/creator reel:

- clean typography
- premium spacing
- strong hierarchy
- readable text
- modern gradients
- soft shadows
- clean borders
- subtle glow only
- no plain black empty background

## Motion

Use subtle professional motion:

- fade in
- slide up
- smooth zoom
- slow pan
- card reveal
- logo reveal
- CTA pulse

Do not over-animate every element.

## Premium Sound

Custom AI Reel may use automatic diegetic SFX for visible events: card reveals, image reveals, typing/text moments, warning beats, money/finance beats, logo reveal, and final CTA. SFX must be sparse, low volume, and sourced from `public/assets/reusable/sound-effects/`.

Audio ducking is expected for ambience/SFX so voiceover or uploaded audio stays primary.

## Deferred Milestones

- Milestone 4: `/custom-ai-reel` SEO landing page ✅ DONE

## QA Checklist

- [ ] Prompt with exact timing creates matching timeline JSON
- [ ] Prompt without timing creates clean auto timeline
- [ ] Multiple uploaded images render one by one
- [ ] Logo appears only on end screen
- [ ] Text-only reel renders without media
- [ ] Output is 9:16
- [ ] Duration is capped at 60 seconds
- [ ] Text remains readable
- [ ] Images/screenshots are not cropped badly
- [ ] Mobile dashboard form does not overflow after multiple uploads
- [ ] Contact sheet looks premium, not basic
