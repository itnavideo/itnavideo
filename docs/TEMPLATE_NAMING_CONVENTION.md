# Template Naming Convention

## Rule: ONE name, used EVERYWHERE consistently

When creating a new template, derive ALL identifiers from the **Official Name**:

```
Official Name:       "Auto Caption Reel"
Remotion Folder:     remotion/templates/AUTO_CAPTION_REEL/
Composition ID:      AUTO-CAPTION-REEL          (dashes only, Remotion rule)
Template Page:       app/templates/auto-caption-reel/
Page URL:            /templates/auto-caption-reel
Dashboard Card ID:   "auto-caption-reel"
Dashboard Title:     "Auto Caption Reel"
API Mode:            "autoCaption" (camelCase)
Registry Key:        AUTO_CAPTION_REEL
```

## Current 5 Templates

| Official Name | Folder | Composition | URL | Mode | Card ID |
|---|---|---|---|---|---|
| Auto Caption Reel | AUTO_CAPTION_REEL | AUTO-CAPTION-REEL | /templates/auto-caption-reel | autoCaption | auto-caption-reel |
| Video Simple Explainer | VIDEO_SIMPLE_EXPLAINER | VIDEO-SIMPLE-EXPLAINER | /templates/video-simple-explainer | videoExplainer | video-simple-explainer |
| Compare Explainer | COMPARE_EXPLAINER | comparisonImages* | /templates/compare-explainer | compare | compare-explainer |
| Cinematic Collage | IMAGE_STORY_COLLAGE | IMAGE-STORY-COLLAGE | /templates/cinematic-collage | imageStoryCollage | cinematic-collage |
| Auto Draw Explainer | AUTO_DRAW_EXPLAINER | AUTO-DRAW-EXPLAINER | /templates/auto-draw-explainer | autoDraw | auto-draw-explainer |

*Compare uses legacy composition ID "comparisonImages" — don't change (Lambda has it cached)

## How to Name a New Template

1. Pick a clear 2-4 word name (e.g. "Quiz Story Reel")
2. Folder: QUIZ_STORY_REEL
3. Composition: QUIZ-STORY-REEL
4. Page: /templates/quiz-story-reel
5. Mode: quizStory
6. Card ID: "quiz-story-reel"
7. Dashboard title: "Quiz Story Reel"

## Files to Update When Adding a Template

1. `remotion/templates/TEMPLATE_NAME/template.tsx`
2. `remotion/index.tsx` — import + register
3. `services/ai/reelPlanner.ts` — ReelTemplateName type + REEL_TEMPLATE_REGISTRY
4. `app/api/reels/jobs/route.ts` — ReelMode type + MODE_TO_TEMPLATE + toMode()
5. `app/api/media/presign/route.ts` — allowlist function
6. `app/dashboard/page.tsx` — Mode type + templateCards + modeConfig + readDashboardMode + chooseTemplateMode URL
7. `app/templates/template-name/page.tsx` — dedicated SEO page
8. `lib/seo/public-url-collector.ts` — sitemap entry
9. `components/layout/Footer.tsx` — footer link
10. Deploy: `npx vercel --prod` + `npm run reel:lambda:deploy`
