# Archived / Reference Note

This document is archived/reference material. Please use `docs/ITNAVIDEO_MASTER_DOC.md` as the latest source of truth for Itnavideo.

# Video Type Rules

## How to Create a New Video Type

A video type is NOT complete until all 7 steps are done:

| Step | File/Location | What to Do |
|------|--------------|-----------|
| 1 | `remotion/templates/TEMPLATE_NAME/template.tsx` | Create Remotion composition |
| 2 | `remotion/index.tsx` | Register composition |
| 3 | `services/ai/reelPlanner.ts` | Add to the video type registry |
| 4 | `app/dashboard/page.tsx` | Add video type card + mode config |
| 5 | `app/api/reels/jobs/route.ts` | Add render flow support |
| 6 | Lambda deploy | `npm run reel:lambda:deploy` |
| 7 | Vercel deploy | `npx vercel --prod` |

## Infrastructure Budget Rule

Build every new Video Type with the current startup/free-tier limits in mind:

- Vercel is the free plan and is only for frontend, dashboard, SEO pages, lightweight API orchestration, and status polling.
- Do not move heavy render assets into Vercel deployment folders just to make them easy to access.
- AWS should be treated as the current `$100 free credit / free-tier constrained` render budget.
- Avoid always-on servers, expensive workers, long-running FFmpeg jobs, high-memory Lambda defaults, large asset transfers, or paid provider dependencies without explicit founder approval.
- Prefer the existing S3 presign → API orchestration → Remotion Lambda → status polling pipeline.

## Naming Convention

```text
Official Name:       "Auto Caption Reel"
Remotion Folder:     remotion/templates/AUTO_CAPTION_REEL/
Composition ID:      AUTO-CAPTION-REEL          (dashes only)
Dashboard Card ID:   "auto-caption-reel"
API Mode:            "autoCaption" (camelCase)
```

**Rules:**
- Remotion Composition IDs can only contain `a-z`, `A-Z`, `0-9`, and `-` (NO underscores)
- Video type implementation folder names use underscores: `TEMPLATE_NAME`
- One name everywhere — no mismatches

## Video Type Registry Format

```typescript
TEMPLATE_NAME: {
  templateName: 'TEMPLATE_NAME',
  compositionId: 'TEMPLATE-NAME',
  allowedMedia: ['audio', 'video'],
  transcriptRequirement: 'required',
  plannerMode: 'videoExplainer',
  mediaFit: 'videoExplainer',
}
```

## Required Props for Every Video Type

- `mediaSrc` — S3 signed URL of uploaded media
- `durationSeconds` — Render duration
- `captions` or equivalent subtitle data — From Groq transcript
- Video-type-specific props (images, titles, sticker style, etc.)

## Video Type Behavior Rules

- Every render starts fresh from the current upload. Never reuse old data.
- Lambda inputs must be HTTPS/signed S3 URLs. Never local paths.
- Each video type must clearly show what the user needs to upload.
- Render stability first — get basic render working before heavy design.
- Video type implementation folders are code-only folders. No images/fonts/sounds inside `remotion/templates/`.
- Planned/promo/custom Video Types should use `styleLock` and `soundCues` so scenes share one palette, motion family, color grade, pacing language, and sound pack.
- Auto Caption is the exception: preserve the user's original video/audio and do not add SFX/music/cinematic treatment by default.

## Premium Editor Checklist for New Video Types

- [ ] One shared visual world: palette, typography, labels/captions, icon/sticker style, and motion language match.
- [ ] Color grade is intentional: cool/trust for finance, clean/paper for education, higher contrast for creator/promo.
- [ ] Camera movement is subtle: Ken Burns/pan/controlled motion, no random aggressive shake.
- [ ] Depth exists: soft shadows, blur, vignette, grain, or foreground sheen where appropriate.
- [ ] Pacing changes something meaningful about every 3 seconds without exhausting the viewer.
- [ ] Sound cues are diegetic and tied to visible actions only.
- [ ] Audio ducking keeps voiceover/uploaded audio clear.
- [ ] Finance micro-interactions use precise shimmer/click/cash/success chime cues instead of loud effects.

## Testing Checklist for New Video Type

- [ ] Composition renders in Remotion Studio (`npm run reel:studio`)
- [ ] Dashboard card shows correctly
- [ ] Upload flow works for the video type's accepted media
- [ ] Transcription produces captions
- [ ] Props are passed correctly to Remotion
- [ ] Lambda render completes successfully
- [ ] Download link works
- [ ] Error states show proper messages

## Last Updated

June 2026
