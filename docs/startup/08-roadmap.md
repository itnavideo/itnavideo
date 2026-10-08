# Archived / Reference Note

This document is archived/reference material. Please use `docs/ITNAVIDEO_MASTER_DOC.md` as the latest source of truth for Itnavideo.

# Roadmap

## Short-Term (Next 2-4 Weeks)

| Priority | Task | Status |
|----------|------|--------|
| High | Clean remaining dead code in reelPlanner.ts | Planned |
| High | Verify all 7 templates render correctly on production | Ongoing |
| High | Fix OpenAI billing (restore API key) | Waiting |
| Medium | Improve sticker pose distinctness (regenerate similar-looking PNGs) | Planned |
| Medium | Add render error retry with exponential backoff | Planned |
| Low | Add more subtitle styles (beyond current 10) | Planned |

## Next Templates (Ideas)

| Template | Description | Difficulty |
|----------|-------------|-----------|
| Facecam Overlay | Speaker video + animated lower thirds | Medium |
| Product Showcase | E-commerce product reel with price/CTA | Medium |
| Quote/Motivation | Text quote with background music + motion | Easy |
| Poll/Quiz | Interactive-style poll reel | Medium |
| Before/After | Split-screen comparison reel | Easy |
| Tutorial Steps | Step-by-step how-to reel | Medium |

## Paid Features (Future)

| Feature | Tier | Notes |
|---------|------|-------|
| Multi-language subtitles | Pro | Kannada, Tamil, Urdu, Arabic, French |
| Custom branding/watermark | Pro | User logo + colors |
| Longer videos (2-3 min) | Studio | Higher Lambda timeout |
| Priority rendering | Studio | Dedicated Lambda capacity |
| Custom sticker upload | Pro | User's own character |
| Background music library | All | Mood-based selection |
| Batch rendering | Studio | Multiple videos at once |

## Future Multi-Language Plan

When translation is re-enabled:
1. Use Gemini (free) as primary translator
2. OpenAI as fallback (when billing restored)
3. Support 13+ languages
4. Font packs for non-Latin scripts (Devanagari, Kannada, Tamil, Arabic)
5. Per-language subtitle style adjustments

## Funding / Growth

| Milestone | Target |
|-----------|--------|
| First 100 paid users | Q3 2026 |
| YC application | When metrics ready |
| Seed round | After product-market fit |
| 1000 monthly renders | Q4 2026 |

## Last Updated

June 2026
