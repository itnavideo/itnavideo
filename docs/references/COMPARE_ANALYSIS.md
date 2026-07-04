# Compare Template — Reference Video Analysis

## 18 reference videos analyzed (720×1280, 22-99s)

## Key Findings

### Layout Pattern (consistent across ALL reference videos)
- **Static layout** — very few scene transitions (only 12 scene-change keyframes from 18 videos)
- The layout stays fixed: Title labels → Image panels → VS badge → Caption → Sticker
- Only the TEXT and STICKER change throughout the video
- This is the opposite of Dynamic Creator (which has many cuts)

### Animation Patterns Observed
1. **Entry animations** — elements slide/spring in at the start
2. **Sticker is the hero** — it's the most dynamic element, pointing left/right based on context
3. **Caption text swaps** — each new caption pops/springs in, old one pops out
4. **Label float** — subtle up/down floating on A/B labels (already implemented)
5. **VS badge pulse** — periodic gentle pulse to draw attention to the center
6. **Image subtle zoom** — very slight Ken Burns on the comparison images (1-2%)

### What Makes These Look Professional
- Clean white background (separates from dark-theme reels)
- Bold outlined labels (A/B) with drop shadow
- Consistent spacing — nothing overlaps
- Sticker character adds personality and trust
- Caption is SHORT (7 words max per line, 2 lines max)
- Sound effects on transitions (whoosh, pop, ding)

## Improvements Applied

| Element | Before | After |
|---------|--------|-------|
| Title labels (A/B) | Static float | Spring slide-in from sides + float |
| Image panels | Instant visible | Slide-in from left/right with opacity |
| VS badge | Static | Spring pop + subtle periodic pulse |
| Caption | Simple 0.98→1 scale | Spring-based 0.92→1 per caption change |
| Sticker bounce | damping: 8 | damping: 7, stiffness: 180 (snappier) |
