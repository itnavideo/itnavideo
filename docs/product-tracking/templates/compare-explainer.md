# Compare Explainer

## What this template does
Creates a left-vs-right comparison reel from a voiceover and two images, with captions and a sticker presenter explaining each side.

## User Inputs
- Audio voiceover
- Left comparison image and right comparison image
- Left title, right title, creator handle
- Sticker character/style selection

## Main Features
- Split comparison layout for two items
- Caption timing from transcript
- Sticker pose selection based on scene intent
- Descriptive sticker pose names for left-side, right-side, questioning, warning, success, and conclusion moments

## Current Problems
- Sticker pose variety needs continued visual QA so the same pose is not repeated too often.
- Image crop/fit can still feel awkward if uploaded product screenshots have unusual aspect ratios.

## Possible Future Problems
- If pose metadata becomes ambiguous again, AI/planner may choose generic poses instead of correct left/right explainer poses.
- Very long left/right titles can crowd the top layout.

## Improvements Done
- 2026-06-28: Sticker pose names were improved to descriptive names like `sticker_pointing_left_side_explainer`.
- 2026-06-28: Planner instructions were updated so left-side content uses left-side poses and right-side content uses right-side poses.
- 2026-06-28: Dashboard now requires exactly two comparison images and supports remove/replace for wrong uploads.

## Improvements Pending
- Add visual QA clips comparing reference videos against generated pose switching.
- Add image crop/position controls inside preview editor.
- Add stronger title overflow checks for long item names.

## QA Checklist
- Preview working:
- Final render working:
- Download working:
- Mobile UI working:
- 15s tested:
- 30s tested:
- 60s tested:
