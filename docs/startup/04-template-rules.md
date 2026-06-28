# Template Rules

## How to Create a New Template

A template is NOT complete until all 7 steps are done:

| Step | File/Location | What to Do |
|------|--------------|-----------|
| 1 | `remotion/templates/TEMPLATE_NAME/template.tsx` | Create Remotion composition |
| 2 | `remotion/index.tsx` | Register composition |
| 3 | `services/ai/reelPlanner.ts` | Add to REEL_TEMPLATE_REGISTRY |
| 4 | `app/dashboard/page.tsx` | Add template card + mode config |
| 5 | `app/api/reels/jobs/route.ts` | Add render flow support |
| 6 | Lambda deploy | `npm run reel:lambda:deploy` |
| 7 | Vercel deploy | `npx vercel --prod` |

## Naming Convention

```
Official Name:       "Auto Caption Reel"
Remotion Folder:     remotion/templates/AUTO_CAPTION_REEL/
Composition ID:      AUTO-CAPTION-REEL          (dashes only)
Dashboard Card ID:   "auto-caption-reel"
API Mode:            "autoCaption" (camelCase)
```

**Rules:**
- Remotion Composition IDs can only contain `a-z`, `A-Z`, `0-9`, and `-` (NO underscores)
- Template folder names use underscores: `TEMPLATE_NAME`
- One name everywhere — no mismatches

## Template Registry Format

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

## Required Props for Every Template

- `mediaSrc` — S3 signed URL of uploaded media
- `durationSeconds` — Render duration
- `captions` or equivalent subtitle data — From Groq transcript
- Template-specific props (images, titles, sticker style, etc.)

## Template Behavior Rules

- Every render starts fresh from the current upload. Never reuse old data.
- Lambda inputs must be HTTPS/signed S3 URLs. Never local paths.
- Each template must clearly show what the user needs to upload.
- Render stability first — get basic render working before heavy design.
- Templates are code-only folders. No images/fonts/sounds inside `remotion/templates/`.

## Testing Checklist for New Template

- [ ] Composition renders in Remotion Studio (`npm run reel:studio`)
- [ ] Dashboard card shows correctly
- [ ] Upload flow works for the template's accepted media
- [ ] Transcription produces captions
- [ ] Props are passed correctly to Remotion
- [ ] Lambda render completes successfully
- [ ] Download link works
- [ ] Error states show proper messages

## Last Updated

June 2026
