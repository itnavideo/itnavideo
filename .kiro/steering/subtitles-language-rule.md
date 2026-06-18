---
inclusion: auto
---

# Subtitle & Caption Language Rules

## Core Rule
User dashboard me jo language select kare, wahi language me subtitles/captions aane chahiye — no silent fallback to English or Hinglish.

## How It Works
1. User selects subtitle language in dashboard (e.g., Kannada, Hindi, Tamil, Spanish, etc.)
2. `subtitleOutputLanguage` is sent to `/api/reels/jobs` in the request body
3. After Groq transcription (which returns English/Hinglish), `repairTranscriptionToLanguage()` translates to the user's selected language using OpenAI Chat Completions API
4. Translated segments preserve original timing (start/end) from Groq
5. `buildCompareCaptionsFromGroq(renderWindow)` then builds render-ready captions from those translated segments

## Template-Specific Caption Behavior

| Template | Captions Needed? | Source |
|----------|-----------------|--------|
| AUTO_CAPTION_REEL | YES — primary feature | Word-grouped from transcript |
| VIDEO_SIMPLE_EXPLAINER | YES — subtitle strip | From transcript segments |
| COMPARE_EXPLAINER | YES — bottom strip | From transcript segments |
| IMAGE_STORY_COLLAGE | Optional text overlays | From scene beats |
| AUTO_DRAW_EXPLAINER | NO — whiteboard scenes | Uses scenes, not captions |

## Rules for New Templates
- If a template shows subtitles/captions, it MUST respect `subtitleOutputLanguage`
- Never silently fall back to English if translation fails — show an error to the founder
- The `shouldSkipVisibleTextKey` function must include `captions`, `subtitleChunks`, `transcript` in its skip list so non-Latin script text doesn't get blocked by `hasForbiddenScriptText`
- The translation uses `/v1/chat/completions` (NOT `/v1/responses`) for universal API compatibility

## API Format
Translation uses OpenAI Chat Completions with `response_format: { type: 'json_object' }`:
- Model: `gpt-4o-mini` (env: `TRANSCRIPT_ENGLISH_REPAIR_MODEL`)
- Returns: `{ transcript: string, segments: [{index, text}] }`
- Segment count must match input — only text changes, timing preserved
