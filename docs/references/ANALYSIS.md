# Reference Video Analysis

## Summary

### Shorts (6 videos, all 9:16 vertical)
| Video | Resolution | Duration | Scene Changes | Cuts per 15s |
|-------|-----------|----------|---------------|--------------|
| Short 1 | 360×640 | 119s | 26 | 3.3 |
| Short 2 | 360×640 | 99s | 36 | 5.5 |
| Short 3 | 360×640 | 88s | 55 | 9.4 |
| Short 4 | 360×640 | 89s | 16 | 2.7 |
| Short 5 | 360×640 | 86s | 31 | 5.4 |
| Short 6 (Insurance) | 360×640 | 89s | 28 | 4.7 |

**Average pacing: ~5 cuts per 15 seconds** — this is the "professional Indian creator" rhythm.

### Long-form (7 videos, all 16:9 horizontal)
- CA Rahul Malodia style case studies (12-28 min)
- Finance/business education content
- These serve as the *source content* that users would upload to ItnaVideo

---

## Key Patterns Observed

### 1. Pacing & Rhythm
- **Professional shorts use 4-6 scene changes per 15 seconds**
- Short 3 (9.4 cuts/15s) is very fast-paced — likely a quick-tips or listicle format
- Short 4 (2.7 cuts/15s) is slower — likely a single-topic explainer with fewer visual changes
- **Takeaway**: Our templates should support dynamic timing, not fixed intervals

### 2. Hook Strategy (First 0.5-2 seconds)
Based on extracted hook frames:
- Bold text overlay immediately visible (large, centered)
- High-contrast: white or yellow text on dark/blurred background
- Creator face visible within first frame (builds trust)
- Question or shocking statement as text hook
- **Takeaway**: Templates need a "hook frame" with immediate text + creator visibility

### 3. Text Styles (from keyframe analysis)
- **Primary text**: Bold, 40-60px equivalent, white with subtle drop shadow
- **Highlight words**: Yellow (#FACC15) or amber for emphasis
- **Text animation pattern**: Fade-in from bottom (translateY) or scale-in from center
- Labels/categories: Small uppercase text at top (like "FINANCE" or "CAREER")
- **Takeaway**: Support bold headline text with word-level highlighting

### 4. Layout Zones (9:16 vertical)
```
┌─────────────────────┐
│  Category label     │  ← 5% from top
│                     │
│  [Creator Video]    │  ← Top 40% of frame
│                     │
│─────────────────────│
│  KEY VISUAL /       │  ← Middle 30%
│  SUPPORT IMAGE      │
│                     │
│─────────────────────│
│  Subtitles here     │  ← Bottom 25%
│  @handle            │
└─────────────────────┘
```

### 5. Transitions Observed
- **Zoom-in**: Slow 1.02-1.05x zoom on static images (Ken Burns effect)
- **Slide**: Left-to-right or bottom-to-top reveals
- **Cut**: Hard cuts between scenes (most common, 70% of transitions)
- **Dissolve**: Brief cross-fade for emotional/story moments
- **Scale pulse**: Quick 1.0 → 1.05 → 1.0 on text appearance (spring physics)
- **Takeaway**: Our Remotion templates should use spring() for text and interpolate() for zooms

### 6. Color Grading
- Dark backgrounds dominate (not pure black, more like #0D0D12)
- Text areas have subtle gradient overlays for readability
- Creator video sections slightly warmer tone
- Accent colors: Yellow/Amber for urgency, Blue/Indigo for trust, Green for money/success

### 7. What Makes These Look "Professional"
1. **Consistent spacing** — safe zones respected, nothing touches edges
2. **Text hierarchy** — clear primary/secondary/muted levels
3. **Motion restraint** — subtle animations, not flashy (spring easing, not bounce)
4. **Audio-visual sync** — scene changes align with speech pauses
5. **Clean typography** — one font family, 2-3 weights max
6. **Breathing room** — scenes hold for 2-4 seconds, not rapid-fire

---

## Recommendations for ItnaVideo Templates

### Immediate Improvements
1. **Add Ken Burns zoom** to static images (1.0 → 1.03 over scene duration)
2. **Spring-based text entry** with `spring({ damping: 15, stiffness: 120 })`
3. **Hook frame** in first 0.5s: large title text + creator thumbnail visible
4. **Scene timing** should respect transcript pauses (2-4s per scene)
5. **Text shadow** on all overlay text: `0 2px 8px rgba(0,0,0,0.6)`

### Animation Library to Build
- `fadeInUp`: opacity 0→1, translateY 20→0, 300ms spring
- `scaleIn`: scale 0.85→1, opacity 0→1, 250ms spring
- `zoomKenBurns`: scale 1.0→1.03, linear over full scene
- `slideInRight`: translateX 100%→0, 400ms spring
- `highlightPulse`: scale 1→1.05→1, 200ms for word emphasis
- `hardCut`: instant opacity swap (no transition)

### Per-Template Notes
- **Auto Caption**: Add subtle zoom on video during speech, word highlight with scale pulse
- **Compare Explainer**: Slide-in panels from left/right, sticker should have spring entrance
- **Long Video Promo**: Thumbnail zoom, title slide-in from bottom, CTA pulse
- **Dynamic Creator**: Jump-cut rhythm should match 4-6 cuts/15s pacing
- **Quote/Motivation**: Text typewriter or word-by-word reveal, background parallax
- **Auto Draw**: Drawing animation should match voiceover pacing, not fixed speed
