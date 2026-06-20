---
inclusion: auto
description: Rules for subtitle language handling — use Groq Whisper for default captions, no paid translation APIs, Hindi/Hinglish produces clean roman captions.
---

# Subtitle & Caption Language Rules

## Core Rule
Subtitles are generated from the uploaded audio/video language using Groq Whisper. No paid translation APIs are used for default subtitle flow. Multi-language translation is paused.

## How It Works (Current — Simplified)
1. User uploads audio/video
2. Groq Whisper transcribes the speech (returns English or Hinglish depending on detected language)
3. Only 2 subtitle options: **English** or **Hinglish** (Hindi+English mix in Roman script)
4. No paid translation APIs are called (OpenAI, Google Cloud, AWS Translate are paused)
5. `buildCompareCaptionsFromGroq(renderWindow)` builds render-ready captions from Groq output

## Current Policy
- Multi-language translation is **PAUSED** (no Kannada, Urdu, Arabic, French etc.)
- Only English and Hinglish subtitles are supported
- Groq handles both natively without external APIs
- When we grow/get paying users, multi-language can be added as a paid/Pro feature
- Do NOT add translation API calls without explicit approval

## Template-Specific Caption Behavior

| Template | Captions Needed? | Source |
|----------|-----------------|--------|
| AUTO_CAPTION_REEL | YES — primary feature | Word-grouped from transcript |
| VIDEO_SIMPLE_EXPLAINER | YES — subtitle strip | From transcript segments |
| COMPARE_EXPLAINER | YES — bottom strip | From transcript segments |
| IMAGE_STORY_COLLAGE | Optional text overlays | From scene beats |
| AUTO_DRAW_EXPLAINER | NO — whiteboard scenes | Uses scenes, not captions |
| VOICE_SYNCED_NOTES | YES — note lines | From transcript segments |
| LONG_VIDEO_PROMO | Optional captions | If promo clip has speech |

## Rules for New Templates
- Subtitles come from Groq Whisper transcript — no external translation
- Hindi/Hinglish audio → clean Roman Hinglish captions (no Devanagari)
- English audio → English captions
- Each render gets fresh captions from current upload only (no old/cached data)
- Keep subtitle text short and readable (max 10 words per line)
