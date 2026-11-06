# YouTube Subtitle Generator (youtubeSubtitles)

## Scope

This studio creates burned-in subtitles for widescreen 16:9 YouTube videos. Its caption presets are isolated from the 9:16 Auto Caption Generator.

- Dashboard mode: youtubeSubtitleGenerator
- Style picker: SubtitleStylePicker with variant=longForm
- Credit policy: **FREE • 5 Daily Allowance (0 Credits)** (Account sign-in required)
- Output canvas: 16:9 landscape (up to 5 min / 300s)
- Long-form style keys: LONG_FORM_PRESET_ORDER in components/ui/SubtitleStylePicker.tsx
- Preview: dedicated landscape sample video and poster (PREVIEW_LONG_FORM_VIDEO_URL, PREVIEW_LONG_FORM_POSTER_URL)

## Style isolation

The long-form picker renders only keys from LONG_FORM_PRESET_ORDER. Auto Caption renders only keys from SHORTS_PRESET_ORDER; the two lists are disjoint. Long-form previews use the landscape sample video and overlay the chosen preset. They do not borrow a 9:16 Cloudinary caption demo or its transcript.

When adding a style, add it to exactly one aspect-ratio list and define its visual preset in remotion/types/subtitles.ts. Keep the preview and output preset key identical. Do not add long-form keys to the Auto Caption gallery or shorts preview catalog.

## Product behavior

Users upload a 16:9 video, choose a long-form subtitle style, transcribe the current upload, and render a widescreen subtitled output. This mode does not use Auto Caption 9:16 gallery. For current duration, billing, and pipeline limits, follow docs/ITNAVIDEO_MASTER_DOC.md and corresponding backend validation; do not infer limits from the Auto Caption spec.
