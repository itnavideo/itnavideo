# Video References (Internal Only)

This folder stores reference videos and extracted keyframes for studying professional reel editing patterns. Not deployed.

## Structure

- `shorts/` — Short-form reel references (9:16 vertical, Instagram/YouTube Shorts/TikTok)
- `long-form/` — Long video editing references (horizontal, YouTube-style)
- `keyframes/` — Auto-extracted screenshots from reference videos (via FFmpeg)

## How to use

1. Drop your reference videos into `shorts/` or `long-form/`
2. Run the keyframe extraction command (see below)
3. Review extracted frames in `keyframes/` to study patterns

## FFmpeg Keyframe Extraction

Extract 1 frame every 2 seconds from a video:
```bash
ffmpeg -i "shorts/video-name.mp4" -vf "fps=0.5" -q:v 2 "keyframes/video-name_%03d.jpg"
```

Extract only scene-change keyframes (more useful for studying transitions):
```bash
ffmpeg -i "shorts/video-name.mp4" -vf "select='gt(scene,0.3)'" -vsync vfr -q:v 2 "keyframes/video-name_scene_%03d.jpg"
```

## What to study

- **Hook frames** (first 0.5s): text size, position, animation direction
- **Transitions**: zoom, slide, cut, dissolve, wipe patterns
- **Text styles**: font weight, shadow, outline, highlight, animation
- **Layout zones**: where creator video sits, subtitle position, visual hierarchy
- **Color grading**: tint, contrast, saturation in dark vs light sections
- **Motion**: spring physics, bounce, easing curves, parallax
- **Pacing**: how many scene changes per 15s, timing rhythm
