# Itnavideo — Open Issues, Errors & Missing Features

> **Living tracker.** Only **open** items live here. When an item is fixed, **delete it from this file**.
> Keep entries specific: what's wrong, where (file + line), and the suggested fix.

---

## 🔴 Errors — Must Fix

### E1 — Typecheck not verified (shell broken)
- **Action:** Run `npm run typecheck` and fix any errors reported, then delete this entry.
- **Highest-risk files from recent changes:**
  - `remotion/templates/AI_VIDEO_GENERATOR/template.tsx` — new `calculateMetadata` block
  - `remotion/index.tsx` — `require()` inside TSX for conditional LibraryPreview
  - All 6 Remotion templates with new `BrandWatermark` + `watermark` prop
  - `app/api/reels/jobs/route.ts` — `requestedCreditUnits` now reassigned (confirm `let` not `const`)
  - 11 page clients with `FeaturePaywall` + `isFeatureLockedForUser` imports
  - All studios with `StudioStepper` import — check for missing `Check` icon import conflicts
  - `components/dashboard/CompareExplainerStudio.tsx` — now 5 steps, preview at step 5 not 4

---

## 🟠 Missing — Needs Manual Action

### M1 — Compare Explainer: stickman characters on Cloudinary, not S3
- **File:** `remotion/templates/COMPARE_EXPLAINER/template.tsx`
- **What:** All 16 stickman presenter poses are direct Cloudinary CDN URLs. If Cloudinary is slow during Lambda render, characters appear broken. All other Remotion assets are on S3.
- **Fix:** After generating new character poses (ChatGPT), upload to S3 (`remotionlambda-useast1-2zq6twaok1`) and swap URLs in the template character map.

### M2 — S3 designed SVG illustration library not populated
- **What:** `services/ai/svgLibrary.ts` and `resolveSvgFromMasterCatalog` prefer S3-hosted SVGs but no `.svg` files are uploaded/indexed. Procedural fallback renders in the meantime.
- **Fix:** Upload designed `.svg` files to S3, run `npm run assets:index`.

### M3 — Homepage demo video placeholder (upload when ready)
- **File:** `components/landing/HomepageDemoVideo.tsx`
- **Fix:** Set `DEMO_VIDEO_URL` and `DEMO_POSTER_URL` constants once you upload the video to Cloudinary.

### M4 — "How it works" tutorial video placeholder (upload when ready)
- **File:** `components/landing/HowItWorksVideo.tsx`
- **Fix:** Set `HOW_IT_WORKS_VIDEO_URL` once you record + upload the walkthrough video.

### M5 — CloudWatch alarms not configured for Lambda failures
- **Fix:** Add CloudWatch metric filter on Lambda error logs with an SNS alarm. ~$0.10/month.

### M6 — Lambda + Cloud Run not auto-updated on deploy
- **What:** After every code change, `npm run reel:lambda:deploy` must be manually re-run and the new `REMOTION_LAMBDA_FUNCTION_NAME` manually updated in Cloud Run.
- **Fix:** Add a `deploy:all` script that runs both and updates Cloud Run env vars automatically.

### M7 — S3 CORS not automated on fresh bucket
- **What:** `npm run aws:s3:cors` must be run manually after creating a new bucket. On fresh deployment, all browser uploads fail.
- **Fix:** Add to deployment checklist or call from the deploy script.

---

## 🟡 Open Decisions

### OD1 — Free trial (`free-signup-credit`) scope
- **Decision:** Should `free-signup-credit` trial users access paid features, or stay locked to only Auto Captions + YouTube Subtitles?
- **Current behavior:** Trial = locked. Change `isFreeTierUser` in `lib/billing/freeTierAccess.ts` if you want trial users to try paid features.

### OD2 — `removeAiWatermark` toggle: should it be paid-only?
- **What:** `WatermarkRemoverToggle` in `FacelessShortsStudio` and `AiShortsPolisherStudio` lets any user remove 3rd-party AI watermarks from source media. Not plan-gated.
- **Fix (if paid-only):** Add `locked` prop to `WatermarkRemoverToggle`, pass `locked={isFreeTierUser(billingEntitlement)}`.

### OD3 — Long Video Clips source duration: 2h vs 3h
- **What:** Docs say 2h. Some UI references say 3h. Confirm canonical limit and reconcile docs + jobs route constant.

### OD4 — Book Summary: YouTube chapter timestamps claimed in docs but not confirmed in code
- **File:** `docs/video-types/book-summary.md` §1 Features
- **What:** Docs claim auto-generated YouTube chapter timestamps. No corresponding service was found.
- **Fix:** Verify or remove the claim from docs.

### OD5 — `FACELESS_IMAGE_VISUALS_ENABLED` marked "temporary"
- **File:** `remotion/templates/FACELESS_SHORTS/template.tsx` line ~86
- **What:** Comment says "Temporary editorial setting." Value is `true`. Remove the "Temporary" comment if permanent.

### OD6 — Compare Explainer composition ID `comparisonImages` vs other UPPER-CASE-HYPHEN IDs
- **What:** Naming inconsistency. All compositions use `UPPER-CASE-HYPHEN`. Compare uses `comparisonImages`. Works but confusing.
- **Fix:** Migrate to `COMPARE-EXPLAINER` composition ID or document exception.

### OD7 — Compare Explainer now has 5 steps — step content (Subjects, Character) not yet separated
- **What:** `COMPARE_STEPS` was updated to 5 entries but the studio JSX still shows all subject/character content inside the original Step 1 and Step 3. Step 2 (Subjects) and Step 4 (Character) are new step numbers with no dedicated content blocks yet.
- **Fix:** Add `{currentStep === 2 && ...}` and `{currentStep === 4 && ...}` content blocks in `CompareExplainerStudio.tsx`, moving the subjects upload and character picker into their own steps.

### OD8 — LongVideoClips now has 3 steps — Step 2 "Settings" needs content split from Step 1
- **What:** `CLIPS_STEPS` was updated to 3 entries but content that was at Step 2 (Music) and Step 3 (Style) in the old 4-step flow is not yet reorganized into the new Step 2 "Settings" and Step 3 "Preview".
- **Fix:** Reorganize `LongVideoClipsStudio.tsx` step content to match new 3-step structure.

### OD9 — YouTubeSubtitles now 3 steps — Step 2 "Style" combines Music + Subtitle settings
- **What:** Step 2 now shows subtitle style + BGM picker combined (was separate steps). UX should confirm this combination works or split into 3-step like before but without the "Music" label.
- **Fix:** Review Step 2 content in `YoutubeSubtitlesStudio.tsx` and ensure the Music picker + Subtitle picker are both accessible in one clean step.
