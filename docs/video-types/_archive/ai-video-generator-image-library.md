# AI Video Generator — Curated Cloudinary Image Library & AI Matcher

## Overview

The **AI Video Generator** creates long-form videos by analyzing narration and blueprints into structured scenes. 

Instead of relying on third-party stock APIs (Pixabay, Pexels, Google Images) which can have rate limits, watermarks, and inconsistent aesthetics, Itnavideo uses a **curated library of ChatGPT / DALL-E generated images** hosted in your Cloudinary account.

Whenever a video is rendered, the **AI Scene Matcher** automatically analyzes each scene's narration, heading, and visual requirement, selecting the most contextually relevant image from your library.

---

## Architecture

```
[ChatGPT / DALL-E 3] 
       │ (High quality custom visual generation)
       ▼
[Cloudinary Folder]
       │ (Upload image to your Cloudinary folder)
       ▼
[lib/cloudinary/ai-video-library.json]
       │ (Add image metadata: URL, tags, category, description)
       ▼
[services/ai/aiImageLibraryMatcher.ts]
       │ (AI reads scene blueprint & selects best image)
       ▼
[Remotion Engine]
       (Renders video with Ken Burns pan/zoom documentary motion)
```

---

## 1. Image Library JSON Location

The central database is stored at:
```
lib/cloudinary/ai-video-library.json
```

---

## 2. Image Record Schema

Each image entry in the JSON array follows this structure:

```json
{
  "id": "ai_img_tech_001",
  "public_id": "ai-video-library/futuristic_ai_workspace",
  "url": "https://res.cloudinary.com/dhouh9idx/image/upload/v1788190063/file_0000000089c48211b67c16fe3c2636a2_prirg0.png",
  "title": "Futuristic AI Creator Studio & Holographic Workstation",
  "category": "technology",
  "tags": [
    "artificial intelligence",
    "ai",
    "coding",
    "developer",
    "workspace",
    "futuristic",
    "studio",
    "hologram",
    "technology",
    "software"
  ],
  "visualDescription": "A sleek modern creator studio desk with glowing holographic monitors showing code, AI neural graphs, and analytics in a cyberpunk ambient room",
  "mood": "futuristic",
  "aspectRatio": "16:9",
  "dominantColor": "#38BDF8"
}
```

### Field Descriptions

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | `string` | **Yes** | Unique identifier (e.g. `ai_img_fin_005`). |
| `public_id` | `string` | **Yes** | Cloudinary public ID / folder path. |
| `url` | `string` | **Yes** | Cloudinary secure delivery URL (`https://...`). |
| `title` | `string` | **Yes** | Human-readable title of the image. |
| `category` | `string` | **Yes** | Primary category: `technology`, `business`, `finance`, `crypto`, `productivity`, `media`, `science`, `lifestyle`. |
| `tags` | `string[]` | **Yes** | At least 3–10 keywords describing subjects, objects, concepts. |
| `visualDescription`| `string` | Optional | What is depicted in the image (or ChatGPT prompt). |
| `mood` | `string` | Optional | `cinematic`, `futuristic`, `calm`, `optimistic`, `corporate`, etc. |
| `aspectRatio` | `string` | **Yes** | `'16:9'` for YouTube widescreen or `'9:16'` for vertical Reels/Shorts. |
| `dominantColor` | `string` | Optional | Hex accent color (e.g. `#10B981`). |

---

## 3. How to Add New ChatGPT Images (Step-by-Step)

1. **Generate Image in ChatGPT**:
   - Ask ChatGPT/DALL-E: *"Create a 16:9 cinematic illustration of a high-tech robotic laboratory with neon blue accent lighting, highly detailed, photorealistic, 4K."*
2. **Upload to Cloudinary**:
   - Upload the downloaded PNG/JPG to your Cloudinary folder (e.g., `ai-video-library`).
   - Copy the Cloudinary `secure_url`.
3. **Add Entry to `ai-video-library.json`**:
   - Append a new JSON object to the array in `lib/cloudinary/ai-video-library.json`.
4. **Validate Your Library**:
   ```bash
   npm run images:validate
   ```
   This will verify that there are no syntax errors, no duplicate IDs, and that all required fields are filled.

---

## 4. How the AI Scene Matcher Works

When rendering an **AI Video Generator** job:
1. The planner analyzes the transcript/script and builds scenes.
2. For each scene, `planImagesFromLibraryForScenes()` extracts:
   - `visualIntent` (e.g. "quantum computing lab particle physics")
   - `visualAssetRequirement`
   - `highlightedWords`
   - `heading`
   - `narrationSegment.text`
3. **Scoring**:
   - Matches keywords against image `tags` (+10 points per matched tag).
   - Matches keywords against `title` (+5 points) and `visualDescription` (+3 points).
   - Boosts target `aspectRatio` (+8 points).
4. **Anti-Repetition Engine**:
   - Penalizes images used in the immediately preceding scene (-30 points) and penalizes frequently reused images (-6 points per total usage).
   - Ensures maximum visual variety across the long video.
5. **Remotion Motion**:
   - High-definition images are rendered with smooth Ken Burns pan-and-scan animations (`ImageTextScene.tsx` and `SplitScreenLayout.tsx`), ensuring dynamic documentary movement.
