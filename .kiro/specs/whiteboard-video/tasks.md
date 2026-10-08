# Whiteboard Video — Implementation Tasks

## Phase 1: Core Template

- [ ] Task 1: Create `remotion/templates/WHITEBOARD_VIDEO/template.tsx` — Main composition with WhiteboardCard, CorporateBackground, MarkerText writing animation, point-by-point reveal synced to timing
- [ ] Task 2: Create `services/ai/whiteboardPlanner.ts` — Gemini-powered planner that extracts title + 5-8 key points from transcript with timing, colors, and bullet types. Includes fallback deterministic planner.
- [ ] Task 3: Register in `remotion/index.tsx` and `services/ai/reelPlanner.ts` (REEL_TEMPLATE_REGISTRY)
- [ ] Task 4: Add mode handling in `app/api/reels/jobs/route.ts` — whiteboardVideo mode, calls whiteboardPlanner, passes points to template

## Phase 2: Dashboard + Landing

- [ ] Task 5: Add to `app/dashboard/page.tsx` — videoTypeCards entry, modeConfig, Mode type
- [ ] Task 6: Create `app/video-types/whiteboard-video/page.tsx` + `app/whiteboard-video/page.tsx` re-export
- [ ] Task 7: Add to `components/landing/Hero.tsx` and `components/landing/VideoTypeGuide.tsx`

## Phase 3: Deploy + Test

- [ ] Task 8: Create preview image `public/preview/Whiteboard Video.png`
- [ ] Task 9: Build, deploy Vercel + Lambda, test end-to-end render
- [ ] Task 10: Verify output quality — text readable, timing synced, professional look

## Future (Not V1)
- [ ] Add 10 whiteboard style options (dark board, chalkboard, neon, paper, etc.)
- [ ] Add style picker in dashboard
- [ ] Add simple SVG doodle icons (arrows, charts, lightbulbs)
- [ ] Add marker drawing animation (stroke reveal)
