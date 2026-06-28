# Known Issues & Fixes

## Currently Known Issues

| Issue | Status | Template | Notes |
|-------|--------|----------|-------|
| OpenAI API key expired (401) | ⏸️ Paused | All | Not blocking — local planner works without OpenAI |
| Sticker poses may look too similar | 🔍 Investigate | Compare Explainer | Code changes pose correctly, but some character PNGs look visually similar |

## Fixed Issues (Recent)

| Issue | Fix | Date |
|-------|-----|------|
| Captions not showing in Auto Caption Reel | Fixed prop name mismatch + word-level timing | May 2026 |
| IMAGE_STORY_COLLAGE blank video | Rewrote with inline styles (no Tailwind in Lambda) | May 2026 |
| S3 CORS upload failure | Applied CORS config via `npm run aws:s3:cors` | May 2026 |
| Sticker transparency (white backgrounds) | Batch-processed 91 PNGs with Python script | May 2026 |
| Dashboard mobile UX (scroll to upload) | Added auto-scroll on template select | June 2026 |
| Video Simple Explainer random images | Cleared unused image arrays for videoExplainer mode | June 2026 |
| `getTemplateName()` wrong fallback | Fixed to handle all 7 templates correctly | May 2026 |
| Groq API key BOM character | Strip BOM/quotes before Authorization header | May 2026 |

## Template-Specific Notes

### Compare Explainer
- Sticker pose changes based on caption keywords (left, right, warning, success, etc.)
- Sticker sizes: full_body 720×980, half_body 780×860
- Sticker zone starts at y=840 (just below explanation text box)

### Auto Caption Reel
- 10 subtitle styles available
- Frame border: 12px padding + 24px rounded border
- Video sits inside premium rounded frame

### Long Video Promo / Voice Synced Notes
- Must have Lambda deployed with latest site bundle
- "Template not available" error = Lambda not redeployed after code change

## Common Error Patterns

| Error Message | Cause | Fix |
|---------------|-------|-----|
| "Template not available" | Lambda site bundle doesn't include the template | `npm run reel:lambda:deploy` |
| "Could not detect clear speech" | Groq transcription returned empty | User needs clearer audio |
| "Browser blocked or could not reach" | S3 CORS not configured | `npm run aws:s3:cors` |
| Upload fails silently | S3 presign URL expired or CORS issue | Check S3 CORS + presign logic |

## Last Updated

June 2026
