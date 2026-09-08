# Whiteboard Video — Requirements

## Overview

A new video type where the user uploads audio/video with speech, and the AI converts it into a **whiteboard-style explainer reel** — points appear on a whiteboard as if someone is writing them with markers. Professional corporate background visible behind the whiteboard.

---

## Core Requirements

### R1: Input
- User uploads: Audio file (MP3/WAV/M4A) OR video file (MP4/MOV)
- Groq transcribes the speech → returns transcript with word-level timestamps
- AI breaks transcript into 5-8 key points/steps

### R2: Output
- 9:16 vertical MP4 (1080x1920)
- Duration: matches source audio (up to 60 seconds)
- Whiteboard in the center with handwritten-style text appearing progressively
- Professional corporate office/studio background behind the whiteboard
- Marker-style text (colored, handwritten font)
- Each point appears with a "writing" animation (draws in from left to right)

### R3: Visual Design (V1 — Single Style)
- **Background**: Dark professional corporate (blurred office, gradient, or studio)
- **Whiteboard**: Clean white board with subtle shadow, slight 3D perspective tilt
- **Text**: Handwritten font (marker feel), colored markers (blue, red, green, black)
- **Title**: Top of whiteboard, larger text, underlined
- **Points**: Bullet points or numbered list, each appearing one by one
- **Icons/doodles**: Simple drawn icons (arrows, checkmarks, circles, stars) next to points
- **Marker traces**: Subtle color accents on important words

### R4: Animation Style
- Title appears first (0-3 seconds)
- Each point "writes in" progressively synced to speech timing
- Points don't all appear at once — they appear when the speaker talks about them
- Completed points stay visible
- Smooth fade between scenes if too many points for one whiteboard frame

### R5: AI Scene Planner
- Takes full transcript + timestamps
- Extracts 5-8 key points from the speech
- Assigns timing to each point (when it should appear based on speech)
- Decides marker color for each point
- Identifies the title/heading from the first sentence

### R6: Dashboard Integration
- New card in dashboard: "Whiteboard Video"
- Upload: audio or video file
- No extra options needed for V1 (style is fixed)
- Future: whiteboard style picker (10 styles)

### R7: No External Dependencies
- No real whiteboard image needed — fully rendered in Remotion with CSS/SVG
- Handwritten font loaded from Google Fonts (Kalam, Caveat, or Patrick Hand)
- Icons are simple SVG paths drawn in code

---

## Non-Requirements (V1)
- Multiple whiteboard styles (future)
- User choosing marker colors (future)
- User uploading their own whiteboard background (future)
- Real hand/arm drawing animation (too complex for V1)
- Diagrams/flowcharts (future)

---

## Success Criteria
1. User uploads 30-60s audio → gets a whiteboard reel with 5-8 points clearly written
2. Text appears timed to speech (not all at once)
3. Looks professional — could be used for LinkedIn, educational Reels, business Shorts
4. Renders in under 5 minutes on Lambda
