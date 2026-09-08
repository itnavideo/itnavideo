---
inclusion: auto
description: Master rules for subtitles, language, assets, and templates are consolidated in AGENTS.md.
---

# Subtitle & Caption Language Rules

> **Master Rule**: All subtitle, caption, asset, and template rules are centrally defined in [AGENTS.md](../../AGENTS.md). Refer to `AGENTS.md` section 3 ("Subtitle & Caption Language Rule") for the full policy and template behavior table.

## Quick Summary
- Groq Whisper handles transcription (English and Roman Hinglish only).
- Multi-language translation is paused. No paid translation APIs.
- Hindi/Hinglish audio → clean Roman Hinglish captions (no Devanagari).
- Each render gets fresh captions from the current upload only.
- For complete details, see `AGENTS.md`.
