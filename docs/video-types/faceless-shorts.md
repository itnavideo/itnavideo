# Faceless AI Shorts Generator (Story-First Visual Intelligence)

**ID**: `FACELESS_SHORTS`
**Aspect Ratio**: 9:16 Vertical
**Max Duration**: Up to 90 Seconds
**Credit Cost**: 1 Credit per video

## Overview
The Faceless AI Shorts Generator automates the creation of vertical, high-retention short videos. Unlike standard video templates that simply place stock footage behind captions, this system uses a "Story-First" AI approach. Every visual element (charts, SVGs, animated vector concepts, split screens) is chosen dynamically based on the exact meaning of the narration.

## Pipeline Architecture
1. **Intelligent Scene Planner (`services/ai/aiScenePlanner.ts`)**: Instead of basic background matching, the planner acts as an editorial director. It determines whether a sentence needs a full-bleed visual, an animated stat card, a data visualization chart, a vector concept, or a split screen.
2. **Strictly 9:16 Decoupled Backend (`app/api/reels/jobs/route.ts`)**: `facelessShorts` is decoupled from the 16:9 `facelessVideo` pipeline. It enforces `targetAspectRatio: '9:16'` and triggers vertical-optimized layout logic.
3. **Dedicated Remotion Composition (`remotion/templates/FACELESS_SHORTS/template.tsx`)**: Re-built from the ground up to render specifically at `1080x1920`. It leverages `CanvasGraphicsLayer` to render the smart AI visual decisions (SVG rendering, motion graphics, professional typography) correctly inside the vertical safe-zones.
4. **Dashboard & SEO Pages**: A fully dedicated `/faceless-shorts` SEO landing page (>500 words) and an isolated `FacelessShortsStudio.tsx` interface.

## Core Rules & Constraints
- **Story-First Only**: Every visual element must have a purpose. Do not add arbitrary visual variety. Use charts for numbers, vector SVGs for concepts.
- **Strict Separation**: Do NOT mix or share the `FacelessVideo` (16:9) template logic. `FACELESS_SHORTS` is strictly 9:16.
- **Zero Local Heavy Compute**: Renders execute exclusively on the AWS Lambda cluster.
