# Subtitle & Language Rules

## Current Policy (Simplified)

| Rule | Status |
|------|--------|
| Multi-language translation | ⏸️ PAUSED |
| Supported languages | English, Hinglish only |
| Transcription provider | Groq Whisper |
| Paid translation APIs | NOT used |
| Hindi/Hinglish output | Roman script (no Devanagari) |

## How Subtitles Work

1. User uploads audio/video
2. Groq Whisper transcribes the speech
3. Returns English or Hinglish depending on detected language
4. Captions are built from transcript word timings
5. No external translation API is called

## Language Output Rules

| Input Language | Caption Output |
|---------------|---------------|
| English audio | English captions |
| Hindi audio | Clean Roman Hinglish (no Devanagari) |
| Hinglish audio | Clean Roman Hinglish |
| Other languages | Best-effort from Groq (English/Hinglish) |

## Template-Specific Caption Behavior

| Template | Captions Needed? | Source |
|----------|-----------------|--------|
| AUTO_CAPTION_REEL | YES — primary feature | Word-grouped from transcript |
| VIDEO_SIMPLE_EXPLAINER | YES — subtitle strip | From transcript segments |
| COMPARE_EXPLAINER | YES — bottom strip | From transcript segments |
| IMAGE_STORY_COLLAGE | Optional text overlays | From scene beats |
| AUTO_DRAW_EXPLAINER | NO — whiteboard scenes | Uses AI scenes, not captions |
| VOICE_SYNCED_NOTES | YES — note lines | From transcript segments |
| LONG_VIDEO_PROMO | Optional captions | If promo clip has speech |

## DO NOT Rules

- Do NOT use OpenAI translation API
- Do NOT use Google Cloud Translation
- Do NOT use AWS Translate
- Do NOT use Azure Translator
- Do NOT output Devanagari script in captions
- Do NOT silently fall back to English if transcription fails — show error
- Do NOT reuse old/cached transcript data between renders

## Future Plan

When we grow and get paying users:
- Multi-language can be added as a paid/Pro feature
- Translation via Gemini (free) or OpenAI (paid)
- Supported languages: Kannada, Tamil, Telugu, Urdu, Arabic, French, etc.
- Each language would need proper font support in Remotion

## Last Updated

June 2026
