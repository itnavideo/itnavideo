# Auto Captions

## What this template does
Adds clean, word-level animated captions to the user's uploaded video without changing the original video content.

## User Inputs
- Video with speech
- Caption style, font, size, position, and colors
- Subtitle output language: English or Hinglish

## Main Features
- Groq Whisper transcription with timed captions
- Professional caption presets such as Studio Clean and Karaoke Fill
- User-selected caption colors, font, size, and position pass into render
- Preview-first flow supported for caption review before final render

## Current Problems
- Needs visual QA after every caption style change because readability depends on the uploaded video.
- Preview/final parity must be watched carefully when users edit captions in preview.

## Possible Future Problems
- Long words or brand names can overflow if a new style does not clamp text correctly.
- Noisy audio can cause wrong transcription and make users waste time fixing captions.

## Improvements Done
- 2026-06-28: Auto Caption dashboard was cleaned to remove unrelated layout, progress bar, and sound FX controls.
- 2026-06-28: Caption preset selection now applies text, highlight, background, font, and size defaults.
- 2026-06-28: Dashboard upload remove/replace UX was added for wrong uploads.

## Improvements Pending
- Add stronger automated visual tests for all caption styles.
- Add clearer transcript correction UI inside the universal preview editor.
- Test 15s, 30s, and 60s clips with bright, dark, and busy backgrounds.

## QA Checklist
- Preview working:
- Final render working:
- Download working:
- Mobile UI working:
- 15s tested:
- 30s tested:
- 60s tested:
